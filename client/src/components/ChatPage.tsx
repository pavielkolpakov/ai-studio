import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import type { ChatMessage, FollowupPick, Idea } from "@/types/chat";
import { createSession, sendMessage } from "@/api/chat";
import { TokenQueue } from "@/lib/tokenQueue";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { SuggestionButtons, type SuggestionItem } from "./SuggestionButtons";
import { StudioLanding } from "./home/StudioLanding";
import { CACHED_ANSWERS } from "@/data/cachedAnswers";

const IDEAS_PROMPT_TEXT =
  "Tell us about your company to get tailored AI project ideas. Useful to include: what your product does in a sentence or two, who your users are, what data you have (kind, rough volume, where it lives), what your users complain about most, what your support team gets asked most often, what your internal team does manually that they wish was automated, and any AI features your competitors have shipped.";

/** Shown after the ideas prompt — the hero itself starts with no chips. */
const TOPIC_SUGGESTIONS: SuggestionItem[] = [
  { text: "Services & pricing", cacheKey: "services_and_pricing" },
  { text: "What's the process like", cacheKey: "process" },
  { text: "About Neuronetis", cacheKey: "about" },
];

const BOOK_A_CALL: SuggestionItem = { id: "book_call", text: "Book a call", action: "calendly" };

function applyFollowupRules(
  picks: FollowupPick[] | undefined,
  clickedIds: Set<string>,
  hasIdeas = false
): SuggestionItem[] {
  const filtered: SuggestionItem[] = (picks ?? [])
    .filter((p) => !clickedIds.has(p.id))
    .map((p) => ({ id: p.id, text: p.text, cacheKey: p.cacheKey, action: p.action }));
  // When idea cards are shown, the audit CTA block below them is the only CTA
  if (hasIdeas) return filtered.filter((s) => s.action !== "calendly");
  const hasBookCall = filtered.some((s) => s.action === "calendly");
  if (filtered.length < 2 && !hasBookCall) filtered.push(BOOK_A_CALL);
  return filtered;
}

export function ChatPage() {
  const [showLanding, setShowLanding] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [searching, setSearching] = useState<{ id: string; tool: string } | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const [clickedIds, setClickedIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const queueRef = useRef<TokenQueue | null>(null);
  const sessionRequested = useRef(false);

  useEffect(() => {
    if (sessionRequested.current) return;
    sessionRequested.current = true;
    createSession()
      .then(setSessionId)
      .catch(() => setError("Live replies are unavailable right now. You can still read our saved answers."));
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
      setShowLanding(false);
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
      setShowLanding(false);
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
        setSuggestions(TOPIC_SUGGESTIONS);
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
    <div role="status" className="chat-error">{error}</div>
  ) : null;

  return (
    <>
      {messages.length === 0 || showLanding ? (
        <StudioLanding>
          <ChatInput
            onSend={handleSend}
            onStop={handleStop}
            disabled={!sessionId}
            isStreaming={isStreaming}
            autoFocus={false}
            variant="idea"
            placeholder="What does your business do, and what would you love to improve?"
          />
          {errorLine}
          <div className="scanner-shortcuts">
            {messages.length > 0 && <button onClick={() => setShowLanding(false)}>Continue conversation <ArrowUpRight className="inline" size={13} /></button>}
            <button disabled={isStreaming} onClick={() => handleCachedAnswer("services_and_pricing", "Services & pricing")}>Services & pricing</button>
            <button disabled={isStreaming} onClick={() => handleCachedAnswer("process", "What’s the process like?")}>How we work</button>
            <button disabled={isStreaming} onClick={() => handleCachedAnswer("about", "About Neuronetis")}>About the studio</button>
          </div>
        </StudioLanding>
      ) : (
        <main className="chat-workspace">
          <div className="chat-toolbar"><div><span className="chat-emblem"><Sparkles size={19} aria-hidden="true" /></span><span>Your opportunity, explored.<small>Neuronetis · AI studio assistant</small></span></div><button onClick={() => setShowLanding(true)}><ArrowLeft size={14} />Back to the studio</button></div>
          <MessageList
            messages={messages}
            streamingId={streamingId}
            searchingId={searching?.id ?? null}
            searchingTool={searching?.tool ?? null}
            footer={chips}
          />
          {errorLine}
          <div className="chat-composer">
            <ChatInput
              onSend={handleSend}
              onStop={handleStop}
              disabled={!sessionId}
              isStreaming={isStreaming}
              placeholder="Ask a follow-up…"
            />
            <p className="composer-disclaimer">A starting point for exploration. Our engineers validate the details.</p>
          </div>
        </main>
      )}
    </>
  );
}
