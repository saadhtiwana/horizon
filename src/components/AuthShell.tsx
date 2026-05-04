import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";

const PUBLIC_PATHS = new Set(["/login", "/signup"]);

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, hydrated } = useAuth();
  const navigate = useNavigate();
  const { location } = useRouterState();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    const isPublic = PUBLIC_PATHS.has(location.pathname);
    if (!user && !isPublic) {
      navigate({ to: "/login", replace: true });
      return;
    }
    if (user && isPublic) {
      navigate({ to: "/", replace: true });
      return;
    }
    setChecked(true);
  }, [hydrated, user, location.pathname, navigate]);

  if (!hydrated || !checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-[12px] uppercase tracking-[0.2em] text-subtle">Loading</div>
      </div>
    );
  }
  return <>{children}</>;
}

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) navigate({ to: "/", replace: true });
  }, [user, navigate]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const result = mode === "login" ? login(username, password) : signup(username, password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate({ to: "/", replace: true });
  };

  const inputCls =
    "press h-11 w-full rounded-lg border border-border-strong bg-surface px-3.5 text-[14px] text-foreground placeholder:text-subtle focus:focus-halo";
  const labelCls = "text-[10.5px] font-medium uppercase tracking-[0.1em] text-muted-foreground";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Username</span>
        <input
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputCls}
          placeholder="Enter your username"
          required
          autoFocus
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className={labelCls}>Password</span>
        <input
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
          placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"}
          required
          minLength={mode === "signup" ? 6 : undefined}
        />
      </label>
      {error && (
        <div className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-[12px] text-danger">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={busy}
        className="press inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-[13.5px] font-semibold text-primary-foreground shadow-[var(--shadow-xs)] hover:bg-primary-glow hover:shadow-[var(--shadow-glow)] disabled:opacity-60"
      >
        {mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
