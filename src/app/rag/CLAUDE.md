# RAG Module

LCEL-based retrieval-augmented generation chain.

- `chain.py` — `build_chain()` builds rephrase->retrieve->answer pipeline; `stream_response()` runs guardrail first, then yields JSON SSE events with tokens, sources, CTA
- `guardrail.py` — `classify_query()` calls gpt-4o-mini to reject off-topic queries before RAG chain runs; `REJECTION_MESSAGE` is the static response
- `prompts.py` — `QA_PROMPT` (Neuronetis persona, context-grounded) + `REPHRASE_PROMPT` (follow-up->standalone) + `GUARDRAIL_PROMPT` (topic classifier YES/NO)
- `cta.py` — `maybe_cta()` returns a CTA link when topics match services/process/use-cases
