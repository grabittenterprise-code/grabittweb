"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Package, Users, MessageCircleMore, Store } from "lucide-react";

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
    <aside className="w-full border-r border-white/10 bg-black/35 p-4 lg:w-64">
      <div className="mb-6 px-2">
        <p className="text-xs uppercase tracking-[0.35em] text-white/45">GRABITT</p>
        <p className="mt-2 text-xl text-white/95">Admin Panel</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
