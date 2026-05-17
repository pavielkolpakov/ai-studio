export interface FollowupPick {
  id: string;
  text: string;
  cacheKey?: string;
  action?: "send" | "calendly" | "ideas-prompt";
}

export interface Idea {
  title: string;
  description: string;
  deliverables: string[];
  tech: string[];
  price_range: string;
  time_estimate: string;
}

export type SSEEvent =
  | { type: "token"; token: string; done: false }
  | { type: "tool_call"; tool: string; query?: string }
  | { type: "ideas"; ideas: Idea[] }
  | { type: "done"; followups?: FollowupPick[] };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  ideas?: Idea[];
}
