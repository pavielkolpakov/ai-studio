from functools import cache
from typing import Any, Literal

from langchain.agents.middleware import AgentMiddleware, hook_config
from langchain_core.messages import AIMessage, HumanMessage
from pydantic import BaseModel
from typesafe_sdk import Noul, TypeSafeClient

from app.core.config import settings
from app.vault.loader import project_notes

REJECTION_MESSAGE = (
    "I'm sorry, but as Neuronetis AI assistant, I can only answer questions "
    "about Neuronetis — our services, process, projects, and how AI can help "
    "your business. Feel free to ask about any of these!"
)


Verdict = Literal["ON_TOPIC", "OFF_TOPIC"]


class TurnClassification(BaseModel):
    verdict: Verdict
    signals: dict[str, float]
    routing: dict[str, float]

    def tool_calls(self, description: str) -> list[dict]:
        """The tool calls this turn asks for, as LangChain tool_call dicts.

        `description` is the user's recent turns, not just the latest message —
        see `_user_context`. Signals are independent, so a message that both
        describes a business and asks an agency question yields both calls. Ids
        are derived from the tool name — one call per tool per turn, and
        `stream_response` dedups on id.
        """
        wanted: list[tuple[str, dict]] = []
        if self.routing.get("wants_agency_info", 0.0) >= ROUTE_THRESHOLD:
            wanted.append(("get_agency_info", {}))
        # Independent of ideas: `generate_project_ideas` hands the answering
        # model only a title summary — the note bodies it reads stay inside the
        # generator — and that model has no tools, so a detail dropped here
        # cannot be recovered later in the turn.
        if names := self._detail_names():
            wanted.append(("read_knowledge_base", {"names": names}))
        if self.routing.get("wants_ideas", 0.0) >= ROUTE_THRESHOLD:
            # Emitted last so the slow ideas step owns the frontend spinner.
            wanted.append(("generate_project_ideas", {"description": description}))
        return [
            {"name": name, "args": args, "id": f"jev-{name}", "type": "tool_call"}
            for name, args in wanted
        ]

    def _detail_names(self) -> list[str]:
        """Projects the message asks about, best first, capped at MAX_NOTES."""
        scored = sorted(
            (
                (score, name.removeprefix(_DETAIL_PREFIX))
                for name, score in self.routing.items()
                if name.startswith(_DETAIL_PREFIX) and score >= ROUTE_THRESHOLD
            ),
            reverse=True,
        )
        return [name for _, name in scored[:MAX_NOTES]]


CONTEXT_WINDOW = 6  # Latest user message plus recent history (~3 exchanges).

# A turn is on-topic if ANY signal fires; each noul is the probability that its
# statement holds. Calibrated on the labelled cases in tests/test_guardrail_live.py:
# off-topic turns top out at 0.27, the weakest on-topic turn scores 0.46, so this
# sits mid-gap. Re-sweep against real traffic before moving it.
ON_TOPIC_THRESHOLD = 0.35

# A tool fires when its noul clears this. Calibrated on the labelled cases in
# tests/test_router_live.py: the highest non-firing signal is 0.39 and the
# weakest firing one 0.63, so this sits mid-gap. If positives and negatives ever
# interleave, reword the noul rather than splitting the difference — that is how
# `wants_ideas` was fixed, when "we also do last-mile delivery" scored 0.62.
ROUTE_THRESHOLD = 0.5
# A follow-up rarely spans more than a couple of projects; the cap stops a
# diffuse question from pulling half the catalogue into the prompt.
MAX_NOTES = 2
_DETAIL_PREFIX = "detail:"

GUARDRAIL_QUESTIONS = {
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


ROUTING_QUESTIONS = {
    "wants_agency_info": Noul(
        instructions=(
            "The latest user message asks for facts about Neuronetis itself — services, "
            "pricing, process, team, engagement terms, or what working with the agency "
            "is like."
        )
    ),
    "wants_ideas": Noul(
        instructions=(
            "A fresh set of AI project ideas should be generated for this turn. True when "
            "the user introduces their business, product or problem and no ideas have been "
            "suggested yet, or when they explicitly ask for new, different or revised ideas. "
            "False once ideas are already on the table and the user is merely adding detail "
            "about their business, reacting to them, or asking about one of them."
        )
    ),
}


def _detail_questions() -> dict[str, Noul]:
    """One noul per project: is the user asking about THIS project?

    Deliberately not `ideas.select_projects`' question. That one asks whether a
    project fits the user's business; this asks whether they are following up on
    a project already under discussion, which is what names it in the message.
    """
    return {
        f"{_DETAIL_PREFIX}{note.name}": Noul(
            instructions=(
                "The latest user message asks for more detail about a specific Neuronetis "
                f"project already under discussion, namely: {note.title}. "
                f"That project is relevant when: {note.read_when}"
            )
        )
        for note in project_notes()
    }


def _user_context(messages: list) -> str:
    """The user's own recent turns, oldest first.

    `generate_project_ideas` scopes entirely from this string, so it cannot be
    just the latest message: "got any other ideas?" would leave both the
    catalogue ranking and the generator with no business to work from. Assistant
    turns are left out so previously suggested ideas do not steer the new set.
    """
    recent = [m for m in messages if isinstance(m, HumanMessage) and str(m.content).strip()]
    return "\n\n".join(str(m.content) for m in recent[-(CONTEXT_WINDOW - 1):])


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
        questions=GUARDRAIL_QUESTIONS | ROUTING_QUESTIONS | _detail_questions(),
    )
    signals = {name: response.nouls[name].noul for name in GUARDRAIL_QUESTIONS}
    verdict: Verdict = "ON_TOPIC" if max(signals.values()) >= ON_TOPIC_THRESHOLD else "OFF_TOPIC"
    routing = {
        name: answer.noul
        for name, answer in response.nouls.items()
        if name not in GUARDRAIL_QUESTIONS
    }
    return TurnClassification(verdict=verdict, signals=signals, routing=routing)


class GuardrailMiddleware(AgentMiddleware):
    """Decide, before any LLM runs, what happens to this turn.

    One Jev request answers both questions at once, since they read the same
    state: is the turn on topic, and which tools does it need? `OFF_TOPIC`
    short-circuits the graph with the canned REJECTION_MESSAGE. Otherwise the
    chosen tool calls are injected as an AIMessage and the graph jumps straight
    to the tools node, so the model is never asked to route — it runs once,
    afterwards, to write prose from the tool results.

    When no tool clears its threshold the model simply answers from history.
    Both hooks no-op mid tool-loop, where the last message is a ToolMessage.
    """

    async def awrap_model_call(self, request: Any, handler: Any) -> Any:
        """Strip tools from the model request: Jev routes, the model only writes.

        Async because every production path streams; the sync `wrap_model_call`
        is not used there and raises NotImplementedError under `astream`.
        """
        request.tools = []
        return await handler(request)

    @hook_config(can_jump_to=["end", "tools"])
    def before_model(self, state: dict, runtime: Any) -> dict | None:
        messages = state.get("messages", [])
        # Only classify the latest human turn, not intermediate tool loops
        if not messages or not isinstance(messages[-1], HumanMessage):
            return None
        classification = classify_turn(messages)
        if classification.verdict == "OFF_TOPIC":
            return {
                "messages": [AIMessage(content=REJECTION_MESSAGE)],
                "jump_to": "end",
            }
        tool_calls = classification.tool_calls(_user_context(messages))
        if tool_calls:
            return {
                "messages": [AIMessage(content="", tool_calls=tool_calls)],
                "jump_to": "tools",
            }
        return None
