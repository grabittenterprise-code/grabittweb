import Link from "next/link";
import { ProductBottle } from "@/components/ui/product-bottle";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { Asymmetric } from "@/components/ui/packaging-grid";
import { Body, Display, Eyebrow } from "@/components/ui/type";
import { LabelBlock } from "@/components/ui/label-block";
import { PRODUCT_PRICING, formatInr } from "@/lib/pricing";

export function ProductHero() {
  return (
    <SectionShell className="pt-32 sm:pt-36 lg:pt-40">
      <div className="section-wrap relative">
        <div className="pointer-events-none absolute -left-6 top-0 text-[0.65rem] uppercase tracking-[0.7em] text-white/25">
          <span className="vertical-type block">FACE WASH</span>
        </div>
        <Asymmetric className="items-center">
          <Reveal>
            <Eyebrow>Signature Product</Eyebrow>
            <Display>
              Sculpted cleanse
              <span className="block text-white/55">for daily ritual.</span>
            </Display>
            <Body className="mt-6 max-w-xl">
              A minimal formula housed in an editorial object. Designed to cleanse without
              stripping and sit on the counter like a product label brought to life.
            </Body>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-emerald-200">
                First Sale {PRODUCT_PRICING.offerLabel}
              </span>
              <span className="text-xl text-white/95">{formatInr(PRODUCT_PRICING.salePrice)}</span>
              <span className="text-sm text-white/45 line-through">{formatInr(PRODUCT_PRICING.originalPrice)}</span>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <LabelBlock label="Texture" title="Velvet Gel" copy="Dense slip, clean finish." />
              <LabelBlock label="Skin Feel" title="Soft Matte" copy="Calm, hydrated, balanced." />
            </div>
            <div className="mt-12 flex flex-col gap-4 sm:flex-row">
              <Link href="/shop" className="luxury-button luxury-button-primary">
                Shop Now
              </Link>
              <Link href="/ingredients" className="luxury-button">
                Ingredient Panel
              </Link>
            </div>
          </Reveal>
          <Reveal className="relative">
            <div className="absolute -left-6 top-10 h-40 w-40 rounded-full bg-white/6 blur-3xl" />
            <div className="label-block relative overflow-hidden rounded-[2.8rem] p-10">
              <ProductBottle className="max-w-[20rem] sm:max-w-[24rem]" rotate />
            </div>
            <div className="absolute -bottom-6 right-8 max-w-[12rem] rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.32em] text-white/60">
              Clinical + Luxury
            </div>
          </Reveal>
        </Asymmetric>
      </div>
    </SectionShell>
  );
}
