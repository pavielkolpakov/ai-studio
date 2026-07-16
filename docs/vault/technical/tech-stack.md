---
title: Our Technology Stack
read_when: >
  user asks what tools, frameworks, languages, models, or infrastructure we use;
  asks about FastAPI, Python, Qdrant, pgvector, Pinecone, LangChain, LlamaIndex,
  embedding models, vLLM, LoRA, LangSmith, Langfuse, Braintrust, RAGAS, Docker,
  AWS, Azure, or Railway; or asks whether we work in a language other than Python
links:
  - "[[technical/integrations]]"
  - "[[technical/rag-pipeline]]"
  - "[[about/location-and-team]]"
---

We are opinionated about tools. We use technologies we have deployed in production and understand deeply — not whatever is newest or most hyped.

## Backend Framework: FastAPI (Python)

We build all AI backends in FastAPI. Python is the lingua franca of AI/ML engineering — all major model libraries, embedding tools, and LLM frameworks are Python-first. FastAPI gives us high performance (async by default), automatic OpenAPI documentation, strong typing with Pydantic, and a clean pattern for streaming responses via Server-Sent Events.

Our team is experienced with TypeScript, Go and Rust. If a customer's project is written in a different language, the details are discussed individually.

## Vector Databases

**Qdrant** — our default for most production RAG systems. Purpose-built for vector search, supports filtering, payload storage, and hybrid search (dense + sparse) natively. Fast, well-maintained, and can be self-hosted.

**pgvector** — our choice when the client already runs PostgreSQL and wants to minimize infrastructure complexity. Entirely sufficient for knowledge bases under ~1 million vectors.

**Pinecone** — when a client requires a fully managed, serverless vector database with no infrastructure overhead.

## Embedding Models

**OpenAI text-embedding-3-small** — our default for most use cases. Excellent quality-to-cost ratio, adequate for the vast majority of production RAG systems.

**OpenAI text-embedding-3-large** — when retrieval quality is critical and cost is secondary.

**FastEmbed** — lightweight, fast Python library natively compatible with the Qdrant database.

**Local embedding models (e5-large, bge-m3, nomic-embed)** — when a client has data privacy requirements and cannot send data to external APIs.

## RAG Frameworks

**LangChain** — we use LangChain's document loaders, text splitters, and retrieval chains.

**LlamaIndex** — preferred for complex document hierarchies, multi-document reasoning, and structured data integration.

**Direct API** — for simpler systems, we skip frameworks entirely and call the OpenAI / Qdrant APIs directly. Less abstraction, more control, easier debugging.

## Fine-Tuning Stack

**HuggingFace Transformers + PEFT / LoRA** — for all fine-tuning work. LoRA fine-tunes a small number of additional parameters rather than updating all model weights, dramatically reducing compute cost and training time.

**Weights & Biases** — experiment tracking for all training runs.

**vLLM** — our preferred serving framework for open-source models in production.

## Observability and Evals

**LangSmith / Langfuse / Arize** — for production tracing, prompt monitoring, and regression detection.

**Braintrust** — LLM eval orchestration, datasets, CI integration. Most senior-eng-favored right now.

**RAGAS** — RAG-specific retrieval + generation metrics.

**Custom eval harnesses** — golden test sets, LLM-as-judge metrics, and CI/CD eval gates for all production AI systems.

## Infrastructure

**Docker + Docker Compose** — all services are containerized.

**AWS / Azure** — for production cloud deployments, especially for clients with enterprise compliance requirements.

**Railway / Render** — for lighter deployments, staging environments, and smaller-scale productions.
