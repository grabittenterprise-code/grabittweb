"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { PageWrapper } from "@/components/ui/page-wrapper";
import { SectionShell } from "@/components/ui/section-shell";
import { LabelBlock } from "@/components/ui/label-block";
import { PRODUCT_PRICING } from "@/lib/pricing";

type OrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

type Order = {
  id: string;
  orderNumber: string;
  status: "pending" | "paid" | "cancelled" | "delivered" | "shipped" | "out_for_delivery";
  statusLabel: string;
  items: OrderItem[];
  itemCount: number;
  totalAmount: number;
  currency: "INR";
  placedAt: string;
};

function statusClass(status: Order["status"]): string {
  if (status === "delivered") {
    return "text-emerald-300 bg-emerald-400/10 border border-emerald-300/40";
  }

  if (status === "cancelled") {
    return "text-red-300 bg-red-400/10 border border-red-300/40";
  }

  if (status === "out_for_delivery") {
    return "text-amber-300 bg-amber-400/10 border border-amber-300/40";
  }

  return "text-sky-300 bg-sky-400/10 border border-sky-300/40";
}

export default function OrdersPage() {
  const router = useRouter();
  const { status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [cancellingId, setCancellingId] = useState("");
  const [error, setError] = useState("");

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + order.totalAmount, 0),
    [orders],
  );

  const loadOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders");
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Unable to load orders.");
        return;
      }

      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    if (status === "authenticated") {
      void loadOrders();
    }
  }, [status, router]);

  const createExampleOrder = async () => {
    setCreating(true);
    setError("");

    try {
      const response = await fetch("/api/orders", { method: "POST" });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error ?? "Could not create sample order.");
        return;
      }

      await loadOrders();
    } finally {
      setCreating(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    setCancellingId(orderId);
    setError("");

    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "PATCH" });
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Unable to cancel this order.");
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled", statusLabel: "Cancelled" } : order,
        ),
      );
    } finally {
      setCancellingId("");
    }
  };

  return (
    <PageWrapper>
      <SectionShell className="pt-32 sm:pt-36 lg:pt-40">
        <div className="section-wrap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <LabelBlock
              label="Orders"
              title="Order history"
              copy="Your orders are now synced from the backend and shown here by account."
              className="rounded-[2.6rem] p-8 lg:max-w-2xl"
            />
            <button
              type="button"
              onClick={createExampleOrder}
              disabled={creating || loading}
              className="h-12 rounded-full border border-white/20 px-6 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create Example Order"}
            </button>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <div className="section-wrap">
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-white/65">
            <span>Total orders: {orders.length}</span>
            <span>Total value: ₹{totalSpent.toLocaleString("en-IN")}</span>
          </div>

          {loading ? <p className="text-sm text-white/65">Loading orders...</p> : null}
          {error ? <p className="text-sm text-red-200">{error}</p> : null}

          {!loading && !error && orders.length === 0 ? (
            <p className="text-sm text-white/65">No orders yet.</p>
          ) : null}

          <div className="grid gap-5">
            {orders.map((order) => {
              const canCancel = order.status === "pending" || order.status === "paid";

              return (
                <article key={order.id} className="rounded-2xl border border-white/15 bg-white/[0.03] p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-white/55">{order.orderNumber}</p>
                    <p className="mt-2 text-sm text-white/70">
                      Placed:{" "}
                      {new Date(order.placedAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs uppercase tracking-[0.18em] ${statusClass(order.status)}`}>
                    {order.statusLabel}
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {order.items.map((item, index) => (
                    <p key={`${order.id}-${index}`} className="text-sm text-white/80">
                      {item.name} x {item.quantity} · ₹{item.unitPrice.toLocaleString("en-IN")}{" "}
                      <span className="ml-2 rounded-full border border-emerald-300/35 bg-emerald-300/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-emerald-200">
                        {PRODUCT_PRICING.offerLabel}
                      </span>
                    </p>
                  ))}
                </div>

                <div className="mt-4 border-t border-white/10 pt-4 text-sm text-white/75">
                  Items: {order.itemCount} | Total: ₹{order.totalAmount.toLocaleString("en-IN")}
                </div>
                <a
                  href={`/api/orders/${order.id}/invoice`}
                  className="mt-4 inline-flex rounded-full border border-white/20 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10"
                >
                  Download Invoice
                </a>
                {canCancel ? (
                  <button
                    type="button"
                    onClick={() => cancelOrder(order.id)}
                    disabled={cancellingId === order.id}
                    className="ml-3 mt-4 inline-flex rounded-full border border-red-300/30 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-red-200 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
                  </button>
                ) : (
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/45">
                    {order.status === "cancelled"
                      ? "This order has already been cancelled."
                      : "Cancellation is available only before the order is shipped."}
                  </p>
                )}
                </article>
              );
            })}
          </div>
        </div>
      </SectionShell>
    </PageWrapper>
  );
}
