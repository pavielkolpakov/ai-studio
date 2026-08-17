import { Link } from "react-router-dom";
import type { Idea } from "@/types/chat";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

interface Props {
  ideas: Idea[];
}

export function IdeaCards({ ideas }: Props) {
  if (!ideas.length) return null;

  const lgCols = ideas.length >= 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

  return (
    <div>
      <div className={`mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 ${lgCols} md:grid-rows-[auto_auto_auto_auto] md:[&>*]:row-span-4 md:[&>*]:grid md:[&>*]:grid-rows-subgrid`}>
        {ideas.map((idea, i) => (
            <Card
              key={i}
              className="idea-card-reveal gap-5 py-6 transition-all duration-300 hover:-translate-y-0.5 hover:ring-foreground/20 hover:shadow-[0_16px_48px_-16px_rgba(212,175,55,0.18)]"
              style={{ animationDelay: `${250 + i * 80}ms` }}
            >
              <CardHeader className="gap-2 px-6">
                <div className="eyebrow">Opportunity {String(i + 1).padStart(2, "0")}</div>
                <CardTitle className="text-[17px] font-semibold tracking-[-0.01em]">
                  {idea.title}
                </CardTitle>
                <CardDescription>{idea.description}</CardDescription>
              </CardHeader>
              {idea.deliverables.length > 0 ? (
                <ul className="space-y-1.5 px-6 text-sm text-foreground/90">
                  {idea.deliverables.map((d, j) => (
                    <li key={j} className="flex gap-2.5">
                      <span
                        aria-hidden
                        className="mt-[8px] h-[5px] w-[5px] shrink-0 rotate-45 bg-gold/70"
                      />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div />
              )}
              {idea.tech.length > 0 ? (
                <div className="flex flex-wrap content-start items-start gap-1.5 px-6">
                  {idea.tech.map((t, j) => (
                    <span
                      key={j}
                      className="rounded-md border border-hairline bg-white/[0.03] px-2 py-[3px] font-mono text-[11px] text-dim-text"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : (
                <div />
              )}
              <CardFooter className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hairline bg-white/[0.02] px-6 py-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim-text">
                    Indicative timeline
                  </div>
                  <div className="mt-0.5 text-[13px] font-medium text-foreground/90 tabular-nums">
                    {idea.time_estimate}
                  </div>
                </div>
              </CardFooter>
          </Card>
        ))}
      </div>

      <div className="idea-card-reveal mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline bg-surface px-6 py-5" style={{ animationDelay: `${250 + ideas.length * 80}ms` }}>
        <p className="m-0 text-[15px] leading-[1.5] text-pretty text-body-text">
          Want to know which opportunities actually make sense for your systems?
        </p>
        <Link
          to="/audit"
          className="btn-primary shrink-0 px-5 py-2.5 text-[14px]"
        >
          Book an AI Audit
        </Link>
      </div>
    </div>
  );
}
