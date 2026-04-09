# Neuronetis Backend

AI-powered business chat backend (FastAPI + LangChain + Qdrant + Postgres).

## Quick Start

```bash
docker compose up -d                        # Postgres (5433) + Qdrant (6333)
cd src && python -m app.ingestion           # Ingest RAG.md into Qdrant
cd src && uvicorn app.main:app --reload
```

## Project Layout

```
src/
  app/
    api/v1/          # Routes: chat.py, health.py
    core/            # config.py, setup.py, db/
    crud/            # crud_conversations.py
    ingestion/       # splitter.py, vector_store.py, __main__.py
    models/          # conversation.py (SQLAlchemy)
    schemas/         # chat.py (Pydantic)
    middleware/      # logger_middleware.py
  migrations/        # Alembic (run from src/)
  .env               # Config (not committed)
docs/RAG.md          # Source content for ingestion (55KB, 10 sections)
tests/               # pytest (run from project root)
```

## Key Details

- **Routes prefix**: `/api/v1/` (not `/api/`)
- **Postgres port**: 5433 (avoids local PG conflict on 5432)
- **Postgres creds**: aistudio/aistudio/aistudio (user/pass/db)
- **Alembic**: must run from `src/` directory
- **Python**: 3.14, venv at `.venv/`
- **LangChain**: 1.0 LTS (not 0.3)
- **Ingestion**: single Qdrant collection, wipe-and-reload, 800 token chunks / 100 overlap, top-k=4
- **Topic tags**: about, services, technical, use-cases, process, faq, projects

## Progress (per PLAN.md)

- Phase 1 (Foundation): Done
- Phase 2 (Ingestion): Done — splitter + vector store + CLI, needs `python -m app.ingestion` run
- Phase 3 (RAG Chain): Done — LCEL chain, history-aware rephrase, streaming, CTA injection
- Phase 4 (Chat API): Done — endpoints wired to RAG chain, SSE streaming, DB logging
- Phase 5 (Polish): Partial — validation + CORS + health done, no rate limiting

## Rules

- Always use uv not pip
