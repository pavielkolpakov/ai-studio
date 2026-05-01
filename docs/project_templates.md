# Neuronetis — Past Project Templates by Service Type and Domain

The case studies below are drawn from our engagement history. They're organized first by the three things we do — **AI Audits, AI Integration, and Custom AI Apps** — and then by industry within each. Each write-up follows the same structure: client profile, the problem, what we built, technical details, outcome, and timeline/cost.

The top of each case study is written for a founder, CEO, or business owner trying to figure out whether something like this would help. The technical details section is written for a CTO or engineering lead doing due diligence. Both audiences should find what they need.

A note on language: where it matters, we describe systems by what they do for the business — "AI assistant over company knowledge," "intelligent search," "AI-powered classification" — and leave the implementation terminology (RAG, embeddings, vector search, LoRA fine-tunes) in the technical details where it belongs.

---

# AI Audits

An AI Audit is a focused 1–3 week engagement where we assess a company's AI opportunity and produce a concrete roadmap. We look at what data you have, where your team spends time, where your product could feel meaningfully smarter, and what's actually realistic given your stack and constraints. The output isn't a slide deck — it's a prioritized list of projects with rough scopes, costs, and expected outcomes, so you can make real decisions.

We do audits for two types of companies: those who know they need AI but don't know where to start, and those who have already started something and want an outside read on whether it's pointed in the right direction.

---

## Example A1: AI Opportunity Audit for a 90-person construction-tech SaaS

**Client profile:** B2B project-management SaaS for mid-market construction companies, 90 employees, ~3,000 active customer projects, 5 years of structured project data and ~40k associated documents (RFIs, change orders, daily logs). Founder-CEO and CTO commissioned the audit together.

**The problem:** The leadership team knew "we should do something with AI" — competitors had announced AI features, board members were asking, and the team had floated four or five ideas internally. They wanted an honest outside read on which idea was actually worth building first, what it would cost, and what would be a waste of money.

**What we built:** A 3-week audit covering data inventory, user-research interviews, opportunity mapping, technical feasibility assessment for the top candidates, and a written roadmap with three prioritized initiatives, expected business impact for each, and rough scope/cost ranges. Included a small proof-of-concept on the highest-priority opportunity to validate it would actually work on their data.

**Technical details:**
- Data inventory: read-only access to their production database, document storage, and support-ticket system; profiled 18 candidate data sources for completeness, quality, and AI-readiness.
- User research: 12 interviews (project managers at customer accounts, internal support team, sales) to identify where users actually struggle vs. where leadership *thought* they struggled — these usually disagree.
- Feasibility prototyping: small-scale knowledge-base assistant prototype (LangChain + OpenAI embeddings + pgvector + GPT-4o) on a 200-document slice to validate retrieval quality on their actual document mess.
- Two ideas leadership had been excited about ("predict project delays," "AI sales assistant for inbound leads") were rated as poor fits — one had insufficient data, one was solving a problem their users didn't actually have.
- Final deliverable: 22-page written roadmap, a 90-minute readout, and an FAQ document for their board.

**Outcome:** Three of the five candidate ideas were rejected with reasoning. The top recommendation — a knowledge assistant over project documentation and historical RFIs — was scoped at $24k for the build.

**Timeline and Total cost:** 3 weeks. Total: **$8,500**.

---

## Example A2: Implementation review for a fintech that had already built an AI feature

**Client profile:** Series B fintech, 150 employees, B2B accounting product. They had built and shipped an AI-powered transaction categorizer using an internal team plus a freelance ML engineer six months prior. CTO commissioned the audit; CEO was the deciding stakeholder.

**The problem:** The feature worked but wasn't great. Customer feedback was lukewarm, accuracy plateaued at ~74%, costs per transaction were higher than projected, and the team disagreed internally about whether to keep iterating, rebuild, or scrap it. They wanted an outside technical review with a clear recommendation, not a "here are some considerations" diplomatic answer.

**What we built:** A 2-week implementation review. We read the codebase, ran the system against a held-out evaluation set we built from their data, profiled cost and latency, and interviewed the engineers who built it and the product manager who owned the feature. The deliverable was a written assessment with a direct recommendation and a concrete plan if they chose to proceed.

**Technical details:**
- Code review of ~6k lines of Python; identified specific architectural issues (no evaluation pipeline, no retrieval layer despite the data structure clearly calling for one, prompt engineering done by trial-and-error without measurement).
- Built a 1,200-example evaluation set from their production data; current system scored 74% accuracy. Reproduced their training pipeline and got a baseline reading.
- Tested three alternative architectures on the same evaluation set: (1) prompt-only with better few-shot retrieval, (2) fine-tuned classifier on a small open-weights model, (3) hybrid retrieval over their categorization history.
- Cost analysis: traced ~$0.18 per transaction in LLM costs (significantly above projection); identified caching and model-tiering wins worth ~60% reduction.
- Recommendation: rebuild on architecture #3 (hybrid retrieval), projected accuracy ~88–92%, cost ~$0.04/transaction, ~5 weeks build time.

**Outcome:** Client accepted the recommendation. The rebuild ran ~8 weeks later as a separate engagement. Accuracy on the rebuilt system landed at 91%, cost per transaction at $0.038.

**Timeline and Total cost:** 2 weeks. Total: **$5,500**.

---

# AI Integration

AI Integration is when we add AI capabilities to your existing product or internal systems. Your software already exists; we make it smarter. This is most of our work — adding intelligent search, AI-powered assistants, automated classification, content generation, or knowledge-base features that plug into what you already have rather than replacing it.

The case studies below are organized by industry. Each is real in shape and scope; specifics are abstracted to protect client confidentiality.

---

## Finance / Fintech

### Example I1: AI-powered transaction coding for a corporate spend-management platform

**Client profile:** Mid-market corporate card and expense-management SaaS serving ~2,400 SMB and mid-market customers in the US, 180 employees, processing ~2.1M card transactions per month. The finance team at each customer manually codes transactions to their chart of accounts (GL codes) every month-end.

**The problem:** Finance teams at customer companies spent an average of 9 hours per month per bookkeeper coding transactions against their customer-specific chart of accounts (typically 80–400 GL codes per customer). A rules-based matcher built in 2022 achieved ~58% auto-coding rate and broke whenever a customer restructured their chart of accounts. Churn analysis traced 11% of downgrades to "accounting feels manual."

**What we built:** An AI-powered coding engine that learns from each customer's historical coding decisions and suggests the right GL code for new transactions, with a confidence score. High-confidence suggestions can be auto-applied; lower-confidence ones go to a bookkeeper review queue. The system runs as a sidecar service next to the client's existing transaction pipeline; the product UI surfaces suggestions inline.

**Technical details:**
- Custom-trained embedding model (`bge-m3` fine-tuned with `MultipleNegativesRankingLoss` via sentence-transformers); anchors were transaction strings, positives were same-GL transactions from the same customer, semi-hard negatives sampled per batch.
- Transaction enrichment: merchant name, MCC, amount bucket, spending user's department, memo, and prior-month coding pattern concatenated into a structured string before embedding.
- Per-customer index in Qdrant with `customer_id` as a mandatory filter; ~3k–40k vectors per customer, cosine similarity, HNSW with `m=16, ef_construct=200`.
- Held-out evaluation set of 180k coded transactions across 40 customers; tracked top-1 and top-3 accuracy, stratified by customer size.
- Training infrastructure on a single A100 GPU; W&B for experiment tracking. Inference serves on CPU.

**Outcome:** Top-1 GL-code accuracy reached **87.4%** and top-3 reached **96.1%** on held-out transactions, up from 58% on the rule-based baseline. Auto-coding above the confidence threshold captured **71% of transactions with no human review**, cutting average bookkeeper coding time from ~9 hours/month to **~2.1 hours/month**. Product team attributed a 4-point NPS lift at the next quarterly survey.

**Timeline and Total cost:** 1 week discovery + 7 weeks build. Total: **$31,000**.

---

### Example I2: AI research assistant over SEC filings and earnings transcripts

**Client profile:** B2B investment-research SaaS used by ~90 hedge funds and asset managers, 60 employees. Their data store includes ~1.4M SEC filings (10-K, 10-Q, 8-K, S-1), ~300k earnings-call transcripts, and ~50k proprietary analyst notes. Target user is the junior analyst preparing memos.

**The problem:** Analysts spent ~40% of their week reading filings to answer standard questions ("How has gross margin trended? What's the stated exposure to China? What did the CFO say about guidance last quarter?"). The existing keyword search returned hundreds of irrelevant hits from 300-page filings, and analysts resorted to Ctrl-F in PDFs.

**What we built:** A citation-first AI assistant specialized for financial documents. Analysts ask natural-language questions; the assistant answers with inline citations that deep-link to the exact paragraph in the source document — every claim traceable back to a primary source. Deployed as an embedded panel inside the client's existing web app and as a standalone API endpoint their analysts could hit from notebooks.

**Technical details:**
- Section-aware chunking: filings parsed into Item 1, Item 1A (Risk Factors), Item 7 (MD&A), etc.; earnings transcripts split by speaker turn; target chunk size 900 tokens with 120-token overlap.
- Hybrid retrieval (RAG architecture): BM25 (tuned for financial tickers, GAAP terms, CUSIP formats) + OpenAI `text-embedding-3-large` dense vectors, combined with Reciprocal Rank Fusion; Cohere Rerank v3 on top-50 to top-8.
- Qdrant vector database with metadata filters on `company_id`, `filing_type`, `fiscal_period`, `speaker_role` — most analyst questions are ticker-scoped and filtering first collapses the search space ~40x.
- Two-stage prompting: candidate summarization (GPT-4o-mini) over each retrieved chunk, then final synthesis (GPT-4o) over the candidate summaries with explicit "cite or refuse" instruction.
- Eval suite of 420 analyst-authored Q/A pairs graded on retrieval recall@8, citation correctness, and factual accuracy judged by a senior analyst.

**Outcome:** Citation correctness **96.8%** (vs. 74% on the baseline semantic search); retrieval recall@8 at **91%**. Analysts reported average time-to-answer of **~90 seconds** versus a 15-minute self-reported baseline. The client upsold the feature as a paid tier and closed three six-figure ARR expansions within the first quarter.

**Timeline and Total cost:** 1 week discovery + 9 weeks build. Total: **$38,000**.

---

### Example I3: AI-driven alert triage for an AML/compliance platform

**Client profile:** AML/transaction-monitoring SaaS used by ~70 community banks and neobanks, 120 employees, processing ~40M wire and ACH transactions per month on behalf of customers. Compliance analysts review flagged transactions manually.

**The problem:** The client's existing rules engine flagged ~2.3% of transactions for review, of which ~94% turned out to be false positives. Compliance analysts at customer banks were drowning — one customer reported a 23-day backlog. The client wanted an AI layer that could triage alerts into "almost certainly benign," "needs review," and "high risk" without replacing the regulator-approved rules.

**What we built:** A custom-trained classifier that ingests each flagged transaction plus its full context (counterparty history, 90-day sender pattern, geography, screening hits) and emits one of three triage labels with a calibrated probability. Served on the client's own infrastructure because transaction data cannot leave their VPC.

**Technical details:**
- Fine-tuned Mistral 7B with LoRA adapters (`r=16, alpha=32, dropout=0.05`) on attention + MLP projections; trained for 3 epochs on 4x A100 80GB using HuggingFace Transformers + PEFT; W&B for experiment tracking.
- Training data: 340k human-reviewed alerts over 2.5 years, labeled by customer compliance analysts; stratified by alert type and customer size.
- Input formatting: structured transaction features templated into a "transaction dossier" string with rules-engine reasons attached; output format is a short JSON with `label` and `rationale`.
- Calibration on held-out 40k alerts using Platt scaling on top of the sampled softmax.
- Served via vLLM on a pair of A10G instances behind FastAPI; p95 latency target of 300ms (end-to-end 180ms achieved).
- Eval: precision/recall per class, cost-weighted confusion matrix (false negatives are ~100x more expensive than false positives), and a shadow-mode A/B against the rules engine for 6 weeks before go-live.

**Outcome:** False-positive rate on triaged alerts dropped from **94% to 41%**, and the "almost certainly benign" bucket absorbed **58% of total alert volume** with a measured false-negative rate of **0.09%** — well inside the client's regulatory tolerance. Average analyst throughput at pilot customers improved from ~32 alerts/day to ~87 alerts/day. Client closed two large community-bank deals that had previously bounced on "AI roadmap" due diligence.

**Timeline and Total cost:** 1 week discovery + 9 weeks build. Total: **$42,000**.

---

### Example I4: AI assistant for an insurance-claims SaaS

**Client profile:** Claims-automation SaaS serving ~35 mid-market P&C insurers, 95 employees. Claims adjusters at customer carriers process ~180k claims per month. Each carrier has its own claims-handling policy (typically 200–500 pages), plus state-specific regulatory overlays.

**The problem:** Adjusters routinely asked questions like "Can I approve this $8k roof claim without a field inspector?" and had to scan carrier PDFs, state bulletins, and internal wiki pages. Average lookup took 6–8 minutes; ~12% of decisions were later flagged for policy non-compliance on QA audit. The client already had a search feature but carriers demanded that answers cite the exact policy section and never mix policies across tenants.

**What we built:** A multi-tenant AI assistant integrated into the claims-review screen with strict per-carrier isolation. Every answer follows the format "Decision rule + Policy citation + State overlay (if any)" — the adjuster sees both the answer and the underlying authority for it.

**Technical details:**
- Hierarchical chunking: PDFs parsed with a layout-aware pipeline (Unstructured + custom heuristics for policy headings); chunks tagged with `carrier_id`, `policy_version`, `section_path` (e.g., "Claims Handling → Auto → Total Loss").
- Embeddings: `text-embedding-3-large`; Qdrant with mandatory `carrier_id` filter and a collection-per-state overlay for regulatory bulletins.
- Hybrid retrieval (RAG with BM25 + dense + RRF), Cohere Rerank, then a deterministic "policy first, state overlay second" assembly step before synthesis.
- Answer synthesis: Claude Sonnet with a strict response schema (JSON with `answer`, `policy_citations`, `state_citations`, `confidence`), validated before rendering.
- Evaluation: 600 adjuster-authored questions graded for citation accuracy and policy-vs-overlay precedence; RAGAS for faithfulness and answer relevance as a secondary signal.
- LangChain for the orchestration layer, FastAPI, deployed into the client's existing AWS account.

**Outcome:** Average adjuster lookup time dropped from ~7 minutes to **~40 seconds**. QA audit flagged **3.1% of AI-assisted decisions** for policy issues vs. 12% baseline. Citation accuracy measured at **97.2%**. Two carriers used the feature as a lever to negotiate lower per-claim pricing, which the client was willing to absorb.

**Timeline and Total cost:** 1 week discovery + 7 weeks build. Total: **$24,000**.

---

### Example I5: AI invoice extraction for an AP-automation product

**Client profile:** Accounts-payable automation SaaS for mid-market companies, 75 employees, ~1,800 customers, processing ~550k invoices per month across 40+ languages and dozens of vendor template variations.

**The problem:** The client had a traditional OCR + templates pipeline that achieved ~78% straight-through processing. The remaining 22% went to manual keying, and ~35% of enterprise escalations traced back to extraction errors on line items (wrong quantity, wrong tax code, wrong GL). Rebuilding the template library was a constant drag on the customer-experience team.

**What we built:** A focused AI feature that slots behind the existing OCR to handle line-item extraction, tax-code normalization, and vendor-entity resolution. The pipeline produces a structured invoice object the existing system already understands; the rest of the product is unchanged.

**Technical details:**
- Two-step LLM call: (1) GPT-4o-mini extracts a draft structured invoice from OCR text + page layout boxes; (2) GPT-4o validates arithmetic (line items sum to subtotal, tax computes correctly) and asks for corrections if not.
- Vendor-entity resolution: embedding-based matching of extracted supplier name against the customer's vendor master in pgvector (chose pgvector over a dedicated vector database because the client runs on RDS Postgres and had no appetite for new infrastructure).
- Strict JSON schema output with Pydantic validation; any arithmetic inconsistency >$0.01 triggers a second pass or human routing.
- Eval suite of 12k invoices across 14 languages and 9 vendor-template families; per-field accuracy tracked separately.
- No fine-tuning — the client's volume and margin profile made prompt engineering + schema validation the right trade-off.

**Outcome:** Straight-through processing rose from **78% to 94.1%**. Line-item extraction accuracy improved from 84% to **98.3%**. The customer-experience team retired ~60% of vendor templates; extraction-related escalations dropped **71%**. The feature shipped as a paid add-on and was taken up by 42% of enterprise customers within three months.

**Timeline and Total cost:** 1 week discovery + 4 weeks build. Total: **$14,000**.

---

## Software Development / DevTools

### Example I6: AI code review for a mid-market SaaS engineering team

**Client profile:** B2B SaaS product company, 220 engineers across 28 teams, ~1,400 pull requests per week across a multi-repo codebase (~8M lines of code, primarily TypeScript, Python, Go). Not a DevTools vendor — this was an internal engineering productivity engagement.

**The problem:** Median time-to-first-review sat at 18 hours; senior engineers spent ~28% of their week on PR review. A Copilot-style autocomplete was already in place, but reviews were still blocking releases, and the platform team wanted to offload the "obvious comments" (naming, error handling, missing tests) from humans.

**What we built:** A GitHub App that runs on every PR, uses repo-aware context (not just the diff) to produce a structured AI review, and posts only findings above a confidence threshold. Deliberately tuned for high precision over recall — the team wanted fewer, better comments, not more noise.

**Technical details:**
- Context assembly: tree-sitter AST parsing of changed files plus their immediate callers/callees, combined with the PR diff, linked Linear ticket, and repo-level conventions file (`.neuronetis/conventions.md`).
- Embeddings: `bge-m3` for function-level chunks of the entire repo; stored in Qdrant with `repo_id`, `file_path`, `symbol_name` metadata; incremental re-embedding on each push.
- Review model: Claude Sonnet as the primary reviewer; a cheaper Llama 3.1 70B (self-hosted on vLLM) runs a pre-filter that decides which files are worth a full review call. This two-model approach cut LLM spend ~68% vs. running Claude on everything.
- Static analysis fusion: existing ESLint/ruff/golangci-lint output piped into the LLM prompt as context so the model doesn't duplicate findings.
- Structured review output: each comment has `category`, `severity`, `confidence`; only `confidence ≥ 0.75` comments post to GitHub.
- Evaluation: 400 historical PRs with senior-engineer-annotated "good comment" labels; tracked precision, recall, and a per-category confusion matrix.

**Outcome:** Median time-to-first-review dropped from 18 hours to **4.5 hours**. Senior-engineer review load dropped **~40%** by internal time-tracking. Comment acceptance rate (developer clicks "Resolve" vs. "Not useful") landed at **71%**, versus 38% for an earlier off-the-shelf trial. Zero production incidents traced to the AI reviewer in 12 weeks of operation.

**Timeline and Total cost:** 1 week discovery + 8 weeks build. Total: **$34,000**.

---

### Example I7: Intelligent code search for a developer-platform product

**Client profile:** Developer-platform SaaS, 140 employees, ~9,000 active customer organizations. Customers index their repos into the platform; average customer has ~80 repos totaling ~2M lines of code. The search feature shipped in 2021 was lexical only.

**The problem:** Customer developers searched for "auth middleware that validates JWT" and got results for the word "auth" appearing in comments. Search NPS was -11. Support tickets tagged "search sucks" averaged 35/week.

**What we built:** A semantic-over-code search endpoint that coexists with the existing lexical search and merges results intelligently. Indexing runs as a background job on each push; search is online and latency-critical.

**Technical details:**
- Code chunking via tree-sitter at function/class boundaries, with file-level and module-level summary chunks generated by GPT-4o-mini for higher-level semantic lookups.
- Embeddings: `e5-large-v2` self-hosted on A10G GPUs, chosen over OpenAI because (a) customers didn't want code leaving their region and (b) per-token cost at the client's indexing volume would have been prohibitive.
- Hybrid retrieval: existing Zoekt-style lexical search + dense vector search in Qdrant combined with Reciprocal Rank Fusion; Cohere Rerank applied on top-60 to top-10 when the user query looks natural-language (classified by a small intent model).
- pgvector considered but rejected — client needed per-customer collections with strong isolation and Qdrant's namespace model mapped better.
- Query expansion: short queries (<4 tokens) are expanded via GPT-4o-mini into a hypothetical code snippet (HyDE-style) before embedding.
- Eval: 1,200 hand-labeled query/result pairs across 6 languages; tracked NDCG@10 and a user-reported "first result was useful" metric captured via a thumbs-up widget.

**Outcome:** NDCG@10 improved from 0.41 (lexical) to **0.78** (hybrid). "First result useful" rate went from 34% to **81%**. Search NPS climbed to +24 within two quarters. The feature moved from the free tier to the paid tier and contributed to a measurable upsell curve.

**Timeline and Total cost:** 1 week discovery + 6 weeks build. Total: **$19,000**.

---

### Example I8: AI documentation assistant for an API-first SaaS

**Client profile:** API-first developer infrastructure SaaS, 90 employees, ~14,000 active developer accounts. Docs site has ~1,200 pages, ~400 code examples across 7 SDK languages, plus a changelog and forum.

**The problem:** Documentation search was keyword-only; "how do I retry a webhook with exponential backoff in Python" returned no useful result. Support load per engineer was high; ~30% of tickets were answerable by a careful reading of the docs.

**What we built:** An AI assistant embedded in the docs site and as a Slack app for the customer's engineering community. Designed to answer with runnable code snippets in the user's stated SDK language and to cite the exact doc page.

**Technical details:**
- Content ingestion: Markdown docs, changelog entries, forum threads flagged "solved", and SDK source comments. Chunking honors Markdown headers (H2/H3 boundaries); code fences are kept intact regardless of size.
- Embeddings: `text-embedding-3-small` — the corpus is small enough that the larger model didn't move our eval numbers and cost matters at ~20k queries/day projected.
- Qdrant with metadata for `sdk_language`, `doc_section`, `version`. Retrieval filters on stated SDK language when present in the query.
- RAG pipeline with hybrid BM25 + dense and RRF; no reranker at launch (retrieval was already strong on this well-structured corpus; we marked reranker as a phase-2 lever).
- Answer model: GPT-4o with a response template forcing "short explanation → code block with comments → citation links".
- Evaluation: 300 real support tickets with ground-truth answer URLs; measured answer-URL hit-rate, code-runnability (executing the generated snippet against a staging endpoint), and RAGAS faithfulness on a 100-sample slice.

**Outcome:** Answer-URL hit-rate **88%**; generated code ran without modification **81%** of the time. Deflection on qualifying ticket categories reached **44%**, with support engineers spending an estimated **~22 hours/week** less on doc-answerable tickets. Developer-community CSAT on the Slack app landed at 4.6/5.

**Timeline and Total cost:** 1 week discovery + 5 weeks build. Total: **$15,000**.

---

### Example I9: Natural-language query interface for a test-automation SaaS

**Client profile:** Cloud test-automation SaaS, 70 employees, ~1,100 customers running ~6M test executions per month. Customers query their test-run database ("flaky tests in checkout this week", "longest-running specs by file") via a clunky filter UI.

**The problem:** Only ~18% of users ever used the filter UI; most asked support or exported CSVs. Product analytics showed abandoned-query rate of 54%.

**What we built:** A natural-language query feature scoped tightly to the test-run schema (~24 tables). Not general text-to-SQL — a narrow compiler with LLM-based intent parsing, schema-grounded query generation, and a few-shot example bank of verified queries.

**Technical details:**
- Schema grounding: table and column descriptions curated by the client's product team into a YAML "semantic model"; low-cardinality enum values inlined so the LLM uses correct literals.
- Query generation: GPT-4o with a strict JSON schema output (internal query AST, not raw SQL — safer to validate and execute).
- Few-shot retrieval: 350 verified (NL, query) pairs embedded in pgvector; top-6 injected into the prompt per request.
- Self-correction loop: if the generated query fails schema validation or returns a row count that looks pathological (e.g., zero rows for a common pattern), the system re-prompts with the error context, up to 2 attempts.
- Eval: 420 held-out NL/query pairs, execution accuracy as the primary metric, plus a "query matches user intent" review by the product team on a 100-sample slice.
- LangChain for the orchestration scaffolding, though we stripped out most of it by the end in favor of direct API calls for observability.

**Outcome:** Execution accuracy **92.6%** on held-out queries; first-shot acceptance rate **76%** (user runs the query without editing). Abandoned-query rate dropped from 54% to **19%**. Daily active query users doubled within six weeks.

**Timeline and Total cost:** 1 week discovery + 5 weeks build. Total: **$16,000**.

---

## Marketing / Sales

### Example I10: AI account-research assistant for a sales-engagement platform

**Client profile:** Sales-engagement SaaS, 250 employees, ~3,800 customer companies, ~65,000 active sales reps. Reps sequence outbound to prospects daily; account research is a major pre-call workflow.

**The problem:** Reps spent ~45 minutes per tier-1 account gathering context (news, funding, tech stack, recent hires, 10-K mentions) before calls. Time tracking showed ~14 hours/week per rep on pre-call research. Reply rates on outbound sat at 2.3%.

**What we built:** An AI research assistant that, given an account URL or CRM record, produces a structured brief: company summary, recent signals, identified pain-point hypotheses tied to the client's product, and three suggested outreach angles with evidence citations. Invoked from the sequence builder and from Slack.

**Technical details:**
- Multi-agent orchestration: LangGraph-style plan-execute loop with three sub-agents — "web researcher" (serper + readability-based web fetch), "internal-data researcher" (CRM history, prior touchpoints), and "synthesis" — each with constrained tool sets to keep token budgets contained.
- Model mix: GPT-4o-mini for sub-agent steps (cheap and fast), GPT-4o only for the final synthesis step. This tiering cut per-brief cost from ~$0.42 to ~$0.11 without moving quality metrics.
- Output: strict JSON schema validated by Pydantic; the front-end renders it identically regardless of variations in underlying LLM behavior.
- Rep-specific style memory: when a rep edits a suggested outreach angle, a background job diffs the edit and extracts style observations into a per-rep Postgres record, which is read on the next generation.
- Eval: 240 accounts with manager-graded "brief is good" rubric (5-point scale) across 8 criteria; tracked rubric score plus downstream reply-rate in a 4-week A/B.

**Outcome:** Average rep research time dropped from 45 minutes to **~6 minutes** per account. Reply rate on AI-assisted sequences measured at **3.8%** vs. 2.3% control in a 12,000-prospect A/B (statistically significant at p<0.01). Rubric score averaged **4.1/5** after the style-memory feature landed, up from 3.2 before.

**Timeline and Total cost:** 1 week discovery + 9 weeks build. Total: **$36,000**.

---

### Example I11: AI call summaries and deal-health coaching for a revenue-intelligence product

**Client profile:** Revenue-intelligence SaaS, 180 employees, ~900 customers, ~4.2M call minutes ingested per month. Existing product had call transcripts and keyword-spotted "moments" but no generative summaries.

**The problem:** Managers rarely listened to calls; AEs spent 10–15 minutes per call writing CRM notes. Product team wanted summaries, next-step extraction, and a deal-health signal without overhauling the existing pipeline.

**What we built:** A post-call AI step that produces a summary, action-items list, stakeholder map, and MEDDIC-style deal-health scorecard. Plugs into the existing transcription pipeline; writes to the deal record and pushes to Slack.

**Technical details:**
- Chunked summarization: long calls (>60 min) segmented by speaker turn and topic shifts (detected by a lightweight sentence-embedding classifier); per-chunk summaries merged by a second LLM pass. This map-reduce pattern kept quality stable on 3-hour discovery calls that don't fit any context window.
- Model: Claude Sonnet for summary and scorecard (consistently outperformed GPT-4o on long-document structured output in our evals); GPT-4o-mini for the chunk-level intermediate step.
- Scorecard: structured JSON with per-MEDDIC-field evidence citations (quoted transcript lines); citation correctness was the hardest metric to hold.
- Qdrant index of prior call summaries per account so the agent can phrase the scorecard as "improved on Metrics since last call" — light historical context retrieval.
- Evaluation: 500 calls with manager-annotated ground-truth summaries and scorecards; tracked ROUGE-L on summaries, field-level accuracy on scorecards, and citation correctness.

**Outcome:** Manager-reported summary quality averaged **4.4/5** (human baseline 4.1/5 in a blinded study). AE time spent on CRM notes dropped **~70%**. Scorecard field-level accuracy **89%**; citation correctness **94%**. The feature contributed to a product-led upsell into an Enterprise tier closed with 12 customers in the first quarter.

**Timeline and Total cost:** 1 week discovery + 7 weeks build. Total: **$26,000**.

---

### Example I12: AI content-brief generator for a content-marketing platform

**Client profile:** SEO/content-marketing SaaS, 130 employees, ~2,600 marketing-team customers. Product already has keyword research and rank tracking; customers wanted help turning a keyword into a brief their freelance writers can execute on.

**The problem:** Content managers spent 60–90 minutes per brief pulling SERP competitors, summarizing their structure, and writing an outline plus FAQ. At a typical 20 briefs/month per customer this was a real bottleneck.

**What we built:** A focused AI feature slotted into the existing keyword-detail page: a "Generate brief" button produces a structured brief including target intent, recommended outline, entities to cover, FAQ, internal linking suggestions from the customer's own site, and a tone guide derived from the customer's past top-performing content.

**Technical details:**
- SERP ingestion: top-10 results fetched and parsed by a readability-based pipeline, summarized chunk-by-chunk by GPT-4o-mini, then synthesized into a "what's on the SERP" context block.
- Tone mirroring: customer's top-10 ranking posts (per their own analytics) embedded into pgvector; a tone-extraction prompt runs once per customer per quarter and caches a "voice profile" string.
- Final brief generation: single GPT-4o call with the SERP context, voice profile, keyword data (volume, difficulty, SERP features), and the customer's product catalog for internal-linking suggestions.
- Output: strict JSON consumed by the existing brief renderer — no UI changes required, which was a hard constraint from the client.
- Evaluation: 200 briefs graded by the client's editorial team on a 6-criterion rubric, plus a 4-week A/B on downstream publish-rate and 90-day ranking performance.

**Outcome:** Brief generation time dropped from ~75 minutes to **~4 minutes**. Editorial-rubric score averaged **4.0/5**; publish-rate of AI-assisted briefs was statistically indistinguishable from manually written ones at 90-day horizon (the success criterion — the client wasn't trying to beat humans, just match them while saving time). Feature attached rate reached **58%** of active accounts in two months.

**Timeline and Total cost:** 1 week discovery + 5 weeks build. Total: **$13,000**.

---

### Example I13: AI lead-scoring upgrade for a B2B CRM-enrichment product

**Client profile:** CRM enrichment and intent-data SaaS, 110 employees, ~1,500 customers. Product surfaces "hot" accounts to sales teams; scoring was a rules + logistic-regression hybrid built in 2021.

**The problem:** The legacy model scored on structured features (firmographics, tech-stack signals, web-traffic patterns) and missed the unstructured signal in job postings, press releases, and earnings-call mentions. Precision at the "high intent" threshold was ~31% and sales reps had lost trust in the score.

**What we built:** A custom-trained classifier that consumes a mixed structured+unstructured account dossier and outputs a calibrated intent score with a short rationale. Runs alongside the legacy model in an ensemble for the first release; the ensemble's weights are learned on held-out data.

**Technical details:**
- Fine-tuned Llama 3.1 8B with LoRA (`r=32, alpha=64`) on attention + MLP; full fine-tune considered but LoRA matched performance on our eval at a fraction of the cost.
- Training data: 620k accounts labeled with downstream outcome (pipeline created within 90 days of scoring) across 220 customer accounts; temporal split to avoid leakage.
- Dossier format: structured features templated into text + up to 8 unstructured signals (job postings, PR mentions, earnings-call excerpts) ranked by a lightweight relevance scorer before truncation.
- Infrastructure: training on 4x A100 80GB for 2 epochs; vLLM serving on 2x A10G instances behind FastAPI, p95 latency ~220ms.
- Calibration: isotonic regression on held-out validation set; ensemble weight with the legacy model learned on a separate slice.
- Evaluation: precision@top-10%, PR-AUC, calibration curves, and a 6-week A/B on actual pipeline outcomes at three pilot customers.

**Outcome:** Precision at the "high intent" threshold improved from **31% to 58%**. PR-AUC went from 0.42 to 0.67. In the A/B, pipeline generated per rep per week was **2.2x** higher in the treatment arm on the same account universe. Rep trust (measured by score-driven action rate) roughly doubled.

**Timeline and Total cost:** 1 week discovery + 9 weeks build. Total: **$40,000**.

---

### Example I14: AI competitive-intelligence monitor for a sales-enablement platform

**Client profile:** Sales-enablement SaaS, 85 employees, ~700 customers. Product manages battlecards, call decks, and competitor pages for sales teams.

**The problem:** Battlecards aged within weeks — pricing pages changed, feature announcements dropped, competitive positioning shifted. Customers' product marketing teams manually monitored 5–20 competitors each; most admitted their battlecards were 2–3 months stale at any given time.

**What we built:** An AI monitoring pipeline that tracks competitor web properties, blog posts, changelogs, LinkedIn activity, and Reddit/forum mentions; classifies changes into categories (pricing, new feature, positioning, churn risk); and drafts a battlecard update with citations. Product marketers review and approve; the approved update propagates to all sales teams in the account.

**Technical details:**
- Change detection: scheduled crawl + diff against stored content hashes; significant diffs (>10% content change or structural change) trigger LLM classification.
- Classification: GPT-4o-mini fine-tuned via OpenAI's API on 8k client-labeled diff→category examples; F1 of 0.89 on held-out set.
- Synthesis: Claude Sonnet drafts battlecard updates given the diff, the existing battlecard section, and a few-shot of the customer's tone examples.
- Storage: Qdrant index of all past competitor content versions, queryable by sales reps ("what changed on Competitor X's pricing in the last quarter?").
- Eval: 400 real competitor changes with product-marketer-labeled ground truth on category and recommended-update text; tracked classification accuracy and a 5-point rubric on drafted updates.

**Outcome:** Battlecard median age dropped from 78 days to **11 days** across pilot customers. Classification accuracy **89%**; drafted-update rubric averaged **4.2/5**. Product-marketer effort on competitive monitoring dropped roughly **60%**. Feature attached rate reached 34% of the customer base within two quarters.

**Timeline and Total cost:** 1 week discovery + 6 weeks build. Total: **$21,000**.

---

## Data / Analytics SaaS

### Example I15: AI metric-explanation feature for a dashboarding product

**Client profile:** Dashboarding SaaS focused on executive users, 120 employees, ~1,600 customers. Dashboards already exist; exec users ask "why did this change?" and file tickets back to analysts.

**The problem:** A common pattern — a metric dips, an exec pings their analyst, the analyst spends 30–60 minutes slicing dimensions to find the driver. Aggregated across a customer base this was thousands of hours per month of analyst time on a mechanical task.

**What we built:** A diagnostic AI explainer that, given a metric and a time window where it changed, runs statistical decomposition (dimension-by-dimension contribution analysis, change-point detection, correlated metrics) and narrates the findings in plain English with links back to the underlying slices.

**Technical details:**
- Deterministic-first architecture: statistics run first and produce a structured "driver bundle" (top-N dimension contributions, anomalies, correlated metrics, deploy/annotation overlap). The LLM narrates only over this bundle, never invents numbers.
- Narration: GPT-4o with a schema-constrained response (intro sentence, top-drivers paragraph, caveats, suggested-next-questions). Claude considered — GPT-4o was slightly better at "quantitative narration with no number hallucinations" on our eval.
- Minor retrieval layer: past explanations for the same metric indexed in pgvector so repeat dips get a "this is similar to what happened on March 14" framing.
- Eval: 300 historical metric changes with analyst-authored root cause explanations; we scored the AI's narration on driver-correctness, number-fidelity (numbers cited match the bundle), and narrative quality on a 5-point rubric.

**Outcome:** Driver-correctness **94%**; number-fidelity **99.4%** (one hallucinated number across 300 evals, fixed by tightening the schema). At pilot customers, 71% of "why" questions were answered without an analyst's involvement. Exec-user DAU on the dashboarding product lifted **~18%** within eight weeks as they started asking questions directly.

**Timeline and Total cost:** 1 week discovery + 6 weeks build. Total: **$22,000**.

---

### Example I16: AI-powered data-catalog search for a metadata platform

**Client profile:** Data catalog SaaS, 160 employees, ~450 enterprise customers. A typical customer has 20k–300k tables across multiple warehouses and lakes; metadata (descriptions, tags, owners) is inconsistently populated.

**The problem:** Keyword search over the catalog was the #1 source of user complaints. A data scientist searching "customer churn" would get hundreds of results including test tables, deprecated pipelines, and unrelated Looker explores. Catalog adoption stalled at ~22% of licensed seats.

**What we built:** An intelligent search layer over catalog assets that combines table/column metadata, lineage signals, query popularity from the warehouse query log, and AI-generated table summaries. Replaces the default search endpoint; lexical search kept as a toggle.

**Technical details:**
- Table summarization: for each table, GPT-4o-mini generates a short summary from schema + top-5 sample queries from the query log + existing human description (if any). Regenerated on schema change or lineage shift.
- Embeddings: `text-embedding-3-large` for summaries and column descriptions; stored in Qdrant with per-customer collection and metadata for warehouse, schema, owner, last-used timestamp.
- Hybrid retrieval: Elasticsearch (already in the stack) for lexical + Qdrant for dense, combined with Reciprocal Rank Fusion; Cohere Rerank on top-30 to top-10.
- Popularity boost: query-log popularity folded in as a learned ranker feature; a lightweight gradient-boosted model trained on click-through data.
- Eval: 600 real catalog searches with ground-truth "correct asset" labels from customer data teams; NDCG@10 and top-1 accuracy.

**Outcome:** NDCG@10 improved from **0.36 to 0.74**; top-1 accuracy from 28% to **69%**. Customer adoption on pilot deployments rose from ~22% to **51%** of licensed seats within a quarter. The client used the launch as a pricing-tier change, moving semantic search to Enterprise.

**Timeline and Total cost:** 1 week discovery + 7 weeks build. Total: **$27,000**.

---

### Example I17: AI documentation generator for a dbt-focused data-engineering SaaS

**Client profile:** Data-engineering platform built around dbt, 65 employees, ~800 customer data teams. Customers run anywhere from 50 to 15,000 dbt models; documentation coverage averages ~40%.

**The problem:** Data teams wanted documentation but never prioritized writing it. Un-documented models made onboarding new analysts painful and blocked self-serve BI initiatives. Existing dbt `description` auto-gen tools produced generic output that engineers didn't trust.

**What we built:** A targeted AI feature that generates model descriptions, column descriptions, and suggested tests (`unique`, `not_null`, `accepted_values`, `relationships`) from the SQL source, lineage, and sample data. Runs in the customer's dbt CI pipeline; engineers review and commit.

**Technical details:**
- Context per model: the model's SQL, its upstream and downstream lineage (one hop each direction), a sample of 10 rows, and column-level statistics (null rate, cardinality, min/max for numeric columns).
- Generation: GPT-4o with a strict YAML schema matching dbt's `schema.yml` format; responses validated before surfacing.
- Test suggestions: cardinality and null-rate statistics gate which tests the LLM is allowed to propose (no `unique` suggestion on a column with observed duplicates, no `not_null` on a column with nulls). Deterministic rails on top of the LLM's creativity.
- No vector database — this is a per-model generation task, not a retrieval task.
- Evaluation: 500 models across 6 customer projects with engineer-authored ground-truth descriptions; measured BLEU-style similarity plus a human 5-point "would you commit this" rubric.

**Outcome:** Engineer "would commit this" rating averaged **4.3/5**; direct-commit rate (no edits) **61%**. Documentation coverage at pilot customers rose from ~40% to **84%** within eight weeks. The feature became a frequently-cited reason for platform renewals in QBRs.

**Timeline and Total cost:** 1 week discovery + 4 weeks build. Total: **$11,000**.

---

# Custom AI Apps

Custom AI Apps are when we build a new AI-native application end to end. This is for clients who have an idea — a tool, platform, or internal system — and need a team to architect and ship it. The case studies below are larger, longer engagements where the AI capability isn't a feature added to existing software; it's the product.

---

## Example C1: Incident-response copilot for an observability SaaS

**Client profile:** Observability SaaS (metrics + logs + traces), 310 employees, ~2,100 enterprise customers. On-call engineers at customer companies use the product to diagnose production incidents; the product already has a "related queries" feature but no generative AI surface.

**The problem:** A typical Sev-2 took 42 minutes median time-to-diagnose. Post-incident reviews showed 60%+ of that time was spent correlating a symptom ("latency on checkout-api") with an underlying cause (a deploy, a config change, a dependency slowdown). Customers wanted "ChatGPT for incidents" but hallucinations would be catastrophic.

**What we built:** A diagnostic AI agent that takes an incident context (affected service, time range, triggering alert) and produces a ranked list of candidate root causes, each tied to specific evidence (log patterns, trace spans, recent deploys) with citations into the customer's own telemetry. Deterministic analytics run first; the LLM narrates over the results.

**Technical details:**
- Architecture pattern: deterministic statistical analyses (change-point detection, deploy correlation, top-N error signatures, span anomalies) produce a structured "evidence bundle"; the LLM only narrates and ranks — it never invents facts.
- Span/log sampling strategy tuned to fit 30k–40k tokens of evidence per incident; irrelevant dimensions dropped by a mutual-information filter.
- Model: Claude Sonnet for synthesis (better at following "cite the evidence bundle only" instructions in our evals than GPT-4o by ~6pp on faithfulness); GPT-4o-mini for a cheap "is this incident even LLM-solvable" gate.
- No vector database in the hot path — the evidence bundle is query-time assembled from the client's existing ClickHouse. A small Qdrant index holds historical post-mortems that the agent can optionally cite.
- Evaluation: 180 historical incidents with known root causes labeled by the client's SREs; tracked top-1, top-3 root-cause accuracy and "citations-present-and-correct" rate.
- FastAPI service deployed inside the client's existing VPC; streams output over WebSocket into the incident console.

**Outcome:** Top-3 root-cause accuracy **82%**; median time-to-diagnose at pilot customers dropped from 42 minutes to **17 minutes**. Hallucination rate on citations measured at **0.6%** (where "hallucination" meant a fabricated span/log/deploy). Feature shipped as an Enterprise-tier add-on.

**Timeline and Total cost:** 1 week discovery + 10 weeks build. Total: **$46,000**.

---

## Example C2: Natural-language analytics copilot for a BI platform

**Client profile:** BI/dashboarding SaaS, 200 employees, ~2,200 customer workspaces, ~50k dashboards. Customers connect to their own warehouse (Snowflake, BigQuery, Postgres, Redshift) and build dashboards; business users still go through analysts for ad-hoc questions.

**The problem:** At a representative customer, business users filed ~400 ad-hoc data requests per week to a team of 8 analysts; average turnaround 3 days. Analysts wanted to delegate routine questions; the BI vendor wanted to ship a natural-language analytics feature without the hallucination horror stories customers had seen on competitor launches.

**What we built:** A natural-language analytics copilot scoped to tables the customer explicitly enrolls. Generation is multi-step (intent → schema linking → query writing → validation) with execution against a dry-run plan before showing results. Uses the customer's warehouse credentials, respects row-level permissions.

**Technical details:**
- Semantic model: per-workspace YAML defining enrolled tables, business-friendly names, synonyms, metric definitions, and join specs. Product team built a UI for customers to author this; we built the ingestion and validation.
- Schema linking: table and column descriptions + verified-query examples embedded via `bge-m3` into pgvector (chose pgvector over Qdrant because the client wanted zero new infrastructure and per-workspace tenancy was cleanly modeled in Postgres).
- Generation: Claude Sonnet for SQL writing (outperformed GPT-4o on our warehouse-dialect evals by ~5pp execution accuracy); schema-linking and intent classification run on GPT-4o-mini.
- Validation: generated SQL is parsed, dry-run-planned against the warehouse (`EXPLAIN` for Postgres/Redshift, query-validation API for Snowflake/BigQuery); invalid SQL triggers a repair prompt, up to 2 attempts.
- Evaluation: 850 NL/SQL pairs across 6 customer workspaces, tracking execution accuracy (result-set match) as the primary metric and BIRD-style hardness buckets for secondary analysis.
- Guardrails: refuses questions outside the enrolled semantic model rather than guessing; clarifying-question loop for ambiguous asks.

**Outcome:** Execution accuracy **87.3%** overall (93% on "easy", 81% on "medium", 64% on "hard" buckets). At the pilot customer, 58% of ad-hoc data requests were answered by the copilot end-to-end; analyst backlog dropped from 3 days to **under 8 hours**. The feature drove Enterprise-tier upsell and was cited by the client's CRO as their top GA launch of the year.

**Timeline and Total cost:** 1 week discovery + 10 weeks build. Total: **$48,000**.

---

## Example C3: AI-driven anomaly triage for a data-quality platform

**Client profile:** Data-observability SaaS, 140 employees, ~550 enterprise customers. Product detects freshness, volume, schema, and distribution anomalies in customer data pipelines; customers get alerts but diagnosing them still takes hours.

**The problem:** An average customer received ~80 anomaly alerts per week; on-call data engineers spent ~45 minutes per alert triaging (is this real? what changed upstream? which downstream assets are affected?). A lot of alerts were ultimately benign (seasonality, expected release-day spike) but the triage cost was borne regardless.

**What we built:** A custom AI triage layer that, for each anomaly, assembles upstream-lineage context, recent deploys, upstream pipeline health, and historical seasonality; classifies the alert as likely-benign / likely-real / unclear; and drafts a triage note the engineer can accept, edit, or reject.

**Technical details:**
- Evidence assembly is deterministic: lineage from the client's existing graph, last-N deploys from the integrated git/CI provider, historical seasonality from their time-series store.
- Classification: a fine-tuned Qwen 2.5 7B (LoRA) running on vLLM. Base GPT-4o-mini was tested but the client's cost projection ruled it out at their alert volume. Fine-tuning data: 180k historical alerts with engineer-provided resolution labels. LoRA (`r=16`), 2 epochs on 2x A100.
- Narrative generation: Claude Sonnet over the evidence bundle and the classifier's label; forced JSON schema; citations back to the evidence bundle always required.
- Evaluation: 420 held-out alerts with ground-truth resolutions; tracked classification precision/recall per class plus a 5-point "useful triage note" rating from the client's SRE team.
- Served inside the client's VPC; model weights and customer data never leave.

**Outcome:** Classification precision on "likely-benign" reached **93%** with 71% recall — enough that the client started routing that bucket into a low-priority digest, saving substantial on-call noise. Average triage time per alert dropped from 45 minutes to **~11 minutes**. Customer-reported MTTR on real data incidents improved **~38%**. The feature shipped as a premium add-on.

**Timeline and Total cost:** 1 week discovery + 9 weeks build. Total: **$39,000**.

---

# Closing notes

Patterns we see across these engagements, and that any prospective client can use as a sanity check on their own situation:

**Most projects don't need custom-trained models.** Of the 22 case studies above, only five involved training a custom model. Each had a concrete reason: regulatory constraints that forced in-VPC deployment, per-request cost pressure at high volume, or a domain-specific signal that prompt engineering couldn't capture. Most of the time, off-the-shelf models with the right architecture around them produce better outcomes faster and cheaper than custom training.

**Hybrid search beats pure semantic search in every domain we've worked in.** Combining traditional keyword search (BM25) with semantic vector search and a reranker is the architecture we reach for by default. Pure semantic search looks great in demos and under-delivers in production, particularly for domains heavy in jargon — finance tickers, medical codes, product SKUs, database column names.

**Evaluation is what separates projects that ship from projects that get killed.** Every engagement above included a held-out test set built from the client's own data, graded by the client's own subject-matter experts. We use standard benchmarks as secondary signals, but the primary measure of "does it work" is always built bespoke from the client's reality.

**Tech-stack choices follow the client's existing infrastructure.** pgvector shows up here when clients run on RDS Postgres; Qdrant shows up when we need per-tenant isolation or cross-region deployments; self-hosted models show up when data residency or unit economics demand it. We don't bring opinionated stack decisions to the first conversation.

**Audits often pay for themselves before any building happens.** The two audits above each saved their clients from a six-figure misallocation. If you're not sure where to start, that's usually the right first conversation to have.
