import { useState } from "react";
import type { Source } from "@/types/chat";

interface Props {
  sources: Source[];
}

export function SourcesList({ sources }: Props) {
  const [open, setOpen] = useState(false);

  if (sources.length === 0) return null;

  return (
    <div className="mt-3 border-t border-border/50 pt-2">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        {open ? "Hide" : "Show"} sources ({sources.length})
      </button>
      {open && (
        <ul className="mt-1 space-y-1">
          {sources.map((s, i) => (
            <li key={i} className="text-xs text-muted-foreground">
              {s.header || s.source}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
