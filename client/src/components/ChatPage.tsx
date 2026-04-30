import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatMessage, CTA, Idea } from "@/types/chat";
import { createSession, sendMessage } from "@/api/chat";
import { TokenQueue } from "@/lib/tokenQueue";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SuggestionButtons } from "./SuggestionButtons";
import { ContactModal } from "./ContactModal";

const INITIAL_SUGGESTIONS = [
  "What do you build?",
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

function getSuggestions(
  cta: CTA | null | undefined,
  hasIdeas = false
): SuggestionItem[] {
  const items: SuggestionItem[] = [];

  if (cta?.url) {
    const topic = cta.url.replace("/", "");
    const texts = topic in TOPIC_SUGGESTIONS ? TOPIC_SUGGESTIONS[topic] : DEFAULT_FOLLOWUPS;
    items.push(...texts.map((t) => ({ text: t })));
  } else {
    items.push(...DEFAULT_FOLLOWUPS.map((t) => ({ text: t })));
  }

  if (hasIdeas) {
    items.push({ text: "Book a call to discuss", isCTA: true });
  } else if (cta) {
    items.push({ text: cta.label || "Book a Call", isCTA: true });
  }

  return items;
}

export function ChatPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [searching, setSearching] = useState<{ id: string; tool: string } | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>(
    INITIAL_SUGGESTIONS.map((t) => ({ text: t }))
  );
  const [error, setError] = useState<string | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const queueRef = useRef<TokenQueue | null>(null);
  const sessionRequested = useRef(false);

  useEffect(() => {
    if (sessionRequested.current) return;
    sessionRequested.current = true;
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
      let pendingIdeas: Idea[] | null = null;

      const queue = new TokenQueue((token) => {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== assistantId) return m;
            if (m.content === "") setSearching(null);
            return { ...m, content: m.content + token };
          })
        );
      });
      queueRef.current = queue;

      try {
        await sendMessage(
          sessionId,
          text,
          (event) => {
            if (event.type === "tool_call") {
              setSearching({ id: assistantId, tool: event.tool });
            } else if (event.type === "ideas") {
              pendingIdeas = event.ideas;
            } else if (event.type === "token") {
              queue.push(event.token);
            } else if (event.type === "done") {
              pendingCta = event.cta;
              queue.finish();

              // Wait for queue to drain before showing suggestions
              const checkDrained = () => {
                if (queue.isDrained) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, cta: pendingCta, ideas: pendingIdeas ?? undefined }
                        : m
                    )
                  );
                  setSuggestions(getSuggestions(pendingCta, !!pendingIdeas?.length));
                  setIsStreaming(false);
                  setStreamingId(null);
                  setSearching(null);
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
        setSearching(null);
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
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      const next =
        last?.role === "assistant" && last.content === ""
          ? prev.slice(0, -1)
          : prev;
      const lastAssistant = [...next]
        .reverse()
        .find((m) => m.role === "assistant" && (m.cta || m.ideas?.length));
      setSuggestions(
        lastAssistant
          ? getSuggestions(lastAssistant.cta, !!lastAssistant.ideas?.length)
          : INITIAL_SUGGESTIONS.map((t) => ({ text: t }))
      );
      return next;
    });
    setSearching(null);
  }, []);

  return (
    <div className="flex flex-col h-dvh">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold">Neuronetis</h1>
          <button
            onClick={() => setContactOpen(true)}
            className="cursor-pointer rounded-full border border-border px-4 py-1.5 text-sm text-foreground hover:bg-accent transition-colors"
          >
            Contact Us
          </button>
        </div>
      </header>

      <ContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        sessionId={sessionId}
      />

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center px-4 py-14 text-center">
          <h2 className="text-3xl font-bold mb-3">
            Production AI for IT companies
          </h2>
          <p className="text-m text-muted-foreground max-w-lg">
            AI Audits · Agents integrations · Software Development services.
          </p>
          <p className="py-2 text-m text-muted-foreground max-w-lg">
            Use this tool to get more information about our services and get costom suggestions for your company.
          </p>
        </div>
      ) : (
        <MessageList
          messages={messages}
          streamingId={streamingId}
          searchingId={searching?.id ?? null}
          searchingTool={searching?.tool ?? null}
          footer={
            !isStreaming && suggestions.length > 0 ? (
              <SuggestionButtons suggestions={suggestions} onSelect={handleSend} />
            ) : null
          }
        />
      )}

      {/* Error */}
      {error && (
        <div className="px-4 py-2 text-sm text-destructive text-center">
          {error}
        </div>
      )}

      {/* Suggestions + Input */}
      <div className="max-w-4xl mx-auto w-full">
        {!isStreaming && suggestions.length > 0 && messages.length === 0 && (
          <SuggestionButtons suggestions={suggestions} onSelect={handleSend} />
        )}
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
