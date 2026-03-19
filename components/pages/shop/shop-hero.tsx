import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { TwoCol } from "@/components/ui/packaging-grid";
import { Body, Display, Eyebrow } from "@/components/ui/type";

export function ShopHero() {
  return (
    <SectionShell className="pt-32 sm:pt-36 lg:pt-40">
      <div className="section-wrap relative">
        <div className="pointer-events-none absolute right-0 top-2 text-[0.6rem] uppercase tracking-[0.7em] text-white/20">
          <span className="vertical-type block">SHOP</span>
        </div>
        <TwoCol className="items-end">
          <Reveal>
            <Eyebrow>Shop</Eyebrow>
            <Display>
              Minimal products.
              <span className="block text-white/55">Maximum ritual.</span>
            </Display>
          </Reveal>
          <Reveal>
            <Body>
              A focused collection built for clarity. Every item is made to layer cleanly into a
              modern routine.
            </Body>
            <div className="mt-8 flex flex-wrap gap-3">
              {["First Sale 66% OFF", "Price Drop: ₹299 → ₹200", "Limited releases"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/65"
                >
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </TwoCol>
      </div>
    </SectionShell>
  );
}
