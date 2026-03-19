import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { parsePagination, requireAdminOrResponse, toCsv } from "@/app/api/admin/_utils";
import { dashboardFeedbackCollection, getDb, usersCollection } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  const url = new URL(request.url);
  const { page, pageSize, skip } = parsePagination(url);
  const query = url.searchParams.get("query")?.trim() ?? "";
  const exportCsv = url.searchParams.get("export") === "csv";

  const db = await getDb();
  const total = await dashboardFeedbackCollection(db).countDocuments({});
  const feedback = await dashboardFeedbackCollection(db)
    .find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();

  const userIds = [...new Set(feedback.map((item) => item.userId.toString()))];
  const users = await usersCollection(db).find({}).project({ _id: 1, name: 1, email: 1 }).toArray();
  const userById = new Map(users.map((user) => [user._id?.toString(), user]));

  let items = feedback.map((item) => ({
    id: item._id?.toString(),
    message: item.message,
    createdAt: item.createdAt,
    userName: userById.get(item.userId.toString())?.name ?? "Unknown user",
    userEmail: userById.get(item.userId.toString())?.email ?? "",
  }));

  if (query) {
    const q = query.toLowerCase();
    items = items.filter(
      (item) =>
        item.userName.toLowerCase().includes(q) ||
        item.userEmail.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q),
    );
  }

  if (exportCsv) {
    const csv = toCsv(
      ["id", "name", "email", "message", "date"],
      items.map((item) => [item.id ?? "", item.userName, item.userEmail, item.message, item.createdAt.toISOString()]),
    );
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=feedback.csv",
      },
    });
  }

  return NextResponse.json({
    items,
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
    return NextResponse.json({ error: "Invalid feedback id." }, { status: 400 });
  }

  const db = await getDb();
  await dashboardFeedbackCollection(db).deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
