import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))


class TestReadKnowledgeBaseTool:
    def test_only_project_documents_are_retrievable(self):
        from app.rag.chain import read_knowledge_base

        content = read_knowledge_base.invoke({"names": [
            "[[projects/17-llm-gateway.md]]", "services/pricing",
        ]})

        assert "## What we build" in content
        assert "_note: projects/17-llm-gateway_" in content
        assert "NOTE NOT FOUND: services/pricing" in content
        assert "30% upfront" not in content

    def test_returns_multiple_complete_project_documents(self):
        from app.rag.chain import read_knowledge_base
        from app.vault.loader import load_vault

        names = ["projects/01-rag-knowledge-assistant", "projects/17-llm-gateway"]
        message = read_knowledge_base.invoke({
            "type": "tool_call", "id": "1", "name": "read_knowledge_base",
            "args": {"names": names},
        })

        for name in names:
            assert load_vault()[name].body in message.content
