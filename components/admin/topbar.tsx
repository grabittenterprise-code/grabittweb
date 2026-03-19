"use client";

import { signOut, useSession } from "next-auth/react";

export function AdminTopbar() {
  const { data: session } = useSession();

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-black/35 px-4 py-3">
      <p className="text-sm text-white/70">Premium operations workspace</p>
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/80">
          {session?.user?.email ?? "admin"}
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.18em] text-white/80 hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
