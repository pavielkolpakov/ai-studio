import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/types/chat";
import { MessageBubble } from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
  streamingId: string | null;
  searchingId: string | null;
  searchingTool: string | null;
}

export function MessageList({ messages, streamingId, searchingId, searchingTool }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, messages[messages.length - 1]?.content]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          isStreaming={msg.id === streamingId}
          searchingTool={msg.id === searchingId ? searchingTool : null}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
