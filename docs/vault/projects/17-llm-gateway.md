---
title: LLM Gateway / Multi-Provider Routing and Spend Control
read_when: >
  user wants an LLM gateway, an internal AI proxy, one endpoint in front of
  OpenAI, Anthropic, Gemini and Grok, per-team budgets or model allow-lists,
  spend visibility across projects, provider failover, or mentions LiteLLM,
  Vertex AI, model routing, API key sprawl or rate limits per project; also
  when every team holds its own provider key, when LLM spend only becomes
  visible on the monthly invoice, or when adding a new model means a code
  change in every service
links:
  - "[[projects/16-app-navigation-agent]]"
---

## The problem

Every team that ships an AI feature gets its own provider key. Nobody can say what the company spends on models this month, or which project spent it, until the invoice arrives. Switching to a cheaper model means changing code; adding a new one means another key, another SDK, another set of rate limits.

A runaway loop in a prototype burns a five-figure bill before anyone notices. A leaked key cannot be revoked without breaking every service that shares it. A provider has a bad hour and everything calling it directly goes down with it.

## What we build

One endpoint and one key format for every model your teams use. Applications send OpenAI-shaped requests; the gateway routes each to the right provider, enforces which models that project may call, caps what it can spend, and records every call against a project and a user.

Adding a model becomes a config change reviewed in one place, not a migration across services. Budgets and limits are set per project and per user, so a prototype cannot spend a production team's money. A second tier for consumer mobile apps — device attestation and short-lived keys, so a decompiled binary yields nothing — is scoped in the same repository.

## How it's built

A LiteLLM proxy pinned to an exact version, deployed to GKE by Helm. Postgres holds teams, keys, metadata and spend; Redis carries router state across replicas. Policy lives in Python hooks the proxy loads: one validates key generation against the team's allowed key types and user-ID scheme, one inspects key metadata before each call, one rewrites provider headers in flight. Anthropic models are exposed on two routes — Vertex AI and the vendor's direct API — so a bad hour at one provider is a config edit.

Provider keys come from GCP Secret Manager through External Secrets as a pre-upgrade hook, so no credential is checked in. Prisma migrations run as a gated Helm hook ahead of the rollout, the admin UI sits behind Google IAP, and a config checksum rolls pods on any model change while `--atomic --wait` rolls back a failed boot. CI boots both config files on every push and asserts each declared model registers; a version pre-flight blocks proxy downgrades, which silently corrupt the migration ledger.

## Who buys this

- Engineering leaders whose LLM spend is growing and untraceable to a team
- Platform teams giving every product group model access without handing out provider keys
- Companies running several AI products who want one place to swap models
- Mobile publishers shipping AI features where the API key ends up on the device
- Finance and ops owners who need per-project cost attribution, not one invoice line
- Security teams that need key revocation, audit logs, and no long-lived secrets in apps

## Indicative implementation scope

- price_range: $20,000–$40,000
- time_estimate: 4–7 weeks
- tech: LiteLLM, Python, PostgreSQL, Redis, GKE, Helm, GCP Secret Manager, External Secrets, Google IAP

### Deliverables

- OpenAI-compatible gateway with up to three providers and an agreed model-route configuration.
- Project and user keys, model allow-lists, budget controls, rate limits, and spend attribution.
- Secret management, protected admin access, provider-route switching, and policy hooks.
- CI configuration checks, migration gates, deployment rollback, and operational monitoring.
- Integration of two existing calling services, deployment documentation, and handover.

### Estimate assumptions

Covers one existing GCP/GKE environment and server-side callers with a consistent user/project identity scheme. The client provides provider accounts, cloud access, and representative traffic. Consumer-device attestation and short-lived mobile credentials, additional clouds, multi-region availability, migration of all company services, and custom billing interfaces are separate scope. Automatic failover behavior and budget-enforcement tolerances must be agreed and tested; alternate routes alone do not guarantee uninterrupted service or zero overspend.

These are engineering planning estimates for the scope above, not historical project fees or a fixed quote. Duration assumes timely access, usable inputs, and client feedback; it includes implementation, validation, deployment, and handover. Any separate audit is scoped independently. Model/API usage, hosting, storage, third-party licenses, and ongoing optimization are excluded. Final pricing and schedule follow technical assessment.

## Numbers

- 49 model routes across four providers in the live config, on one endpoint
- Anthropic models carry two routes each, so provider failover is a config edit
- Autoscales 3 to 12 pods on CPU, with a disruption budget holding one available
- 129 commits by 7 contributors over 15 months of continuous operation
- Every branch push smoke-tests both configs, with no paid API calls
