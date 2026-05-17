import json
from collections.abc import AsyncGenerator

from langchain.agents import create_agent
from langchain_core.messages import AIMessage, AIMessageChunk, BaseMessage, HumanMessage, ToolMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langchain_qdrant import QdrantVectorStore

from app.core.config import settings
from app.ingestion.vector_store import get_embeddings, get_qdrant_client
from app.data.followup_pool import resolve_picks
from app.rag.followups import pick_followups

IDEAS_MODE_FOLLOWUPS = ["services_pricing", "process_overview", "about_neuronetis"]
from app.rag.guardrail import GuardrailMiddleware
from app.rag.ideas import generate_ideas_payload
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


@tool
def search_knowledge_base(query: str) -> str:
    """Search the Neuronetis knowledge base for information about the studio's
    services, process, projects, team, pricing, and FAQ. Call this for any
    factual question about Neuronetis. Rephrase follow-up questions into a
    standalone query using the conversation history before calling."""
    retriever = get_retriever()
    docs = retriever.invoke(query)
    return _format_docs(docs)


@tool(response_format="content_and_artifact")
def generate_project_ideas(
    description: str,
    industry: str | None = None,
    service_type: str | None = None,
) -> tuple[str, dict]:
    """Generate 3–5 tailored AI project ideas when the user describes their
    company, project, industry, or a problem they want AI to help solve.
    Pass the user's description verbatim.

    When you can infer the user's industry from the conversation, pass it as
    `industry` (one of: 'fintech', 'devtools', 'marketing_sales',
    'data_analytics'). Only pass `service_type` ('audit' | 'integration' |
    'custom_app') when the user is explicit about which engagement type they
    want; otherwise omit it.

    Returns ideas with rough scope, tech, price, and time; the frontend
    renders them as cards."""
    payload = generate_ideas_payload(description, industry=industry, service_type=service_type)
    ideas = [idea.model_dump() for idea in payload.ideas]
    titles = ", ".join(i["title"] for i in ideas)
    content = f"Generated {len(ideas)} tailored AI project ideas: {titles}."
    return content, {"ideas": ideas}


def build_agent():
    """Build a LangChain agent with knowledge-base search tool and guardrail middleware."""
    llm = ChatOpenAI(
        model=settings.OPENAI_CHAT_MODEL,
        api_key=settings.OPENAI_API_KEY,
        streaming=True,
    )
    return create_agent(
        model=llm,
        tools=[search_knowledge_base, generate_project_ideas],
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
      - {type: "ideas", ideas} when generate_project_ideas tool ran
      - {type: "done", followups} final event
    """
    messages = list(chat_history) + [HumanMessage(content=question)]
    emitted_tool_calls: set[str] = set()
    had_ideas = False
    full_answer = ""

    async for mode, data in agent.astream(
        {"messages": messages}, stream_mode=["messages", "updates"]
    ):
        if mode == "messages":
            chunk, metadata = data
            tags = metadata.get("tags") or []
            if "guardrail" in tags or "ideas" in tags:
                continue
            if isinstance(chunk, AIMessageChunk):
                token = chunk.content if isinstance(chunk.content, str) else ""
                if token:
                    full_answer += token
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
                            ideas = artifact.get("ideas")
                            if ideas:
                                had_ideas = True
                                yield _sse({"type": "ideas", "ideas": ideas})

    followups = (
        resolve_picks(IDEAS_MODE_FOLLOWUPS)
        if had_ideas
        else await pick_followups(question, full_answer)
    )
    yield _sse({"type": "done", "followups": followups})


def _sse(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"
