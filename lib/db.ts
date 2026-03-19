import { Collection, Db, MongoClient, ObjectId } from "mongodb";

import { env } from "@/lib/env";

export type UserDocument = {
  _id?: ObjectId;
  name?: string;
  username: string;
  usernameLower: string;
  email: string;
  passwordHash?: string;
  emailVerified?: Date | null;
  image?: string | null;
  phone?: string;
  preferredLanguage?: string;
  notificationPreferences?: {
    orderUpdates: boolean;
    shippingAlerts: boolean;
    backInStock: boolean;
    promotions: boolean;
  };
  savedAddresses?: SavedAddress[];
  savedCards?: SavedCard[];
  createdAt: Date;
  updatedAt: Date;
};

export type SavedAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type SavedCard = {
  id: string;
  holderName: string;
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  isDefault?: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type PasswordResetTokenDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt?: Date | null;
  createdAt: Date;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "cancelled"
  | "delivered"
  | "shipped"
  | "out_for_delivery";

export type OrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

export type OrderDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  itemCount: number;
  totalAmount: number;
  subtotalAmount?: number;
  codChargeAmount?: number;
  gstDeductionAmount?: number;
  paymentMethod?: "cod";
  gstNumber?: string;
  customerPhone?: string;
  shippingAddress?: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  currency: "INR";
  placedAt: Date;
  updatedAt: Date;
};

export type WishlistItemDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  productId: string;
  name: string;
  subtitle: string;
  price: number;
  currency: "INR";
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
};

export type RecentViewDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  productId: string;
  name: string;
  subtitle: string;
  price: number;
  currency: "INR";
  imageUrl: string;
  viewedAt: Date;
  updatedAt: Date;
};

export type DashboardFeedbackDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  message: string;
  createdAt: Date;
};

export type ReferralDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  code: string;
  invitesCount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AccountActivityDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  type: "signin" | "feedback" | "invite" | "profile_update" | "contact";
  message: string;
  createdAt: Date;
};

export type ContactMessageDocument = {
  _id?: ObjectId;
  userId?: ObjectId | null;
  name: string;
  email: string;
  phone?: string;
  message: string;
  source: "contact_page";
  status: "new" | "resolved";
  createdAt: Date;
};

export type SellerApplicationDocument = {
  _id?: ObjectId;
  userId: ObjectId;
  userName: string;
  userEmail: string;
  businessName: string;
  contactName: string;
  phone: string;
  category: string;
  website?: string;
  message: string;
  status: "new" | "under_review" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
};

const client = new MongoClient(env.MONGODB_URI);

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _dbIndexesPromise: Promise<void> | undefined;
}

const clientPromise =
  global._mongoClientPromise ??
  (global._mongoClientPromise = client.connect().then((connectedClient) => connectedClient));

export default clientPromise;

export async function getDb(): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(env.MONGODB_DB);
}

export async function ensureDbIndexes(): Promise<void> {
  global._dbIndexesPromise ??= (async () => {
    const db = await getDb();
    await Promise.all([
      usersCollection(db).createIndex({ email: 1 }, { unique: true }),
      usersCollection(db).createIndex({ usernameLower: 1 }, { unique: true }),
      passwordResetTokensCollection(db).createIndex({ tokenHash: 1 }, { unique: true }),
      passwordResetTokensCollection(db).createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      ordersCollection(db).createIndex({ userId: 1, placedAt: -1 }),
      ordersCollection(db).createIndex({ orderNumber: 1 }, { unique: true }),
      wishlistCollection(db).createIndex({ userId: 1, productId: 1 }, { unique: true }),
      wishlistCollection(db).createIndex({ userId: 1, createdAt: -1 }),
      recentViewsCollection(db).createIndex({ userId: 1, viewedAt: -1 }),
      recentViewsCollection(db).createIndex({ userId: 1, productId: 1 }, { unique: true }),
      dashboardFeedbackCollection(db).createIndex({ userId: 1, createdAt: -1 }),
      referralCollection(db).createIndex({ userId: 1 }, { unique: true }),
      referralCollection(db).createIndex({ code: 1 }, { unique: true }),
      accountActivityCollection(db).createIndex({ userId: 1, createdAt: -1 }),
      contactMessagesCollection(db).createIndex({ createdAt: -1 }),
      contactMessagesCollection(db).createIndex({ email: 1 }),
      sellerApplicationsCollection(db).createIndex({ userId: 1, createdAt: -1 }),
      sellerApplicationsCollection(db).createIndex({ status: 1, createdAt: -1 }),
    ]);
  })();

  await global._dbIndexesPromise;
}

export function usersCollection(db: Db): Collection<UserDocument> {
  return db.collection<UserDocument>("users");
}

export function passwordResetTokensCollection(db: Db): Collection<PasswordResetTokenDocument> {
  return db.collection<PasswordResetTokenDocument>("passwordResetTokens");
}

export function ordersCollection(db: Db): Collection<OrderDocument> {
  return db.collection<OrderDocument>("orders");
}

export function wishlistCollection(db: Db): Collection<WishlistItemDocument> {
  return db.collection<WishlistItemDocument>("wishlistItems");
}

export function recentViewsCollection(db: Db): Collection<RecentViewDocument> {
  return db.collection<RecentViewDocument>("recentViews");
}

export function dashboardFeedbackCollection(db: Db): Collection<DashboardFeedbackDocument> {
  return db.collection<DashboardFeedbackDocument>("dashboardFeedback");
}

export function referralCollection(db: Db): Collection<ReferralDocument> {
  return db.collection<ReferralDocument>("referrals");
}

export function accountActivityCollection(db: Db): Collection<AccountActivityDocument> {
  return db.collection<AccountActivityDocument>("accountActivities");
}

export function contactMessagesCollection(db: Db): Collection<ContactMessageDocument> {
  return db.collection<ContactMessageDocument>("contactMessages");
}

export function sellerApplicationsCollection(db: Db): Collection<SellerApplicationDocument> {
  return db.collection<SellerApplicationDocument>("sellerApplications");
}
