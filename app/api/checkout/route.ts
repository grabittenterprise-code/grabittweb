import { NextResponse } from "next/server";

import { ensureDbIndexes, getDb, ordersCollection } from "@/lib/db";
import { PRODUCT_PRICING } from "@/lib/pricing";
import { getOrCreateSessionUser } from "@/lib/server-user";
import { sendSms } from "@/lib/twilio";

type CheckoutItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

function createOrderNumber(): string {
  return `GB-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
}

export async function POST(request: Request) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const items = Array.isArray(body.items) ? (body.items as CheckoutItem[]) : [];
  const phone = String(body.phone ?? "").trim();
  const address = {
    fullName: String(body.address?.fullName ?? "").trim(),
    line1: String(body.address?.line1 ?? "").trim(),
    line2: String(body.address?.line2 ?? "").trim(),
    city: String(body.address?.city ?? "").trim(),
    state: String(body.address?.state ?? "").trim(),
    postalCode: String(body.address?.postalCode ?? "").trim(),
    country: String(body.address?.country ?? "India").trim(),
  };

  if (!items.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  if (!phone || !address.fullName || !address.line1 || !address.city || !address.state || !address.postalCode) {
    return NextResponse.json({ error: "Please fill all required address and phone fields." }, { status: 400 });
  }
  const normalizedItems = items.map((item) => ({
    name: String(item.name ?? "").trim(),
    quantity: Math.max(1, Number(item.quantity ?? 1)),
    unitPrice: Math.max(0, Number(item.unitPrice ?? 0)),
  }));

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const codCharge = PRODUCT_PRICING.codCharge;
  const payableTotal = Math.max(0, subtotal + codCharge);
  const itemCount = normalizedItems.reduce((sum, item) => sum + item.quantity, 0);

  await ensureDbIndexes();
  const db = await getDb();

  const orderNumber = createOrderNumber();
  const insertResult = await ordersCollection(db).insertOne({
    userId: user._id,
    orderNumber,
    status: "pending",
    items: normalizedItems,
    itemCount,
    subtotalAmount: subtotal,
    codChargeAmount: codCharge,
    gstDeductionAmount: 0,
    totalAmount: payableTotal,
    paymentMethod: "cod",
    customerPhone: phone,
    shippingAddress: {
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2 || undefined,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || "India",
    },
    currency: "INR",
    placedAt: new Date(),
    updatedAt: new Date(),
  });

  let smsSent = false;
  let smsError: string | undefined;
  try {
    smsSent = await sendSms(
      phone,
      `GRABITT order confirmed. Order ${orderNumber} placed successfully. Total payable: ₹${payableTotal.toLocaleString(
        "en-IN",
      )} (COD).`,
    );
  } catch (error) {
    smsSent = false;
    smsError = error instanceof Error ? error.message : "Unknown SMS error";
    console.error("Checkout SMS failed:", error);
  }

  return NextResponse.json({
    ok: true,
    orderId: insertResult.insertedId.toString(),
    smsSent,
    ...(process.env.NODE_ENV !== "production" && !smsSent ? { smsError } : {}),
    summary: {
      subtotal,
      codCharge,
      gstDeduction: 0,
      total: payableTotal,
    },
  });
}
