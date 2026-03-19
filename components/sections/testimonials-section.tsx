"use client";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/lib/site-data";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section id="reviews" className="section-space overflow-hidden">
      <div className="section-wrap">
        <Reveal>
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved by Minimalists, Backed by Results"
            copy="A premium daily cleanser that feels elevated on the shelf and reliable in the routine."
          />
        </Reveal>
        <Reveal delay={0.1} className="mt-12">
          <motion.div
            drag="x"
            dragConstraints={{ left: -320, right: 0 }}
            className="flex cursor-grab gap-6 active:cursor-grabbing"
          >
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="glass-panel min-w-[18.5rem] max-w-sm flex-1 rounded-[2rem] p-7 sm:min-w-[24rem]"
              >
                <div
                  className={`h-16 w-16 rounded-full border border-white/10 bg-gradient-to-br ${testimonial.tone}`}
                />
                <div className="mt-6 flex gap-1 text-white/82">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={15} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-6 text-lg leading-8 text-white/84">"{testimonial.review}"</p>
                <div className="mt-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white">
                    {testimonial.name}
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/45">
                    {testimonial.role}
                  </p>
                </div>
              </article>
            ))}
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
