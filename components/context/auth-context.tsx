"use client";

import { signOut, useSession } from "next-auth/react";
import { createContext, useContext, useMemo } from "react";

type AuthContextValue = {
  isAuthenticated: boolean;
  authStatus: "loading" | "authenticated" | "unauthenticated";
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const login = () => {};
  const logout = () => {
    signOut({ redirect: false });
  };

  const value = useMemo(
    () => ({ isAuthenticated, authStatus: status, login, logout }),
    [isAuthenticated, status],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
