import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.messages import AIMessage, HumanMessage, ToolMessage
from langgraph.graph import END
from langgraph.types import Command


class TestGuardrailMiddleware:
    @patch("app.rag.guardrail.classify_query", return_value=False)
    def test_offtopic_short_circuits_with_rejection_message(self, _mock):
        from app.rag.guardrail import REJECTION_MESSAGE, GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="what's the weather?")]}
        result = mw.before_model(state, runtime=None)

        assert isinstance(result, Command)
        assert result.goto == END
        new_msgs = result.update["messages"]
        assert len(new_msgs) == 1
        assert isinstance(new_msgs[0], AIMessage)
        assert new_msgs[0].content == REJECTION_MESSAGE

    @patch("app.rag.guardrail.classify_query", return_value=True)
    def test_ontopic_returns_none_and_lets_agent_proceed(self, _mock):
        from app.rag.guardrail import GuardrailMiddleware

        mw = GuardrailMiddleware()
        state = {"messages": [HumanMessage(content="what services do you offer?")]}
        result = mw.before_model(state, runtime=None)

        assert result is None

    @patch("app.rag.guardrail.classify_query")
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
