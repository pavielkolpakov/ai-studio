import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from langchain_core.documents import Document
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PointStruct

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from app.ingestion.vector_store import (
    EMBEDDING_DIMENSIONS,
    load_documents,
    recreate_collection,
)

COLLECTION = "test_collection"


@pytest.fixture
def qdrant_client():
    return QdrantClient(":memory:")


@pytest.fixture(autouse=True)
def _patch_settings(monkeypatch):
    monkeypatch.setattr("app.ingestion.vector_store.settings.QDRANT_COLLECTION", COLLECTION)
    monkeypatch.setattr("app.ingestion.vector_store.settings.QDRANT_URL", "http://localhost:6333")
    monkeypatch.setattr("app.ingestion.vector_store.settings.QDRANT_API_KEY", "")


class TestRecreateCollection:
    def test_creates_collection_when_none_exists(self, qdrant_client: QdrantClient):
        recreate_collection(qdrant_client)

        assert qdrant_client.collection_exists(COLLECTION)
        info = qdrant_client.get_collection(COLLECTION)
        vector_config = info.config.params.vectors
        assert vector_config.size == EMBEDDING_DIMENSIONS
        assert vector_config.distance == Distance.COSINE

    def test_creates_payload_index_for_topic(self):
        client = MagicMock()
        client.collection_exists.return_value = False
        recreate_collection(client)
        indexed_fields = {call.kwargs["field_name"] for call in client.create_payload_index.call_args_list}
        assert indexed_fields == {"metadata.topic"}

    def test_deletes_and_recreates_existing_collection(self, qdrant_client: QdrantClient):
        # Create initial collection
        recreate_collection(qdrant_client)
        # Insert a point so we can verify it gets wiped
        qdrant_client.upsert(
            collection_name=COLLECTION,
            points=[PointStruct(id=1, vector=[0.0] * EMBEDDING_DIMENSIONS, payload={"x": 1})],
        )
        assert qdrant_client.count(COLLECTION).count == 1

        # Recreate — should wipe
        recreate_collection(qdrant_client)

        assert qdrant_client.collection_exists(COLLECTION)
        assert qdrant_client.count(COLLECTION).count == 0


class TestLoadDocuments:
    @pytest.fixture
    def sample_docs(self):
        return [
            Document(page_content="Hello world", metadata={"topic": "test"}),
            Document(page_content="Goodbye world", metadata={"topic": "test"}),
        ]

    @patch("app.ingestion.vector_store.QdrantVectorStore.from_documents")
    def test_embeds_and_uploads_documents(
        self, mock_from_docs: MagicMock, qdrant_client: QdrantClient, sample_docs: list[Document]
    ):
        mock_embeddings = MagicMock()

        load_documents(sample_docs, qdrant_client, mock_embeddings)

        mock_from_docs.assert_called_once_with(
            documents=sample_docs,
            embedding=mock_embeddings,
            collection_name=COLLECTION,
            url="http://localhost:6333",
            api_key=None,
        )

    @patch("app.ingestion.vector_store.QdrantVectorStore.from_documents")
    def test_recreates_collection_before_upload(
        self, mock_from_docs: MagicMock, qdrant_client: QdrantClient, sample_docs: list[Document]
    ):
        mock_embeddings = MagicMock()

        load_documents(sample_docs, qdrant_client, mock_embeddings)

        assert qdrant_client.collection_exists(COLLECTION)
        info = qdrant_client.get_collection(COLLECTION)
        assert info.config.params.vectors.size == EMBEDDING_DIMENSIONS
