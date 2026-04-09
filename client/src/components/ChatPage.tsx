import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatMessage, CTA } from "@/types/chat";
import { createSession, sendMessage } from "@/api/chat";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SuggestionButtons } from "./SuggestionButtons";

const INITIAL_SUGGESTIONS = [
  "What services do you offer?",
  "Tell me about your process",
  "Show me some projects",
  "What technologies do you use?",
];

const TOPIC_SUGGESTIONS: Record<string, string[]> = {
  services: [
    "How much does a typical project cost?",
    "Do you offer ongoing support?",
    "What industries do you work with?",
  ],
  process: [
    "How long does a project take?",
    "What does the discovery phase look like?",
    "How do you handle revisions?",
  ],
  "use-cases": [
    "Can you share a case study?",
    "What results have your clients seen?",
    "Do you work with startups?",
  ],
};

const DEFAULT_FOLLOWUPS = [
  "Tell me more",
  "What makes you different?",
  "How can I get started?",
];

function getSuggestions(cta: CTA | null | undefined): string[] {
  if (cta?.url) {
    // Extract topic from CTA url like "/services" -> "services"
    const topic = cta.url.replace("/", "");
    if (topic in TOPIC_SUGGESTIONS) return TOPIC_SUGGESTIONS[topic];
  }
  return DEFAULT_FOLLOWUPS;
}

export function ChatPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>(INITIAL_SUGGESTIONS);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    createSession()
      .then(setSessionId)
      .catch(() => setError("Failed to connect. Is the server running?"));
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      if (!sessionId || isStreaming) return;
      setError(null);
      setSuggestions([]);

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
      };
      const assistantId = crypto.randomUUID();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);
      setStreamingId(assistantId);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        await sendMessage(
          sessionId,
          text,
          (event) => {
            if (!event.done) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + event.token }
                    : m
                )
              );
            } else {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, sources: event.sources, cta: event.cta }
                    : m
                )
              );
              setSuggestions(getSuggestions(event.cta));
            }
          },
          controller.signal
        );
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setIsStreaming(false);
        setStreamingId(null);
        abortRef.current = null;
      }
    },
    [sessionId, isStreaming]
  );

  return (
    <div className="flex flex-col h-dvh max-w-3xl mx-auto">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 shrink-0">
        <h1 className="text-lg font-semibold">Neuronetis</h1>
        <p className="text-xs text-muted-foreground">
          Ask me anything about our studio
        </p>
      </header>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <div className="mb-2 text-4xl">💬</div>
          <h2 className="text-xl font-semibold mb-1">
            Welcome to Neuronetis
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            I'm your AI assistant. Ask me about our services, process, projects,
            or anything else about the studio.
          </p>
          <SuggestionButtons suggestions={suggestions} onSelect={handleSend} />
        </div>
      ) : (
        <>
          <MessageList messages={messages} streamingId={streamingId} />
          {!isStreaming && (
            <SuggestionButtons suggestions={suggestions} onSelect={handleSend} />
          )}
        </>
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-2 text-sm text-destructive text-center">
          {error}
        </div>
      )}

      {/* Input */}
      <ChatInput onSend={handleSend} disabled={isStreaming || !sessionId} />
    </div>
  );
}
