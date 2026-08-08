import Markdown from "react-markdown";
import type { ChatMessage } from "@/types/chat";
import { IdeaCards } from "./IdeaCards";

interface Props {
  message: ChatMessage;
  isStreaming?: boolean;
  searchingTool?: string | null;
}

const INDICATOR_COPY: Record<string, string> = {
  read_knowledge_base: "Searching knowledge base...",
  generate_project_ideas: "Generating ideas...",
};

export function MessageBubble({ message, isStreaming, searchingTool }: Props) {
  const indicatorText = searchingTool ? INDICATOR_COPY[searchingTool] ?? "Thinking..." : "Thinking...";
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
      <div className="text-sm leading-relaxed text-foreground max-w-none [&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_strong]:font-semibold [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs [&_a]:underline [&_a]:text-primary">
        <Markdown>{message.content}</Markdown>
      </div>
      {message.ideas && message.ideas.length > 0 && <IdeaCards ideas={message.ideas} />}
      {isStreaming && !message.content && (
        <span className="inline-block text-sm text-muted-foreground animate-pulse">
          {indicatorText}
        </span>
      )}
    </div>
  );
}
