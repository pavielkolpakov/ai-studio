---
title: When Is RAG the Right Choice?
read_when: >
  user asks whether RAG fits their problem, when RAG is the wrong tool, or is
  deciding between RAG and some other approach
links:
  - "[[technical/finetuning-vs-rag-vs-prompting]]"
  - "[[technical/what-is-rag]]"
  - "[[opportunities/red-flags]]"
---

RAG is the right architecture when:
- You have a large, dynamic knowledge base that changes over time
- You need answers grounded in specific, citable sources
- You need to add AI to an existing knowledge corpus without retraining a model
- Your users need natural language access to internal data

RAG is NOT the right choice when:
- Your task requires deep domain-specific reasoning that general LLMs cannot handle (consider fine-tuning instead)
- Your knowledge base is very small and static (a simple system prompt may suffice)
- Latency is extremely critical and you cannot afford retrieval round-trips

For a fuller decision framework across all three approaches, see [[technical/finetuning-vs-rag-vs-prompting]].
