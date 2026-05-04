import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { AuthGate } from "./AuthShell";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </AuthGate>
  );
}

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className="animate-fade flex items-end justify-between gap-6 border-b border-border px-8 py-7">
      <div className="min-w-0">
        <h1 className="text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

export function PageBody({ children }: { children: ReactNode }) {
  return <div className="animate-rise px-8 py-7">{children}</div>;
}
