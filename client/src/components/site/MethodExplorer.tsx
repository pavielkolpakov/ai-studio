import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";

const steps = [
  { title: "Understand", detail: "Start with your product, users, workflows, data, and business objectives. Define the problem before choosing the technology.", output: "Shared problem definition", checks: ["Product and workflow context", "Data and access constraints", "A measurable outcome"] },
  { title: "Prioritize", detail: "Rank opportunities by business impact, feasibility, data readiness, complexity, and risk. Choose a scope proportionate to the value.", output: "Prioritized opportunity map", checks: ["Impact and effort", "Risks and dependencies", "Recommended sequence"] },
  { title: "Validate", detail: "Test the assumptions that matter before committing to a large build. Use representative inputs and agree how success will be measured.", output: "Evidence for a build decision", checks: ["Representative examples", "Feasibility checks", "Success criteria"] },
  { title: "Build", detail: "Engineer the system into your product and infrastructure. Share progress through your repository and an early staging environment.", output: "An integrated production system", checks: ["Product integration", "Evaluation and monitoring", "Documented handover"] },
  { title: "Improve", detail: "Measure production behavior and improve quality, cost, latency, and reliability as the system meets real usage.", output: "A measured improvement plan", checks: ["Production evaluation", "Bottleneck analysis", "Ongoing iteration"] },
];

export function MethodExplorer() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const step = steps[active];
  return <div className="method-explorer">
    <div className="method-steps" aria-label="Explore our method">{steps.map((item, index) => <button key={item.title} aria-pressed={active === index} onClick={() => setActive(index)}><span>{item.title}</span><ArrowRight size={18} /></button>)}</div>
    <motion.div key={step.title} className="method-content dot-field" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3 }} aria-live="polite"><span className="studio-kicker">{step.output}</span><h3>{step.title}.</h3><p>{step.detail}</p><ul>{step.checks.map(check => <li key={check}><Check size={16} />{check}</li>)}</ul></motion.div>
  </div>;
}
