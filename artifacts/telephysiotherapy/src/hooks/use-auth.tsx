import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const TOKEN_KEY = "auth_token";
const PATIENT_ID_KEY = "patientId";
const PATIENT_NAME_KEY = "patientName";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  age?: number | null;
  gender?: string | null;
  occupation?: string | null;
  fees?: string | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  const id = localStorage.getItem(PATIENT_ID_KEY);
  const name = localStorage.getItem(PATIENT_NAME_KEY);
  if (!id || !name) return null;
  const parsed = parseInt(id, 10);
  if (Number.isNaN(parsed)) return null;
  return { id: parsed, name, email: "", phone: "" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    setToken(storedToken);
    setUser(readStoredUser());

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${storedToken}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("unauthenticated");
        return (await res.json()) as AuthUser;
      })
      .then((freshUser) => {
        if (cancelled) return;
        setUser(freshUser);
        localStorage.setItem(PATIENT_ID_KEY, String(freshUser.id));
        localStorage.setItem(PATIENT_NAME_KEY, freshUser.name);
      })
      .catch(() => {
        if (cancelled) return;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(PATIENT_ID_KEY);
        localStorage.removeItem(PATIENT_NAME_KEY);
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const setSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(PATIENT_ID_KEY, String(nextUser.id));
    localStorage.setItem(PATIENT_NAME_KEY, nextUser.name);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(PATIENT_ID_KEY);
    localStorage.removeItem(PATIENT_NAME_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isLoading, setSession, logout }),
    [user, token, isLoading, setSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
