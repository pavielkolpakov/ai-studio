import type { SuggestionItem } from "@/components/SuggestionButtons";

export interface CachedAnswer {
  answer: string;
  followups: SuggestionItem[];
}

export const CACHED_ANSWERS: Record<string, CachedAnswer> = {
  services_and_pricing: {
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
      { text: "How does an Audit work?" },
      { text: "What do you need from us?" },
      { text: "What makes a good AI project" },
      { text: "Ideas for my project", action: "ideas-prompt" },
    ],
  },
  process: {
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
      { text: "What happens in discovery?", },
      { text: "What do you need from us?" },
      { text: "What makes a good AI project" },
      { text: "Ideas for my project", action: "ideas-prompt" },
    ],
  },
  about: {
    answer: `Neuronetis is an AI engineering studio that builds production AI systems for IT and SaaS companies.

We were founded by Pavlo, an engineer with 8 years in software and 3 years deep in AI. The studio exists because most AI projects are built too slowly, with the wrong architecture, and by teams doing it for the first time. We've done this work enough times to have a real pattern library.

**What we focus on:**
AI Audits, agent integrations, and software development — exclusively for technical companies. We don't build generic chatbots or resell API wrappers. Every project starts with a real problem and ends with something measurable.

**Who we work with:**
CTOs and engineering leads at SaaS companies and IT product companies, typically 50–500 employees, in the US and Israel. We work best with clients who have a technical team internally — we extend it, not replace it.

**How we're set up:**
Small and deliberately so. We take on 3–4 projects per quarter so every client gets senior-level attention. We're based in Israel with delivery experience across the US, Israel, and Europe.

**What we're not:**
A general software agency. We focus exclusively on AI engineering. If your problem doesn't call for AI, we'll tell you.

Want to describe what you're building? We can tell you fairly quickly whether it's something we'd be the right fit for.`,
    followups: [
      { text: "Who do you work with?" },
      { text: "How do we get started?" },
      { text: "What makes a good AI project" },
      { text: "Ideas for my project", action: "ideas-prompt" },
    ],
  },
};
