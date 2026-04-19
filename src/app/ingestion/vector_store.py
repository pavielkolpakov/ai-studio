from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, PayloadSchemaType, VectorParams

from app.core.config import settings

EMBEDDING_DIMENSIONS = 1536


def get_qdrant_client() -> QdrantClient:
    return QdrantClient(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY or None,
    )


def get_embeddings() -> OpenAIEmbeddings:
    return OpenAIEmbeddings(
        model=settings.OPENAI_EMBEDDING_MODEL,
        api_key=settings.OPENAI_API_KEY,
    )


def recreate_collection(client: QdrantClient) -> None:
    """Delete and recreate the Qdrant collection."""
    collection = settings.QDRANT_COLLECTION
    if client.collection_exists(collection):
        client.delete_collection(collection)
    client.create_collection(
        collection_name=collection,
        vectors_config=VectorParams(
            size=EMBEDDING_DIMENSIONS,
            distance=Distance.COSINE,
        ),
    )
    client.create_payload_index(
        collection_name=collection,
        field_name="metadata.topic",
        field_schema=PayloadSchemaType.KEYWORD,
    )


def load_documents(
    documents: list[Document],
    client: QdrantClient,
    embeddings: OpenAIEmbeddings,
) -> None:
    """Embed and upload documents to Qdrant."""
    recreate_collection(client)

    QdrantVectorStore.from_documents(
        documents=documents,
        embedding=embeddings,
        collection_name=settings.QDRANT_COLLECTION,
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY or None,
    )
