"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Twitter
} from "lucide-react";
import { Navbar } from "@/components/sections/navbar";

const contactRows = [
  { label: "Phone", value: "+91 90000 00000", icon: Phone },
  { label: "Email", value: "support@grabitt.com", icon: Mail },
  { label: "Instagram", value: "@grabittatelier", icon: Instagram },
  { label: "Facebook", value: "GRABITT Atelier", icon: Facebook },
  { label: "LinkedIn", value: "GRABITT Atelier", icon: Linkedin },
  { label: "Twitter", value: "@grabittatelier", icon: Twitter }
];

export default function ContactPage() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const glowStyle = useMemo(
    () => ({
      transform: `translate(${cursor.x * 0.02}px, ${cursor.y * 0.02}px)`
    }),
    [cursor]
  );

  const handleChange =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError("");

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setSubmitError("Please fill name, email and message.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSubmitError(data.error ?? "Unable to send message. Please try again.");
        return;
      }

      setForm({ name: "", email: "", phone: "", message: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2400);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_14%,rgba(120,200,185,0.12),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(200,182,160,0.08),transparent_24%),radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),transparent_30%),linear-gradient(180deg,#0b0b0b_0%,#0d0d0d_34%,#0b0b0b_100%)] text-[#EDEDED]"
      onMouseMove={(event) => setCursor({ x: event.clientX, y: event.clientY })}
    >
      <Navbar />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,200,185,0.16),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(160,140,120,0.1),transparent_50%)]" />
      <div
        className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(120,200,190,0.28),transparent_65%)] blur-3xl"
        style={glowStyle}
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-12 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(80,140,170,0.26),transparent_68%)] blur-3xl"
        style={glowStyle}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-soft-light vignette">
        <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:120px_120px]" />
      </div>
      <div className="grain-overlay" />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-28">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center font-sans text-3xl font-medium text-[#EDEDED] sm:text-4xl"
        >
          Let's get in touch.
        </motion.h1>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
            className="relative"
          >
            <div className="absolute -inset-px rounded-[2.2rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02),rgba(120,200,185,0.08))] opacity-35 blur-lg" />
            <div className="relative overflow-hidden rounded-[2.1rem] border border-white/8 bg-white/[0.04] p-7 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute -right-12 top-10 h-28 w-28 rounded-full bg-white/8 blur-2xl" />
                <div className="absolute -left-10 bottom-10 h-20 w-20 rounded-full bg-white/8 blur-2xl" />
              </div>
              <h2 className="text-lg font-semibold text-[#EDEDED]">
                Contact Information
              </h2>
              <div className="mt-6 space-y-3">
                {contactRows.map((row) => {
                  const Icon = row.icon;
                  return (
                    <div
                      key={row.label}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/60 transition hover:border-white/25 hover:bg-white/[0.06]"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.05] text-white/60">
                        <Icon size={16} />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                          {row.label}
                        </p>
                        <p className="mt-1 text-sm text-white/85">{row.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-px rounded-[2.4rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02),rgba(120,200,185,0.06))] opacity-45 blur-lg" />
            <div className="relative overflow-hidden rounded-[2.3rem] border border-white/8 bg-white/[0.04] p-8 backdrop-blur-2xl shadow-[0_24px_60px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.05)]">
              <div className="pointer-events-none absolute inset-0 opacity-20">
                <div className="absolute -right-16 top-8 h-32 w-32 rounded-full bg-white/8 blur-2xl" />
                <div className="absolute -left-10 bottom-12 h-24 w-24 rounded-full bg-white/8 blur-2xl" />
              </div>
              <form onSubmit={handleSubmit} className="relative space-y-5">
                <div>
                  <label className="text-xs uppercase tracking-[0.28em] text-white/45">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="John"
                    className="mt-3 h-12 w-full rounded-2xl border border-white/10 bg-black/60 px-4 text-sm text-white/85 shadow-[inset_0_1px_6px_rgba(0,0,0,0.55)] transition focus:border-emerald-200/40 focus:outline-none focus:ring-2 focus:ring-emerald-200/10"
                  />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-[0.28em] text-white/45">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="you@email.com"
                      className="mt-3 h-12 w-full rounded-2xl border border-white/10 bg-black/60 px-4 text-sm text-white/85 shadow-[inset_0_1px_6px_rgba(0,0,0,0.55)] transition focus:border-emerald-200/40 focus:outline-none focus:ring-2 focus:ring-emerald-200/10"
                    />
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.28em] text-white/45">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      placeholder="(000) 000-0000"
                      className="mt-3 h-12 w-full rounded-2xl border border-white/10 bg-black/60 px-4 text-sm text-white/85 shadow-[inset_0_1px_6px_rgba(0,0,0,0.55)] transition focus:border-emerald-200/40 focus:outline-none focus:ring-2 focus:ring-emerald-200/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.28em] text-white/45">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={handleChange("message")}
                    placeholder="How can we help you?"
                    className="mt-3 w-full rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm text-white/85 shadow-[inset_0_1px_6px_rgba(0,0,0,0.55)] transition focus:border-emerald-200/40 focus:outline-none focus:ring-2 focus:ring-emerald-200/10"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[linear-gradient(180deg,rgba(244,239,232,0.96),rgba(214,208,200,0.9))] px-8 py-3 text-xs uppercase tracking-[0.32em] text-black transition hover:translate-y-[-2px] hover:shadow-[0_18px_50px_rgba(255,255,255,0.12)] active:translate-y-0"
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
                {submitError ? <p className="text-xs text-red-200/90">{submitError}</p> : null}
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-8 right-8 rounded-full border border-white/15 bg-black/70 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/70 backdrop-blur-xl"
          >
            Message sent successfully
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}


