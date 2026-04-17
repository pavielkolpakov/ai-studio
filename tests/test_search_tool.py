import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.documents import Document


class TestSearchKnowledgeBaseTool:
    @patch("app.rag.chain.get_retriever")
    def test_returns_content_and_topics_artifact(self, mock_retriever_fn):
        retriever = MagicMock()
        retriever.invoke.return_value = [
            Document(
                page_content="We offer AI consulting.",
                metadata={"source": "RAG.md", "header": "Services", "topic": "services"},
            ),
            Document(
                page_content="Our process is iterative.",
                metadata={"source": "RAG.md", "header": "Process", "topic": "process"},
            ),
        ]
        mock_retriever_fn.return_value = retriever

        from app.rag.chain import search_knowledge_base

        msg = search_knowledge_base.invoke(
            {"type": "tool_call", "id": "1", "name": "search_knowledge_base",
             "args": {"query": "what do you offer?"}}
        )
        content, artifact = msg.content, msg.artifact

        assert "AI consulting" in content
        assert "iterative" in content
        assert set(artifact["topics"]) == {"services", "process"}
        retriever.invoke.assert_called_once_with("what do you offer?")

    @patch("app.rag.chain.get_retriever")
    def test_empty_results(self, mock_retriever_fn):
        retriever = MagicMock()
        retriever.invoke.return_value = []
        mock_retriever_fn.return_value = retriever

        from app.rag.chain import search_knowledge_base

        msg = search_knowledge_base.invoke(
            {"type": "tool_call", "id": "1", "name": "search_knowledge_base",
             "args": {"query": "x"}}
        )
        content, artifact = msg.content, msg.artifact

        assert content == ""
        assert artifact["topics"] == []
