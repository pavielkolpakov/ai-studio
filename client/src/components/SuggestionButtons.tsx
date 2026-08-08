import { openCalendlyPopup } from "@/lib/calendly";

export interface SuggestionItem {
  text: string;
  action?: "send" | "calendly" | "ideas-prompt";
  cacheKey?: string;
  id?: string;
}

interface Props {
  suggestions: SuggestionItem[];
  onSelect: (message: string) => void;
  onIdeasPrompt: () => void;
  onCached?: (cacheKey: string, text: string) => void;
  onClicked?: (id: string) => void;
  sessionId?: string | null;
}

export function SuggestionButtons({ suggestions, onSelect, onIdeasPrompt, onCached, onClicked, sessionId }: Props) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {suggestions.map((s) => {
        const action = s.action ?? "send";
        const handleClick = () => {
          if (s.id && onClicked) onClicked(s.id);
          if (s.cacheKey && onCached) onCached(s.cacheKey, s.text);
          else if (action === "calendly") openCalendlyPopup(sessionId);
          else if (action === "ideas-prompt") onIdeasPrompt();
          else onSelect(s.text);
        };
        return (
          <button
            key={s.text}
            onClick={handleClick}
            className={
              action === "calendly"
                ? "btn-primary cursor-pointer px-4 py-[9px] text-[13.5px]"
                : "cursor-pointer rounded-lg border border-white/[0.11] bg-surface px-4 py-[9px] text-[13.5px] text-body-text transition-colors hover:border-white/30 hover:text-foreground"
            }
          >
            {s.text}
          </button>
        );
      })}
    </div>
  );
}
