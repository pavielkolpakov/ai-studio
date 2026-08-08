/**
 * Marketing site content.
 *
 * SOURCE OF TRUTH: docs/vault/. Every number, price, timeline and claim below
 * is transcribed from a vault note — the same notes the chat assistant reads.
 * Do not add figures here that the vault does not state; edit the note first.
 */

export interface CatalogItem {
  num: string;
  title: string;
  body: string;
  size: string;
}

export interface Spotlight {
  eyebrow: string;
  title: string;
  problem: string;
  built: string;
  tags: string[];
  slotLabel: string;
  metrics: { value: string; label: string }[];
}

export interface Plan {
  name: string;
  price: string;
  unit: string;
  who: string;
  features: string[];
  cta: string;
  featured: boolean;
}

/* ── Work ────────────────────────────────────────────────────────────────── */

/** docs/vault/services/overview.md + each docs/vault/projects/*.md ("Numbers"). */
export const CATALOG: CatalogItem[] = [
  {
    num: "01",
    title: "RAG / internal knowledge assistant",
    body: "Ask questions in plain language and get cited answers pulled from your own documents, tickets, wikis, codebases or databases — a synthesised answer with sources, not a list of links.",
    size: "$18k–$35k MVP",
  },
  {
    num: "02",
    title: "AI feature audit & LLM readiness sprint",
    body: "A 1–2 week diagnostic that maps your current AI usage, surfaces what is broken or underperforming, and hands you a prioritised 90-day roadmap with effort estimates.",
    size: "$5k–$12k",
  },
  {
    num: "03",
    title: "Embedded LLM feature in an existing SaaS",
    body: "One high-impact capability shipped inside the product you already have — in-app copilot, AI search, smart drafts, autofill or summarisation — with prompt management, evals and cost monitoring.",
    size: "$20k–$40k per feature",
  },
  {
    num: "04",
    title: "Customer support copilot & deflection agent",
    body: "Classifies incoming tickets, drafts replies for agent review, auto-resolves high-confidence repeats and escalates edge cases. Integrated with Zendesk, Intercom, HubSpot or Freshdesk.",
    size: "$60k–$100k",
  },
  {
    num: "05",
    title: "MCP server / agent-ready integration layer",
    body: "Exposes your product's data and actions to AI agents, so customers using Claude, ChatGPT or Cursor can work with it natively instead of copy-pasting.",
    size: "$40k–$90k",
  },
  {
    num: "06",
    title: "Internal workflow & ops automation",
    body: "An agentic workflow for a high-volume repetitive process: reads unstructured input, classifies or extracts against a schema, acts across your systems, escalates low-confidence cases.",
    size: "$30k–$80k",
  },
  {
    num: "07",
    title: "Production-grade agentic RAG system",
    body: "The step up from an MVP: multi-tenant, hybrid search with re-ranking, role-based access control on retrieval, multi-source ingestion and full observability.",
    size: "$50k–$100k",
  },
  {
    num: "08",
    title: "AI evals & observability harness",
    body: "Golden test sets, LLM-as-judge metrics, regression suites, CI eval gates and production tracing — the measurement layer your AI system should have had from the start.",
    size: "$15k–$30k",
  },
  {
    num: "09",
    title: "Model fine-tuning engagement",
    body: "Adapting a foundation model to your domain, format or proprietary data. A fine-tuned 7B–13B model can match GPT-4-class quality on your task at a fraction of the inference cost.",
    size: "$25k–$70k",
  },
  {
    num: "10",
    title: "Enterprise knowledge & compliance platform",
    body: "Full-stack AI for a regulated vertical — legal, fintech, healthcare, insurance — with audit trails, access-controlled retrieval, domain evals and on-prem or VPC deployment.",
    size: "$150k–$400k",
  },
  {
    num: "11",
    title: "Code review agent & developer tooling",
    body: "An agent in your dev workflow that reviews PRs, flags security issues, enforces your conventions and answers questions about your codebase — grounded in your actual patterns.",
    size: "$25k–$60k",
  },
  {
    num: "12",
    title: "Voice AI agent for business operations",
    body: "Inbound or outbound call handling for a specific use case — support, scheduling, lead qualification, collections — integrated with your systems and escalating with full context.",
    size: "$30k–$80k",
  },
];

/**
 * Three catalog entries in detail. Metric labels state their provenance:
 * these are vault-cited industry benchmarks and typical engagement sizes,
 * not results we are claiming for named past clients.
 */
export const SPOTLIGHTS: Spotlight[] = [
  {
    eyebrow: "Project 01 · RAG / internal knowledge assistant",
    title: "Answers with sources, from your own content",
    problem:
      "Users cannot find answers in your docs. Support tickets pile up for questions already answered somewhere. Keyword search fails on synonyms and paraphrases, so nothing is findable unless you guess the exact wording.",
    built:
      "Content is chunked and embedded into a vector database, then a hybrid retrieval layer combining BM25 and dense similarity finds the relevant chunks. An LLM synthesises them into an answer with source citations. Access control, multi-tenancy and an eval harness are wired in from day one.",
    tags: ["Qdrant / pgvector", "Hybrid BM25 + dense", "Source citations", "Eval harness"],
    slotLabel: "Screenshot: cited answer in the chat interface",
    metrics: [
      { value: "$18k–$35k", label: "typical MVP build" },
      { value: "30–60%", label: "fewer tickets on documented questions (industry benchmark)" },
      { value: "3–5 hrs", label: "saved per employee per week in knowledge-heavy teams" },
    ],
  },
  {
    eyebrow: "Project 06 · Internal workflow & ops automation",
    title: "The repetitive process, handled end to end",
    problem:
      "A high-volume internal task is done by a person following a repeatable decision tree — lead routing, contract review, invoice or form processing, document data extraction, reconciliation. Staff key unstructured documents into your systems by hand.",
    built:
      "An agentic workflow that reads unstructured inputs, applies LLM classification or schema-based extraction, takes actions across your systems, and escalates low-confidence cases to a human. For document intake the same architecture becomes an extraction pipeline writing structured data into your database, CRM or ERP.",
    tags: ["Classification", "Structured extraction", "Human-in-the-loop", "System integrations"],
    slotLabel: "Screenshot: run timeline with human escalations",
    metrics: [
      { value: "$30k–$80k", label: "typical project size" },
      { value: "40–60%", label: "less manual processing time within 90 days (reported)" },
      { value: "60–90 days", label: "typical ROI window" },
    ],
  },
  {
    eyebrow: "Project 08 · AI evals & observability harness",
    title: "Knowing it still works after you change the prompt",
    problem:
      "A prompt change that improves one case silently breaks ten others. A model upgrade that demos well degrades on edge cases in production. Most AI systems have no systematic way to tell whether they are getting better or worse.",
    built:
      "A golden dataset of 50–200 representative pairs covering normal cases, edge cases and known failures. Task-specific metrics plus LLM-as-judge for qualitative dimensions. An eval harness in your CI so every change is tested against the golden set, production tracing with dashboards and alerting, and a team training session on eval-driven development.",
    tags: ["Golden datasets", "LLM-as-judge", "CI eval gates", "LangSmith / Langfuse"],
    slotLabel: "Screenshot: eval dashboard and CI gate",
    metrics: [
      { value: "$15k–$30k", label: "harness setup and team training" },
      { value: "60–80%", label: "of regressions caught pre-production (reported)" },
      { value: "$3k–$6k/mo", label: "typical eval maintenance retainer" },
    ],
  },
];

/** docs/vault/projects/03-embedded-llm-feature.md */
export const ASSISTANT_EXAMPLE = {
  title: "Embedded LLM feature for your client software",
  because: "we build client apps and every RFP now asks for AI.",
  bullets: [
    "Scope one high-impact feature with your team, in your stack",
    "Prompt management and cost monitoring wired in, not bolted on",
    "An eval harness and error handling before it reaches users",
    "A polished UI matched to your existing product",
  ],
  estimate: "$20k–$40k fixed",
  timeline: "3–5 weeks",
};

/* ── Pricing ─────────────────────────────────────────────────────────────── */

/** docs/vault/services/pricing.md, projects/02-ai-feature-audit.md, process/retainer.md */
export const PLANS: Plan[] = [
  {
    name: "AI feature audit",
    price: "$5k–$12k",
    unit: "fixed, 1–2 weeks",
    who: "You already have AI in production and it is unreliable, expensive or unmeasured — or you inherited an AI codebase nobody understands.",
    features: [
      "Every AI touchpoint mapped and benchmarked",
      "What is broken or underperforming, named",
      "Prioritised 90-day action plan",
      "Effort estimates and ROI projection per item",
      "Converts to a follow-on build about 30% of the time",
    ],
    cta: "Start with an audit",
    featured: false,
  },
  {
    name: "Fixed-scope build",
    price: "from $5k",
    unit: "fixed price, set after discovery",
    who: "You know roughly what you want built. Every engagement is fixed-scope with a defined deliverable, timeline and price.",
    features: [
      "Paid 1-week discovery first, credited against the build",
      "Fixed price — no hourly billing, no overruns",
      "Built in a private repo you own from day one",
      "Staging environment inside the first two weeks",
      "Tests, evals and 30 days of support included",
    ],
    cta: "Scope a build",
    featured: true,
  },
  {
    name: "Monthly retainer",
    price: "from $3k",
    unit: "per month, after a project ships",
    who: "The system is live and you want it to keep improving — new data sources, better retrieval, additional features, senior AI engineering on demand.",
    features: [
      "Retrieval quality iteration and reranking experiments",
      "New data sources added to an existing RAG system",
      "Additional AI features on top of the initial build",
      "Fine-tuning experiments for task-specific gains",
      "Time-and-materials — the only work we bill this way",
    ],
    cta: "Talk about a retainer",
    featured: false,
  },
];

/** docs/vault/services/pricing.md — "Typical Engagement Sizes" */
export const ENGAGEMENT_SIZES = [
  { name: "Quick wins", price: "$5k–$25k", time: "2–6 weeks" },
  { name: "Mid-size builds", price: "$25k–$100k", time: "4–12 weeks" },
  { name: "Larger end-to-end builds", price: "$100k–$400k", time: "3–6+ months" },
];

/** docs/vault/services/pricing.md — discovery fee and payment terms */
export const MONEY_TERMS = {
  discoveryPrice: "$1k–$2.5k",
  discoveryNote:
    "Every project over $5,000 begins with a paid 1-week discovery. The fee is deducted from the project cost if you proceed to a build. A free discovery is not a real discovery — when it is paid, we both commit to running experiments on your actual data and writing a real spec.",
  paymentTerms: "30% upfront · 40% at midpoint · 30% at delivery",
  paymentNote: "For projects over $20,000 we can discuss milestone-based structures.",
};

/** docs/vault/process/*.md */
export const PHASES = [
  {
    num: "00",
    title: "Scoping call",
    body: "30 minutes, free, and not a sales call. We tell you honestly whether your use case is a fit and roughly what approach we would recommend. Written proposal within 48 hours if there is one.",
  },
  {
    num: "01",
    title: "Discovery",
    body: "Paid, one week. Read-only access, experiments on your actual data, a technical spec, a risk log of the 3–5 likeliest problems, and a fixed price for the build.",
  },
  {
    num: "02",
    title: "Build",
    body: "Shared Linear or Notion board, one weekly written update, daily commits to a private repo you own, and a staging environment inside the first two weeks. No big reveal at the end.",
  },
  {
    num: "03",
    title: "Handover",
    body: "A README written for a developer who has never seen the project, a 90-minute walkthrough with your team, a runbook, and 30 days of async support — included in every project price.",
  },
];

/** docs/vault/faq/working-with-us.md — "How long does a typical project take?" */
export const TIMELINES = [
  { name: "AI feature audit", time: "1–2 weeks" },
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

/** docs/vault/faq/*.md and docs/vault/about/values.md */
export const FAQS = [
  {
    q: "Who owns the code?",
    a: "You do. All code we write is yours, in a private repository you own from day one. We document everything as if we will never speak again, so your team can maintain and extend it. No wrappers we keep and rent back to you.",
  },
  {
    q: "Why do you charge for discovery?",
    a: "Because a free discovery is not a real discovery. When it is free there is pressure to skip straight to a proposal with a number on it. When it is paid, we both commit to doing it properly — experiments on your actual data, a real technical spec, an honest assessment. The fee comes off the build price if you proceed.",
  },
  {
    q: "Do you rewrite our codebase?",
    a: "No. We integrate with your existing stack and never propose rewrites. Our systems are built as services or modules that connect to your architecture through clean API contracts. Your team keeps ownership of the rest of the product.",
  },
  {
    q: "Can you guarantee the AI will be accurate?",
    a: "No one can guarantee 100% accuracy from an LLM. What we do: design for precision through careful retrieval, measure accuracy with evaluation pipelines before launch, add confidence scoring and human-in-the-loop for low-confidence output, and tell you upfront what accuracy is realistic for your use case.",
  },
  {
    q: "Do you sign NDAs, and can data stay on our infrastructure?",
    a: "Yes to both. We sign a mutual NDA before any technical discussion of your data, turned around in 24 hours, and we have standard DPAs for GDPR and HIPAA-adjacent requirements. We have built fully on-prem and private-cloud deployments with self-hosted embedding models and LLMs served via vLLM, where no data leaves your infrastructure.",
  },
  {
    q: "Why hire you instead of building an in-house AI team?",
    a: "A senior AI engineer in the US costs $180k–$280k in base salary, plus recruiter fees, 3–6 months to hire and 2–4 months to onboard. One person also cannot cover AI/ML, backend, infrastructure and frontend. You get a senior team across all four on a fixed price, with no headcount commitment — and most clients ship their first production system in 4–8 weeks.",
  },
];

/* ── About ───────────────────────────────────────────────────────────────── */

/** docs/vault/about/values.md, about/location-and-team.md, process/*.md */
export const ABOUT_STATS = [
  { value: "3–4", label: "projects per quarter, deliberately" },
  { value: "3", label: "teams: AI/backend, frontend, DevOps" },
  { value: "1 wk", label: "paid discovery, ending in a spec and a fixed price" },
  { value: "30 days", label: "async support after handover, in every project price" },
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
    title: "We price by project, not by hour",
    body: "Fixed-scope engagements give you cost certainty. We scope carefully upfront so we do not surprise you with overruns.",
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

export const CONTACT_EMAIL = "hello@neuronetis.com";
export const LINKEDIN_URL = "https://www.linkedin.com/company/neuronetis";
/** docs/vault/about/location-and-team.md */
export const LOCATIONS = "Israel · US · Eastern Europe";
