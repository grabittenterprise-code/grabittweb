import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDb, ordersCollection } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/server-user";

const NON_CANCELLABLE_STATUSES = new Set(["shipped", "out_for_delivery", "delivered", "cancelled"]);

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
  }

  const db = await getDb();
  const orderId = new ObjectId(params.id);
  const order = await ordersCollection(db).findOne({ _id: orderId, userId: user._id });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (NON_CANCELLABLE_STATUSES.has(order.status)) {
    return NextResponse.json(
      { error: "This order can no longer be cancelled because it has already been shipped or completed." },
      { status: 400 },
    );
  }

  await ordersCollection(db).updateOne(
    { _id: orderId, userId: user._id },
    { $set: { status: "cancelled", updatedAt: new Date() } },
  );

  return NextResponse.json({ ok: true, status: "cancelled" });
}
