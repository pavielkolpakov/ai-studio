import json
import sys
from pathlib import Path
from unittest.mock import patch

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.language_models.fake_chat_models import FakeListChatModel
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from pydantic import ValidationError


class StructuredClassifier(FakeListChatModel):
    def with_structured_output(self, schema, **kwargs):
        return self | (lambda message: schema.model_validate_json(message.content))


def fake_classifier(verdict: str):
    """Patch target for ChatOpenAI inside the guardrail: replies with `verdict`."""
    return lambda **_kwargs: StructuredClassifier(responses=[json.dumps({"verdict": verdict})])


def recording_classifier(verdict: str, seen: list[str]):
    """Like `fake_classifier`, but appends every prompt it receives to `seen`."""

    class Recording(StructuredClassifier):
        def _call(self, messages, stop=None, run_manager=None, **kwargs):
            seen.extend(str(m.content) for m in messages)
            return super()._call(messages, stop, run_manager, **kwargs)

    return lambda **_kwargs: Recording(responses=[json.dumps({"verdict": verdict})])


class TestClassifyTurn:
    @patch("app.rag.guardrail.ChatOpenAI")
    def test_keeps_latest_business_description_separate_from_history(self, mock_llm_cls):
        from app.rag.guardrail import classify_turn

        seen = []

        class Recording(StructuredClassifier):
            def _call(self, messages, **kwargs):
                seen.extend(messages)
                return super()._call(messages, **kwargs)

        mock_llm_cls.return_value = Recording(responses=['{"verdict": "ON_TOPIC"}'])
        result = classify_turn([
            HumanMessage(content="Can you suggest ideas?"),
            AIMessage(content="Tell me about your company."),
            HumanMessage(content="i have a marketing lead generation company"),
        ])

        assert seen[-1].content == "Latest user message:\ni have a marketing lead generation company"
        assert "Tell me about your company." in seen[-2].content
        assert "marketing lead generation" not in seen[-2].content
        assert result.verdict == "ON_TOPIC"

    @patch("app.rag.guardrail.ChatOpenAI")
    def test_returns_on_topic_for_an_agency_question(self, mock_llm_cls):
        from app.rag.guardrail import classify_turn

        mock_llm_cls.side_effect = fake_classifier("ON_TOPIC")

        assert classify_turn([HumanMessage(content="What services does Neuronetis offer?")]).verdict == "ON_TOPIC"

    @patch("app.rag.guardrail.ChatOpenAI")
    def test_returns_on_topic_for_a_business_description(self, mock_llm_cls):
        from app.rag.guardrail import classify_turn

        mock_llm_cls.side_effect = fake_classifier("ON_TOPIC")
        messages = [HumanMessage(content="i have a marketing lead generation company")]

        assert classify_turn(messages).verdict == "ON_TOPIC"

    @patch("app.rag.guardrail.ChatOpenAI")
    def test_malformed_model_output_is_not_misreported_as_off_topic(self, mock_llm_cls):
        from app.rag.guardrail import classify_turn

        mock_llm_cls.side_effect = fake_classifier("I'm not sure")

        with pytest.raises(ValidationError):
            classify_turn([HumanMessage(content="???")])

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


class TestRouting:
    """Verdict -> routing decision, with the classifier mocked."""

    @patch("app.rag.guardrail.ChatOpenAI", side_effect=fake_classifier("OFF_TOPIC"))
    def test_offtopic_short_circuits_with_rejection_message(self, _mock):
        from app.rag.guardrail import REJECTION_MESSAGE, GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="write me a poem about the sea")]}
        result = mw.before_model(state, runtime=None)

        assert result["jump_to"] == "end"
        new_msgs = result["messages"]
        assert len(new_msgs) == 1
        assert isinstance(new_msgs[0], AIMessage)
        assert new_msgs[0].content == REJECTION_MESSAGE

    @patch("app.rag.guardrail.ChatOpenAI", side_effect=fake_classifier("OFF_TOPIC"))
    def test_bare_greeting_is_rejected(self, _mock):
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="hi")]}

        assert mw.before_model(state, runtime=None)["jump_to"] == "end"

    @patch("app.rag.guardrail.ChatOpenAI", side_effect=fake_classifier("ON_TOPIC"))
    def test_ontopic_agency_question_lets_the_agent_proceed(self, _mock):
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="what's your pricing?")]}

        assert mw.before_model(state, runtime=None) is None

    @patch("app.rag.guardrail.ChatOpenAI", side_effect=fake_classifier("ON_TOPIC"))
    def test_ontopic_business_description_lets_the_agent_proceed(self, _mock):
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="I run a 40-person logistics company.")]}

        assert mw.before_model(state, runtime=None) is None

    @patch("app.rag.guardrail.ChatOpenAI")
    def test_skips_classification_during_tool_loop(self, mock_classify):
        """After a tool call, the last message is a ToolMessage, not Human.
        Middleware must not re-classify mid-loop."""
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {
            "messages": [
                HumanMessage(content="services?"),
                AIMessage(content="", tool_calls=[
                    {"id": "t1", "name": "get_agency_info",
                     "args": {}, "type": "tool_call"}
                ]),
                ToolMessage(content="…", tool_call_id="t1"),
            ]
        }
        result = mw.before_model(state, runtime=None)

        assert result is None
        mock_classify.assert_not_called()
