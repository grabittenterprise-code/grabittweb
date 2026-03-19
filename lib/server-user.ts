import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { ensureDbIndexes, getDb, UserDocument, usersCollection } from "@/lib/db";

export async function getSessionUser(): Promise<UserDocument | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) {
    return null;
  }

  await ensureDbIndexes();
  const db = await getDb();
  const user = await usersCollection(db).findOne({ email });
  return user ?? null;
}

function slugifyUsername(value: string): string {
  const cleaned = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 18);
  return cleaned || "user";
}

export async function getOrCreateSessionUser(): Promise<UserDocument | null> {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user;
  const email = sessionUser?.email?.toLowerCase();
  if (!email) {
    return null;
  }

  await ensureDbIndexes();
  const db = await getDb();
  const collection = usersCollection(db);

  const existing = await collection.findOne({ email });
  if (existing) {
    return existing;
  }

  const baseFromName = slugifyUsername(sessionUser?.name ?? "");
  const baseFromEmail = slugifyUsername(email.split("@")[0] ?? "");
  const base = baseFromName || baseFromEmail || "user";
  const now = new Date();

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    const username = attempt === 0 ? base : `${base}${suffix}`;
    const usernameLower = username.toLowerCase();

    try {
      const insert = await collection.insertOne({
        name: sessionUser?.name?.trim() || username,
        username,
        usernameLower,
        email,
        emailVerified: null,
        image: sessionUser?.image ?? null,
        createdAt: now,
        updatedAt: now,
      });

      return await collection.findOne({ _id: insert.insertedId });
    } catch {
      // Retry with a different username if unique index fails.
    }
  }

  return await collection.findOne({ email });
}
