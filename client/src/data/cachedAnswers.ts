import type { SuggestionItem } from "@/components/SuggestionButtons";

export interface CachedAnswer
{
  answer: string;
  followups: SuggestionItem[];
}

export const CACHED_ANSWERS: Record<string, CachedAnswer> = {
  services_and_pricing: {
    answer: `We're an AI engineering studio. Every engagement is fixed-scope with a defined deliverable, timeline, and price - no hourly billing, no surprise overruns.

Our work covers 12 service types across the AI stack: RAG and knowledge assistants, AI feature integration into existing SaaS, customer support automation, MCP servers, ops automation agents, evals and observability, model fine-tuning, voice AI, enterprise compliance platforms, code review agents, AI feature audits, and full AI-native product builds.

**Typical engagement sizes:**

**AI Audits - $2,000-$12,000 / 1-2 weeks**
Data inventory, prompt audits, cost analysis, and small RAG prototypes to identify the best opportunities for AI in your product and get a clear roadmap for next steps.

**Quick engagements - $5,000-$25,000 / 2-6 weeks**
AIRAG MVPs ($18-35k), evals harness setup ($15-30k).

**Mid-size builds - $25,000-$100,000 / 4-12 weeks**
Embedded LLM features ($20-40k), MCP servers ($40-90k), workflow automation agents ($30-80k), voice AI agents ($30-80k), code review agents ($25-60k), fine-tuning ($25-70k), production-grade RAG ($50-100k), support deflection copilots ($60-100k).

**Larger end-to-end builds - $100,000-$400,000 / 3-6+ months**
Enterprise knowledge and compliance platforms, full AI-native product builds.

**Retainer** - after a project ships, many clients continue on a monthly retainer for ongoing improvement, new data sources, and senior AI engineering on demand. Starts at $3,000/month.

Every project over $5,000 starts with a paid 1-week discovery ($1000-$2,500, deducted from the project total if you proceed) so we both know exactly what we're building before the build starts.

Want to tell us about your product? We can point to which of these is closest to what you'd need.`,
    followups: [
      { text: "What's the process like", cacheKey: "process" },
      { text: "Show example projects", cacheKey: "show_example_projects" },
      { text: "How do we get started?", cacheKey: "how_to_get_started" }
    ],
  },
  process: {
    answer: `Every engagement follows the same four phases:

**Phase 0 - Technical scoping call (free, 30 minutes)**
Not a sales call. You describe your use case, stack, and data. We tell you honestly whether AI is the right fit and roughly what the engagement would look like. If we're not the right team, we say so - and often suggest who would be.

**Phase 1 - Discovery (1 week, paid $800-$1,500)**
Every project over $5,000 starts here. We get read-only access to your data, run experiments on a real subset, interview your technical lead and end users, and deliver a written technical spec with architecture, risks, timeline, and a fixed price for the build. The fee is deducted from the project total if you proceed.

**Phase 2 - Build**
You see every task in a shared Linear or Notion workspace. Daily commits to a GitHub repo you own from day one. Weekly async written updates and an optional weekly 30-minute video check-in. A staging environment goes up within the first two weeks so you can interact with the system early. Every project is staffed with senior engineers - we take on 3-4 projects per quarter deliberately.

**Phase 3 - Handover**
A complete technical README, a 90-minute walkthrough session with your team, a written runbook, and a 30-day post-launch support window via Slack. All code is yours.

**After handover - retainer (optional)**
Many clients continue on a monthly retainer ($1,500+/month) for ongoing improvements, new data sources, or senior AI engineering on demand.

We don't bill by the hour, we don't lock you into proprietary tooling, and we don't start building until we're confident in the architecture. If AI isn't the right solution, we'll tell you in discovery - not six weeks into a build.

Anything specific about the process you'd like to know more about?`,
    followups: [
      { text: "How is pricing structured?" },
      { text: "How do we get started?", cacheKey: "how_to_get_started" },
      { text: "Book a call", action: "calendly" },
    ],
  },
  show_example_projects: {
    answer: `Three projects that show the range of what we build - an audit, an integration, and a custom platform.

**AI Feature Audit - Construction-tech SaaS (2 weeks, $9,500)**
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

**1. Free 30-minute scoping call**
Not a sales call. You describe your use case, your current stack, your data situation, and what a successful outcome looks like. We tell you honestly whether your use case is a good fit, what approach we'd recommend, and roughly what an engagement would look like. If we're not the right team for your problem, we say so - and often suggest who would be.

**What's useful to bring:**
- A description of the problem you're trying to solve with AI
- Information about your current tech stack and infrastructure
- A rough sense of your data (what format, how much, where it lives)
- Your timeline and budget range (even a rough number helps)

**2. Written proposal within 48 hours**
If there's a fit, we send a written proposal covering scope, approach, timeline, and price. No pressure - take the time you need to review it internally.

**3. Discovery (1 week, paid)**
Every project over $5,000 starts with a paid 1-week discovery ($800-$1,500, deducted from the project total if you proceed). We get read-only access to your data, run experiments on a real subset, interview your technical lead and end users, and deliver a written technical spec with a fixed price for the build. Paid discovery is deliberate - it forces both sides to do it properly rather than rush to a number.

**4. Build, handover, optional retainer**
Once the spec is signed off, we build. You see daily commits, a staging environment within two weeks, and weekly updates. At the end you get full code ownership, a 90-minute handover session, a runbook, and a 30-day support window. Many clients continue on a monthly retainer ($3,000+/month) afterward.

The fastest way to start: tell us what you're working on. We can usually tell you within a single call whether AI is the right tool for it and what scope makes sense.`,
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
Distributed studio with lead engineers in Israel, the US, and Eastern Europe, working in European and overlap-friendly time zones. We deliberately take on 3-4 projects per quarter so every client gets senior-level attention - no juniors handed a spec.

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
