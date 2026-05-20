# Neuronetis Project Catalog

---

## 1. RAG / Internal Knowledge Assistant

A retrieval-augmented generation system that lets your team (or your customers) ask questions in plain language and get accurate, cited answers pulled from your own documents, tickets, wikis, codebases, or databases — not from the internet.

Companies lose hours every week to internal knowledge hunting: engineers asking the same questions in Slack, support agents digging through outdated docs, onboarding taking weeks because nothing is findable. A knowledge assistant solves this at the infrastructure level. It indexes your content, understands natural language queries, retrieves the most relevant chunks, and synthesizes a clear answer with source links — so nothing gets hallucinated and everything is traceable.

**How it's built:**
Documents and data sources are ingested, chunked, and embedded into a vector database (Qdrant). A hybrid retrieval layer (semantic + keyword) finds the most relevant chunks for each query. An LLM synthesizes the chunks into a coherent answer with source citations. A React chat interface sits on top. Access control, multi-tenancy, and an eval harness are wired in from day one so the system is production-safe, not just a demo.

**Who buys this:**
- SaaS companies with large internal wikis, runbooks, or support knowledge bases
- Customer support teams handling 1,000+ tickets/month
- Engineering teams managing complex internal documentation
- Legal and compliance teams working with large document repositories
- HR/People ops teams handling policy and onboarding content

**Numbers:**
- Notion reduced average support resolution time by 34% while handling over 1 million tickets per year with an AI knowledge layer
- RAG market projected to grow from $1.9B (2025) to $10.2B by 2030 (39.7% CAGR)
- Typical ROI: 3–5 hours saved per employee per week in knowledge-heavy teams
- Typical project size: $18,000–$35,000 fixed for an MVP build

---

## 2. AI Feature Audit & LLM Readiness Sprint

A 1–2 week diagnostic engagement that maps your current AI usage, surfaces what's broken or underperforming, and produces a prioritized roadmap for what to build next — with effort estimates and ROI projections for each item.

Most companies using AI in 2026 are doing it badly: prompts that drift, no evals, models that cost 10x more than necessary, hallucinations nobody is measuring, and AI "features" that engineers are quietly embarrassed by. This engagement turns that chaos into a clear picture. We audit every AI touchpoint in your product or operations, benchmark it against production standards, and hand you a concrete 90-day action plan.

**How it's built:**
Structured discovery across your codebase, infrastructure, and workflows. Prompt audit (quality, injection risk, cost efficiency). Model selection review (are you using the right model for each task?). Eval gap analysis — what's being measured vs. what should be. Cost modeling. Output: a written report with prioritized recommendations, effort/impact matrix, and a readout session with your engineering leadership.

**Who buys this:**
- Series A–C SaaS companies with AI features already in production but no systematic quality process
- Engineering leaders preparing to pitch an AI roadmap to their board
- Companies that shipped AI features fast and are now seeing reliability or cost problems
- CTOs inheriting a codebase that "uses AI" but nobody fully understands

**Numbers:**
- Aimpoint Digital documented a 68% reduction in GenAI run cost and 50% inference speed improvement from a single 1-week optimization sprint
- McKinsey (2025): 88% of organizations use AI in at least one function, but only ~6% achieve meaningful business impact — the gap is almost always execution quality, not model capability
- Typical project size: $5,000–$12,000 fixed
- Converts to follow-on builds at roughly 30% rate — making this the highest-ROI first engagement for both sides

---

## 3. Embedded LLM Feature for an Existing SaaS Product

Adding a specific, production-grade AI capability directly into your existing product — an in-app copilot, AI-powered search, smart draft generator, intelligent autofill, or summarization layer — shipped as a real feature your customers actually use.

Every SaaS product in 2026 is under pressure to ship AI. The problem is most engineering teams are stretched, and building AI features properly (with evals, fallback handling, cost controls, and real UX) is different from regular feature work. We drop into your stack, scope one high-impact AI feature, and ship it in 3–5 weeks with everything production-ready: prompt management, eval harness, cost monitoring, error handling, and a polished UI.

**How it's built:**
Feature scoping and prompt architecture design. Backend integration via FastAPI, connecting your data sources to the LLM layer. RAG added if the feature needs to reference proprietary data. React UI component built to match your design system. Eval golden set created for the feature so regressions are caught in CI. Observability hooks (LangSmith or Langfuse) added for production monitoring.

**Who buys this:**
- B2B SaaS PMs and VPs of Engineering at Series A–D companies
- Product teams that have "add AI" on the roadmap but can't pull engineers off core work
- SaaS companies that have seen a competitor ship an AI feature and need to close the gap fast
- Founders who want to validate an AI feature before committing to a full internal build

**Numbers:**
- Enterprise AI application spend hit $19B in 2025, up from $6B in 2024 (Menlo Ventures)
- 76% of enterprise AI solutions are now bought or outsourced rather than built internally
- PLG-driven AI feature demand grew 4x YoY in 2025 — every SaaS PM has it on their roadmap
- Typical project size: $20,000–$40,000 fixed per feature

---

## 4. Customer Support Copilot & Deflection Agent

An AI system that sits inside your support workflow — either helping agents respond faster with suggested replies and context lookups, or handling tickets end-to-end before they reach a human. Integrated with your existing helpdesk (Zendesk, Intercom, HubSpot, Freshdesk).

Support is the highest-ROI AI use case because the math is immediate and visible: every ticket the AI resolves is a ticket a human doesn't touch. But consumer-grade solutions like Intercom Fin fail B2B teams because they can't handle account-level context, multi-stakeholder relationships, or the nuanced edge cases that SaaS support teams deal with daily. A custom-built system handles your specific product, your data, your escalation logic — and it gets measurably better over time.

**How it's built:**
RAG layer over your knowledge base, past ticket history, and product documentation. Helpdesk integration via API (Zendesk, Intercom, etc.). Intent classification to route tickets to auto-resolve, suggest-and-confirm, or human escalation. Action-taking capabilities (look up account data, process simple requests like resending invoices). Human handoff with full context preservation. Eval harness tracking deflection rate, CSAT, and hallucination rate weekly.

**Who buys this:**
- SaaS companies handling 2,000–50,000 support tickets per month
- Heads of Customer Support and CX Operations
- Companies with a support team of 5–50 agents where scaling headcount is no longer viable
- B2B SaaS with complex products where support agents spend 40%+ of their time on repetitive questions

**Numbers:**
- Decagon reports average deflection rates of 70% for enterprise clients; Duolingo achieved 80%+
- ROI formula: 1,000 tickets/week × 70% deflection × $20/ticket handling cost = ~$728,000/year saved
- Notion handled 1M+ tickets/year with a 34% reduction in resolution time post-AI implementation
- Typical project size: $60,000–$100,000 initial build + optional $5,000–$10,000/month retainer for ongoing improvement

---

## 5. MCP Server / Agent-Ready Integration Layer

Building a Model Context Protocol (MCP) server that exposes your SaaS product's data and actions to AI agents and coding tools — so that customers using Claude, ChatGPT, Cursor, or any agent framework can interact with your product natively, without copy-pasting or manual steps.

MCP is becoming the standard protocol for how AI agents connect to external systems — the way REST APIs became standard for web integrations. B2B SaaS products that don't have an MCP server will start losing deals to competitors that do. Building it properly requires OAuth lifecycle management, well-designed tool definitions, rate limiting, audit logging, and multi-tenant security — not just wrapping your API in a few function calls.

**How it's built:**
Tool schema design (defining what actions and data the MCP server exposes). OAuth 2.0 authentication flow implementation. Rate limiting and abuse prevention. Audit logging for compliance. Multi-tenant context isolation. Tool testing against Claude Desktop, Cursor, and ChatGPT. Documentation and onboarding guide for your customers. Optional: streaming support for long-running operations.

**Who buys this:**
- B2B SaaS product and engineering leaders whose customers are actively using AI coding tools or agents
- Developer-tools companies (CI/CD, monitoring, project management, CRM, analytics) whose users live in AI-powered IDEs
- SaaS companies preparing for enterprise RFPs that increasingly include "AI agent compatibility" requirements
- Platforms that want to be discovered and used inside AI agent workflows without building a full integration for every tool

**Numbers:**
- MCP SDK installations crossed 97 million in March 2026 (up from ~2 million at launch in November 2024)
- 28% of Fortune 500 companies have deployed MCP servers as of early 2026
- Gartner forecasts 75% of API gateway vendors and 50% of iPaaS vendors will have MCP features by end of 2026
- Typical project size: $40,000–$90,000 for a production-grade build

---

## 6. AI-Augmented Internal Workflow & Ops Automation

A custom agentic workflow that automates a high-volume, repetitive internal process — lead enrichment and routing, contract review and extraction, financial reconciliation, report generation, or any ops task currently done by a human following a repeatable decision tree.

Operations teams in 2026 are drowning in work that is too variable for traditional RPA but too repetitive for skilled humans to do all day. AI agents can handle this middle layer: tasks that require reading unstructured data, making judgment calls within defined parameters, and taking actions across multiple systems. Unlike no-code workflow builders, a properly engineered agentic workflow handles edge cases, fails gracefully, logs everything for audit, and gets better as you feed it feedback.

**How it's built:**
Process mapping to identify the exact decision points and data flows. Agent architecture design (single agent vs. multi-agent orchestration). Integration with source systems via API (CRM, ERP, databases, email, Slack). LLM layer for classification, extraction, and generation tasks. Human-in-the-loop checkpoints for low-confidence decisions. Monitoring dashboard showing throughput, error rate, and human escalation rate. Eval harness to catch regressions when the underlying data patterns shift.

**Who buys this:**
- RevOps and Sales Ops leaders at B2B SaaS companies (50–500 employees)
- Finance Ops and accounting teams doing high-volume document processing
- Legal Ops teams reviewing standard contracts at scale
- Marketing Ops teams managing large-scale content or campaign workflows
- Operations leaders at companies that just raised and need to scale without proportionally growing headcount

**Numbers:**
- McKinsey (2025): Marketing and sales operations represent the functions with the most reported revenue-side AI impact
- Companies deploying agentic workflows in operations report 40–60% reduction in manual processing time within 90 days
- ROI window is typically 60–90 days — faster than almost any other software investment
- Typical project size: $30,000–$80,000 depending on number of systems integrated and complexity of decision logic

---

## 7. Production-Grade Agentic RAG System

A full-scale, multi-tenant RAG platform built for production workloads — with hybrid search, re-ranking, role-based access control, multi-source ingestion pipelines, agentic orchestration for multi-step queries, and complete observability. The step-up from an MVP to something that runs reliably at scale.

MVP RAG systems break under real conditions: they hallucinate when the query requires reasoning across multiple documents, they expose data across tenants if access control is bolted on rather than designed in, and they degrade silently when the underlying documents change. A production-grade system is architected differently from the start — with retrieval strategies that adapt to query complexity, eval pipelines that catch regressions before users do, and the operational tooling to improve it continuously.

**How it's built:**
Multi-source ingestion pipeline (PDFs, Notion, Confluence, Salesforce, databases, code repos). Hybrid retrieval combining dense vector search, sparse BM25, and optional knowledge graph traversal. Re-ranking layer (cross-encoder or LLM-as-judge) to improve answer quality. Multi-tenant RBAC ensuring users only retrieve data they're authorized to see. Agentic orchestration layer for queries that require multiple retrieval steps or tool calls. Comprehensive eval harness: retrieval precision/recall, answer faithfulness, groundedness. Production observability via LangSmith or Langfuse. Admin dashboard for content management and quality monitoring.

**Who buys this:**
- Companies that built a RAG MVP and hit reliability or scale limits
- Enterprise SaaS platforms embedding knowledge retrieval as a core product feature
- Compliance-heavy industries (legal, finance, healthcare) requiring access-controlled document intelligence
- Companies managing knowledge across multiple products, teams, or customer accounts

**Numbers:**
- RAG system production builds typically price at $50,000–$100,000 depending on integration complexity
- Enterprise RAG platforms regularly replace 3–5 separate SaaS subscriptions (search tools, wiki tools, support knowledge bases), with consolidation ROI of $80,000–$200,000/year
- Re-ranking alone typically improves answer quality scores by 20–35% over basic vector search

---

## 8. AI Evals & Observability Harness

Designing and implementing the evaluation infrastructure that tells you whether your AI system is actually working — and alerts you before users notice when it isn't. Includes golden test sets, LLM-as-judge metrics, regression suites, CI/CD eval gates, and production tracing.

Most AI systems in production have no systematic way to know if they're getting better or worse. A prompt change that improves one case silently breaks ten others. A model upgrade that looks good in a demo degrades on edge cases in production. Evals are what separate teams that ship AI confidently from teams that ship and pray. This engagement builds the measurement infrastructure your AI system should have had from the beginning — and trains your team to maintain it.

**How it's built:**
Golden dataset construction: curating 50–200 representative input/output pairs that cover normal cases, edge cases, and known failure modes. Metric design: task-specific metrics (retrieval precision, answer faithfulness, tool call accuracy, latency) plus LLM-as-judge for qualitative dimensions. Eval harness implementation in your CI/CD pipeline so every code change is automatically tested against the golden set. Production tracing setup (LangSmith, Langfuse, or Arize) with dashboards and alerting. Regression playbook: documented process for investigating failures and updating the golden set over time. Team training session on eval-driven development.

**Who buys this:**
- AI-native SaaS startups post-product launch that are scaling usage and seeing reliability issues
- Enterprise AI platform teams that have multiple AI features and no unified quality measurement
- Companies preparing for enterprise sales where customers will ask "how do you know it works?"
- Engineering teams that have experienced a high-profile AI failure in production and need to prevent recurrence

**Numbers:**
- Braintrust raised $80M Series B at an $800M valuation in February 2026 — evals infrastructure is now a serious category
- Companies that implement eval pipelines report catching 60–80% of regressions before they reach production
- Typical project size: $15,000–$30,000 for initial harness setup and team training
- Ongoing retainer model common: $3,000–$6,000/month for eval maintenance and golden set expansion

---

## 9. Model Fine-Tuning Engagement

Adapting a foundation model to your specific domain, writing style, task format, or proprietary data — so it performs significantly better on your use case than a general-purpose model with prompting alone.

Fine-tuning is the right tool for a specific set of problems: when you need consistent output format across thousands of generations, when your domain has specialized terminology that general models handle poorly, when latency or cost requires a smaller model to match a larger one's quality, or when your data is proprietary and can't be sent to a hosted API. Used correctly, a fine-tuned model can outperform GPT-4-class models on your specific task while running at a fraction of the cost.

**How it's built:**
Use-case assessment: confirming that fine-tuning (vs. RAG or prompt engineering) is the right solution for the problem. Training data curation and formatting: cleaning, structuring, and augmenting your dataset into the format required for supervised fine-tuning or RLHF. Base model selection: choosing the right open-source or API-accessible model given your latency, cost, and deployment constraints. Fine-tuning run: supervised fine-tuning with validation split, learning rate tuning, and early stopping. Eval suite construction: before/after benchmarks on your specific tasks. Deployment: model serving setup (vLLM, Together AI, or cloud provider inference endpoint). Ongoing eval to monitor for drift as production data evolves.

**Who buys this:**
- Legal tech companies needing consistent contract clause extraction in specific formats
- Medical or healthcare-adjacent platforms requiring clinical terminology accuracy
- Financial services firms with proprietary document classification or extraction tasks
- Companies generating high volumes of structured output (reports, summaries, data extraction) where GPT-4 costs are prohibitive at scale
- Developer tools companies wanting a coding assistant fine-tuned on their specific framework or codebase

**Numbers:**
- Fine-tuned smaller models (7B–13B parameters) can match GPT-4 performance on domain-specific tasks while costing 10–50x less per inference
- Training data requirement: typically 500–5,000 high-quality examples for supervised fine-tuning on a specific task
- Typical project size: $25,000–$70,000 depending on dataset size, number of training iterations, and deployment complexity
- Best ROI case: high-volume inference workloads where even a 5x cost reduction translates to $100,000+/year in savings

---

## 10. Enterprise Knowledge & Compliance AI Platform

A bespoke, full-stack AI platform for a regulated vertical — legal contract intelligence, fintech KYC/AML document processing, healthcare compliance review, or insurance claims triage. Includes data ingestion pipelines, access-controlled retrieval, audit trails, domain-specific evals, and optionally a fine-tuned model. Deployed in the client's cloud environment or on-prem.

Regulated industries can't drop documents into ChatGPT. They need data sovereignty, complete audit trails, role-based access that maps to their org structure, and AI behavior they can explain to auditors and regulators. Building this on top of generic platforms means fighting the tool every step of the way. A purpose-built platform for the specific vertical is the right architecture — and the one that commands premium pricing because the switching cost is high once it's embedded in operations.

**How it's built:**
Domain discovery: mapping the specific document types, workflows, and regulatory requirements. Secure data infrastructure: VPC deployment, encryption at rest and in transit, data residency compliance. Custom ingestion pipelines for domain-specific document formats (contracts, filings, medical records, claims forms). Access-controlled RAG with audit logging of every query and retrieval. Domain-specific eval suite built around the regulatory definitions of "correct" output. Optional fine-tuned model for the vertical's specific extraction and classification tasks. Admin portal for document management, user management, and compliance reporting. Integration with existing systems (case management, ERP, document management platforms).

**Who buys this:**
- Mid-market law firms and legaltech companies building contract intelligence products
- Regional banks, credit unions, and fintech companies with document-heavy compliance workflows
- Healthcare administration SaaS platforms and hospital systems
- Insurance carriers and InsurTech companies handling claims at scale
- RegTech vendors building compliance tooling for specific regulatory frameworks

**Numbers:**
- Healthcare AI vertical accounted for 43% of all vertical AI spend in 2025 ($1.5B), outspending the next four verticals combined (Menlo Ventures 2025)
- Legal AI is among the fastest-growing verticals, with law firms reporting 30–50% reduction in contract review time
- KYC/AML document processing: banks report 60–80% reduction in manual review hours after AI implementation
- Regulated verticals tolerate significantly higher project pricing due to compliance value — typical project size: $150,000–$400,000
- High retention: compliance platforms become embedded in daily operations, making them near-permanent — 90%+ renewal rate on retainer contracts

---

## 11. AI Agent for Code Review & Developer Tooling

An AI agent embedded in your development workflow that performs automated code review, flags security vulnerabilities, enforces coding standards, suggests refactors, and explains complex code — fine-tuned or prompted on your specific codebase, conventions, and architectural patterns.

Generic code review tools like GitHub Copilot don't know your codebase. They flag things that violate general conventions but miss issues specific to your architecture, your internal libraries, or the decisions your team made three years ago that aren't documented anywhere. A custom code review agent learns your patterns, flags real problems, and becomes a force multiplier for your senior engineers — letting them focus on the reviews that require judgment rather than the ones that require pattern matching.

**How it's built:**
Codebase indexing: ingesting your repositories into a searchable context layer (code embeddings + AST parsing). Rule and pattern extraction: identifying your team's implicit and explicit coding standards from existing code and review comments. Agent architecture: tool-calling agent that can read files, run linters, query the codebase context, and write structured review comments. GitHub/GitLab integration via webhooks for automatic triggering on pull requests. Severity classification: distinguishing blocking issues from suggestions. Feedback loop: mechanism for engineers to accept/reject suggestions, feeding accepted patterns back into the agent's context over time. Optional fine-tuning on your internal code patterns for higher precision.

**Who buys this:**
- Engineering teams of 10–100 developers where senior engineer review bandwidth is the bottleneck
- SaaS companies with fast-moving codebases and inconsistent code quality across teams
- Development agencies wanting to enforce standards consistently across multiple client projects
- Companies with significant technical debt who want to prevent new debt from accumulating
- Regulated industries (fintech, healthtech) where code security review is a compliance requirement

**Numbers:**
- Engineering teams using AI code review report 20–40% reduction in time-to-merge for standard PRs
- Security vulnerabilities caught pre-merge cost ~$80 to fix; post-release vulnerabilities average $7,600 (NIST)
- Developer productivity gains from AI code tooling: McKinsey estimates 25–50% faster code review cycles
- Typical project size: $25,000–$60,000 for a production agent integrated into your CI/CD pipeline
- GitHub Copilot enterprise adoption growing 40% YoY — custom agents for proprietary codebases are the next layer

---

## 12. Voice AI Agent for Business Operations

A custom AI voice agent that handles inbound or outbound calls for a specific business use case — customer support, appointment scheduling, lead qualification, collections follow-up, or internal helpdesk — integrated with your existing systems and escalating to humans when needed.

Voice AI has crossed the threshold where it's indistinguishable from a human agent for structured conversations. The business case is straightforward: a voice agent handles calls 24/7 at a fraction of the cost of a human, never gets tired, and is consistent every time. The engineering challenge is making it handle your specific use case reliably — knowing when to escalate, integrating with your CRM or booking system, and recovering gracefully from the edge cases that trip up generic solutions.

**How it's built:**
Use-case scoping and call flow design: mapping the decision tree for the specific call type. Voice pipeline setup using Vapi or Retell as the infrastructure layer (STT → LLM → TTS). Conversation design: prompt architecture for the agent's persona, scope, and escalation triggers. Backend integrations: CRM lookup (Salesforce, HubSpot), calendar booking (Calendly, custom), ticketing systems. Human handoff: warm transfer logic with context summary passed to the live agent. Post-call logging: transcript storage, outcome classification, CRM updates. Eval harness: call scoring on task completion rate, escalation accuracy, and conversation quality.

**Who buys this:**
- SaaS companies with phone-based customer support wanting to deflect tier-1 calls
- Healthcare providers and dental/medical clinics handling high volumes of appointment calls
- Real estate agencies managing inbound lead qualification
- Financial services firms handling routine account inquiry calls
- E-commerce and service businesses with high inbound call volume and predictable call types

**Numbers:**
- Vapi reached a $500M valuation in May 2026 after Amazon Ring selected their platform over 40 competitors; enterprise voice AI business grew 10x since early 2025
- Voice AI agents handle calls at approximately $0.05–$0.15/minute vs. $0.50–$1.50/minute for human agents — 10–30x cost reduction
- Average deflection rate for well-implemented voice agents: 60–75% of calls fully resolved without human involvement
- Typical project size: $30,000–$80,000 for a production voice agent with full system integrations
