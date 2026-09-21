import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const MotionLink = motion.create(Link);
import { ArrowRight, ArrowUpRight, AudioLines } from "lucide-react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PRICING_PAGE } from "@/data/site";
import { openCalendlyPopup } from "@/lib/calendly";
import { Reveal } from "@/components/site/Reveal";
import { ProjectExplorer } from "@/components/site/ProjectExplorer";
import { AnimatedSky } from "./AnimatedSky";
import "./studio.css";

const process = [
  { title: "Start with the right question.", body: "A conversation with an engineer about your product, your data, and what is worth solving." },
  { title: "Make the work visible.", body: "A clear scope, a shared project board, and a staging environment early. You see the system take shape." },
  { title: "Make it yours.", body: "Your repository. Your infrastructure. Documentation and a runbook your team can actually use." },
];

export function StudioLanding({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const gallery = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: gallery, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [35, -35]);

  return <main className="studio-home">
    <link rel="preload" as="image" href="/images/atmosphere.jpg" />
    <section className="studio-hero" aria-labelledby="home-title">
      <AnimatedSky />
      <motion.div className="hero-copy" initial={reduce ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}>
        <p className="studio-kicker">AI engineering studio</p>
        <h1 id="home-title">Find where AI creates value.<br /><span>Then build it.</span></h1>
        <p className="hero-description">We help software companies turn AI opportunities into systems that work in the real world.</p>
        <div id="scanner" className="scanner-input hero-scanner">
          {children}
        </div>
        <p className="hero-assurance">Built around your business. Grounded in real projects.</p>
      </motion.div>
      <motion.div ref={gallery} className="hero-gallery" aria-label="Our approach" style={{ y: reduce ? 0 : drift }}>
        <MotionLink to="/pricing#ai-audit" className="gallery-panel gallery-audit image-panel" initial={reduce ? false : { opacity: 0, y: 70, rotate: -4 }} animate={{ opacity: 1, y: 0, rotate: reduce ? 0 : -4 }} transition={{ duration: 1, delay: 0.15 }}>
          <span>Clarity before code.</span><motion.img initial={reduce ? false : { scale: 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: .4 }} transition={{ duration: reduce ? 0 : 3, ease: "easeOut" }} className="editorial-asset" src="/images/clarity-lens.jpg" alt="" width="1200" height="800" loading="lazy" /><span className="gallery-bottom">Find the opportunity <ArrowUpRight size={20} /></span>
        </MotionLink>
        <MotionLink to="/pricing#ai-implementation" className="gallery-panel gallery-build image-panel" initial={reduce ? false : { opacity: 0, y: 90 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.28 }}>
          <span>Built for the real world.</span><motion.img initial={reduce ? false : { scale: 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: .4 }} transition={{ duration: reduce ? 0 : 3, ease: "easeOut" }} className="editorial-asset" src="/images/connected-systems.jpg" alt="" width="1536" height="1024" loading="lazy" /><span className="gallery-bottom">Put AI to work <ArrowUpRight size={20} /></span>
        </MotionLink>
        <MotionLink to="/pricing#ai-optimization" className="gallery-panel gallery-optimize image-panel" initial={reduce ? false : { opacity: 0, y: 70, rotate: 4 }} animate={{ opacity: 1, y: 0, rotate: reduce ? 0 : 4 }} transition={{ duration: 1, delay: 0.4 }}>
          <span>Better with every iteration.</span><motion.img initial={reduce ? false : { scale: 1.06 }} whileInView={{ scale: 1 }} viewport={{ once: true, amount: .4 }} transition={{ duration: reduce ? 0 : 3, ease: "easeOut" }} className="editorial-asset" src="/images/iteration-orbit.jpg" alt="" width="1200" height="800" loading="lazy" /><span className="gallery-bottom">Refine what runs <ArrowUpRight size={20} /></span>
        </MotionLink>
      </motion.div>
    </section>

    <section id="expertise" className="studio-section expertise" aria-labelledby="expertise-title">
      <Reveal className="studio-section-heading"><p className="studio-kicker">From possibility to production</p><h2 id="expertise-title">A clear next move.<br />Wherever you are with AI.</h2></Reveal>
      <div className="expertise-grid">
        {PRICING_PAGE.paths.map((service, index) => <Reveal key={service.service} className={`service-card service-card-${index}`} delay={index * 0.07}>
          <div className="service-top"><span>{service.service}</span><ArrowUpRight size={25} strokeWidth={1.3} /></div>
          <div className="service-copy"><h3>{service.situation}<br /><span>{service.answer}</span></h3><p>{service.body.replace(" — ", ", ")}</p></div>
          <Link to={`/pricing${service.href}`} className="service-link"><span>{service.price}</span><span>View service <ArrowRight size={18} /></span></Link>
          {index === 2 && <AudioLines className="service-art" aria-hidden="true" strokeWidth={0.5} />}
        </Reveal>)}
      </div>
    </section>

    <ProjectExplorer />

    <section className="studio-section studio-process dot-field" aria-labelledby="process-title">
      <Reveal className="process-intro"><h2 id="process-title">Good engineering.<br />No black box.</h2><p>A direct relationship with the people building your system, from the first conversation to the final handover.</p><Link to="/about" className="studio-text-link">Meet Neuronetis <ArrowUpRight size={17} /></Link></Reveal>
      <div className="process-list">{process.map((item, index) => <Reveal key={item.title} delay={index * 0.08}><h3>{item.title}</h3><p>{item.body}</p></Reveal>)}</div>
    </section>

    <section className="studio-section studio-about" aria-labelledby="approach-title">
      <Reveal className="studio-photo"><img src="/images/optical-layers.jpg" alt="Light passing through layers of optical glass" loading="lazy" width="1200" height="900" /></Reveal>
      <Reveal className="about-copy"><p className="studio-kicker">Designed around your business</p><h2 id="approach-title">Your product.<br />Your constraints.<br />Your advantage.</h2><p>We work with the data, workflows, and infrastructure you already have. Every technical decision starts with what your business needs.</p><Link to="/about" className="studio-text-link">See how we work <ArrowUpRight size={17} /></Link></Reveal>
    </section>

    <section className="studio-section studio-scanner" aria-labelledby="scanner-title">
      <Reveal><p className="studio-kicker">From a question to a clear next step</p><h2 id="scanner-title">Your next chapter.<br />Powered by possibility.</h2><p>Tell us about your product. We’ll help you find a practical place to start.</p><div className="scanner-actions"><a href="#scanner" className="studio-button" onClick={(event) => { event.preventDefault(); document.getElementById("scanner")?.scrollIntoView({ block: "center" }); document.querySelector<HTMLTextAreaElement>("#scanner textarea")?.focus({ preventScroll: true }); }}>Explore your AI opportunity <ArrowUpRight size={17} /></a><button type="button" className="studio-button engineer-button" onClick={() => openCalendlyPopup()}>Talk to AI Engineer <ArrowUpRight size={17} aria-hidden="true" /></button></div></Reveal>
    </section>
    <SiteFooter />
  </main>;
}
