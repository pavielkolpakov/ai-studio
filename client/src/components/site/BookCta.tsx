import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { openCalendlyPopup } from "@/lib/calendly";

export function BookCta() {
  return <section className="design-section"><Reveal className="closing-panel dot-field"><p className="studio-kicker">An idea is a good place to start</p><h2>Let’s see what’s<br />worth building.</h2><p>Describe your product or workflow. Explore where AI could make a meaningful difference.</p><div className="scanner-actions"><Link to="/#scanner" className="studio-button">Explore your AI opportunity <ArrowUpRight size={17} /></Link><button type="button" className="studio-button engineer-button" onClick={() => openCalendlyPopup()}>Talk to AI Engineer <ArrowUpRight size={17} aria-hidden="true" /></button></div></Reveal></section>;
}
