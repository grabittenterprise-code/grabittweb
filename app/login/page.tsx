"use client";

import { Suspense, FormEvent, useEffect, useState } from "react";
import { getProviders, signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [mode, setMode] = useState<"login" | "register" | "forgot" | "reset">("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleAvailable, setIsGoogleAvailable] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const nextPath = searchParams.get("next") || "/";
  const notice = searchParams.get("notice");
  const isRegister = mode === "register";
  const isForgot = mode === "forgot";
  const isReset = mode === "reset";

  useEffect(() => {
    setError("");
  }, [mode]);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace(nextPath);
    }
  }, [status, router, nextPath]);

  useEffect(() => {
    let isMounted = true;
    const loadProviders = async () => {
      const providers = await getProviders();
      if (!isMounted) {
        return;
      }

      setIsGoogleAvailable(Boolean(providers?.google));
    };

    void loadProviders();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token")?.trim() ?? "";
    const modeFromUrl = searchParams.get("mode")?.trim() ?? "";

    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setMode("reset");
      return;
    }

    if (modeFromUrl === "forgot") {
      setMode("forgot");
    }
  }, [searchParams]);

  useEffect(() => {
    if (notice === "login-first") {
      setMessage("Login first to continue to checkout.");
    }
  }, [notice]);

  const handleGoogleSignIn = async () => {
    setError("");
    if (!isGoogleAvailable) {
      setError("Google login is not configured yet.");
      return;
    }

    await signIn("google", { callbackUrl: nextPath });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      if (isReset) {
        if (!resetToken) {
          setError("Reset token is missing. Please request a new reset link.");
          return;
        }

        if (!newPassword.trim() || !confirmPassword.trim()) {
          setError("Please enter and confirm your new password.");
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
        setMessage("Password changed successfully. Please login with your new password.");
        router.replace("/login");
        return;
      }

      if (isForgot) {
        if (!email.trim()) {
          setError("Please enter your email.");
          return;
        }

        const response = await fetch("/api/auth/forgot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          setError(data.error ?? "Unable to send reset link.");
          return;
        }

        if (data.emailSent) {
          setMessage("If that email exists, we sent a reset link.");
          return;
        }

        setMessage(
          data.resetUrl
            ? `Email service is not configured. Dev reset link: ${data.resetUrl}`
            : "If that email exists, we sent a reset link.",
        );
        return;
      }

      if (isRegister) {
        if (!username.trim() || !email.trim() || !password.trim()) {
          setError("Please fill out all fields.");
          return;
        }

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setError(data.error ?? "Registration failed.");
          return;
        }

        const result = await signIn("credentials", {
          redirect: false,
          identifier: username,
          password,
          remember: rememberMe ? "1" : "0",
          callbackUrl: nextPath,
        });

        if (result?.error) {
          setError("Account created, but login failed.");
          return;
        }

        setMessage("Account created. You are signed in.");
        router.replace(result?.url ?? nextPath);
        return;
      }

      if (!identifier.trim() || !password.trim()) {
        setError("Enter your username or email and password.");
        return;
      }

      const result = await signIn("credentials", {
        redirect: false,
        identifier,
        password,
        remember: rememberMe ? "1" : "0",
        callbackUrl: nextPath,
      });

      if (result?.error) {
        setError("Invalid username/email or password.");
        return;
      }

      setMessage("Login successful.");
      router.replace(result?.url ?? nextPath);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/25432.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-[90%] max-w-[340px] rounded-[20px] border border-white/15 bg-white/5 p-8 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-[20px] transition-transform duration-300 hover:-translate-y-1 sm:p-10">
          <h1 className="text-center text-3xl font-semibold tracking-wide">
            {isReset ? "Set New Password" : isForgot ? "Reset Password" : isRegister ? "Register" : "Login"}
          </h1>
          <p className="mt-2 text-center text-sm text-[#A8A8A8]">
            {isReset
              ? "Enter your new password below"
              : isForgot
                ? "We will email you a secure reset link"
                : isRegister
                  ? "Create your GRABITT account"
                  : "Access your GRABITT account"}
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {!isForgot && !isReset ? (
              <label className="relative block">
                <input
                  type="text"
                  placeholder={isRegister ? "Username" : "Username or email"}
                  className="h-12 w-full rounded-full border border-white/20 bg-transparent px-4 pr-11 text-sm text-white placeholder:text-[#A8A8A8] transition focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  autoComplete="username"
                  value={isRegister ? username : identifier}
                  onChange={(event) =>
                    isRegister ? setUsername(event.target.value) : setIdentifier(event.target.value)
                  }
                />
              </label>
            ) : null}

            {isRegister || isForgot ? (
              <label className="relative block">
                <input
                  type="email"
                  placeholder="Email"
                  className="h-12 w-full rounded-full border border-white/20 bg-transparent px-4 pr-11 text-sm text-white placeholder:text-[#A8A8A8] transition focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
            ) : null}

            {!isForgot && !isReset ? (
              <label className="relative block">
                <input
                  type="password"
                  placeholder="Password"
                  className="h-12 w-full rounded-full border border-white/20 bg-transparent px-4 pr-11 text-sm text-white placeholder:text-[#A8A8A8] transition focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
            ) : null}

            {isReset ? (
              <>
                <label className="relative block">
                  <input
                    type="password"
                    placeholder="New password"
                    className="h-12 w-full rounded-full border border-white/20 bg-transparent px-4 pr-11 text-sm text-white placeholder:text-[#A8A8A8] transition focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                  />
                </label>
                <label className="relative block">
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="h-12 w-full rounded-full border border-white/20 bg-transparent px-4 pr-11 text-sm text-white placeholder:text-[#A8A8A8] transition focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                </label>
              </>
            ) : null}

            {!isRegister && !isForgot && !isReset ? (
              <div className="flex items-center justify-between text-xs text-[#A8A8A8]">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-white/30 bg-transparent text-white/90 accent-white/90"
                  />
                  Remember me
                </label>
                <button type="button" className="transition hover:text-white" onClick={() => setMode("forgot")}>
                  Forgot Password?
                </button>
              </div>
            ) : null}

            <button
              type="submit"
              className="h-12 w-full rounded-full bg-white text-sm font-semibold tracking-wide text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
            >
              {isReset ? "UPDATE PASSWORD" : isForgot ? "SEND RESET LINK" : isRegister ? "REGISTER" : "LOGIN"}
            </button>
          </form>

          {!isForgot && !isReset ? (
            <>
              <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-[#A8A8A8]">
                <span className="h-px flex-1 bg-white/10" />
                or
                <span className="h-px flex-1 bg-white/10" />
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full rounded-full border border-white/20 bg-white/5 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/10"
                disabled={!isGoogleAvailable}
              >
                {isGoogleAvailable ? "Continue with Google" : "Google Login Not Configured"}
              </button>
            </>
          ) : null}

          {error ? <p className="mt-4 text-center text-xs text-red-200/90">{error}</p> : null}
          {message ? <p className="mt-4 text-center text-xs text-emerald-200/90">{message}</p> : null}

          <p className="mt-6 text-center text-sm text-[#A8A8A8]">
            {isReset
              ? "Want to return to login? "
              : isForgot
                ? "Remembered your password? "
                : isRegister
                  ? "Already have an account? "
                  : "Don't have an account? "}
            <button
              type="button"
              className="text-white transition hover:underline"
              onClick={() => setMode(isForgot || isReset ? "login" : isRegister ? "login" : "register")}
            >
              {isForgot || isReset ? "Login" : isRegister ? "Login" : "Register"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-black" />}>
      <LoginContent />
    </Suspense>
  );
}
