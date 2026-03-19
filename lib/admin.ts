import { env } from "@/lib/env";

const DEFAULT_SUPER_ADMIN_EMAIL = "grabittenterprise@gmail.com";

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function getAdminEmails(): Set<string> {
  const emails = new Set<string>();
  emails.add(normalizeEmail(env.ADMIN_SUPER_EMAIL ?? DEFAULT_SUPER_ADMIN_EMAIL));

  const allowlist = env.ADMIN_EMAIL_ALLOWLIST ?? "";
  for (const email of allowlist.split(",")) {
    const normalized = email.trim().toLowerCase();
    if (normalized) {
      emails.add(normalized);
    }
  }

  return emails;
}

export function isAdminEmail(email?: string | null): boolean {
  if (!email) {
    return false;
  }

  return getAdminEmails().has(normalizeEmail(email));
}
