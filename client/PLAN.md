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

## Implementation Order

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
