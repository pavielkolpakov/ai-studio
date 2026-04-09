# Ingestion Module

Wipe-and-reload pipeline: splits `docs/RAG.md` into chunks, embeds via OpenAI, stores in Qdrant.

- `splitter.py` — markdown-aware chunking (800 tokens / 100 overlap), attaches topic+header metadata
- `vector_store.py` — `get_qdrant_client()`, `get_embeddings()`, upserts chunks to single collection; uses Qdrant Cloud in prod, local Docker in dev
- `__main__.py` — CLI entry: `python -m app.ingestion`
