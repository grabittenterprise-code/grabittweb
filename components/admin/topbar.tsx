"use client";

import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Bell, LogOut, Menu } from "lucide-react";

import { AdminSidebar } from "@/components/admin/sidebar";

export function AdminTopbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <header className="relative border-b border-white/10 bg-black/20 px-4 py-4 backdrop-blur-xl lg:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/38">Operations</p>
          <p className="mt-2 text-sm text-white/65">Manage orders, inbox, users, and seller reviews from one place.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3.5 py-2 text-xs uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10"
            >
              <Menu className="h-3.5 w-3.5" />
              Menu
            </button>
            {menuOpen ? (
              <div className="fixed inset-x-4 top-20 z-50 sm:left-auto sm:right-6 sm:top-24 sm:w-[22rem]">
                <AdminSidebar onNavigate={() => setMenuOpen(false)} />
              </div>
            ) : null}
          </div>
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
      {menuOpen ? <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]" /> : null}
    </header>
  );
}
