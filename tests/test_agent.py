import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))


class TestBuildAgent:
    @patch("app.rag.chain.ChatOpenAI")
    def test_returns_compiled_agent(self, mock_llm_cls):
        mock_llm_cls.return_value = MagicMock()

        from app.rag.chain import build_agent

        agent = build_agent()

        # create_agent returns a compiled StateGraph with astream
        assert hasattr(agent, "astream")
        assert hasattr(agent, "ainvoke")

    @patch("app.rag.chain.create_agent")
    @patch("app.rag.chain.ChatOpenAI")
    def test_registers_all_tools(self, mock_llm_cls, mock_create_agent):
        mock_llm_cls.return_value = MagicMock()

        from app.rag.chain import build_agent

        build_agent()

        tools = mock_create_agent.call_args[1]["tools"]
        names = {t.name for t in tools}
        assert names == {"get_agency_info", "read_knowledge_base", "generate_project_ideas"}

    @patch("app.rag.chain.create_agent")
    @patch("app.rag.chain.ChatOpenAI")
    def test_system_prompt_carries_no_project_index(self, mock_llm_cls, mock_create_agent):
        """The index existed so the model could pick project names; Jev does
        that now, so shipping it on every call is dead weight."""
        mock_llm_cls.return_value = MagicMock()

        from app.rag.chain import build_agent

        build_agent()

        system_prompt = mock_create_agent.call_args[1]["system_prompt"]
        assert "{index}" not in system_prompt
        assert "projects/" not in system_prompt
