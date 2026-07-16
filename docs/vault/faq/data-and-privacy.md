---
title: "FAQ: Data and Privacy"
read_when: >
  user asks about data access, sensitive data, NDAs, GDPR, HIPAA, compliance,
  data processing agreements, on-premise or private cloud deployment, self-hosted
  models, or whether their data leaves their infrastructure
links:
  - "[[projects/10-compliance-platform]]"
  - "[[technical/tech-stack]]"
  - "[[process/discovery]]"
---

**Do you need access to our sensitive data?**
For RAG systems, yes — we need to ingest your data. We work under NDA from day one, and we have standard data processing agreements for clients with regulatory requirements (GDPR, HIPAA-adjacent). For model fine-tuning, we need a dataset of examples; we can design the data pipeline to minimize our exposure to raw sensitive data.

**Do you sign NDAs?**
Yes, before any technical discussion of client data or systems. We have a standard mutual NDA we can turn around in 24 hours.

**Can you build systems that keep all data on our infrastructure?**
Yes. We have built fully on-premise and private cloud deployments using self-hosted embedding models (e.g., bge-m3, e5-large) and self-hosted LLMs (LLaMA 3, Mistral, Qwen) served via vLLM. No data leaves your infrastructure. This adds complexity and cost but is entirely feasible.

**We're in the EU — do you handle GDPR considerations?**
We are familiar with GDPR requirements and design systems with data minimization and retention controls in mind. We are not lawyers and cannot give legal advice, but we can implement the technical controls your legal/compliance team specifies.
