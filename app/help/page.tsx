"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CreditCard,
  HelpCircle,
  Leaf,
  Package,
  RefreshCw,
  Search
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/sections/navbar";

const suggestions = [
  "Order tracking",
  "Ingredients",
  "Returns",
  "Skin care ritual",
  "Account",
  "Shipping"
];

const categories = [
  {
    title: "Orders & Shipping",
    copy: "Track shipments, delivery windows, and order updates.",
    icon: Package
  },
  {
    title: "Returns & Refunds",
    copy: "Calm, easy returns with concierge guidance.",
    icon: RefreshCw
  },
  {
    title: "Product Guidance",
    copy: "Ingredient notes, usage tips, and layering advice.",
    icon: Leaf
  },
  {
    title: "Skin Care Rituals",
    copy: "Build a ritual that feels minimal and effective.",
    icon: BookOpen
  },
  {
    title: "Account & Billing",
    copy: "Payment methods, invoices, and account settings.",
    icon: CreditCard
  },
  {
    title: "Contact Support",
    copy: "Reach a real person for personal care.",
    icon: HelpCircle
  }
];

const faqs = [
  {
    question: "What are the shipping timelines?",
    answer:
      "Orders typically arrive within 3–6 business days, depending on your location and carrier availability."
  },
  {
    question: "Is the formula suitable for sensitive skin?",
    answer:
      "GRABITT is designed to be barrier-safe and gentle. We recommend a patch test for extra-sensitive routines."
  },
  {
    question: "How do I track my order?",
    answer:
      "After dispatch, you will receive a tracking link by email with real-time updates."
  },
  {
    question: "How should I use the cleanser?",
    answer:
      "Massage onto damp skin for 60 seconds, then rinse with cool water to seal hydration."
  }
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredSuggestions = useMemo(() => {
    if (!query) return suggestions;
    return suggestions.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_18%_14%,rgba(120,200,185,0.12),transparent_26%),radial-gradient(circle_at_82%_18%,rgba(200,182,160,0.08),transparent_24%),radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04),transparent_30%),linear-gradient(180deg,#0b0b0b_0%,#0d0d0d_34%,#0b0b0b_100%)] text-[#EDEDED]">
      <Navbar />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(110,200,185,0.16),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(160,140,120,0.1),transparent_50%)]"
        animate={{ opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-0 vignette opacity-70" />
      <div className="grain-overlay" />

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <p className="text-xs uppercase tracking-[0.45em] text-white/45">Help Center</p>
          <h1 className="mt-6 font-serif text-4xl text-white/95 sm:text-5xl">
            How can we support your ritual?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
            Guidance, answers, and support — crafted with the same care as our formulations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
          className="mt-12"
        >
          <div className="relative mx-auto max-w-3xl">
            <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for orders, ingredients, or support..."
              className="h-14 w-full rounded-full border border-white/10 bg-white/[0.04] pl-12 pr-5 text-sm text-white/80 shadow-[inset_0_1px_6px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition focus:border-emerald-200/30 focus:outline-none focus:ring-2 focus:ring-emerald-200/10"
            />
          </div>
          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs uppercase tracking-[0.28em] text-white/50">
            {filteredSuggestions.length > 0 ? (
              filteredSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuery(item)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 transition hover:border-white/25 hover:bg-white/[0.06]"
                >
                  {item}
                </button>
              ))
            ) : (
              <span className="text-white/45">No results found. Try a different search.</span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
          className="mt-16 grid gap-6 lg:grid-cols-3"
        >
          {categories.map((item, index) => {
            const Icon = item.icon;
            const span = index === 0 ? "lg:col-span-2" : "";
            return (
              <div
                key={item.title}
                className={`rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] ${span}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.04] text-white/70">
                  <Icon size={18} />
                </div>
                <h3 className="mt-6 text-xl text-white/90">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{item.copy}</p>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          className="mt-16 rounded-[2.4rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl"
        >
          <h2 className="font-serif text-2xl text-white/90">FAQs</h2>
          <div className="mt-6 divide-y divide-white/10">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <button
                  key={item.question}
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full py-5 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase tracking-[0.28em] text-white/70">
                      {item.question}
                    </span>
                    <span className="text-white/50">{isOpen ? "–" : "+"}</span>
                  </div>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm leading-6 text-white/60">
                          {item.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
          className="mt-16 flex flex-col items-start gap-4 rounded-[2.2rem] border border-white/10 bg-white/[0.04] p-8"
        >
          <h3 className="font-serif text-2xl text-white/90">Still need assistance?</h3>
          <p className="text-sm leading-6 text-white/60">
            Our team is here to support you personally.
          </p>
          <Link
            href="/contact"
            className="luxury-button luxury-button-primary mt-2 text-[0.65rem]"
          >
            Contact Us
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
