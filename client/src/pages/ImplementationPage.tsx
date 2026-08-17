import { IMPLEMENTATION_PAGE } from "@/data/site";

export function ImplementationPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-10">
      <header className="mb-13 max-w-[760px]">
        <div className="eyebrow mb-4">{IMPLEMENTATION_PAGE.eyebrow}</div>
        <h1 className="mb-[18px] font-heading text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] text-balance sm:text-[54px]">
          {IMPLEMENTATION_PAGE.headline}
        </h1>
        <p className="m-0 text-[18px] leading-[1.55] text-pretty text-muted-foreground">
          {IMPLEMENTATION_PAGE.sub}
        </p>
      </header>

      {/* Capabilities grouped around outcomes */}
      <section className="mb-22">
        <div className="grid gap-4 lg:grid-cols-3">
          {IMPLEMENTATION_PAGE.groups.map((g) => (
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

      {/* Principle */}
      <section className="mb-22 grid items-start gap-10 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:gap-14">
        <h2 className="font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em] text-balance">
          {IMPLEMENTATION_PAGE.principle.title}
        </h2>
        <p className="m-0 max-w-[640px] text-[17px] leading-[1.6] text-pretty text-muted-foreground">
          {IMPLEMENTATION_PAGE.principle.body}
        </p>
      </section>

      {/* How delivery works */}
      <section className="mb-22">
        <h2 className="mb-7 font-heading text-[32px] leading-[1.15] font-semibold tracking-[-0.026em]">
          How delivery works
        </h2>
        <div className="grid gap-px overflow-hidden rounded-xl border border-hairline bg-white/[0.08] sm:grid-cols-2">
          {IMPLEMENTATION_PAGE.delivery.map((d) => (
            <div key={d} className="grid grid-cols-[14px_minmax(0,1fr)] gap-3.5 bg-surface px-[30px] py-[24px] text-[15px] leading-[1.55] text-body-text">
              <span className="text-steel">✓</span>
              <span>{d}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
