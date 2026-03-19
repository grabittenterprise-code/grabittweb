"use client";

import { Navbar } from "@/components/sections/navbar";
import { motion, useScroll, useTransform } from "framer-motion";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0.35]);

  return (
    <main className="page-shell">
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.09),transparent_55%)]"
        style={{ y, opacity }}
      />
      <div aria-hidden className="packaging-grid" />
      <div aria-hidden className="noise-overlay" />
      <Navbar />
      {children}
    </main>
  );
}
