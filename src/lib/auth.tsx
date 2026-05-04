import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const SESSION_KEY = "horizon.session.v1";
const USERS_KEY = "horizon.users.v1";

// Hardcoded primary user — always available
const PRIMARY_USER = {
  username: "Saad",
  password: "jess123",
};

type StoredUser = {
  username: string;
  password: string;
};

export type SessionUser = {
  username: string;
};

type AuthContextValue = {
  user: SessionUser | null;
  hydrated: boolean;
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string };
  signup: (
    username: string,
    password: string,
  ) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function findUser(username: string): StoredUser | null {
  const lower = username.trim().toLowerCase();
  if (lower === PRIMARY_USER.username.toLowerCase()) return PRIMARY_USER;
  const users = readUsers();
  return users.find((u) => u.username.toLowerCase() === lower) ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  const persistSession = (next: SessionUser | null) => {
    setUser(next);
    if (next) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  };

  const login: AuthContextValue["login"] = (username, password) => {
    const trimmedUser = username.trim();
    const found = findUser(trimmedUser);
    if (!found) {
      return { ok: false, error: "No account found with that username." };
    }
    if (found.password !== password) {
      return { ok: false, error: "Incorrect password." };
    }
    persistSession({ username: found.username });
    return { ok: true };
  };

  const signup: AuthContextValue["signup"] = (username, password) => {
    const trimmedUser = username.trim();
    if (trimmedUser.length < 2) {
      return { ok: false, error: "Username must be at least 2 characters." };
    }
    if (password.length < 6) {
      return { ok: false, error: "Password must be at least 6 characters." };
    }
    if (findUser(trimmedUser)) {
      return { ok: false, error: "An account with that username already exists." };
    }
    const users = readUsers();
    users.push({ username: trimmedUser, password });
    writeUsers(users);
    persistSession({ username: trimmedUser });
    return { ok: true };
  };

  const logout = () => persistSession(null);

  return (
    <AuthContext.Provider value={{ user, hydrated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
