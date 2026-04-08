import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.runnables import Runnable


class TestBuildChain:
    @patch("app.rag.chain.ChatOpenAI")
    @patch("app.rag.chain.get_retriever")
    def test_returns_a_runnable(self, mock_retriever_fn, mock_llm_cls):
        mock_retriever_fn.return_value = MagicMock()
        mock_llm_cls.return_value = MagicMock(spec=Runnable)

        from app.rag.chain import build_chain

        chain = build_chain()

        assert isinstance(chain, Runnable)

    @patch("app.rag.chain.ChatOpenAI")
    @patch("app.rag.chain.get_retriever")
    def test_uses_streaming_llm(self, mock_retriever_fn, mock_llm_cls):
        mock_retriever_fn.return_value = MagicMock()
        mock_llm_cls.return_value = MagicMock(spec=Runnable)

        from app.rag.chain import build_chain

        build_chain()

        mock_llm_cls.assert_called_once()
        call_kwargs = mock_llm_cls.call_args[1]
        assert call_kwargs["streaming"] is True


class TestMessagesFromDicts:
    def test_converts_user_and_assistant(self):
        from langchain_core.messages import AIMessage, HumanMessage

        from app.rag.chain import messages_from_dicts

        msgs = [
            {"role": "user", "content": "hello"},
            {"role": "assistant", "content": "hi there"},
        ]
        result = messages_from_dicts(msgs)

        assert len(result) == 2
        assert isinstance(result[0], HumanMessage)
        assert result[0].content == "hello"
        assert isinstance(result[1], AIMessage)
        assert result[1].content == "hi there"

    def test_empty_list(self):
        from app.rag.chain import messages_from_dicts

        assert messages_from_dicts([]) == []

    def test_ignores_unknown_roles(self):
        from app.rag.chain import messages_from_dicts

        result = messages_from_dicts([{"role": "system", "content": "x"}])
        assert result == []
