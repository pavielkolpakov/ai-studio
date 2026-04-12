# Models Module

- `conversation.py` — `Conversation` SQLAlchemy model: id (UUID), session_id, messages (JSONB array), created_at
- `contact.py` — `ContactSubmission` model: name, email, message, session_id (optional), ip_address, transcript (JSONB)
