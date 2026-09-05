from typing import Any, Literal

from langchain.agents.middleware import AgentMiddleware, hook_config
from langchain_core.messages import AIMessage, HumanMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

from app.core.config import settings
from app.rag.prompts import GUARDRAIL_PROMPT

REJECTION_MESSAGE = (
    "I'm sorry, but as Neuronetis AI assistant, I can only answer questions "
    "about Neuronetis — our services, process, projects, and how AI can help "
    "your business. Feel free to ask about any of these!"
)


Verdict = Literal["ON_TOPIC", "OFF_TOPIC"]


class TurnClassification(BaseModel):
    verdict: Verdict


CONTEXT_WINDOW = 6  # Latest user message plus recent history (~3 exchanges).


def _transcript(messages: list) -> str:
    """The last few exchanges, oldest first, as `Role: content` lines.

    The classifier needs this context to tell a genuinely new business
    description from the user adding detail to ideas already generated.
    """
    recent = [m for m in messages if isinstance(m, HumanMessage | AIMessage) and str(m.content).strip()][
        -(CONTEXT_WINDOW - 1):
    ]
    return "\n".join(f"{'User' if isinstance(m, HumanMessage) else 'Assistant'}: {m.content}" for m in recent)


def classify_turn(messages: list) -> TurnClassification:
    """Gate the latest turn: is it on-topic for Neuronetis, or off-topic?"""
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        api_key=settings.OPENAI_API_KEY,
        temperature=0,
        streaming=False,
    ).with_structured_output(TurnClassification, method="json_schema", strict=True).with_config(tags=["guardrail"])
    return (GUARDRAIL_PROMPT | llm).invoke({
        "history": _transcript(messages[:-1]) or "No earlier conversation.",
        "input": messages[-1].content,
    })


class GuardrailMiddleware(AgentMiddleware):
    """Gate each user turn: off-topic messages are rejected before the agent runs.

    On-topic turns — an agency question, a business description, or a follow-up on
    either — pass straight through. The agent's own tools decide what context to
    fetch (agency facts, project files) and whether to generate ideas.
    `OFF_TOPIC` short-circuits the graph with an AIMessage carrying the canned
    REJECTION_MESSAGE. Classification is skipped mid tool-loop, where the last
    message is a ToolMessage rather than a Human one.
    """

    @hook_config(can_jump_to=["end"])
    def before_model(self, state: dict, runtime: Any) -> dict | None:
        messages = state.get("messages", [])
        # Only classify the latest human turn, not intermediate tool loops
        if not messages or not isinstance(messages[-1], HumanMessage):
            return None
        if classify_turn(messages).verdict == "OFF_TOPIC":
            return {
                "messages": [AIMessage(content=REJECTION_MESSAGE)],
                "jump_to": "end",
            }
        return None
