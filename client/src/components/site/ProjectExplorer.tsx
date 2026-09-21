import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, FileSearch, Headphones, Workflow, AudioLines, Network } from "lucide-react";
import { PROJECT_SHOWCASE } from "@/data/projectShowcase";
import { Reveal } from "./Reveal";

const icons = { search: FileSearch, support: Headphones, workflow: Workflow, voice: AudioLines, infrastructure: Network };

export function ProjectExplorer() {
  const [selected, setSelected] = useState(0);
  const reduce = useReducedMotion();
  const project = PROJECT_SHOWCASE[selected];
  const Icon = icons[project.icon as keyof typeof icons];
  return <section className="design-section" id="possibilities" aria-labelledby="projects-title">
    <Reveal className="section-intro"><p className="studio-kicker">What we can build</p><h2 id="projects-title">Real problems.<br />Thoughtfully engineered answers.</h2><p>Explore the kinds of systems in our project library. Each one starts with a business problem.</p></Reveal>
    <div className="project-selector" aria-label="Project categories">{PROJECT_SHOWCASE.map((item, index) => <button key={item.name} aria-pressed={index === selected} onClick={() => setSelected(index)}>{item.name}</button>)}</div>
    <div className={`project-explorer tone-${project.color}`}>
      <div className="project-visual dot-field">
        <Icon className="project-symbol" strokeWidth={0.65} aria-hidden="true" />
        <ol className="workflow-diagram" aria-label="Example workflow">{project.flow.map((step, index) => <li key={step}><span>{step}</span>{index < 2 && <ArrowRight size={16} aria-hidden="true" />}</li>)}</ol>
      </div>
      <div className="project-detail">
        <AnimatePresence mode="wait" initial={false}><motion.div key={project.name} initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.2 }} aria-live="polite">
          <h3>{project.title}</h3><p>{project.description}</p>
          <ul>{project.details.map(detail => <li key={detail}><Check size={16} aria-hidden="true" />{detail}</li>)}</ul>
          <p className="project-measure">{project.measure}</p>
        </motion.div></AnimatePresence>
        <div className="project-controls"><Link to="/pricing#ai-implementation" className="studio-text-link">Discuss a system like this <ArrowUpRight size={17} /></Link><div><button className="icon-button" aria-label="Previous project" onClick={() => setSelected((selected + PROJECT_SHOWCASE.length - 1) % PROJECT_SHOWCASE.length)}><ArrowLeft size={18} /></button><button className="icon-button" aria-label="Next project" onClick={() => setSelected((selected + 1) % PROJECT_SHOWCASE.length)}><ArrowRight size={18} /></button></div></div>
      </div>
    </div>
  </section>;
}
