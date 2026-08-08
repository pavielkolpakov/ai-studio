# Client (Frontend)

React 19 + Vite + TypeScript + Tailwind CSS v4 + shadcn/ui.

## Quick Start

```bash
cd client && npm run dev   # localhost:3000
```

Requires backend running on localhost:8000 (CORS configured).

## Routing

`react-router-dom` (`src/App.tsx`). `SiteLayout` wraps all routes with header + footer; `BookCta` renders on every route except `/`.

- `/` → `HomePage` → `ChatPage`. The hero **is** the assistant: its input bar is the real `ChatInput`, its chips the real `SuggestionButtons`. Sending swaps the hero for the message thread.
- `/work`, `/pricing`, `/about` — marketing pages, layout only; copy lives in `src/data/site.ts`.

**Deploy requirement:** these are client-side routes. The static host must rewrite unknown paths to `index.html` (e.g. Netlify `_redirects`, Vercel `rewrites`, Caddy `try_files`), or `/work` 404s on direct load. No such config is in the repo yet.

## Design System

Ported from the "Neuronetis Site" Claude Design project. Tokens in `src/index.css`:

- Fonts: `font-heading` (Space Grotesk, all headings), `font-sans` (IBM Plex Sans, body), `font-mono` (JetBrains Mono, eyebrows/labels/metrics)
- Surfaces: `bg-background` #0B0B0C, `bg-surface` #101012 (cards), `bg-surface-raised` #121214 (input, panels), `bg-surface-sunken` #08080A (image slots)
- Text: `text-foreground` → `text-body-text` → `text-muted-foreground` → `text-dim-text` → `text-faint-text`
- Accent: `text-steel` #A3B3C9 (eyebrows, checkmarks, rules) — the only non-neutral colour
- Borders: `border-hairline` (white/8%), `border-hairline-strong` (white/14%)
- Helper classes: `.eyebrow` (mono uppercase label), `.btn-primary` (solid white CTA)

`src/components/site/ImagePlaceholder.tsx` stands in for the design's `<image-slot>` — replace with real art on Work/About.

## Key Files

- `src/api/chat.ts` — `createSession()` + `sendMessage()` (SSE via ReadableStream)
- `src/components/ChatPage.tsx` — home page: hero (empty state) + message thread, all chat state logic (session, messages, streaming, suggestions)
- `src/data/site.ts` — all marketing copy (catalog, plans, phases, stack, FAQs, team)

## Marketing Copy Rule

`src/data/site.ts` is transcribed from `docs/vault/` — the same notes the chat assistant reads — and each export carries a comment naming its source note. **Never add a price, timeline, metric or claim the vault doesn't state**; edit the vault note first, then mirror it here, or the page and the assistant will contradict each other. Third-party benchmarks (e.g. "30–60% fewer tickets") must keep their attribution in the label — they are not our own client results. The vault contains no case studies or team names, so `PEOPLE` and the `ImagePlaceholder` slots stay placeholders until real assets exist.
- `src/components/SuggestionButtons.tsx` — dynamic chips. Three sources: `INITIAL_SUGGESTIONS` (pre-message, hardcoded in ChatPage), `CACHED_ANSWERS[key].followups` (cached responses), backend `done.followups` (freeform LLM responses). Clicked ids tracked in a session-scoped `Set<string>` in ChatPage state and filtered out of incoming picks. If <2 remain after filter, "Book a call" is appended.
- `src/components/ContactModal.tsx` — contact form modal with validation, success state + Book a Call upsell
- `src/api/contact.ts` — `submitContact()` POST to `/api/v1/contact`
- `src/lib/calendly.ts` — on-demand Calendly SDK loader + popup trigger
- `src/types/chat.ts` — `ChatMessage`, `SSEEvent` (discriminated union), `FollowupPick`, `Idea`

## SSE Event Format (from backend)

Discriminated by `type`:
- `{type: "tool_call", tool: "read_knowledge_base", query: "..."}` — agent read KB notes (`query` is the joined note names); UI swaps "Thinking…" → "Searching knowledge base…"
- `{type: "token", token: "...", done: false}` — answer token
- `{type: "ideas", ideas: Idea[]}` — tailored AI project ideas (from `generate_project_ideas` tool); rendered as cards by `IdeaCards`
- `{type: "done", followups?: FollowupPick[]}` — final event. `followups` is a list of `{id, text, cacheKey?, action?}` picked server-side from a fixed pool by a gpt-4o-mini call. Empty/absent → frontend renders nothing then appends "Book a call" via the <2-fallback rule.

## Rules

- Use `@/` import alias for all src imports
- Use shadcn/ui components from `@/components/ui/`
- API base URL from `VITE_API_URL` env var
- Calendly URL from `VITE_CALENDLY_URL` env var
