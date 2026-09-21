from functools import cache
from typing import Any, Literal

from langchain.agents.middleware import AgentMiddleware, hook_config
from langchain_core.messages import AIMessage, HumanMessage
from pydantic import BaseModel
from typesafe_sdk import Noul, TypeSafeClient

from app.core.config import settings

REJECTION_MESSAGE = (
    "I'm sorry, but as Neuronetis AI assistant, I can only answer questions "
    "about Neuronetis — our services, process, projects, and how AI can help "
    "your business. Feel free to ask about any of these!"
)


Verdict = Literal["ON_TOPIC", "OFF_TOPIC"]


class TurnClassification(BaseModel):
    verdict: Verdict
    signals: dict[str, float]


CONTEXT_WINDOW = 6  # Latest user message plus recent history (~3 exchanges).

# A turn is on-topic if ANY signal fires; each noul is the probability that its
# statement holds. Calibrated on the labelled cases in tests/test_guardrail_live.py:
# off-topic turns top out at 0.27, the weakest on-topic turn scores 0.46, so this
# sits mid-gap. Re-sweep against real traffic before moving it.
ON_TOPIC_THRESHOLD = 0.35

QUESTIONS = {
    "about_agency": Noul(
        instructions=(
            "The latest user message asks about Neuronetis — its services, capabilities, "
            "pricing, process, team, projects, or what working with the agency is like. "
            "'You' and 'your' refer to Neuronetis; misspellings such as 'neuronets' count."
        )
    ),
    "about_own_business": Noul(
        instructions=(
            "The latest user message describes the user's own business, company, product, "
            "project, industry, or a business problem they might want AI help with."
        )
    ),
    "is_followup": Noul(
        instructions=(
            "The latest user message refines, discusses, or asks about something already "
            "raised in the earlier conversation, such as a project idea already suggested. "
            "False when there is no earlier conversation."
        )
    ),
}


def _transcript(messages: list) -> str:
    """The last few exchanges, oldest first, as `Role: content` lines.

    The classifier needs this context to tell a genuinely new business
    description from the user adding detail to ideas already generated.
    """
    recent = [m for m in messages if isinstance(m, HumanMessage | AIMessage) and str(m.content).strip()][
        -(CONTEXT_WINDOW - 1):
    ]
    return "\n".join(f"{'User' if isinstance(m, HumanMessage) else 'Assistant'}: {m.content}" for m in recent)


@cache
def _client() -> TypeSafeClient:
    """One pooled client for the process; built on first use, not at import."""
    return TypeSafeClient(api_key=settings.TYPESAFE_API_KEY, model=settings.TYPESAFE_MODEL)


def classify_turn(messages: list) -> TurnClassification:
    """Gate the latest turn: is it on-topic for Neuronetis, or off-topic?

    One Jev request asks three atomic nouls in parallel; the routing decision is
    composed here rather than delegated to the model, so the threshold is ours.
    """
    response = _client().system_one(
        state={
            "earlier_conversation": _transcript(messages[:-1]) or "No earlier conversation.",
            "latest_user_message": str(messages[-1].content),
        },
        questions=QUESTIONS,
    )
    signals = {name: response.nouls[name].noul for name in QUESTIONS}
    verdict: Verdict = "ON_TOPIC" if max(signals.values()) >= ON_TOPIC_THRESHOLD else "OFF_TOPIC"
    return TurnClassification(verdict=verdict, signals=signals)


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
