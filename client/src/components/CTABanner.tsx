import type { CTA } from "@/types/chat";

interface Props {
  cta: CTA;
}

export function CTABanner({ cta }: Props) {
  return (
    <div className="mt-3 border-t border-border/50 pt-2">
      <a
        href={cta.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
      >
        {cta.label}
        <span aria-hidden>→</span>
      </a>
    </div>
  );
}
