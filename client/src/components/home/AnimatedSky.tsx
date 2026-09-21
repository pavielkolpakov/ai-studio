import { useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";

/** Animate the existing sky without replacing the original artwork. */
export function AnimatedSky() {
  const skyRef = useRef<HTMLDivElement>(null);
  const visible = useInView(skyRef);
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  return (
    <>
      <div
        ref={skyRef}
        className="hero-atmosphere"
        data-paused={paused || !visible || !!reducedMotion}
        aria-hidden="true"
      >
        <div className="hero-sky-drift" />
        <div className="hero-sky-haze" />
      </div>
      <button
        type="button"
        className="hero-sky-toggle"
        onClick={() => setPaused(value => !value)}
        aria-label={paused ? "Play sky animation" : "Pause sky animation"}
        title={paused ? "Play sky animation" : "Pause sky animation"}
      >
        {paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}
      </button>
    </>
  );
}
