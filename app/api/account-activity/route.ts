import { NextResponse } from "next/server";

import { accountActivityCollection, getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/server-user";

export async function GET() {
  const user = await getSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const activities = await accountActivityCollection(db)
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(25)
    .toArray();

  return NextResponse.json({
    activities: activities.map((activity) => ({
      id: activity._id?.toString(),
      type: activity.type,
      message: activity.message,
      createdAt: activity.createdAt,
    })),
  });
}
