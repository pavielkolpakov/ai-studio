# Frontend Redesign Plan

ChatGPT-style dark UI for Neuronetis chat.

## Design Decisions

| Decision | Choice |
|---|---|
| Theme | Dark-only, no light mode |
| Background | `#212121` page, `#2f2f2f` surfaces |
| Layout | Full viewport dark bg, centered column (~768px) |
| Text colors | `#ececec` primary, `#9b9b9b` muted |
| Accent | White/minimal for UI, golden-orange for CTAs only |
| Font | Geist Variable (keep) |
| Favicon | NN.png from `client/public/` |

## Components

### 1. Header
- Left: "Neuronetis" text wordmark
- Right: "Contact Us" button (placeholder — will wire to contact form + Calendly later)
- No subtitle
- Always visible (welcome + conversation)

### 2. Welcome State (empty chat)
- "Neuronetis" wordmark (text only, no logo image)
- Headline: **"Production AI for IT companies"**
- Description: "Custom AI development for tech companies. RAG, semantic search, AI Agents integration, fine-tuning."
- Suggestion buttons below
- No emoji, no "I'm your assistant" text

### 3. Chat Input
- ChatGPT-style dark rounded pill (`#2f2f2f` bg)
- Auto-expanding textarea
- Send button (white arrow icon) on the right
- Stop button replaces send while streaming
- No file attachment, no mic, no mode toggles
- Reference: https://21st.dev/r/easemize/chatgpt-prompt-input (visual style only)

### 4. Messages
- **User:** bubble style, right-aligned, `#2f2f2f` bg, white text
- **Assistant:** flat left-aligned, no bubble, document-style markdown rendering
- No sources display (remove SourcesList)

### 5. Streaming Effect
- Client-side token queue with variable-speed typewriter
- Slightly slower than raw SSE speed
- Natural pacing: faster for short words, slight pause after punctuation

### 6. Suggestion Buttons
- Single row, right above chat input
- Dark surface pills, subtle border, light text
- Hover: slight brightness change

### 7. Golden-Orange Gradient Border (reusable CTA style)
- Animated conic gradient border: `#f5a623` → `#f57202`
- Dark fill inside, same shape as regular suggestion buttons
- No hover animation change (static gradient rotation)
- Used for "Book a Call" CTA button (appears as special suggestion button when backend triggers CTA)

### 8. Contact Us (future)
- Header button is a placeholder
- Will connect to: contact form modal + Calendly integration
- Not implemented in this phase, just the button

## Files to Change

| File | Changes |
|---|---|
| `index.css` | Dark-only theme, remove light mode, update color vars |
| `index.html` | Set favicon to NN.png |
| `ChatPage.tsx` | New layout, welcome state, header with Contact Us |
| `ChatInput.tsx` | Redesign as dark rounded pill, add stop button |
| `MessageBubble.tsx` | User = bubble right, assistant = flat left, remove sources/CTA banner |
| `SuggestionButtons.tsx` | Single row, new styling, golden-orange CTA variant |
| `MessageList.tsx` | Update spacing for new message styles |
| `SourcesList.tsx` | Remove (delete file) |
| `CTABanner.tsx` | Remove (delete file) — CTA now shown as suggestion button |
| `api/chat.ts` | Add token queue with variable-speed flush |
| `types/chat.ts` | May need updates for CTA-as-suggestion |

## Contact Us + Calendly

### Contact Form (Modal)

- **Trigger**: "Contact Us" button in header (secondary/ghost style)
- **UI**: shadcn/ui `Dialog` modal, dark-themed to match app
- **Fields**: name (1–200 chars), email (valid email), message (1–5000 chars)
- **Session ID**: attached silently if chat session is active
- **Backend**: `POST /api/v1/contact` (rate-limited 5/hr per IP)
- **Validation**: hybrid — validate on submit, then inline for errored fields on correction
- **Success state**: replace form with "Thanks" message + "Book a Call" upsell button (Calendly popup)
- **Error handling**: inline error above Send button, form data preserved (no modal close)

### Calendly Integration

- **Approach**: Calendly popup widget (`Calendly.initPopupWidget()`). Fallback: inline embed if popup looks bad
- **URL**: `VITE_CALENDLY_URL` env var
- **Load**: Calendly JS SDK script tag, loaded on demand (not on page load)

### Header Changes

- Two separate buttons on the right:
  - "Contact Us" — secondary/ghost style, opens contact form modal
  - "Book a Call" — golden-orange gradient CTA style, opens Calendly popup
- Order: Contact Us | Book a Call (CTA on far right)

### Chat Suggestion: Book a Call

- "Book a Call" appears as golden-orange gradient suggestion button
- Only when backend returns CTA (existing CTA trigger logic)
- Opens Calendly popup on click (not the contact form)

### Files to Change

| File | Changes |
|---|---|
| `ContactModal.tsx` | New — modal with form, validation, success/error states, Book a Call upsell |
| `api/contact.ts` | New — `submitContact()` POST to `/api/v1/contact` |
| `ChatPage.tsx` | Import ContactModal, pass session_id, update header with both buttons |
| `SuggestionButtons.tsx` | Handle "Book a Call" CTA suggestion → Calendly popup |
| `lib/calendly.ts` | New — helper to load Calendly SDK + trigger popup |

### Implementation Order

1. `api/contact.ts` — POST helper
2. `ContactModal.tsx` — form + validation + success/error states
3. Wire "Contact Us" header button → modal
4. `lib/calendly.ts` — SDK loader + popup trigger
5. "Book a Call" header button → Calendly popup
6. "Book a Call" as CTA suggestion button in chat
7. Upsell in contact form success state → Calendly popup

## Agent Event Stream (follow-up for backend agent migration)

Backend is moving from LCEL to a LangChain agent with `search_knowledge_base` as a tool. SSE will expose agent events instead of raw tokens only.

### New SSE Event Shape

- `{type: "tool_call", tool: "search_knowledge_base", query: "..."}` — agent started a retrieval
- `{type: "token", token: "...", done: false}` — answer token (unchanged semantics)
- `{type: "done", sources: [...], cta: {...} | null}` — final event (unchanged payload)

Existing `{token, done}` shape stays compatible via `type: "token"` default.

### UI Changes

- Show transient "Searching knowledge base…" indicator on `tool_call`, hide on first `token` event
- `types/chat.ts` — add `ToolCallEvent` to `SSEEvent` union
- `api/chat.ts` — parse `type` field, dispatch to handlers
- `ChatPage.tsx` / `MessageList.tsx` — render searching state on the in-flight assistant message

Defer until backend agent PR lands.

## Idea Generation Mode

Backend adds a second tool `generate_project_ideas` (thick tool: retrieves `topic=use-cases` chunks itself and calls a structured-output LLM). Agent decides when to call it from the user's description. Frontend renders ideas as cards below the assistant message with a shared "Book a call" CTA.

### New SSE Event

- `{type: "ideas", ideas: Idea[]}` — emitted after the tool runs, before `done`

### Idea Shape

```ts
interface Idea {
  title: string;
  description: string;
  deliverables: string[];
  tech: string[];
  price_range: string;   // e.g. "$8k–$15k"
  time_estimate: string; // e.g. "3–5 weeks"
}
```

### Frontend Changes

| File | Changes |
|---|---|
| `types/chat.ts` | Add `Idea`; extend `SSEEvent` with `ideas` variant; add `ideas?: Idea[]` to `ChatMessage` |
| `components/IdeaCards.tsx` | New — grid of shadcn `Card`s + shared "Book a call" button (`openCalendlyPopup`) |
| `components/MessageBubble.tsx` | Render `<IdeaCards>` below markdown when `message.ideas` is set |
| `ChatPage.tsx` | Handle `event.type === "ideas"` → set `ideas` on the in-flight assistant message |

Tool-call indicator reuses existing "Searching knowledge base…" copy (acceptable — can specialize per `event.tool` later).

## Implementation Order (Original Redesign)

1. Theme + colors (index.css, remove light mode)
2. Favicon
3. Header redesign (Neuronetis + Contact Us)
4. Welcome state (headline, description, no fluff)
5. Chat input redesign (dark pill, stop button)
6. Message styles (user bubble right, assistant flat left)
7. Remove SourcesList + CTABanner
8. Suggestion buttons (single row, new style)
9. Golden-orange gradient border component
10. CTA as special suggestion button
11. Streaming token queue (variable-speed typewriter)
