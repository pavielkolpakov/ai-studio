"""Exercise real agent routing and tools, replacing only external model calls."""

import json
import sys
from pathlib import Path

import pytest
from langchain_core.language_models.fake_chat_models import FakeMessagesListChatModel
from langchain_core.messages import AIMessage, AIMessageChunk, HumanMessage, SystemMessage, ToolMessage
from langchain_core.outputs import ChatGenerationChunk
from pydantic import Field

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from typesafe_sdk import NoulAnswer, SystemOneResponse, Usage

GUARDRAIL_SIGNALS = {"about_agency": 0.0, "about_own_business": 0.0, "is_followup": 0.0}
OFF_TOPIC_SIGNALS = dict(GUARDRAIL_SIGNALS)
AGENCY_SIGNALS = GUARDRAIL_SIGNALS | {"about_agency": 0.99, "wants_agency_info": 0.95}
IDEAS_SIGNALS = GUARDRAIL_SIGNALS | {"about_own_business": 0.96, "wants_ideas": 0.93}
MIXED_SIGNALS = AGENCY_SIGNALS | IDEAS_SIGNALS


def detail_signals(name: str) -> dict[str, float]:
    """Route a project follow-up to `read_knowledge_base` for one note."""
    return GUARDRAIL_SIGNALS | {"is_followup": 0.94, f"detail:{name}": 0.93}


class FakeJevClient:
    """Stands in for the guardrail's TypeSafeClient: replays fixed nouls."""

    def __init__(self, nouls: dict[str, float]):
        self.nouls = nouls
        self.states: list = []
        self.questions: list = []

    def system_one(self, state, questions, **_kwargs):
        self.states.append(state)
        self.questions.append(questions)
        answers = self.nouls if set(self.nouls) == set(questions) else {
            name: self.nouls.get(name, 0.0) for name in questions
        }
        return SystemOneResponse(
            model="jev-latest",
            usage=Usage(),
            answers={name: NoulAnswer(noul=value) for name, value in answers.items()},
        )


class RecordingModel(FakeMessagesListChatModel):
    calls: list = Field(default_factory=list)

    bound_tools: list = Field(default_factory=list)

    def bind_tools(self, tools, *, tool_choice=None, **kwargs):
        self.bound_tools.extend(t.name if hasattr(t, "name") else str(t) for t in tools)
        return self.bind(tool_choice=tool_choice)

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        self.calls.append((messages, kwargs.get("tool_choice")))
        return super()._generate(messages, stop=stop, run_manager=run_manager, **kwargs)

    def _stream(self, messages, stop=None, run_manager=None, **kwargs):
        response = self._generate(messages, stop, run_manager, **kwargs).generations[0].message
        yield ChatGenerationChunk(message=AIMessageChunk(
            content=response.content, tool_calls=response.tool_calls,
        ))


class StructuredModel(RecordingModel):
    def with_structured_output(self, schema, **kwargs):
        return self | (lambda message: schema.model_validate_json(message.content))


def configure_models(monkeypatch, routes, responses):
    """Jev decides the tools; the model only writes prose.

    `routes` is one signal dict per turn. Because routing is deterministic now,
    `responses` carries only prose — no scripted tool calls.
    """
    clients = [FakeJevClient(r) for r in routes]
    model = RecordingModel(responses=responses)
    monkeypatch.setattr("app.rag.guardrail._client", lambda: clients.pop(0))
    monkeypatch.setattr("app.rag.chain.ChatOpenAI", lambda **kwargs: model)
    return model


@pytest.mark.asyncio
async def test_agency_question_is_answered_via_the_agency_info_tool(monkeypatch):
    from app.rag.agency_context import AGENCY_CONTEXT
    from app.rag.chain import build_agent

    model = configure_models(
        monkeypatch,
        [AGENCY_SIGNALS],
        [AIMessage(content="Our standard terms are 30% upfront, 40% at midpoint, 30% at delivery.")],
    )
    result = await build_agent().ainvoke({"messages": [HumanMessage(content="What are your payment terms?")]})

    # Jev routed, so the model is called once — to write prose, not to pick a tool.
    assert len(model.calls) == 1
    assert model.bound_tools == [], "the model never needs tool schemas now"
    # Agency facts arrive as a tool result, not baked into the system prompt.
    assert "30% upfront" not in model.calls[0][0][0].content
    retrieved = [m for m in result["messages"] if isinstance(m, ToolMessage) and m.name == "get_agency_info"]
    assert len(retrieved) == 1 and retrieved[0].content == AGENCY_CONTEXT
    assert result["messages"][-1].content.startswith("Our standard terms")
    assert not any(isinstance(message, SystemMessage) for message in result["messages"])


def configure_ideas_model(monkeypatch):
    """Jev ranks the catalogue; only the adaptation step is still an LLM."""
    from app.rag.ideas import Idea, IdeasPayload

    # Jev hands the generator three candidates; it adapts two and drops the third.
    names = [
        "projects/13-multi-agent-research-reports",
        "projects/17-llm-gateway",
        "projects/02-ai-feature-audit",
    ]
    payload = IdeasPayload(ideas=[Idea(
        title=title, description="Tailored scope", deliverables=["A", "B", "C"],
        tech=["Python"], price_range="$10k–$20k", time_estimate="3–5 weeks",
    ) for title in ["Research reports", "Model gateway"]])
    generation = StructuredModel(
        responses=[AIMessage(content=payload.model_dump_json())], disable_streaming=True,
    )
    selector = FakeJevClient(dict.fromkeys(names, 0.95))
    monkeypatch.setattr("app.rag.ideas._client", lambda: selector)
    monkeypatch.setattr("app.rag.ideas.ChatOpenAI", lambda **kwargs: generation)
    return selector, generation, names, payload


@pytest.mark.asyncio
@pytest.mark.parametrize("agency_question", [False, True], ids=["pure-ideas", "mixed-request"])
async def test_agent_generates_ideas_and_may_also_answer_agency_questions(monkeypatch, agency_question):
    from app.rag.chain import build_agent, stream_response
    from app.vault.loader import load_index, load_vault

    question = "We want research reports and control over our model spend."
    if agency_question:
        question += " How do your payment terms work?"
    intro = "Here are ideas for your team."
    answer = intro + (" Our payment terms are 30% upfront, 40% at midpoint, 30% at delivery." if agency_question else "")

    model = configure_models(
        monkeypatch,
        [MIXED_SIGNALS if agency_question else IDEAS_SIGNALS],
        [AIMessage(content=answer)],
    )
    selector, generation, names, payload = configure_ideas_model(monkeypatch)

    events = [json.loads(event.removeprefix("data: ")) async for event in stream_response(build_agent(), question, [])]

    # Jev routed both tools up front, so the model runs once, to write prose.
    assert len(model.calls) == 1
    assert model.bound_tools == []
    tool_events = [e["tool"] for e in events if e["type"] == "tool_call"]
    assert ("get_agency_info" in tool_events) == agency_question
    assert "generate_project_ideas" in tool_events
    generation_prompt = generation.calls[0][0][0].content
    # Jev scores every catalogue entry from its `read_when`; only the two it
    # ranks highest reach the adaptation prompt, and bodies never reach Jev.
    assert set(selector.questions[0]) == {n for n in load_vault() if n.startswith("projects/")}
    assert selector.states[0] == question
    assert question in generation_prompt
    for name, note in load_vault().items():
        assert note.body not in "\n".join(
            [selector.states[0]] + [q.instructions for q in selector.questions[0].values()]
        )
        assert (note.body in generation_prompt) == (name in names)
    assert [event["ideas"] for event in events if event["type"] == "ideas"] == [payload.model_dump()["ideas"]]
    assert "".join(event["token"] for event in events if event["type"] == "token") == answer
    assert events[-1] == {"type": "done", "followups": []}


@pytest.mark.asyncio
async def test_agent_picks_the_right_tool_across_agency_ideas_and_project_followups(monkeypatch):
    from app.rag.agency_context import AGENCY_CONTEXT
    from app.rag.chain import build_agent
    from app.vault.loader import load_vault

    model = configure_models(
        monkeypatch,
        [AGENCY_SIGNALS, IDEAS_SIGNALS, detail_signals("projects/17-llm-gateway")],
        [
            AIMessage(content="We are an AI engineering studio."),
            AIMessage(content="Here are ideas for your team."),
            AIMessage(content="The gateway uses LiteLLM."),
        ],
    )
    configure_ideas_model(monkeypatch)
    agent = build_agent()
    state = {"messages": []}
    for question in ["What is Neuronetis?", "We need model spend control.", "How would the gateway work?"]:
        state = await agent.ainvoke({**state, "messages": state["messages"] + [HumanMessage(content=question)]})

    # One model call per turn now, and agency facts never leak into the prompt.
    assert len(model.calls) == 3
    assert model.bound_tools == []
    assert all(AGENCY_CONTEXT not in messages[0].content for messages, _ in model.calls)
    project = load_vault()["projects/17-llm-gateway"]
    agency = [m for m in state["messages"] if isinstance(m, ToolMessage) and m.name == "get_agency_info"]
    retrieved = [m for m in state["messages"] if isinstance(m, ToolMessage) and m.name == "read_knowledge_base"]
    assert len(agency) == 1 and agency[0].content == AGENCY_CONTEXT
    assert len(retrieved) == 1 and project.body in retrieved[0].content
    assert not any(isinstance(message, SystemMessage) for message in state["messages"])


@pytest.mark.asyncio
async def test_off_topic_turn_never_calls_the_agent_model(monkeypatch):
    from app.rag.chain import build_agent
    from app.rag.guardrail import REJECTION_MESSAGE

    model = configure_models(monkeypatch, [OFF_TOPIC_SIGNALS],
                             [AIMessage(content="This must not be generated.")])
    result = await build_agent().ainvoke({"messages": [HumanMessage(content="Write a poem about the sea.")]})

    assert model.calls == []
    assert result["messages"][-1].content == REJECTION_MESSAGE


@pytest.mark.asyncio
async def test_off_topic_rejection_is_streamed_to_the_user(monkeypatch):
    from app.rag.chain import build_agent, stream_response
    from app.rag.guardrail import REJECTION_MESSAGE

    model = configure_models(monkeypatch, [OFF_TOPIC_SIGNALS],
                             [AIMessage(content="This must not be generated.")])
    events = [json.loads(event.removeprefix("data: ")) async for event in stream_response(build_agent(), "hi", [])]

    assert "".join(event["token"] for event in events if event["type"] == "token") == REJECTION_MESSAGE
    assert events[-1] == {"type": "done", "followups": []}
    assert model.calls == []
