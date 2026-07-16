---
title: "FAQ: AI and Expectations"
read_when: >
  user asks whether the AI will be accurate, whether it will hallucinate, what
  happens with out-of-scope questions, what happens when OpenAI changes models
  or pricing, model lock-in, or how quality is maintained over time
links:
  - "[[technical/production-rag]]"
  - "[[projects/08-evals-harness]]"
  - "[[opportunities/red-flags]]"
---

**Can you guarantee the AI will be accurate?**
No one can guarantee 100% accuracy from an LLM-based system. What we can do: design for high precision through careful retrieval architecture, implement evaluation pipelines that measure accuracy before launch, add confidence scoring and human-in-the-loop for low-confidence outputs, and iterate on quality after launch. We will tell you upfront what accuracy level is realistic for your use case.

**Will the system hallucinate?**
A well-built RAG system is specifically designed to minimize hallucination by grounding every answer in retrieved sources. It is not zero — the LLM can still misread or miscombine retrieved context. This is why we implement source citations, confidence scoring, and graceful fallback behavior for out-of-scope queries. We also build evaluation sets to measure and track hallucination rate during development.

**How do you handle queries that are outside the knowledge base?**
We design explicit fallback behavior. When retrieval confidence is low, the system says so rather than generating a confident-sounding wrong answer. Honest uncertainty is better than silent hallucination.

**What happens when OpenAI changes their models or pricing?**
We build systems that are as model-agnostic as reasonable. The LLM is typically behind a configuration variable, not hardcoded. If you want to switch from GPT-4o to Claude or a self-hosted model, the change is a configuration update plus testing — not a rewrite.

**How do you make sure the AI keeps working correctly over time?**
Every production system we build includes an eval harness — a set of test cases that run automatically to catch regressions before they reach users. We also set up production observability (LangSmith or Langfuse) so you can monitor answer quality, latency, and cost in real time. This is what separates a system that degrades silently from one you can trust over time.
