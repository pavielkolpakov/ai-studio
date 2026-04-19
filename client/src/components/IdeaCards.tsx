import type { Idea } from "@/types/chat";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { openCalendlyPopup } from "@/lib/calendly";

interface Props {
  ideas: Idea[];
}

export function IdeaCards({ ideas }: Props) {
  if (!ideas.length) return null;

  return (
    <div className="mt-4 flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {ideas.map((idea, i) => (
          <Card key={i} size="sm">
            <CardHeader>
              <CardTitle>{idea.title}</CardTitle>
              <CardDescription>{idea.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {idea.deliverables.length > 0 && (
                <ul className="list-disc space-y-0.5 pl-4 text-sm text-foreground/90">
                  {idea.deliverables.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              )}
              {idea.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {idea.tech.map((t, j) => (
                    <span
                      key={j}
                      className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-foreground/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>
                  <span className="text-foreground/80">Estimate:</span> {idea.price_range}
                </span>
                <span>
                  <span className="text-foreground/80">Timeline:</span> {idea.time_estimate}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <button
        type="button"
        onClick={() => openCalendlyPopup()}
        className="self-start rounded-full bg-gradient-to-r from-[#f5a623] to-[#f57202] px-4 py-2 text-sm font-medium text-black transition hover:brightness-110"
      >
        Book a call to discuss
      </button>
    </div>
  );
}
