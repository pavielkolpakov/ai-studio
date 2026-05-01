import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.documents import Document
from qdrant_client.models import Filter


class TestGetTemplatesRetriever:
    @patch("app.rag.ideas.QdrantVectorStore")
    @patch("app.rag.ideas.get_embeddings")
    @patch("app.rag.ideas.get_qdrant_client")
    def test_default_filters_topic_templates_only(self, _client, _embed, mock_vs_cls):
        mock_vs = MagicMock()
        mock_vs_cls.return_value = mock_vs
        mock_vs.as_retriever.return_value = MagicMock()

        from app.rag.ideas import get_templates_retriever

        get_templates_retriever()

        search_kwargs = mock_vs.as_retriever.call_args[1]["search_kwargs"]
        assert search_kwargs["k"] == 4
        serialized = search_kwargs["filter"].model_dump_json()
        assert "templates" in serialized
        assert "topic" in serialized
        assert "industry" not in serialized
        assert "service_type" not in serialized

    @patch("app.rag.ideas.QdrantVectorStore")
    @patch("app.rag.ideas.get_embeddings")
    @patch("app.rag.ideas.get_qdrant_client")
    def test_industry_added_to_filter(self, _client, _embed, mock_vs_cls):
        mock_vs = MagicMock()
        mock_vs_cls.return_value = mock_vs
        mock_vs.as_retriever.return_value = MagicMock()

        from app.rag.ideas import get_templates_retriever

        get_templates_retriever(industry="fintech")

        serialized = mock_vs.as_retriever.call_args[1]["search_kwargs"]["filter"].model_dump_json()
        assert "fintech" in serialized
        assert "industry" in serialized

    @patch("app.rag.ideas.QdrantVectorStore")
    @patch("app.rag.ideas.get_embeddings")
    @patch("app.rag.ideas.get_qdrant_client")
    def test_service_type_added_to_filter(self, _client, _embed, mock_vs_cls):
        mock_vs = MagicMock()
        mock_vs_cls.return_value = mock_vs
        mock_vs.as_retriever.return_value = MagicMock()

        from app.rag.ideas import get_templates_retriever

        get_templates_retriever(industry="fintech", service_type="audit")

        serialized = mock_vs.as_retriever.call_args[1]["search_kwargs"]["filter"].model_dump_json()
        assert "audit" in serialized
        assert "service_type" in serialized


class TestGenerateIdeasPayload:
    def _mock_llm(self, mock_llm_cls):
        from app.rag.ideas import Idea, IdeasPayload

        payload = IdeasPayload(
            ideas=[
                Idea(
                    title="AI Support Triage",
                    description="Auto-classify and route tickets.",
                    deliverables=["Classifier", "Dashboard"],
                    tech=["LangChain", "OpenAI"],
                    price_range="$8k–$15k",
                    time_estimate="3–5 weeks",
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
    @patch("app.rag.ideas.get_templates_retriever")
    def test_retrieves_with_filters_and_passes_context(self, mock_retriever_fn, mock_llm_cls):
        retriever = MagicMock()
        retriever.invoke.return_value = [
            Document(page_content="Fintech AML triage case study", metadata={"topic": "templates"}),
        ]
        mock_retriever_fn.return_value = retriever
        payload, structured_llm = self._mock_llm(mock_llm_cls)

        from app.rag.ideas import generate_ideas_payload

        result = generate_ideas_payload(
            "I run a fintech startup", industry="fintech", service_type="integration"
        )

        assert result is payload
        mock_retriever_fn.assert_called_once_with(industry="fintech", service_type="integration")
        retriever.invoke.assert_called_once_with("I run a fintech startup")
        prompt_text = str(structured_llm.invoke.call_args[0][0])
        assert "fintech" in prompt_text
        assert "AML triage" in prompt_text

    @patch("app.rag.ideas.ChatOpenAI")
    @patch("app.rag.ideas.get_templates_retriever")
    def test_drops_service_type_when_empty(self, mock_retriever_fn, mock_llm_cls):
        # First call (industry+service_type) returns empty; second (industry only) returns docs.
        empty_retriever = MagicMock()
        empty_retriever.invoke.return_value = []
        good_retriever = MagicMock()
        good_retriever.invoke.return_value = [
            Document(page_content="Fintech case", metadata={"topic": "templates"}),
        ]
        mock_retriever_fn.side_effect = [empty_retriever, good_retriever]
        self._mock_llm(mock_llm_cls)

        from app.rag.ideas import generate_ideas_payload

        generate_ideas_payload("desc", industry="fintech", service_type="audit")

        calls = mock_retriever_fn.call_args_list
        assert calls[0].kwargs == {"industry": "fintech", "service_type": "audit"}
        assert calls[1].kwargs == {"industry": "fintech", "service_type": None}

    @patch("app.rag.ideas.ChatOpenAI")
    @patch("app.rag.ideas.get_templates_retriever")
    def test_drops_industry_when_still_empty(self, mock_retriever_fn, mock_llm_cls):
        empty1 = MagicMock(); empty1.invoke.return_value = []
        empty2 = MagicMock(); empty2.invoke.return_value = []
        good = MagicMock()
        good.invoke.return_value = [Document(page_content="Any case", metadata={"topic": "templates"})]
        mock_retriever_fn.side_effect = [empty1, empty2, good]
        self._mock_llm(mock_llm_cls)

        from app.rag.ideas import generate_ideas_payload

        generate_ideas_payload("desc", industry="horse_stable", service_type=None)

        calls = mock_retriever_fn.call_args_list
        # Final call has both filters dropped
        assert calls[-1].kwargs == {"industry": None, "service_type": None}


class TestGenerateProjectIdeasTool:
    @patch("app.rag.chain.generate_ideas_payload")
    def test_returns_content_and_ideas_artifact(self, mock_gen):
        from app.rag.ideas import Idea, IdeasPayload

        mock_gen.return_value = IdeasPayload(
            ideas=[
                Idea(
                    title="Doc Search",
                    description="Semantic search over PDFs.",
                    deliverables=["Indexer", "Search UI"],
                    tech=["Qdrant"],
                    price_range="$5k–$10k",
                    time_estimate="2–4 weeks",
                ),
            ]
        )

        from app.rag.chain import generate_project_ideas

        msg = generate_project_ideas.invoke(
            {"type": "tool_call", "id": "i1", "name": "generate_project_ideas",
             "args": {"description": "fintech startup", "industry": "fintech"}}
        )

        assert isinstance(msg.content, str) and msg.content
        ideas = msg.artifact["ideas"]
        assert len(ideas) == 1
        assert ideas[0]["title"] == "Doc Search"
        assert ideas[0]["deliverables"] == ["Indexer", "Search UI"]
        mock_gen.assert_called_once_with("fintech startup", industry="fintech", service_type=None)
