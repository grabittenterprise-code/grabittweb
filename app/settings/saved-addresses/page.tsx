"use client";

import { FormEvent, useEffect, useState } from "react";
import { MapPin } from "lucide-react";

import { SettingsPageShell } from "@/components/settings/settings-page-shell";

type Address = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

const emptyAddress = {
  label: "",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

export default function SavedAddressesPage() {
  const [items, setItems] = useState<Address[]>([]);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyAddress);
  const [state, setState] = useState("");

  const load = async () => {
    const response = await fetch("/api/account/addresses");
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setItems(data.items ?? []);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setState("");

    const response = await fetch("/api/account/addresses", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setState(data.error ?? "Unable to save address.");
      return;
    }

    setItems(data.items ?? []);
    setEditingId("");
    setForm(emptyAddress);
    setState("Address saved.");
  };

  const handleDelete = async (id: string) => {
    const response = await fetch("/api/account/addresses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setItems(data.items ?? []);
    }
  };

  const startEdit = (address: Address) => {
    setEditingId(address.id);
    setForm({
      label: address.label,
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: Boolean(address.isDefault),
    });
  };

  return (
    <SettingsPageShell title="Saved Addresses" description="Keep your delivery locations updated for faster checkout.">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={form.label} onChange={(event) => setForm((prev) => ({ ...prev, label: event.target.value }))} placeholder="Label" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
          <input value={form.fullName} onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))} placeholder="Full Name" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
          <input value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} placeholder="Phone" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
          <input value={form.line1} onChange={(event) => setForm((prev) => ({ ...prev, line1: event.target.value }))} placeholder="Address Line 1" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
          <input value={form.line2} onChange={(event) => setForm((prev) => ({ ...prev, line2: event.target.value }))} placeholder="Address Line 2" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
          <input value={form.city} onChange={(event) => setForm((prev) => ({ ...prev, city: event.target.value }))} placeholder="City" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
          <input value={form.state} onChange={(event) => setForm((prev) => ({ ...prev, state: event.target.value }))} placeholder="State" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
          <input value={form.postalCode} onChange={(event) => setForm((prev) => ({ ...prev, postalCode: event.target.value }))} placeholder="PIN Code" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
        </div>
        <label className="flex items-center gap-2 text-sm text-white/75">
          <input type="checkbox" checked={form.isDefault} onChange={(event) => setForm((prev) => ({ ...prev, isDefault: event.target.checked }))} />
          Set as default address
        </label>
        <div className="flex gap-3">
          <button type="submit" className="rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.22em] text-white/85 transition hover:bg-white/10">
            {editingId ? "Update Address" : "Add Address"}
          </button>
          {editingId ? (
            <button type="button" onClick={() => { setEditingId(""); setForm(emptyAddress); }} className="rounded-full border border-white/15 px-6 py-2 text-xs uppercase tracking-[0.22em] text-white/70">
              Cancel
            </button>
          ) : null}
        </div>
        {state ? <p className="text-sm text-white/65">{state}</p> : null}
      </form>

      <div className="mt-6 space-y-3">
        {items.map((address) => (
          <div key={address.id} className="rounded-xl border border-white/15 bg-black/30 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#8ba9ff]" />
                <p className="text-sm text-white/90">{address.label}{address.isDefault ? " (Default)" : ""}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => startEdit(address)} className="text-xs uppercase tracking-[0.18em] text-white/70 hover:text-white/90">Edit</button>
                <button type="button" onClick={() => void handleDelete(address.id)} className="text-xs uppercase tracking-[0.18em] text-red-200">Delete</button>
              </div>
            </div>
            <p className="mt-2 text-sm text-white/65">
              {address.fullName}, {address.line1}, {address.line2 ? `${address.line2}, ` : ""}{address.city}, {address.state} {address.postalCode}
            </p>
            <p className="mt-1 text-sm text-white/50">{address.phone}</p>
          </div>
        ))}
      </div>
    </SettingsPageShell>
  );
}
