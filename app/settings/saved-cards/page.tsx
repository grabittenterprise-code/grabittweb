"use client";

import { FormEvent, useEffect, useState } from "react";
import { CreditCard } from "lucide-react";

import { SettingsPageShell } from "@/components/settings/settings-page-shell";

type Card = {
  id: string;
  holderName: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault?: boolean;
};

const emptyCard = {
  holderName: "",
  brand: "",
  cardNumber: "",
  expMonth: "",
  expYear: "",
  isDefault: false,
};

export default function SavedCardsPage() {
  const [items, setItems] = useState<Card[]>([]);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState(emptyCard);
  const [state, setState] = useState("");

  const load = async () => {
    const response = await fetch("/api/account/cards");
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

    const response = await fetch("/api/account/cards", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setState(data.error ?? "Unable to save card.");
      return;
    }

    setItems(data.items ?? []);
    setEditingId("");
    setForm(emptyCard);
    setState("Card saved.");
  };

  const handleDelete = async (id: string) => {
    const response = await fetch("/api/account/cards", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      setItems(data.items ?? []);
    }
  };

  const startEdit = (card: Card) => {
    setEditingId(card.id);
    setForm({
      holderName: card.holderName,
      brand: card.brand,
      cardNumber: "",
      expMonth: card.expMonth,
      expYear: card.expYear,
      isDefault: Boolean(card.isDefault),
    });
  };

  return (
    <SettingsPageShell title="Saved Cards" description="Manage payment methods used for fast checkout.">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={form.holderName} onChange={(event) => setForm((prev) => ({ ...prev, holderName: event.target.value }))} placeholder="Card Holder Name" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
          <input value={form.brand} onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))} placeholder="Card Brand" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
          <input value={form.cardNumber} onChange={(event) => setForm((prev) => ({ ...prev, cardNumber: event.target.value }))} placeholder={editingId ? "Enter new card number to change last 4" : "Card Number"} className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
          <input value={form.expMonth} onChange={(event) => setForm((prev) => ({ ...prev, expMonth: event.target.value }))} placeholder="Exp Month" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
          <input value={form.expYear} onChange={(event) => setForm((prev) => ({ ...prev, expYear: event.target.value }))} placeholder="Exp Year" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white" />
        </div>
        <label className="flex items-center gap-2 text-sm text-white/75">
          <input type="checkbox" checked={form.isDefault} onChange={(event) => setForm((prev) => ({ ...prev, isDefault: event.target.checked }))} />
          Set as default card
        </label>
        <div className="flex gap-3">
          <button type="submit" className="rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.22em] text-white/85 transition hover:bg-white/10">
            {editingId ? "Update Card" : "Add Card"}
          </button>
          {editingId ? (
            <button type="button" onClick={() => { setEditingId(""); setForm(emptyCard); }} className="rounded-full border border-white/15 px-6 py-2 text-xs uppercase tracking-[0.22em] text-white/70">
              Cancel
            </button>
          ) : null}
        </div>
        {state ? <p className="text-sm text-white/65">{state}</p> : null}
      </form>

      <div className="mt-6 space-y-3">
        {items.map((card) => (
          <div key={card.id} className="flex items-center justify-between rounded-xl border border-white/15 bg-black/30 p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-[#8ba9ff]" />
              <div>
                <p className="text-sm text-white/90">{card.brand}{card.isDefault ? " (Default)" : ""}</p>
                <p className="text-xs text-white/60">**** {card.last4} · Expires {card.expMonth}/{card.expYear}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => startEdit(card)} className="text-xs uppercase tracking-[0.18em] text-white/70 hover:text-white/90">Edit</button>
              <button type="button" onClick={() => void handleDelete(card.id)} className="text-xs uppercase tracking-[0.18em] text-red-200">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </SettingsPageShell>
  );
}
