import { openCalendlyPopup } from "@/lib/calendly";
import { CONTACT_EMAIL } from "@/data/site";

/** Closing call-to-action shown at the bottom of every page except home. */
export function BookCta() {
  return (
    <section className="mx-auto mt-[120px] max-w-[1200px] px-5 sm:px-10">
      <div className="grid items-center gap-10 rounded-[20px] border border-hairline-strong bg-[linear-gradient(140deg,rgba(163,179,201,0.10)_0%,rgba(163,179,201,0.02)_44%,#0F0F11_100%)] px-7 py-12 sm:px-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:gap-14">
        <div>
          <h2 className="mb-4 font-heading text-[32px] leading-[1.08] font-semibold tracking-[-0.028em] text-balance sm:text-[42px]">
            Bring the messy version of the problem
          </h2>
          <p className="m-0 max-w-[520px] text-[17px] leading-[1.55] text-pretty text-[#A0A0A9]">
            A free 30-minute technical call with a lead engineer, not a salesperson. You'll leave
            knowing whether your use case is a fit and roughly what approach we'd recommend — even
            if the answer is that you shouldn't build it. Written proposal within 48 hours if
            there's a fit.
          </p>
        </div>
        <div className="grid gap-3">
          <button
            onClick={() => openCalendlyPopup()}
            className="btn-primary cursor-pointer px-6 py-[15px] text-[15px]"
          >
            Book a free 30-min scoping call
          </button>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="block rounded-lg border border-hairline-strong px-6 py-[15px] text-center text-[15px] font-medium text-foreground transition-colors hover:border-white/45 hover:text-white"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
