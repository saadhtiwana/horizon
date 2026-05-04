import type { ReactNode } from "react";
import { useCountUp } from "@/lib/useCountUp";

type Props = {
  label: string;
  value: string;
  /** If provided, the headline animates from 0 → numericValue and is formatted by `format`. */
  numericValue?: number;
  format?: (n: number) => string;
  trend?: {
    pct: number;
    label?: string;
  } | null;
  hint?: string;
  accent?: boolean;
  icon?: ReactNode;
};

export function StatCard({
  label,
  value,
  numericValue,
  format,
  trend,
  hint,
  accent,
  icon,
}: Props) {
  const animated = useCountUp(numericValue ?? 0, 900);
  const display =
    numericValue !== undefined && format ? format(animated) : value;

  return (
    <div
      className="lift group relative flex flex-col gap-5 overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-[var(--shadow-xs)]"
    >
      {/* subtle top sheen */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent opacity-60"
      />
      <div className="flex items-start justify-between">
        <span className="text-[10.5px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface-2 text-subtle transition-colors duration-300 group-hover:border-border-strong group-hover:text-foreground ${
              accent ? "border-primary/30 text-primary group-hover:text-primary" : ""
            }`}
          >
            {icon}
          </span>
        )}
      </div>
      <div
        className={`tabular-nums-feat text-[34px] font-semibold leading-none tracking-[-0.03em] ${
          accent ? "text-primary" : "text-foreground"
        }`}
      >
        {display}
      </div>
      <div className="flex items-center justify-between text-[12px]">
        {trend ? (
          <span
            className={`tabular-nums-feat inline-flex items-center gap-1 font-medium ${
              trend.pct >= 0 ? "text-success" : "text-danger"
            }`}
          >
            <span aria-hidden="true">{trend.pct >= 0 ? "↑" : "↓"}</span>
            {Math.abs(trend.pct).toFixed(1)}%
            {trend.label && <span className="text-muted-foreground">· {trend.label}</span>}
          </span>
        ) : (
          <span />
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}
