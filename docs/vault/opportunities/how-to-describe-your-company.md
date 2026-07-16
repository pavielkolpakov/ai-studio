---
title: How to Describe Your Company to Get Useful AI Ideas
read_when: >
  user is unsure what to tell us about their business, asks what information we
  need to suggest ideas, or gives a vague description and needs prompting for
  more detail
links:
  - "[[opportunities/four-questions]]"
  - "[[process/scoping-call]]"
  - "[[services/overview]]"
---

**Tell us:**
- What your product does in one or two sentences
- Who your users are (developers? ops teams? end consumers? internal employees?)
- What data you have — not just what kind, but roughly how much and in what form
- What your users complain about or struggle with most
- What your support team gets asked most often
- What your internal team does manually that they wish was automated
- What AI features your competitors have shipped or are shipping

**Example of a useful description:**
"We make a B2B project management tool for construction companies. Our users are project managers and site supervisors. We have 5 years of project data — tasks, timelines, budgets, issue logs — for about 3,000 completed projects. Users constantly ask our support team how to set up project templates. Our competitors recently added an AI assistant that answers questions about project status."

From this, we can immediately identify:
- A RAG system over project documentation and templates to answer setup questions
- A project outcome predictor trained on historical project data (delays, budget overruns)
- An AI assistant for project status queries against live project data
- Automated project template generation based on project type and parameters
