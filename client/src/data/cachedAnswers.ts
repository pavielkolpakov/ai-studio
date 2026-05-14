import type { SuggestionItem } from "@/components/SuggestionButtons";

export interface CachedAnswer
{
  answer: string;
  followups: SuggestionItem[];
}

export const CACHED_ANSWERS: Record<string, CachedAnswer> = {
  services_and_pricing: { // +
    answer: `We offer three core services:

**AI Audits** — A focused 1–3 week engagement where we assess your AI opportunity and deliver a concrete roadmap: what to build, what to skip, and rough cost and timeline for each. We also do implementation reviews if you've already built something and want an honest outside read.
Starting from $1,500.

**AI Integration** — We add AI capabilities to your existing product or internal systems. Intelligent search, AI assistants, automated classification, knowledge bases, agent integrations — built into what you already have without replacing it.
Timeline: 3–9 weeks. Starting from $5,000. Typical engagements run $8,000–$40,000 depending on scope.

**Custom AI Apps** — We design and build a new AI-native application end to end. For clients with a product idea who need a team to architect and ship it.
Timeline: 6–16 weeks. Starting from $15,000. Typical engagements run $20,000–$50,000.

All projects are fixed-scope with a defined deliverable and price — no hourly billing, no surprise overruns. Every engagement starts with a discovery phase where we map your data, define the problem precisely, and confirm the architecture before any building begins.

After a project ships, many clients stay on a monthly retainer ($1,500–$3,000/month) for ongoing improvements, new data sources, or senior AI engineering on demand.

Want to tell us about your product? We can give you a more specific idea of what scope and cost would look like for your situation.`,
    followups: [
      { text: "What's the process like", cacheKey: "process" }, // +
      { text: "Show example projects", cacheKey: "show_example_projects" }, // +
      { text: "How do we get started?", cacheKey: "how_to_get_started" } // +
    ],
  },
  process: { // +
    answer: `Every engagement follows the same structure:

**1. Discovery (1 week)**
Before we write a line of code, we map your data sources, define the problem precisely, and run quick experiments on a subset of your real data. We deliver a written technical recommendation — architecture, timeline, and cost — so you know exactly what you're committing to before the build starts.

**2. Build**
Fixed-scope delivery with weekly check-ins and continuous progress visible through shared project management tools. You're never waiting for a final delivery to see what's happening. We staff every project with senior engineers — we take on 3–4 projects per quarter deliberately so no client gets handed off to a junior.

**3. Handover**
All code is yours. We document everything as if we'll never speak again. Your team should be able to maintain and extend everything we build without us. Every project includes a handover session and 30-day post-launch support window.

**4. Ongoing (optional)**
Many clients continue with a monthly retainer for expanding the system, improving quality, or adding new capabilities over time.

A few things we don't do: we don't bill by the hour, we don't lock you into proprietary tooling, and we don't start building until we're confident in the architecture. If AI isn't the right solution for your problem, we'll tell you in discovery — not six weeks into a build.

Anything specific about the process you'd like to know more about?`,
    followups: [
      { text: "How is pricing structured?" }, // +
      { text: "Ideas for my project", action: "ideas-prompt" },
      { text: "Book a call", action: "calendly" }, // +
    ],
  },
  show_example_projects: { // TODO: rewrite
    answer: `Here are three projects that show the range of what we build - across an audit, an integration, and a custom app.

**AI Opportunity Audit - Construction-tech SaaS (3 weeks, $8,500)**
A 90-person construction-tech SaaS knew they "should do something with AI" but had five competing internal ideas and no clear winner. We ran a 3-week audit: data inventory across 18 candidate sources, 12 user interviews, and a small RAG prototype on a 200-document slice to validate retrieval quality on their real document mess. Two ideas leadership was excited about ("predict project delays," "AI sales assistant") were rejected with reasoning - one lacked data, the other solved a problem users didn't have. Final deliverable: a prioritized roadmap with scoped costs. The top recommendation became a $24k build.

**AI Research Assistant over SEC Filings - Investment-research SaaS (10 weeks, $38,000)**
A B2B research platform used by ~90 hedge funds had 1.4M SEC filings and 300k earnings transcripts buried behind keyword search. Analysts were spending 40% of their week on Ctrl-F in PDFs. We built a citation-first AI assistant: section-aware chunking, hybrid retrieval (BM25 + dense embeddings + Cohere reranker), and a two-stage prompt that summarizes candidates before final synthesis. Every claim deep-links to the exact paragraph in the source. Citation correctness hit 96.8% (vs. 74% baseline). Average time-to-answer dropped from 15 minutes to 90 seconds. The client upsold it as a paid tier and closed three six-figure expansions in the first quarter.

**Incident-Response Copilot - Observability SaaS (11 weeks, $46,000)**
A large observability platform wanted "ChatGPT for incidents" but hallucinations would be catastrophic for on-call engineers. We built a diagnostic agent where deterministic analytics run first (change-point detection, deploy correlation, span anomalies) and produce a structured evidence bundle - the LLM only narrates and ranks over that bundle, it never invents facts. Top-3 root-cause accuracy hit 82%, citation hallucination rate measured at 0.6%, and median time-to-diagnose at pilot customers dropped from 42 minutes to 17. Shipped as an Enterprise-tier add-on.

Want to tell us about your situation? We can point to which of these patterns is closest to what you'd need.`,
    followups: [
      { text: "RAG vs fine-tuning?" }, // +
      { text: "What's in discovery?" }, // +
      { text: "Your tech stack?" }, // +
    ],
  },
  how_to_get_started: { // +
    answer: `Getting started is light - we don't ask you to commit to anything until you've had a real technical conversation with us.

**1. Free 20-minute scoping call**
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
Once the spec is signed off, we build. You see daily commits, a staging environment within two weeks, and weekly updates. At the end you get full code ownership, a 90-minute handover session, a runbook, and a 30-day support window. Many clients continue on a monthly retainer afterward.

The fastest way to start: tell us what you're working on. We can usually tell you within a single call whether AI is the right tool for it and what scope makes sense.`,
    followups: [
      { text: "Show example projects", cacheKey: "show_example_projects" }, // +
      { text: "Ideas for my project", action: "ideas-prompt" }, // +
      { text: "Book a call", action: "calendly" }, // +
    ],
  },
  about: { // TODO: rewrite
    answer: `Neuronetis is an AI engineering studio that builds production AI systems for IT and SaaS companies.

**What we focus on:**
AI Audits, agent integrations, and software development — exclusively for technical companies. We don't build generic chatbots or resell API wrappers. Every project starts with a real problem and ends with something measurable.

**Who we work with:**
CTOs and engineering leads at SaaS companies and IT product companies, typically 50–500 employees. We work best with clients who have a technical team internally — we extend it, not replace it.

**How we're set up:**
Small and deliberately so. We take on 3–4 projects per quarter so every client gets senior-level attention. We're based in Israel with delivery experience across the US, Israel, and Europe.

**What we're not:**
A general software agency. We focus exclusively on AI engineering. If your problem doesn't call for AI, we'll tell you.

Want to describe what you're building? We can tell you fairly quickly whether it's something we'd be the right fit for.`,
    followups: [
      { text: "Your tech stack?" }, // +
      { text: "How do we get started?", cacheKey: "how_to_get_started" }, // +
      { text: "Ideas for my project", action: "ideas-prompt" }, // +
    ],
  },
};
