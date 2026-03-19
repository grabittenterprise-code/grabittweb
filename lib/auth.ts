import { MongoDBAdapter } from "@auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import clientPromise, { ensureDbIndexes, getDb, usersCollection } from "@/lib/db";
import { env, hasGoogleOAuth } from "@/lib/env";

const providers: NextAuthOptions["providers"] = [
  Credentials({
    name: "credentials",
    credentials: {
      identifier: { label: "Username or email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const identifier = credentials?.identifier?.trim();
      const password = credentials?.password;

      if (!identifier || !password) {
        return null;
      }

      await ensureDbIndexes();
      const db = await getDb();
      const normalizedIdentifier = identifier.toLowerCase();
      const user = await usersCollection(db).findOne({
        $or: [
          { email: normalizedIdentifier },
          { usernameLower: normalizedIdentifier },
          { username: identifier },
        ],
      });

      if (!user?.passwordHash) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return null;
      }

      return {
        id: user._id.toString(),
        name: user.name ?? user.username ?? user.email,
        email: user.email,
        image: user.image ?? undefined,
      };
    },
  }),
];

if (hasGoogleOAuth) {
  providers.push(
    Google({
      clientId: env.GOOGLE_CLIENT_ID!,
      clientSecret: env.GOOGLE_CLIENT_SECRET!,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  secret: env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      await ensureDbIndexes();
      const db = await getDb();
      const user = await usersCollection(db).findOne({ email: token.email.toLowerCase() });
      if (user) {
        token.name = user.name ?? user.username ?? user.email;
        token.picture = user.image ?? undefined;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = typeof token.name === "string" ? token.name : session.user.name;
        session.user.image = typeof token.picture === "string" ? token.picture : session.user.image;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
