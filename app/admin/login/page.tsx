"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const next =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("next") || "/admin/dashboard"
      : "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: email,
        password,
      });

      if (result?.error) {
        setError("Invalid credentials.");
        return;
      }

      const check = await fetch("/api/admin/overview");
      if (!check.ok) {
        await signOut({ redirect: false });
        setError("This account is not authorized for admin panel.");
        return;
      }

      router.push(next);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_35%),linear-gradient(180deg,#0a0a0a,#0f0f0f)] text-white">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-5">
        <div className="w-full rounded-3xl border border-white/15 bg-white/[0.03] p-8 backdrop-blur">
          <p className="text-xs uppercase tracking-[0.35em] text-white/55">GRABITT</p>
          <h1 className="mt-2 text-3xl text-white/95">Admin Login</h1>
          <p className="mt-2 text-sm text-white/60">Secure access for authorized operators only.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-sm text-white"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-sm text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-white text-xs font-semibold uppercase tracking-[0.25em] text-black transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {error ? <p className="mt-4 text-xs text-red-200">{error}</p> : null}
        </div>
      </div>
    </main>
  );
}
