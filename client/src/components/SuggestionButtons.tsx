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
    <div className="flex flex-wrap gap-2 justify-center px-4 pb-2">
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
                ? "cta-gradient-pill cursor-pointer px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-foreground transition-colors hover:brightness-110"
                : "cursor-pointer rounded-full border border-border bg-[#2f2f2f] px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-foreground hover:bg-[#3a3a3a] transition-colors"
            }
          >
            {s.text}
          </button>
        );
      })}
    </div>
  );
}
