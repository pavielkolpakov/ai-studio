import sys
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))


class TestReadKnowledgeBaseTool:
    @patch("app.rag.chain.read_notes")
    def test_returns_content(self, mock_read_notes):
        mock_read_notes.return_value = "# Pricing\n\nOur pricing is fixed."

        from app.rag.chain import read_knowledge_base

        content = read_knowledge_base.invoke(
            {"type": "tool_call", "id": "1", "name": "read_knowledge_base",
             "args": {"names": ["services/pricing"]}}
        ).content

        assert "Pricing" in content
        mock_read_notes.assert_called_once_with(["services/pricing"])

    @patch("app.rag.chain.read_notes")
    def test_passes_multiple_names(self, mock_read_notes):
        mock_read_notes.return_value = "body"

        from app.rag.chain import read_knowledge_base

        read_knowledge_base.invoke(
            {"type": "tool_call", "id": "1", "name": "read_knowledge_base",
             "args": {"names": ["services/pricing", "process/discovery"]}}
        )

        mock_read_notes.assert_called_once_with(["services/pricing", "process/discovery"])
