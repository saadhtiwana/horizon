export function formatCurrency(value: number, opts?: { compact?: boolean }): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "−" : "";
  if (opts?.compact && abs >= 1000) {
    const fmt = new Intl.NumberFormat("en-PK", {
      notation: "compact",
      maximumFractionDigits: 1,
    });
    return `${sign}Rs ${fmt.format(abs)}`;
  }
  const fmt = new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${sign}Rs ${fmt.format(abs)}`;
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
