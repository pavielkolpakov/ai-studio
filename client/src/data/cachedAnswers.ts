import type { SuggestionItem } from "@/components/SuggestionButtons";

export interface CachedAnswer
{
  answer: string;
  followups: SuggestionItem[];
}

export const CACHED_ANSWERS: Record<string, CachedAnswer> = {
  services_and_pricing: {
    answer: `We're an AI engineering studio. Our work is organized around three stages rather than a service catalog:

**AI Audit**
We examine where AI can create measurable value across your product, operations, workflows, data, and existing AI systems. The output is a prioritized opportunity map and roadmap based on your actual situation - not a generic list of AI ideas. Priced by scope, and free for selected strategic companies.

**AI Implementation**
Once an opportunity is validated, we design and build the production system: AI features embedded in your existing product, AI-native features built from scratch, workflow automation, agents and MCP integrations, RAG and knowledge systems, voice AI, evaluation and observability infrastructure. Every implementation is custom-scoped after the requirements are understood - fixed-price where the scope is clear enough to support it.

**AI Optimization**
For AI systems already in production: quality, cost, latency, reliability, evaluation, observability, architecture. An ongoing engineering engagement where it's appropriate.

We don't publish package prices. Implementation scope varies substantially with your systems, data, integrations, and quality requirements - a number quoted before we understand your problem would be a guess. You pay for outcomes and defined work, not a list of hours or technologies.

Want to tell us about your product? We can point to which stage fits your situation.`,
    followups: [
      { text: "What's the process like", cacheKey: "process" },
      { text: "Show example projects", cacheKey: "show_example_projects" },
      { text: "How do we get started?", cacheKey: "how_to_get_started" }
    ],
  },
  process: {
    answer: `The journey is intentionally simple: Audit, then Build, then Optimize. Not every client needs every stage.

**1. Intro call (free, 30 minutes)**
With an engineer, not a salesperson. You describe your product, workflows, and existing AI work. We tell you honestly whether there's a meaningful AI opportunity and whether we're the right team for it. If we're not, we say so - and often suggest who would be.

**2. AI Audit (typically 1-3 weeks)**
Where the opportunity or technical direction is unclear, the audit provides the deeper assessment: product, operations, workflows, data, existing AI, and infrastructure. You receive an AI opportunity map, a prioritized roadmap, technical recommendations, business impact estimates, an implementation plan, and a clear view of risks and dependencies. The roadmap is yours to keep, whether or not we build anything.

**3. Build**
Scoped around a specific outcome. You see every task in a shared Linear or Notion workspace, daily commits to a GitHub repo you own from day one, weekly written updates, and a staging environment early - no big reveal at the end. Every project is staffed with senior engineers; we take on 3-4 projects per quarter deliberately.

**4. Handover**
Documentation written for a developer who has never seen the project, a walkthrough with your team, and a runbook. All code belongs to you - no lock-in, architectures that let you change models or components later.

**5. Ongoing optimization (optional)**
Many clients continue with a recurring engineering engagement: quality, cost, latency, reliability, evaluation, new capabilities.

If AI isn't the right solution, we'll tell you at the audit stage - not six weeks into a build.

Anything specific about the process you'd like to know more about?`,
    followups: [
      { text: "How is pricing structured?" },
      { text: "How do we get started?", cacheKey: "how_to_get_started" },
      { text: "Book a call", action: "calendly" },
    ],
  },
  show_example_projects: {
    answer: `Three projects that show the range of what we build - an audit, an integration, and a custom platform.

**AI Feature Audit - Construction-tech SaaS (2 weeks, $5,000)**
A 90-person construction-tech SaaS knew they "should do something with AI" but had five competing internal ideas and no clear winner. We ran a 2-week audit: data inventory across 18 candidate sources, 12 user interviews, prompt and cost audit of two existing AI features they'd shipped, and a small RAG prototype on a 200-document slice. Two ideas leadership was excited about ("predict project delays," "AI sales assistant") were rejected with reasoning - one lacked data, the other solved a problem users didn't have. Final deliverable: a prioritized 90-day roadmap with effort/impact estimates. The top recommendation became a $32k build.

**Embedded AI Research Assistant over SEC Filings - Investment-research SaaS (9 weeks, $42,000)**
A B2B research platform used by ~90 hedge funds had 1.4M SEC filings and 300k earnings transcripts buried behind keyword search. Analysts were spending 40% of their week on Ctrl-F in PDFs. We built a citation-first AI assistant embedded directly in their product: section-aware chunking, hybrid retrieval (BM25 + dense embeddings + Cohere reranker), and a two-stage prompt that summarizes candidates before final synthesis. Every claim deep-links to the exact paragraph in the source. Citation correctness hit 96.8% (vs. 74% baseline). Average time-to-answer dropped from 15 minutes to 90 seconds. The client upsold it as a paid tier and closed three six-figure expansions in the first quarter.

**Production Agentic RAG - Observability SaaS (12 weeks, $78,000)**
A large observability platform wanted an incident-response copilot but hallucinations would be catastrophic for on-call engineers. We built a diagnostic agent where deterministic analytics run first (change-point detection, deploy correlation, span anomalies) and produce a structured evidence bundle - the LLM only narrates and ranks over that bundle, it never invents facts. Multi-tenant RBAC, full eval harness with LangSmith tracing, and a regression suite running on every PR. Top-3 root-cause accuracy hit 82%, citation hallucination rate measured at 0.6%, and median time-to-diagnose at pilot customers dropped from 42 minutes to 17. Shipped as an Enterprise-tier add-on.

Want to tell us about your situation? We can point to which of these patterns is closest to what you'd need.`,
    followups: [
      { text: "RAG vs fine-tuning?" },
      { text: "What's in discovery?" },
      { text: "Your tech stack?" },
    ],
  },
  how_to_get_started: {
    answer: `Getting started is light - we don't ask you to commit to anything until you've had a real technical conversation with us.

**1. Run the AI Opportunity Scanner**
On our homepage: describe your company, product, or workflow and get tailored AI opportunities based on our library of real projects and templates. Two minutes, no form, no discovery call required.

**2. Free 30-minute intro call**
With an engineer, not a salesperson. You describe the problem you're trying to solve, your current stack, your data situation, and what a successful outcome looks like. We tell you honestly whether there's a meaningful AI opportunity and whether we're the right team for it. If we're not, we say so - and often suggest who would be.

**What's useful to bring:**
- A description of the problem you're trying to solve with AI
- Information about your current tech stack and infrastructure
- A rough sense of your data (what format, how much, where it lives)
- Your timeline and constraints

**3. AI Audit**
Where the opportunity or direction is unclear, the audit (typically 1-3 weeks, priced by scope, free for selected strategic companies) examines your product, workflows, data, and existing systems. It ends in a prioritized roadmap and an implementation plan - yours to keep either way.

**4. Build, handover, optional optimization**
Once a scope is agreed, we build. You see daily commits, a staging environment early, and weekly updates. At the end you get full code ownership, documentation, and a walkthrough with your team. Many clients continue with an ongoing optimization engagement afterward.

The fastest way to start: run the scanner or tell us what you're working on. We can usually tell you within a single call whether AI is the right tool for it.`,
    followups: [
      { text: "Show example projects", cacheKey: "show_example_projects" },
      { text: "Ideas for my project", action: "ideas-prompt" },
      { text: "Book a call", action: "calendly" },
    ],
  },
  about: {
    answer: `Neuronetis is an AI engineering studio that builds production-grade AI systems for IT companies and software product teams.

**What we focus on:**
We specialize in integrating AI directly into existing software products and building new AI-native applications from the ground up - RAG, LLM integration, agentic workflow automation, voice AI, MCP integrations, fine-tuning, and evals infrastructure. We are not a general software agency, and we don't resell OpenAI wrappers.

**Who we work with:**
B2B SaaS companies (50-500 employees), software agencies that need an AI subcontractor, scale-ups sitting on large proprietary datasets, and AI-first startups with a funded idea but no in-house ML capability. We work best with clients who have a technical point of contact internally - a CTO, VP of Engineering, or technical lead.

**How we're organized:**
Three specialized teams covering the full delivery stack - AI/Backend (RAG, LLM integration, fine-tuning, agents, evals, plus the APIs that wrap them), Frontend/Mobile (web apps, admin interfaces, embedded chat, mobile), and DevOps (infrastructure, CI/CD, observability, production reliability). Every project is staffed with senior engineers from the relevant teams.

**How we're set up:**
Distributed studio with lead engineers in Israel and Europe, working in European and overlap-friendly time zones. We deliberately take on 3-4 projects per quarter so every client gets senior-level attention - no juniors handed a spec.

**What we're not:**
A general software agency. We focus exclusively on AI engineering. If your problem doesn't call for AI, we'll tell you.

Want to describe what you're building? We can tell you fairly quickly whether it's something we'd be the right fit for.`,
    followups: [
      { text: "Your tech stack?" },
      { text: "How do we get started?", cacheKey: "how_to_get_started" },
      { text: "Ideas for my project", action: "ideas-prompt" },
    ],
  },
};
