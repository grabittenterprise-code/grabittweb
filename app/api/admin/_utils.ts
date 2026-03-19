import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin-server";

export async function requireAdminOrResponse() {
  const session = await getAdminSession();
  if (!session) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  return { session };
}

export function parsePagination(url: URL) {
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") ?? 10)));
  const skip = (page - 1) * pageSize;
  return { page, pageSize, skip };
}

export function toCsv(headers: string[], rows: string[][]): string {
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const csvRows = [headers.map(escape).join(","), ...rows.map((row) => row.map(escape).join(","))];
  return csvRows.join("\n");
}
