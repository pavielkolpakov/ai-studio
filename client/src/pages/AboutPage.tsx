import { ABOUT_STATS, TEAMS, VALUES, FITS, NON_FITS } from "@/data/site";

export function AboutPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-10">
      <header className="mb-13 max-w-[760px]">
        <div className="eyebrow mb-4">About</div>
        <h1 className="mb-[18px] font-heading text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[54px]">
          A small studio that stays small on purpose
        </h1>
        <p className="mb-4 text-[18px] leading-[1.55] text-pretty text-muted-foreground">
          Neuronetis is an AI engineering studio building production-grade AI systems for IT
          companies and software product teams — integrating AI into existing products, and building
          AI-native applications from the ground up.
        </p>
        <p className="m-0 text-[18px] leading-[1.55] text-pretty text-muted-foreground">
          We are distributed: lead engineers in Israel, the US and Eastern Europe, with delivery
          experience across the EU, Israel and North America. We work in European and
          overlap-friendly time zones, in English.
        </p>
      </header>

      <div className="mb-22 grid gap-px overflow-hidden rounded-xl border border-hairline bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
        {ABOUT_STATS.map((s) => (
          <div key={s.label} className="bg-surface px-[26px] py-7">
            <div className="font-heading text-[30px] font-semibold tracking-[-0.02em]">{s.value}</div>
            <div className="mt-1.5 text-[13.5px] leading-[1.4] text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <section className="mb-22">
        <h2 className="mb-7 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
          Three teams, senior on every project
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {TEAMS.map((t) => (
            <div
              key={t.name}
              className="rounded-[14px] border border-hairline bg-surface px-[30px] pt-[30px] pb-7"
            >
              <div className="mb-3.5 font-mono text-[10.5px] tracking-[0.12em] uppercase text-steel">
                {t.name}
              </div>
              <p className="m-0 text-[15px] leading-[1.6] text-body-text">{t.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[13.5px] text-dim-text">
          Each project is staffed with senior engineers from the relevant teams, scaled to the scope
          of the work.
        </p>
      </section>

      <section className="mb-22">
        <h2 className="mb-7 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
          How we operate
        </h2>
        <div className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-white/[0.08] sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-surface px-[30px] py-[26px]">
              <h3 className="mb-2 font-heading text-[17px] font-semibold tracking-[-0.015em]">
                {v.title}
              </h3>
              <p className="m-0 text-[14.5px] leading-[1.6] text-pretty text-muted-foreground">
                {v.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mb-22 grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <h2 className="mb-6 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
            Who we work with
          </h2>
          <div className="grid gap-3.5">
            {FITS.map((f) => (
              <div
                key={f}
                className="grid grid-cols-[14px_minmax(0,1fr)] gap-3.5 text-[15.5px] leading-[1.55] text-body-text"
              >
                <span className="text-steel">✓</span>
                <span>{f}</span>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[14.5px] leading-[1.6] text-pretty text-muted-foreground">
            We work best with a technical point of contact internally — a CTO, VP of Engineering or
            technical lead. We don't replace your team; we extend it with deep AI expertise.
          </p>
          <div className="mt-8 border-t border-white/10 pt-7">
            <div className="mb-4 font-mono text-[10.5px] tracking-[0.1em] uppercase text-dim-text">
              What we don't build
            </div>
            <div className="grid gap-3.5">
              {NON_FITS.map((f) => (
                <div
                  key={f}
                  className="grid grid-cols-[14px_minmax(0,1fr)] gap-3.5 text-[15.5px] leading-[1.55] text-dim-text"
                >
                  <span className="text-faint-text">✕</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[14.5px] leading-[1.6] text-pretty text-dim-text">
              Every engagement starts with understanding your actual problem, and we will tell you
              honestly if AI is not the right solution for it.
            </p>
          </div>
        </div>
        <img
          src="/office-view-graded.jpg"
          alt="The Neuronetis workspace"
          className="h-[420px] w-full rounded-[14px] border border-hairline object-cover"
        />
      </div>

      {/* <section>
        <h2 className="mb-7 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
          The people you'd actually work with
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PEOPLE.map((p) => (
            <div
              key={p.role}
              className="flex flex-col gap-4 rounded-[14px] border border-hairline bg-surface p-[22px]"
            >
              <ImagePlaceholder label="Photo" circle className="size-[76px] shrink-0" />
              <div>
                <div className="font-heading text-[17px] font-semibold tracking-[-0.015em]">
                  {p.name}
                </div>
                <div className="mt-1 text-[13.5px] text-muted-foreground">{p.role}</div>
                <div className="mt-2.5 font-mono text-[11px] text-dim-text">{p.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section> */}
    </div>
  );
}
