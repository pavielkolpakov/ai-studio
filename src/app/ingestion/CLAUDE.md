# Ingestion Module

Wipe-and-reload pipeline: splits `docs/RAG.md` and `docs/project_templates.md` into chunks, embeds via OpenAI, stores in single Qdrant collection.

- `splitter.py` — markdown chunking. `load_and_split` (RAG.md, 800/100, topic+header metadata). `load_and_split_templates` (project_templates.md, 6000/200, one chunk per `### Example` case study, metadata `topic="templates"` + `service_type` (audit|integration|custom_app) + `industry` (fintech|devtools|marketing_sales|data_analytics, or None)).
- `vector_store.py` — `recreate_collection` indexes `metadata.topic`, `metadata.service_type`, `metadata.industry` as keywords.
- `__main__.py` — CLI: `python -m app.ingestion`. Loads both sources, concatenates, single wipe-and-upload.
