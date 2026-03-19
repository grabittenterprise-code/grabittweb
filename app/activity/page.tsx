"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { PageWrapper } from "@/components/ui/page-wrapper";
import { SectionShell } from "@/components/ui/section-shell";

type Activity = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
};

export default function ActivityPage() {
  const router = useRouter();
  const { status } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      const response = await fetch("/api/account-activity");
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Unable to load activity.");
        setLoading(false);
        return;
      }

      setActivities(Array.isArray(data.activities) ? data.activities : []);
      setLoading(false);
    };

    if (status === "authenticated") {
      void load();
    }

    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  return (
    <PageWrapper>
      <SectionShell className="pt-32 sm:pt-36 lg:pt-40">
        <div className="section-wrap max-w-3xl">
          <div className="label-block rounded-[2.6rem] p-8">
            <p className="text-xs uppercase tracking-[0.38em] text-white/55">Account Activity</p>
            <p className="mt-3 text-lg text-white/90">Security and sessions</p>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Review your recent sign-ins and account actions.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {loading ? <p className="text-sm text-white/65">Loading account activity...</p> : null}
            {error ? <p className="text-sm text-red-200">{error}</p> : null}
            {!loading && !error && activities.length === 0 ? (
              <p className="text-sm text-white/65">No activity recorded yet.</p>
            ) : null}
            {activities.map((activity) => (
              <article key={activity.id} className="rounded-xl border border-white/15 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/50">{activity.type}</p>
                <p className="mt-2 text-sm text-white/85">{activity.message}</p>
                <p className="mt-2 text-xs text-white/55">
                  {new Date(activity.createdAt).toLocaleString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </article>
            ))}
          </div>
        </div>
      </SectionShell>
    </PageWrapper>
  );
}
