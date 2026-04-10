interface SuggestionItem {
  text: string;
  isCTA?: boolean;
}

interface Props {
  suggestions: SuggestionItem[];
  onSelect: (message: string) => void;
}

export function SuggestionButtons({ suggestions, onSelect }: Props) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center px-4 pb-2">
      {suggestions.map((s) => (
        <button
          key={s.text}
          onClick={() => onSelect(s.text)}
          className={
            s.isCTA
              ? "cta-gradient-pill cursor-pointer px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-foreground transition-colors hover:brightness-110"
              : "cursor-pointer rounded-full border border-border bg-[#2f2f2f] px-3 py-1.5 text-xs sm:px-4 sm:py-2 sm:text-sm text-foreground hover:bg-[#3a3a3a] transition-colors"
          }
        >
          {s.text}
        </button>
      ))}
    </div>
  );
}
