import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";

export function ImpactCalculator() {
  const [volume, setVolume] = useState(2000);
  const [minutes, setMinutes] = useState(8);
  const [reduction, setReduction] = useState(40);
  const [month, setMonth] = useState(6);
  const reduce = useReducedMotion();
  const baseline = volume * minutes / 60;
  const saved = baseline * reduction / 100;
  const format = (value: number) => Math.round(value).toLocaleString("en-US");
  const x = (m: number) => 44 + m * 72;
  const y = (hours: number) => 218 - (hours / (baseline * 6)) * 180;
  const points = (rate: number) => Array.from({ length: 7 }, (_, i) => `${x(i)},${y(rate * i)}`).join(" ");
  return <section className="design-section" aria-labelledby="impact-title">
    <Reveal className="section-intro"><p className="studio-kicker">Start with the value</p><h2 id="impact-title">What would more<br />capacity look like?</h2><p>Explore a workflow scenario. Adjust the assumptions to see how time adds up.</p></Reveal>
    <div className="impact-calculator">
      <div className="impact-controls">
        <h3>Make it your scenario.</h3>
        <label htmlFor="monthly-volume">Tasks per month <output htmlFor="monthly-volume">{format(volume)}</output></label>
        <input id="monthly-volume" type="range" min="100" max="10000" step="100" value={volume} onChange={event => setVolume(Number(event.target.value))} />
        <label htmlFor="minutes-task">Minutes per task <output htmlFor="minutes-task">{minutes} min</output></label>
        <input id="minutes-task" type="range" min="1" max="30" value={minutes} onChange={event => setMinutes(Number(event.target.value))} />
        <label htmlFor="time-reduction">Assumed time reduction <output htmlFor="time-reduction">{reduction}%</output></label>
        <input id="time-reduction" type="range" min="0" max="80" step="5" value={reduction} onChange={event => setReduction(Number(event.target.value))} />
        <p className="calculator-note">Illustrative, not a forecast. Assumes constant task volume and time reduction from month one. Excludes implementation, model costs, and additional review time.</p>
        <Link className="studio-text-link" to="/#scanner">Validate your opportunity <ArrowUpRight size={16} /></Link>
      </div>
      <div className="impact-chart dot-field">
        <div className="impact-result"><span>Potential capacity over {month} {month === 1 ? "month" : "months"}</span><output aria-live="polite" aria-atomic="true">{format(saved * month)}<small> hours</small></output></div>
        <svg viewBox="0 0 510 260" role="img" aria-label={`Cumulative manual effort over six months: ${format(baseline * 6)} hours today versus ${format((baseline - saved) * 6)} hours in your scenario.`}>
          {[0, 0.5, 1].map(tick => <g key={tick}><line x1="44" x2="476" y1={218 - tick * 180} y2={218 - tick * 180} stroke="currentColor" opacity=".12" /><text x="2" y={222 - tick * 180} fill="currentColor" fontSize="10">{format(baseline * 6 * tick)}</text></g>)}
          <text x="2" y="17" fill="currentColor" fontSize="10">Hours</text>
          <polyline points={points(baseline)} fill="none" stroke="#9293a0" strokeWidth="2" strokeDasharray="5 5" />
          <motion.polyline fill="none" stroke="#b6a7f2" strokeWidth="3" initial={false} animate={{ points: points(baseline - saved) }} transition={{ duration: reduce ? 0 : 0.4 }} />
          <line x1={x(month)} x2={x(month)} y1="28" y2="218" stroke="#b6a7f2" opacity=".35" />
          <circle cx={x(month)} cy={y((baseline - saved) * month)} r="5" fill="#d2c6ff" />
        </svg>
        <div className="chart-months" aria-label="View cumulative capacity by month">{[1, 2, 3, 4, 5, 6].map(value => <button key={value} style={{ left: `${x(value) / 510 * 100}%` }} aria-pressed={month === value} aria-label={`Month ${value}`} onClick={() => setMonth(value)}>M{value}</button>)}</div>
        <div className="chart-legend"><span><i />Current manual effort</span><span><i />Your scenario</span></div>
      </div>
    </div>
  </section>;
}
