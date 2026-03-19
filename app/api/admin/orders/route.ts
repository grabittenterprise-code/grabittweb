import { NextResponse } from "next/server";

import { parsePagination, requireAdminOrResponse, toCsv } from "@/app/api/admin/_utils";
import { getDb, ordersCollection, usersCollection } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  const url = new URL(request.url);
  const { page, pageSize, skip } = parsePagination(url);
  const query = url.searchParams.get("query")?.trim() ?? "";
  const status = url.searchParams.get("status")?.trim() ?? "";
  const dateFrom = url.searchParams.get("dateFrom")?.trim() ?? "";
  const dateTo = url.searchParams.get("dateTo")?.trim() ?? "";
  const exportCsv = url.searchParams.get("export") === "csv";

  const filter: Record<string, unknown> = {};
  if (status) {
    filter.status = status;
  }
  if (dateFrom || dateTo) {
    filter.placedAt = {};
    if (dateFrom) {
      (filter.placedAt as Record<string, Date>).$gte = new Date(dateFrom);
    }
    if (dateTo) {
      (filter.placedAt as Record<string, Date>).$lte = new Date(`${dateTo}T23:59:59.999Z`);
    }
  }

  const db = await getDb();
  const total = await ordersCollection(db).countDocuments(filter);
  const orders = await ordersCollection(db).find(filter).sort({ placedAt: -1 }).skip(skip).limit(pageSize).toArray();

  const userIds = [...new Set(orders.map((order) => order.userId.toString()))];
  const users = await usersCollection(db).find({}).project({ _id: 1, name: 1, email: 1 }).toArray();
  const userById = new Map(users.map((user) => [user._id?.toString(), user]));

  const filtered = query
    ? orders.filter((order) => {
        const user = userById.get(order.userId.toString());
        const productNames = order.items.map((item) => item.name).join(" ").toLowerCase();
        const q = query.toLowerCase();
        return (
          order.orderNumber.toLowerCase().includes(q) ||
          (user?.name ?? "").toLowerCase().includes(q) ||
          (user?.email ?? "").toLowerCase().includes(q) ||
          productNames.includes(q)
        );
      })
    : orders;

  const items = filtered.map((order) => {
    const user = userById.get(order.userId.toString());
    return {
      id: order._id?.toString(),
      orderNumber: order.orderNumber,
      userName: user?.name ?? "Unknown user",
      userEmail: user?.email ?? "",
      customerPhone: order.customerPhone ?? "",
      product: order.items[0]?.name ?? "N/A",
      price: order.totalAmount,
      status: order.status,
      date: order.placedAt,
      items: order.items,
      shippingAddress: order.shippingAddress ?? null,
    };
  });

  if (exportCsv) {
    const csv = toCsv(
      ["id", "orderId", "userName", "product", "price", "status", "date"],
      items.map((item) => [
        item.id ?? "",
        item.orderNumber,
        item.userName,
        item.product,
        String(item.price),
        item.status,
        new Date(item.date).toISOString(),
      ]),
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=orders.csv",
      },
    });
  }

  return NextResponse.json({
    items,
    pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
  });
}
