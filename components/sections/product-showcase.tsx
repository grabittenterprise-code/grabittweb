import { ProductBottle } from "@/components/ui/product-bottle";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { productBullets } from "@/lib/site-data";
import { PRODUCT_PRICING, formatInr } from "@/lib/pricing";
import { Check } from "lucide-react";
import Link from "next/link";

export function ProductShowcase() {
  return (
    <section id="product" className="section-space">
      <div className="section-wrap">
        <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="order-2 lg:order-1">
            <div className="glass-panel rounded-[2.4rem] p-8 sm:p-10">
              <SectionHeading
                eyebrow="Signature Product"
                title="Our Signature Face Wash"
                copy="A deep-cleansing, hydration-preserving formula in a sculptural matte black bottle designed to anchor the entire routine."
              />
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {productBullets.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80">
                      <Check size={16} />
                    </span>
                    <span className="text-sm uppercase tracking-[0.18em] text-white/75">{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-3">
                <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-200">
                  {PRODUCT_PRICING.offerLabel}
                </span>
                <span className="text-xl text-white/95">{formatInr(PRODUCT_PRICING.salePrice)}</span>
                <span className="text-sm text-white/45 line-through">{formatInr(PRODUCT_PRICING.originalPrice)}</span>
              </div>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/shop" className="luxury-button luxury-button-primary">
                  Buy Now
                </Link>
                <Link href="/ingredients" className="luxury-button">
                  View Ingredients
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[2.8rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-6 shadow-panel">
              <div aria-hidden className="light-ring left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div aria-hidden className="absolute inset-x-[15%] bottom-10 h-20 rounded-full bg-white/[0.05] blur-3xl" />
              <ProductBottle className="max-w-[24rem] sm:max-w-[28rem]" rotate />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
