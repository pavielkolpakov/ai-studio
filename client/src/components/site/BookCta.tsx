import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";

export function BookCta() {
  return <section className="design-section"><Reveal className="closing-panel dot-field"><p className="studio-kicker">An idea is a good place to start</p><h2>Let’s see what’s<br />worth building.</h2><p>Describe your product or workflow. Explore where AI could make a meaningful difference.</p><Link to="/#scanner" className="studio-button">Find your AI opportunity <ArrowUpRight size={17} /></Link></Reveal></section>;
}
