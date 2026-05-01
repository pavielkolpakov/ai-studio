# RAG Module

LangChain 1.0 agent with `search_knowledge_base` + `generate_project_ideas` tools.

- `chain.py` — `build_agent()` wires `create_agent` with both tools + `GuardrailMiddleware`. `search_knowledge_base(query)` retrieves across all topics; `generate_project_ideas(description, industry?, service_type?)` retrieves only from `topic=templates` (case studies). Agent infers `industry`/`service_type` from conversation context. `stream_response()` emits SSE events: `{type: "tool_call", tool, query}`, `{type: "token", token, done: false}`, `{type: "ideas", ideas}`, `{type: "done", cta}`.
- `ideas.py` — `get_templates_retriever(industry=None, service_type=None)` (Qdrant filtered to `topic=templates` + optional industry/service_type, k=4); `IdeasPayload`/`Idea` schemas; `generate_ideas_payload(description, industry, service_type)` runs retrieval + structured-output LLM (tagged `"ideas"`, streaming off). Filter fallback: industry+service_type → industry only → no filters (industry is the primary axis).
- `guardrail.py` — `GuardrailMiddleware.before_model` runs `classify_query` on first-turn Human messages only; rejection short-circuits via `Command(goto=END, update={messages: [AIMessage(REJECTION_MESSAGE)]})` so rejection streams as normal AI tokens.
- `prompts.py` — `AGENT_SYSTEM_PROMPT` (plain str, persona + tool-use instructions, tells agent to rephrase follow-ups itself) + `GUARDRAIL_PROMPT` (topic classifier YES/NO).
- `cta.py` — `maybe_cta()` returns CTA for topics services/process/use-cases.
