import { NextResponse } from "next/server";

import { getDb, sellerApplicationsCollection } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/server-user";

export async function GET() {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const application = await sellerApplicationsCollection(db).findOne(
    { userId: user._id },
    { sort: { createdAt: -1 } },
  );

  return NextResponse.json({ application });
}

export async function POST(request: Request) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const businessName = String(body.businessName ?? "").trim();
  const contactName = String(body.contactName ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const category = String(body.category ?? "").trim();
  const website = String(body.website ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!businessName || !contactName || !phone || !category || !message) {
    return NextResponse.json({ error: "Please complete all required seller application fields." }, { status: 400 });
  }

  const db = await getDb();
  const now = new Date();
  await sellerApplicationsCollection(db).insertOne({
    userId: user._id,
    userName: user.name ?? user.username ?? user.email,
    userEmail: user.email,
    businessName,
    contactName,
    phone,
    category,
    website: website || undefined,
    message,
    status: "new",
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ ok: true });
}
