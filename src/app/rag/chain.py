import json
from collections.abc import AsyncGenerator

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import Runnable, RunnablePassthrough
from langchain_openai import ChatOpenAI
from langchain_qdrant import QdrantVectorStore

from app.core.config import settings
from app.ingestion.vector_store import get_embeddings, get_qdrant_client
from app.rag.cta import maybe_cta
from app.rag.guardrail import REJECTION_MESSAGE, classify_query
from app.rag.prompts import QA_PROMPT, REPHRASE_PROMPT


def get_retriever():
    """Create a Qdrant-backed retriever with k=4."""
    client = get_qdrant_client()
    embeddings = get_embeddings()
    vector_store = QdrantVectorStore(
        client=client,
        collection_name=settings.QDRANT_COLLECTION,
        embedding=embeddings,
    )
    return vector_store.as_retriever(search_kwargs={"k": 4})


def _format_docs(docs) -> str:
    return "\n\n".join(doc.page_content for doc in docs)


def build_chain() -> Runnable:
    """Build a RAG chain with history-aware rephrasing using LCEL."""
    retriever = get_retriever()
    llm = ChatOpenAI(
        model=settings.OPENAI_CHAT_MODEL,
        api_key=settings.OPENAI_API_KEY,
        streaming=True,
    )

    # Step 1: Rephrase follow-up questions into standalone queries
    rephrase_chain = REPHRASE_PROMPT | llm | StrOutputParser()

    # Step 2: Retrieve docs using rephrased query
    def retrieve_with_history(inputs: dict):
        chat_history = inputs.get("chat_history", [])
        question = inputs["input"]
        if chat_history:
            standalone = rephrase_chain.invoke(
                {"input": question, "chat_history": chat_history}
            )
        else:
            standalone = question
        docs = retriever.invoke(standalone)
        return {
            "context": _format_docs(docs),
            "context_docs": docs,
            "input": question,
            "chat_history": chat_history,
        }

    # Step 3: Full chain — retrieve then answer
    chain = RunnablePassthrough.assign(
        **{k: lambda x, k=k: retrieve_with_history(x)[k]
           for k in ("context", "context_docs")}
    ) | RunnablePassthrough.assign(
        answer=QA_PROMPT | llm | StrOutputParser()
    )

    return chain


def messages_from_dicts(messages: list[dict]) -> list[BaseMessage]:
    """Convert DB message dicts to LangChain message objects."""
    result: list[BaseMessage] = []
    for msg in messages:
        if msg["role"] == "user":
            result.append(HumanMessage(content=msg["content"]))
        elif msg["role"] == "assistant":
            result.append(AIMessage(content=msg["content"]))
    return result


async def stream_response(
    chain,
    question: str,
    chat_history: list[BaseMessage],
) -> AsyncGenerator[str, None]:
    """Stream chain response as JSON SSE events."""
    if not classify_query(question):
        yield f"data: {json.dumps({'token': REJECTION_MESSAGE, 'done': True, 'sources': [], 'cta': None})}\n\n"
        return

    full_answer = ""
    sources: list[dict] = []
    topics: set[str] = set()

    async for chunk in chain.astream(
        {"input": question, "chat_history": chat_history}
    ):
        if "answer" in chunk:
            token = chunk["answer"]
            full_answer += token
            yield f"data: {json.dumps({'token': token, 'done': False})}\n\n"
        if "context_docs" in chunk:
            for doc in chunk["context_docs"]:
                meta = doc.metadata
                topics.add(meta.get("topic", ""))
                source_entry = {
                    "source": meta.get("source", ""),
                    "header": meta.get("header", ""),
                }
                if source_entry not in sources:
                    sources.append(source_entry)

    cta = maybe_cta(list(topics))
    yield f"data: {json.dumps({'token': '', 'done': True, 'sources': sources, 'cta': cta})}\n\n"
