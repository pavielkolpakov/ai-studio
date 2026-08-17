import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-[1200px] px-5 py-[120px] text-center sm:px-10">
      <div className="eyebrow mb-[26px]">404</div>
      <h1 className="mb-[22px] font-heading text-[42px] leading-[1.03] font-semibold tracking-[-0.03em] text-balance sm:text-[54px]">
        This page doesn't exist.
      </h1>
      <p className="mx-auto mb-9 max-w-[560px] text-[19px] leading-[1.55] text-pretty text-muted-foreground">
        The link may be outdated. Start from the Opportunity Scanner instead.
      </p>
      <Link to="/" className="btn-primary inline-block px-6 py-[13px] text-[15px]">
        Run the AI Opportunity Scanner
      </Link>
    </section>
  );
}
