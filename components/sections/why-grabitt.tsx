import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { features } from "@/lib/site-data";

export function WhyGrabitt() {
  return (
    <section id="story" className="section-space">
      <div className="section-wrap">
        <Reveal>
          <SectionHeading
            eyebrow="Why GRABITT"
            title="Why Choose GRABITT?"
            copy="A refined cleansing ritual engineered to look editorial, feel luxurious, and support healthy skin with every use."
          />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Reveal key={feature.title} delay={index * 0.08}>
                <div className="glass-panel card-lift group h-full rounded-[2rem] p-7">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/75 transition group-hover:border-white/20">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-8 text-3xl text-white">{feature.title}</h3>
                  <p className="mt-4 max-w-sm text-base leading-7 text-white/68">{feature.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
