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

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="w-full rounded-[1.75rem] border border-white/10 bg-[#111111]/95 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="border-b border-white/10 px-3 pb-4 pt-2">
        <p className="text-[11px] uppercase tracking-[0.38em] text-white/38">GRABITT</p>
        <h2 className="mt-3 text-xl text-white/95">Admin Menu</h2>
        <p className="mt-2 text-sm leading-6 text-white/58">Quick access to dashboard, users, orders, inbox, and seller review.</p>
      </div>

      <nav className="mt-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                active ? "bg-white/10 text-white" : "text-white/72 hover:bg-white/[0.045] hover:text-white"
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
  );
}
