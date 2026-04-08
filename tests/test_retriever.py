import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))


class TestGetRetriever:
    @patch("app.rag.chain.QdrantVectorStore")
    @patch("app.rag.chain.get_embeddings")
    @patch("app.rag.chain.get_qdrant_client")
    def test_returns_retriever_with_k_4(
        self, mock_client_fn, mock_embed_fn, mock_vs_cls
    ):
        mock_vs = MagicMock()
        mock_vs_cls.return_value = mock_vs
        mock_retriever = MagicMock()
        mock_vs.as_retriever.return_value = mock_retriever

        from app.rag.chain import get_retriever

        result = get_retriever()

        assert result is mock_retriever
        mock_vs.as_retriever.assert_called_once()
        call_kwargs = mock_vs.as_retriever.call_args
        assert call_kwargs[1]["search_kwargs"]["k"] == 4
