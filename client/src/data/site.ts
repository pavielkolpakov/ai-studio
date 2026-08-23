/**
 * Marketing site content.
 *
 * SOURCE OF TRUTH: Neuronetis_Website_Notes.md and
 * Neuronetis_Knowledge_Base_Revised.md. The site follows the
 * Audit → Build → Optimize narrative on a single Pricing page,
 * with transparent starting
 * prices per service — not standardized "quick wins / mid-size /
 * larger" package tiers.
 */

/* ── Pricing page ────────────────────────────────────────────────────────── */

export const PRICING_PAGE = {
  eyebrow: "Pricing",
  headline: "AI engineering, from opportunity to production.",
  sub: "We help software companies find where AI can create real value, then build and integrate the systems to capture it.",

  /** The three client situations the whole page is organized around. */
  paths: [
    {
      situation: "Not sure where AI fits?",
      answer: "Audit it.",
      body: "One to two weeks examining your product, workflows, data, and systems. You end with a prioritized opportunity map and a roadmap you can act on.",
      service: "AI Audit",
      price: "From $2,000",
      href: "#ai-audit",
    },
    {
      situation: "Know what you need?",
      answer: "Build it.",
      body: "Skip the assessment. We scope the work, then build and integrate the system into the product and infrastructure you already run.",
      service: "AI Implementation",
      price: "From $5,000",
      href: "#ai-implementation",
    },
    {
      situation: "Already have AI?",
      answer: "Optimize it.",
      body: "We review the system you're running and make it better, faster, cheaper, and easier to operate — with measurement to prove it.",
      service: "AI Optimization",
      price: "From $3,000",
      href: "#ai-optimization",
    },
  ],

  audit: {
    id: "ai-audit",
    num: "01",
    title: "AI Audit",
    price: "From $2,000",
    lead: "A fixed-length, fixed-price engagement that establishes where AI is worth building in your business — and where it isn't.",
    options: [
      {
        name: "1-week audit",
        price: "$2,000",
        body: "The standard engagement. One product area or workflow set, with the data and infrastructure behind it.",
      },
      {
        name: "2-week audit",
        price: "$4,000",
        body: "A deeper assessment across multiple workflows, systems, data sources, existing AI infrastructure, or business areas.",
      },
      {
        name: "Larger or complex audits",
        price: "Custom quote",
        body: "Unusually broad or complex scope, agreed with you before anything starts.",
      },
    ],
    evaluatesTitle: "What the audit evaluates",
    evaluates: [
      "Product and business workflows",
      "Existing AI systems",
      "Data and knowledge sources",
      "AI infrastructure",
      "Automation opportunities",
      "Technical feasibility",
      "Expected business impact",
      "Risks and dependencies",
    ],
    deliverablesTitle: "What you get",
    deliverables: [
      {
        title: "Prioritized AI opportunity map",
        body: "Every credible opportunity, ranked by impact, feasibility, and data readiness.",
      },
      {
        title: "Technical recommendations",
        body: "The approach we would take for each opportunity — and what we would deliberately avoid.",
      },
      {
        title: "Business impact estimates",
        body: "What each opportunity is worth if it works, with measurable success criteria where the numbers support it.",
      },
      {
        title: "Recommended architecture",
        body: "How the system should be built and how it fits the stack you already run.",
      },
      {
        title: "Implementation roadmap",
        body: "What to build first, what it depends on, and in what sequence.",
      },
      {
        title: "Risks and dependencies",
        body: "What could go wrong, and what to de-risk before committing engineering time.",
      },
    ],
    free: {
      title: "Selected companies receive an AI Audit for free",
      body: "We run a limited number of audits at no cost as part of our strategic outreach program. It is selective and we choose deliberately — this is not a standing offer. The audit is the same $2,000 engagement, done to the same standard.",
    },
    cta: "Request an AI Audit",
  },

  implementation: {
    id: "ai-implementation",
    num: "02",
    title: "AI Implementation",
    price: "From $5,000",
    lead: "We build and integrate production AI systems into existing products, workflows, and infrastructure — or build new AI systems from the ground up.",
    tiers: [
      {
        name: "AI Integration",
        price: "From $5,000",
        body: "An AI capability added to a product, workflow, or backend you already run.",
      },
      {
        name: "AI System / Agent Build",
        price: "From $8,000",
        body: "A system, agent, or agentic workflow built end to end and put into production.",
      },
      {
        name: "Complex AI Product / System",
        price: "From $15,000",
        body: "Multi-component systems with real data, integration, security, and reliability requirements.",
      },
    ],
    factorsTitle: "These are starting prices, not fixed packages",
    factorsIntro: "Final pricing is set once the work is scoped. It depends on:",
    factors: [
      "Scope",
      "Integrations",
      "Data",
      "Infrastructure",
      "Quality requirements",
      "Security requirements",
      "Deployment complexity",
    ],
    examplesTitle: "Work we take on",
    examples: [
      "AI product features",
      "Agents and agentic workflows",
      "MCP integrations",
      "RAG and knowledge systems",
      "Workflow automation",
      "Document processing",
      "Voice AI",
      "AI APIs and backend systems",
      "Evaluation and observability infrastructure",
    ],
    noGate: {
      title: "Already know what you need? We can scope and build it directly.",
      body: "An AI Audit is not mandatory before implementation. If the requirements are clear, we go straight to scoping the build.",
    },
    cta: "Talk to AI Engineer",
  },

  optimization: {
    id: "ai-optimization",
    num: "03",
    title: "AI Optimization",
    price: "From $3,000",
    lead: "Already have AI? We can make it better, faster, cheaper, and easier to operate.",
    body: "For companies already running an AI system — whether it is in production or an early implementation that needs serious improvement. We review what exists, then fix what is actually holding it back.",
    areas: [
      "Quality",
      "Reliability",
      "Latency",
      "Model selection",
      "Retrieval",
      "Evaluation",
      "Observability",
      "Architecture",
      "Infrastructure",
      "Operating cost",
    ],
    cta: "Review Our AI System",
  },

  ongoing: {
    title: "Ongoing AI Engineering",
    price: "From $3,000/month",
    body: "An optional continuation after an audit, implementation, or optimization engagement — a standing engineering capacity rather than a new project each time.",
    items: [
      "New AI features",
      "New integrations",
      "Optimization",
      "Evaluation",
      "Infrastructure",
      "Production improvements",
      "Additional AI projects",
    ],
  },

  closing: {
    title: "Where do you start?",
    choices: [
      { label: "Not sure what to build?", body: "Start with an AI Audit." },
      { label: "Already know what you need?", body: "Let's build it." },
      { label: "Already have an AI system?", body: "Let's make it better." },
    ],
    primary: "Request an AI Audit",
    secondary: "Talk to AI Engineer",
  },
};

/* ── Process ─────────────────────────────────────────────────────────────── */

/** The engagement journey — audit-first, not discovery-fee-first. */
export const PHASES = [
  {
    num: "00",
    title: "Intro call",
    body: "30 minutes with an engineer, not a salesperson. We learn about your product, workflows, and existing AI work — and tell you honestly whether there's a meaningful opportunity and whether we're the right team for it.",
  },
  {
    num: "01",
    title: "Audit",
    body: "Where the opportunity or technical direction is unclear, the audit provides the deeper assessment: product, workflows, data, and existing systems — ending in a prioritized roadmap and concrete recommendations.",
  },
  {
    num: "02",
    title: "Build",
    body: "Scoped around a specific outcome. A shared project board, daily commits to a repository you own, and a staging environment early. No big reveal at the end.",
  },
  {
    num: "03",
    title: "Handover & beyond",
    body: "Documentation, a walkthrough with your team, and a runbook — all code belongs to you. Continue with ongoing optimization where it makes sense.",
  },
];

/** Indicative timelines — no prices, confirmed per project after scoping. */
export const TIMELINES = [
  { name: "AI audit", time: "1–2 weeks" },
  { name: "Feature integration or RAG MVP", time: "3–6 weeks" },
  { name: "Full production RAG system", time: "6–10 weeks" },
  { name: "Agentic platform or end-to-end build", time: "3–6+ months" },
];

/** Buyer questions, aligned with the audit-first model. */
export const FAQS = [
  {
    q: "How is implementation priced?",
    a: "From published starting prices, then scoped precisely. Integrations start at $5,000, system and agent builds at $8,000, and complex AI products at $15,000. The final number depends on scope, integrations, data, infrastructure, and quality, security, and deployment requirements — we set it once the work is scoped, and we prefer fixed scope where the requirements support it.",
  },
  {
    q: "When is an audit free?",
    a: "Selected companies may receive an AI Audit for free as part of our strategic outreach program. It is selective and not a standing offer — the standard price is $2,000 for one week and $4,000 for two. The work is identical either way.",
  },
  {
    q: "Who owns the code?",
    a: "You do. All code we write is yours, in a private repository you own from day one. We document everything as if we will never speak again, so your team can maintain and extend it. No wrappers we keep and rent back to you.",
  },
  {
    q: "Do you rewrite our codebase?",
    a: "No. We integrate with your existing stack and never propose rewrites. Our systems are built as services or modules that connect to your architecture through clean API contracts. Your team keeps ownership of the rest of the product.",
  },
  {
    q: "Can you review an AI system we already built?",
    a: "Yes — that's the optimization engagement. We review quality, cost, latency, reliability, evaluation, and architecture of AI systems already in production, then improve them with your team or for your team.",
  },
  {
    q: "Do you sign NDAs, and can data stay on our infrastructure?",
    a: "Yes to both. We sign a mutual NDA before any technical discussion of your data, turned around in 24 hours, and we have standard DPAs for GDPR and HIPAA-adjacent requirements. We have built fully on-prem and private-cloud deployments with self-hosted embedding models and LLMs served via vLLM, where no data leaves your infrastructure.",
  },
];

/* ── About ───────────────────────────────────────────────────────────────── */

/** docs/vault/about/values.md, about/location-and-team.md, process/*.md */
export const ABOUT_STATS = [
  { value: "3–4", label: "projects per quarter, deliberately" },
  { value: "3", label: "teams: AI/backend, frontend, DevOps" },
  { value: "1–2 wk", label: "typical AI audit, ending in a prioritized roadmap" },
  { value: "100%", label: "code ownership — every line we write is yours" },
];

/** docs/vault/about/location-and-team.md */
export const TEAMS = [
  {
    name: "AI / Backend",
    body: "RAG pipelines, LLM integration, fine-tuning, agents and evals — plus the backend services and APIs that wrap them. This is the core of every project we deliver.",
  },
  {
    name: "Frontend / Mobile",
    body: "The client-facing layer when a project needs one: web applications, admin interfaces, embedded chat widgets and mobile apps.",
  },
  {
    name: "DevOps",
    body: "Infrastructure, CI/CD pipelines, cloud deployments, observability and production reliability across every engagement.",
  },
];

/** docs/vault/about/values.md */
export const VALUES = [
  {
    title: "We don't lock you in",
    body: "All code we write is yours. We document everything as if we will never speak again, and your team should be able to maintain and extend all of it.",
  },
  {
    title: "We price by outcome, not by hour",
    body: "Fixed-scope engagements around defined deliverables give you cost certainty. We scope carefully upfront so we do not surprise you with overruns.",
  },
  {
    title: "We work asynchronously and transparently",
    body: "You see progress continuously through shared project tools, not just at final delivery. Weekly check-ins are standard on all projects.",
  },
  {
    title: "We take 3–4 projects a quarter",
    body: "We deliberately limit capacity so every client gets senior-level attention throughout, not a junior developer handed a spec.",
  },
];

/** docs/vault/about/who-we-work-with.md */
export const FITS = [
  "B2B SaaS companies of 50–500 employees with a product that needs AI to stay competitive",
  "Software agencies that need an AI subcontractor they can engage per project for their own clients",
  "Scale-ups sitting on large proprietary datasets — documents, tickets, logs, product data — they have never made queryable",
  "AI-first startups with a funded idea but no in-house ML capability, who need to ship fast",
];

/** docs/vault/about/what-we-are-not.md */
export const NON_FITS = [
  "Generic chatbots powered by a system prompt",
  "OpenAI wrappers resold as a product",
  "AI for the sake of AI, with no clear use case",
  "General software work — we only take projects with AI at the centre",
];

export const PEOPLE = [
  { name: "Name Surname", role: "Founder, AI engineering", detail: "github.com/—" },
  { name: "Name Surname", role: "Lead, backend & retrieval", detail: "github.com/—" },
  { name: "Name Surname", role: "Lead, frontend", detail: "github.com/—" },
  { name: "Name Surname", role: "Lead, infrastructure", detail: "github.com/—" },
];

export const CONTACT_EMAIL = "info@neuronetis.com";
export const LINKEDIN_URL = "https://www.linkedin.com/company/neuronetis";
export const LOCATIONS = "Israel · US";
