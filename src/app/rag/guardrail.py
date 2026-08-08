from typing import Any, Literal, NotRequired

from langchain.agents.middleware import AgentMiddleware, AgentState
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI
from langgraph.graph import END
from langgraph.types import Command

from app.core.config import settings
from app.rag.prompts import GUARDRAIL_PROMPT

IDEAS_TOOL_NAME = "generate_project_ideas"

REJECTION_MESSAGE = (
    "I'm sorry, but as Neuronetis AI assistant, I can only answer questions "
    "about Neuronetis — our services, process, projects, and how AI can help "
    "your business. Feel free to ask about any of these!"
)


Verdict = Literal["BUSINESS", "ON_TOPIC", "OFF_TOPIC"]


CONTEXT_WINDOW = 6  # ~3 exchanges


def _transcript(messages: list) -> str:
    """The last few exchanges, oldest first, as `Role: content` lines.

    The classifier needs this context to tell a genuinely new business
    description from the user adding detail to ideas already generated.
    """
    recent = [m for m in messages if isinstance(m, HumanMessage | AIMessage) and str(m.content).strip()][
        -CONTEXT_WINDOW:
    ]
    return "\n".join(f"{'User' if isinstance(m, HumanMessage) else 'Assistant'}: {m.content}" for m in recent)


def classify_turn(messages: list) -> Verdict:
    """Classify the latest user turn as a business description, an on-topic
    question, or off-topic."""
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        api_key=settings.OPENAI_API_KEY,
        temperature=0,
        streaming=False,
    ).with_config(tags=["guardrail"])
    chain = GUARDRAIL_PROMPT | llm | StrOutputParser()
    result = chain.invoke({"input": _transcript(messages)})
    verdict = result.strip().upper()
    return verdict if verdict in ("BUSINESS", "ON_TOPIC", "OFF_TOPIC") else "OFF_TOPIC"


class GuardrailState(AgentState):
    """Agent state plus the verdict for the current user turn."""

    guardrail_verdict: NotRequired[Verdict]


class GuardrailMiddleware(AgentMiddleware):
    """Classifies each user turn and routes it.

    `OFF_TOPIC` short-circuits the graph with an AIMessage carrying the canned
    REJECTION_MESSAGE. `BUSINESS` records the verdict in state so
    `awrap_model_call` can force the ideas tool. `ON_TOPIC` passes through.
    Classification is skipped mid tool-loop, where the last message is a
    ToolMessage rather than a Human one.
    """

    state_schema = GuardrailState

    def before_model(self, state: dict, runtime: Any) -> dict | Command | None:
        messages = state.get("messages", [])
        # Only classify the latest human turn, not intermediate tool loops
        if not messages or not isinstance(messages[-1], HumanMessage):
            return None
        verdict = classify_turn(messages)
        if verdict == "OFF_TOPIC":
            return Command(
                goto=END,
                update={"messages": [AIMessage(content=REJECTION_MESSAGE)]},
            )
        return {"guardrail_verdict": verdict}

    async def awrap_model_call(self, request, handler):
        """Force the ideas tool on a BUSINESS turn's first model call.

        Gated on the last message still being Human: once the tool has run, a
        ToolMessage is last and the model must be free to write the intro text
        instead of calling the tool again.
        """
        messages = request.state.get("messages", [])
        is_first_call = bool(messages) and isinstance(messages[-1], HumanMessage)
        if request.state.get("guardrail_verdict") == "BUSINESS" and is_first_call:
            return await handler(request.override(tool_choice=IDEAS_TOOL_NAME))
        return await handler(request)
