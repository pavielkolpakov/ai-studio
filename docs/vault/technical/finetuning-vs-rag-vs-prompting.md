---
title: Fine-Tuning vs. RAG vs. Prompting, How to Choose
read_when: >
  user asks whether to fine-tune or use RAG, whether a better system prompt
  would be enough, how to choose an AI architecture, or what the tradeoffs are
  between prompting, retrieval, and training
links:
  - "[[technical/when-rag-fits]]"
  - "[[projects/09-fine-tuning]]"
  - "[[process/discovery]]"
---

One of the most common questions we get from technical clients is: "Should we fine-tune a model, use RAG, or just write a better system prompt?" The answer depends on your specific use case, data characteristics, latency requirements, and budget. Here is a practical decision framework.

## Option 1: Prompt Engineering (No Training, No Retrieval)

**What it is:** You use a general-purpose LLM (GPT-4o, Claude, Mistral) as-is, with a carefully crafted system prompt and few-shot examples in the prompt.

**When it works well:**
- Your use case requires general reasoning, writing, summarization, or classification on diverse input
- Your knowledge is small enough to fit in the context window (a few thousand tokens)
- You need to ship fast and iterate on behavior without retraining
- The task doesn't require deep domain-specific terminology or format consistency

**When it breaks down:**
- Your knowledge base is larger than the context window
- You need consistent output format across thousands of generations
- The model doesn't know your proprietary terminology or internal product specifics
- Cost becomes prohibitive when stuffing large context on every query

**Typical cost to implement:** Hours to days. No infrastructure beyond an API key.

## Option 2: RAG (Retrieval-Augmented Generation)

**What it is:** A retrieval layer finds the most relevant documents from your knowledge base at query time, then passes them as context to the LLM for generation.

**When it works well:**
- You have a large, dynamic knowledge base that changes frequently
- You need answers grounded in specific, citable sources
- The task requires looking up specific facts, policies, or content from your data
- You can't fine-tune (proprietary API model, no training data, too expensive)

**When it breaks down:**
- The task requires generating consistent structured output at high volume (fine-tuning is cheaper per inference)
- Your domain vocabulary is so specialized that general embeddings produce poor retrieval
- Latency is extremely critical

**Typical cost to implement:** $12,000–$100,000 depending on scale, integrations, and complexity.

## Option 3: Fine-Tuning

**What it is:** You train additional parameters on top of a base model using your domain-specific data. The result is a model that "knows" your terminology, output format, and domain patterns intrinsically.

**When it works well:**
- You have a high-volume, specific task with consistent input/output patterns
- Output format consistency is critical (structured extraction, specific JSON schemas)
- Your domain vocabulary is so specialized that prompting a general model produces poor results
- Inference cost at scale makes hosted API costs prohibitive
- Data privacy requires a model that runs entirely on your infrastructure

**When it breaks down:**
- You don't have enough labeled training data (typically need 500+ high-quality examples minimum)
- Your task is diverse and general-purpose
- You need the knowledge base to be updated frequently (fine-tuning requires retraining)

**Typical cost to implement:** $25,000–$70,000 for dataset preparation, training runs, evaluation, and deployment.

## How We Help You Choose

When a client comes to us with an AI use case, we start with a 1-week discovery engagement that includes: mapping your data sources, defining the task precisely, running quick experiments with prompting and retrieval on a subset of your data, and delivering a written technical recommendation with rationale. This means you don't commit to a full build before knowing what the right architecture is.

See [[process/discovery]] for what that week involves.
