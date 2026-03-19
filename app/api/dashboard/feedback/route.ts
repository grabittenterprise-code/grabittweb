import { NextResponse } from "next/server";

import { accountActivityCollection, dashboardFeedbackCollection, getDb } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/server-user";

export async function POST(request: Request) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const message = String(body.message ?? "").trim();

  if (!message) {
    return NextResponse.json({ error: "Feedback message is required." }, { status: 400 });
  }

  const db = await getDb();
  const now = new Date();
  await dashboardFeedbackCollection(db).insertOne({
    userId: user._id,
    message,
    createdAt: now,
  });
  await accountActivityCollection(db).insertOne({
    userId: user._id,
    type: "feedback",
    message: "Submitted dashboard feedback",
    createdAt: now,
  });

  return NextResponse.json({ ok: true });
}
