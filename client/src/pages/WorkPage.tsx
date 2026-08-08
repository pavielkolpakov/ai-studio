import { Link } from "react-router-dom";
import { CATALOG, SPOTLIGHTS, ASSISTANT_EXAMPLE } from "@/data/site";
import { ImagePlaceholder } from "@/components/site/ImagePlaceholder";

const TAG_CLASS =
  "rounded-[5px] border border-white/10 px-[9px] py-1 font-mono text-[11px] text-muted-foreground";

export function WorkPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-10">
      <header className="mb-14 max-w-[720px]">
        <div className="eyebrow mb-4">Work</div>
        <h1 className="mb-[18px] font-heading text-[40px] leading-[1.05] font-semibold tracking-[-0.03em] sm:text-[54px]">
          Twelve projects, priced before you ask
        </h1>
        <p className="m-0 text-[18px] leading-[1.55] text-pretty text-muted-foreground">
          Our catalog covers every major AI engineering use case, from a RAG MVP to an enterprise
          compliance platform. Every engagement is fixed-scope with a defined deliverable, timeline
          and price. The ranges below are typical — the exact number comes out of discovery.
        </p>
      </header>

      <div className="mb-24 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CATALOG.map((item) => (
          <div
            key={item.num}
            className="flex flex-col rounded-[14px] border border-hairline bg-surface px-[26px] pt-[26px] pb-[22px] transition-colors hover:border-white/25 hover:bg-[#131316]"
          >
            <div className="mb-4 font-mono text-[11px] tracking-[0.12em] text-dim-text">
              {item.num}
            </div>
            <h3 className="mb-2.5 font-heading text-[19px] leading-[1.25] font-semibold tracking-[-0.018em]">
              {item.title}
            </h3>
            <p className="mb-5 text-[14.5px] leading-[1.6] text-pretty text-muted-foreground">
              {item.body}
            </p>
            <div className="mt-auto border-t border-hairline pt-4 font-mono text-[11.5px] text-steel">
              {item.size}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 max-w-[720px]">
        <div className="eyebrow mb-4">Three in detail</div>
        <h2 className="m-0 font-heading text-[32px] leading-[1.12] font-semibold tracking-[-0.026em] sm:text-[36px]">
          What the work actually involves
        </h2>
      </div>

      {SPOTLIGHTS.map((s) => (
        <article
          key={s.title}
          className="grid items-start gap-10 border-t border-white/10 py-12 lg:grid-cols-2 lg:gap-14"
        >
          <div>
            <div className="mb-3.5 font-mono text-[10.5px] tracking-[0.12em] uppercase text-steel">
              {s.eyebrow}
            </div>
            <h3 className="mb-5 font-heading text-[28px] leading-[1.14] font-semibold tracking-[-0.026em] sm:text-[32px]">
              {s.title}
            </h3>
            <div className="mb-[26px] grid gap-[18px]">
              <div>
                <div className="mb-[7px] font-mono text-[10.5px] tracking-[0.1em] uppercase text-dim-text">
                  The problem
                </div>
                <p className="m-0 text-[15px] leading-[1.6] text-pretty text-body-text">{s.problem}</p>
              </div>
              <div>
                <div className="mb-[7px] font-mono text-[10.5px] tracking-[0.1em] uppercase text-dim-text">
                  How it's built
                </div>
                <p className="m-0 text-[15px] leading-[1.6] text-pretty text-body-text">{s.built}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-[7px]">
              {s.tags.map((t) => (
                <span key={t} className={TAG_CLASS}>{t}</span>
              ))}
            </div>
          </div>

          <div>
            <ImagePlaceholder label={s.slotLabel} className="mb-5 h-[260px]" />
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-hairline bg-white/[0.08]">
              {s.metrics.map((m) => (
                <div key={m.label} className="bg-surface px-4 py-[18px]">
                  <div className="font-heading text-[19px] font-semibold tracking-[-0.02em]">
                    {m.value}
                  </div>
                  <div className="mt-[5px] text-[12px] leading-[1.35] text-muted-foreground">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>
      ))}

      <section className="border-t border-white/10 pt-14">
        <div className="mx-auto mb-9 max-w-[660px] text-center">
          <div className="eyebrow mb-3.5">What the assistant returns</div>
          <h2 className="m-0 font-heading text-[30px] leading-[1.12] font-semibold tracking-[-0.026em] sm:text-[36px]">
            The same projects, matched to your stack
          </h2>
        </div>

        <div className="mx-auto max-w-[760px] overflow-hidden rounded-[14px] border border-white/[0.16] bg-surface-raised">
          <div className="flex items-center gap-2.5 border-b border-hairline bg-white/[0.035] px-6 py-3.5">
            <div className="size-[5px] rounded-full bg-steel" />
            <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-steel">
              Matched to: project 03
            </span>
          </div>
          <div className="px-6 pt-[30px] pb-8 sm:px-8">
            <h3 className="mb-3 font-heading text-[25px] leading-[1.2] font-semibold tracking-[-0.02em]">
              {ASSISTANT_EXAMPLE.title}
            </h3>
            <p className="mb-6 text-[15px] leading-[1.6] text-pretty text-muted-foreground">
              Because you said:{" "}
              <span className="text-foreground">"{ASSISTANT_EXAMPLE.because}"</span> One high-impact
              feature, scoped end to end, shipped inside the product you already maintain.
            </p>
            <div className="mb-[26px] grid gap-[11px]">
              {ASSISTANT_EXAMPLE.bullets.map((b) => (
                <div
                  key={b}
                  className="grid grid-cols-[16px_minmax(0,1fr)] gap-3 text-[14.5px] leading-[1.5] text-body-text"
                >
                  <span className="text-steel">↳</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-hairline pt-[22px]">
              <div className="flex gap-9">
                <div>
                  <div className="mb-[5px] font-mono text-[10.5px] tracking-[0.1em] uppercase text-dim-text">
                    Typical size
                  </div>
                  <div className="font-heading text-[19px] font-semibold">
                    {ASSISTANT_EXAMPLE.estimate}
                  </div>
                </div>
                <div>
                  <div className="mb-[5px] font-mono text-[10.5px] tracking-[0.1em] uppercase text-dim-text">
                    Timeline
                  </div>
                  <div className="font-heading text-[19px] font-semibold">
                    {ASSISTANT_EXAMPLE.timeline}
                  </div>
                </div>
              </div>
              <Link to="/" className="btn-primary px-[22px] py-3 text-sm">
                Get yours →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
