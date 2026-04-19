export interface CTA {
  label: string;
  url: string;
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
  | { type: "done"; cta: CTA | null };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  cta?: CTA | null;
  ideas?: Idea[];
}
