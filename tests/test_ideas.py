import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.documents import Document


class TestGetCatalogRetriever:
    @patch("app.rag.ideas.QdrantVectorStore")
    @patch("app.rag.ideas.get_embeddings")
    @patch("app.rag.ideas.get_qdrant_client")
    def test_filters_topic_and_uses_k_3(self, _client, _embed, mock_vs_cls):
        mock_vs = MagicMock()
        mock_vs_cls.return_value = mock_vs
        mock_vs.as_retriever.return_value = MagicMock()

        from app.rag.ideas import get_catalog_retriever

        get_catalog_retriever()

        search_kwargs = mock_vs.as_retriever.call_args[1]["search_kwargs"]
        assert search_kwargs["k"] == 3
        serialized = search_kwargs["filter"].model_dump_json()
        assert "projects_catalog" in serialized
        assert "topic" in serialized
        assert "industry" not in serialized
        assert "service_type" not in serialized


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
                    price_range="$8k-$15k",
                    time_estimate="3-5 weeks",
                ),
                Idea(
                    title="Knowledge Base Assistant",
                    description="RAG over internal docs.",
                    deliverables=["Indexer", "Chat UI"],
                    tech=["Qdrant", "OpenAI"],
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
    @patch("app.rag.ideas.get_catalog_retriever")
    def test_single_retrieval_call_no_fallback(self, mock_retriever_fn, mock_llm_cls):
        retriever = MagicMock()
        retriever.invoke.return_value = [
            Document(
                page_content="RAG project catalog entry",
                metadata={"topic": "projects_catalog"},
            ),
        ]
        mock_retriever_fn.return_value = retriever
        payload, structured_llm = self._mock_llm(mock_llm_cls)

        from app.rag.ideas import generate_ideas_payload

        result = generate_ideas_payload("I run a B2B SaaS support team")

        assert result is payload
        mock_retriever_fn.assert_called_once_with()
        retriever.invoke.assert_called_once_with("I run a B2B SaaS support team")
        prompt_text = str(structured_llm.invoke.call_args[0][0])
        assert "B2B SaaS support team" in prompt_text
        assert "RAG project catalog entry" in prompt_text


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
                    tech=["Qdrant"],
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

        # Tool schema should not accept industry/service_type
        schema = generate_project_ideas.args_schema.model_json_schema()
        properties = schema.get("properties", {})
        assert "description" in properties
        assert "industry" not in properties
        assert "service_type" not in properties
