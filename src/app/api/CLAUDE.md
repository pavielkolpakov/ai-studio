# API Module

Routes under `/api/v1/`.

- `health.py` — `GET /health` liveness check
- `chat.py` — `POST /chat/session` (new session_id), `POST /chat` (SSE streaming RAG response, saves messages to DB)
- `contact.py` — `POST /contact` (stores submission in DB, sends HTML email via Resend, includes chat transcript if session_id provided, IP rate-limited 5/hr)
