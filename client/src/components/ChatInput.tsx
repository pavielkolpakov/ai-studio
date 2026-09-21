import { ArrowUp, Square, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, type KeyboardEvent } from "react";

interface Props {
  onSend: (message: string) => void;
  onStop: () => void;
  disabled?: boolean;
  isStreaming?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  variant?: "chat" | "idea";
}

export function ChatInput({
  onSend,
  onStop,
  disabled,
  isStreaming,
  autoFocus = true,
  variant = "chat",
  placeholder = "Ask about Neuronetis...",
}: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && !disabled && !isStreaming) textareaRef.current?.focus();
  }, [autoFocus, disabled, isStreaming]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isStreaming) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
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
    <div className={`chat-input-shell ${variant === "idea" ? "idea-composer" : "conversation-composer"}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => { setValue(e.target.value); handleInput(); }}
        onKeyDown={handleKeyDown}
        aria-label={variant === "idea" ? "Describe your business for AI ideas" : "Your message"}
        placeholder={placeholder}
        rows={variant === "idea" ? 2 : 1}
        className="composer-textarea"
      />
      <div className="composer-actions">
        {variant === "idea" && <span className="composer-hint"><Sparkles size={14} aria-hidden="true" /> AI opportunity scanner</span>}
        {isStreaming ? (
          <button type="button" onClick={onStop} aria-label="Stop generating" className="composer-send"><Square size={15} fill="currentColor" /></button>
        ) : (
          <button type="button" onClick={handleSend} disabled={disabled || !value.trim()} aria-label={variant === "idea" ? "Generate AI ideas" : "Send message"} className="composer-send">
            {variant === "idea" && <span>Find ideas</span>}<ArrowUp size={18} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
