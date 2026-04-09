import Markdown from "react-markdown";
import type { ChatMessage } from "@/types/chat";
import { SourcesList } from "./SourcesList";
import { CTABanner } from "./CTABanner";

interface Props {
  message: ChatMessage;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <Markdown>{message.content}</Markdown>
        </div>
        {isStreaming && !message.content && (
          <span className="inline-block animate-pulse">Thinking...</span>
        )}
        {!isStreaming && message.sources && message.sources.length > 0 && (
          <SourcesList sources={message.sources} />
        )}
        {!isStreaming && message.cta && <CTABanner cta={message.cta} />}
      </div>
    </div>
  );
}
