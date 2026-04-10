import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatMessage, CTA } from "@/types/chat";
import { createSession, sendMessage } from "@/api/chat";
import { TokenQueue } from "@/lib/tokenQueue";
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

interface SuggestionItem {
  text: string;
  isCTA?: boolean;
}

function getSuggestions(cta: CTA | null | undefined): SuggestionItem[] {
  const items: SuggestionItem[] = [];

  if (cta?.url) {
    const topic = cta.url.replace("/", "");
    const texts = topic in TOPIC_SUGGESTIONS ? TOPIC_SUGGESTIONS[topic] : DEFAULT_FOLLOWUPS;
    items.push(...texts.map((t) => ({ text: t })));
  } else {
    items.push(...DEFAULT_FOLLOWUPS.map((t) => ({ text: t })));
  }

  if (cta) {
    items.push({ text: cta.label || "Book a Call", isCTA: true });
  }

  return items;
}

export function ChatPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>(
    INITIAL_SUGGESTIONS.map((t) => ({ text: t }))
  );
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const queueRef = useRef<TokenQueue | null>(null);

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

      let pendingCta: CTA | null | undefined = null;

      const queue = new TokenQueue((token) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: m.content + token }
              : m
          )
        );
      });
      queueRef.current = queue;

      try {
        await sendMessage(
          sessionId,
          text,
          (event) => {
            if (!event.done) {
              queue.push(event.token);
            } else {
              pendingCta = event.cta;
              queue.finish();

              // Wait for queue to drain before showing suggestions
              const checkDrained = () => {
                if (queue.isDrained) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, cta: pendingCta }
                        : m
                    )
                  );
                  setSuggestions(getSuggestions(pendingCta));
                  setIsStreaming(false);
                  setStreamingId(null);
                } else {
                  setTimeout(checkDrained, 50);
                }
              };
              checkDrained();
            }
          },
          controller.signal
        );
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
        queue.destroy();
        setIsStreaming(false);
        setStreamingId(null);
      } finally {
        abortRef.current = null;
        queueRef.current = null;
      }
    },
    [sessionId, isStreaming]
  );

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    queueRef.current?.destroy();
  }, []);

  return (
    <div className="flex flex-col h-dvh">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 shrink-0">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold">Neuronetis</h1>
          <button
            onClick={() => console.log("Contact Us clicked")}
            className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground hover:bg-accent transition-colors"
          >
            Contact Us
          </button>
        </div>
      </header>

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">
            Production AI for IT companies
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-lg">
            Custom AI development for tech companies. RAG, semantic search, AI Agents integration, fine-tuning.
          </p>
          <SuggestionButtons suggestions={suggestions} onSelect={handleSend} />
        </div>
      ) : (
        <>
          <MessageList messages={messages} streamingId={streamingId} />
          {!isStreaming && suggestions.length > 0 && (
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
      <div className="max-w-3xl mx-auto w-full">
        <ChatInput
          onSend={handleSend}
          onStop={handleStop}
          disabled={!sessionId}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
