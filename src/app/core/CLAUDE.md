# Core Module

- `config.py` — Pydantic `Settings` model loaded from `.env`
- `setup.py` — FastAPI app factory (CORS, middleware, router mounting)
- `db/` — async SQLAlchemy engine + session factory (port 5433 local, Railway `DATABASE_URL` in prod)
- `logger.py` — logging config
