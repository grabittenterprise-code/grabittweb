"use client";

import { useEffect, useMemo, useState } from "react";

import { ConfirmModal } from "@/components/admin/confirm-modal";
import { DataTable } from "@/components/admin/data-table";
import { AdminPagination } from "@/components/admin/pagination";

type OrderItem = {
  name: string;
  quantity: number;
  unitPrice: number;
};

type ShippingAddress = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Order = {
  id: string;
  orderNumber: string;
  userName: string;
  userEmail: string;
  customerPhone: string;
  product: string;
  price: number;
  status: string;
  date: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress | null;
};

type OrdersResponse = {
  items: Order[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};

const statuses = ["", "pending", "paid", "shipped", "out_for_delivery", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<OrdersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const params = useMemo(
    () =>
      new URLSearchParams({
        page: String(page),
        pageSize: "10",
        query,
        status,
        dateFrom,
        dateTo,
      }),
    [page, query, status, dateFrom, dateTo],
  );

  const load = async () => {
    setLoading(true);
    const response = await fetch(`/api/admin/orders?${params.toString()}`);
    const json = await response.json().catch(() => ({}));
    if (response.ok) {
      setData(json);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [page]);

  const applyFilters = async () => {
    setPage(1);
    await load();
  };

  const onDelete = async () => {
    if (!deleteId) {
      return;
    }
    await fetch(`/api/admin/orders/${deleteId}`, { method: "DELETE" });
    setDeleteId(null);
    await load();
  };

  const onStatusChange = async (id: string, nextStatus: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    await load();
  };

  const exportCsv = () => {
    const csvParams = new URLSearchParams({
      query,
      status,
      dateFrom,
      dateTo,
      export: "csv",
    });
    window.open(`/api/admin/orders?${csvParams.toString()}`, "_blank");
  };

  return (
    <section>
      <h1 className="text-3xl text-white/95">Orders</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search orders..."
          className="h-10 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-10 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white"
        >
          {statuses.map((value) => (
            <option key={value || "all"} value={value}>
              {value ? value.replaceAll("_", " ") : "All statuses"}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={(event) => setDateFrom(event.target.value)}
          className="h-10 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(event) => setDateTo(event.target.value)}
          className="h-10 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white"
        />
        <button onClick={applyFilters} className="h-10 rounded-full border border-white/20 px-4 text-xs uppercase tracking-[0.2em] text-white/80">
          Apply
        </button>
        <button onClick={exportCsv} className="h-10 rounded-full border border-white/20 px-4 text-xs uppercase tracking-[0.2em] text-white/80">
          Export CSV
        </button>
      </div>

      <div className="mt-4">
        <DataTable
          items={data?.items ?? []}
          emptyLabel={loading ? "Loading orders..." : "No orders found."}
          columns={[
            { key: "orderId", title: "Order ID", render: (item) => item.orderNumber },
            { key: "user", title: "User", render: (item) => item.userName },
            { key: "product", title: "Product", render: (item) => item.product },
            { key: "price", title: "Price", render: (item) => `Rs ${item.price.toLocaleString("en-IN")}` },
            {
              key: "status",
              title: "Status",
              render: (item) => (
                <select
                  value={item.status}
                  onChange={(event) => void onStatusChange(item.id, event.target.value)}
                  className="rounded-lg border border-white/20 bg-black/35 px-2 py-1 text-xs text-white"
                >
                  {statuses.filter(Boolean).map((value) => (
                    <option key={value} value={value}>
                      {value.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              ),
            },
            {
              key: "date",
              title: "Date",
              render: (item) =>
                new Date(item.date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
            },
            {
              key: "actions",
              title: "Actions",
              render: (item) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(item)}
                    className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/80"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(item.id)}
                    className="rounded-full border border-red-300/30 px-3 py-1 text-xs text-red-200"
                  >
                    Delete
                  </button>
                </div>
              ),
            },
          ]}
        />
        <AdminPagination
          page={data?.pagination.page ?? 1}
          totalPages={data?.pagination.totalPages ?? 1}
          onChange={setPage}
        />
      </div>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete Order"
        description="This order will be removed permanently."
        confirmLabel="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={onDelete}
      />

      {selectedOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#111] p-5">
            <h3 className="text-xl text-white/95">Order Details</h3>
            <p className="mt-2 text-sm text-white/65">
              {selectedOrder.orderNumber} - {selectedOrder.userName}
            </p>
            <p className="mt-1 text-sm text-white/55">
              {selectedOrder.userEmail}
              {selectedOrder.customerPhone ? ` · ${selectedOrder.customerPhone}` : ""}
            </p>
            <div className="mt-4 space-y-2">
              {selectedOrder.items.map((item, index) => (
                <div key={`${item.name}-${index}`} className="rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/85">
                  {item.name} x {item.quantity} (Rs {item.unitPrice.toLocaleString("en-IN")})
                </div>
              ))}
            </div>
            {selectedOrder.shippingAddress ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-3 text-sm text-white/80">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">Shipping Address</p>
                <p className="mt-2">{selectedOrder.shippingAddress.fullName}</p>
                <p>{selectedOrder.shippingAddress.line1}</p>
                {selectedOrder.shippingAddress.line2 ? <p>{selectedOrder.shippingAddress.line2}</p> : null}
                <p>
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                  {selectedOrder.shippingAddress.postalCode}
                </p>
                <p>{selectedOrder.shippingAddress.country}</p>
              </div>
            ) : null}
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/75"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
