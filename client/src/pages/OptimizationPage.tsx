import { OPTIMIZATION_PAGE } from "@/data/site";

export function OptimizationPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-10">
      <header className="mb-13 max-w-[760px]">
        <div className="eyebrow mb-4">{OPTIMIZATION_PAGE.eyebrow}</div>
        <h1 className="mb-[18px] font-heading text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-[54px]">
          {OPTIMIZATION_PAGE.headline}
        </h1>
        <p className="m-0 text-[18px] leading-[1.55] text-pretty text-muted-foreground">
          {OPTIMIZATION_PAGE.sub}
        </p>
      </header>

      {/* Improvement areas */}
      <section className="mb-22">
        <div className="grid gap-4 sm:grid-cols-2">
          {OPTIMIZATION_PAGE.groups.map((g) => (
            <div
              key={g.title}
              className="rounded-[14px] border border-hairline bg-surface px-[30px] pt-[30px] pb-7"
            >
              <div className="mb-4 font-mono text-[10.5px] tracking-[0.12em] uppercase text-steel">
                {g.title}
              </div>
              <div className="grid gap-3">
                {g.items.map((item) => (
                  <div
                    key={item}
                    className="grid grid-cols-[10px_minmax(0,1fr)] gap-3 text-[14.5px] leading-[1.55] text-body-text"
                  >
                    <span
                      aria-hidden
                      className="mt-[8px] h-[5px] w-[5px] shrink-0 rotate-45 bg-gold/70"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Outcome */}
      <section className="rounded-[20px] border border-hairline-strong bg-[linear-gradient(140deg,rgba(212,175,55,0.10)_0%,rgba(212,175,55,0.02)_44%,#0F0F11_100%)] px-7 py-12 sm:px-14 sm:py-14">
        <p className="m-0 max-w-[760px] font-heading text-[24px] leading-[1.3] font-semibold tracking-[-0.02em] text-balance text-foreground sm:text-[28px]">
          {OPTIMIZATION_PAGE.outcome}
        </p>
      </section>
    </div>
  );
}
