"use client";

import { signOut, useSession } from "next-auth/react";
import { Bell, LogOut } from "lucide-react";

export function AdminTopbar() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-white/10 bg-black/20 px-4 py-4 backdrop-blur-xl lg:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/38">Operations</p>
          <p className="mt-2 text-sm text-white/65">Manage orders, inbox, users, and seller reviews from one place.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/75">
            <Bell className="h-3.5 w-3.5 text-white/55" />
            <span className="max-w-[12rem] truncate">{session?.user?.email ?? "admin"}</span>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-2 text-xs uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10"
          >
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
