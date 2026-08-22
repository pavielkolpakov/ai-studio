import { Link } from "react-router-dom";
import { openCalendlyPopup } from "@/lib/calendly";

/** Closing call-to-action shown at the bottom of every page except home. */
export function BookCta() {
  return (
    <section className="mx-auto mt-[120px] max-w-[1200px] px-5 sm:px-10">
      <div className="grid items-center gap-10 rounded-[20px] border border-hairline-strong bg-[linear-gradient(140deg,rgba(200,204,212,0.10)_0%,rgba(200,204,212,0.02)_44%,#0F0F11_100%)] px-7 py-12 sm:px-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:gap-14">
        <div>
          <h2 className="mb-4 font-heading text-[32px] leading-[1.08] font-semibold tracking-[-0.028em] text-balance sm:text-[42px]">
            Find where AI creates value in your business
          </h2>
          <p className="m-0 max-w-[520px] text-[17px] leading-[1.55] text-pretty text-[#A0A0A9]">
            Describe your product or workflow and the Opportunity Scanner will surface tailored
            AI opportunities from our library of real projects. Or go straight to an audit —
            a rigorous look at your actual systems, ending in a prioritized roadmap.
          </p>
        </div>
        <div className="grid gap-3">
          <Link
            to="/"
            className="btn-primary block px-6 py-[15px] text-center text-[15px]"
          >
            Run the AI Opportunity Scanner
          </Link>
          <button
            onClick={() => openCalendlyPopup()}
            className="cursor-pointer rounded-lg border border-hairline-strong px-6 py-[15px] text-[15px] font-medium text-foreground transition-colors hover:border-white/45 hover:text-white"
          >
            Request an AI Audit
          </button>
        </div>
      </div>
    </section>
  );
}
