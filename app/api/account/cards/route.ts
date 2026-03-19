import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { getDb, SavedCard, usersCollection } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/server-user";

function normalizeCard(input: Record<string, unknown>, id?: string): SavedCard {
  const now = new Date();
  const rawNumber = String(input.cardNumber ?? input.last4 ?? "").replace(/\D/g, "");

  return {
    id: id ?? randomUUID(),
    holderName: String(input.holderName ?? "").trim(),
    brand: String(input.brand ?? "").trim() || "Card",
    last4: rawNumber.slice(-4),
    expMonth: String(input.expMonth ?? "").trim(),
    expYear: String(input.expYear ?? "").trim(),
    isDefault: Boolean(input.isDefault),
    createdAt: now,
    updatedAt: now,
  };
}

function validateCard(card: SavedCard): string | null {
  if (!card.holderName || !card.last4 || card.last4.length !== 4 || !card.expMonth || !card.expYear) {
    return "Please complete all required card fields.";
  }

  return null;
}

export async function GET() {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ items: user.savedCards ?? [] });
}

export async function POST(request: Request) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const newCard = normalizeCard(body);
  const validationError = validateCard(newCard);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const cards = [...(user.savedCards ?? [])];
  if (newCard.isDefault || cards.length === 0) {
    cards.forEach((card) => {
      card.isDefault = false;
    });
    newCard.isDefault = true;
  }
  cards.push(newCard);

  const db = await getDb();
  await usersCollection(db).updateOne(
    { _id: user._id },
    { $set: { savedCards: cards, updatedAt: new Date() } },
  );

  return NextResponse.json({ ok: true, items: cards });
}

export async function PATCH(request: Request) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const id = String(body.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "Card id is required." }, { status: 400 });
  }

  const cards = [...(user.savedCards ?? [])];
  const existing = cards.find((card) => card.id === id);
  if (!existing) {
    return NextResponse.json({ error: "Card not found." }, { status: 404 });
  }

  const updated = normalizeCard({ ...existing, ...body, last4: existing.last4 }, id);
  updated.createdAt = existing.createdAt;
  updated.last4 = body.cardNumber ? String(body.cardNumber).replace(/\D/g, "").slice(-4) : existing.last4;
  const validationError = validateCard(updated);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const nextCards = cards.map((card) => (card.id === id ? updated : card));
  if (updated.isDefault) {
    nextCards.forEach((card) => {
      card.isDefault = card.id === id;
    });
  }

  const db = await getDb();
  await usersCollection(db).updateOne(
    { _id: user._id },
    { $set: { savedCards: nextCards, updatedAt: new Date() } },
  );

  return NextResponse.json({ ok: true, items: nextCards });
}

export async function DELETE(request: Request) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const id = String(body.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "Card id is required." }, { status: 400 });
  }

  let nextCards = (user.savedCards ?? []).filter((card) => card.id !== id);
  if (nextCards.length > 0 && !nextCards.some((card) => card.isDefault)) {
    nextCards = nextCards.map((card, index) => ({
      ...card,
      isDefault: index === 0,
    }));
  }

  const db = await getDb();
  await usersCollection(db).updateOne(
    { _id: user._id },
    { $set: { savedCards: nextCards, updatedAt: new Date() } },
  );

  return NextResponse.json({ ok: true, items: nextCards });
}
