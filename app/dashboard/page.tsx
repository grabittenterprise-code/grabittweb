"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

import { useAuth } from "@/components/context/auth-context";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SectionShell } from "@/components/ui/section-shell";

type DashboardSummary = {
  stats: {
    ordersCount: number;
    wishlistCount: number;
    recentCount: number;
    lastOrderStatus: string | null;
    lastOrderDate: string | null;
  };
  referral: {
    code: string | null;
    invitesCount: number;
  };
  activities: Array<{ id: string; type: string; message: string; createdAt: string }>;
};

export default function DashboardPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { data: session, status } = useSession();
  const userName = session?.user?.name?.trim() || "there";

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackState, setFeedbackState] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteState, setInviteState] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [submittingInvite, setSubmittingInvite] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const loadDashboard = async () => {
    setLoading(true);
    setDashboardError("");

    try {
      const response = await fetch("/api/dashboard");
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      if (!response.ok) {
        setDashboardError(data.error ?? "Unable to load dashboard.");
        return;
      }

      setSummary(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      void loadDashboard();
    }
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedbackState("");

    if (!feedbackMessage.trim()) {
      setFeedbackState("Please enter feedback before submitting.");
      return;
    }

    setSubmittingFeedback(true);
    try {
      const response = await fetch("/api/dashboard/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: feedbackMessage }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFeedbackState(data.error ?? "Unable to submit feedback.");
        return;
      }

      setFeedbackMessage("");
      setFeedbackState("Thanks. Your feedback has been saved.");
      await loadDashboard();
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const submitInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setInviteState("");

    if (!inviteEmail.trim()) {
      setInviteState("Enter an email to send invite.");
      return;
    }

    setSubmittingInvite(true);
    try {
      const response = await fetch("/api/dashboard/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setInviteState(data.error ?? "Unable to send invite.");
        return;
      }

      setInviteEmail("");
      setInviteState("Invite recorded successfully.");
      await loadDashboard();
    } finally {
      setSubmittingInvite(false);
    }
  };

  return (
    <PageWrapper>
      <SectionShell className="pt-32 sm:pt-36 lg:pt-40">
        <div className="section-wrap">
          <div className="grid gap-10 lg:grid-cols-2 items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-white/55">My Account</p>
              <h1 className="font-serif text-5xl leading-[0.95] text-white/95 sm:text-6xl lg:text-[5rem]">
                Welcome back,
                <span className="block text-white/55">{userName}.</span>
              </h1>
            </div>
            <p className="max-w-xl text-base leading-8 text-white/65 sm:text-lg">
              {loading
                ? "Loading your dashboard..."
                : "A calm, personal space for your orders, favorites, and account preferences. No noise, just what you need."}
            </p>
          </div>
          {dashboardError ? <p className="mt-4 text-sm text-red-200">{dashboardError}</p> : null}
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <div className="section-wrap">
          <p className="mb-6 text-xs uppercase tracking-[0.45em] text-white/55">Quick Actions</p>
          <div className="grid gap-8 lg:grid-cols-3">
            <Link href="/orders" className="label-block card-lift rounded-2xl px-5 py-5">
              <p className="text-xs uppercase tracking-[0.38em] text-white/55">Orders</p>
              <p className="mt-3 text-lg text-white/90">View orders ({summary?.stats.ordersCount ?? 0})</p>
              <p className="mt-3 text-sm text-white/60">
                Last status: {summary?.stats.lastOrderStatus ? summary.stats.lastOrderStatus.replaceAll("_", " ") : "No orders yet"}
              </p>
            </Link>
            <Link href="/wishlist" className="label-block card-lift rounded-2xl px-5 py-5">
              <p className="text-xs uppercase tracking-[0.38em] text-white/55">Wishlist</p>
              <p className="mt-3 text-lg text-white/90">Saved rituals ({summary?.stats.wishlistCount ?? 0})</p>
              <p className="mt-3 text-sm text-white/60">Your curated product list synced with backend.</p>
            </Link>
            <Link href="/recent" className="label-block card-lift rounded-2xl px-5 py-5">
              <p className="text-xs uppercase tracking-[0.38em] text-white/55">Recently Viewed</p>
              <p className="mt-3 text-lg text-white/90">Return to products ({summary?.stats.recentCount ?? 0})</p>
              <p className="mt-3 text-sm text-white/60">Continue where you left off.</p>
            </Link>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <div className="section-wrap">
          <p className="mb-6 text-xs uppercase tracking-[0.45em] text-white/55">Support</p>
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <Link href="/help" className="label-block card-lift rounded-2xl px-6 py-6">
              <p className="text-xs uppercase tracking-[0.38em] text-white/55">Help Center</p>
              <p className="mt-3 text-lg text-white/90">Guides & FAQs</p>
              <p className="mt-3 text-sm text-white/60">Find answers in minutes.</p>
            </Link>
            <Link href="/contact" className="label-block card-lift rounded-2xl px-6 py-6">
              <p className="text-xs uppercase tracking-[0.38em] text-white/55">Contact Us</p>
              <p className="mt-3 text-lg text-white/90">Luxury concierge</p>
              <p className="mt-3 text-sm text-white/60">Personalized routine support.</p>
            </Link>
          </div>
          <div className="mt-6 label-block rounded-2xl px-6 py-5">
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">Feedback</p>
            <p className="mt-2 text-lg text-white/90">Share your experience</p>
            <p className="mt-2 text-sm text-white/60">Tell us what feels right and what could be more effortless.</p>
            <form className="mt-4 space-y-3" onSubmit={submitFeedback}>
              <textarea
                value={feedbackMessage}
                onChange={(event) => setFeedbackMessage(event.target.value)}
                placeholder="Write feedback..."
                className="min-h-24 w-full rounded-xl border border-white/15 bg-black/30 p-3 text-sm text-white"
              />
              <button
                type="submit"
                disabled={submittingFeedback}
                className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10 disabled:opacity-50"
              >
                {submittingFeedback ? "Submitting..." : "Submit Feedback"}
              </button>
            </form>
            {feedbackState ? <p className="mt-3 text-xs text-white/65">{feedbackState}</p> : null}
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <div className="section-wrap">
          <p className="mb-6 text-xs uppercase tracking-[0.45em] text-white/55">Account</p>
          <div className="grid gap-10 lg:grid-cols-2 items-start">
            <Link href="/settings" className="label-block card-lift rounded-2xl px-6 py-6">
              <p className="text-xs uppercase tracking-[0.38em] text-white/55">Account Settings</p>
              <p className="mt-3 text-lg text-white/90">Profile details</p>
              <p className="mt-3 text-sm text-white/60">Update your information and address.</p>
            </Link>
            <Link href="/activity" className="label-block card-lift rounded-2xl px-6 py-6">
              <p className="text-xs uppercase tracking-[0.38em] text-white/55">Account Activity</p>
              <p className="mt-3 text-lg text-white/90">Security & sessions</p>
              <p className="mt-3 text-sm text-white/60">
                {summary?.activities[0]?.message ?? "Review logins and recent actions."}
              </p>
            </Link>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <div className="section-wrap">
          <div className="label-block rounded-2xl px-6 py-5">
            <p className="text-xs uppercase tracking-[0.35em] text-white/55">Earn with GRABITT</p>
            <p className="mt-2 text-lg text-white/90">Invite a friend</p>
            <p className="mt-2 text-sm text-white/60">
              Referral code: {summary?.referral.code ?? "Generating..."} | Invites sent: {summary?.referral.invitesCount ?? 0}
            </p>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={submitInvite}>
              <input
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="friend@email.com"
                className="h-11 flex-1 rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              />
              <button
                type="submit"
                disabled={submittingInvite}
                className="h-11 rounded-full border border-white/20 px-5 text-xs uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10 disabled:opacity-50"
              >
                {submittingInvite ? "Sending..." : "Send Invite"}
              </button>
            </form>
            {inviteState ? <p className="mt-3 text-xs text-white/65">{inviteState}</p> : null}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-10 text-xs uppercase tracking-[0.4em] text-white/55 transition hover:text-white/80"
          >
            Log Out
          </button>
        </div>
      </SectionShell>
    </PageWrapper>
  );
}
