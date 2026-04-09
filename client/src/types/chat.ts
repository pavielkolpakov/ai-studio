export interface Source {
  source: string;
  header: string;
}

export interface CTA {
  label: string;
  url: string;
}

export interface SSEEvent {
  token: string;
  done: boolean;
  sources?: Source[];
  cta?: CTA | null;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  cta?: CTA | null;
}
