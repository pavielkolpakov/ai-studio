import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))


def _note(name, title, body="body text"):
    from app.vault.loader import Note

    return Note(name=name, title=title, read_when=f"when {title}", body=body)


class TestSelectProjects:
    @patch("app.rag.ideas.ChatOpenAI")
    def test_selects_from_committed_index_without_sending_project_bodies(self, mock_llm_cls):
        from app.rag.ideas import ProjectSelection, select_projects
        from app.vault.loader import load_index, load_vault

        names = ["projects/13-multi-agent-research-reports", "projects/17-llm-gateway"]
        structured = mock_llm_cls.return_value.with_structured_output.return_value
        structured.with_config.return_value = structured
        structured.invoke.return_value = ProjectSelection(names=names)

        result = select_projects("We need research reports and model spend control")

        prompt = structured.invoke.call_args.args[0]
        assert load_index() in prompt
        assert [note.name for note in result] == names
        assert all(note.body not in prompt for note in load_vault().values())
        assert "30% upfront" not in prompt

    @patch("app.rag.ideas.ChatOpenAI")
    @patch("app.rag.ideas.project_notes")
    def test_returns_selected_notes(self, mock_project_notes, mock_llm_cls):
        notes = [
            _note("projects/01-rag", "RAG Assistant"),
            _note("projects/04-support", "Support Copilot"),
            _note("projects/06-workflow", "Workflow Automation"),
        ]
        mock_project_notes.return_value = notes

        from app.rag.ideas import ProjectSelection

        structured = MagicMock()
        structured.with_config.return_value = structured
        structured.invoke.return_value = ProjectSelection(
            names=["projects/04-support", "projects/06-workflow"]
        )
        llm = MagicMock()
        llm.with_structured_output.return_value = structured
        mock_llm_cls.return_value = llm

        from app.rag.ideas import select_projects

        result = select_projects("I run a support team")

        assert [n.name for n in result] == ["projects/04-support", "projects/06-workflow"]
        prompt = str(structured.invoke.call_args[0][0])
        assert "support team" in prompt
        assert "projects/01-rag" in prompt  # full catalog offered as menu

    @patch("app.rag.ideas.ChatOpenAI")
    @patch("app.rag.ideas.project_notes")
    def test_falls_back_when_selection_unknown(self, mock_project_notes, mock_llm_cls):
        notes = [_note(f"projects/0{i}-p", f"P{i}") for i in range(1, 5)]
        mock_project_notes.return_value = notes

        from app.rag.ideas import ProjectSelection

        structured = MagicMock()
        structured.with_config.return_value = structured
        structured.invoke.return_value = ProjectSelection(names=["nope/x", "nope/y"])
        llm = MagicMock()
        llm.with_structured_output.return_value = structured
        mock_llm_cls.return_value = llm

        from app.rag.ideas import select_projects

        result = select_projects("something")

        assert [n.name for n in result] == [n.name for n in notes[:3]]


class TestGenerateIdeasPayload:
    def _mock_adapt_llm(self, mock_llm_cls):
        from app.rag.ideas import Idea, IdeasPayload

        payload = IdeasPayload(
            ideas=[
                Idea(
                    title="AI Support Triage",
                    description="Auto-classify and route tickets.",
                    deliverables=["Classifier", "Dashboard"],
                    tech=["LangChain", "OpenAI"],
                    price_range="$8k-$15k",
                    time_estimate="3-5 weeks",
                ),
                Idea(
                    title="Knowledge Base Assistant",
                    description="RAG over internal docs.",
                    deliverables=["Indexer", "Chat UI"],
                    tech=["OpenAI"],
                    price_range="$10k-$20k",
                    time_estimate="4-6 weeks",
                ),
            ]
        )
        structured_llm = MagicMock()
        structured_llm.invoke.return_value = payload
        structured_llm.with_config.return_value = structured_llm
        llm = MagicMock()
        llm.with_structured_output.return_value = structured_llm
        mock_llm_cls.return_value = llm
        return payload, structured_llm

    @patch("app.rag.ideas.ChatOpenAI")
    @patch("app.rag.ideas.select_projects")
    def test_uses_selected_project_bodies(self, mock_select, mock_llm_cls):
        mock_select.return_value = [
            _note("projects/04-support", "Support Copilot", body="Support catalog entry"),
        ]
        payload, structured_llm = self._mock_adapt_llm(mock_llm_cls)

        from app.rag.ideas import generate_ideas_payload

        result = generate_ideas_payload("I run a B2B SaaS support team")

        assert result is payload
        mock_select.assert_called_once_with("I run a B2B SaaS support team")
        prompt_text = str(structured_llm.invoke.call_args[0][0])
        assert "B2B SaaS support team" in prompt_text
        assert "Support catalog entry" in prompt_text


class TestGenerateProjectIdeasTool:
    @patch("app.rag.chain.generate_ideas_payload")
    def test_tool_accepts_only_description(self, mock_gen):
        from app.rag.ideas import Idea, IdeasPayload

        mock_gen.return_value = IdeasPayload(
            ideas=[
                Idea(
                    title="Doc Search",
                    description="Semantic search over PDFs.",
                    deliverables=["Indexer", "Search UI"],
                    tech=["OpenAI"],
                    price_range="$5k-$10k",
                    time_estimate="2-4 weeks",
                ),
                Idea(
                    title="Support Copilot",
                    description="LLM-assisted agent replies.",
                    deliverables=["Reply suggester", "Eval harness"],
                    tech=["LangChain"],
                    price_range="$8k-$15k",
                    time_estimate="3-5 weeks",
                ),
            ]
        )

        from app.rag.chain import generate_project_ideas

        msg = generate_project_ideas.invoke(
            {
                "type": "tool_call",
                "id": "i1",
                "name": "generate_project_ideas",
                "args": {"description": "fintech startup"},
            }
        )

        assert isinstance(msg.content, str) and msg.content
        ideas = msg.artifact["ideas"]
        assert len(ideas) == 2
        assert ideas[0]["title"] == "Doc Search"
        mock_gen.assert_called_once_with("fintech startup")

        schema = generate_project_ideas.args_schema.model_json_schema()
        properties = schema.get("properties", {})
        assert "description" in properties
        assert "industry" not in properties
        assert "service_type" not in properties
