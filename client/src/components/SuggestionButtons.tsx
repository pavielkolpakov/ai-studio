interface Props {
  suggestions: string[];
  onSelect: (message: string) => void;
}

export function SuggestionButtons({ suggestions, onSelect }: Props) {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center px-4 pb-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-accent hover:border-primary/30 transition-colors"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
