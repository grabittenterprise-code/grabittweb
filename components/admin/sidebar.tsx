"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircleMore,
  MessageSquare,
  Package,
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
    <aside className="w-full border-b border-white/10 bg-black/25 px-4 py-4 backdrop-blur-xl lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="lg:flex lg:min-h-[calc(100vh-3rem)] lg:flex-col">
        <div className="px-2">
          <p className="text-[11px] uppercase tracking-[0.38em] text-white/40">GRABITT</p>
          <h1 className="mt-3 text-2xl text-white/95">Admin Panel</h1>
          <p className="mt-2 max-w-[15rem] text-sm leading-6 text-white/55">
            Calm control for users, orders, support, and seller review.
          </p>
        </div>

        <div className="mt-8 lg:flex-1">
          <p className="px-2 text-[11px] uppercase tracking-[0.35em] text-white/35">Navigation</p>
          <nav className="mt-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/68 hover:bg-white/[0.045] hover:text-white"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                      active
                        ? "bg-white/[0.08] text-white"
                        : "bg-white/[0.03] text-white/60 group-hover:text-white/90"
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
      </div>
    </aside>
  );
}
