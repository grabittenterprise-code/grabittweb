import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ingredients } from "@/lib/site-data";

export function IngredientSpotlight() {
  return (
    <section id="ingredients" className="section-space">
      <div className="section-wrap">
        <Reveal>
          <SectionHeading
            eyebrow="Ingredient Spotlight"
            title="Botanical Precision, Clean Performance"
            copy="Each ingredient is selected to cleanse gently, replenish hydration, and leave skin with a calm, polished finish."
            align="center"
          />
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {ingredients.map((ingredient, index) => (
            <Reveal key={ingredient.name} delay={index * 0.1}>
              <div className="glass-panel card-lift relative overflow-hidden rounded-[2rem] p-8">
                <div
                  aria-hidden
                  className="absolute -right-8 top-6 h-24 w-24 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.14),transparent_65%)] blur-2xl"
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/72">
                  <ingredient.icon size={18} />
                </div>
                <h3 className="mt-8 text-3xl text-white">{ingredient.name}</h3>
                <p className="mt-4 max-w-sm text-base leading-7 text-white/68">{ingredient.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
