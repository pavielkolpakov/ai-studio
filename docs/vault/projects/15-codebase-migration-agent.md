---
title: Autonomous Codebase Migration Agent
read_when: >
  user has a portfolio of apps or repos that all need the same change, wants an
  SDK migration or framework upgrade automated, a fleet-wide refactor, an
  autonomous coding agent that opens pull requests, a long-running multi-step
  coding pipeline, or mentions Claude Code, Claude Agent SDK, LangGraph, or
  agent orchestration; also when a mechanical migration is eating developer
  weeks per repo, or when an AI coding tool produced a plausible diff that did
  not compile
links:
  - "[[projects/08-evals-harness]]"
  - "[[projects/11-code-review-agent]]"
---

## The problem

You have a portfolio of apps and one change that must land in all of them: a monetization SDK swap, a framework major version, a compliance retrofit. Each repo costs a developer days — strip the old integration, upgrade the toolchain, wire the new SDK through the screens, fix what breaks, open a PR. Multiply by fifty repos and a quarter of your engineering capacity goes to work that is mechanical but not scriptable: every codebase is laid out differently.

Point a coding assistant at a repo this size and it drifts — loses the thread halfway, calls an API that does not exist, reports success on a build that never compiled. What is missing is not model capability but the harness around it.

## What we build

An agent that performs the whole migration on one repository end to end, unattended, and hands you a pull request. It clones the repo, removes the old system, wires the new one in, builds after every significant change, fixes what it broke, reviews its own diff against the original instructions, and opens the PR as one commit per step — so a human reviews the work in sequence, not as one wall of diff.

You trigger it with a repo name and a ticket ID. It checkpoints as it goes, resumes from the last completed phase after a timeout, and stops rather than guessing.

## How it's built

The workflow is a YAML orchestration graph — around 100 steps across 8 phases, composed from ~50 reusable prompt files — running on LangGraph with Pydantic-validated config and hierarchical resolution. Steps are either scripts, keeping deterministic work deterministic, or prompt steps run by a coding agent through the Claude Agent SDK. Narrow-toolset subagents keep context survivable: a read-only builder that diagnoses compile failures, a reviewer that checks each commit against its instructions, integrators per feature area. Tool-level hooks block destructive git commands, so the orchestrator owns the commit history, not the model. Build verification runs after each major change with a bounded fix loop; design assets come out of Figma by script. It runs in Docker on GitHub Actions, checkpointing state and workspace to artifacts.

Quality is measured, not assumed: deterministic scorers pinned by golden-commit tests, a backfill runner replaying them over historical PRs, LLM-as-judge evals for what code checks cannot reach, and per-run scoresheets, so prompt changes can be A/B'd against a real corpus.

## Who buys this

- App publishers and studios whose whole portfolio needs the same SDK or framework change
- Engineering leaders facing a fleet-wide migration on a deadline — deprecated payments, ads or analytics SDKs, platform API cutoffs
- Platform teams whose internal SDK adoption stalls because nobody will spend a week integrating it
- Companies acquiring apps that must be brought onto a shared internal stack
- Teams who tried an AI coding tool on a migration and got a confident diff that did not build

## Indicative implementation scope

- price_range: $60,000–$110,000
- time_estimate: 12–18 weeks
- tech: Python, LangGraph, Claude Agent SDK, Pydantic, YAML, Docker, GitHub Actions

### Deliverables

- Migration workflow for one agreed SDK or framework change within one application stack.
- Repository checkout, phased edits and commits, build verification, bounded repair loops, and pull-request creation.
- Checkpoint and resume support, restricted agent tools, and isolated CI execution.
- Deterministic migration checks and review scores calibrated against representative client repositories.
- Pilot rollout, per-run reports, workflow documentation, and engineering handover.

### Estimate assumptions

Covers one repository host, one CI environment, and a pilot on 3–5 representative repositories with working baseline builds. The client supplies migration requirements, credentials, build instructions, and reviewers. Human approval remains required before merging. Repositories with unrelated build failures, additional migration types or languages, fleet-wide rollout, and a general-purpose orchestration platform are separate scope. This estimate does not recreate the entire historical engine and pipeline described below.

These are engineering planning estimates for the scope above, not historical project fees or a fixed quote. Duration assumes timely access, usable inputs, and client feedback; it includes implementation, validation, deployment, and handover. Any separate audit is scoped independently. Model/API usage, hosting, storage, third-party licenses, and ongoing optimization are excluded. Final pricing and schedule follow technical assessment.

## Numbers

- ~100 orchestrated steps across 8 phases, from ~50 reusable prompt files
- 3–6 hours unattended per repository at $20–60 in model cost, against days of developer time
- 26 deterministic scorers with golden-commit regression tests, plus LLM-judge evals beyond their reach
- Scorer-to-human agreement calibrated on a 58-PR corpus of reviewed production PRs
- Built across two repositories, pipeline and engine, over ~10 months by 11 contributors

See [[projects/08-evals-harness]] for the measurement layer as a standalone engagement.
