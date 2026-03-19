"use client";

import { usePathname } from "next/navigation";

import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminTopbar } from "@/components/admin/topbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%),linear-gradient(180deg,#0a0a0a,#0d0d0d)] text-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AdminSidebar />
        <div className="flex-1">
          <AdminTopbar />
          <div className="p-4 lg:p-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
