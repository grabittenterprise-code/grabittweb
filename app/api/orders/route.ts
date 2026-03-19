import { NextResponse } from "next/server";

import { ensureDbIndexes, getDb, ordersCollection, OrderStatus } from "@/lib/db";
import { PRODUCT_PRICING } from "@/lib/pricing";
import { getOrCreateSessionUser } from "@/lib/server-user";

const SAMPLE_ITEMS = [
  { name: "GRABITT Face Wash", quantity: 1, unitPrice: PRODUCT_PRICING.salePrice },
  { name: "GRABITT Night Serum", quantity: 1, unitPrice: PRODUCT_PRICING.salePrice },
  { name: "GRABITT Hydration Mist", quantity: 2, unitPrice: PRODUCT_PRICING.salePrice },
  { name: "GRABITT Cleanse Refill", quantity: 1, unitPrice: PRODUCT_PRICING.salePrice },
];

function statusLabel(status: OrderStatus): string {
  if (status === "out_for_delivery") {
    return "Out for delivery";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function createOrderNumber(): string {
  return `GB-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
}

export async function GET() {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDbIndexes();
  const db = await getDb();

  const ordersDb = ordersCollection(db);
  let orders = await ordersDb.find({ userId: user._id }).sort({ placedAt: -1 }).toArray();

  if (orders.length === 0) {
    const now = Date.now();
    const sampleStatuses: OrderStatus[] = ["cancelled", "delivered", "shipped", "out_for_delivery"];
    const sampleOrders = sampleStatuses.map((status, index) => {
      const item = SAMPLE_ITEMS[index];
      const itemCount = item.quantity;
      const subtotalAmount = item.quantity * item.unitPrice;
      const codChargeAmount = PRODUCT_PRICING.codCharge;
      const totalAmount = subtotalAmount + codChargeAmount;
      const placedAt = new Date(now - index * 1000 * 60 * 60 * 24);

      return {
        userId: user._id!,
        orderNumber: createOrderNumber(),
        status,
        items: [item],
        itemCount,
        subtotalAmount,
        codChargeAmount,
        totalAmount,
        currency: "INR" as const,
        placedAt,
        updatedAt: placedAt,
      };
    });

    await ordersDb.insertMany(sampleOrders);
    orders = await ordersDb.find({ userId: user._id }).sort({ placedAt: -1 }).toArray();
  }

  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order._id?.toString() ?? order.orderNumber,
      orderNumber: order.orderNumber,
      status: order.status,
      statusLabel: statusLabel(order.status),
      items: order.items,
      itemCount: order.itemCount,
      totalAmount: order.totalAmount,
      currency: order.currency,
      placedAt: order.placedAt,
    })),
  });
}

export async function POST() {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureDbIndexes();
  const db = await getDb();

  const randomItem = SAMPLE_ITEMS[Math.floor(Math.random() * SAMPLE_ITEMS.length)];
  const subtotalAmount = randomItem.quantity * randomItem.unitPrice;
  const codChargeAmount = PRODUCT_PRICING.codCharge;
  const order = {
    userId: user._id,
    orderNumber: createOrderNumber(),
    status: "shipped" as OrderStatus,
    items: [randomItem],
    itemCount: randomItem.quantity,
    subtotalAmount,
    codChargeAmount,
    totalAmount: subtotalAmount + codChargeAmount,
    currency: "INR" as const,
    placedAt: new Date(),
    updatedAt: new Date(),
  };

  await ordersCollection(db).insertOne(order);
  return NextResponse.json({ ok: true });
}
