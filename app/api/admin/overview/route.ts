import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { contactMessagesCollection, getDb, ordersCollection, usersCollection } from "@/lib/db";
import { PRODUCT_PRICING } from "@/lib/pricing";
import { requireAdminOrResponse } from "@/app/api/admin/_utils";

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export async function GET() {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  const db = await getDb();
  const [usersCount, recentOrders, recentMessages, allOrders] = await Promise.all([
    usersCollection(db).countDocuments({}),
    ordersCollection(db).find({}).sort({ placedAt: -1 }).limit(6).toArray(),
    contactMessagesCollection(db).find({}).sort({ createdAt: -1 }).limit(6).toArray(),
    ordersCollection(db).find({}).sort({ placedAt: -1 }).toArray(),
  ]);

  const recentOrderUserIds = [...new Set(recentOrders.map((order) => order.userId.toString()))];
  const users = await usersCollection(db)
    .find({ _id: { $in: recentOrderUserIds.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id)) } })
    .toArray()
    .catch(() => []);

  const userById = new Map(users.map((user) => [user._id?.toString(), user]));

  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalCompleted = allOrders.filter((order) => order.status === "delivered").length;
  const totalShipped = allOrders.filter((order) => order.status === "shipped").length;
  const totalOutForDelivery = allOrders.filter((order) => order.status === "out_for_delivery").length;
  let totalFaceWashSales = 0;
  let totalFaceWashRevenue = 0;
  let totalFaceWashCost = 0;
  for (const order of allOrders) {
    for (const item of order.items) {
      if (!item.name.toLowerCase().includes("face wash")) {
        continue;
      }

      totalFaceWashSales += item.quantity;
      totalFaceWashRevenue += item.quantity * item.unitPrice;
      totalFaceWashCost += item.quantity * PRODUCT_PRICING.costPrice;
    }
  }

  const totalNetProfit = totalFaceWashRevenue - totalFaceWashCost;

  const today = new Date();
  const growthMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    growthMap.set(dayKey(date), 0);
  }

  for (const order of allOrders) {
    const key = dayKey(new Date(order.placedAt));
    if (growthMap.has(key)) {
      growthMap.set(key, (growthMap.get(key) ?? 0) + order.totalAmount);
    }
  }

  const growth = [...growthMap.entries()].map(([date, revenue]) => ({ date, revenue }));

  return NextResponse.json({
    metrics: {
      usersCount,
      ordersCount: totalOrders,
      revenue: totalFaceWashRevenue || totalRevenue,
      netProfit: totalNetProfit,
      completedOrders: totalCompleted,
      shippedOrders: totalShipped,
      outForDeliveryOrders: totalOutForDelivery,
      faceWashSales: totalFaceWashSales,
    },
    growth,
    recentOrders: recentOrders.map((order) => ({
      id: order._id?.toString(),
      orderNumber: order.orderNumber,
      status: order.status,
      totalAmount: order.totalAmount,
      placedAt: order.placedAt,
      userName: userById.get(order.userId.toString())?.name ?? "Unknown user",
    })),
    recentMessages: recentMessages.map((message) => ({
      id: message._id?.toString(),
      name: message.name,
      email: message.email,
      preview: message.message.slice(0, 80),
      createdAt: message.createdAt,
      status: message.status,
    })),
  });
}
