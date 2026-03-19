"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Menu,
  MessageCircleMore,
  MessageSquare,
  Package,
  Store,
  Users,
} from "lucide-react";

const mainItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Orders", href: "/admin/orders", icon: Package },
];

const supportItems = [
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Feedback", href: "/admin/feedback", icon: MessageCircleMore },
  { label: "Seller Apps", href: "/admin/seller-applications", icon: Store },
];

function DrawerLinks({
  items,
  pathname,
  filled,
}: {
  items: Array<{ label: string; href: string; icon: React.ComponentType<{ className?: string }> }>;
  pathname: string;
  filled?: boolean;
}) {
  return (
    <nav className={filled ? "mt-4 rounded-[1.75rem] bg-white/[0.1] p-2.5 backdrop-blur-sm" : "mt-3 space-y-1"}>
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex items-center gap-3 px-3.5 py-3 text-sm transition ${
              filled
                ? active
                  ? "rounded-[1.15rem] bg-[#10196d] text-white shadow-[0_12px_24px_rgba(7,10,56,0.45)]"
                  : "rounded-[1.15rem] text-white/88 hover:bg-white/[0.08] hover:text-white"
                : active
                  ? "rounded-[1rem] bg-white/[0.14] text-white"
                  : "rounded-[1rem] text-white/82 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                active
                  ? "bg-white/[0.08] text-white"
                  : filled
                    ? "bg-white/[0.08] text-white/85 group-hover:bg-white/[0.12]"
                    : "border border-white/15 bg-white/[0.06] text-white/90 group-hover:bg-white/[0.1]"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="tracking-[0.02em]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full border-b border-white/10 bg-black/20 px-4 py-4 backdrop-blur-xl lg:min-h-screen lg:w-[20rem] lg:border-b-0 lg:border-r lg:px-5 lg:py-5">
      <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#2f63ef_0%,#234fc9_42%,#173696_100%)] p-5 shadow-[0_24px_60px_rgba(3,10,30,0.45)] lg:min-h-[calc(100vh-2.5rem)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.38em] text-white/65">GRABITT</p>
            <h1 className="mt-3 text-2xl text-white">Admin Panel</h1>
            <p className="mt-2 max-w-[15rem] text-sm leading-6 text-white/75">
              Calm control for users, orders, support, and seller review.
            </p>
          </div>
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white">
            <Menu className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">Main Navigation</p>
          <DrawerLinks items={mainItems} pathname={pathname} filled />
        </div>

        <div className="mt-6">
          <p className="text-[11px] uppercase tracking-[0.35em] text-white/60">Operations</p>
          <DrawerLinks items={supportItems} pathname={pathname} />
        </div>

        <div className="mt-8 rounded-[1.5rem] border border-white/15 bg-black/15 p-4 text-white/80">
          <p className="text-[11px] uppercase tracking-[0.32em] text-white/55">Workspace</p>
          <p className="mt-3 text-sm leading-6">
            Review user activity, resolve support issues, and keep order flow organized in one place.
          </p>
        </div>
      </div>
    </aside>
  );
}
