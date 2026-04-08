# API Module

Routes under `/api/v1/`.

- `health.py` — `GET /health` liveness check
- `chat.py` — `POST /chat/session` (new session_id), `POST /chat` (SSE streaming RAG response, saves messages to DB)
