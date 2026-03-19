import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { requireAdminOrResponse } from "@/app/api/admin/_utils";
import { getDb, ordersCollection, OrderStatus } from "@/lib/db";

const ALLOWED_STATUSES = new Set([
  "pending",
  "paid",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
]);

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const status = String(body.status ?? "").trim();
  if (!ALLOWED_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const db = await getDb();
  await ordersCollection(db).updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { status: status as OrderStatus, updatedAt: new Date() } },
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
  }

  const db = await getDb();
  await ordersCollection(db).deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ ok: true });
}
