import sys
from pathlib import Path
from unittest.mock import patch

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain.agents.middleware import ModelRequest
from langchain_core.language_models.fake_chat_models import FakeListChatModel
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langgraph.graph import END
from langgraph.types import Command


def fake_classifier(verdict: str):
    """Patch target for ChatOpenAI inside the guardrail: replies with `verdict`."""
    return lambda **_kwargs: FakeListChatModel(responses=[verdict])


def recording_classifier(verdict: str, seen: list[str]):
    """Like `fake_classifier`, but appends every prompt it receives to `seen`."""

    class Recording(FakeListChatModel):
        def _call(self, messages, stop=None, run_manager=None, **kwargs):
            seen.extend(str(m.content) for m in messages)
            return super()._call(messages, stop, run_manager, **kwargs)

    return lambda **_kwargs: Recording(responses=[verdict])


class TestClassifyTurn:
    @patch("app.rag.guardrail.ChatOpenAI")
    def test_returns_business_for_a_business_description(self, mock_llm_cls):
        from app.rag.guardrail import classify_turn

        mock_llm_cls.side_effect = fake_classifier("BUSINESS")
        messages = [HumanMessage(content="I run a 40-person logistics company in Poland.")]

        assert classify_turn(messages) == "BUSINESS"

    @patch("app.rag.guardrail.ChatOpenAI")
    def test_unknown_verdict_falls_back_to_off_topic(self, mock_llm_cls):
        from app.rag.guardrail import classify_turn

        mock_llm_cls.side_effect = fake_classifier("I'm not sure")

        assert classify_turn([HumanMessage(content="???")]) == "OFF_TOPIC"

    @patch("app.rag.guardrail.ChatOpenAI")
    def test_classifier_sees_prior_turns_not_just_the_latest_message(self, mock_llm_cls):
        """Without history the classifier cannot tell a NEW business from
        elaboration on ideas already generated this session."""
        from app.rag.guardrail import classify_turn

        seen: list[str] = []
        mock_llm_cls.side_effect = recording_classifier("ON_TOPIC", seen)
        messages = [
            HumanMessage(content="I run a 40-person logistics company."),
            AIMessage(content="Here are three ideas for your logistics business."),
            HumanMessage(content="we also do last-mile delivery in Poland"),
        ]

        classify_turn(messages)

        prompt_text = "\n".join(seen)
        assert "last-mile delivery" in prompt_text
        assert "logistics company" in prompt_text

    @patch("app.rag.guardrail.ChatOpenAI")
    def test_classifier_window_excludes_stale_turns(self, mock_llm_cls):
        from app.rag.guardrail import classify_turn

        seen: list[str] = []
        mock_llm_cls.side_effect = recording_classifier("ON_TOPIC", seen)
        messages = [
            HumanMessage(content="ancient unrelated topic"),
            AIMessage(content="a"),
            HumanMessage(content="b"),
            AIMessage(content="c"),
            HumanMessage(content="d"),
            AIMessage(content="e"),
            HumanMessage(content="what's your pricing?"),
        ]

        classify_turn(messages)

        assert "ancient unrelated topic" not in "\n".join(seen)


def make_request(state: dict) -> ModelRequest:
    return ModelRequest(
        model=None,
        messages=state["messages"],
        system_message=None,
        tool_choice=None,
        tools=[],
        response_format=None,
        state=state,
        runtime=None,
        model_settings={},
    )


async def capturing_handler(captured: dict):
    async def handler(request: ModelRequest):
        captured["tool_choice"] = request.tool_choice
        return "model-response"

    return handler


class TestForcedIdeasTool:
    """A BUSINESS verdict must force the ideas tool on the turn's FIRST model
    call only — re-forcing after the tool returns would loop forever."""

    @pytest.mark.asyncio
    async def test_forces_ideas_tool_when_verdict_is_business(self):
        from app.rag.guardrail import IDEAS_TOOL_NAME, GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {
            "messages": [HumanMessage(content="I run a logistics company.")],
            "guardrail_verdict": "BUSINESS",
        }
        captured: dict = {}
        result = await mw.awrap_model_call(make_request(state), await capturing_handler(captured))

        assert captured["tool_choice"] == IDEAS_TOOL_NAME
        assert result == "model-response"

    @pytest.mark.asyncio
    async def test_does_not_re_force_after_the_ideas_tool_has_returned(self):
        """The follow-up model call writes the intro text; forcing the tool
        again there would call it forever."""
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {
            "messages": [
                HumanMessage(content="I run a logistics company."),
                AIMessage(content="", tool_calls=[
                    {"id": "i1", "name": "generate_project_ideas",
                     "args": {"description": "logistics"}, "type": "tool_call"}
                ]),
                ToolMessage(content="Generated 3 ideas.", tool_call_id="i1"),
            ],
            "guardrail_verdict": "BUSINESS",
        }
        captured: dict = {}
        await mw.awrap_model_call(make_request(state), await capturing_handler(captured))

        assert captured["tool_choice"] is None

    @pytest.mark.asyncio
    async def test_leaves_tool_choice_alone_for_ontopic_turns(self):
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {
            "messages": [HumanMessage(content="what's your pricing?")],
            "guardrail_verdict": "ON_TOPIC",
        }
        captured: dict = {}
        await mw.awrap_model_call(make_request(state), await capturing_handler(captured))

        assert captured["tool_choice"] is None


class TestRouting:
    """Verdict -> routing decision, with the classifier mocked."""

    @patch("app.rag.guardrail.classify_turn", return_value="OFF_TOPIC")
    def test_offtopic_short_circuits_with_rejection_message(self, _mock):
        from app.rag.guardrail import REJECTION_MESSAGE, GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="write me a poem about the sea")]}
        result = mw.before_model(state, runtime=None)

        assert isinstance(result, Command)
        assert result.goto == END
        new_msgs = result.update["messages"]
        assert len(new_msgs) == 1
        assert isinstance(new_msgs[0], AIMessage)
        assert new_msgs[0].content == REJECTION_MESSAGE

    @patch("app.rag.guardrail.classify_turn", return_value="OFF_TOPIC")
    def test_bare_greeting_is_rejected(self, _mock):
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="hi")]}

        assert isinstance(mw.before_model(state, runtime=None), Command)

    @patch("app.rag.guardrail.classify_turn", return_value="ON_TOPIC")
    def test_ontopic_lets_agent_proceed_without_forcing_ideas(self, _mock):
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="what's your pricing?")]}
        result = mw.before_model(state, runtime=None)

        assert not isinstance(result, Command)
        assert (result or {}).get("guardrail_verdict") != "BUSINESS"

    @patch("app.rag.guardrail.classify_turn", return_value="BUSINESS")
    def test_business_description_records_verdict_in_state(self, _mock):
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="I run a 40-person logistics company.")]}
        result = mw.before_model(state, runtime=None)

        assert not isinstance(result, Command)
        assert result["guardrail_verdict"] == "BUSINESS"

    @patch("app.rag.guardrail.classify_turn")
    def test_skips_classification_during_tool_loop(self, mock_classify):
        """After a tool call, the last message is a ToolMessage, not Human.
        Middleware must not re-classify mid-loop."""
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {
            "messages": [
                HumanMessage(content="services?"),
                AIMessage(content="", tool_calls=[
                    {"id": "t1", "name": "search_knowledge_base",
                     "args": {"query": "services"}, "type": "tool_call"}
                ]),
                ToolMessage(content="…", tool_call_id="t1"),
            ]
        }
        result = mw.before_model(state, runtime=None)

        assert result is None
        mock_classify.assert_not_called()
