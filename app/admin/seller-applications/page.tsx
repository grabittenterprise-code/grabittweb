"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/admin/data-table";
import { AdminPagination } from "@/components/admin/pagination";

type SellerApplication = {
  id: string;
  businessName: string;
  contactName: string;
  userName: string;
  userEmail: string;
  phone: string;
  category: string;
  website: string;
  message: string;
  status: "new" | "under_review" | "approved" | "rejected";
  createdAt: string;
};

type SellerApplicationsResponse = {
  items: SellerApplication[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};

const statuses = ["", "new", "under_review", "approved", "rejected"];

export default function AdminSellerApplicationsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<SellerApplicationsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const params = useMemo(
    () =>
      new URLSearchParams({
        page: String(page),
        pageSize: "10",
        query,
        status,
      }),
    [page, query, status],
  );

  const load = async () => {
    setLoading(true);
    const response = await fetch(`/api/admin/seller-applications?${params.toString()}`);
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

  const updateStatus = async (id: string, nextStatus: SellerApplication["status"]) => {
    await fetch("/api/admin/seller-applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    await load();
  };

  return (
    <section>
      <h1 className="text-3xl text-white/95">Seller Applications</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search applications..."
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
        <button onClick={applyFilters} className="h-10 rounded-full border border-white/20 px-4 text-xs uppercase tracking-[0.2em] text-white/80">
          Apply
        </button>
      </div>

      <div className="mt-4">
        <DataTable
          items={data?.items ?? []}
          emptyLabel={loading ? "Loading applications..." : "No applications found."}
          columns={[
            { key: "business", title: "Business", render: (item) => item.businessName },
            { key: "contact", title: "Contact", render: (item) => `${item.contactName} (${item.phone})` },
            { key: "user", title: "User", render: (item) => item.userEmail },
            { key: "category", title: "Category", render: (item) => item.category },
            { key: "message", title: "Application", render: (item) => item.message.slice(0, 90) },
            {
              key: "status",
              title: "Status",
              render: (item) => (
                <select
                  value={item.status}
                  onChange={(event) => void updateStatus(item.id, event.target.value as SellerApplication["status"])}
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
          ]}
        />
        <AdminPagination
          page={data?.pagination.page ?? 1}
          totalPages={data?.pagination.totalPages ?? 1}
          onChange={setPage}
        />
      </div>
    </section>
  );
}
