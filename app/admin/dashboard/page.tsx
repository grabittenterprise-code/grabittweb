"use client";

import { useEffect, useMemo, useState } from "react";

import { formatInr } from "@/lib/pricing";

type OverviewData = {
  metrics: {
    usersCount: number;
    ordersCount: number;
    revenue: number;
    netProfit: number;
    completedOrders: number;
    shippedOrders: number;
    outForDeliveryOrders: number;
    faceWashSales: number;
  };
  growth: Array<{ date: string; revenue: number }>;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    userName: string;
    totalAmount: number;
    status: string;
    placedAt: string;
  }>;
  recentMessages: Array<{
    id: string;
    name: string;
    email: string;
    preview: string;
    status: string;
    createdAt: string;
  }>;
};

function GrowthChart({ points }: { points: Array<{ date: string; revenue: number }> }) {
  const width = 700;
  const height = 220;
  const padding = 26;

  const normalized = useMemo(() => {
    if (points.length === 0) {
      return [];
    }
    const max = Math.max(...points.map((p) => p.revenue), 1);
    return points.map((point, index) => {
      const x = padding + (index * (width - padding * 2)) / Math.max(1, points.length - 1);
      const y = height - padding - (point.revenue / max) * (height - padding * 2);
      return { ...point, x, y };
    });
  }, [points]);

  const polyline = normalized.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="text-lg text-white/90">Revenue Growth (Last 7 Days)</h2>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 w-full">
        <rect x="0" y="0" width={width} height={height} fill="transparent" />
        <polyline
          fill="none"
          stroke="rgba(139, 169, 255, 0.95)"
          strokeWidth="3"
          points={polyline}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {normalized.map((p) => (
          <g key={p.date}>
            <circle cx={p.x} cy={p.y} r="4" fill="rgba(190, 210, 255, 0.95)" />
            <text x={p.x} y={height - 6} textAnchor="middle" fontSize="11" fill="rgba(255,255,255,0.55)">
              {new Date(p.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const response = await fetch("/api/admin/overview");
      const json = await response.json().catch(() => ({}));
      if (response.ok) {
        setData(json);
      }
      setLoading(false);
    };

    void load();
  }, []);

  const metricCards = [
    { label: "Total Users", value: data?.metrics.usersCount ?? 0 },
    { label: "Total Orders", value: data?.metrics.ordersCount ?? 0 },
    { label: "Total Revenue", value: formatInr(data?.metrics.revenue ?? 0) },
    { label: "Net Profit (Est.)", value: formatInr(data?.metrics.netProfit ?? 0) },
    { label: "Orders Completed", value: data?.metrics.completedOrders ?? 0 },
    { label: "Total Shipped", value: data?.metrics.shippedOrders ?? 0 },
    { label: "Out for Delivery", value: data?.metrics.outForDeliveryOrders ?? 0 },
    { label: "Face Wash Sales", value: data?.metrics.faceWashSales ?? 0 },
  ];

  return (
    <section>
      <h1 className="text-3xl text-white/95">Overview</h1>
      <p className="mt-2 text-sm text-white/60">Control center for users, orders and messages.</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-white/12 bg-white/[0.03] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.45)]"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/50">{card.label}</p>
            <p className="mt-3 text-3xl text-white/95">{loading ? "--" : card.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <GrowthChart points={data?.growth ?? []} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-lg text-white/90">Recent Orders</h2>
          <div className="mt-4 space-y-3">
            {(data?.recentOrders ?? []).map((order) => (
              <div key={order.id} className="rounded-xl border border-white/10 bg-black/25 p-3">
                <p className="text-sm text-white/85">
                  {order.orderNumber} - {order.userName}
                </p>
                <p className="mt-1 text-xs text-white/55">
                  {formatInr(order.totalAmount)} | {order.status}
                </p>
              </div>
            ))}
            {!loading && (data?.recentOrders.length ?? 0) === 0 ? (
              <p className="text-sm text-white/55">No recent orders.</p>
            ) : null}
          </div>
        </article>

        <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <h2 className="text-lg text-white/90">Recent Messages</h2>
          <div className="mt-4 space-y-3">
            {(data?.recentMessages ?? []).map((message) => (
              <div key={message.id} className="rounded-xl border border-white/10 bg-black/25 p-3">
                <p className="text-sm text-white/85">
                  {message.name} ({message.email})
                </p>
                <p className="mt-1 text-xs text-white/55">{message.preview}</p>
              </div>
            ))}
            {!loading && (data?.recentMessages.length ?? 0) === 0 ? (
              <p className="text-sm text-white/55">No recent messages.</p>
            ) : null}
          </div>
        </article>
      </div>
    </section>
  );
}
