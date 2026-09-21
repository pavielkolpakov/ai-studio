import { Link } from "react-router-dom";
import { ArrowUpRight, Check, Clock3 } from "lucide-react";
import type { Idea } from "@/types/chat";

interface Props {
  ideas: Idea[];
}

export function IdeaCards({ ideas }: Props) {
  if (!ideas.length) return null;

  return (
    <div className="chat-opportunities">
      <div className="opportunity-list">
        {ideas.map((idea, i) => (
          <article
            key={i}
            className="opportunity-card idea-card-reveal"
            style={{ animationDelay: `${250 + i * 80}ms` }}
          >
            <header className="opportunity-heading">
              <span className="opportunity-number" aria-label={`Opportunity ${i + 1}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{idea.title}</h3>
            </header>
            <p className="opportunity-description">{idea.description}</p>
            {idea.deliverables.length > 0 && (
              <ul className="opportunity-deliverables">
                {idea.deliverables.map((deliverable, j) => (
                  <li key={j}><Check size={15} aria-hidden="true" /><span>{deliverable}</span></li>
                ))}
              </ul>
            )}
            <footer className="opportunity-meta">
              {idea.tech.length > 0 && (
                <ul className="opportunity-tech" aria-label="Technologies">
                  {idea.tech.map((tech, j) => <li key={j}>{tech}</li>)}
                </ul>
              )}
              <div className="opportunity-timeline">
                <Clock3 size={14} aria-hidden="true" />
                <span><span className="timeline-label">Indicative timeline</span>{idea.time_estimate}</span>
              </div>
            </footer>
          </article>
        ))}
      </div>

      <div
        className="opportunity-next-step idea-card-reveal"
        style={{ animationDelay: `${250 + ideas.length * 80}ms` }}
      >
        <p>Want to know which opportunities actually make sense for your systems?</p>
        <Link to="/pricing#ai-audit" className="opportunity-audit-link">
          Book an AI Audit <ArrowUpRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
