# Neuronetis

AI-powered business chat (FastAPI + LangChain + Qdrant + Postgres + React).

## Quick Start

```bash
docker compose up -d
cd src && alembic upgrade head              # Run migrations
cd src && python -m app.ingestion           # Ingest RAG.md into Qdrant
cd src && uvicorn app.main:app --reload
```

## Project Layout

```
client/              # React frontend (Vite + Tailwind + shadcn/ui)
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
docs/RAG.md          # Source content for ingestion (9 sections)
tests/               # pytest (run from project root)
```

## Key Details

- **Routes prefix**: `/api/v1/` (not `/api/`)
- **Postgres port**: 5433 (avoids local PG conflict on 5432)
- **Postgres creds**: aistudio/aistudio/aistudio (user/pass/db)
- **Alembic**: run from `src/`; migration files in `src/migrations/versions/` — always commit them
- **Python**: 3.14, venv at `.venv/`
- **LangChain**: 1.0 LTS (not 0.3)
- **Qdrant**: Qdrant Cloud in prod; local Docker instance for dev (port 6333)
- **Ingestion**: single Qdrant collection, wipe-and-reload, 800 token chunks / 100 overlap, top-k=4
- **Topic tags**: about, services, technical, use-cases, process, faq (RAG.md), projects_catalog (neuronetis-project-catalog.md, one chunk per numbered project; used by idea-generation retrieval, k=3)

## Deployment (Railway)

- **Dockerfile**: multi-stage build, runs `alembic upgrade head` then `uvicorn` on startup
- **Postgres**: Railway-managed, connected via `DATABASE_URL` env var
- **Qdrant**: Qdrant Cloud (not Railway), connected via `QDRANT_URL` + `QDRANT_API_KEY`
- New model changes require a committed Alembic migration to take effect on deploy

## Rules

- Always use uv not pip
- Always commit Alembic migration files
- Always update related CLAUDE.md files after changes. Keep CLAUDE.md files as brief as possible.
- After changes use ruff and pytest for validation.
