import { testimonials } from "@/lib/site-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { Star } from "lucide-react";
import { TwoCol } from "@/components/ui/packaging-grid";
import { Eyebrow, Body } from "@/components/ui/type";

export function ReviewsWall() {
  return (
    <SectionShell>
      <div className="section-wrap">
        <Reveal>
          <TwoCol className="items-end">
            <div>
              <Eyebrow>Testimonial Wall</Eyebrow>
              <h2 className="text-4xl leading-none text-white sm:text-5xl lg:text-6xl">
                The ritual, in their words.
              </h2>
            </div>
            <Body>
              Editorial voices and daily users agree: the cleanse feels as premium as it looks.
            </Body>
          </TwoCol>
        </Reveal>
        <div className="mt-12 grid auto-rows-[7.5rem] gap-6 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => {
            const span =
              index === 0 ? "row-span-3" : index === 1 ? "row-span-2" : index === 2 ? "row-span-3" : "row-span-2";

            return (
              <Reveal key={testimonial.name} delay={index * 0.08}>
                <article
                  className={`label-block card-lift relative overflow-hidden rounded-[2.4rem] p-7 ${span}`}
                >
                  <div className="absolute inset-x-6 top-6 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)]" />
                  <div
                    className={`h-12 w-12 rounded-full border border-white/10 bg-gradient-to-br ${testimonial.tone}`}
                  />
                  <div className="mt-5 flex gap-1 text-white/80">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} size={13} fill="currentColor" />
                    ))}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-white/75">"{testimonial.review}"</p>
                  <p className="mt-6 text-xs uppercase tracking-[0.28em] text-white/70">
                    {testimonial.name}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/45">
                    {testimonial.role}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
