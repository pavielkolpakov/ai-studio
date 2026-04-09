# Neuronetis — Business Website Backend

## Overview

Neuronetis is a B2B AI development services company targeting tech/IT businesses. This repo contains the FastAPI backend powering the company website's chat feature. Visitors can ask questions about the company and get suggestions on how to integrate AI into their business. Conversations are logged for sales follow-up, and the chat surfaces a CTA (book a call / contact) at natural closing points.

## MVP Features

- RAG-powered chat endpoint using LangChain + Qdrant
- Streaming responses via FastAPI `StreamingResponse`
- In-session conversation history (context-aware follow-up questions)
- Document ingestion pipeline — splits source data into 4 namespaces: `faq`, `services`, `about`, `projects`
- Metadata-tagged retrieval for targeted, relevant answers
- Conversation logging to Postgres (session id, messages, timestamps)
- CTA injection — chat detects closing intent and surfaces a contact/booking link

## Out of Scope (v1)

- Admin UI for browsing conversation logs
- Authentication / API key management
- ~~Frontend / website UI~~ (done — `/client`)
- Deployment pipeline / CI-CD
- Multi-language support

## Tech Stack

| Layer      | Choice                          | Reason                                         |
| ---------- | ------------------------------- | ---------------------------------------------- |
| Framework  | FastAPI                         | Async, streaming-native, already in stack      |
| AI / RAG   | LangChain                       | Chains, retrieval, prompt management           |
| Vector DB  | Qdrant (self-hosted, Docker)    | Production-grade, strong LangChain integration |
| Embeddings | OpenAI `text-embedding-3-small` | Cost-effective, high quality                   |

| LLM | OpenAI `gpt-4o` | Best reasoning for consultant-style answers |
| Database | PostgreSQL | Conversation logging, reliable, familiar |
| ORM | SQLAlchemy + Alembic | Async support, migrations |

## Architecture

```
Client (website frontend)
        |
        | HTTP SSE (streaming)
        v
  FastAPI Backend
  ├── POST /chat          → main chat endpoint (streaming)
  ├── POST /chat/session  → create session
  └── ingestion scripts   → load & split docs into Qdrant
        |
        ├── LangChain RAG Chain
        │     ├── Retriever → Qdrant (namespace routing by topic)
        │     └── LLM → OpenAI gpt-4o (streaming)
        |
        ├── Qdrant (Docker)
        │     ├── collection: faq
        │     ├── collection: services
        │     ├── collection: about
        │     └── collection: projects
        |
        └── PostgreSQL
              └── table: conversations (session_id, messages jsonb, created_at)
```

## Implementation Phases

### Phase 1 — Foundation

- [ ] Initialize FastAPI project structure
- [ ] Set up Docker Compose with Qdrant + Postgres
- [ ] Configure SQLAlchemy async + Alembic migrations
- [ ] Create `conversations` table schema
- [ ] Set up environment config (`.env`, settings model)

### Phase 2 — Ingestion Pipeline

- [ ] Split source document into 4 sections: faq, services, about, projects
- [ ] Build ingestion script to chunk and embed each section
- [ ] Upload to Qdrant with metadata tags (`source`, `topic`)
- [ ] Validate retrieval quality with test queries

### Phase 3 — RAG Chain

- [ ] Build LangChain retrieval chain with Qdrant retriever
- [ ] Add conversation history / memory (per session)
- [ ] Tune prompt — company assistant persona, CTA awareness
- [ ] Test multi-turn conversations and retrieval accuracy

### Phase 4 — Chat API

- [ ] `POST /chat/session` — create session, return session_id
- [ ] `POST /chat` — accepts session_id + message, returns SSE stream
- [ ] Log each conversation turn to Postgres
- [ ] CTA injection — detect low-confidence or closing signals, append contact link

### Phase 5 — Polish

- [ ] Input validation and error handling
- [ ] Rate limiting (per IP or session)
- [ ] CORS configuration for frontend domain
- [ ] Basic health check endpoint

### Phase 6 — Frontend (Chat UI)

- [x] Vite + React 19 + TypeScript scaffold in `/client`
- [x] Tailwind CSS v4 + shadcn/ui
- [x] SSE streaming API client
- [x] Chat page with message bubbles, markdown rendering
- [x] Dynamic suggestion buttons (initial + topic-based)
- [x] Sources display + CTA banner
- [x] Responsive layout, error handling, keyboard shortcuts

## Backlog

- Admin UI for browsing and filtering conversation logs
- Protected `/admin/conversations` API endpoint
- Auth layer (API keys or JWT) for admin access
- Analytics: most asked topics, drop-off points

## Open Questions

- What LLM fallback if OpenAI is unavailable? (consider Anthropic Claude as backup)
- Should Qdrant use a single collection with metadata filtering, or separate collections per topic?
- Max conversation history length before truncation — token budget TBD
- CTA trigger logic — rule-based (keywords) or LLM-classified intent?
