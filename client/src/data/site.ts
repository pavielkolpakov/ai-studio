/**
 * Marketing site content.
 *
 * SOURCE OF TRUTH: Neuronetis_Website_Notes.md and
 * Neuronetis_Knowledge_Base_Revised.md. The site follows the
 * Audit → Build → Optimize narrative: no public package prices,
 * no standardized "quick wins / mid-size / larger" tiers.
 */

/* ── AI Audit page ───────────────────────────────────────────────────────── */

export const AUDIT_PAGE = {
  eyebrow: "AI Audit",
  headline: "Before you build AI, find out where it will actually matter.",
  sub: "Most AI projects fail because they start with a technology, not a problem. The audit examines your product, operations, and data — and hands you a prioritized set of opportunities grounded in your actual situation, not a generic list of AI ideas.",
  lookAt: [
    {
      title: "Product",
      body: "Features and user journeys — where AI could make the core product meaningfully better.",
    },
    {
      title: "Operations",
      body: "Repetitive cognitive work — review, routing, extraction, reporting — that could be automated.",
    },
    {
      title: "Workflows",
      body: "How work actually moves through your team, and where an AI step would remove friction.",
    },
    {
      title: "Data",
      body: "What data you have, where it lives, and whether it's ready to support each opportunity.",
    },
    {
      title: "Existing AI",
      body: "AI features, agents, or automations already in production — quality, cost, and reliability.",
    },
    {
      title: "Infrastructure",
      body: "Architecture, model choices, integrations, security, and deployment constraints.",
    },
  ],
  deliverables: [
    {
      title: "AI opportunity map",
      body: "Every credible opportunity across your product and operations, in one place.",
    },
    {
      title: "Prioritized roadmap",
      body: "Ranked by expected impact, feasibility, data readiness, complexity, and risk.",
    },
    {
      title: "Technical recommendations",
      body: "The architecture and approach we'd use for each opportunity — and what we'd deliberately avoid.",
    },
    {
      title: "Business impact estimates",
      body: "What each opportunity is worth if it works, with measurable success criteria.",
    },
    {
      title: "Implementation plan",
      body: "What to build first, what it requires, and in what sequence.",
    },
    {
      title: "Risks and dependencies",
      body: "What could go wrong, what each opportunity depends on, and what to de-risk early.",
    },
  ],
  after: {
    title: "What happens after the audit",
    body: "You keep the roadmap whether or not we build anything. If an opportunity is worth pursuing, we scope the implementation around a specific outcome — fixed-scope where the requirements are clear. If AI isn't the right answer for a problem, the audit says that too.",
  },
  cta: "Request an AI Audit",
};

/** Rows for the stylized sample audit deliverable on the audit page. */
export const SAMPLE_AUDIT = [
  {
    opportunity: "Support triage copilot",
    problem: "40% of tickets are repeat questions already answered in docs",
    impact: "High",
    complexity: "Medium",
    next: "Validate on 6 months of ticket history",
  },
  {
    opportunity: "Semantic search over product docs",
    problem: "Users can't find answers with keyword search",
    impact: "High",
    complexity: "Low",
    next: "Prototype on a 500-document slice",
  },
  {
    opportunity: "Automated weekly reporting",
    problem: "Ops team spends 2 days/week assembling reports by hand",
    impact: "Medium",
    complexity: "Medium",
    next: "Clean up source data first — AI is step two",
  },
];

/* ── Implementation page ─────────────────────────────────────────────────── */

export const IMPLEMENTATION_PAGE = {
  eyebrow: "Implementation",
  headline: "From AI opportunity to production system.",
  sub: "Once an opportunity is validated, we design and build the system — integrated with the product, data, and infrastructure you already have. No rewrites proposed to make the project easier for us.",
  groups: [
    {
      title: "AI inside your product",
      items: [
        "AI capabilities embedded in your existing SaaS — assistants, intelligent search, drafting, extraction, autofill",
        "AI-native product features built from the ground up",
        "Product interfaces and frontend integration for AI experiences",
      ],
    },
    {
      title: "AI across your operations",
      items: [
        "Workflow automation for repetitive cognitive work",
        "Document processing and structured extraction",
        "Customer-support automation that escalates with full context",
        "Voice AI for predictable, high-volume workflows",
      ],
    },
    {
      title: "The infrastructure behind it",
      items: [
        "Agents and MCP integrations that expose your systems to AI",
        "RAG and knowledge systems over your proprietary data",
        "Evaluation and observability infrastructure",
        "Model selection, prompting, fine-tuning, and inference optimization",
      ],
    },
  ],
  principle: {
    title: "Technology follows the problem",
    body: "We don't start with “you need RAG” or “you need an agent.” We start with the business problem, the available data, and the constraints — then choose the simplest architecture that solves it well. If a conventional software solution is better, that's the recommendation.",
  },
  delivery: [
    "Built in a repository you own, from day one",
    "Staging environment early — you see progress, not a final reveal",
    "Documentation and handover your team can actually maintain",
    "No lock-in: architectures that let you change models or components later",
  ],
};

/* ── Optimization page ───────────────────────────────────────────────────── */

export const OPTIMIZATION_PAGE = {
  eyebrow: "Optimization",
  headline: "Already have AI? Make it work better.",
  sub: "For companies with AI systems already in production that are too expensive, too slow, unreliable, or unmeasured. A demo that worked is not the same thing as a system that works.",
  groups: [
    {
      title: "Quality & reliability",
      items: [
        "Output quality and model selection for the task",
        "Prompt and workflow architecture",
        "Retrieval quality",
        "Reliability and failure handling",
      ],
    },
    {
      title: "Cost & latency",
      items: [
        "Inference and infrastructure cost",
        "Response latency",
        "Right-sizing models — a bigger model is not always a better model",
        "Scaling and maintainability",
      ],
    },
    {
      title: "Measurement",
      items: [
        "Evaluation and regression testing",
        "Observability and production monitoring",
        "Success metrics tied to the business outcome",
      ],
    },
    {
      title: "Architecture",
      items: [
        "Architecture review of the existing system",
        "Data pipelines",
        "Security and deployment architecture",
        "Infrastructure your own team can operate",
      ],
    },
  ],
  outcome:
    "The goal may be better output quality, lower operating cost, faster responses, greater reliability — or a system your engineering team can maintain without us.",
};

/* ── Services page ───────────────────────────────────────────────────────── */

export const SERVICES_PAGE = {
  eyebrow: "Services",
  headline: "Priced around the problem, not a package.",
  sub: "Implementation scope varies substantially with your systems, data, integrations, and quality requirements. A number published before we understand your problem would be a guess — so we don't publish one. You pay for outcomes and defined work, not a list of hours or technologies.",
  blocks: [
    {
      title: "Audits",
      tag: "Scope-based pricing",
      body: "Priced by the scope of what we examine — a single product area is not a company-wide assessment. For selected strategic companies we offer a limited audit at no cost as the start of a longer relationship. Either way, the audit is rigorous and the roadmap is yours to keep.",
      cta: "Request an AI Audit",
    },
    {
      title: "Implementation",
      tag: "Custom-scoped",
      body: "Scoped individually after the opportunity and requirements are understood — never sold as a standardized small / medium / large package. We prefer fixed-scope engagements where the requirements and deliverables are clear enough to support them.",
      cta: "Talk to an AI Engineer",
    },
    {
      title: "Optimization",
      tag: "Ongoing engagement",
      body: "A recurring engineering engagement where it's appropriate — for systems we built, or AI systems you already run. Structured around continuous improvement: quality, cost, latency, reliability, new capabilities.",
      cta: "Talk to an AI Engineer",
    },
  ],
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
  { name: "AI audit", time: "1–3 weeks" },
  { name: "Feature integration or RAG MVP", time: "3–6 weeks" },
  { name: "Full production RAG system", time: "6–10 weeks" },
  { name: "Agentic platform or end-to-end build", time: "3–6+ months" },
];

/** docs/vault/technical/tech-stack.md */
export const STACK = [
  {
    group: "Backend",
    items: ["FastAPI (Python)", "Pydantic typing", "SSE streaming", "TypeScript / Go / Rust on request"],
  },
  {
    group: "Vector databases",
    items: ["Qdrant — default", "pgvector — if you run Postgres", "Pinecone — fully managed", "Hybrid dense + sparse"],
  },
  {
    group: "Embeddings",
    items: ["text-embedding-3-small", "text-embedding-3-large", "FastEmbed", "Local: e5-large, bge-m3, nomic"],
  },
  {
    group: "RAG frameworks",
    items: ["LangChain", "LlamaIndex", "Direct API — less abstraction", "Chosen per project"],
  },
  {
    group: "Fine-tuning",
    items: ["HuggingFace + PEFT / LoRA", "Weights & Biases", "vLLM serving", "Self-hosted LLaMA, Mistral, Qwen"],
  },
  {
    group: "Evals & infra",
    items: ["LangSmith / Langfuse / Arize", "Braintrust, RAGAS", "Docker + Compose", "AWS / Azure, Railway / Render"],
  },
];

/** Buyer questions, aligned with the audit-first model. */
export const FAQS = [
  {
    q: "How is implementation priced?",
    a: "After the opportunity and requirements are understood — never before. Audits are priced by scope. Implementation is custom-scoped around a defined outcome, fixed-price where the requirements are clear enough to support it. We don't publish package prices because a number quoted before we understand your systems would be a guess.",
  },
  {
    q: "When is an audit free?",
    a: "For selected strategic companies that fit our ideal profile, we offer a limited audit at no cost as the start of a longer relationship. It is still rigorous — but it is not universally free, and we are deliberate about where we invest that time.",
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
  { value: "1–3 wk", label: "typical AI audit, ending in a prioritized roadmap" },
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
