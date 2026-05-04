type Props = {
  size?: number;
  className?: string;
};

/**
 * Horizon mark — three offset arcs forming a parallax horizon,
 * intersected by a single vertical meridian. Geometric, not literal.
 */
export function HorizonMark({ size = 28, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="6.5"
        stroke="var(--color-border-strong)"
      />
      {/* meridian */}
      <line
        x1="16"
        y1="6"
        x2="16"
        y2="26"
        stroke="var(--color-border-strong)"
        strokeWidth="1"
      />
      {/* far arc */}
      <path
        d="M6 19 Q 16 13 26 19"
        stroke="var(--color-subtle)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* mid arc */}
      <path
        d="M6 22 Q 16 16 26 22"
        stroke="var(--color-muted-foreground)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* near arc — accent */}
      <path
        d="M6 25 Q 16 19 26 25"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* meridian dot */}
      <circle cx="16" cy="13" r="1.75" fill="var(--color-primary)" />
    </svg>
  );
}

export function HorizonWordmark({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className ?? ""}`}>
      <HorizonMark size={26} />
      <span
        className="text-[19px] leading-none tracking-tight text-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Horizon
      </span>
    </div>
  );
}
