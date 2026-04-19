import { useState, useRef, useEffect, type KeyboardEvent } from "react";

interface Props {
  onSend: (message: string) => void;
  onStop: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

export function ChatInput({ onSend, onStop, disabled, isStreaming }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled && !isStreaming) textareaRef.current?.focus();
  }, [disabled, isStreaming]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isStreaming) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 150) + "px";
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="relative flex items-end rounded-2xl bg-[#2f2f2f] px-4 py-4">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            handleInput();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask about Neuronetis..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent text-base sm:text-sm leading-6 min-h-[36px] text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50 self-center"
        />
        {isStreaming ? (
          <button
            onClick={onStop}
            className="cursor-pointer ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white transition-colors hover:bg-white/80"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#212121"
              className="h-5 w-5"
            >
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={disabled || !value.trim()}
            className="disabled:cursor-default cursor-pointer ml-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white transition-colors hover:bg-white/80 disabled:opacity-30 disabled:hover:bg-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#212121"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
