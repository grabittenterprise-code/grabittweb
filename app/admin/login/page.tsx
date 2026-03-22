"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import { BrandLogo } from "@/components/ui/brand-logo";

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/admin/dashboard";
  const tokenFromUrl = searchParams.get("token")?.trim() ?? "";

  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setError("");
    setMessage("");
  }, [mode]);

  useEffect(() => {
    if (!tokenFromUrl) {
      return;
    }

    setResetToken(tokenFromUrl);
    setMode("reset");
  }, [tokenFromUrl]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "forgot") {
        if (!email.trim()) {
          setError("Enter your admin email first.");
          return;
        }

        const response = await fetch("/api/auth/forgot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, callbackPath: "/admin/login" }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          setError(data.error ?? "Unable to send reset email.");
          return;
        }

        setMessage("If that admin account exists, we sent a password reset email.");
        return;
      }

      if (mode === "reset") {
        if (!resetToken) {
          setError("Reset token is missing. Request a new email.");
          return;
        }

        if (!newPassword.trim() || !confirmPassword.trim()) {
          setError("Enter and confirm your new password.");
          return;
        }

        if (newPassword !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        const response = await fetch("/api/auth/reset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: resetToken, password: newPassword }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          setError(data.error ?? "Unable to reset password.");
          return;
        }

        setMode("login");
        setResetToken("");
        setNewPassword("");
        setConfirmPassword("");
        setPassword("");
        setMessage("Password updated. Sign in with your new admin password.");
        router.replace("/admin/login");
        return;
      }

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
          <BrandLogo className="max-w-[10rem]" imageClassName="object-contain" priority />
          <h1 className="mt-4 text-3xl text-white/95">
            {mode === "reset" ? "Reset Admin Password" : mode === "forgot" ? "Forgot Password" : "Admin Login"}
          </h1>
          <p className="mt-2 text-sm text-white/60">
            {mode === "reset"
              ? "Set a new password for your admin account."
              : mode === "forgot"
                ? "We will send a reset link to your admin email."
                : "Secure access for authorized operators only."}
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-sm text-white"
            />
            {mode === "login" ? (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-sm text-white"
              />
            ) : null}
            {mode === "reset" ? (
              <>
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-sm text-white"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 text-sm text-white"
                />
              </>
            ) : null}
            {mode === "login" ? (
              <button
                type="button"
                className="text-xs text-white/60 transition hover:text-white"
                onClick={() => setMode("forgot")}
              >
                Forgot password?
              </button>
            ) : null}
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-full bg-white text-xs font-semibold uppercase tracking-[0.25em] text-black transition disabled:opacity-60"
            >
              {loading
                ? mode === "login"
                  ? "Signing in..."
                  : mode === "forgot"
                    ? "Sending email..."
                    : "Updating..."
                : mode === "login"
                  ? "Sign In"
                  : mode === "forgot"
                    ? "Send Reset Email"
                    : "Update Password"}
            </button>
          </form>

          {error ? <p className="mt-4 text-xs text-red-200">{error}</p> : null}
          {message ? <p className="mt-4 text-xs text-emerald-200">{message}</p> : null}
          {mode !== "login" ? (
            <button
              type="button"
              className="mt-4 text-xs text-white/60 transition hover:text-white"
              onClick={() => setMode("login")}
            >
              Back to admin login
            </button>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <AdminLoginContent />
    </Suspense>
  );
}
