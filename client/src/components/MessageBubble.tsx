import Markdown from "react-markdown";
import type { ChatMessage } from "@/types/chat";

interface Props {
  message: ChatMessage;
  isStreaming?: boolean;
  isSearching?: boolean;
}

export function MessageBubble({ message, isStreaming, isSearching }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] rounded-2xl bg-[#2f2f2f] px-4 py-3 text-foreground">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        <Markdown>{message.content}</Markdown>
      </div>
      {isStreaming && !message.content && (
        <span className="inline-block text-sm text-muted-foreground animate-pulse">
          {isSearching ? "Searching knowledge base..." : "Thinking..."}
        </span>
      )}
    </div>
  );
}
