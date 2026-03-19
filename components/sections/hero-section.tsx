"use client";

import { ProductBottle } from "@/components/ui/product-bottle";
import { Reveal } from "@/components/ui/reveal";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { PRODUCT_PRICING, formatInr } from "@/lib/pricing";

export function HeroSection() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -60]);

  return (
    <section className="relative overflow-hidden">
      <div className="section-wrap hero-grid">
        <motion.div
          className="order-1 flex min-h-[26rem] items-center justify-center sm:min-h-[32rem] lg:order-2 lg:min-h-[44rem]"
          style={{ y }}
        >
          <motion.div
            aria-hidden
            className="absolute h-[24rem] w-[24rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),rgba(255,255,255,0.04)_38%,transparent_68%)] blur-3xl sm:h-[30rem] sm:w-[30rem]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-x-[10%] top-[15%] h-40 rounded-full bg-white/[0.03] blur-3xl"
            animate={{ opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 7.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.08),transparent_32%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.05),transparent_20%)]"
            animate={{ opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 7.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          />
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full"
          >
            <ProductBottle className="max-w-[21rem] sm:max-w-[24rem] lg:max-w-[28rem]" rotate />
          </motion.div>
        </motion.div>
        <Reveal className="order-2 relative z-10 max-w-2xl lg:order-1">
          <p className="section-kicker">Luxury Botanical Cleanser</p>
          <h1 className="max-w-xl text-6xl leading-[0.9] text-white sm:text-7xl lg:text-[6.8rem]">
            GRABITT
          </h1>
          <p className="mt-4 max-w-lg text-xl uppercase tracking-[0.38em] text-white/58">
            Natural Inner Beauty
          </p>
          <p className="mt-8 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
            A premium face wash designed to deeply cleanse your skin while preserving natural
            hydration.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-200">
              First Sale {PRODUCT_PRICING.offerLabel}
            </span>
            <span className="text-xl text-white/95">{formatInr(PRODUCT_PRICING.salePrice)}</span>
            <span className="text-sm text-white/45 line-through">{formatInr(PRODUCT_PRICING.originalPrice)}</span>
          </div>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/shop" className="luxury-button luxury-button-primary">
              Buy Now
            </Link>
            <Link href="/story" className="luxury-button">
              Learn More
            </Link>
          </div>
          <div className="mt-16 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              ["Barrier Safe", "Maintains natural moisture balance"],
              ["Minimal Formula", "Skin-first cleansing without harsh feel"],
              ["Matte Object", "Designed to own the shelf and the ritual"]
            ].map(([title, copy]) => (
              <div key={title} className="glass-panel rounded-3xl px-5 py-4">
                <p className="text-xs uppercase tracking-[0.28em] text-white/62">{title}</p>
                <p className="mt-2 text-sm leading-6 text-white/60">{copy}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
