import json
from collections.abc import AsyncGenerator

from langchain.agents import create_agent
from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, ToolMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI

from app.core.config import settings
from app.data.followup_pool import resolve_picks
from app.rag.agency_context import AGENCY_CONTEXT
from app.rag.followups import pick_followups
from app.rag.guardrail import GuardrailMiddleware
from app.rag.ideas import generate_ideas_payload
from app.rag.prompts import AGENT_SYSTEM_PROMPT
from app.vault.loader import load_index, read_notes

IDEAS_MODE_FOLLOWUPS = ["services_pricing", "process_overview", "about_neuronetis"]

# Follow-up suggestion chips are switched off while company info lives on the
# marketing pages rather than in chat. Flip to True to restore them; the picker
# and the pool below are unchanged.
FOLLOWUPS_ENABLED = False


@tool
def get_agency_info() -> str:
    """Return Neuronetis agency facts: services, pricing, payment terms, process,
    team, location, technology stack, and FAQ. Call this to answer any factual
    question about Neuronetis or what working with us is like."""
    return AGENCY_CONTEXT


@tool
def read_knowledge_base(names: list[str]) -> str:
    """Read complete Neuronetis project files by name (e.g.
    ['projects/01-rag-knowledge-assistant']). The Project Index in your system
    prompt lists the available projects and when to read each. Only project
    files can be retrieved; general agency facts are supplied in the system prompt."""
    return read_notes(names)


@tool(response_format="content_and_artifact")
def generate_project_ideas(description: str) -> tuple[str, dict]:
    """Generate 2-3 tailored AI project ideas when the user describes their
    company, project, industry, or a problem they want AI to help solve.
    Pass the user's description verbatim.

    Returns ideas with rough scope, tech, price, and time; the frontend
    renders them as cards."""
    payload = generate_ideas_payload(description)
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
        tools=[get_agency_info, read_knowledge_base, generate_project_ideas],
        system_prompt=AGENT_SYSTEM_PROMPT.replace("{index}", load_index()),
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
            if isinstance(chunk, AIMessage):
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
                            names = tc["args"].get("names")
                            query = (
                                ", ".join(names)
                                if isinstance(names, list)
                                else tc["args"].get("description", "")
                            )
                            yield _sse({
                                "type": "tool_call",
                                "tool": tc["name"],
                                "query": query,
                            })
                    elif isinstance(msg, ToolMessage):
                        artifact = getattr(msg, "artifact", None)
                        if isinstance(artifact, dict):
                            ideas = artifact.get("ideas")
                            if ideas:
                                had_ideas = True
                                yield _sse({"type": "ideas", "ideas": ideas})

    if not FOLLOWUPS_ENABLED:
        followups: list[dict] = []
    elif had_ideas:
        followups = resolve_picks(IDEAS_MODE_FOLLOWUPS)
    else:
        followups = await pick_followups(question, full_answer)
    yield _sse({"type": "done", "followups": followups})


def _sse(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"
