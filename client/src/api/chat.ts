import type { SSEEvent } from "@/types/chat";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function createSession(): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/chat/session`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to create session");
  const data = await res.json();
  return data.session_id;
}

export async function sendMessage(
  sessionId: string,
  message: string,
  onEvent: (event: SSEEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`${API_URL}/api/v1/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
    signal,
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error("Too many requests. Please wait a moment.");
    throw new Error("Failed to send message");
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const json = trimmed.slice(6);
      try {
        const event: SSEEvent = JSON.parse(json);
        onEvent(event);
      } catch {
        // skip malformed events
      }
    }
  }
}
