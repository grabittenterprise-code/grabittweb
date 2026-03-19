import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { getDb, ordersCollection, usersCollection } from "@/lib/db";
import { formatInr, PRODUCT_PRICING } from "@/lib/pricing";
import { getOrCreateSessionUser } from "@/lib/server-user";

function invoiceHtml(params: {
  brand: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  items: Array<{ name: string; qty: number; unit: number; total: number }>;
  subtotal: number;
  codCharge: number;
  total: number;
}) {
  const itemsRows = params.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:10px;border-bottom:1px solid #ddd;">${item.name}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:center;">${item.qty}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:right;">${formatInr(item.unit)}</td>
          <td style="padding:10px;border-bottom:1px solid #ddd;text-align:right;">${formatInr(item.total)}</td>
        </tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${params.orderNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; background:#f5f5f7; margin:0; padding:24px; color:#111; }
    .card { max-width:900px; margin:0 auto; background:#fff; border-radius:14px; padding:28px; box-shadow:0 10px 35px rgba(0,0,0,.08); }
    .head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:22px; }
    .brand { font-size:30px; letter-spacing:6px; font-weight:700; }
    .muted { color:#666; font-size:13px; }
    h2 { margin:8px 0 0 0; font-size:22px; }
    table { width:100%; border-collapse:collapse; margin-top:18px; }
    th { text-align:left; font-size:12px; letter-spacing:1px; text-transform:uppercase; color:#555; border-bottom:1px solid #ddd; padding:10px; }
    .totals { margin-top:16px; margin-left:auto; width:300px; }
    .totals-row { display:flex; justify-content:space-between; margin:8px 0; font-size:14px; }
    .totals-row.final { font-size:20px; font-weight:700; margin-top:10px; }
    .footer { margin-top:26px; font-size:12px; color:#666; }
  </style>
</head>
<body>
  <div class="card">
    <div class="head">
      <div>
        <div class="brand">${params.brand}</div>
        <div class="muted">Natural Inner Beauty</div>
      </div>
      <div style="text-align:right">
        <h2>Invoice</h2>
        <div class="muted">Order: ${params.orderNumber}</div>
        <div class="muted">Date: ${params.date}</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
      <div>
        <div class="muted">Billed To</div>
        <div><strong>${params.customerName}</strong></div>
        <div>${params.customerEmail}</div>
        <div>${params.phone}</div>
      </div>
      <div>
        <div class="muted">Shipping Address</div>
        <div>${params.address}</div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th style="text-align:center">Qty</th>
          <th style="text-align:right">Unit Price</th>
          <th style="text-align:right">Line Total</th>
        </tr>
      </thead>
      <tbody>${itemsRows}</tbody>
    </table>

    <div class="totals">
      <div class="totals-row"><span>Subtotal</span><span>${formatInr(params.subtotal)}</span></div>
      <div class="totals-row"><span>COD Charges</span><span>${formatInr(params.codCharge)}</span></div>
      <div class="totals-row final"><span>Total</span><span>${formatInr(params.total)}</span></div>
    </div>

    <div class="footer">
      Thank you for shopping with ${params.brand}. This is a system-generated invoice.
    </div>
  </div>
</body>
</html>`;
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  if (!ObjectId.isValid(params.id)) {
    return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
  }

  const sessionUser = await getOrCreateSessionUser();
  if (!sessionUser?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const user = await usersCollection(db).findOne({ _id: sessionUser._id });
  if (!user?._id) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const order = await ordersCollection(db).findOne({
    _id: new ObjectId(params.id),
    userId: user._id,
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const computedSubtotal = order.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const subtotal = order.subtotalAmount ?? computedSubtotal;
  const codCharge =
    order.codChargeAmount ?? (order.paymentMethod === "cod" ? PRODUCT_PRICING.codCharge : Math.max(0, order.totalAmount - subtotal));

  const html = invoiceHtml({
    brand: "GRABITT",
    orderNumber: order.orderNumber,
    date: new Date(order.placedAt).toLocaleDateString("en-IN"),
    customerName: order.shippingAddress?.fullName || user.name || "Customer",
    customerEmail: user.email,
    phone: order.customerPhone || "-",
    address: [
      order.shippingAddress?.line1,
      order.shippingAddress?.line2,
      order.shippingAddress?.city,
      order.shippingAddress?.state,
      order.shippingAddress?.postalCode,
      order.shippingAddress?.country,
    ]
      .filter(Boolean)
      .join(", "),
    items: order.items.map((item) => ({
      name: item.name,
      qty: item.quantity,
      unit: item.unitPrice,
      total: item.quantity * item.unitPrice,
    })),
    subtotal,
    codCharge,
    total: order.totalAmount,
  });

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename=invoice-${order.orderNumber}.html`,
    },
  });
}
