# AI Studio — Knowledge Base Documents

10 documents ready to ingest into your RAG system.

---

# What We Do and Who We Are

## Studio overview

We are an AI engineering studio that builds production-grade AI systems for IT companies and software product teams. We specialize in integrating artificial intelligence directly into existing software products and building new AI-native applications from the ground up.

We are not a general software agency. We focus exclusively on AI engineering — retrieval-augmented generation (RAG), semantic search, LLM integration, fine-tuning, and AI-powered application development. This focus means our team works with these systems every day, which translates to faster delivery, fewer surprises, and better architectural decisions for our clients.

## Who we work with

Our clients are typically:
- IT product companies (50–500 employees) that have an existing SaaS product and want to add AI capabilities to stay competitive
- Software development companies that need an AI subcontractor they can engage on a project basis for their own clients
- Scale-ups and growth-stage companies sitting on large proprietary datasets (documents, support tickets, logs, product data) who need to make that data intelligent and queryable
- AI-first startups with a funded idea but no in-house ML or AI engineering capability, who need to ship fast

We work best with clients who have a technical team internally — a CTO, VP of Engineering, or technical lead who understands software architecture. We don't replace your team; we extend it with deep AI expertise.

## What we are not

We do not build generic chatbots powered by a system prompt. We do not resell OpenAI wrappers. We do not take on projects where the client wants AI for the sake of AI with no clear use case. Every engagement starts with understanding your actual problem, and we will tell you honestly if AI is not the right solution for it.

## Our values as a studio

**We don't lock you in.** All code we write is yours. We document everything as if we'll never speak again. Your team should be able to maintain and extend everything we build.

**We price by project, not by hour.** Fixed-scope engagements give you cost certainty. We scope carefully upfront so we don't surprise you with overruns.

**We work asynchronously and transparently.** You see progress continuously through shared project management tools, not just at a final delivery. Weekly check-ins are standard on all projects.

**We take on 3–4 projects per quarter.** We deliberately limit capacity so every client gets senior-level attention throughout the engagement, not a junior developer handed a spec.

## Our location and setup

We are a distributed studio. Our lead engineers are based in Eastern Europe with client delivery experience across the EU, Israel, and North America. We work in European and overlap-friendly time zones and are fluent in English for all technical communication.

---

# Our Services

We offer four core service types. Each is a fixed-scope engagement with a defined deliverable, timeline, and starting price. All projects begin with a 1-week discovery phase.

---

## 1. AI Feature Integration

**What it is:** We embed AI capabilities into your existing product — adding intelligence to features that currently operate without it. This could mean adding semantic search to replace keyword search, integrating an LLM-powered assistant into your product's UI, building an AI-driven recommendation engine, or automating a workflow that currently requires manual human judgment.

**Who it's for:** Product companies with a working SaaS or internal tool that wants to feel smarter. Your core product is built; you need AI layered in without a full rewrite.

**What we deliver:** Production-ready AI features integrated into your existing codebase, with full documentation, test coverage, and a handover session for your team.

**Typical stack:** FastAPI or integration with your existing backend, OpenAI / Anthropic APIs, LangChain or direct API calls, your existing database extended with pgvector or a separate Qdrant collection.

**Timeline:** 3–6 weeks depending on scope.

**Starting from:** $5,000. Typical engagements run $8,000–$15,000.

---

## 2. RAG Systems and Knowledge Pipelines

**What it is:** We build retrieval-augmented generation systems that let your users (or your team) query your internal knowledge intelligently. This means natural language questions answered accurately from your actual data — documents, wikis, support tickets, product manuals, codebases, databases.

**Who it's for:** Companies with large unstructured or semi-structured internal data that is currently hard to search, summarize, or reason over. Common examples: a SaaS company with thousands of support tickets, a professional services firm with years of reports and documents, a developer tools company that wants users to query their documentation conversationally.

**What we deliver:** A complete RAG pipeline — document ingestion, chunking, embedding, vector storage, retrieval logic, reranking, and a generation layer with LLM — plus an API your frontend can consume and a basic admin interface for managing the knowledge base.

**Typical stack:** FastAPI, LangChain or LlamaIndex, OpenAI embeddings (text-embedding-3-small or large), Qdrant or pgvector, GPT-4o or Claude for generation, async ingestion worker.

**Timeline:** 4–8 weeks.

**Starting from:** $8,000. Typical engagements run $12,000–$25,000.

---

## 3. Custom AI Application Development

**What it is:** We design and build a new AI-native application from scratch. This is for clients who have an AI product idea — a tool, platform, or internal system — and need a team to architect and build it end to end.

**Who it's for:** Startups with seed or Series A funding and an AI product concept. Companies that want to build an internal AI tool that doesn't exist yet. Teams that have tried to scope this internally but lack the ML/AI architecture experience to start confidently.

**What we deliver:** A fully functional production application — backend (FastAPI), AI layer (RAG, agents, fine-tuned models, or a combination), data layer (relational + vector), and frontend if required. Includes infrastructure setup, CI/CD, documentation, and a 30-day post-launch support window.

**Timeline:** 6–16 weeks depending on complexity.

**Starting from:** $15,000. Typical engagements run $20,000–$50,000.

---

## 4. Model Fine-Tuning and Custom Model Development

**What it is:** When off-the-shelf models don't perform well enough on your specific domain, we fine-tune or train models on your data. This produces a model that understands your terminology, your product, your edge cases — and performs significantly better than a prompted general model on your specific task.

**Who it's for:** Companies with a specific, well-defined task where general LLMs underperform. Examples: a legal tech company that needs accurate clause classification, a medical software company that needs clinical note summarization, a developer tools company that needs code completion in a proprietary language or framework, a fintech that needs named entity extraction on financial documents.

**What we deliver:** Fine-tuned model weights (LoRA adapters or full fine-tune depending on requirements), evaluation pipeline with benchmark results before and after, model serving setup (vLLM, HuggingFace Inference Endpoints, or custom), and documentation.

**Typical stack:** HuggingFace Transformers, PEFT/LoRA, Weights & Biases for experiment tracking, vLLM or TGI for serving, Python training pipeline.

**Timeline:** 4–10 weeks including data preparation, training runs, and evaluation.

**Starting from:** $10,000. Typical engagements run $15,000–$40,000.

---

## Add-on: Monthly Retainer

After completing a project, many clients engage us on a monthly retainer for ongoing work: expanding the system, improving retrieval quality, adding new data sources, running experiments, or simply having senior AI engineering available on demand.

**Retainer pricing:** $1,500–$3,000/month depending on scope and hours. Minimum 3-month commitment.

---

# How RAG Works — A Technical Explanation

## What is RAG?

Retrieval-Augmented Generation (RAG) is an architecture that combines a retrieval system with a large language model (LLM) to produce answers grounded in a specific knowledge base. Instead of relying solely on what the LLM learned during training, a RAG system first fetches relevant documents from your data at query time, then passes those documents to the LLM as context for generating an answer.

The result: an AI system that answers questions accurately from your specific data, stays up to date as your data changes, and doesn't hallucinate facts it doesn't know — because every answer is anchored to retrieved source documents.

## Why RAG instead of just prompting an LLM?

A plain LLM (even GPT-4) has no knowledge of your internal data. It cannot answer questions about your product documentation, your support history, your internal processes, or your proprietary knowledge. You could put some of this in a system prompt, but the context window has limits — you cannot stuff 50,000 documents into a prompt.

RAG solves this by making retrieval dynamic: it finds the most relevant documents for each specific query and only passes those to the LLM. This means your knowledge base can be arbitrarily large.

## The RAG pipeline — step by step

**Ingestion phase (happens offline, on a schedule, or on document upload):**

1. **Document loading** — your source data is loaded from wherever it lives: PDFs, Word docs, Notion, Confluence, databases, S3, APIs. We write custom loaders for each source.

2. **Chunking** — documents are split into smaller pieces (chunks). Chunk size and strategy matter significantly: too large and retrieval is imprecise; too small and individual chunks lack context. We typically use recursive character splitting with 512–1024 token chunks and meaningful overlap (100–200 tokens).

3. **Embedding** — each chunk is converted into a vector (a list of numbers that encodes semantic meaning) using an embedding model. We typically use OpenAI's text-embedding-3-small or text-embedding-3-large depending on quality requirements and cost constraints.

4. **Vector storage** — vectors are stored in a vector database alongside the original chunk text and metadata. We use Qdrant for most production systems or pgvector (Postgres extension) for simpler use cases.

**Query phase (happens in real time, per user query):**

5. **Query embedding** — the user's question is converted to a vector using the same embedding model used during ingestion.

6. **Similarity search** — the vector DB finds the top-K chunks whose vectors are most semantically similar to the query vector. This is the "retrieval" step.

7. **Reranking (optional but recommended)** — a cross-encoder reranker (e.g., Cohere Rerank or a local model) re-scores the top-K results for relevance. This significantly improves precision in production systems.

8. **Context construction** — retrieved chunks are assembled into a context block, with source metadata attached (document name, page, section).

9. **Generation** — the LLM receives: a system prompt defining its role and behavior, the assembled context, and the user's query. It generates a grounded answer, citing the sources.

10. **Response delivery** — the answer is streamed back to the user with source citations displayed.

## What makes a RAG system production-quality?

Most RAG demos are toy systems that work on clean data with simple queries. Production RAG requires:

- **Hybrid search:** combining dense vector search with sparse keyword search (BM25) improves recall on specific terms, names, and codes
- **Metadata filtering:** filtering by document type, date, department, or other attributes before semantic search
- **Query expansion / HyDE:** rewriting or expanding the user query before retrieval to improve match quality
- **Chunking strategy tuned to content:** legal documents, code, and conversational data each need different chunking approaches
- **Evaluation pipeline:** an automated way to measure retrieval precision and generation quality as you iterate
- **Graceful fallbacks:** handling queries outside the knowledge base scope without hallucinating

## When is RAG the right choice?

RAG is the right architecture when:
- You have a large, dynamic knowledge base that changes over time
- You need answers grounded in specific, citable sources
- You need to add AI to an existing knowledge corpus without retraining a model
- Your users need natural language access to internal data

RAG is NOT the right choice when:
- Your task requires deep domain-specific reasoning that general LLMs cannot handle (consider fine-tuning instead)
- Your knowledge base is very small and static (a simple system prompt may suffice)
- Latency is extremely critical and you cannot afford retrieval round-trips

---

# Fine-Tuning vs. RAG vs. Prompting — How to Choose

One of the most common questions we get from technical clients is: "Should we fine-tune a model, use RAG, or just write a better system prompt?" The answer depends on your specific use case, data characteristics, latency requirements, and budget. Here is a practical decision framework.

---

## Option 1: Prompt Engineering (No Training, No Retrieval)

**What it is:** You use a general-purpose LLM (GPT-4o, Claude, Mistral) as-is, with a carefully crafted system prompt and few-shot examples in the prompt.

**When it works well:**
- Your use case requires general reasoning, writing, summarization, or classification on diverse input
- Your knowledge base is small enough to fit in the context window (roughly under 100KB of text)
- You need to ship quickly and iterate rapidly
- The task doesn't require highly specialized domain vocabulary or proprietary knowledge

**When it falls short:**
- Knowledge base is too large for the context window
- You need up-to-date information (training cutoff applies)
- Latency from large context is unacceptable
- You need high accuracy on very specific domain terminology or formats

**Cost profile:** Pay per token at inference time. Cheap for light usage, expensive at scale with large contexts.

---

## Option 2: RAG (Retrieval-Augmented Generation)

**What it is:** A retrieval system fetches relevant chunks from your knowledge base at query time and passes them to the LLM as context. The LLM itself is not modified.

**When it works well:**
- You have a large, dynamic knowledge base (documents, tickets, wikis, product data)
- Your data changes frequently and you need answers to stay current
- You need source citations and grounded, verifiable answers
- You want to add AI to existing data without a training pipeline
- You need to deploy quickly — RAG systems can be built in weeks

**When it falls short:**
- The LLM needs to deeply understand domain-specific reasoning patterns, not just retrieve facts
- Your queries require synthesizing across very large amounts of retrieved context simultaneously
- You need extreme latency (retrieval adds round-trip time)
- Your domain vocabulary is so specialized the LLM misunderstands retrieved content

**Cost profile:** Embedding costs at ingestion (cheap), vector DB hosting (low), LLM inference per query. Scales well.

---

## Option 3: Fine-Tuning

**What it is:** A pre-trained model is further trained on your domain-specific dataset. The model's weights are updated to internalize your terminology, formats, reasoning patterns, and knowledge.

**When it works well:**
- You have a specific, well-defined task with consistent input/output format
- General models consistently make errors on your domain despite good prompting
- You have a substantial labeled dataset (typically 500–10,000+ examples for good results)
- You need the model to internalize a proprietary style, tone, or output structure
- Latency is critical and you need a smaller, faster model that performs like a larger one on your task
- You want to reduce inference costs by using a smaller fine-tuned model instead of GPT-4

**Examples where fine-tuning clearly wins:**
- Legal clause classification with proprietary taxonomy
- Medical note summarization in a specific clinical format
- Code completion for an internal DSL or proprietary framework
- Customer support responses that match an exact brand voice and product knowledge
- Named entity extraction with domain-specific entity types

**When it falls short:**
- Your data changes frequently (retraining is expensive and slow)
- You don't have enough labeled examples
- The task requires up-to-date external knowledge (fine-tuning is a snapshot in time)
- You need source citations — fine-tuned models don't cite sources

**Cost profile:** Training compute cost (one-time, significant), plus model hosting. Expensive upfront, cheap per inference.

---

## Combined Approaches

In practice, the best production systems often combine approaches:

**RAG + fine-tuning:** Fine-tune the LLM on your domain so it understands your terminology and output format, then use RAG to supply current knowledge at inference time. This gives you both deep domain understanding and up-to-date retrieval.

**RAG + prompt engineering:** Iterate quickly with pure RAG + prompting. Once you identify patterns where the LLM consistently fails despite good retrieval, those are candidates for fine-tuning.

---

## Quick Decision Table

| Situation | Recommended approach |
|---|---|
| Small, static knowledge base | Prompting with context stuffing |
| Large or dynamic knowledge base | RAG |
| Consistent structured task, domain-specific | Fine-tuning |
| Need source citations | RAG |
| Need to reduce inference cost at scale | Fine-tuning (smaller model) |
| Specialized vocabulary + large KB | RAG + fine-tuning combined |
| Fastest path to working demo | RAG or prompting |

---

## How we help you decide

When a client comes to us with an AI use case, we start with a 1-week discovery engagement that includes: mapping your data sources, defining the task precisely, running quick experiments with prompting and retrieval on a subset of your data, and delivering a written technical recommendation with rationale. This means you don't commit to a full build before knowing what the right architecture is.

---

# AI Use Cases for SaaS and IT Companies

This document covers the most impactful and proven AI use cases for software product companies and IT organizations. For each, we describe the problem it solves, how it works architecturally, and what a typical implementation looks like.

---

## 1. Intelligent documentation and knowledge base search

**The problem:** Users can't find answers in your docs. Support tickets pile up for questions that are already answered somewhere. Internal teams waste time searching wikis.

**The AI solution:** A RAG-powered search that understands natural language queries and returns precise, cited answers from your documentation — not a list of links, but a synthesized answer with sources.

**Impact:** 30–60% reduction in support ticket volume for documentation-related queries. Faster onboarding for new users and employees.

**Typical implementation:** RAG pipeline over your documentation (synced from your docs source), conversational interface embedded in your product or help center, streaming responses with source citations.

**Best fit:** SaaS products with extensive documentation, developer tools, B2B products with complex onboarding.

---

## 2. AI-powered customer support triage and response

**The problem:** Your support team spends 60–70% of their time on repetitive tickets. Response times are slow. Tier-1 agents are answering the same 50 questions over and over.

**The AI solution:** An AI layer that classifies incoming tickets, drafts responses for agent review, auto-resolves high-confidence repetitive queries, and escalates edge cases to humans.

**Impact:** 40–70% reduction in time-to-first-response. Significant reduction in tier-1 agent workload. Better consistency in support quality.

**Typical implementation:** Integration with your helpdesk (Zendesk, Intercom, Freshdesk), RAG over your support history and knowledge base, LLM response drafting with confidence scoring, human-in-the-loop for review.

**Best fit:** Any SaaS with a support team handling 100+ tickets/week.

---

## 3. Semantic search over internal data

**The problem:** Your product (or your internal tools) uses keyword search. Users can't find things unless they use the exact right words. Synonyms, paraphrases, and conceptual searches return nothing.

**The AI solution:** Replace or augment keyword search with vector-based semantic search that understands meaning, not just exact matches.

**Impact:** Dramatically improved search relevance. Users find what they need faster. Reduced "no results" frustration.

**Typical implementation:** Embedding pipeline over your content corpus, Qdrant or pgvector for vector storage, hybrid search combining BM25 + vector similarity, integration with your existing search UI.

**Best fit:** Marketplaces, content platforms, developer tools, internal knowledge systems, e-commerce.

---

## 4. AI-assisted code review and development tooling

**The problem:** Code reviews are slow. Junior developers repeat the same mistakes. Internal tools and frameworks are underdocumented, slowing onboarding.

**The AI solution:** An LLM integrated into your development workflow — code review suggestions, automated PR summaries, codebase Q&A ("how does our authentication system work?"), documentation generation.

**Impact:** Faster PR cycles. Better knowledge transfer. Reduced onboarding time for new engineers.

**Typical implementation:** RAG over your codebase (chunked by function/class), CI integration for PR summaries, Slack or IDE integration for codebase Q&A.

**Best fit:** Engineering-heavy companies, developer tools companies, any team with a large codebase and growing team.

---

## 5. Automated report and content generation

**The problem:** Your team generates repetitive reports, summaries, or content manually. Analysts spend hours formatting and writing what could be generated from structured data.

**The AI solution:** An LLM pipeline that takes structured data as input and generates formatted reports, summaries, or first drafts automatically.

**Impact:** Hours of analyst/writer time saved per week. Faster reporting cycles. Consistent formatting and tone.

**Typical implementation:** Data pipeline from your source systems (database, BI tool, spreadsheets), structured prompt templates, LLM generation, output to your preferred format (PDF, Notion, email, Slack).

**Best fit:** Analytics platforms, marketing tools, financial software, any company with regular reporting workflows.

---

## 6. Intelligent onboarding and user activation

**The problem:** New users don't activate because they can't figure out how to get value from your product quickly enough. Generic onboarding flows don't match individual user contexts.

**The AI solution:** An AI layer that personalizes the onboarding experience — asks a few questions about the user's goal, then guides them to the specific features and setup steps most relevant to their situation.

**Impact:** Higher activation rates. Reduced time-to-value. Lower early churn.

**Typical implementation:** Conversational onboarding UI, LLM with RAG over your feature documentation and user journey data, dynamic checklist generation, integration with your product analytics.

**Best fit:** SaaS products with complex feature sets, developer tools, B2B platforms.

---

## 7. Data extraction and document processing

**The problem:** Your business receives unstructured documents — contracts, invoices, forms, emails — and staff manually extract information from them into your systems.

**The AI solution:** An LLM-powered extraction pipeline that reads unstructured documents and outputs structured data — to your database, CRM, or ERP — automatically.

**Impact:** Near-elimination of manual data entry. Faster processing. Fewer errors.

**Typical implementation:** Document ingestion pipeline (PDF, DOCX, email), LLM extraction with structured output (JSON schema enforcement), confidence scoring, human review queue for low-confidence extractions.

**Best fit:** Legal tech, fintech, insurance, logistics, any business receiving high volumes of documents.

---

## 8. AI features for competitive differentiation

**The problem:** Competitors are shipping AI features. Your product feels dated. Users are asking why you don't have AI yet.

**The AI solution:** A targeted AI feature that directly enhances your product's core value proposition — not AI for the sake of AI, but AI that makes the thing your product does notably better.

**Impact:** Competitive positioning. Reduced churn from users who would otherwise switch to AI-native competitors.

**Approach:** We start with your product's core job-to-be-done, then identify exactly where AI adds the most leverage — usually one of the above categories applied specifically to your use case.

---

# How We Work — Our Engagement Process

This document explains exactly how a project with us unfolds — from first contact to final handover. Understanding our process helps clients evaluate fit before committing and sets expectations for a smooth engagement.

---

## Phase 0: Technical Scoping Call (Free, 30 minutes)

Before any engagement begins, we do a 30-minute technical scoping call. This is not a sales call. We ask you to describe your use case, your current stack, your data situation, and what a successful outcome looks like. We tell you honestly whether your use case is a good fit for our services, roughly what approach we'd recommend, and what the engagement would look like.

After the call, if there's a fit, we send a written proposal within 48 hours. If we're not the right team for your problem, we'll tell you that and often suggest who would be.

**What to bring to the scoping call:**
- A description of the problem you're trying to solve with AI
- Information about your current tech stack and infrastructure
- Rough sense of your data (what format, how much, where it lives)
- Your timeline and budget range (even a rough number helps)

---

## Phase 1: Discovery (1 Week, Paid)

Every project over $5,000 begins with a paid 1-week discovery phase ($800–$1,500 depending on complexity). Discovery is not busywork — it's the most important week of the project.

**What happens in discovery:**
- We get read-only access to your relevant data sources, codebase, and infrastructure
- We run experiments on your actual data — test different chunking strategies, embedding models, retrieval approaches
- We interview your technical lead and the intended end users (1 session each)
- We map exactly what integrations are needed with your existing systems

**What you get from discovery:**
- A detailed technical specification document covering architecture, stack decisions, data model, API contracts, and integration points
- A risk log identifying the 3–5 things most likely to cause problems and how we'll mitigate them
- A revised, accurate project timeline and fixed price for the build phase
- Optionally: a proof-of-concept prototype demonstrating the core AI functionality works on your data

Discovery de-risks the build for both sides. It ensures we're building exactly what you need, and it means no surprises in scope or timeline during the build.

---

## Phase 2: Build

The build phase follows the technical spec produced in discovery. You know exactly what we're building before we start.

**How the build phase works:**

**Project management:** We set up a shared Linear or Notion workspace before day one. You can see every task, its status, and who owns it at any time. You never have to ask "where are things?" — you can look.

**Communication:** One weekly async written update (what was completed, what's next, any blockers). One weekly 30-minute video check-in if the client wants it — optional, not required. All async communication in a shared Slack channel or Linear comments.

**Code:** All code is in a private GitHub repository you own from day one. We commit daily. You can see the work in progress at any time and raise concerns early, not at the end.

**Staging environment:** We deploy a staging version of the system within the first two weeks so you can interact with it and give feedback before the build is complete. No big-reveal at the end.

**Testing:** We write tests. Unit tests for core logic, integration tests for the AI pipeline, and an evaluation suite for retrieval and generation quality. We don't ship untested code.

---

## Phase 3: Handover

At the end of every project, we run a structured handover process:

**Documentation:** A complete technical README covering architecture, setup, configuration, and how to add/update data in the system. Written for a developer who has never seen the project.

**Handover session:** A 90-minute video session with your technical team walking through the architecture, the codebase, the deployment setup, and how to operate the system day-to-day.

**Runbook:** A written runbook covering: how to monitor the system, common issues and how to fix them, how to add new data sources, how to update or replace the LLM.

**30-day support window:** After handover, we provide 30 days of async support via Slack for bugs, questions, and minor adjustments. This is included in all project prices.

---

## After Handover: Retainer Option

Many clients continue working with us on a monthly retainer after the initial project. Typical retainer work includes:
- Iterating on retrieval quality (better chunking, reranking experiments, hybrid search)
- Adding new data sources to an existing RAG system
- Building additional AI features on top of the initial system
- Model fine-tuning experiments to improve task-specific performance
- General AI engineering support on demand

Retainers start at $1,500/month for 20 hours/month and scale from there.

---

## What We Need From You

Projects go badly when clients are unavailable. For a smooth engagement, we need:
- A dedicated technical point of contact who can answer questions within 24 hours
- Access to relevant data, systems, and infrastructure within the first 3 days
- Timely feedback on staging demos (within 3–5 business days)
- Clear sign-off authority — we need to know who can approve scope decisions

We deliberately limit our active projects to 3–4 at a time so we can give this level of attention to every client. In return, we ask the same level of engagement from you.

---

# Our Technology Stack

We are opinionated about tools. We use technologies we have deployed in production and understand deeply — not whatever is newest or most hyped. Here is our standard stack and the reasoning behind each choice.

---

## Backend Framework: FastAPI (Python)

We build all AI backends in FastAPI. Python is the lingua franca of AI/ML engineering — all major model libraries, embedding tools, and LLM frameworks are Python-first. FastAPI gives us high performance (async by default), automatic OpenAPI documentation, strong typing with Pydantic, and a clean pattern for streaming responses via Server-Sent Events.

We do not use Node.js or Go for AI backends. When a client's existing backend is in another language, we build the AI service as a separate FastAPI microservice with a clean API contract, and their existing backend calls ours.

---

## Vector Databases

**Qdrant** — our default for most production RAG systems. Qdrant is purpose-built for vector search, supports filtering, payload storage, and hybrid search (dense + sparse) natively. It is fast, well-maintained, and can be self-hosted on a modest VPS for most use cases. We have extensive production experience with Qdrant's Python client and REST API.

**pgvector** — our choice when the client already runs PostgreSQL and wants to minimize infrastructure complexity. pgvector turns your existing Postgres database into a vector store. Performance is lower than Qdrant at large scale but entirely sufficient for knowledge bases under ~1 million vectors. Works well for smaller-scale RAG systems where simplicity is valued over raw performance.

**Pinecone** — we use Pinecone when a client specifically requires a fully managed, serverless vector database with no infrastructure overhead. Slightly higher cost than self-hosted Qdrant, but zero operational burden.

---

## Embedding Models

**OpenAI text-embedding-3-small** — our default for most use cases. Excellent quality-to-cost ratio, 1536 dimensions, supports dimension reduction. Adequate for the vast majority of production RAG systems.

**OpenAI text-embedding-3-large** — when retrieval quality is critical and cost is secondary. 3072 dimensions, meaningfully better on complex domains.

**Local embedding models (e5-large, bge-m3, nomic-embed)** — when a client has data privacy requirements and cannot send data to OpenAI's API, we deploy local embedding models. Also useful for reducing ongoing embedding costs at very high ingestion volumes.

---

## LLM Providers

**OpenAI GPT-4o** — our default generation model. Best overall performance, reliable API, strong instruction following, good at structured output generation (JSON mode). We use this for most production systems.

**Anthropic Claude (Haiku / Sonnet / Opus)** — preferred for tasks requiring long context windows, nuanced reasoning, or handling of very long documents. Claude's 200k context window is useful in specific RAG patterns where we want to pass more retrieved context.

**Mistral / LLaMA (self-hosted via vLLM)** — when data privacy is a hard requirement and the client cannot send data to external APIs, we deploy open-source models on client infrastructure. We use vLLM for high-throughput serving, llama.cpp for lighter single-server deployments.

---

## RAG Frameworks

**LangChain** — we use LangChain's document loaders, text splitters, and retrieval chains. We do not use LangChain for complex agent orchestration — we find direct API calls more maintainable for production systems.

**LlamaIndex** — preferred for complex document hierarchies, multi-document reasoning, and structured data integration. LlamaIndex's index types (VectorStoreIndex, KnowledgeGraphIndex, SQLIndex) give us more flexibility for complex retrieval patterns.

**Direct API** — for simpler systems, we skip frameworks entirely and call the OpenAI / Qdrant APIs directly. Less abstraction, more control, easier debugging.

---

## Fine-Tuning Stack

**HuggingFace Transformers** — the foundation for all our fine-tuning work. Access to thousands of base models, well-maintained training loops, integration with the broader HuggingFace ecosystem.

**PEFT / LoRA** — for most fine-tuning work, we use Low-Rank Adaptation (LoRA) via the PEFT library. LoRA fine-tunes a small number of additional parameters rather than updating all model weights, dramatically reducing compute cost and training time while maintaining most of the performance gain of full fine-tuning.

**Weights & Biases** — experiment tracking for all training runs. We log loss curves, evaluation metrics, hyperparameter configurations, and model artifacts. This gives clients full visibility into training experiments and lets us compare approaches systematically.

**vLLM** — our preferred serving framework for open-source models in production. Handles batching, KV cache optimization, and high-throughput inference efficiently.

---

## Infrastructure

**Docker + Docker Compose** — all services are containerized. Makes deployment environment-agnostic and ensures reproducibility.

**AWS / GCP / Hetzner** — we are cloud-agnostic. For cost-sensitive clients, we often use Hetzner (European VPS provider) for GPU workloads at 60–70% lower cost than AWS/GCP equivalents. For clients with existing cloud infrastructure, we deploy alongside their existing setup.

**Railway / Render** — for lighter deployments, staging environments, and smaller-scale productions where managed infrastructure is preferred over raw VPS.

---

## What We Integrate With

We have integration experience with: Notion, Confluence, Google Drive, SharePoint, Zendesk, Intercom, Freshdesk, Jira, GitHub/GitLab, Slack, HubSpot, Salesforce, PostgreSQL, MySQL, MongoDB, Elasticsearch, S3-compatible object storage, and REST/GraphQL APIs.

If your data lives somewhere, we can almost certainly get it into a RAG pipeline.

---

# Frequently Asked Questions

## About working with us

**How long does a typical project take?**
It depends on scope. A focused AI feature integration (adding semantic search to an existing product, for example) typically takes 3–6 weeks including discovery. A full RAG system over a large knowledge base takes 4–8 weeks. A custom AI application built from scratch takes 6–16 weeks. We give a precise timeline after discovery, not before — the 1-week discovery phase is specifically designed to produce an accurate estimate.

**Do you work with our existing codebase, or do you rewrite things?**
We integrate with your existing stack. We do not propose rewrites. Our AI systems are built as services or modules that connect to your existing architecture via clean API contracts. Your team maintains ownership of the rest of your product.

**Can our engineering team maintain the system after you're done?**
Yes, and this is a core design principle for us. We document everything as if we'll never speak again after handover. We run a thorough 90-minute handover session with your technical team. Every system we build has a detailed runbook, clean commented code, and a 30-day support window after delivery. We have had clients with no prior AI/ML experience successfully maintain and extend our systems.

**Do you work with small teams or early-stage companies?**
Yes. Many of our clients are startups with engineering teams of 2–10 people. Early-stage companies actually benefit from working with a specialized studio rather than trying to hire an AI engineer full-time before they've validated the use case. We can deliver a production system faster and at lower total cost than a 6-month hire.

**What if we're not sure what we need?**
Start with a scoping call. We will ask you about your problem and your data and tell you honestly what approach makes sense, how long it would take, and roughly what it would cost. If you're very uncertain, our discovery engagement is specifically designed to answer the "what should we build?" question before committing to a full project.

---

## About data and privacy

**Do you need access to our sensitive data?**
For RAG systems, yes — we need to ingest your data. We work under NDA from day one, and we have standard data processing agreements for clients with regulatory requirements (GDPR, HIPAA-adjacent). For model fine-tuning, we need a dataset of examples; we can design the data pipeline to minimize our exposure to raw sensitive data.

**Can you build systems that keep all data on our infrastructure?**
Yes. We have built fully on-premise and private cloud deployments using self-hosted embedding models (e.g., bge-m3, e5-large) and self-hosted LLMs (LLaMA 3, Mistral, Qwen) served via vLLM. No data leaves your infrastructure. This adds complexity and cost but is entirely feasible and something we have production experience with.

**We're in the EU — do you handle GDPR considerations?**
We are familiar with GDPR requirements and design systems with data minimization and retention controls in mind. We are not lawyers and cannot give legal advice, but we can implement the technical controls your legal/compliance team specifies.

---

## About pricing and contracts

**Why do you charge for discovery?**
Because a free discovery is not a real discovery. When discovery is free, there is pressure to skip straight to a proposal with a number. When it is paid, we both commit to doing it properly — running experiments on your actual data, writing a real technical spec, giving you an honest assessment. Discovery fees are $800–$1,500 and are deducted from the total project cost if you proceed.

**Do you do fixed-price or time-and-materials?**
We prefer fixed-price engagements scoped precisely after discovery. This gives you budget certainty. We use time-and-materials only for retainer work after an initial fixed-scope project.

**What payment terms do you use?**
Standard terms: 30% upfront, 40% at midpoint milestone, 30% at delivery. For projects over $20,000 we can discuss milestone-based structures.

**Do you sign NDAs?**
Yes, before any technical discussion of client data or systems. We have a standard mutual NDA we can turn around in 24 hours.

---

## About AI and expectations

**Can you guarantee the AI will be accurate?**
No one can guarantee 100% accuracy from an LLM-based system. What we can do: design for high precision through careful retrieval architecture, implement evaluation pipelines that measure accuracy before launch, add confidence scoring and human-in-the-loop for low-confidence outputs, and iterate on quality after launch. We will tell you upfront what accuracy level is realistic for your use case and what it would take to achieve it.

**Will the system hallucinate?**
A well-built RAG system is specifically designed to minimize hallucination by grounding every answer in retrieved sources. It is not zero — the LLM can still misread or miscombine retrieved context. This is why we implement source citations (the user can verify), confidence scoring, and graceful fallback behavior for out-of-scope queries. We also build evaluation sets to measure and track hallucination rate during development.

**How do you handle queries that are outside the knowledge base?**
We design explicit fallback behavior. When retrieval confidence is low, the system says so: "I don't have specific information about that in my knowledge base" — rather than generating a confident-sounding wrong answer. Honest uncertainty is better than silent hallucination.

**What happens when OpenAI changes their models or pricing?**
We build systems that are as model-agnostic as reasonable. The LLM is typically behind a configuration variable, not hardcoded. If you want to switch from GPT-4o to Claude or a self-hosted model, the change is a configuration update plus testing — not a rewrite.

---

# Example Projects and Typical Engagements

These examples describe the kinds of projects we build — the problems, the approach, and the outcomes. They are representative of typical engagements rather than specific client case studies.

---

## Example 1: RAG over a SaaS Product's Support Knowledge Base

**Client profile:** A B2B SaaS company with 8,000 customers, a support team of 12, and approximately 120,000 historical support tickets plus a 400-page knowledge base.

**The problem:** Tier-1 support agents were spending 65% of their time answering questions already answered in the knowledge base or in prior tickets. Response time averaged 6 hours. New agents took 3 months to get fully productive.

**What we built:** A RAG system ingesting all support tickets (filtered to resolved, high-quality examples) and the knowledge base. A FastAPI backend with hybrid search (dense + BM25), Qdrant for vector storage, and GPT-4o for response generation. An agent-facing interface integrated into their Zendesk workflow: when a new ticket arrived, the system automatically retrieved the 5 most relevant prior resolutions and generated a draft response. Agents reviewed and sent — or ignored and wrote their own.

**Technical details:** 
- Ingestion pipeline processing 120k tickets with deduplication and quality filtering (keeping ~45k high-quality examples)
- Chunking by ticket thread with metadata: product area, resolution type, customer tier
- Hybrid search with Qdrant's sparse+dense integration
- Reranking with Cohere Rerank before generation
- Confidence scoring: responses above 0.85 confidence flagged as "auto-resolvable" for agent review
- Integration with Zendesk via webhook

**Outcome:** Average response time dropped from 6 hours to 45 minutes. Tier-1 agents reported spending 40% less time on repetitive queries. New agent ramp time reduced from 3 months to 6 weeks.

**Timeline:** 1 week discovery + 6 weeks build. Total: $18,000.

---

## Example 2: Semantic Search for a Developer Tools Product

**Client profile:** A developer tools company offering a platform for API testing and documentation. Their existing search used Elasticsearch keyword matching.

**The problem:** Users couldn't find the right endpoint, parameter, or example unless they knew the exact terminology used in the documentation. Searches like "how do I authenticate" returned nothing useful because the docs used "authorization" and "OAuth."

**What we built:** A semantic search layer over their product documentation and API reference. pgvector on their existing Postgres database (they wanted no new infrastructure). OpenAI embeddings for all documentation chunks. A hybrid search combining their existing Elasticsearch BM25 scores with our semantic similarity scores, weighted and merged via Reciprocal Rank Fusion (RRF).

**Technical details:**
- Incremental embedding pipeline triggered on documentation updates via webhook
- Chunking strategy customized for API reference format (endpoint + description + parameters + examples kept together)
- Hybrid search: BM25 score from Elasticsearch + vector similarity from pgvector, merged with RRF
- Query expansion using LLM to generate synonyms and alternative phrasings before retrieval
- Sub-100ms p95 latency on 500k+ chunks

**Outcome:** Search success rate (users clicking a result) improved from 52% to 81%. "No results" occurrences dropped by 74%. Users reported finding what they needed faster in post-launch survey.

**Timeline:** 1 week discovery + 4 weeks build. Total: $12,000.

---

## Example 3: Fine-Tuned Classification Model for Legal Document Processing

**Client profile:** A legal tech company processing commercial contracts for enterprise clients. Their team was manually reviewing contracts to classify clause types and flag non-standard terms.

**The problem:** General LLMs performed poorly on their specific clause taxonomy (60+ proprietary clause types). Prompting GPT-4 with the taxonomy achieved ~71% accuracy on their evaluation set — not production-viable.

**What we built:** A fine-tuned classifier based on a Mistral 7B base model, trained on 4,200 labeled contract examples (clauses + clause type labels). We used LoRA (Low-Rank Adaptation) for parameter-efficient fine-tuning. Deployed via vLLM on a client-managed GPU instance.

**Technical details:**
- Dataset: 4,200 examples across 64 clause types, balanced via augmentation for underrepresented types
- Base model: Mistral 7B Instruct
- Fine-tuning: LoRA with rank 16, alpha 32, targeting attention and MLP layers. 3 epochs, AdamW optimizer, cosine LR schedule
- Evaluation: held-out test set of 800 examples + adversarial set of edge cases
- Serving: vLLM on a single A100 40GB instance, batch inference for document processing pipeline

**Outcome:** Classification accuracy improved from 71% (GPT-4 with prompting) to 94.3% on the evaluation set. Processing time per contract reduced from 45 minutes (manual) to 8 minutes (AI-assisted with human review of flagged low-confidence items). The model runs entirely on the client's infrastructure — no data sent to external APIs.

**Timeline:** 1 week discovery + 7 weeks (including data pipeline, training experiments, evaluation). Total: $28,000.

---

## Example 4: Internal Knowledge Assistant for a Software Consulting Company

**Client profile:** A 60-person software consulting company with 8 years of project history — proposals, post-mortems, technical specs, process documents — spread across Google Drive, Confluence, and Notion.

**The problem:** Senior consultants re-solved the same problems every engagement. New consultants couldn't easily find relevant past work. Proposal writing took too long because writers couldn't quickly find relevant case studies and prior estimates.

**What we built:** An internal knowledge assistant — a chat interface over all company knowledge sources. Multi-source ingestion from Google Drive, Confluence, and Notion with automatic sync. RAG pipeline with metadata filtering (filter by document type, project type, industry, year). A web app accessible to all employees.

**Technical details:**
- Multi-source connectors: Google Drive API, Confluence REST API, Notion API — with incremental sync every 4 hours
- Document processing: OCR for scanned PDFs, table extraction, handling of mixed-format documents
- Hierarchical chunking: document-level summaries + section-level chunks for improved retrieval
- Metadata schema: document type, project industry, client size, year, author
- Filtering UI: before asking a question, users can filter by document type and time range
- Access control: integration with company SSO so users only see documents they have permission to access

**Outcome:** Senior consultants reported finding relevant prior work in 5 minutes rather than 30–45. Proposal win rate improved (attributed partly to better-matched case studies). Onboarding time for new consultants reduced.

**Timeline:** 1 week discovery + 8 weeks build. Total: $22,000.

---

# How to Think About AI Opportunities for Your Company

This document is designed to help you — or our AI assistant — identify the most promising AI integration opportunities for a specific software product or IT company. It describes how we evaluate a company's situation and generate concrete, actionable project ideas.

---

## The four questions we ask about any company

When a new client comes to us with a vague sense that "we should do something with AI," we ask four questions that quickly surface the highest-value opportunities:

**1. Where does your team spend time on repetitive cognitive work?**
Any task a human does repeatedly that involves reading, classifying, summarizing, extracting, or drafting based on existing information is a candidate for AI automation. Support ticket responses, document review, report generation, data entry from unstructured sources, code review comments.

**2. Where do your users struggle to find information?**
If your product has a search function that users complain about — or if users repeatedly ask support questions that are answered somewhere in your documentation — that is a RAG opportunity.

**3. Where does your product use rules or logic that could be learned from data?**
Classification, ranking, recommendation, anomaly detection, scoring — if you have rules a human wrote and data those rules apply to, a machine learning model can probably do it better.

**4. Where would your product feel meaningfully smarter with AI?**
Not AI for the sake of AI — but what capability, if you had it, would users notice and value? What would make your product clearly better than a competitor's? What feature request do you hear repeatedly that is essentially asking for intelligence?

---

## How to describe your company to get useful AI ideas

The more specific you are about your company and product, the more specific and useful the AI project ideas we can generate. Here is what helps most:

**Tell us:**
- What your product does in one or two sentences (the core job it does for users)
- Who your users are (developers? ops teams? end consumers? internal employees?)
- What data you have — not just what kind, but roughly how much and in what form
- What your users complain about or struggle with most
- What your support team gets asked most often
- What your internal team does manually that they wish was automated
- What AI features your competitors have shipped or are shipping

**Example of a useful description:**
"We make a B2B project management tool for construction companies. Our users are project managers and site supervisors. We have 5 years of project data — tasks, timelines, budgets, issue logs — for about 3,000 completed projects. Users constantly ask our support team how to set up project templates. Our competitors recently added an AI assistant that answers questions about project status."

From this, we can immediately identify:
- A RAG system over project documentation and templates to answer setup questions
- A project outcome predictor trained on historical project data (delays, budget overruns)
- An AI assistant for project status queries against live project data
- Automated project template generation based on project type and parameters

---

## Matching company type to likely AI opportunities

**SaaS product companies:**
Most common opportunities: intelligent search within the product, AI-assisted onboarding, automated report or summary generation, AI features that enhance the core value proposition.

**Developer tools companies:**
Most common opportunities: semantic code search, AI-powered documentation Q&A, automated PR summaries and review suggestions, codebase knowledge assistant.

**Internal tools / enterprise software:**
Most common opportunities: document processing and extraction, internal knowledge assistant (RAG over company knowledge), workflow automation with AI decision points.

**Software consulting / services companies:**
Most common opportunities: internal knowledge assistant over past project work, proposal and estimate generation assistance, automated project documentation.

**Data-heavy businesses (analytics, fintech, healthtech):**
Most common opportunities: natural language querying of databases or reports, anomaly detection, document processing and classification, fine-tuned models for domain-specific tasks.

---

## What makes a good AI project

When we evaluate a proposed AI project, we are looking for:

**Clear problem:** We can articulate exactly what problem the AI solves and for whom. "Make our product smarter" is not a problem. "Users can't find the right documentation article for their question, leading to 300 support tickets/week" is a problem.

**Available data:** The AI has something to work with. For RAG: a knowledge base, documents, or history. For fine-tuning: labeled examples. For predictive models: historical outcomes. The question "what data do you have?" is always the second question we ask.

**Measurable outcome:** We can define what success looks like in numbers — ticket deflection rate, search success rate, accuracy on a held-out test set, time saved per task. Projects without measurable outcomes are impossible to evaluate and hard to justify.

**Proportionate scope:** The project size matches the value it delivers. A $25,000 RAG system that deflects 40% of support tickets is excellent ROI for a company spending $20,000/month on support. The same system for a company with 3 support tickets per day is not.

---

## Red flags — when AI is not the right answer

We will tell you if AI is not the right tool for your problem:
- If your search problem is really a content quality problem (bad docs), AI won't fix it
- If you don't have enough data for the task, fine-tuning won't help
- If the problem could be solved with a simpler rule-based system in a week, don't build an LLM pipeline
- If the accuracy requirement is 100% (legal liability, financial transactions, safety-critical), current AI systems are not ready — build the human-in-the-loop carefully
- If your real problem is unclear requirements or team misalignment, AI is not a substitute for clarity

