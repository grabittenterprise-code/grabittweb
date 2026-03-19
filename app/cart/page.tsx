"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/context/auth-context";
import { LabelBlock } from "@/components/ui/label-block";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/type";
import { PRODUCT_PRICING } from "@/lib/pricing";

type CartItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

function CartItemRow({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: CartItem;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="label-block flex flex-col gap-6 rounded-[2.2rem] p-6 sm:p-7 lg:flex-row lg:items-center"
    >
      <div className="h-28 w-24 flex-shrink-0 rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))]" />
      <div className="flex-1">
        <p className="text-xs uppercase tracking-[0.32em] text-white/50">Cart Item</p>
        <h3 className="mt-3 text-xl text-white/90">{item.name}</h3>
        <p className="mt-3 text-sm text-white/60">{item.description}</p>
        <div className="mt-5 flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-white/65">
          <span className="rounded-full border border-emerald-300/35 bg-emerald-300/10 px-2 py-1 text-[10px] tracking-[0.2em] text-emerald-200">
            {PRODUCT_PRICING.offerLabel}
          </span>
          <span>₹{item.price}</span>
          <span className="text-white/45 line-through">₹{PRODUCT_PRICING.originalPrice}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-6 sm:justify-start">
        <div className="flex items-center gap-3 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1.5">
          <button
            type="button"
            onClick={onDecrease}
            className="h-7 w-7 rounded-full border border-white/10 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            -
          </button>
          <span className="min-w-[1.5rem] text-center text-sm text-white/80">{item.quantity}</span>
          <button
            type="button"
            onClick={onIncrease}
            className="h-7 w-7 rounded-full border border-white/10 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
          >
            +
          </button>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-xs uppercase tracking-[0.3em] text-white/45 transition hover:text-white/75"
        >
          Remove
        </button>
      </div>
    </motion.div>
  );
}

function SummaryPanel({ subtotal, onCheckout }: { subtotal: number; onCheckout: () => void }) {
  return (
    <div className="label-block sticky top-28 rounded-[2.4rem] p-6 sm:p-7">
      <p className="text-xs uppercase tracking-[0.36em] text-white/55">Order Summary</p>
      <div className="mt-6 space-y-3 text-sm text-white/70">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="text-white/90">₹{subtotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="flex items-center justify-between">
          <span>GST</span>
          <span>Included</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onCheckout}
        className="luxury-button luxury-button-primary mt-8 w-full py-4 text-[0.65rem] tracking-[0.35em]"
      >
        Proceed to Checkout
      </button>
      <div className="mt-6 text-xs uppercase tracking-[0.32em] text-white/45">Secure checkout · Encrypted</div>
      <div className="mt-4 flex gap-3 text-[0.6rem] uppercase tracking-[0.32em] text-white/40">
        <span>Visa</span>
        <span>Mastercard</span>
        <span>UPI</span>
      </div>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();
  const { authStatus, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("grabitt_cart");
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as CartItem[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setItems(parsed);
      }
    } catch {
      // Ignore malformed local cart
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("grabitt_cart", JSON.stringify(items));
  }, [items]);

  const handleCheckout = () => {
    if (authStatus === "loading") {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login?notice=login-first&next=/checkout");
      return;
    }

    router.push("/checkout");
  };

  return (
    <PageWrapper>
      <SectionShell className="pt-32 sm:pt-36 lg:pt-40">
        <div className="section-wrap">
          <Eyebrow>Cart</Eyebrow>
          <h1 className="text-4xl text-white/95 sm:text-5xl lg:text-6xl">Your Ritual Bag</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
            Review your selections, fine-tune quantities, and proceed with a calm, secure checkout.
          </p>
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <div className="section-wrap grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div className="space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onDecrease={() => updateQuantity(item.id, -1)}
                  onIncrease={() => updateQuantity(item.id, 1)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </AnimatePresence>
            {items.length === 0 ? (
              <LabelBlock
                label="Cart"
                title="Your bag is empty"
                copy="Browse the collection and curate a ritual."
                className="rounded-[2.2rem] p-7"
              />
            ) : null}
          </div>
          <SummaryPanel subtotal={subtotal} onCheckout={handleCheckout} />
        </div>
      </SectionShell>
    </PageWrapper>
  );
}
