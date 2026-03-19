import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

import { parsePagination, requireAdminOrResponse } from "@/app/api/admin/_utils";
import { getDb, sellerApplicationsCollection } from "@/lib/db";

export async function GET(request: Request) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  const url = new URL(request.url);
  const { page, pageSize, skip } = parsePagination(url);
  const status = url.searchParams.get("status")?.trim() ?? "";
  const query = url.searchParams.get("query")?.trim() ?? "";

  const filter: Record<string, unknown> = {};
  if (status) {
    filter.status = status;
  }
  if (query) {
    filter.$or = [
      { businessName: { $regex: query, $options: "i" } },
      { contactName: { $regex: query, $options: "i" } },
      { userEmail: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } },
    ];
  }

  const db = await getDb();
  const total = await sellerApplicationsCollection(db).countDocuments(filter);
  const items = await sellerApplicationsCollection(db)
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();

  return NextResponse.json({
    items: items.map((item) => ({
      id: item._id?.toString(),
      businessName: item.businessName,
      contactName: item.contactName,
      userName: item.userName,
      userEmail: item.userEmail,
      phone: item.phone,
      category: item.category,
      website: item.website ?? "",
      message: item.message,
      status: item.status,
      createdAt: item.createdAt,
    })),
    pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
  });
}

export async function PATCH(request: Request) {
  const auth = await requireAdminOrResponse();
  if ("response" in auth) {
    return auth.response;
  }

  const body = await request.json().catch(() => ({}));
  const id = String(body.id ?? "").trim();
  const status = String(body.status ?? "").trim();
  const nextStatus = status as "new" | "under_review" | "approved" | "rejected";
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid application id." }, { status: 400 });
  }
  if (!["new", "under_review", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const db = await getDb();
  await sellerApplicationsCollection(db).updateOne(
    { _id: new ObjectId(id) },
    { $set: { status: nextStatus, updatedAt: new Date() } },
  );

  return NextResponse.json({ ok: true });
}
