---
title: Multi-Agent Research & Scored Report Engine
read_when: >
  user wants automated market or competitive research, a multi-agent research
  pipeline, parallel research agents, competitor discovery, deal-flow or idea
  screening, due-diligence summaries, a scored and cited report instead of a
  chat answer, or mentions Perplexity, Sonar, LangGraph, or an LLM judge; also
  when analysts spend days assembling research by hand, or when an existing
  AI tool returns confident answers with competitors and source links that
  turn out not to exist
links:
  - "[[projects/08-evals-harness]]"
  - "[[projects/07-agentic-rag-platform]]"
---

## The problem

Someone on your team spends two days on the same research every time: who else does this, how big is the market, who already tried and died. The result is a document nobody can compare to last week's, because each was assembled by hand in a different order against different standards of evidence.

Handing the job to a general chatbot fails in a specific way: it names companies that do not exist and invents source URLs plausible enough that nobody checks them, attached to factual claims about real firms. Any score it gives drifts with the wording of the question, so comparable subjects come back points apart for no inspectable reason.

## What we build

A pipeline that takes one question in freeform text and returns a structured report: a written verdict, five 0-100 subscores, a competitor table, the main risks, the differentiating angles, and a numbered citation behind every claim. Four research passes run in parallel — direct competitors, larger incumbents who could absorb this as a feature, market signals (size, funding, demand evidence), and the graveyard of everyone who tried and failed. A judge model reads all four and synthesises them into one report with a shareable link.

It is not a chatbot. There is no conversation, and it does not answer from what the model already believed.

## How it's built

A LangGraph `StateGraph` fans out to four separate research nodes over static edges, so a crashed run resumes from a Postgres checkpointer instead of re-paying for four API calls. Research runs against Perplexity Sonar; the judge is Claude with Pydantic structured output. Research is fail-soft with retry inside each node, and a degraded agent is surfaced in the output rather than hidden. Citations are integer indices into a table built in code — the model physically cannot emit a URL, and an index resolving to nothing fails the run. The overall score is a weighted mean computed in code, never emitted by the model, so the scale stays comparable across runs and the weights can be retuned against history for free. FastAPI, async SQLAlchemy on psycopg3, Postgres 17 with pgvector, Alembic, a Next.js frontend, LangSmith tracing from day one. Every run also writes an embedded corpus — ideas, discovered companies upserted on normalised domain with sighting counts, and raw research chunks — so retrieval has something worth querying when it is switched on.

## Who buys this

- Founder-tools and startup-intelligence products whose users make build or don't-build decisions
- Venture studios and accelerators screening more inbound deal flow than analysts can read
- Corporate strategy and new-ventures teams running repeated market scans
- Market research and competitive-intelligence firms productising work done by hand today
- Product teams needing pre-build validation against a fixed rubric rather than an opinion
- Any product whose users want a cited, scored document rather than a chat transcript

## Numbers

- 4 research agents run in parallel per report; one Sonar query returned 17 web sources
- 5 weighted subscores combined in code into a single 0-100 score
- 6-table Postgres and pgvector corpus, embedded on every run
- 30 automated tests, each run against a freshly migrated database
- Six weeks of elapsed build time from empty repository to a running pipeline

See Pricing, Payment Terms, and Engagement Sizes in the agency information for terms and discovery. Where the accumulated corpus becomes the product rather than a by-product, see [[projects/07-agentic-rag-platform]].
