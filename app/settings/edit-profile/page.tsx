"use client";

import { FormEvent, useEffect, useState } from "react";

import { SettingsPageShell } from "@/components/settings/settings-page-shell";

export default function EditProfilePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [state, setState] = useState("");

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/account/settings");
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setState(data.error ?? "Unable to load profile.");
        return;
      }

      setFullName(data.profile?.fullName ?? "");
      setEmail(data.profile?.email ?? "");
      setPhone(data.profile?.phone ?? "");
    };

    void load();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setState("");

    try {
      const response = await fetch("/api/account/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: { fullName, phone },
        }),
      });
      const data = await response.json().catch(() => ({}));
      setState(response.ok ? "Profile updated successfully." : data.error ?? "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsPageShell title="Edit Profile" description="Update your personal details and identity settings.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Full Name</span>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Email Address</span>
          <input
            value={email}
            disabled
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/60"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-white/70">Phone Number</span>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="mt-2 rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.22em] text-white/85 transition hover:bg-white/10 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
        {state ? <p className="text-sm text-white/65">{state}</p> : null}
      </form>
    </SettingsPageShell>
  );
}
