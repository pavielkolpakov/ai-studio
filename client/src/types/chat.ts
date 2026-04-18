export interface CTA {
  label: string;
  url: string;
}

export type SSEEvent =
  | { type: "token"; token: string; done: false }
  | { type: "tool_call"; tool: string; query: string }
  | { type: "done"; cta: CTA | null };

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  cta?: CTA | null;
}
