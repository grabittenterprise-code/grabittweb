"use client";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqs } from "@/lib/site-data";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function FaqSection() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section className="section-space">
      <div className="section-wrap">
        <Reveal>
          <SectionHeading
            eyebrow="FAQ"
            title="Everything You Need to Know"
            copy="A concise overview for customers who care about formulation, daily use, and skin compatibility."
          />
        </Reveal>
        <div className="mt-12 space-y-4">
          {faqs.map((item, index) => {
            const isOpen = open === index;

            return (
              <Reveal key={item.question} delay={index * 0.08}>
                <div className="glass-panel overflow-hidden rounded-[1.75rem]">
                  <button
                    className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left sm:px-8"
                    onClick={() => setOpen(isOpen ? -1 : index)}
                  >
                    <span className="text-lg text-white sm:text-xl">{item.question}</span>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-white/70">
                      <ChevronDown size={20} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                      >
                        <div className="border-t border-white/10 px-6 pb-6 pt-4 sm:px-8">
                          <p className="max-w-3xl text-base leading-7 text-white/68">{item.answer}</p>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
