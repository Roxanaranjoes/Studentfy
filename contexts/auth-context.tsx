'use client';

import { useRouter } from "next/navigation";
import {
  createContext,
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";

import { authApi } from "@/lib/api";
import { AUTH_COOKIE_NAME, USER_STORAGE_KEY } from "@/lib/constants";
import { LoginRequest, LoginResponse, RegisterRequest } from "@/lib/types";

type AuthUser = {
  username?: string | null;
  role?: string | null;
  expiresAtUtc?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isReady: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => void;
  applySession: (session: LoginResponse) => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

function parseStoredUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const storedToken = Cookies.get(AUTH_COOKIE_NAME) ?? null;
    const storedUser = typeof window !== "undefined" ? parseStoredUser() : null;

    startTransition(() => {
      setToken(storedToken);
      setUser(storedUser);
      setIsReady(true);
    });
  }, []);

  const persistSession = useCallback((session: LoginResponse) => {
    const expires =
      session.expiresAtUtc && !Number.isNaN(Date.parse(session.expiresAtUtc))
        ? new Date(session.expiresAtUtc)
        : undefined;

    Cookies.set(AUTH_COOKIE_NAME, session.token, {
      expires: expires ?? 7,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const sessionUser: AuthUser = {
      username: session.username ?? null,
      role: session.role ?? null,
      expiresAtUtc: session.expiresAtUtc ?? null,
    };

    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sessionUser));
    setToken(session.token);
    setUser(sessionUser);
  }, []);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const response = await authApi.login(credentials);
      persistSession(response);
      return response;
    },
    [persistSession],
  );

  const register = useCallback(async (payload: RegisterRequest) => {
    await authApi.register(payload);
  }, []);

  const logout = useCallback(() => {
    Cookies.remove(AUTH_COOKIE_NAME);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
    router.push("/login");
  }, [router]);

  const applySession = useCallback(
    (session: LoginResponse) => {
      persistSession(session);
    },
    [persistSession],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isReady,
      login,
      register,
      logout,
      applySession,
    }),
    [user, token, isReady, login, register, logout, applySession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
