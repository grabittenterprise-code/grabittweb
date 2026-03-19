"use client";

import { Reveal } from "@/components/ui/reveal";

export function NewsletterSection() {
  return (
    <section id="newsletter" className="section-space">
      <div className="section-wrap">
        <Reveal>
          <div className="glass-panel rounded-[2.6rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="section-kicker">Newsletter</p>
                <h2 className="text-4xl leading-none text-white sm:text-5xl lg:text-6xl">
                  Join the GRABITT Community
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-white/68 sm:text-lg">
                  Receive early access to product drops, skincare notes, and limited-edition
                  launches curated for a minimal luxury routine.
                </p>
              </div>
              <form className="flex flex-col gap-4 sm:flex-row" onSubmit={(event) => event.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="h-14 flex-1 rounded-full border border-white/10 bg-white/[0.03] px-6 text-white placeholder:text-white/35 focus:border-white/20 focus:bg-white/[0.05] focus:outline-none"
                />
                <button type="submit" className="luxury-button luxury-button-primary h-14 px-8">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
