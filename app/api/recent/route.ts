import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { ensureDbIndexes, getDb, recentViewsCollection, usersCollection } from "@/lib/db";
import { PRODUCT_PRICING } from "@/lib/pricing";

const SAMPLE_PRODUCTS = [
  {
    productId: "gr-cleanse-duo",
    name: "GRABITT Cleanse Duo",
    subtitle: "Signature cleanse pairing",
    price: PRODUCT_PRICING.salePrice,
    currency: "INR" as const,
    imageUrl: "/images/25432.jpg",
  },
  {
    productId: "gr-matte-essence",
    name: "GRABITT Matte Essence",
    subtitle: "Refine + balance daily",
    price: PRODUCT_PRICING.salePrice,
    currency: "INR" as const,
    imageUrl: "/images/25432.jpg",
  },
  {
    productId: "gr-renew-cream",
    name: "GRABITT Renew Cream",
    subtitle: "Barrier-focused hydration",
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
  const recentDb = recentViewsCollection(db);
  let items = await recentDb.find({ userId }).sort({ viewedAt: -1 }).limit(20).toArray();

  if (items.length === 0) {
    const now = Date.now();
    await recentDb.insertMany(
      SAMPLE_PRODUCTS.map((product, index) => ({
        ...product,
        userId,
        viewedAt: new Date(now - index * 1000 * 60 * 13),
        updatedAt: new Date(now - index * 1000 * 60 * 13),
      })),
    );
    items = await recentDb.find({ userId }).sort({ viewedAt: -1 }).limit(20).toArray();
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
      viewedAt: item.viewedAt,
    })),
  });
}

export async function POST() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getDb();
  const recentDb = recentViewsCollection(db);
  const random = SAMPLE_PRODUCTS[Math.floor(Math.random() * SAMPLE_PRODUCTS.length)];

  await recentDb.updateOne(
    { userId, productId: random.productId },
    {
      $set: {
        name: random.name,
        subtitle: random.subtitle,
        price: random.price,
        currency: random.currency,
        imageUrl: random.imageUrl,
        viewedAt: new Date(),
        updatedAt: new Date(),
      },
      $setOnInsert: {
        userId,
        productId: random.productId,
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
  const recentDb = recentViewsCollection(db);

  if (!productId) {
    await recentDb.deleteMany({ userId });
    return NextResponse.json({ ok: true });
  }

  await recentDb.deleteOne({ userId, productId });
  return NextResponse.json({ ok: true });
}
