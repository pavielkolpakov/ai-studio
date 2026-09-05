"""Agency facts included only on turns that ask about Neuronetis.

Migrated from the non-project vault notes. Edit agency information here;
project-specific scopes and commercial details remain in docs/vault/projects/.
"""

AGENCY_CONTEXT = """\
# Neuronetis Agency Information

## Our Location and Team

### Location and Setup

We are a distributed studio. Our lead engineers are based in Israel, the US, and Eastern Europe, with client
delivery experience across the EU, Israel, and North America. We work in European and overlap-friendly time zones
and are fluent in English for all technical communication.

### Our Team

We are organized around three specialized teams that cover the full delivery stack:

- **AI / Backend team** — responsible for AI engineering work (RAG pipelines, LLM integration, fine-tuning, agents,
  evals) as well as the backend services and APIs that wrap them. This is the core of every project we deliver.
- **Frontend / Mobile team** — builds the client-facing layer when a project requires it: web applications, admin
  interfaces, embedded chat widgets, and mobile apps.
- **DevOps team** — handles infrastructure, CI/CD pipelines, cloud deployments, observability, and production
  reliability across all our engagements.

Each project is staffed with senior engineers from the relevant teams, scaled to match the scope of the work.

## Studio Overview

We are an AI engineering studio that builds production-grade AI systems for IT companies and software product
teams. We specialize in integrating artificial intelligence directly into existing software products and building
new AI-native applications from the ground up.

We are not a general software agency. We focus exclusively on AI engineering — retrieval-augmented generation
(RAG), LLM integration into products, agentic workflow automation, voice AI, MCP integrations, model fine-tuning,
evals infrastructure, and AI-native application development. This focus means our team works with these systems
every day, which translates to faster delivery, fewer surprises, and better architectural decisions for our
clients.

## Our Values as a Studio

**We don't lock you in.** All code we write is yours. We document everything as if we'll never speak again. Your
team should be able to maintain and extend everything we build.

**We price by project, not by hour.** Fixed-scope engagements give you cost certainty. We scope carefully upfront
so we don't surprise you with overruns.

**We work asynchronously and transparently.** You see progress continuously through shared project management
tools, not just at a final delivery. Weekly check-ins are standard on all projects.

**We take on 3–4 projects per quarter.** We deliberately limit capacity so every client gets senior-level attention
throughout the engagement, not a junior developer handed a spec.

## What We Are Not

We do not build generic chatbots powered by a system prompt. We do not resell OpenAI wrappers. We do not take on
projects where the client wants AI for the sake of AI with no clear use case. Every engagement starts with
understanding your actual problem, and we will tell you honestly if AI is not the right solution for it.

## Who We Work With

Our clients are typically:
- B2B SaaS companies (50–500 employees) with an existing product that needs AI capabilities to stay competitive
- Software development agencies that need an AI subcontractor they can engage on a project basis for their own
  clients
- Scale-ups and growth-stage companies sitting on large proprietary datasets — documents, support tickets, logs,
  product data — who need to make that data intelligent and queryable
- AI-first startups with a funded idea but no in-house ML or AI engineering capability who need to ship fast

We work best with clients who have a technical point of contact internally — a CTO, VP of Engineering, or technical
lead who understands software architecture. We don't replace your team; we extend it with deep AI expertise.

## FAQ: AI and Expectations

**Can you guarantee the AI will be accurate?**
No one can guarantee 100% accuracy from an LLM-based system. What we can do: design for high precision through
careful retrieval architecture, implement evaluation pipelines that measure accuracy before launch, add confidence
scoring and human-in-the-loop for low-confidence outputs, and iterate on quality after launch. We will tell you
upfront what accuracy level is realistic for your use case.

**Will the system hallucinate?**
A well-built RAG system is specifically designed to minimize hallucination by grounding every answer in retrieved
sources. It is not zero — the LLM can still misread or miscombine retrieved context. This is why we implement
source citations, confidence scoring, and graceful fallback behavior for out-of-scope queries. We also build
evaluation sets to measure and track hallucination rate during development.

**How do you handle queries that are outside the knowledge base?**
We design explicit fallback behavior. When retrieval confidence is low, the system says so rather than generating a
confident-sounding wrong answer. Honest uncertainty is better than silent hallucination.

**What happens when OpenAI changes their models or pricing?**
We build systems that are as model-agnostic as reasonable. The LLM is typically behind a configuration variable,
not hardcoded. If you want to switch from GPT-4o to Claude or a self-hosted model, the change is a configuration
update plus testing — not a rewrite.

**How do you make sure the AI keeps working correctly over time?**
Every production system we build includes an eval harness — a set of test cases that run automatically to catch
regressions before they reach users. We also set up production observability (LangSmith or Langfuse) so you can
monitor answer quality, latency, and cost in real time. This is what separates a system that degrades silently from
one you can trust over time.

## FAQ: Data and Privacy

**Do you need access to our sensitive data?**
For RAG systems, yes — we need to ingest your data. We work under NDA from day one, and we have standard data
processing agreements for clients with regulatory requirements (GDPR, HIPAA-adjacent). For model fine-tuning, we
need a dataset of examples; we can design the data pipeline to minimize our exposure to raw sensitive data.

**Do you sign NDAs?**
Yes, before any technical discussion of client data or systems. We have a standard mutual NDA we can turn around in
24 hours.

**Can you build systems that keep all data on our infrastructure?**
Yes. We have built fully on-premise and private cloud deployments using self-hosted embedding models (e.g., bge-m3,
e5-large) and self-hosted LLMs (LLaMA 3, Mistral, Qwen) served via vLLM. No data leaves your infrastructure. This
adds complexity and cost but is entirely feasible.

**We're in the EU — do you handle GDPR considerations?**
We are familiar with GDPR requirements and design systems with data minimization and retention controls in mind. We
are not lawyers and cannot give legal advice, but we can implement the technical controls your legal/compliance
team specifies.

## FAQ: Working With Us

**How long does a typical project take?**
It depends on scope. An AI feature audit takes 1–2 weeks. A focused feature integration or RAG MVP typically takes
3–6 weeks including discovery. A full production RAG system takes 6–10 weeks. An agentic platform or end-to-end
product build takes 3–6+ months. We give a precise timeline after discovery, not before.

**Do you work with our existing codebase, or do you rewrite things?**
We integrate with your existing stack. We do not propose rewrites. Our AI systems are built as services or modules
that connect to your existing architecture via clean API contracts. Your team maintains ownership of the rest of
your product.

**Can our engineering team maintain the system after you're done?**
Yes, and this is a core design principle for us. We document everything as if we'll never speak again after
handover. We run a thorough 90-minute handover session with your technical team. Every system we build has a
detailed runbook, clean commented code, and a 30-day support window after delivery. We have had clients with no
prior AI/ML experience successfully maintain and extend our systems.

**Do you work with small teams or early-stage companies?**
Yes. Many of our clients are startups with engineering teams of 2–10 people. Early-stage companies actually benefit
from working with a specialized studio rather than trying to hire an AI engineer full-time before they've validated
the use case. We can deliver a production system faster and at lower total cost than a 6-month hire.

**What if we're not sure what we need?**
Start with a scoping call. We will ask you about your problem and your data and tell you honestly what approach
makes sense, how long it would take, and roughly what it would cost. If you're very uncertain, our discovery
engagement is specifically designed to answer the "what should we build?" question before committing to a full
project.

**Why should we hire you instead of building an in-house AI team?**
Hiring a senior AI engineer in the US currently costs $180,000–$280,000/year in base salary alone. Add recruiter
fees (15–25% of first-year salary), 3–6 months of hiring time, 2–4 months of onboarding before real productivity,
and the very real risk of a bad hire — the total cost of a single wrong AI engineering hire can exceed
$300,000–$400,000 when you factor in severance, re-hiring, and lost time. And one person can't cover the full
stack: you typically need AI/ML expertise, backend engineering, infrastructure/DevOps, and frontend — four
different skill sets.

With Neuronetis, you get immediate access to a senior team across all of those disciplines, on a fixed-price
project with a defined deliverable, zero onboarding time, and no long-term headcount commitment. If the project
doesn't work out, you haven't hired someone. Most of our clients get their first production AI system shipped in
4–8 weeks — a timeline that's simply not achievable when you're still posting a job description.

## The Four Questions We Ask About Any Company

This is how we identify the most promising AI integration opportunities for a specific software product or IT
company.

**1. Where does your team spend time on repetitive cognitive work?**
Any task a human does repeatedly that involves reading, classifying, summarizing, extracting, or drafting based on
existing information is a candidate for AI automation. Support ticket responses, document review, report
generation, data entry from unstructured sources, code review comments.

**2. Where do your users struggle to find information?**
If your product has a search function that users complain about — or if users repeatedly ask support questions that
are answered somewhere in your documentation — that is a RAG opportunity.

**3. Where does your product use rules or logic that could be learned from data?**
Classification, ranking, recommendation, anomaly detection, scoring — if you have rules a human wrote and data
those rules apply to, a model can probably do it better and at a fraction of the cost.

**4. Where would your product feel meaningfully smarter with AI?**
Not AI for the sake of AI — but what capability, if you had it, would users notice and value? What would make your
product clearly better than a competitor's?

## How to Describe Your Company to Get Useful AI Ideas

**Tell us:**
- What your product does in one or two sentences
- Who your users are (developers? ops teams? end consumers? internal employees?)
- What data you have — not just what kind, but roughly how much and in what form
- What your users complain about or struggle with most
- What your support team gets asked most often
- What your internal team does manually that they wish was automated
- What AI features your competitors have shipped or are shipping

**Example of a useful description:**
"We make a B2B project management tool for construction companies. Our users are project managers and site
supervisors. We have 5 years of project data — tasks, timelines, budgets, issue logs — for about 3,000 completed
projects. Users constantly ask our support team how to set up project templates. Our competitors recently added an
AI assistant that answers questions about project status."

From this, we can immediately identify:
- A RAG system over project documentation and templates to answer setup questions
- A project outcome predictor trained on historical project data (delays, budget overruns)
- An AI assistant for project status queries against live project data
- Automated project template generation based on project type and parameters

## Red Flags, When AI Is Not the Right Answer

We will tell you if AI is not the right tool for your problem:

- If your search problem is really a content quality problem (bad docs), AI won't fix it
- If you don't have enough data for the task, fine-tuning won't help
- If the problem could be solved with a simpler rule-based system in a week, don't build an LLM pipeline
- If the accuracy requirement is 100% (legal liability, financial transactions, safety-critical), current AI
  systems are not ready — build the human-in-the-loop carefully
- If your real problem is unclear requirements or team misalignment, AI is not a substitute for clarity

## What Makes a Good AI Project

**Clear problem:** We can articulate exactly what problem the AI solves and for whom.

**Available data:** The AI has something to work with. For RAG: a knowledge base, documents, or history. For
fine-tuning: labeled examples. For predictive models: historical outcomes.

**Measurable outcome:** We can define what success looks like in numbers — ticket deflection rate, search success
rate, accuracy on a held-out test set, time saved per task.

**Proportionate scope:** The project size matches the value it delivers.

## Phase 2: Build

The build phase follows the technical spec produced in discovery. You know exactly what we're building before we
start.

**Project management:** We set up a shared Linear or Notion workspace before day one. You can see every task, its
status, and who owns it at any time. You never have to ask "where are things?" — you can look.

**Communication:** One weekly async written update (what was completed, what's next, any blockers). One weekly
30-minute video check-in if the client wants it — optional, not required. All async communication in a shared Slack
channel or Linear comments.

**Code:** All code is in a private GitHub repository you own from day one. We commit daily. You can see the work in
progress at any time and raise concerns early, not at the end.

**Staging environment:** We deploy a staging version of the system within the first two weeks so you can interact
with it and give feedback before the build is complete. No big-reveal at the end.

**Testing:** We write tests. Unit tests for core logic, integration tests for the AI pipeline, and an evaluation
suite for retrieval and generation quality. We don't ship untested code.

## Phase 1: Discovery

Every project over $5,000 begins with a paid 1-week discovery phase. Discovery is not busywork — it's the most
important week of the project. For the discovery fee, see Pricing, Payment Terms, and Engagement Sizes.

**What happens in discovery:**
- We get read-only access to your relevant data sources, codebase, and infrastructure
- We run experiments on your actual data — test different chunking strategies, embedding models, retrieval
  approaches
- We interview your technical lead and the intended end users (1 session each)
- We map exactly what integrations are needed with your existing systems

**What you get from discovery:**
- A detailed technical specification document covering architecture, stack decisions, data model, API contracts,
  and integration points
- A risk log identifying the 3–5 things most likely to cause problems and how we'll mitigate them
- A revised, accurate project timeline and fixed price for the build phase
- Optionally: a proof-of-concept prototype demonstrating the core AI functionality works on your data

Discovery de-risks the build for both sides. It ensures we're building exactly what you need, with no surprises in
scope or timeline during the build.

## Phase 3: Handover

At the end of every project, we run a structured handover process:

**Documentation:** A complete technical README covering architecture, setup, configuration, and how to add/update
data in the system. Written for a developer who has never seen the project.

**Handover session:** A 90-minute video session with your technical team walking through the architecture, the
codebase, the deployment setup, and how to operate the system day-to-day.

**Runbook:** A written runbook covering how to monitor the system, common issues and how to fix them, how to add
new data sources, and how to update or replace the LLM.

**30-day support window:** After handover, we provide 30 days of async support via Slack for bugs, questions, and
minor adjustments. This is included in all project prices.

## Retainer Option After Handover

Many clients continue working with us on a monthly retainer after the initial project. Typical retainer work
includes:

- Iterating on retrieval quality (better chunking, reranking experiments, hybrid search)
- Adding new data sources to an existing RAG system
- Building additional AI features on top of the initial system
- Model fine-tuning experiments to improve task-specific performance
- General senior AI engineering support on demand

For retainer pricing, see Pricing, Payment Terms, and Engagement Sizes.

## Phase 0: Technical Scoping Call

Before any engagement begins, we do a 30-minute technical scoping call. It is free. This is not a sales call. We
ask you to describe your use case, your current stack, your data situation, and what a successful outcome looks
like. We tell you honestly whether your use case is a good fit for our services, roughly what approach we'd
recommend, and what the engagement would look like.

After the call, if there's a fit, we send a written proposal within 48 hours. If we're not the right team for your
problem, we'll tell you that and often suggest who would be.

**What to bring to the scoping call:**
- A description of the problem you're trying to solve with AI
- Information about your current tech stack and infrastructure
- Rough sense of your data (what format, how much, where it lives)
- Your timeline and budget range (even a rough number helps)

## What We Need From You

Projects go badly when clients are unavailable. For a smooth engagement, we need:

- A dedicated technical point of contact who can answer questions within 24 hours
- Access to relevant data, systems, and infrastructure within the first 3 days
- Timely feedback on staging demos (within 3–5 business days)
- Clear sign-off authority — we need to know who can approve scope decisions

We deliberately limit our active projects to 3–4 at a time so we can give this level of attention to every client.
In return, we ask the same level of engagement from you.

## Services Overview

We offer a range of AI engineering services. Every engagement is a fixed-scope project with a defined deliverable,
timeline, and price. All projects over $5,000 begin with a paid 1-week discovery phase.

Our full project catalog is listed in the Project Index. If you describe your business or product, we can identify
which projects are most relevant to your situation.

Full AI-native product builds are also in scope: these are scoped case by case and typically combine several of the
projects in the index into one end-to-end engagement.

For all pricing, payment terms, and engagement sizes, see Pricing, Payment Terms, and Engagement Sizes.

## Pricing, Payment Terms, and Engagement Sizes

This note is the single source of truth for all Neuronetis pricing policy. Individual project price ranges live on
each project note under "Numbers".

### Typical Engagement Sizes

- Quick wins: $5,000–$25,000 / 2–6 weeks
- Mid-size builds: $25,000–$100,000 / 4–12 weeks
- Larger end-to-end builds: $100,000–$400,000 / 3–6+ months

### Discovery Fee

Every project over $5,000 begins with a paid 1-week discovery phase. Discovery costs **$1,000–$2,500** depending on
complexity, and the fee is deducted from the total project cost if you proceed to a build.

**Why we charge for discovery:** because a free discovery is not a real discovery. When discovery is free, there is
pressure to skip straight to a proposal with a number. When it is paid, we both commit to doing it properly —
running experiments on your actual data, writing a real technical spec, giving you an honest assessment.

See Phase 1: Discovery for what discovery actually involves.

### Fixed-Price vs. Time-and-Materials

We prefer fixed-price engagements scoped precisely after discovery. This gives you budget certainty. We use
time-and-materials only for retainer work after an initial fixed-scope project.

### Payment Terms

Standard terms: 30% upfront, 40% at midpoint milestone, 30% at delivery. For projects over $20,000 we can discuss
milestone-based structures.

### Retainers

After completing a project, many clients engage us on a monthly retainer for ongoing improvement, new data sources,
additional features, or senior AI engineering on demand. **Retainers start at $3,000/month.**

Some project types carry their own typical retainer ranges above this floor — see the project note for specifics.
See Retainer Option After Handover for what retainer work covers.

## Fine-Tuning vs. RAG vs. Prompting, How to Choose

One of the most common questions we get from technical clients is: "Should we fine-tune a model, use RAG, or just
write a better system prompt?" The answer depends on your specific use case, data characteristics, latency
requirements, and budget. Here is a practical decision framework.

### Option 1: Prompt Engineering (No Training, No Retrieval)

**What it is:** You use a general-purpose LLM (GPT-4o, Claude, Mistral) as-is, with a carefully crafted system
prompt and few-shot examples in the prompt.

**When it works well:**
- Your use case requires general reasoning, writing, summarization, or classification on diverse input
- Your knowledge is small enough to fit in the context window (a few thousand tokens)
- You need to ship fast and iterate on behavior without retraining
- The task doesn't require deep domain-specific terminology or format consistency

**When it breaks down:**
- Your knowledge base is larger than the context window
- You need consistent output format across thousands of generations
- The model doesn't know your proprietary terminology or internal product specifics
- Cost becomes prohibitive when stuffing large context on every query

**Typical cost to implement:** Hours to days. No infrastructure beyond an API key.

### Option 2: RAG (Retrieval-Augmented Generation)

**What it is:** A retrieval layer finds the most relevant documents from your knowledge base at query time, then
passes them as context to the LLM for generation.

**When it works well:**
- You have a large, dynamic knowledge base that changes frequently
- You need answers grounded in specific, citable sources
- The task requires looking up specific facts, policies, or content from your data
- You can't fine-tune (proprietary API model, no training data, too expensive)

**When it breaks down:**
- The task requires generating consistent structured output at high volume (fine-tuning is cheaper per inference)
- Your domain vocabulary is so specialized that general embeddings produce poor retrieval
- Latency is extremely critical

**Typical cost to implement:** $12,000–$100,000 depending on scale, integrations, and complexity.

### Option 3: Fine-Tuning

**What it is:** You train additional parameters on top of a base model using your domain-specific data. The result
is a model that "knows" your terminology, output format, and domain patterns intrinsically.

**When it works well:**
- You have a high-volume, specific task with consistent input/output patterns
- Output format consistency is critical (structured extraction, specific JSON schemas)
- Your domain vocabulary is so specialized that prompting a general model produces poor results
- Inference cost at scale makes hosted API costs prohibitive
- Data privacy requires a model that runs entirely on your infrastructure

**When it breaks down:**
- You don't have enough labeled training data (typically need 500+ high-quality examples minimum)
- Your task is diverse and general-purpose
- You need the knowledge base to be updated frequently (fine-tuning requires retraining)

**Typical cost to implement:** $25,000–$70,000 for dataset preparation, training runs, evaluation, and deployment.

### How We Help You Choose

When a client comes to us with an AI use case, we start with a 1-week discovery engagement that includes: mapping
your data sources, defining the task precisely, running quick experiments with prompting and retrieval on a subset
of your data, and delivering a written technical recommendation with rationale. This means you don't commit to a
full build before knowing what the right architecture is.

See Phase 1: Discovery for what that week involves.

## What We Integrate With

We have integration experience with: Notion, Confluence, Google Drive, SharePoint, Zendesk, Intercom, Freshdesk,
Jira, GitHub/GitLab, Slack, HubSpot, Salesforce, PostgreSQL, MySQL, MongoDB, Elasticsearch, S3-compatible object
storage, and REST/GraphQL APIs.

We also build MCP servers to make client SaaS products accessible to AI agents and tools — see
[[projects/05-mcp-server]].

## What Makes a RAG System Production-Quality

Most RAG demos are toy systems that work on clean data with simple queries. Production RAG requires:

- **Hybrid search:** combining dense vector search with sparse keyword search (BM25) improves recall on specific
  terms, names, and codes
- **Metadata filtering:** filtering by document type, date, department, or other attributes before semantic search
- **Query expansion / HyDE:** rewriting or expanding the user query before retrieval to improve match quality
- **Chunking strategy tuned to content:** legal documents, code, and conversational data each need different
  chunking approaches
- **Evaluation pipeline:** an automated way to measure retrieval precision and generation quality as you iterate
- **Graceful fallbacks:** handling queries outside the knowledge base scope without hallucinating

## The RAG Pipeline, Step by Step

**Ingestion phase (happens offline, on a schedule, or on document upload):**

1. **Document loading** — source data is loaded from wherever it lives: PDFs, Word docs, Notion, Confluence,
   databases, S3, APIs. We write custom loaders for each source.

2. **Chunking** — documents are split into smaller pieces (chunks). Chunk size and strategy matter significantly:
   too large and retrieval is imprecise; too small and individual chunks lack context. We typically use recursive
   character splitting with 512–1024 token chunks and meaningful overlap (100–200 tokens).

3. **Embedding** — each chunk is converted into a vector using an embedding model. We typically use OpenAI's
   text-embedding-3-small or text-embedding-3-large depending on quality requirements and cost.

4. **Vector storage** — vectors are stored in a vector database alongside the original chunk text and metadata. We
   use Qdrant for most production systems or pgvector for simpler use cases.

**Query phase (happens in real time, per user query):**

5. **Query embedding** — the user's question is converted to a vector using the same embedding model used during
   ingestion.

6. **Similarity search** — the vector database finds the top-K chunks whose vectors are most semantically similar
   to the query vector.

7. **Reranking (optional but recommended)** — a cross-encoder reranker re-scores the top-K results for relevance.
   This significantly improves precision in production systems.

8. **Context construction** — retrieved chunks are assembled into a context block with source metadata attached
   (document name, page, section).

9. **Generation** — the LLM receives a system prompt, the assembled context, and the user's query. It generates a
   grounded answer, citing the sources.

10. **Response delivery** — the answer is streamed back to the user with source citations displayed.

## Our Technology Stack

We are opinionated about tools. We use technologies we have deployed in production and understand deeply — not
whatever is newest or most hyped.

### Backend Framework: FastAPI (Python)

We build all AI backends in FastAPI. Python is the lingua franca of AI/ML engineering — all major model libraries,
embedding tools, and LLM frameworks are Python-first. FastAPI gives us high performance (async by default),
automatic OpenAPI documentation, strong typing with Pydantic, and a clean pattern for streaming responses via
Server-Sent Events.

Our team is experienced with TypeScript, Go and Rust. If a customer's project is written in a different language,
the details are discussed individually.

### Vector Databases

**Qdrant** — our default for most production RAG systems. Purpose-built for vector search, supports filtering,
payload storage, and hybrid search (dense + sparse) natively. Fast, well-maintained, and can be self-hosted.

**pgvector** — our choice when the client already runs PostgreSQL and wants to minimize infrastructure complexity.
Entirely sufficient for knowledge bases under ~1 million vectors.

**Pinecone** — when a client requires a fully managed, serverless vector database with no infrastructure overhead.

### Embedding Models

**OpenAI text-embedding-3-small** — our default for most use cases. Excellent quality-to-cost ratio, adequate for
the vast majority of production RAG systems.

**OpenAI text-embedding-3-large** — when retrieval quality is critical and cost is secondary.

**FastEmbed** — lightweight, fast Python library natively compatible with the Qdrant database.

**Local embedding models (e5-large, bge-m3, nomic-embed)** — when a client has data privacy requirements and cannot
send data to external APIs.

### RAG Frameworks

**LangChain** — we use LangChain's document loaders, text splitters, and retrieval chains.

**LlamaIndex** — preferred for complex document hierarchies, multi-document reasoning, and structured data
integration.

**Direct API** — for simpler systems, we skip frameworks entirely and call the OpenAI / Qdrant APIs directly. Less
abstraction, more control, easier debugging.

### Fine-Tuning Stack

**HuggingFace Transformers + PEFT / LoRA** — for all fine-tuning work. LoRA fine-tunes a small number of additional
parameters rather than updating all model weights, dramatically reducing compute cost and training time.

**Weights & Biases** — experiment tracking for all training runs.

**vLLM** — our preferred serving framework for open-source models in production.

### Observability and Evals

**LangSmith / Langfuse / Arize** — for production tracing, prompt monitoring, and regression detection.

**Braintrust** — LLM eval orchestration, datasets, CI integration. Most senior-eng-favored right now.

**RAGAS** — RAG-specific retrieval + generation metrics.

**Custom eval harnesses** — golden test sets, LLM-as-judge metrics, and CI/CD eval gates for all production AI
systems.

### Infrastructure

**Docker + Docker Compose** — all services are containerized.

**AWS / Azure** — for production cloud deployments, especially for clients with enterprise compliance requirements.

**Railway / Render** — for lighter deployments, staging environments, and smaller-scale productions.

## What Is RAG?

### What Is RAG?

Retrieval-Augmented Generation (RAG) is an architecture that combines a retrieval system with a large language
model (LLM) to produce answers grounded in a specific knowledge base. Instead of relying solely on what the LLM
learned during training, a RAG system first fetches relevant documents from your data at query time, then passes
those documents to the LLM as context for generating an answer.

The result: an AI system that answers questions accurately from your specific data, stays up to date as your data
changes, and doesn't hallucinate facts it doesn't know — because every answer is anchored to retrieved source
documents.

### Why RAG Instead of Just Prompting an LLM?

A plain LLM — even GPT-4 — has no knowledge of your internal data. It cannot answer questions about your product
documentation, your support history, your internal processes, or your proprietary knowledge. You could put some of
this in a system prompt, but the context window has limits — you cannot stuff 50,000 documents into a prompt.

RAG solves this by making retrieval dynamic: it finds the most relevant documents for each specific query and only
passes those to the LLM. This means your knowledge base can be arbitrarily large.

## When Is RAG the Right Choice?

RAG is the right architecture when:
- You have a large, dynamic knowledge base that changes over time
- You need answers grounded in specific, citable sources
- You need to add AI to an existing knowledge corpus without retraining a model
- Your users need natural language access to internal data

RAG is NOT the right choice when:
- Your task requires deep domain-specific reasoning that general LLMs cannot handle (consider fine-tuning instead)
- Your knowledge base is very small and static (a simple system prompt may suffice)
- Latency is extremely critical and you cannot afford retrieval round-trips

For a fuller decision framework across all three approaches, see Fine-Tuning vs. RAG vs. Prompting, How to Choose.
"""
