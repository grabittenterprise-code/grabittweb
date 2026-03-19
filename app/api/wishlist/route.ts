import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { ensureDbIndexes, getDb, usersCollection, wishlistCollection } from "@/lib/db";
import { PRODUCT_PRICING } from "@/lib/pricing";

const SAMPLE_PRODUCTS = [
  {
    productId: "gr-face-wash",
    name: "GRABITT Face Wash",
    subtitle: "Deep clean matte ritual",
    price: PRODUCT_PRICING.salePrice,
    currency: "INR" as const,
    imageUrl: "/images/25432.jpg",
  },
  {
    productId: "gr-night-serum",
    name: "GRABITT Night Serum",
    subtitle: "Overnight skin reset",
    price: PRODUCT_PRICING.salePrice,
    currency: "INR" as const,
    imageUrl: "/images/25432.jpg",
  },
  {
    productId: "gr-daily-mist",
    name: "GRABITT Hydration Mist",
    subtitle: "Midday glow support",
    price: PRODUCT_PRICING.salePrice,
    currency: "INR" as const,
    imageUrl: "/images/25432.jpg",
  },
];

async function getCurrentUserId() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!email) {
    return null;
  }

  await ensureDbIndexes();
  const db = await getDb();
  const user = await usersCollection(db).findOne({ email });
  return user?._id ?? null;
}

export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const wishlistDb = wishlistCollection(db);
  let items = await wishlistDb.find({ userId }).sort({ createdAt: -1 }).toArray();

  if (items.length === 0) {
    const now = Date.now();
    await wishlistDb.insertMany(
      SAMPLE_PRODUCTS.map((product, index) => ({
        ...product,
        userId,
        createdAt: new Date(now - index * 1000 * 60 * 10),
        updatedAt: new Date(now - index * 1000 * 60 * 10),
      })),
    );
    items = await wishlistDb.find({ userId }).sort({ createdAt: -1 }).toArray();
  }

  return NextResponse.json({
    items: items.map((item) => ({
      id: item._id?.toString() ?? item.productId,
      productId: item.productId,
      name: item.name,
      subtitle: item.subtitle,
      price: item.price,
      currency: item.currency,
      imageUrl: item.imageUrl,
      createdAt: item.createdAt,
    })),
  });
}

export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const wishlistDb = wishlistCollection(db);
  const random = SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)];

  await wishlistDb.updateOne(
    { userId, productId: random.productId },
    {
      $set: {
        name: random.name,
        subtitle: random.subtitle,
        price: random.price,
        currency: random.currency,
        imageUrl: random.imageUrl,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId,
        productId: random.productId,
        createdAt: new Date(),
      },
    },
    { upsert: true },
  );

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const productId = url.searchParams.get("productId")?.trim();

  const db = await getDb();
  const wishlistDb = wishlistCollection(db);

  if (!productId) {
    await wishlistDb.deleteMany({ userId });
    return NextResponse.json({ ok: true });
  }

  await wishlistDb.deleteOne({ userId, productId });
  return NextResponse.json({ ok: true });
}
