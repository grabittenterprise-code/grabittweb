"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { LabelBlock } from "@/components/ui/label-block";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SectionShell } from "@/components/ui/section-shell";
import { PRODUCT_PRICING } from "@/lib/pricing";

type RecentItem = {
  id: string;
  productId: string;
  name: string;
  subtitle: string;
  price: number;
  currency: "INR";
  imageUrl: string;
  viewedAt: string;
};

export default function RecentPage() {
  const router = useRouter();
  const { status } = useSession();
  const [items, setItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  const loadRecent = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/recent");
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Unable to load recently viewed items.");
        return;
      }

      setItems(Array.isArray(data.items) ? data.items : []);
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
      void loadRecent();
    }
  }, [status, router]);

  const addSampleView = async () => {
    setWorking(true);
    setError("");
    try {
      const response = await fetch("/api/recent", { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Could not add recent item.");
        return;
      }
      await loadRecent();
    } finally {
      setWorking(false);
    }
  };

  const removeItem = async (productId: string) => {
    setWorking(true);
    setError("");
    try {
      const response = await fetch(`/api/recent?productId=${encodeURIComponent(productId)}`, {
        method: "DELETE",
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Could not remove viewed item.");
        return;
      }
      await loadRecent();
    } finally {
      setWorking(false);
    }
  };

  const clearAll = async () => {
    setWorking(true);
    setError("");
    try {
      const response = await fetch("/api/recent", { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error ?? "Could not clear history.");
        return;
      }
      await loadRecent();
    } finally {
      setWorking(false);
    }
  };

  return (
    <PageWrapper>
      <SectionShell className="pt-32 sm:pt-36 lg:pt-40">
        <div className="section-wrap">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <LabelBlock
              label="Recently Viewed"
              title="Continue where you left off"
              copy="Your browsing history is linked to your account and sorted by latest activity."
              className="rounded-[2.6rem] p-8 lg:max-w-2xl"
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addSampleView}
                disabled={working || loading}
                className="h-12 rounded-full border border-white/20 px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-white/10 disabled:opacity-50"
              >
                Add Sample View
              </button>
              <button
                type="button"
                onClick={clearAll}
                disabled={working || loading || items.length === 0}
                className="h-12 rounded-full border border-white/15 px-6 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 transition hover:bg-white/10 disabled:opacity-50"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <div className="section-wrap">
          <div className="mb-6 text-sm text-white/65">Viewed items: {items.length}</div>
          {loading ? <p className="text-sm text-white/65">Loading recently viewed items...</p> : null}
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
          {!loading && !error && items.length === 0 ? (
            <p className="text-sm text-white/65">No recent views yet.</p>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2">
            {items.map((item) => (
              <article key={item.id} className="rounded-2xl border border-white/15 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">{item.subtitle}</p>
                <p className="mt-3 text-xl text-white/90">{item.name}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-emerald-200">
                    {PRODUCT_PRICING.offerLabel}
                  </span>
                  <p className="text-sm text-white/85">₹{item.price.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-white/45 line-through">₹{PRODUCT_PRICING.originalPrice}</p>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-white/50">
                    Viewed{" "}
                    {new Date(item.viewedAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    disabled={working}
                    className="rounded-full border border-white/20 px-4 py-1 text-xs uppercase tracking-[0.18em] text-white/75 transition hover:bg-white/10 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>
    </PageWrapper>
  );
}
