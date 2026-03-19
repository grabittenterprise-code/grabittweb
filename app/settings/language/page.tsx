"use client";

import { useEffect, useState } from "react";

import { useLanguage } from "@/components/context/language-context";
import { SettingsPageShell } from "@/components/settings/settings-page-shell";

const languages = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
  { label: "Tamil", value: "ta" },
  { label: "Telugu", value: "te" },
  { label: "Kannada", value: "kn" },
  { label: "Malayalam", value: "ml" },
  { label: "Marathi", value: "mr" },
  { label: "Bengali", value: "bn" },
];

export default function LanguagePage() {
  const { language, setLanguage } = useLanguage();
  const [state, setState] = useState("");

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/account/settings");
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.preferences?.language) {
        setLanguage(data.preferences.language);
      }
    };

    void load();
  }, [setLanguage]);

  const updateLanguage = async (nextLanguage: string) => {
    setLanguage(nextLanguage);
    const response = await fetch("/api/account/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        preferences: {
          language: nextLanguage,
        },
      }),
    });
    const data = await response.json().catch(() => ({}));
    setState(response.ok ? "Language preference saved for the website." : data.error ?? "Unable to save language.");
  };

  return (
    <SettingsPageShell title="Select Language" description="Choose your preferred language for the GRABITT experience.">
      <div className="flex flex-wrap gap-2">
        {languages.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => void updateLanguage(item.value)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              language === item.value
                ? "border-white/35 bg-white/10 text-white"
                : "border-white/15 bg-black/30 text-white/80 hover:bg-white/10"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      {state ? <p className="mt-4 text-sm text-white/65">{state}</p> : null}
    </SettingsPageShell>
  );
}
