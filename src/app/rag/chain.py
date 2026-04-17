import json
from collections.abc import AsyncGenerator

from langchain.agents import create_agent
from langchain_core.messages import AIMessage, AIMessageChunk, BaseMessage, HumanMessage, ToolMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langchain_qdrant import QdrantVectorStore

from app.core.config import settings
from app.ingestion.vector_store import get_embeddings, get_qdrant_client
from app.rag.cta import maybe_cta
from app.rag.guardrail import GuardrailMiddleware
from app.rag.prompts import AGENT_SYSTEM_PROMPT


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


@tool(response_format="content_and_artifact")
def search_knowledge_base(query: str) -> tuple[str, dict]:
    """Search the Neuronetis knowledge base for information about the studio's
    services, process, projects, team, pricing, and FAQ. Call this for any
    factual question about Neuronetis. Rephrase follow-up questions into a
    standalone query using the conversation history before calling."""
    retriever = get_retriever()
    docs = retriever.invoke(query)
    content = _format_docs(docs)
    topics = [d.metadata.get("topic", "") for d in docs if d.metadata.get("topic")]
    return content, {"topics": topics}


def build_agent():
    """Build a LangChain agent with knowledge-base search tool and guardrail middleware."""
    llm = ChatOpenAI(
        model=settings.OPENAI_CHAT_MODEL,
        api_key=settings.OPENAI_API_KEY,
        streaming=True,
    )
    return create_agent(
        model=llm,
        tools=[search_knowledge_base],
        system_prompt=AGENT_SYSTEM_PROMPT,
        middleware=[GuardrailMiddleware()],
    )


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
    agent,
    question: str,
    chat_history: list[BaseMessage],
) -> AsyncGenerator[str, None]:
    """Stream agent response as JSON SSE events.

    Emits:
      - {type: "tool_call", tool, query} when the agent invokes a tool
      - {type: "token", token, done: false} for AI message chunks
      - {type: "done", cta} final event
    """
    messages = list(chat_history) + [HumanMessage(content=question)]
    topics: set[str] = set()
    emitted_tool_calls: set[str] = set()

    async for mode, data in agent.astream(
        {"messages": messages}, stream_mode=["messages", "updates"]
    ):
        if mode == "messages":
            chunk, _metadata = data
            if isinstance(chunk, AIMessageChunk):
                token = chunk.content if isinstance(chunk.content, str) else ""
                if token:
                    yield _sse({"type": "token", "token": token, "done": False})
        elif mode == "updates":
            for _node, update in data.items():
                for msg in update.get("messages", []) if isinstance(update, dict) else []:
                    if isinstance(msg, AIMessage):
                        for tc in msg.tool_calls or []:
                            if tc["id"] in emitted_tool_calls:
                                continue
                            emitted_tool_calls.add(tc["id"])
                            yield _sse({
                                "type": "tool_call",
                                "tool": tc["name"],
                                "query": tc["args"].get("query", ""),
                            })
                    elif isinstance(msg, ToolMessage):
                        artifact = getattr(msg, "artifact", None)
                        if isinstance(artifact, dict):
                            topics.update(artifact.get("topics", []))

    cta = maybe_cta(list(topics))
    yield _sse({"type": "done", "cta": cta})


def _sse(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"
