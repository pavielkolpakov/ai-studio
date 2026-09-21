import { useSyncExternalStore } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight, Check, Plus } from "lucide-react";
import { PRICING_PAGE } from "@/data/site";
import { openCalendlyPopup } from "@/lib/calendly";
import { Reveal } from "@/components/site/Reveal";
import { ImpactCalculator } from "@/components/site/ImpactCalculator";

const clean = (text: string) => text.replaceAll(" — ", ", ").replaceAll("–", "-");
// Buyer questions drawn from docs/RAG.md, sections 3, 4, 11, 12, and 15.
const FAQS = [
  { q: "What do we receive from an audit?", a: "A prioritized opportunity map, technical recommendations, success criteria, risks, dependencies, and a roadmap. The assessment uses your product, workflows, data, and existing systems." },
  { q: "Do we need an audit before implementation?", a: "No. If your requirements and technical direction are clear, we can scope implementation directly. An audit is useful when the opportunity or approach still needs validation." },
  { q: "How is implementation priced?", a: "We publish starting points, then prepare a proposal around the actual scope. Data, integrations, quality requirements, security, and deployment constraints determine the work. We prefer a fixed scope when the requirements support it." },
  { q: "Who owns the code?", a: "You do. We provide the technical documentation, deployment instructions, and operational guidance your team needs to understand, operate, and extend the system." },
  { q: "Can you work with our existing product?", a: "Yes. We integrate with existing products and infrastructure wherever practical. We can also review an AI system you already run or build a new AI-native system." },
  { q: "Can sensitive data stay on our infrastructure?", a: "We can design for private cloud or self-hosted models when the project requires it, work under NDA, and implement the technical controls specified by your security team. The deployment approach is agreed during scoping." },
  { q: "How do you know the AI is working?", a: "We define success criteria, use representative evaluation examples, and monitor production behavior. The right measures depend on the task: answer quality, retrieval relevance, latency, cost, or escalation accuracy." },
  { q: "What happens after handover?", a: "Your team can operate and extend the system. If useful, continue with ongoing AI engineering for new capabilities, evaluation, infrastructure, and optimization." },
];
// Static HTML has no URL fragment; defer fragment-dependent content until hydration.
const subscribeHydration = () => () => {};

const services = [PRICING_PAGE.audit, PRICING_PAGE.implementation, PRICING_PAGE.optimization];

export function PricingPage() {
  const { hash } = useLocation();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const selected = hydrated ? Math.max(0, services.findIndex(service => `#${service.id}` === hash)) : 0;
  const service = services[selected];
  const reduce = useReducedMotion();
  return <main className="design-page pricing-page">
    <header className="design-hero pricing-hero dot-field">
      <Reveal><p className="studio-kicker">Pricing & engagements</p><h1>The right scope.<br />A clear way forward.</h1><p>Start with the question you need answered. We scope the engineering around a defined outcome.</p><Link className="studio-button" to="/pricing#engagements">Explore engagements <ArrowDownIcon /></Link></Reveal>
      <div className="pricing-art"><img src="/images/optical-layers.jpg" alt="Precisely layered optical glass, an abstract study of systems engineering" width="1536" height="1024" fetchPriority="high" /></div>
    </header>

    <section className="design-section engagement-section" id="engagements" aria-labelledby="engagement-title">
      <div className="service-anchors" aria-hidden="true">{services.map(item => <span key={item.id} id={item.id} />)}</div>
      <div className="section-intro"><h2 id="engagement-title">Where are you with AI?</h2><p>Choose your starting point. An audit is optional when the requirements are already clear.</p></div>
      <nav className="engagement-selector" aria-label="Choose an engagement">{PRICING_PAGE.paths.map((path, index) => <Link key={path.service} to={`/pricing${path.href}`} aria-current={selected === index ? "true" : undefined}><span>{path.situation}</span><strong>{path.answer}</strong><small>{path.service}</small><ArrowUpRight size={22} /></Link>)}</nav>
      <AnimatePresence mode="wait" initial={false}><motion.div key={service.id} className={`engagement-detail engagement-${selected}`} initial={{ opacity: 0, y: reduce ? 0 : 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : .2 }}>
        <div className="engagement-lead"><span className="studio-kicker">{selected === 0 ? "Clarity before commitment" : selected === 1 ? "From validated idea to production" : "Make what runs work better"}</span><h3>{service.title}</h3><p>{clean(service.lead)}</p><div className="engagement-price">{service.price}</div><p className="price-caption">{selected === 0 ? "One-week audit. Broader assessments scoped separately." : "Starting point. Final proposal follows technical scoping."}</p><button className="studio-button" onClick={() => openCalendlyPopup()}>{service.cta}<ArrowUpRight size={17} /></button></div>
        <div className="engagement-includes">
          <h4>{selected === 0 ? "A roadmap you can act on" : selected === 1 ? "Built around your existing system" : "Measure. Improve. Repeat."}</h4>
          {selected === 0 ? <><ul className="included-list">{PRICING_PAGE.audit.deliverables.map(item => <li key={item.title}><Check size={17} /><span><strong>{item.title}</strong><small>{clean(item.body)}</small></span></li>)}</ul><details className="scope-details"><summary>Audit options and scope <Plus size={16} /></summary>{PRICING_PAGE.audit.options.map(option => <p key={option.name}><strong>{option.name} · {option.price}</strong><br />{option.body}</p>)}<p>We assess product workflows, data readiness, infrastructure, feasibility, business impact, and risk.</p></details></> : selected === 1 ? <><ul className="included-list">{PRICING_PAGE.implementation.tiers.map(item => <li key={item.name}><Check size={17} /><span><strong>{item.name}<em>{item.price}</em></strong><small>{item.body}</small></span></li>)}</ul><p className="scope-copy">Your scope accounts for integrations, data, infrastructure, quality requirements, security, and deployment complexity. A model API, RAG, or an agent is chosen to fit the problem.</p><div className="tag-list">{["Your repository", "Early staging", "Evaluation", "Documented handover"].map(item => <span key={item}>{item}</span>)}</div></> : <><p className="scope-copy">Review the system you already run. Establish a baseline, address the bottlenecks, and evaluate the changes against real tasks.</p><ul className="included-list">{["Output quality and retrieval", "Latency and operating cost", "Evaluation and observability", "Reliability and failure handling", "Architecture and maintainability"].map(item => <li key={item}><Check size={17} /><span>{item}</span></li>)}</ul></>}
        </div>
      </motion.div></AnimatePresence>
      <p className="audit-note">Selected strategic companies may receive an audit at no cost. This is a selective outreach program, not a standing offer.</p>
    </section>

    <ImpactCalculator />

    <section className="design-section" aria-labelledby="ongoing-title"><Reveal className="ongoing-panel"><div><p className="studio-kicker">Beyond the first release</p><h2 id="ongoing-title">Keep making<br />the system better.</h2><p>Continue with a standing engineering capacity for new features, integrations, evaluations, and production improvements.</p></div><div className="ongoing-price"><span>Ongoing AI Engineering</span><strong>From $3,000<small>/month</small></strong><p>Optional, scoped to the work ahead.</p><button className="studio-text-link" onClick={() => openCalendlyPopup()}>Discuss ongoing support <ArrowUpRight size={17} /></button></div></Reveal></section>

    <section className="design-section faq-section" aria-labelledby="faq-title"><div className="section-intro"><h2 id="faq-title">Good questions.<br />Straight answers.</h2><p>What to know before we work together.</p></div><div className="faq-list">{FAQS.map(item => <details key={item.q}><summary>{item.q}<Plus size={20} /></summary><p>{clean(item.a)}</p></details>)}</div></section>
    <section className="design-section page-closing"><h2>Let’s find your<br />next useful move.</h2><div className="scanner-actions"><Link to="/#scanner" className="studio-button">Explore your AI opportunity <ArrowUpRight size={17} /></Link><button type="button" className="studio-button engineer-button" onClick={() => openCalendlyPopup()}>Talk to AI Engineer <ArrowUpRight size={17} aria-hidden="true" /></button></div></section>
  </main>;
}

function ArrowDownIcon() { return <ArrowRight size={17} className="rotate-90" />; }
