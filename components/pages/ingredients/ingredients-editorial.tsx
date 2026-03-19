import { ingredients } from "@/lib/site-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { ThreeCol, TwoCol } from "@/components/ui/packaging-grid";
import { LabelBlock } from "@/components/ui/label-block";

export function IngredientsEditorial() {
  return (
    <SectionShell>
      <div className="section-wrap">
        <Reveal>
          <ThreeCol className="gap-6">
            <LabelBlock
              label="Ingredients"
              title="Focused botanical deck"
              copy="Fewer, better ingredients designed to perform daily."
            />
            <LabelBlock
              label="Direction"
              title="Massage + rinse"
              copy="Use on damp skin for 60 seconds, then rinse."
            />
            <LabelBlock
              label="Caution"
              title="For external use"
              copy="Patch test recommended for sensitive routines."
            />
          </ThreeCol>
        </Reveal>
        <div className="mt-14 space-y-12">
          {ingredients.map((ingredient, index) => {
            const Icon = ingredient.icon;
            const isReversed = index % 2 === 1;

            return (
              <Reveal key={ingredient.name}>
                <TwoCol className="items-start">
                  <div className={`${isReversed ? "lg:order-2" : ""}`}>
                    <p className="text-xs uppercase tracking-[0.38em] text-white/45">
                      0{index + 1}
                    </p>
                    <h2 className="mt-4 text-3xl text-white sm:text-4xl">{ingredient.name}</h2>
                    <p className="mt-5 max-w-lg text-base leading-7 text-white/60 sm:text-lg">
                      {ingredient.copy}
                    </p>
                  </div>
                  <div className={`${isReversed ? "lg:order-1" : ""}`}>
                    <div className="label-block relative overflow-hidden rounded-[2.4rem] p-7 sm:p-9">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.03] text-white/70">
                        <Icon size={20} />
                      </div>
                      <p className="mt-6 text-xs uppercase tracking-[0.3em] text-white/55">
                        Clinical note
                      </p>
                      <p className="mt-3 text-sm leading-6 text-white/60">
                        Balanced for barrier-safe cleansing and a calm finish.
                      </p>
                    </div>
                  </div>
                </TwoCol>
              </Reveal>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}
