# RAG Module

LangChain 1.0 agent with `search_knowledge_base` + `generate_project_ideas` tools.

- `chain.py` — `build_agent()` wires `create_agent` with both tools + `GuardrailMiddleware`. `search_knowledge_base` artifact carries topics for CTA; `generate_project_ideas` artifact carries `ideas`. `stream_response()` emits SSE events: `{type: "tool_call", tool, query}`, `{type: "token", token, done: false}`, `{type: "ideas", ideas}`, `{type: "done", cta}`. No `sources` field.
- `ideas.py` — `get_use_cases_retriever()` (Qdrant retriever filtered to `topic=use-cases`, k=6); `IdeasPayload`/`Idea` Pydantic schemas; `generate_ideas_payload(description)` runs retrieval + structured-output LLM (tagged `"ideas"`, streaming off, so its JSON doesn't leak into the agent's token stream).
- `guardrail.py` — `GuardrailMiddleware.before_model` runs `classify_query` on first-turn Human messages only; rejection short-circuits via `Command(goto=END, update={messages: [AIMessage(REJECTION_MESSAGE)]})` so rejection streams as normal AI tokens.
- `prompts.py` — `AGENT_SYSTEM_PROMPT` (plain str, persona + tool-use instructions, tells agent to rephrase follow-ups itself) + `GUARDRAIL_PROMPT` (topic classifier YES/NO).
- `cta.py` — `maybe_cta()` returns CTA for topics services/process/use-cases.
