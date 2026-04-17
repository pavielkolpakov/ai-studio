# RAG Module

LangChain 1.0 agent with `search_knowledge_base` tool.

- `chain.py` — `build_agent()` wires `create_agent` with the tool + `GuardrailMiddleware`; `search_knowledge_base` tool returns `content_and_artifact` (artifact carries topics for CTA); `stream_response()` emits SSE events: `{type: "tool_call", tool, query}`, `{type: "token", token, done: false}`, `{type: "done", cta}`. No `sources` field.
- `guardrail.py` — `GuardrailMiddleware.before_model` runs `classify_query` on first-turn Human messages only; rejection short-circuits via `Command(goto=END, update={messages: [AIMessage(REJECTION_MESSAGE)]})` so rejection streams as normal AI tokens.
- `prompts.py` — `AGENT_SYSTEM_PROMPT` (plain str, persona + tool-use instructions, tells agent to rephrase follow-ups itself) + `GUARDRAIL_PROMPT` (topic classifier YES/NO).
- `cta.py` — `maybe_cta()` returns CTA for topics services/process/use-cases.
