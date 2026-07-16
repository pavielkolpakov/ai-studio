---
title: What Is RAG?
read_when: >
  user asks what RAG means, what retrieval-augmented generation is, why RAG
  instead of just prompting an LLM, or wants a plain explanation of the concept
links:
  - "[[technical/rag-pipeline]]"
  - "[[technical/when-rag-fits]]"
  - "[[technical/finetuning-vs-rag-vs-prompting]]"
---

## What Is RAG?

Retrieval-Augmented Generation (RAG) is an architecture that combines a retrieval system with a large language model (LLM) to produce answers grounded in a specific knowledge base. Instead of relying solely on what the LLM learned during training, a RAG system first fetches relevant documents from your data at query time, then passes those documents to the LLM as context for generating an answer.

The result: an AI system that answers questions accurately from your specific data, stays up to date as your data changes, and doesn't hallucinate facts it doesn't know — because every answer is anchored to retrieved source documents.

## Why RAG Instead of Just Prompting an LLM?

A plain LLM — even GPT-4 — has no knowledge of your internal data. It cannot answer questions about your product documentation, your support history, your internal processes, or your proprietary knowledge. You could put some of this in a system prompt, but the context window has limits — you cannot stuff 50,000 documents into a prompt.

RAG solves this by making retrieval dynamic: it finds the most relevant documents for each specific query and only passes those to the LLM. This means your knowledge base can be arbitrarily large.
