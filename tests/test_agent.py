import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))


class TestBuildAgent:
    @patch("app.rag.chain.ChatOpenAI")
    @patch("app.rag.chain.get_retriever")
    def test_returns_compiled_agent(self, mock_retriever_fn, mock_llm_cls):
        mock_retriever_fn.return_value = MagicMock()
        mock_llm_cls.return_value = MagicMock()

        from app.rag.chain import build_agent

        agent = build_agent()

        # create_agent returns a compiled StateGraph with astream
        assert hasattr(agent, "astream")
        assert hasattr(agent, "ainvoke")
