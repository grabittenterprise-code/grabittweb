import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { parsePagination, requireAdminOrResponse, toCsv } from "@/app/api/admin/_utils";
import {
  accountActivityCollection,
  contactMessagesCollection,
  dashboardFeedbackCollection,
  getDb,
  ordersCollection,
  recentViewsCollection,
  referralCollection,
  usersCollection,
  wishlistCollection,
} from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  const url = new URL(request.url);
  const { page, pageSize, skip } = parsePagination(url);
  const query = url.searchParams.get("query")?.trim() ?? "";
  const exportCsv = url.searchParams.get("export") === "csv";

  const filter = query
    ? {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      }
    : {};

  const db = await getDb();
  const total = await usersCollection(db).countDocuments(filter);
  const users = await usersCollection(db).find(filter).sort({ createdAt: -1 }).skip(skip).limit(pageSize).toArray();

  const rows = users.map((user) => [
    user._id?.toString() ?? "",
    user.name ?? "",
    user.email,
    user.createdAt.toISOString(),
  ]);

  if (exportCsv) {
    const csv = toCsv(["id", "name", "email", "joinedDate"], rows);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=users.csv",
      },
    });
  }

  return NextResponse.json({
    items: users.map((user) => ({
      id: user._id?.toString(),
      name: user.name ?? user.username ?? "Unnamed",
      email: user.email,
      joinedDate: user.createdAt,
    })),
    pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
  });
}

export async function DELETE(request: Request) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  const body = await request.json().catch(() => ({}));
  const id = String(body.id ?? "").trim();
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
  }

  const userId = new ObjectId(id);
  const db = await getDb();

  await Promise.all([
    usersCollection(db).deleteOne({ _id: userId }),
    ordersCollection(db).deleteMany({ userId }),
    wishlistCollection(db).deleteMany({ userId }),
    recentViewsCollection(db).deleteMany({ userId }),
    contactMessagesCollection(db).deleteMany({ userId }),
    dashboardFeedbackCollection(db).deleteMany({ userId }),
    referralCollection(db).deleteMany({ userId }),
    accountActivityCollection(db).deleteMany({ userId }),
  ]);

  return NextResponse.json({ ok: true });
}
