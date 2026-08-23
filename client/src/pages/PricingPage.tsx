import { PRICING_PAGE, PHASES, TIMELINES, FAQS } from "@/data/site";
import { openCalendlyPopup } from "@/lib/calendly";

const { paths, audit, implementation, optimization, ongoing, closing } = PRICING_PAGE;

/** Small diamond bullet used in the detail lists. */
function Bullet() {
  return (
    <span
      aria-hidden
      className="mt-[7px] h-[5px] w-[5px] shrink-0 rotate-45 bg-silver/70"
    />
  );
}

/** Shared left column for a service section: number, name, price, lead, CTA. */
function ServiceIntro({
  num,
  title,
  price,
  lead,
  cta,
}: {
  num: string;
  title: string;
  price: string;
  lead: string;
  cta: string;
}) {
  return (
    <div className="lg:sticky lg:top-[104px]">
      <div className="mb-3.5 font-mono text-[11px] tracking-[0.1em] text-steel">{num}</div>
      <h2 className="mb-3 font-heading text-[32px] leading-[1.1] font-semibold tracking-[-0.026em] sm:text-[38px]">
        {title}
      </h2>
      <div className="mb-4 font-heading text-[20px] font-semibold tracking-[-0.015em] text-silver">
        {price}
      </div>
      <p className="mb-7 text-[15.5px] leading-[1.6] text-pretty text-muted-foreground">{lead}</p>
      <button
        onClick={() => openCalendlyPopup()}
        className="btn-primary w-full cursor-pointer px-6 py-[14px] text-[15px] sm:w-auto"
      >
        {cta}
      </button>
    </div>
  );
}

export function PricingPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-10">
      <header className="mb-16 max-w-[760px]">
        <div className="eyebrow mb-4">{PRICING_PAGE.eyebrow}</div>
        <h1 className="mb-[18px] font-heading text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-[54px]">
          {PRICING_PAGE.headline}
        </h1>
        <p className="m-0 text-[18px] leading-[1.55] text-pretty text-muted-foreground">
          {PRICING_PAGE.sub}
        </p>
      </header>

      {/* Three client situations — the core message of the page */}
      <section className="grid items-stretch gap-4 lg:grid-cols-3">
        {paths.map((p) => (
          <a
            key={p.answer}
            href={p.href}
            className="group flex flex-col rounded-2xl border border-hairline-strong bg-surface px-8 pt-9 pb-8 transition-colors hover:border-white/30"
          >
            <div className="text-[15px] leading-[1.4] text-muted-foreground">{p.situation}</div>
            <div className="mt-2 mb-4 font-heading text-[30px] leading-[1.05] font-semibold tracking-[-0.028em] text-white sm:text-[34px]">
              {p.answer}
            </div>
            <p className="mb-8 text-[14.5px] leading-[1.6] text-pretty text-body-text">{p.body}</p>
            <div className="mt-auto flex flex-wrap items-baseline justify-between gap-2 border-t border-hairline pt-4">
              <span className="text-[14px] font-medium text-foreground">{p.service}</span>
              <span className="font-mono text-[12.5px] tracking-[0.02em] text-silver">
                {p.price}
              </span>
            </div>
          </a>
        ))}
      </section>

      {/* Service 01 — AI Audit */}
      <section
        id={audit.id}
        className="mt-28 grid scroll-mt-[104px] items-start gap-10 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-16"
      >
        <ServiceIntro
          num={audit.num}
          title={audit.title}
          price={audit.price}
          lead={audit.lead}
          cta={audit.cta}
        />

        <div className="grid gap-4">
          {/* Audit options and prices */}
          <div className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-white/[0.08]">
            {audit.options.map((o) => (
              <div
                key={o.name}
                className="grid items-baseline gap-x-6 gap-y-1.5 bg-surface px-[26px] py-[22px] sm:grid-cols-[minmax(0,0.85fr)_120px_minmax(0,1.5fr)]"
              >
                <span className="font-heading text-[17px] font-semibold tracking-[-0.015em]">
                  {o.name}
                </span>
                <span className="font-mono text-[13.5px] text-silver">{o.price}</span>
                <span className="text-[14px] leading-[1.55] text-muted-foreground">{o.body}</span>
              </div>
            ))}
          </div>

          {/* What the audit evaluates */}
          <div className="rounded-xl border border-hairline bg-surface px-[30px] pt-7 pb-6">
            <div className="mb-4 font-mono text-[10.5px] tracking-[0.12em] uppercase text-steel">
              {audit.evaluatesTitle}
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {audit.evaluates.map((e) => (
                <div
                  key={e}
                  className="grid grid-cols-[10px_minmax(0,1fr)] gap-3 text-[14.5px] leading-[1.5] text-body-text"
                >
                  <Bullet />
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div className="rounded-xl border border-hairline bg-surface px-[30px] pt-7 pb-7">
            <div className="mb-5 font-mono text-[10.5px] tracking-[0.12em] uppercase text-steel">
              {audit.deliverablesTitle}
            </div>
            <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {audit.deliverables.map((d) => (
                <div key={d.title}>
                  <div className="mb-1 font-heading text-[15.5px] font-semibold tracking-[-0.01em]">
                    {d.title}
                  </div>
                  <p className="m-0 text-[14px] leading-[1.55] text-pretty text-muted-foreground">
                    {d.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Free audit for selected companies */}
          <div className="rounded-xl border border-hairline-strong bg-[linear-gradient(140deg,rgba(200,204,212,0.10)_0%,rgba(200,204,212,0.02)_44%,#0F0F11_100%)] px-[30px] py-7">
            <div className="mb-2 font-heading text-[18px] font-semibold tracking-[-0.018em] text-foreground">
              {audit.free.title}
            </div>
            <p className="m-0 max-w-[620px] text-[14.5px] leading-[1.6] text-pretty text-body-text">
              {audit.free.body}
            </p>
          </div>
        </div>
      </section>

      {/* Service 02 — AI Implementation */}
      <section
        id={implementation.id}
        className="mt-28 grid scroll-mt-[104px] items-start gap-10 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-16"
      >
        <ServiceIntro
          num={implementation.num}
          title={implementation.title}
          price={implementation.price}
          lead={implementation.lead}
          cta={implementation.cta}
        />

        <div className="grid gap-4">
          {/* Starting-price anchors */}
          <div className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-white/[0.08]">
            {implementation.tiers.map((t) => (
              <div
                key={t.name}
                className="grid items-baseline gap-x-6 gap-y-1.5 bg-surface px-[26px] py-[22px] sm:grid-cols-[minmax(0,0.85fr)_120px_minmax(0,1.5fr)]"
              >
                <span className="font-heading text-[17px] font-semibold tracking-[-0.015em]">
                  {t.name}
                </span>
                <span className="font-mono text-[13.5px] text-silver">{t.price}</span>
                <span className="text-[14px] leading-[1.55] text-muted-foreground">{t.body}</span>
              </div>
            ))}
          </div>

          {/* What moves the price */}
          <div className="rounded-xl border border-hairline bg-surface px-[30px] pt-7 pb-6">
            <div className="mb-1.5 font-heading text-[17px] font-semibold tracking-[-0.015em]">
              {implementation.factorsTitle}
            </div>
            <p className="mb-4 max-w-[560px] text-[14.5px] leading-[1.6] text-pretty text-muted-foreground">
              {implementation.factorsIntro}
            </p>
            <div className="flex flex-wrap gap-2">
              {implementation.factors.map((f) => (
                <span
                  key={f}
                  className="rounded-md border border-hairline px-2.5 py-1.5 text-[13.5px] text-body-text"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Not the focus of the page: kept quiet, on purpose */}
          <div className="rounded-xl border border-hairline bg-surface px-[30px] pt-6 pb-6">
            <div className="mb-3 font-mono text-[10.5px] tracking-[0.12em] uppercase text-steel">
              {implementation.examplesTitle}
            </div>
            <p className="m-0 text-[14px] leading-[1.7] text-pretty text-muted-foreground">
              {implementation.examples.join(" · ")}
            </p>
          </div>

          {/* No audit gate */}
          <div className="rounded-xl border border-hairline-strong bg-[linear-gradient(140deg,rgba(200,204,212,0.10)_0%,rgba(200,204,212,0.02)_44%,#0F0F11_100%)] px-[30px] py-7">
            <div className="mb-2 font-heading text-[18px] font-semibold tracking-[-0.018em] text-foreground">
              {implementation.noGate.title}
            </div>
            <p className="m-0 max-w-[620px] text-[14.5px] leading-[1.6] text-pretty text-body-text">
              {implementation.noGate.body}
            </p>
          </div>
        </div>
      </section>

      {/* Service 03 — AI Optimization */}
      <section
        id={optimization.id}
        className="mt-28 grid scroll-mt-[104px] items-start gap-10 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:gap-16"
      >
        <ServiceIntro
          num={optimization.num}
          title={optimization.title}
          price={optimization.price}
          lead={optimization.lead}
          cta={optimization.cta}
        />

        <div className="grid gap-4">
          <div className="rounded-xl border border-hairline bg-surface px-[30px] pt-7 pb-7">
            <p className="mb-6 max-w-[620px] text-[15px] leading-[1.6] text-pretty text-body-text">
              {optimization.body}
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {optimization.areas.map((a) => (
                <div
                  key={a}
                  className="grid grid-cols-[10px_minmax(0,1fr)] gap-3 text-[14.5px] leading-[1.5] text-body-text"
                >
                  <Bullet />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Secondary — Ongoing AI Engineering */}
      <section className="mt-20 rounded-xl border border-hairline bg-surface px-[30px] py-7">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] lg:gap-16">
          <div>
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="m-0 font-heading text-[20px] font-semibold tracking-[-0.018em]">
                {ongoing.title}
              </h2>
              <span className="font-mono text-[13px] text-silver">{ongoing.price}</span>
            </div>
            <p className="mt-2 mb-0 text-[14px] leading-[1.6] text-pretty text-muted-foreground">
              {ongoing.body}
            </p>
          </div>
          <div className="flex flex-wrap content-start gap-2">
            {ongoing.items.map((i) => (
              <span
                key={i}
                className="rounded-md border border-hairline px-2.5 py-1.5 text-[13.5px] text-body-text"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How engagements run */}
      <section className="mt-24 grid items-start gap-10 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:gap-14">
        <div>
          <div className="eyebrow mb-3.5">How engagements run</div>
          <h2 className="mb-4 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
            No mandatory gate, no open-ended scope
          </h2>
          <p className="m-0 text-[15px] leading-[1.6] text-pretty text-muted-foreground">
            You may start with an audit, move directly into a focused implementation, or ask us to
            review an AI system you already run.
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
              <p className="m-0 text-[14.5px] leading-[1.6] text-pretty text-muted-foreground">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Decision-oriented close */}
      <section className="mt-24 rounded-[20px] border border-hairline-strong bg-[linear-gradient(140deg,rgba(200,204,212,0.10)_0%,rgba(200,204,212,0.02)_44%,#0F0F11_100%)] px-7 py-12 sm:px-14 sm:py-14">
        <h2 className="mb-8 font-heading text-[32px] leading-[1.08] font-semibold tracking-[-0.028em] text-balance sm:text-[40px]">
          {closing.title}
        </h2>
        <div className="mb-10 grid gap-px overflow-hidden rounded-xl border border-hairline bg-white/[0.08] sm:grid-cols-3">
          {closing.choices.map((c) => (
            <div key={c.label} className="bg-surface px-6 py-6">
              <div className="mb-1.5 text-[14px] leading-[1.4] text-muted-foreground">
                {c.label}
              </div>
              <div className="font-heading text-[19px] font-semibold tracking-[-0.018em] text-white">
                {c.body}
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => openCalendlyPopup()}
            className="btn-primary cursor-pointer px-6 py-[15px] text-[15px]"
          >
            {closing.primary}
          </button>
          <button
            onClick={() => openCalendlyPopup()}
            className="cursor-pointer rounded-lg border border-hairline-strong px-6 py-[15px] text-[15px] font-medium text-foreground transition-colors hover:border-white/45 hover:text-white"
          >
            {closing.secondary}
          </button>
        </div>
      </section>
    </div>
  );
}
