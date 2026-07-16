---
title: "Phase 2: Build"
read_when: >
  user asks how the build phase works, how we communicate during a project,
  how they track progress, whether they get access to the code, staging
  environments, or whether we write tests
links:
  - "[[process/discovery]]"
  - "[[process/handover]]"
  - "[[about/values]]"
---

The build phase follows the technical spec produced in discovery. You know exactly what we're building before we start.

**Project management:** We set up a shared Linear or Notion workspace before day one. You can see every task, its status, and who owns it at any time. You never have to ask "where are things?" — you can look.

**Communication:** One weekly async written update (what was completed, what's next, any blockers). One weekly 30-minute video check-in if the client wants it — optional, not required. All async communication in a shared Slack channel or Linear comments.

**Code:** All code is in a private GitHub repository you own from day one. We commit daily. You can see the work in progress at any time and raise concerns early, not at the end.

**Staging environment:** We deploy a staging version of the system within the first two weeks so you can interact with it and give feedback before the build is complete. No big-reveal at the end.

**Testing:** We write tests. Unit tests for core logic, integration tests for the AI pipeline, and an evaluation suite for retrieval and generation quality. We don't ship untested code.
