import { NextResponse } from "next/server";

import { getDb, usersCollection } from "@/lib/db";
import { getOrCreateSessionUser } from "@/lib/server-user";

const DEFAULT_NOTIFICATIONS = {
  orderUpdates: true,
  shippingAlerts: true,
  backInStock: false,
  promotions: false,
};

export async function GET() {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    profile: {
      fullName: user.name ?? "",
      email: user.email,
      phone: user.phone ?? "",
    },
    preferences: {
      language: user.preferredLanguage ?? "en",
      notifications: user.notificationPreferences ?? DEFAULT_NOTIFICATIONS,
    },
  });
}

export async function PATCH(request: Request) {
  const user = await getOrCreateSessionUser();
  if (!user?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const updates: Record<string, unknown> = {};

  if (body.profile) {
    const fullName = String(body.profile.fullName ?? "").trim();
    const phone = String(body.profile.phone ?? "").trim();

    if (!fullName) {
      return NextResponse.json({ error: "Full name is required." }, { status: 400 });
    }

    updates.name = fullName;
    updates.phone = phone;
  }

  if (body.preferences) {
    const language = String(body.preferences.language ?? "").trim() || user.preferredLanguage || "en";
    updates.preferredLanguage = language;
    const currentNotifications = user.notificationPreferences ?? DEFAULT_NOTIFICATIONS;
    updates.notificationPreferences = {
      orderUpdates:
        body.preferences.notifications?.orderUpdates === undefined
          ? currentNotifications.orderUpdates
          : Boolean(body.preferences.notifications.orderUpdates),
      shippingAlerts:
        body.preferences.notifications?.shippingAlerts === undefined
          ? currentNotifications.shippingAlerts
          : Boolean(body.preferences.notifications.shippingAlerts),
      backInStock:
        body.preferences.notifications?.backInStock === undefined
          ? currentNotifications.backInStock
          : Boolean(body.preferences.notifications.backInStock),
      promotions:
        body.preferences.notifications?.promotions === undefined
          ? currentNotifications.promotions
          : Boolean(body.preferences.notifications.promotions),
    };
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided." }, { status: 400 });
  }

  const db = await getDb();
  await usersCollection(db).updateOne(
    { _id: user._id },
    { $set: { ...updates, updatedAt: new Date() } },
  );

  const updatedUser = await usersCollection(db).findOne({ _id: user._id });

  return NextResponse.json({
    ok: true,
    profile: {
      fullName: updatedUser?.name ?? "",
      email: updatedUser?.email ?? "",
      phone: updatedUser?.phone ?? "",
    },
    preferences: {
      language: updatedUser?.preferredLanguage ?? "en",
      notifications: updatedUser?.notificationPreferences ?? DEFAULT_NOTIFICATIONS,
    },
  });
}
