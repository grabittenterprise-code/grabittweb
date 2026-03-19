import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { ensureDbIndexes, getDb, usersCollection } from "@/lib/db";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const username = String(body.username ?? "").trim();
  const usernameLower = username.toLowerCase();
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  await ensureDbIndexes();
  const db = await getDb();
  const existingUser = await usersCollection(db).findOne({
    $or: [{ email }, { usernameLower }, { username }],
  });

  if (existingUser) {
    return NextResponse.json({ error: "User already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const now = new Date();

  await usersCollection(db).insertOne({
    name: username,
    username,
    usernameLower,
    email,
    passwordHash,
    emailVerified: null,
    image: null,
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ ok: true });
}
