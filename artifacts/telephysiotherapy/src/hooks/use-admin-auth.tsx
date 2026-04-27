import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const ADMIN_TOKEN_KEY = "admin_token";
const ADMIN_NAME_KEY = "admin_name";
const ADMIN_EMAIL_KEY = "admin_email";

export interface AdminInfo {
  email: string;
  name: string;
}

interface AdminAuthContextValue {
  admin: AdminInfo | null;
  token: string | null;
  isLoading: boolean;
  setSession: (token: string, admin: AdminInfo) => void;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    setToken(storedToken);

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    fetch("/api/admin/me", {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("unauthenticated");
        return (await res.json()) as AdminInfo;
      })
      .then((freshAdmin) => {
        if (cancelled) return;
        setAdmin(freshAdmin);
        localStorage.setItem(ADMIN_NAME_KEY, freshAdmin.name);
        localStorage.setItem(ADMIN_EMAIL_KEY, freshAdmin.email);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        localStorage.removeItem(ADMIN_NAME_KEY);
        localStorage.removeItem(ADMIN_EMAIL_KEY);
        setToken(null);
        setAdmin(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setSession = useCallback((nextToken: string, nextAdmin: AdminInfo) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, nextToken);
    localStorage.setItem(ADMIN_NAME_KEY, nextAdmin.name);
    localStorage.setItem(ADMIN_EMAIL_KEY, nextAdmin.email);
    setToken(nextToken);
    setAdmin(nextAdmin);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_NAME_KEY);
    localStorage.removeItem(ADMIN_EMAIL_KEY);
    setToken(null);
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({ admin, token, isLoading, setSession, logout }),
    [admin, token, isLoading, setSession, logout],
  );

  return (
    <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
