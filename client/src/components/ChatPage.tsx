import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatMessage, FollowupPick, Idea } from "@/types/chat";
import { createSession, sendMessage } from "@/api/chat";
import { TokenQueue } from "@/lib/tokenQueue";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SuggestionButtons, type SuggestionItem } from "./SuggestionButtons";
import { ContactModal } from "./ContactModal";
import { CACHED_ANSWERS } from "@/data/cachedAnswers";

const IDEAS_PROMPT_TEXT =
  "Tell us about your company to get tailored AI project ideas. Useful to include: what your product does in a sentence or two, who your users are, what data you have (kind, rough volume, where it lives), what your users complain about most, what your support team gets asked most often, what your internal team does manually that they wish was automated, and any AI features your competitors have shipped.";

const INITIAL_SUGGESTIONS: SuggestionItem[] = [
  { text: "Services & pricing", cacheKey: "services_and_pricing" },
  { text: "What's the process like", cacheKey: "process" },
  { text: "About Neuronetis", cacheKey: "about" },
  { text: "Ideas for my project", action: "ideas-prompt" },
];

const BOOK_A_CALL: SuggestionItem = { id: "book_call", text: "Book a call", action: "calendly" };

function applyFollowupRules(
  picks: FollowupPick[] | undefined,
  clickedIds: Set<string>,
  forceBookCall = false
): SuggestionItem[] {
  const filtered: SuggestionItem[] = (picks ?? [])
    .filter((p) => !clickedIds.has(p.id))
    .map((p) => ({ id: p.id, text: p.text, cacheKey: p.cacheKey, action: p.action }));
  const hasBookCall = filtered.some((s) => s.action === "calendly");
  if (forceBookCall && !hasBookCall) filtered.push(BOOK_A_CALL);
  else if (filtered.length < 2 && !hasBookCall) filtered.push(BOOK_A_CALL);
  return filtered;
}

export function ChatPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [searching, setSearching] = useState<{ id: string; tool: string } | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>(INITIAL_SUGGESTIONS);
  const [clickedIds, setClickedIds] = useState<Set<string>>(new Set());
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

  const handleClickedId = useCallback((id: string) => {
    setClickedIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
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

      let pendingIdeas: Idea[] | null = null;
      let pendingFollowups: FollowupPick[] | undefined = undefined;

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
              pendingFollowups = event.followups;
              queue.finish();

              // Wait for queue to drain before showing suggestions
              const checkDrained = () => {
                if (queue.isDrained) {
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, ideas: pendingIdeas ?? undefined }
                        : m
                    )
                  );
                  setSuggestions(applyFollowupRules(pendingFollowups, clickedIds, pendingIdeas !== null));
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
    [sessionId, isStreaming, clickedIds]
  );

  const handleCachedAnswer = useCallback(
    (cacheKey: string, buttonText: string) => {
      if (isStreaming) return;
      const entry = CACHED_ANSWERS[cacheKey];
      if (!entry) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: buttonText,
      };
      const assistantId = crypto.randomUUID();
      const assistantMsg: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setSuggestions([]);
      setIsStreaming(true);
      setStreamingId(assistantId);

      const queue = new TokenQueue((token) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + token } : m
          )
        );
      });
      queueRef.current = queue;

      const tokens = entry.answer.match(/\S+\s*|\s+/g) ?? [entry.answer];
      tokens.forEach((t) => queue.push(t));
      queue.finish();

      const checkDrained = () => {
        if (queue.isDrained) {
          setIsStreaming(false);
          setStreamingId(null);
          setSuggestions(entry.followups);
          queueRef.current = null;
        } else {
          setTimeout(checkDrained, 50);
        }
      };
      checkDrained();
    },
    [isStreaming]
  );

  const handleIdeasPrompt = useCallback(() => {
    if (isStreaming) return;
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setSuggestions([]);
    setIsStreaming(true);
    setStreamingId(assistantId);

    const queue = new TokenQueue((token) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: m.content + token } : m
        )
      );
    });
    queueRef.current = queue;

    const tokens = IDEAS_PROMPT_TEXT.match(/\S+\s*|\s+/g) ?? [IDEAS_PROMPT_TEXT];
    tokens.forEach((t) => queue.push(t));
    queue.finish();

    const checkDrained = () => {
      if (queue.isDrained) {
        setIsStreaming(false);
        setStreamingId(null);
        setSuggestions(
          INITIAL_SUGGESTIONS.filter((s) => s.action !== "ideas-prompt")
        );
        queueRef.current = null;
      } else {
        setTimeout(checkDrained, 50);
      }
    };
    checkDrained();
  }, [isStreaming]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
    queueRef.current?.destroy();
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      return last?.role === "assistant" && last.content === ""
        ? prev.slice(0, -1)
        : prev;
    });
    setSuggestions([]);
    setSearching(null);
  }, []);

  const chips =
    !isStreaming && suggestions.length > 0 ? (
      <SuggestionButtons
        suggestions={suggestions}
        onSelect={handleSend}
        onIdeasPrompt={handleIdeasPrompt}
        onCached={handleCachedAnswer}
        onClicked={handleClickedId}
        sessionId={sessionId}
      />
    ) : null;

  const errorLine = error ? (
    <div className="px-4 py-2 text-center text-sm text-destructive">{error}</div>
  ) : null;

  return (
    <>
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} sessionId={sessionId} />

      {messages.length === 0 ? (
        /* Hero — the assistant is the entry point to the site */
        <div className="relative flex min-h-[calc(100dvh-73px)] items-center justify-center">
          <div className="pointer-events-none absolute inset-0 overflow-hidden select-none">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 880px 460px at 50% 34%, rgba(163,179,201,0.11), transparent 70%)",
              }}
            />
            <img
              src="/logo-mark.png"
              alt=""
              className="absolute top-1/2 left-1/2 h-[760px] w-auto max-w-none -translate-x-1/2 -translate-y-[52%] opacity-[0.055] blur-[2px]"
              style={{
                maskImage:
                  "radial-gradient(ellipse 58% 56% at 50% 46%, #000 0%, rgba(0,0,0,0.55) 55%, transparent 78%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 58% 56% at 50% 46%, #000 0%, rgba(0,0,0,0.55) 55%, transparent 78%)",
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-60"
              style={{
                background: "linear-gradient(180deg, rgba(11,11,12,0) 0%, #0B0B0C 92%)",
              }}
            />
          </div>

          <div className="relative w-full max-w-[1200px] px-5 py-16 sm:px-10">
            <div className="mx-auto mb-0 max-w-[780px] text-center">
              <div className="eyebrow mb-[26px]">AI engineering studio · Israel &amp; Europe</div>
              <h1 className="mb-[22px] font-heading text-[42px] leading-[1.03] font-semibold tracking-[-0.03em] text-balance sm:text-[54px] lg:text-[66px]">
                Production AI, shipped by engineers who own it
              </h1>
              <p className="mx-auto mb-11 max-w-[720px] text-[19px] leading-[1.55] text-pretty text-muted-foreground">
                RAG, agents, LLM features and evals infrastructure — built into your existing
                product, not bolted on. We take 3–4 projects a quarter so every one gets senior
                attention.
              </p>
            </div>

            <div className="mx-auto max-w-[820px]">
              <ChatInput
                onSend={handleSend}
                onStop={handleStop}
                disabled={!sessionId}
                isStreaming={isStreaming}
                placeholder="Describe what you're building…"
              />
              {errorLine}
              <div className="mt-[18px]">{chips}</div>
              <div className="mt-[22px] text-center font-mono text-[11.5px] tracking-[0.04em] text-dim-text">
                Scoped from our real delivery history — no form, no discovery call required
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100dvh-73px)] flex-col">
          <MessageList
            messages={messages}
            streamingId={streamingId}
            searchingId={searching?.id ?? null}
            searchingTool={searching?.tool ?? null}
            footer={chips}
          />
          {errorLine}
          <div className="mx-auto w-full max-w-[820px] px-5 pt-2 pb-5 sm:px-10">
            <ChatInput
              onSend={handleSend}
              onStop={handleStop}
              disabled={!sessionId}
              isStreaming={isStreaming}
            />
          </div>
        </div>
      )}
    </>
  );
}
