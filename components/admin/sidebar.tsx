"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircleMore,
  MessageSquare,
  Package,
  ShieldCheck,
  Store,
  Users,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Orders", href: "/admin/orders", icon: Package },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Feedback", href: "/admin/feedback", icon: MessageCircleMore },
  { label: "Seller Apps", href: "/admin/seller-applications", icon: Store },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] px-4 py-4 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-5">
      <div className="lg:flex lg:min-h-[calc(100vh-2.5rem)] lg:flex-col">
        <div className="rounded-[1.75rem] border border-white/10 bg-black/30 p-5 shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.38em] text-white/40">GRABITT</p>
              <h1 className="mt-3 text-2xl text-white/95">Admin Panel</h1>
              <p className="mt-2 max-w-[14rem] text-sm leading-6 text-white/55">
                Calm control for users, orders, support, and seller review.
              </p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="mt-5 lg:flex-1">
          <p className="px-2 text-[11px] uppercase tracking-[0.35em] text-white/35">Navigation</p>
          <nav className="mt-3 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm transition ${
                    active
                      ? "border-white/15 bg-white/10 text-white shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
                      : "border-transparent text-white/68 hover:border-white/10 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                      active
                        ? "border-white/15 bg-white/[0.07] text-white"
                        : "border-white/8 bg-white/[0.025] text-white/60 group-hover:text-white/90"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="tracking-[0.02em]">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/35">Workspace</p>
          <p className="mt-3 text-sm text-white/78">Premium operations workspace for daily support and fulfillment.</p>
        </div>
      </div>
    </aside>
  );
}
