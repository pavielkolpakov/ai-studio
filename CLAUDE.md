# Neuronetis

AI-powered business chat (FastAPI + LangChain + Postgres + React). Knowledge is served as plain text from a markdown vault — no embeddings/vector DB.

## Quick Start

```bash
docker compose up -d
cd src && alembic upgrade head              # Run migrations
cd src && uvicorn app.main:app --reload
```

## Project Layout

```
client/              # React frontend (Vite + Tailwind + shadcn/ui)
                     #   marketing site (/work /pricing /about) + chat assistant on /
                     #   see client/CLAUDE.md for routing + design tokens
src/
  app/
    api/v1/          # Routes: chat.py, health.py
    core/            # config.py, setup.py, db/
    crud/            # crud_conversations.py
    rag/             # agent chain, tools, ideas, guardrail, prompts
    vault/           # loader.py — reads docs/vault/ notes at runtime
    models/          # conversation.py (SQLAlchemy)
    schemas/         # chat.py (Pydantic)
    middleware/      # logger_middleware.py
  migrations/        # Alembic (run from src/)
  .env               # Config (not committed)
docs/vault/          # Knowledge base: markdown notes + generated index.md (served as text)
tests/               # pytest (run from project root)
```

## Key Details

- **Routes prefix**: `/api/v1/` (not `/api/`)
- **Postgres port**: 5433 (avoids local PG conflict on 5432)
- **Postgres creds**: aistudio/aistudio/aistudio (user/pass/db)
- **Alembic**: run from `src/`; migration files in `src/migrations/versions/` — always commit them
- **Python**: 3.14, venv at `.venv/`
- **LangChain**: 1.0 LTS (not 0.3)
- **Knowledge base**: `docs/vault/` Obsidian vault. `index.md` (routing table: each note's `read_when`) is injected into the agent system prompt; the agent reads individual notes on demand via the `read_knowledge_base` tool. No chunking, embeddings, or vector store. See `src/app/vault/loader.py`.
- **Idea generation**: separate two-step LLM mechanism over `docs/vault/projects/` — gpt-4o-mini selects 2-3 project notes, then a structured-output call adapts them. No retrieval. See `src/app/rag/ideas.py`.

## Deployment (Railway)

- **Dockerfile**: multi-stage build; copies `src/` and `docs/vault/` (vault is read at runtime), runs `alembic upgrade head` then `uvicorn` on startup
- **Postgres**: Railway-managed, connected via `DATABASE_URL` env var
- New model changes require a committed Alembic migration to take effect on deploy
- Editing knowledge base content = edit `docs/vault/` notes and commit; changes take effect on next deploy (no ingestion step). Keep `docs/vault/index.md` in sync with note `read_when` frontmatter.

## Rules

- Always use uv not pip
- Always commit Alembic migration files
- Always update related CLAUDE.md files after changes. Keep CLAUDE.md files as brief as possible.
- After changes use ruff and pytest for validation.
