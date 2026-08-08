import { useState, useRef, useEffect, type KeyboardEvent } from "react";

interface Props {
  onSend: (message: string) => void;
  onStop: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  onStop,
  disabled,
  isStreaming,
  placeholder = "Ask about Neuronetis...",
}: Props) {
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
    <div className="relative flex items-end gap-4 rounded-[14px] border border-hairline-strong bg-surface-raised p-1.5 pl-[22px]">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleInput();
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="min-h-[36px] flex-1 resize-none self-center bg-transparent py-1 text-base leading-6 text-foreground placeholder:text-dim-text focus:outline-none disabled:opacity-50"
      />
      {isStreaming ? (
        <button
          onClick={onStop}
          aria-label="Stop generating"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[9px] bg-[#F4F4F5] transition-colors hover:bg-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#0B0B0C"
            className="h-5 w-5"
          >
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        </button>
      ) : (
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-[9px] bg-[#F4F4F5] transition-colors hover:bg-white disabled:cursor-default disabled:opacity-30 disabled:hover:bg-[#F4F4F5]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0B0B0C"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px]"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
