interface Props {
  label: string;
  className?: string;
  circle?: boolean;
}

/** Stand-in for artwork not yet supplied — the design canvas's <image-slot>. */
export function ImagePlaceholder({ label, className = "", circle }: Props) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden border border-hairline bg-surface-sunken p-4 text-center ${
        circle ? "rounded-full" : "rounded-xl"
      } ${className}`}
    >
      <span className="font-mono text-[11px] leading-[1.5] text-dim-text">{label}</span>
    </div>
  );
}
