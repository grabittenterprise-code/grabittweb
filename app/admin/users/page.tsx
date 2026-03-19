"use client";

import { useEffect, useState } from "react";

import { ConfirmModal } from "@/components/admin/confirm-modal";
import { DataTable } from "@/components/admin/data-table";
import { AdminPagination } from "@/components/admin/pagination";

type UserItem = {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
};

type UsersResponse = {
  items: UserItem[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      pageSize: "10",
      query,
    });
    const response = await fetch(`/api/admin/users?${params.toString()}`);
    const json = await response.json().catch(() => ({}));
    if (response.ok) {
      setData(json);
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, [page]);

  const search = async () => {
    setPage(1);
    await load();
  };

  const onDelete = async () => {
    if (!deleteId) {
      return;
    }

    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    });
    setDeleteId(null);
    await load();
  };

  const exportCsv = () => {
    const params = new URLSearchParams({ query, export: "csv" });
    window.open(`/api/admin/users?${params.toString()}`, "_blank");
  };

  return (
    <section>
      <h1 className="text-3xl text-white/95">Users</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search users..."
          className="h-10 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white"
        />
        <button onClick={search} className="h-10 rounded-full border border-white/20 px-4 text-xs uppercase tracking-[0.2em] text-white/80">
          Search
        </button>
        <button onClick={exportCsv} className="h-10 rounded-full border border-white/20 px-4 text-xs uppercase tracking-[0.2em] text-white/80">
          Export CSV
        </button>
      </div>

      <div className="mt-4">
        <DataTable
          items={data?.items ?? []}
          emptyLabel={loading ? "Loading users..." : "No users found."}
          columns={[
            { key: "name", title: "Name", render: (item) => item.name },
            { key: "email", title: "Email", render: (item) => item.email },
            {
              key: "joined",
              title: "Joined Date",
              render: (item) =>
                new Date(item.joinedDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
            },
            {
              key: "actions",
              title: "Actions",
              render: (item) => (
                <button
                  type="button"
                  onClick={() => setDeleteId(item.id)}
                  className="rounded-full border border-red-300/30 px-3 py-1 text-xs text-red-200"
                >
                  Delete
                </button>
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
        title="Delete User"
        description="This will remove the user and related data. Continue?"
        confirmLabel="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={onDelete}
      />
    </section>
  );
}
