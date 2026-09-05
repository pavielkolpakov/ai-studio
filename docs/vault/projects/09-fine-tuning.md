---
title: Model Fine-Tuning Engagement
read_when: >
  user asks about fine-tuning, training a model on their data, LoRA, a custom
  model, domain-specific terminology, consistent structured output at volume,
  cutting inference cost with a smaller model, or running a model on their own
  infrastructure
links: []
---

## The problem

Fine-tuning is the right tool for a specific set of problems: when you need consistent output format across thousands of generations, when your domain has specialized terminology that general models handle poorly, when latency or cost requires a smaller model to match a larger one's quality, or when your data is proprietary and can't be sent to a hosted API.

## What we build

Adaptation of a foundation model to your specific domain, writing style, task format, or proprietary data — so it performs significantly better on your use case than a general-purpose model with prompting alone. Used correctly, a fine-tuned model can outperform GPT-4-class models on your specific task while running at a fraction of the cost.

## How it's built

Use-case assessment: confirming that fine-tuning (vs. RAG or prompt engineering) is the right solution for the problem. Training data curation and formatting: cleaning, structuring, and augmenting your dataset into the format required for supervised fine-tuning or RLHF. Base model selection: choosing the right open-source or API-accessible model given your latency, cost, and deployment constraints. Fine-tuning run: supervised fine-tuning with validation split, learning rate tuning, and early stopping. Eval suite construction: before/after benchmarks on your specific tasks. Deployment: model serving setup (vLLM, Together AI, or cloud provider inference endpoint). Ongoing eval to monitor for drift as production data evolves.

## Who buys this

- Legal tech companies needing consistent contract clause extraction in specific formats
- Medical or healthcare-adjacent platforms requiring clinical terminology accuracy
- Financial services firms with proprietary document classification or extraction tasks
- Companies generating high volumes of structured output (reports, summaries, data extraction) where GPT-4 costs are prohibitive at scale
- Developer tools companies wanting a coding assistant fine-tuned on their specific framework or codebase

## Numbers

- Fine-tuned smaller models (7B–13B parameters) can match GPT-4 performance on domain-specific tasks while costing 10–50x less per inference
- Training data requirement: typically 500–5,000 high-quality examples for supervised fine-tuning on a specific task
- Typical project size: $25,000–$70,000 depending on dataset size, number of training iterations, and deployment complexity
- Best ROI case: high-volume inference workloads where even a 5x cost reduction translates to $100,000+/year in savings

If you are still deciding between fine-tuning, RAG, and prompting, see Fine-Tuning vs. RAG vs. Prompting, How to Choose in the agency information.
