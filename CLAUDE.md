# Aithena Backend

AI-powered business chat backend (FastAPI + LangChain + Qdrant + Postgres).

## Quick Start

```bash
docker compose up -d          # Postgres (5433) + Qdrant (6333)
cd src && uvicorn app.main:app --reload
```

## Project Layout

```
src/
  app/
    api/v1/          # Routes: chat.py, health.py
    core/            # config.py, setup.py, db/
    crud/            # crud_conversations.py
    models/          # conversation.py (SQLAlchemy)
    schemas/         # chat.py (Pydantic)
    middleware/      # logger_middleware.py
  migrations/        # Alembic (run from src/)
  .env               # Config (not committed)
docs/RAG.md          # Source content for ingestion (55KB)
```

## Key Details

- **Routes prefix**: `/api/v1/` (not `/api/`)
- **Postgres port**: 5433 (avoids local PG conflict on 5432)
- **Postgres creds**: aistudio/aistudio/aistudio (user/pass/db)
- **Alembic**: must run from `src/` directory
- **Python**: 3.14, venv at `.venv/`

## Progress (per PLAN.md)

- Phase 1 (Foundation): Done
- Phase 2 (Ingestion): Not started — `docs/RAG.md` exists but no pipeline
- Phase 3 (RAG Chain): Not started — deps installed, no chain code
- Phase 4 (Chat API): Partial — endpoints work, DB logging works, RAG not wired
- Phase 5 (Polish): Partial — validation + CORS + health done, no rate limiting
