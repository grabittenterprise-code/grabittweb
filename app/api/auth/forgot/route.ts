import { NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";

import { ensureDbIndexes, getDb, passwordResetTokensCollection, usersCollection } from "@/lib/db";
import { env } from "@/lib/env";
import { sendResetPasswordEmail } from "@/lib/mailer";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  await ensureDbIndexes();
  const db = await getDb();
  const user = await usersCollection(db).findOne({ email });

  if (!user) {
    return NextResponse.json({ ok: true });
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await passwordResetTokensCollection(db).deleteMany({ userId: user._id });
  await passwordResetTokensCollection(db).insertOne({
    userId: user._id,
    tokenHash,
    expiresAt,
    usedAt: null,
    createdAt: new Date(),
  });

  const baseUrl = env.NEXTAUTH_URL ?? "http://localhost:3000";
  const resetUrl = `${baseUrl}/login?mode=forgot&token=${token}`;
  let emailSent = false;
  let emailError: string | undefined;

  try {
    emailSent = await sendResetPasswordEmail(email, resetUrl);
  } catch (error) {
    emailSent = false;
    emailError = error instanceof Error ? error.message : "Unknown SMTP error";
    console.error("Forgot password email send failed:", error);
  }

  if (!emailSent && process.env.NODE_ENV !== "production") {
    console.log("Password reset URL (dev only):", resetUrl);
  }

  return NextResponse.json({
    ok: true,
    emailSent,
    ...(process.env.NODE_ENV !== "production" && !emailSent ? { resetUrl, token, emailError } : {}),
  });
}
