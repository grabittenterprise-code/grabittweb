import { createHash } from "crypto";

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { getDb, passwordResetTokensCollection, usersCollection } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const token = String(body.token ?? "").trim();
  const password = String(body.password ?? "");

  if (!token || !password) {
    return NextResponse.json({ error: "Token and password are required." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  const now = new Date();
  const db = await getDb();
  const resetToken = await passwordResetTokensCollection(db).findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: now },
  });

  if (!resetToken) {
    return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await usersCollection(db).updateOne(
    { _id: resetToken.userId },
    { $set: { passwordHash, updatedAt: now } },
  );
  await passwordResetTokensCollection(db).updateOne({ _id: resetToken._id }, { $set: { usedAt: now } });

  return NextResponse.json({ ok: true });
}
