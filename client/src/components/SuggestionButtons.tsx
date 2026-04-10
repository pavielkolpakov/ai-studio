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
    <div className="flex gap-2 justify-center px-4 pb-2 overflow-x-auto">
      {suggestions.map((s) => (
        <button
          key={s.text}
          onClick={() => onSelect(s.text)}
          className={
            s.isCTA
              ? "cta-gradient-pill shrink-0 px-4 py-2 text-sm text-foreground transition-colors hover:brightness-110"
              : "shrink-0 rounded-full border border-border bg-[#2f2f2f] px-4 py-2 text-sm text-foreground hover:bg-[#3a3a3a] transition-colors"
          }
        >
          {s.text}
        </button>
      ))}
    </div>
  );
}
