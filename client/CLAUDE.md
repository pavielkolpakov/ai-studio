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
- `src/components/SuggestionButtons.tsx` — dynamic chips, topic-based after responses
- `src/types/chat.ts` — `ChatMessage`, `SSEEvent`, `Source`, `CTA`

## SSE Event Format (from backend)

- Tokens: `data: {"token": "...", "done": false}`
- Final: `data: {"token": "", "done": true, "sources": [...], "cta": {...} | null}`

## Rules

- Use `@/` import alias for all src imports
- Use shadcn/ui components from `@/components/ui/`
- API base URL from `VITE_API_URL` env var
