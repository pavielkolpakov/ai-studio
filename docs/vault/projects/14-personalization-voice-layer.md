---
title: Per-User Personalization & Voice-Matching Layer
read_when: >
  user wants AI that writes in each customer's own voice, per-user
  personalization, a tone-of-voice engine, ghostwriting or draft generation for
  creators, a system that learns from approvals and rejections instead of being
  retrained, or asks whether to fine-tune a model per user; also when generated
  output sounds generic, users reject drafts and the product never learns from
  it, or a numeric "virality" or quality score is not trusted
links:
  - "[[projects/09-fine-tuning]]"
  - "[[projects/03-embedded-llm-feature]]"
---

## The problem

Your product writes on behalf of your users, and the output sounds like a language model rather than like them. The obvious fix, fine-tuning a model per user, means thousands of models each trained on too little data, none of which can use the clip a user saved this morning. Fine-tuning bakes in style; it does not solve context.

The second failure is that nothing learns. A user rejects a draft as too formal, rejects the next one for the same reason, and the product has no memory of either. The third is false precision: a "virality potential: 7/10" on every draft is an unfalsifiable prediction, and it costs trust the first time a 9 flops.

## What we build

A personalization layer that gives every user their own voice profile, their own retrievable context, and their own accumulated list of things never to do again. It reads what they published, what they saved, what they dictated, and what they rejected, and applies all of it on every generation.

Output is a draft that sounds like them, plus a written assessment of why: hook, structure, voice match, risk factors, suggested tweaks. No numeric score. The system improves per user without training a model per user.

## How it's built

Every fact about a user is a typed context record in Postgres with a nullable pgvector embedding, an importance weight, and an optional TTL. Embeddings run on `text-embedding-3-small` through a background queue, never in the request path. Retrieval is two-pass: semantic top-K by cosine similarity plus a structured always-include set (voice profile, recent rejections, stated goals), merged with importance weighting and recency decay, truncated to a per-task token budget.

The voice profile is structured JSON produced by a mid-tier analysis pass over recent posts and onboarding answers. It is never embedded; it is injected whole into every prompt, and rejection reasons fold into its `anti_patterns` list weekly. A provider-agnostic adapter routes each task by tier, enforces hard token budgets and per-user daily ceilings, and trips a circuit breaker to a secondary provider when error rates spike. Redis caches voice profiles and hot context. Everything runs on managed services: RDS or Cloud SQL, queue-backed workers, Fargate or Cloud Run.

## Who buys this

- Creator tools and social publishing products whose value depends on output sounding personal
- Consumer and prosumer SaaS whose AI writing feature users abandon because it sounds generic
- Founders who were quoted a per-user fine-tuning architecture and want the cost and complexity checked
- Sales, recruiting and outbound platforms sending messages that must read as human
- Product teams whose users already reject AI output but whose product captures none of that signal

## Numbers

- 12 typed record types cover everything the system knows about a user; roughly 500 records each, 5M rows at 10,000 users
- Per-task context budgets of 2,500-6,000 tokens, deliberately capped rather than maximized
- Tier routing puts voice analysis, classification and suggestions on models costing 10-20x less per token
- Modeled unit economics: about $2.17 per active user per month in LLM and API spend, roughly $24,000/month all-in at 10,000 users, near 3% of revenue

Built as the AI layer for Jucey. See Pricing, Payment Terms, and Engagement Sizes in the agency information for terms and discovery. If per-user fine-tuning is genuinely right, see [[projects/09-fine-tuning]].
