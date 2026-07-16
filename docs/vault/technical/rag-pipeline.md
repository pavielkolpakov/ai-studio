---
title: The RAG Pipeline, Step by Step
read_when: >
  user asks how a RAG system works internally, about chunking, embeddings,
  vector storage, similarity search, reranking, or wants the technical pipeline
  walked through end to end
links:
  - "[[technical/what-is-rag]]"
  - "[[technical/production-rag]]"
  - "[[technical/tech-stack]]"
---

**Ingestion phase (happens offline, on a schedule, or on document upload):**

1. **Document loading** — source data is loaded from wherever it lives: PDFs, Word docs, Notion, Confluence, databases, S3, APIs. We write custom loaders for each source.

2. **Chunking** — documents are split into smaller pieces (chunks). Chunk size and strategy matter significantly: too large and retrieval is imprecise; too small and individual chunks lack context. We typically use recursive character splitting with 512–1024 token chunks and meaningful overlap (100–200 tokens).

3. **Embedding** — each chunk is converted into a vector using an embedding model. We typically use OpenAI's text-embedding-3-small or text-embedding-3-large depending on quality requirements and cost.

4. **Vector storage** — vectors are stored in a vector database alongside the original chunk text and metadata. We use Qdrant for most production systems or pgvector for simpler use cases.

**Query phase (happens in real time, per user query):**

5. **Query embedding** — the user's question is converted to a vector using the same embedding model used during ingestion.

6. **Similarity search** — the vector database finds the top-K chunks whose vectors are most semantically similar to the query vector.

7. **Reranking (optional but recommended)** — a cross-encoder reranker re-scores the top-K results for relevance. This significantly improves precision in production systems.

8. **Context construction** — retrieved chunks are assembled into a context block with source metadata attached (document name, page, section).

9. **Generation** — the LLM receives a system prompt, the assembled context, and the user's query. It generates a grounded answer, citing the sources.

10. **Response delivery** — the answer is streamed back to the user with source citations displayed.
