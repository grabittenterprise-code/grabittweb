import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { isAdminEmail } from "@/lib/admin";

export async function getAdminSession() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase();
  if (!isAdminEmail(email)) {
    return null;
  }

  return session;
}
