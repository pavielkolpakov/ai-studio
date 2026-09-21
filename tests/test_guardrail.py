import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from typesafe_sdk import NoulAnswer, SystemOneResponse, Usage


class FakeJevClient:
    """Stands in for TypeSafeClient: replays fixed nouls, records every state."""

    def __init__(self, **nouls: float):
        self.nouls = nouls
        self.states: list = []
        self.questions: list = []

    def system_one(self, state, questions, **_kwargs):
        self.states.append(state)
        self.questions.append(questions)
        return SystemOneResponse(
            model="jev-latest",
            usage=Usage(),
            answers={name: NoulAnswer(noul=value) for name, value in self.nouls.items()},
        )


def fake_jev(**nouls: float):
    """Patch target for `app.rag.guardrail._client`."""
    client = FakeJevClient(**nouls)
    return lambda: client


def all_signals(**overrides: float) -> dict[str, float]:
    return {"about_agency": 0.0, "about_own_business": 0.0, "is_followup": 0.0} | overrides


class TestClassifyTurn:
    @patch("app.rag.guardrail._client")
    def test_keeps_latest_business_description_separate_from_history(self, mock_client):
        from app.rag.guardrail import classify_turn

        client = FakeJevClient(**all_signals(about_own_business=0.97))
        mock_client.return_value = client
        result = classify_turn([
            HumanMessage(content="Can you suggest ideas?"),
            AIMessage(content="Tell me about your company."),
            HumanMessage(content="i have a marketing lead generation company"),
        ])

        state = client.states[-1]
        assert state["latest_user_message"] == "i have a marketing lead generation company"
        assert "Tell me about your company." in state["earlier_conversation"]
        assert "marketing lead generation" not in state["earlier_conversation"]
        assert result.verdict == "ON_TOPIC"

    @patch("app.rag.guardrail._client")
    def test_asks_all_three_signals_in_one_request(self, mock_client):
        from app.rag.guardrail import classify_turn

        client = FakeJevClient(**all_signals(about_agency=0.99))
        mock_client.return_value = client
        result = classify_turn([HumanMessage(content="What services does Neuronetis offer?")])

        assert len(client.questions) == 1
        assert set(client.questions[0]) == {"about_agency", "about_own_business", "is_followup"}
        assert result.signals == all_signals(about_agency=0.99)

    @patch("app.rag.guardrail._client")
    def test_returns_on_topic_for_an_agency_question(self, mock_client):
        from app.rag.guardrail import classify_turn

        mock_client.side_effect = fake_jev(**all_signals(about_agency=0.99))

        assert classify_turn([HumanMessage(content="What services does Neuronetis offer?")]).verdict == "ON_TOPIC"

    @patch("app.rag.guardrail._client")
    def test_returns_on_topic_for_a_business_description(self, mock_client):
        from app.rag.guardrail import classify_turn

        mock_client.side_effect = fake_jev(**all_signals(about_own_business=0.95))
        messages = [HumanMessage(content="i have a marketing lead generation company")]

        assert classify_turn(messages).verdict == "ON_TOPIC"

    @patch("app.rag.guardrail._client")
    def test_a_single_signal_above_the_threshold_is_enough(self, mock_client):
        from app.rag.guardrail import ON_TOPIC_THRESHOLD, classify_turn

        mock_client.side_effect = fake_jev(**all_signals(is_followup=ON_TOPIC_THRESHOLD))

        assert classify_turn([HumanMessage(content="and the second one?")]).verdict == "ON_TOPIC"

    @patch("app.rag.guardrail._client")
    def test_signals_below_the_threshold_do_not_add_up_to_on_topic(self, mock_client):
        """Composition is max(), not a sum: three weak signals stay off-topic."""
        from app.rag.guardrail import classify_turn

        mock_client.side_effect = fake_jev(about_agency=0.3, about_own_business=0.3, is_followup=0.3)

        assert classify_turn([HumanMessage(content="write me a poem")]).verdict == "OFF_TOPIC"

    @patch("app.rag.guardrail._client")
    def test_classifier_sees_prior_turns_not_just_the_latest_message(self, mock_client):
        """Without history the classifier cannot tell a NEW business from
        elaboration on ideas already generated this session."""
        from app.rag.guardrail import classify_turn

        client = FakeJevClient(**all_signals(is_followup=0.9))
        mock_client.return_value = client
        classify_turn([
            HumanMessage(content="I run a 40-person logistics company."),
            AIMessage(content="Here are three ideas for your logistics business."),
            HumanMessage(content="we also do last-mile delivery in Poland"),
        ])

        state = client.states[-1]
        assert state["latest_user_message"] == "we also do last-mile delivery in Poland"
        assert "logistics company" in state["earlier_conversation"]

    @patch("app.rag.guardrail._client")
    def test_classifier_window_excludes_stale_turns(self, mock_client):
        from app.rag.guardrail import classify_turn

        client = FakeJevClient(**all_signals(about_agency=0.9))
        mock_client.return_value = client
        classify_turn([
            HumanMessage(content="ancient unrelated topic"),
            AIMessage(content="a"),
            HumanMessage(content="b"),
            AIMessage(content="c"),
            HumanMessage(content="d"),
            AIMessage(content="e"),
            HumanMessage(content="what's your pricing?"),
        ])

        assert "ancient unrelated topic" not in client.states[-1]["earlier_conversation"]

    @patch("app.rag.guardrail._client")
    def test_a_first_turn_reports_no_earlier_conversation(self, mock_client):
        from app.rag.guardrail import classify_turn

        client = FakeJevClient(**all_signals(about_agency=0.9))
        mock_client.return_value = client
        classify_turn([HumanMessage(content="what's your pricing?")])

        assert client.states[-1]["earlier_conversation"] == "No earlier conversation."


class TestRouting:
    """Signals -> routing decision, with the Jev client mocked."""

    @patch("app.rag.guardrail._client", side_effect=fake_jev(**all_signals()))
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

    @patch("app.rag.guardrail._client", side_effect=fake_jev(**all_signals()))
    def test_bare_greeting_is_rejected(self, _mock):
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="hi")]}

        assert mw.before_model(state, runtime=None)["jump_to"] == "end"

    @patch("app.rag.guardrail._client", side_effect=fake_jev(**all_signals(about_agency=0.98)))
    def test_ontopic_agency_question_lets_the_agent_proceed(self, _mock):
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="what's your pricing?")]}

        assert mw.before_model(state, runtime=None) is None

    @patch("app.rag.guardrail._client", side_effect=fake_jev(**all_signals(about_own_business=0.96)))
    def test_ontopic_business_description_lets_the_agent_proceed(self, _mock):
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="I run a 40-person logistics company.")]}

        assert mw.before_model(state, runtime=None) is None

    @patch("app.rag.guardrail._client")
    def test_skips_classification_during_tool_loop(self, mock_client):
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
        mock_client.assert_not_called()
