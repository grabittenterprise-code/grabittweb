"use client";

import { shopItems } from "@/lib/site-data";
import { Reveal } from "@/components/ui/reveal";
import { SectionShell } from "@/components/ui/section-shell";
import { useSearchParams } from "next/navigation";
import { TwoCol, ThreeCol } from "@/components/ui/packaging-grid";
import { Eyebrow, Body } from "@/components/ui/type";
import { useState } from "react";

const filters = ["All", "Cleanser", "Sets", "Refills"];

export function ShopGrid() {
  const searchParams = useSearchParams();
  const [addedItemId, setAddedItemId] = useState("");
  const rawSearch = searchParams.get("search")?.trim() ?? "";
  const activeSearch = rawSearch.toLowerCase();
  const filteredItems = shopItems.filter((item) => {
    const haystack = [item.name, item.description, item.tag, item.category, ...(item.keywords ?? [])]
      .join(" ")
      .toLowerCase();

    return activeSearch ? haystack.includes(activeSearch) : true;
  });

  const handleAddToCart = (item: (typeof shopItems)[number]) => {
    try {
      const raw = localStorage.getItem("grabitt_cart");
      const parsed = raw ? (JSON.parse(raw) as Array<{ id: string; quantity: number } & Record<string, unknown>>) : [];
      const cart = Array.isArray(parsed) ? parsed : [];
      const existingItem = cart.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        existingItem.quantity = Number(existingItem.quantity ?? 0) + 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.unitPrice,
          quantity: 1,
        });
      }

      localStorage.setItem("grabitt_cart", JSON.stringify(cart));
      setAddedItemId(item.id);
      window.setTimeout(() => {
        setAddedItemId((current) => (current === item.id ? "" : current));
      }, 1600);
    } catch {
      // Ignore localStorage issues and keep UI responsive.
    }
  };

  return (
    <SectionShell>
      <div className="section-wrap">
        <Reveal>
          <TwoCol className="items-end">
            <div>
              <Eyebrow>Collection</Eyebrow>
              <h2 className="text-4xl leading-none text-white sm:text-5xl lg:text-6xl">
                The ritual lineup.
              </h2>
              <Body className="mt-4 max-w-xl">
                {activeSearch
                  ? `Showing results for "${rawSearch}" from your uploaded products.`
                  : "A restrained set of products with a unified look, feel, and ritual."}
              </Body>
            </div>
            <div className="flex flex-wrap gap-3">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  type="button"
                  className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.28em] transition ${
                    index === 0
                      ? "border-white/35 bg-white/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/30 hover:bg-white/[0.06]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </TwoCol>
        </Reveal>
        {activeSearch && filteredItems.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.02] p-8 text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-white/45">Search</p>
            <h3 className="mt-3 text-2xl text-white/90">No uploaded product matched that search.</h3>
            <p className="mt-3 text-sm text-white/60">Try another product name or browse the full collection.</p>
          </div>
        ) : null}
        <ThreeCol className="mt-12">
          {filteredItems.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.08}>
              <div className="label-block card-lift relative overflow-hidden rounded-[2.6rem] p-8">
                <div className="absolute -right-10 top-6 h-28 w-28 rounded-full bg-white/6 blur-3xl" />
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/55">
                  <span>{item.tag}</span>
                  <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-2 py-1 text-[10px] tracking-[0.2em] text-emerald-200">
                    {item.offer}
                  </span>
                </div>
                <div className="mt-8 h-44 rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))]" />
                <h3 className="mt-8 text-2xl text-white/90">{item.name}</h3>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-lg text-white/95">{item.price}</span>
                  <span className="text-sm text-white/45 line-through">{item.originalPrice}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.description}</p>
                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  className="mt-8 inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/80 transition hover:border-white/35 hover:text-white"
                >
                  {addedItemId === item.id ? "Added" : "Add to Cart"}
                </button>
              </div>
            </Reveal>
          ))}
        </ThreeCol>
      </div>
    </SectionShell>
  );
}
