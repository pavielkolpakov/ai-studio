---
title: Autonomous Mobile App Navigation Agent
read_when: >
  user wants an AI agent that drives a real mobile app, automated onboarding or
  store screenshots, a visual record of every screen in an app, first-run flow
  capture across a portfolio of apps, UI walkthroughs without hand-written test
  scripts, or mentions Appium, UiAutomator2, Android emulators, AWS Device Farm,
  or exporting app screens into Figma; also when capturing onboarding by hand
  eats hours per app per release, or when Appium suites break on every redesign
links:
  - "[[projects/15-codebase-migration-agent]]"
---

## The problem

You ship dozens of Android apps and need to see what each one looks like on a device: onboarding screenshots for the store listing, a record of the screens a new user walks through, proof that first-run survived an SDK swap. Today someone installs the build, taps through by hand, screenshots each step, then repeats it for the next app and the next version — hours per app, expiring the moment a new build lands.

Scripted UI tests do not close the gap: they target fixed element IDs, so a redesign breaks them.

## What we build

An agent that installs your app on a device, drives it through a task you describe in plain English — first-run onboarding, or a tour of every feature — and returns a recorded session: each screen it reached, the action that produced it, a video, and a self-contained HTML storyboard. The same session imports into Figma as a flow board.

You hand it a list of apps and a task prompt; it provisions devices, installs each build, runs the walk, uninstalls, and reports per-app outcomes. Ad interstitials and permission dialogs are handled on the way through. It flags crashes and failed walks, but makes no correctness assertions — the deliverable is the visual record.

## How it's built

Appium and UiAutomator2 drive the device over one serialized session. The navigator is a pydantic-ai agent that never sees a screenshot — only a one-sentence screen summary and a numbered list of actions, returned by its own tools. Perception is separate: screenshot plus view hierarchy simplified to text, stabilised by a loop that samples until the screen stops moving, then summarised. Seven LLM roles each get their own model and cost bucket — Sonnet navigates, Haiku extracts and compacts history, Gemini Flash grounds an element visually when the hierarchy does not name it. Ad interstitials are caught by perceptual hashing and pixel scans before the model sees them.

The engine running it is appgent, our LangGraph-based YAML workflow runner with Pydantic-validated hierarchical config — the same engine behind [[projects/15-codebase-migration-agent]]. It composes numbered stages: resolve batch, provision, a per-app install-run-uninstall loop, report, transcode, publish, branching across three backends (local emulator, a GCP emulator VM baked with Packer and Ansible, AWS Device Farm) and five install methods. Sessions serialise to a versioned JSONL contract shared by the HTML renderer and the Figma plugin; runs execute on GitHub Actions.

## Who buys this

- Mobile app publishers refreshing store screenshots across a portfolio every release
- Growth and ASO teams capturing onboarding across versions and light/dark modes
- QA leads whose scripted UI suites break on redesigns and cover few of the apps
- Product and design teams who want the current flow as a Figma board, not a folder of PNGs
- Engineering leaders checking a fleet-wide SDK migration did not break first-run

## Numbers

- 32 modules in the agent core, covered by a 55-module test suite
- 7 LLM roles across 3 model tiers, each metered into its own per-run cost bucket
- 3 device backends, 5 install methods and 7 pipeline stages behind one JSON input contract
- Built in ~3 months by 8 contributors over 334 commits, on a 269-commit orchestration engine

See Pricing, Payment Terms, and Engagement Sizes in the agency information for engagement sizes.
