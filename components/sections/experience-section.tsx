import { ProductBottle } from "@/components/ui/product-bottle";
import { Reveal } from "@/components/ui/reveal";

export function ExperienceSection() {
  return (
    <section className="section-space">
      <div className="section-wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.8rem] border border-white/10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.09),transparent_18%),radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.08),transparent_22%),linear-gradient(135deg,#090909_0%,#020202_100%)] px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="relative flex justify-center">
                <div aria-hidden className="absolute h-[26rem] w-[26rem] rounded-full bg-white/10 blur-3xl" />
                <ProductBottle className="max-w-[20rem]" rotate />
              </div>
              <div className="max-w-2xl">
                <p className="section-kicker">Product Experience</p>
                <h2 className="text-4xl leading-none text-white sm:text-5xl lg:text-6xl">
                  Clean Skin. Pure Confidence.
                </h2>
                <p className="mt-6 text-base leading-8 text-white/72 sm:text-lg">
                  GRABITT transforms the first step of skincare into a cinematic ritual. The
                  formula lifts away buildup, restores comfort, and leaves skin ready for the rest
                  of your routine without a stripped finish.
                </p>
                <div className="mt-10 grid gap-4 sm:grid-cols-2">
                  {[
                    "Supports the natural skin barrier",
                    "Balances excess oil without dryness",
                    "Leaves a hydrated post-cleanse feel",
                    "Designed for all skin types"
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm uppercase tracking-[0.18em] text-white/72"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
