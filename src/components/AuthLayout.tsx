import type { ReactNode } from "react";
import { HorizonWordmark } from "./Logo";

type Props = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-background lg:grid-cols-[1fr_minmax(420px,480px)]">
      {/* Left editorial panel */}
      <aside className="relative hidden overflow-hidden border-r border-border bg-surface-2 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <HorizonWordmark />
        <div className="relative z-10 max-w-md">
          <p
            className="text-[40px] font-semibold leading-[1.1] tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Money you can actually see.
          </p>
          <p className="mt-5 text-[14px] leading-relaxed text-muted-foreground">
            Horizon is a quiet, deliberate workspace for your personal finances —
            no noise, no dark patterns, no nudges. Just clarity in PKR.
          </p>
        </div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-subtle">
          Personal Finance · Karachi
        </div>
        {/* Decorative arcs */}
        <svg
          className="pointer-events-none absolute -bottom-24 -right-24 h-[480px] w-[480px] opacity-[0.08]"
          viewBox="0 0 200 200"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </aside>

      {/* Right form */}
      <main className="flex min-h-screen flex-col px-6 py-10 sm:px-12">
        <div className="lg:hidden">
          <HorizonWordmark />
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <div className="mx-auto w-full max-w-sm">
            <h1
              className="text-[28px] font-semibold leading-tight tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-6 text-[12px] text-muted-foreground">{footer}</div>
          </div>
        </div>
        <div className="mt-8 text-center text-[11px] uppercase tracking-[0.2em] text-subtle">
          © {new Date().getFullYear()} Horizon
        </div>
      </main>
    </div>
  );
}
