# Client (Frontend)

React 19 + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui.

## Quick Start

```bash
cd client && npm run dev   # localhost:3000
```

Requires backend running on localhost:8000 (CORS configured).

## Key Files

- `src/api/chat.ts` — `createSession()` + `sendMessage()` (SSE via ReadableStream)
- `src/components/ChatPage.tsx` — main page, all state logic (session, messages, streaming, suggestions)
- `src/components/SuggestionButtons.tsx` — dynamic chips, topic-based after responses; CTA suggestions open Calendly
- `src/components/ContactModal.tsx` — contact form modal with validation, success state + Book a Call upsell
- `src/api/contact.ts` — `submitContact()` POST to `/api/v1/contact`
- `src/lib/calendly.ts` — on-demand Calendly SDK loader + popup trigger
- `src/types/chat.ts` — `ChatMessage`, `SSEEvent` (discriminated union), `CTA`

## SSE Event Format (from backend)

Discriminated by `type`:
- `{type: "tool_call", tool: "search_knowledge_base", query: "..."}` — agent invoked retrieval; UI swaps "Thinking…" → "Searching knowledge base…"
- `{type: "token", token: "...", done: false}` — answer token
- `{type: "ideas", ideas: Idea[]}` — tailored AI project ideas (from `generate_project_ideas` tool); rendered as cards by `IdeaCards`
- `{type: "done", cta: {...} | null}` — final event

## Rules

- Use `@/` import alias for all src imports
- Use shadcn/ui components from `@/components/ui/`
- API base URL from `VITE_API_URL` env var
- Calendly URL from `VITE_CALENDLY_URL` env var
