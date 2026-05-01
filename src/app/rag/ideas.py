from langchain_openai import ChatOpenAI
from langchain_qdrant import QdrantVectorStore
from pydantic import BaseModel, Field
from qdrant_client.models import FieldCondition, Filter, MatchValue

from app.core.config import settings
from app.ingestion.vector_store import get_embeddings, get_qdrant_client
from app.rag.prompts import IDEAS_GENERATION_PROMPT


class Idea(BaseModel):
    title: str = Field(description="Short, punchy name of the AI project idea.")
    description: str = Field(description="1–2 sentence scope of the idea.")
    deliverables: list[str] = Field(description="3–5 concrete deliverable bullets.")
    tech: list[str] = Field(description="Key technologies / frameworks involved.")
    price_range: str = Field(description="Rough price range, e.g. '$8k–$15k'.")
    time_estimate: str = Field(description="Rough time estimate, e.g. '3–5 weeks'.")


class IdeasPayload(BaseModel):
    ideas: list[Idea] = Field(description="Between 3 and 5 tailored AI project ideas.")


def get_templates_retriever(
    industry: str | None = None,
    service_type: str | None = None,
):
    """Qdrant retriever scoped to topic=templates with optional industry/service_type filters."""
    client = get_qdrant_client()
    embeddings = get_embeddings()
    vector_store = QdrantVectorStore(
        client=client,
        collection_name=settings.QDRANT_COLLECTION,
        embedding=embeddings,
    )
    must = [FieldCondition(key="metadata.topic", match=MatchValue(value="templates"))]
    if industry:
        must.append(FieldCondition(key="metadata.industry", match=MatchValue(value=industry)))
    if service_type:
        must.append(FieldCondition(key="metadata.service_type", match=MatchValue(value=service_type)))
    return vector_store.as_retriever(search_kwargs={"k": 4, "filter": Filter(must=must)})


def generate_ideas_payload(
    description: str,
    industry: str | None = None,
    service_type: str | None = None,
) -> IdeasPayload:
    """Retrieve relevant case-study templates and ask a structured-output LLM for 3–5 tailored ideas.

    Filter fallback: industry + service_type → industry only → no filters.
    """
    docs: list = []
    # Try with both filters, then drop service_type, then drop industry.
    filter_tries = [
        {"industry": industry, "service_type": service_type},
        {"industry": industry, "service_type": None},
        {"industry": None, "service_type": None},
    ]
    seen: set[tuple[str | None, str | None]] = set()
    for kwargs in filter_tries:
        key = (kwargs["industry"], kwargs["service_type"])
        if key in seen:
            continue
        seen.add(key)
        retriever = get_templates_retriever(**kwargs)
        docs = retriever.invoke(description)
        if docs:
            break

    context = "\n\n".join(d.page_content for d in docs)

    llm = ChatOpenAI(
        model=settings.OPENAI_CHAT_MODEL,
        api_key=settings.OPENAI_API_KEY,
        streaming=False,
    )
    structured_llm = llm.with_structured_output(IdeasPayload).with_config(tags=["ideas"])
    prompt = IDEAS_GENERATION_PROMPT.format(description=description, context=context)
    return structured_llm.invoke(prompt)
