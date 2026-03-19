"use client";

import { useEffect, useMemo, useState } from "react";

import { ConfirmModal } from "@/components/admin/confirm-modal";
import { DataTable } from "@/components/admin/data-table";
import { AdminPagination } from "@/components/admin/pagination";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "resolved";
  createdAt: string;
};

type MessagesResponse = {
  items: Message[];
  pagination: { page: number; pageSize: number; total: number; totalPages: number };
};

export default function AdminMessagesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<MessagesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);
  const [replySubject, setReplySubject] = useState("Reply from GRABITT Support");
  const [replyMessage, setReplyMessage] = useState("");
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [replyFeedback, setReplyFeedback] = useState("");

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
    const response = await fetch(`/api/admin/messages?${params.toString()}`);
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

  const resolveMessage = async (id: string) => {
    await fetch("/api/admin/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await load();
  };

  const openReply = (message: Message) => {
    setActiveMessage(message);
    setReplySubject("Reply from GRABITT Support");
    setReplyMessage("");
    setSendEmail(true);
    setSendWhatsApp(Boolean(message.phone));
    setReplyFeedback("");
  };

  const sendReply = async () => {
    if (!activeMessage) {
      return;
    }

    setSendingReply(true);
    setReplyFeedback("");

    try {
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: activeMessage.id,
          subject: replySubject,
          message: replyMessage,
          sendEmail,
          sendWhatsApp,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setReplyFeedback(data.error ?? "Could not send reply.");
        return;
      }

      const sentVia = [
        data.emailSent ? "email" : "",
        data.whatsappSent ? "WhatsApp" : "",
      ].filter(Boolean);
      setReplyFeedback(
        data.warning
          ? `Sent via ${sentVia.join(" and ")}. ${data.warning}`
          : `Sent via ${sentVia.join(" and ")}.`,
      );
      await load();
    } finally {
      setSendingReply(false);
    }
  };

  const deleteMessage = async () => {
    if (!deleteId) {
      return;
    }

    await fetch("/api/admin/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteId }),
    });
    setDeleteId(null);
    await load();
  };

  const exportCsv = () => {
    const csvParams = new URLSearchParams({ query, status, export: "csv" });
    window.open(`/api/admin/messages?${csvParams.toString()}`, "_blank");
  };

  return (
    <section>
      <h1 className="text-3xl text-white/95">Contact Messages</h1>
      <div className="mt-4 flex flex-wrap gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search messages..."
          className="h-10 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-10 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white"
        >
          <option value="">All status</option>
          <option value="new">New</option>
          <option value="resolved">Resolved</option>
        </select>
        <button onClick={applyFilters} className="h-10 rounded-full border border-white/20 px-4 text-xs uppercase tracking-[0.2em] text-white/80">
          Apply
        </button>
        <button onClick={exportCsv} className="h-10 rounded-full border border-white/20 px-4 text-xs uppercase tracking-[0.2em] text-white/80">
          Export CSV
        </button>
      </div>

      <div className="mt-4">
        {activeMessage ? (
          <div className="mb-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg text-white/90">Reply Inbox</h2>
                <p className="mt-2 text-sm text-white/60">
                  To: {activeMessage.name} · {activeMessage.email}
                  {activeMessage.phone ? ` · ${activeMessage.phone}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveMessage(null)}
                className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70"
              >
                Close
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-4 text-sm text-white/75">
              {activeMessage.message}
            </div>

            <div className="mt-4 grid gap-3">
              <input
                value={replySubject}
                onChange={(event) => setReplySubject(event.target.value)}
                placeholder="Email subject"
                className="h-11 rounded-xl border border-white/15 bg-black/35 px-3 text-sm text-white"
              />
              <textarea
                value={replyMessage}
                onChange={(event) => setReplyMessage(event.target.value)}
                placeholder="Type your reply here..."
                rows={6}
                className="rounded-2xl border border-white/15 bg-black/35 px-3 py-3 text-sm text-white"
              />
              <div className="flex flex-wrap gap-4 text-sm text-white/75">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sendEmail}
                    onChange={(event) => setSendEmail(event.target.checked)}
                  />
                  Email
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sendWhatsApp}
                    onChange={(event) => setSendWhatsApp(event.target.checked)}
                    disabled={!activeMessage.phone}
                  />
                  WhatsApp
                </label>
                {!activeMessage.phone ? <span className="text-white/45">No phone number on this message.</span> : null}
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={sendReply}
                  disabled={sendingReply}
                  className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.2em] text-white/85 disabled:opacity-50"
                >
                  {sendingReply ? "Sending..." : "Send Reply"}
                </button>
                {replyFeedback ? <p className="text-sm text-white/65">{replyFeedback}</p> : null}
              </div>
            </div>
          </div>
        ) : null}

        <DataTable
          items={data?.items ?? []}
          emptyLabel={loading ? "Loading messages..." : "No messages found."}
          columns={[
            { key: "name", title: "Name", render: (item) => item.name },
            { key: "email", title: "Email", render: (item) => item.email },
            { key: "phone", title: "Phone", render: (item) => item.phone || "No phone" },
            { key: "preview", title: "Message", render: (item) => item.message.slice(0, 80) },
            {
              key: "date",
              title: "Date",
              render: (item) =>
                new Date(item.createdAt).toLocaleDateString("en-IN", {
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
                    onClick={() => openReply(item)}
                    className="rounded-full border border-sky-300/30 px-3 py-1 text-xs text-sky-200"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    onClick={() => resolveMessage(item.id)}
                    disabled={item.status === "resolved"}
                    className="rounded-full border border-emerald-300/30 px-3 py-1 text-xs text-emerald-200 disabled:opacity-40"
                  >
                    {item.status === "resolved" ? "Resolved" : "Mark Resolved"}
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
        title="Delete Message"
        description="This message will be removed permanently."
        confirmLabel="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={deleteMessage}
      />
    </section>
  );
}
