import { NextResponse } from "next/server";

import {
  accountActivityCollection,
  getDb,
  ordersCollection,
  referralCollection,
  wishlistCollection,
  recentViewsCollection,
} from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/server-user";

function createReferralCode(seed: string): string {
  const compact = seed.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `GR-${compact || "USER"}-${random}`;
}

export async function GET() {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const [ordersCount, wishlistCount, recentCount, lastOrder, activitiesRaw, referral] = await Promise.all([
    ordersCollection(db).countDocuments({ userId: user._id }),
    wishlistCollection(db).countDocuments({ userId: user._id }),
    recentViewsCollection(db).countDocuments({ userId: user._id }),
    ordersCollection(db).findOne({ userId: user._id }, { sort: { placedAt: -1 } }),
    accountActivityCollection(db).find({ userId: user._id }).sort({ createdAt: -1 }).limit(5).toArray(),
    referralCollection(db).findOne({ userId: user._id }),
  ]);

  let ensuredReferral = referral;
  if (!ensuredReferral) {
    const code = createReferralCode(user.username || user.email);
    const now = new Date();
    await referralCollection(db).insertOne({
      userId: user._id,
      code,
      invitesCount: 0,
      createdAt: now,
      updatedAt: now,
    });
    ensuredReferral = await referralCollection(db).findOne({ userId: user._id });
  }

  if (activitiesRaw.length === 0) {
    await accountActivityCollection(db).insertOne({
      userId: user._id,
      type: "signin",
      message: "Signed in to your account",
      createdAt: new Date(),
    });
  }

  const activities = await accountActivityCollection(db)
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray();

  return NextResponse.json({
    stats: {
      ordersCount,
      wishlistCount,
      recentCount,
      lastOrderStatus: lastOrder?.status ?? null,
      lastOrderDate: lastOrder?.placedAt ?? null,
    },
    referral: {
      code: ensuredReferral?.code ?? null,
      invitesCount: ensuredReferral?.invitesCount ?? 0,
    },
    activities: activities.map((activity) => ({
      id: activity._id?.toString(),
      type: activity.type,
      message: activity.message,
      createdAt: activity.createdAt,
    })),
  });
}
