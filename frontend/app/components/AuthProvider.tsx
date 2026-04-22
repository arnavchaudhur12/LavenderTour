'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type AuthSession = {
  token: string;
  firstName: string;
  email: string;
  role: string;
  displayName: string;
  expiresAt: number;
};

type AuthContextValue = {
  session: AuthSession | null;
  login: (session: Omit<AuthSession, 'displayName' | 'expiresAt'>) => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = 'lavendertour.auth';
const AUTH_SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed.expiresAt || parsed.expiresAt < Date.now()) {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }
      setSession(parsed);
    } catch {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      login: (nextSession) => {
        const persisted: AuthSession = {
          ...nextSession,
          displayName: createDisplayName(nextSession.firstName, nextSession.email),
          expiresAt: Date.now() + AUTH_SESSION_TTL_MS,
        };
        setSession(persisted);
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(persisted));
      },
      logout: () => {
        setSession(null);
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      },
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

function createDisplayName(firstName: string, email: string) {
  const normalizedFirstName = firstName.trim();
  if (normalizedFirstName) {
    return normalizedFirstName;
  }

  const localPart = email.split('@')[0] ?? email;
  return localPart
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
