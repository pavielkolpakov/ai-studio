import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from langchain_core.documents import Document
from qdrant_client.models import Filter


class TestGetUseCasesRetriever:
    @patch("app.rag.ideas.QdrantVectorStore")
    @patch("app.rag.ideas.get_embeddings")
    @patch("app.rag.ideas.get_qdrant_client")
    def test_uses_k_6_and_filters_topic_use_cases(
        self, mock_client_fn, mock_embed_fn, mock_vs_cls
    ):
        mock_vs = MagicMock()
        mock_vs_cls.return_value = mock_vs
        mock_retriever = MagicMock()
        mock_vs.as_retriever.return_value = mock_retriever

        from app.rag.ideas import get_use_cases_retriever

        result = get_use_cases_retriever()

        assert result is mock_retriever
        search_kwargs = mock_vs.as_retriever.call_args[1]["search_kwargs"]
        assert search_kwargs["k"] == 6
        qfilter = search_kwargs["filter"]
        assert isinstance(qfilter, Filter)
        # Filter must reference topic == "use-cases"
        serialized = qfilter.model_dump_json()
        assert "use-cases" in serialized
        assert "topic" in serialized


class TestGenerateIdeasPayload:
    @patch("app.rag.ideas.ChatOpenAI")
    @patch("app.rag.ideas.get_use_cases_retriever")
    def test_retrieves_use_cases_and_returns_structured_ideas(
        self, mock_retriever_fn, mock_llm_cls
    ):
        from app.rag.ideas import Idea, IdeasPayload

        retriever = MagicMock()
        retriever.invoke.return_value = [
            Document(page_content="Support triage use case", metadata={"topic": "use-cases"}),
            Document(page_content="Semantic search use case", metadata={"topic": "use-cases"}),
        ]
        mock_retriever_fn.return_value = retriever

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
        llm = MagicMock()
        llm.with_structured_output.return_value = structured_llm
        mock_llm_cls.return_value = llm

        from app.rag.ideas import generate_ideas_payload

        result = generate_ideas_payload("I run a fintech startup")

        assert result is payload
        retriever.invoke.assert_called_once_with("I run a fintech startup")
        llm.with_structured_output.assert_called_once_with(IdeasPayload)
        # Prompt passed to LLM must include both the description and retrieved context
        prompt_arg = structured_llm.invoke.call_args[0][0]
        prompt_text = prompt_arg if isinstance(prompt_arg, str) else str(prompt_arg)
        assert "fintech" in prompt_text
        assert "Support triage" in prompt_text


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
             "args": {"description": "fintech startup"}}
        )

        assert isinstance(msg.content, str) and msg.content
        ideas = msg.artifact["ideas"]
        assert len(ideas) == 1
        assert ideas[0]["title"] == "Doc Search"
        assert ideas[0]["deliverables"] == ["Indexer", "Search UI"]
        mock_gen.assert_called_once_with("fintech startup")
