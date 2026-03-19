"use client";

import { createContext, useContext, useEffect, useState } from "react";

type LanguageContextValue = {
  language: string;
  setLanguage: (language: string) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("grabitt_language");
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    window.localStorage.setItem("grabitt_language", language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLanguageState }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
