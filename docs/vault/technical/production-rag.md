---
title: What Makes a RAG System Production-Quality
read_when: >
  user asks what separates a RAG demo from a real system, about hybrid search,
  metadata filtering, query expansion, HyDE, evaluation pipelines, or why their
  RAG prototype is not good enough for production
links:
  - "[[technical/rag-pipeline]]"
  - "[[projects/07-agentic-rag-platform]]"
  - "[[projects/08-evals-harness]]"
---

Most RAG demos are toy systems that work on clean data with simple queries. Production RAG requires:

- **Hybrid search:** combining dense vector search with sparse keyword search (BM25) improves recall on specific terms, names, and codes
- **Metadata filtering:** filtering by document type, date, department, or other attributes before semantic search
- **Query expansion / HyDE:** rewriting or expanding the user query before retrieval to improve match quality
- **Chunking strategy tuned to content:** legal documents, code, and conversational data each need different chunking approaches
- **Evaluation pipeline:** an automated way to measure retrieval precision and generation quality as you iterate
- **Graceful fallbacks:** handling queries outside the knowledge base scope without hallucinating
