import { NextResponse } from "next/server";

import { accountActivityCollection, getDb, referralCollection } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/server-user";

export async function POST(request: Request) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const inviteEmail = String(body.email ?? "").trim().toLowerCase();

  if (!inviteEmail) {
    return NextResponse.json({ error: "Invite email is required." }, { status: 400 });
  }

  const db = await getDb();
  const now = new Date();
  await referralCollection(db).updateOne(
    { userId: user._id },
    { $inc: { invitesCount: 1 }, $set: { updatedAt: now } },
    { upsert: true },
  );
  await accountActivityCollection(db).insertOne({
    userId: user._id,
    type: "invite",
    message: `Sent invite to ${inviteEmail}`,
    createdAt: now,
  });

  return NextResponse.json({ ok: true });
}
