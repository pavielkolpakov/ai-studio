import { AUDIT_PAGE, SAMPLE_AUDIT } from "@/data/site";
import { openCalendlyPopup } from "@/lib/calendly";

export function AuditPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-10">
      <header className="mb-13 max-w-[760px]">
        <div className="eyebrow mb-4">{AUDIT_PAGE.eyebrow}</div>
        <h1 className="mb-[18px] font-heading text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-[54px]">
          {AUDIT_PAGE.headline}
        </h1>
        <p className="m-0 text-[18px] leading-[1.55] text-pretty text-muted-foreground">
          {AUDIT_PAGE.sub}
        </p>
      </header>

      {/* We look at */}
      <section className="mb-22">
        <h2 className="mb-7 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
          What the audit examines
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AUDIT_PAGE.lookAt.map((item) => (
            <div
              key={item.title}
              className="rounded-[14px] border border-hairline bg-surface px-[26px] pt-[26px] pb-6"
            >
              <div className="mb-2.5 font-heading text-[17px] font-semibold tracking-[-0.015em]">
                {item.title}
              </div>
              <p className="m-0 text-[14.5px] leading-[1.6] text-pretty text-muted-foreground">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* You get */}
      <section className="mb-22 grid items-start gap-10 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:gap-14">
        <div>
          <h2 className="mb-4 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
            What you receive
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-pretty text-muted-foreground">
            The output is not a generic list of AI ideas. It is a prioritized set of
            opportunities based on your actual systems, data, and constraints — concrete
            enough to act on, whether or not you act on it with us.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-white/[0.08] sm:grid-cols-2">
          {AUDIT_PAGE.deliverables.map((d) => (
            <div key={d.title} className="bg-surface px-[26px] py-[22px]">
              <div className="mb-2 grid grid-cols-[14px_minmax(0,1fr)] gap-3 font-heading text-[16px] font-semibold tracking-[-0.015em]">
                <span className="text-steel">✓</span>
                <span>{d.title}</span>
              </div>
              <p className="m-0 pl-[26px] text-[14px] leading-[1.55] text-muted-foreground">
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sample deliverable */}
      <section className="mb-22">
        <div className="mb-7 max-w-[640px]">
          <h2 className="mb-3 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
            What an audit deliverable looks like
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-pretty text-muted-foreground">
            A simplified excerpt from an opportunity map — the centerpiece of every audit.
          </p>
        </div>
        <div className="overflow-hidden rounded-xl border border-hairline bg-surface">
          <div className="flex items-center justify-between border-b border-hairline px-6 py-[18px] sm:px-8">
            <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-dim-text">
              Sample · AI opportunity map
            </span>
            <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-steel">
              3 of 9 opportunities
            </span>
          </div>
          <div className="grid gap-px bg-white/[0.08]">
            {SAMPLE_AUDIT.map((row, i) => (
              <div
                key={row.opportunity}
                className="grid gap-4 bg-surface px-6 py-5 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] sm:px-8 lg:grid-cols-[44px_minmax(0,1.3fr)_minmax(0,1.2fr)_90px_110px_minmax(0,1.1fr)] lg:items-baseline"
              >
                <span className="hidden font-mono text-[11px] tracking-[0.1em] text-steel lg:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="font-heading text-[16px] font-semibold tracking-[-0.015em]">
                    {row.opportunity}
                  </div>
                  <div className="mt-1 text-[13.5px] leading-[1.5] text-muted-foreground">
                    {row.problem}
                  </div>
                </div>
                <div className="hidden lg:block" />
                <div>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-dim-text">
                    Impact
                  </div>
                  <div className="mt-0.5 text-[13.5px] font-medium text-foreground/90">
                    {row.impact}
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-dim-text">
                    Complexity
                  </div>
                  <div className="mt-0.5 text-[13.5px] font-medium text-foreground/90">
                    {row.complexity}
                  </div>
                </div>
                <div className="text-[13px] leading-[1.5] text-muted-foreground">
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-dim-text lg:hidden">
                    Next step —{" "}
                  </span>
                  {row.next}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What happens after */}
      <section className="grid items-center gap-10 rounded-[20px] border border-hairline-strong bg-[linear-gradient(140deg,rgba(200,204,212,0.10)_0%,rgba(200,204,212,0.02)_44%,#0F0F11_100%)] px-7 py-12 sm:px-14 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(260px,340px)] lg:gap-14">
        <div>
          <h2 className="mb-4 font-heading text-[28px] leading-[1.12] font-semibold tracking-[-0.026em] text-balance sm:text-[34px]">
            {AUDIT_PAGE.after.title}
          </h2>
          <p className="m-0 max-w-[560px] text-[16px] leading-[1.6] text-pretty text-[#A0A0A9]">
            {AUDIT_PAGE.after.body}
          </p>
        </div>
        <div>
          <button
            onClick={() => openCalendlyPopup()}
            className="btn-primary w-full cursor-pointer px-6 py-[15px] text-[15px]"
          >
            {AUDIT_PAGE.cta}
          </button>
        </div>
      </section>
    </div>
  );
}
