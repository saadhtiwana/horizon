import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart as PieIcon,
  Wallet,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
} from "lucide-react";
import { HorizonMark, HorizonWordmark } from "./Logo";
import { useAuth } from "@/lib/auth";
import saadAvatar from "@/assets/saad.png";

type NavItem = {
  to: "/" | "/transactions" | "/budgets" | "/insights";
  label: string;
  icon: typeof LayoutDashboard;
};

const NAV: NavItem[] = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/budgets", label: "Budgets", icon: Wallet },
  { to: "/insights", label: "Insights", icon: PieIcon },
];

const STORAGE_KEY = "horizon.sidebar.collapsed";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { location } = useRouterState();
  const { user, logout } = useAuth();
  const path = location.pathname;
  const initial = (user?.username ?? "?").slice(0, 1).toUpperCase();

  useEffect(() => {
    const v = window.localStorage.getItem(STORAGE_KEY);
    if (v === "1") setCollapsed(true);
  }, []);

  const toggle = () => {
    setCollapsed((c) => {
      const next = !c;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <aside
      className={`shrink-0 border-r border-border bg-background transition-[width] duration-200 ease-out ${
        collapsed ? "w-[64px]" : "w-[232px]"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-[60px] items-center justify-between border-b border-border px-3">
          {collapsed ? (
            <div className="flex w-full justify-center">
              <HorizonMark size={26} />
            </div>
          ) : (
            <HorizonWordmark className="px-1" />
          )}
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-0.5">
            {NAV.map((item) => {
              const active = path === item.to;
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`group flex items-center gap-3 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors ${
                      active
                        ? "bg-surface-2 text-foreground"
                        : "text-muted-foreground hover:bg-surface hover:text-foreground"
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon
                      size={16}
                      strokeWidth={2}
                      className={
                        active ? "text-primary" : "text-subtle group-hover:text-muted-foreground"
                      }
                    />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && active && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-1 border-t border-border p-2">
          {user && (
            <div
              className={`flex items-center gap-2.5 rounded-md px-2 py-2 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-[11px] font-semibold text-primary-foreground ring-1 ring-border-strong">
                {user.username.toLowerCase() === "saad" ? (
                  <img src={saadAvatar} alt="Saad" className="h-full w-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-semibold text-foreground">
                      Hi {user.username}
                    </div>
                    <div className="truncate text-[10px] uppercase tracking-[0.1em] text-subtle">
                      Signed in
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-subtle hover:bg-surface-2 hover:text-danger"
                    aria-label="Sign out"
                    title="Sign out"
                  >
                    <LogOut size={14} />
                  </button>
                </>
              )}
            </div>
          )}
          <button
            type="button"
            onClick={toggle}
            className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-[12px] font-medium text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronsRight size={16} className="mx-auto" />
            ) : (
              <>
                <ChevronsLeft size={16} className="text-subtle" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
