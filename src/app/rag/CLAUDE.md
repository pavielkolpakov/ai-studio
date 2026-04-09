# RAG Module

LCEL-based retrieval-augmented generation chain.

- `chain.py` — `build_chain()` builds rephrase->retrieve->answer pipeline; `stream_response()` yields JSON SSE events with tokens, sources, CTA
- `prompts.py` — `QA_PROMPT` (Neuronetis persona, context-grounded) + `REPHRASE_PROMPT` (follow-up->standalone)
- `cta.py` — `maybe_cta()` returns a CTA link when topics match services/process/use-cases
