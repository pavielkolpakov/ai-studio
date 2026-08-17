import {
  SERVICES_PAGE,
  PHASES,
  TIMELINES,
  STACK,
  FAQS,
} from "@/data/site";
import { openCalendlyPopup } from "@/lib/calendly";

export function ServicesPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-10">
      <header className="mb-13 max-w-[760px]">
        <div className="eyebrow mb-4">{SERVICES_PAGE.eyebrow}</div>
        <h1 className="mb-[18px] font-heading text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-[54px]">
          {SERVICES_PAGE.headline}
        </h1>
        <p className="m-0 text-[18px] leading-[1.55] text-pretty text-muted-foreground">
          {SERVICES_PAGE.sub}
        </p>
      </header>

      {/* Three ways to engage */}
      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        {SERVICES_PAGE.blocks.map((b) => (
          <div
            key={b.title}
            className="flex flex-col rounded-2xl border border-white/[0.09] bg-surface px-8 pt-9 pb-[34px]"
          >
            <div className="mb-4 flex min-h-[22px] flex-wrap items-center gap-2.5">
              <span className="font-heading text-[20px] font-semibold tracking-[-0.015em]">
                {b.title}
              </span>
              <span className="rounded-[4px] border border-hairline px-[7px] py-[3px] font-mono text-[10px] tracking-[0.1em] uppercase whitespace-nowrap text-steel">
                {b.tag}
              </span>
            </div>
            <p className="mb-[30px] text-[14.5px] leading-[1.6] text-pretty text-body-text">
              {b.body}
            </p>
            <button
              onClick={() => openCalendlyPopup()}
              className="mt-auto cursor-pointer rounded-lg border border-white/[0.18] px-5 py-[13px] text-center text-[14.5px] font-semibold text-foreground transition-colors hover:border-white/45"
            >
              {b.cta}
            </button>
          </div>
        ))}
      </div>

      {/* How engagements run */}
      <section className="mt-24 grid items-start gap-10 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:gap-14">
        <div>
          <div className="eyebrow mb-3.5">How engagements run</div>
          <h2 className="mb-4 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
            Audit first, then a scope you can hold us to
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-pretty text-muted-foreground">
            Not every client needs every stage. You may start with an audit, move directly
            into a focused implementation, or ask us to review an AI system you already run.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-white/[0.08]">
          {PHASES.map((s) => (
            <div
              key={s.num}
              className="grid items-baseline gap-5 bg-surface px-[26px] py-[22px] sm:grid-cols-[44px_minmax(0,0.9fr)_minmax(0,1.6fr)]"
            >
              <span className="font-mono text-[11px] tracking-[0.1em] text-steel">{s.num}</span>
              <span className="font-heading text-[17px] font-semibold tracking-[-0.015em]">
                {s.title}
              </span>
              <span className="text-sm leading-[1.55] text-muted-foreground">{s.body}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Timelines */}
      <section className="mt-16">
        <div className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {TIMELINES.map((t) => (
            <div key={t.name} className="bg-surface px-6 py-5">
              <div className="font-heading text-[18px] font-semibold tracking-[-0.02em]">
                {t.time}
              </div>
              <div className="mt-1.5 text-[13.5px] leading-[1.4] text-muted-foreground">
                {t.name}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[13px] text-dim-text">
          Indicative only. We give a precise timeline once the scope is understood, not before.
        </p>
      </section>

      {/* Stack */}
      <section className="mt-24">
        <h2 className="mb-3 font-heading text-[30px] font-semibold tracking-[-0.026em] sm:text-[34px]">
          The stack we actually use
        </h2>
        <p className="mb-8 text-base text-muted-foreground">
          We are opinionated about tools. These are technologies we have deployed in production and
          understand deeply — not whatever is newest.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STACK.map((g) => (
            <div key={g.group} className="rounded-xl border border-hairline bg-surface px-6 pt-6 pb-[22px]">
              <div className="mb-3.5 font-mono text-[10.5px] tracking-[0.1em] uppercase text-steel">
                {g.group}
              </div>
              <div className="grid gap-2">
                {g.items.map((i) => (
                  <div key={i} className="text-sm text-body-text">{i}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-24 grid items-start gap-10 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)] lg:gap-14">
        <div>
          <h2 className="mb-3 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
            Questions we get before signing
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-muted-foreground">
            Anything else, ask the assistant — it answers from the same source we do.
          </p>
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-white/[0.08]">
          {FAQS.map((f) => (
            <div key={f.q} className="bg-surface px-[30px] py-[26px]">
              <h3 className="mb-[9px] font-heading text-[17px] font-semibold tracking-[-0.015em]">
                {f.q}
              </h3>
              <p className="m-0 text-[14.5px] leading-[1.6] text-pretty text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
