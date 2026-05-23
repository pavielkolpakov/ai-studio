# Ingestion Module

Wipe-and-reload pipeline: splits `docs/RAG.md` and `docs/neuronetis-project-catalog.md` into chunks, embeds via OpenAI, stores in single Qdrant collection.

- `splitter.py` - markdown chunking. `load_and_split` (RAG.md, 800/100, topic+header metadata). `load_and_split_catalog` (neuronetis-project-catalog.md, one Document per `## N. Title` numbered project, no recursive split; metadata `topic="projects_catalog"`, header stripped of leading numbering).
- `vector_store.py` - `recreate_collection` indexes `metadata.topic` as keyword.
- `__main__.py` - CLI: `python -m app.ingestion`. Loads both sources, concatenates, single wipe-and-upload.
