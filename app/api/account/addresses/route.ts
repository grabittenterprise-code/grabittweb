import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { getDb, SavedAddress, usersCollection } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/server-user";

function normalizeAddress(input: Record<string, unknown>, id?: string): SavedAddress {
  const now = new Date();
  return {
    id: id ?? randomUUID(),
    label: String(input.label ?? "").trim() || "Address",
    fullName: String(input.fullName ?? "").trim(),
    phone: String(input.phone ?? "").trim(),
    line1: String(input.line1 ?? "").trim(),
    line2: String(input.line2 ?? "").trim() || undefined,
    city: String(input.city ?? "").trim(),
    state: String(input.state ?? "").trim(),
    postalCode: String(input.postalCode ?? "").trim(),
    country: String(input.country ?? "India").trim(),
    isDefault: Boolean(input.isDefault),
    createdAt: now,
    updatedAt: now,
  };
}

function validateAddress(address: SavedAddress): string | null {
  if (!address.fullName || !address.phone || !address.line1 || !address.city || !address.state || !address.postalCode) {
    return "Please complete all required address fields.";
  }

  return null;
}

export async function GET() {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ items: user.savedAddresses ?? [] });
}

export async function POST(request: Request) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const newAddress = normalizeAddress(body);
  const validationError = validateAddress(newAddress);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const addresses = [...(user.savedAddresses ?? [])];
  if (newAddress.isDefault || addresses.length === 0) {
    addresses.forEach((address) => {
      address.isDefault = false;
    });
    newAddress.isDefault = true;
  }
  addresses.push(newAddress);

  const db = await getDb();
  await usersCollection(db).updateOne(
    { _id: user._id },
    { $set: { savedAddresses: addresses, updatedAt: new Date() } },
  );

  return NextResponse.json({ ok: true, items: addresses });
}

export async function PATCH(request: Request) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const id = String(body.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "Address id is required." }, { status: 400 });
  }

  const addresses = [...(user.savedAddresses ?? [])];
  const existing = addresses.find((address) => address.id === id);
  if (!existing) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  const updated = normalizeAddress(body, id);
  updated.createdAt = existing.createdAt;
  const validationError = validateAddress(updated);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const nextAddresses = addresses.map((address) => (address.id === id ? updated : address));
  if (updated.isDefault) {
    nextAddresses.forEach((address) => {
      address.isDefault = address.id === id;
    });
  }

  const db = await getDb();
  await usersCollection(db).updateOne(
    { _id: user._id },
    { $set: { savedAddresses: nextAddresses, updatedAt: new Date() } },
  );

  return NextResponse.json({ ok: true, items: nextAddresses });
}

export async function DELETE(request: Request) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const id = String(body.id ?? "").trim();
  if (!id) {
    return NextResponse.json({ error: "Address id is required." }, { status: 400 });
  }

  let nextAddresses = (user.savedAddresses ?? []).filter((address) => address.id !== id);
  if (nextAddresses.length > 0 && !nextAddresses.some((address) => address.isDefault)) {
    nextAddresses = nextAddresses.map((address, index) => ({
      ...address,
      isDefault: index === 0,
    }));
  }

  const db = await getDb();
  await usersCollection(db).updateOne(
    { _id: user._id },
    { $set: { savedAddresses: nextAddresses, updatedAt: new Date() } },
  );

  return NextResponse.json({ ok: true, items: nextAddresses });
}
