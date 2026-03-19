"use client";

import { FormEvent, useEffect, useState } from "react";

import { SettingsPageShell } from "@/components/settings/settings-page-shell";

export default function SellWithGrabittPage() {
  const [form, setForm] = useState({
    businessName: "",
    contactName: "",
    phone: "",
    category: "",
    website: "",
    message: "",
  });
  const [latestStatus, setLatestStatus] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/account/seller-application");
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.application) {
        setLatestStatus(data.application.status);
      }
    };

    void load();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch("/api/account/seller-application", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await response.json().catch(() => ({}));
    setState(response.ok ? "Seller application submitted successfully." : data.error ?? "Unable to submit application.");
    if (response.ok) {
      setLatestStatus("new");
    }
  };

  return (
    <SettingsPageShell title="Sell with GRABITT" description="Join as a partner and list your products for a premium skincare audience.">
      <form className="space-y-3" onSubmit={handleSubmit}>
        {latestStatus ? <p className="rounded-xl border border-white/15 bg-black/30 p-4 text-sm text-white/75">Latest application status: {latestStatus.replaceAll("_", " ")}</p> : null}
        <input value={form.businessName} onChange={(event) => setForm((prev) => ({ ...prev, businessName: event.target.value }))} placeholder="Business Name" className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
        <input value={form.contactName} onChange={(event) => setForm((prev) => ({ ...prev, contactName: event.target.value }))} placeholder="Contact Name" className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
        <input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone Number" className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
        <input value={form.category} onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))} placeholder="Product Category" className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
        <input value={form.website} onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))} placeholder="Website (Optional)" className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
        <textarea value={form.message} onChange={(event) => setForm((prev) => ({ ...prev, message: event.target.value }))} placeholder="Tell us about your brand and products..." rows={6} className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
        <button type="submit" className="rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.22em] text-white/85 transition hover:bg-white/10">
          Submit Application
        </button>
        {state ? <p className="text-sm text-white/65">{state}</p> : null}
      </form>
    </SettingsPageShell>
  );
}
