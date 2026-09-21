import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))


def _note(name, title, body="body text"):
    from app.vault.loader import Note

    return Note(name=name, title=title, read_when=f"when {title}", body=body)


class FakeJevClient:
    """Stands in for TypeSafeClient: scores projects by name, records each call."""

    def __init__(self, scores: dict[str, float]):
        self.scores = scores
        self.states: list = []
        self.questions: list = []

    def system_one(self, state, questions, **_kwargs):
        from typesafe_sdk import NoulAnswer, SystemOneResponse, Usage

        self.states.append(state)
        self.questions.append(questions)
        return SystemOneResponse(
            model="jev-latest",
            usage=Usage(),
            answers={name: NoulAnswer(noul=self.scores.get(name, 0.0)) for name in questions},
        )


class TestSelectProjects:
    @patch("app.rag.ideas._client")
    @patch("app.rag.ideas.project_notes")
    def test_returns_the_three_best_scoring_notes(self, mock_project_notes, mock_client):
        notes = [
            _note("projects/01-rag", "RAG Assistant"),
            _note("projects/04-support", "Support Copilot"),
            _note("projects/06-workflow", "Workflow Automation"),
            _note("projects/09-gateway", "LLM Gateway"),
        ]
        mock_project_notes.return_value = notes
        mock_client.return_value = FakeJevClient({
            "projects/01-rag": 0.10,
            "projects/04-support": 0.95,
            "projects/06-workflow": 0.40,
            "projects/09-gateway": 0.80,
        })

        from app.rag.ideas import select_projects

        result = select_projects("I run a support team")

        assert [n.name for n in result] == [
            "projects/04-support", "projects/09-gateway", "projects/06-workflow",
        ]

    @patch("app.rag.ideas._client")
    @patch("app.rag.ideas.project_notes")
    def test_asks_one_noul_per_project_carrying_its_read_when(self, mock_project_notes, mock_client):
        notes = [_note("projects/01-rag", "RAG Assistant"), _note("projects/04-support", "Support Copilot")]
        mock_project_notes.return_value = notes
        client = FakeJevClient({})
        mock_client.return_value = client

        from app.rag.ideas import select_projects

        select_projects("I run a support team")

        assert len(client.questions) == 1, "the whole catalogue is scored in one request"
        questions = client.questions[0]
        assert set(questions) == {"projects/01-rag", "projects/04-support"}
        assert questions["projects/04-support"].instructions == "when Support Copilot"
        assert client.states[0] == "I run a support team"

    @patch("app.rag.ideas._client")
    def test_scores_the_real_catalogue_without_sending_project_bodies(self, mock_client):
        """Bodies are the expensive part and the selector never needs them —
        `read_when` alone decides fit. Guards against a regression to sending
        the full vault on every ideas turn."""
        from app.vault.loader import load_vault

        client = FakeJevClient({})
        mock_client.return_value = client

        from app.rag.ideas import select_projects

        select_projects("We need research reports and model spend control")

        sent = "\n".join(
            [client.states[0]] + [q.instructions for q in client.questions[0].values()]
        )
        for note in load_vault().values():
            assert note.body not in sent
        assert "30% upfront" not in sent


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
