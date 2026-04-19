import type { Idea } from "@/types/chat";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Props {
  ideas: Idea[];
}

export function IdeaCards({ ideas }: Props) {
  if (!ideas.length) return null;

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-rows-[auto_auto_auto_auto] md:[&>*]:row-span-4 md:[&>*]:grid md:[&>*]:grid-rows-subgrid">
      {ideas.map((idea, i) => (
          <Card
            key={i}
            className="idea-card-reveal gap-5 py-6"
            style={{ animationDelay: `${250 + i * 80}ms` }}
          >
            <CardHeader className="gap-2 px-6">
              <CardTitle>{idea.title}</CardTitle>
              <CardDescription>{idea.description}</CardDescription>
            </CardHeader>
            {idea.deliverables.length > 0 ? (
              <ul className="list-disc space-y-0.5 px-6 pl-10 text-sm text-foreground/90">
                {idea.deliverables.map((d, j) => (
                  <li key={j}>{d}</li>
                ))}
              </ul>
            ) : (
              <div />
            )}
            {idea.tech.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 px-6">
                {idea.tech.map((t, j) => (
                  <span
                    key={j}
                    className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-muted-foreground ring-1 ring-foreground/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <div />
            )}
            <CardContent className="flex flex-wrap gap-x-4 gap-y-1 px-6 text-xs text-muted-foreground">
              <span>
                <span className="text-foreground/80">Estimate:</span> {idea.price_range}
              </span>
              <span>
                <span className="text-foreground/80">Timeline:</span> {idea.time_estimate}
              </span>
            </CardContent>
        </Card>
      ))}
    </div>
  );
}
