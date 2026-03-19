"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/components/context/auth-context";
import { LanguageProvider } from "@/components/context/language-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <LanguageProvider>{children}</LanguageProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
