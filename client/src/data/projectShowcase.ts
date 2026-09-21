/** Editorial summaries of docs/vault/projects. These are project patterns, not client outcome claims. */
export const PROJECT_SHOWCASE = [
  {
    name: "Knowledge & search", title: "Your knowledge. Finally findable.",
    description: "Turn scattered documents, tickets, and internal wikis into answers your team can trace back to a source.",
    flow: ["Your documents", "Relevant context", "A cited answer"],
    details: ["Source-linked answers", "Permission-aware retrieval", "Content that stays in sync"],
    measure: "Measure retrieval quality, answer faithfulness, and time to find an answer.",
    source: "01-rag-knowledge-assistant.md", color: "iris", icon: "search",
  },
  {
    name: "Customer support", title: "Less repetition. More resolution.",
    description: "A copilot inside your helpdesk. Classify requests, draft informed replies, and hand complex cases to a person with the context intact.",
    flow: ["Incoming request", "Context & confidence", "Resolve or escalate"],
    details: ["Helpdesk integration", "Human review checkpoints", "Account-aware responses"],
    measure: "Measure response time, resolution quality, and the accuracy of escalations.",
    source: "04-support-copilot.md", color: "blue", icon: "support",
  },
  {
    name: "Workflow automation", title: "Give repetitive work a better path.",
    description: "Move information from documents and emails into the systems that need it, with structured extraction and review for uncertain decisions.",
    flow: ["Documents & email", "Extract & validate", "Your business systems"],
    details: ["Structured outputs", "A human review queue", "Connected CRM and operations"],
    measure: "Measure processing time, extraction accuracy, and the rate of human review.",
    source: "06-workflow-automation.md", color: "mint", icon: "workflow",
  },
  {
    name: "Voice agents", title: "Every call has a next step.",
    description: "Handle predictable calls for scheduling, qualification, and support. Transfer to a human when the conversation needs one.",
    flow: ["A customer calls", "Understand & act", "Log or hand off"],
    details: ["Calendar and CRM integration", "Warm transfers with context", "Call quality evaluation"],
    measure: "Measure task completion, handoff accuracy, and conversation quality.",
    source: "12-voice-ai-agent.md", color: "peach", icon: "voice",
  },
  {
    name: "AI infrastructure", title: "One place to keep AI in check.",
    description: "Bring model access, project budgets, and usage visibility behind one gateway. Give teams room to build with clear operating boundaries.",
    flow: ["Your applications", "Policy & routing", "Model providers"],
    details: ["Project-level spend controls", "Provider route configuration", "Operational monitoring"],
    measure: "Measure usage, latency, request failures, and cost by project.",
    source: "17-llm-gateway.md", color: "iris", icon: "infrastructure",
  },
];
