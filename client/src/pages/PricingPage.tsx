import {
  PLANS,
  ENGAGEMENT_SIZES,
  MONEY_TERMS,
  PHASES,
  TIMELINES,
  STACK,
  FAQS,
} from "@/data/site";
import { openCalendlyPopup } from "@/lib/calendly";

export function PricingPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-10">
      <header className="mb-13 max-w-[720px]">
        <div className="eyebrow mb-4">Pricing</div>
        <h1 className="mb-[18px] font-heading text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[54px]">
          Published, so you can budget before you call
        </h1>
        <p className="m-0 text-[18px] leading-[1.55] text-pretty text-muted-foreground">
          Three ways to work with us. Fixed fees where scope can be fixed, monthly where it can't.
          No hourly billing, no change-request theatre.
        </p>
      </header>

      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.name}
            className={`flex flex-col rounded-2xl px-8 pt-9 pb-[34px] ${
              p.featured
                ? "border border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.07)_0%,#101012_46%)]"
                : "border border-white/[0.09] bg-surface"
            }`}
          >
            <div className="mb-4 flex min-h-[22px] items-center gap-2.5">
              <span className="font-heading text-[20px] font-semibold tracking-[-0.015em] whitespace-nowrap">
                {p.name}
              </span>
              {p.featured && (
                <span className="rounded-[4px] bg-[#F4F4F5] px-[7px] py-[3px] font-mono text-[10px] tracking-[0.1em] uppercase whitespace-nowrap text-background">
                  Most engagements
                </span>
              )}
            </div>
            <div className="mb-2 font-heading text-[38px] leading-none font-semibold tracking-[-0.028em]">
              {p.price}
            </div>
            <div className="mb-6 text-[13.5px] text-muted-foreground">{p.unit}</div>
            <p className="mb-6 border-b border-white/[0.09] pb-6 text-[14.5px] leading-[1.6] text-pretty text-body-text">
              {p.who}
            </p>
            <div className="mb-[30px] grid gap-[11px]">
              {p.features.map((f) => (
                <div
                  key={f}
                  className="grid grid-cols-[14px_minmax(0,1fr)] gap-3 text-sm leading-[1.5] text-body-text"
                >
                  <span className="text-steel">✓</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => openCalendlyPopup()}
              className={`mt-auto cursor-pointer rounded-lg px-5 py-[13px] text-center text-[14.5px] font-semibold transition-colors ${
                p.featured
                  ? "btn-primary"
                  : "border border-white/[0.18] text-foreground hover:border-white/45"
              }`}
            >
              {p.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Engagement sizes */}
      <div className="mt-4 overflow-hidden rounded-xl border border-hairline bg-surface">
        <div className="border-b border-hairline px-8 py-[18px] font-mono text-[10.5px] tracking-[0.1em] uppercase text-dim-text">
          Typical engagement sizes
        </div>
        <div className="grid gap-px bg-white/[0.08] sm:grid-cols-3">
          {ENGAGEMENT_SIZES.map((e) => (
            <div key={e.name} className="bg-surface px-8 py-6">
              <div className="font-heading text-[24px] font-semibold tracking-[-0.02em]">
                {e.price}
              </div>
              <div className="mt-1.5 text-[14px] text-body-text">{e.name}</div>
              <div className="mt-1 font-mono text-[11.5px] text-dim-text">{e.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Discovery + payment terms */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-surface px-8 py-[26px]">
          <div className="mb-1.5 flex flex-wrap items-baseline gap-3">
            <span className="font-heading text-[18px] font-semibold tracking-[-0.015em]">
              Paid discovery, first
            </span>
            <span className="font-heading text-[18px] font-semibold text-steel">
              {MONEY_TERMS.discoveryPrice}
            </span>
          </div>
          <p className="m-0 text-[14.5px] leading-[1.6] text-pretty text-muted-foreground">
            {MONEY_TERMS.discoveryNote}
          </p>
        </div>
        <div className="rounded-xl border border-hairline bg-surface px-8 py-[26px]">
          <div className="mb-1.5 font-heading text-[18px] font-semibold tracking-[-0.015em]">
            Payment terms
          </div>
          <div className="mb-2 font-mono text-[13px] text-steel">{MONEY_TERMS.paymentTerms}</div>
          <p className="m-0 text-[14.5px] leading-[1.6] text-pretty text-muted-foreground">
            {MONEY_TERMS.paymentNote} We prefer fixed price scoped precisely after discovery, and
            use time-and-materials only for retainer work.
          </p>
        </div>
      </div>

      {/* How we work */}
      <section className="mt-24 grid items-start gap-10 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:gap-14">
        <div>
          <div className="eyebrow mb-3.5">How we work</div>
          <h2 className="mb-4 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
            Four phases, and the first one is free
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-pretty text-muted-foreground">
            No open-ended discovery. The paid week that follows the call ends in a technical spec
            and a fixed price you own — whether or not you build it with us.
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
          Indicative only. We give a precise timeline after discovery, not before.
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
