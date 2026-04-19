import { useEffect, useRef, type ReactNode } from "react";
import type { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
  streamingId: string | null;
  searchingId: string | null;
  searchingTool: string | null;
  footer?: ReactNode;
}

export function MessageList({
  messages,
  streamingId,
  searchingId,
  searchingTool,
  footer,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const userMsgRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastScrolledUserId = useRef<string | null>(null);

  const lastUserId = [...messages].reverse().find((m) => m.role === "user")?.id ?? null;

  useEffect(() => {
    if (!lastUserId || lastUserId === lastScrolledUserId.current) return;
    const el = userMsgRefs.current.get(lastUserId);
    const container = containerRef.current;
    if (!el || !container) return;
    const top = el.offsetTop - container.offsetTop;
    container.scrollTo({ top, behavior: "smooth" });
    lastScrolledUserId.current = lastUserId;
  }, [lastUserId]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="flex flex-col min-h-full px-4 py-6 max-w-3xl mx-auto w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            ref={(el) => {
              if (msg.role !== "user") return;
              if (el) userMsgRefs.current.set(msg.id, el);
              else userMsgRefs.current.delete(msg.id);
            }}
          >
            <MessageBubble
              message={msg}
              isStreaming={msg.id === streamingId}
              searchingTool={msg.id === searchingId ? searchingTool : null}
            />
          </div>
        ))}
        {footer && <div className="mt-auto pt-4">{footer}</div>}
      </div>
    </div>
  );
}
