"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/context/auth-context";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { SectionShell } from "@/components/ui/section-shell";
import { Eyebrow } from "@/components/ui/type";
import { formatInr, PRODUCT_PRICING } from "@/lib/pricing";

type CheckoutItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

type SavedAddress = {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

const PIN_LENGTH = 6;
const emptyAddress = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { authStatus, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CheckoutItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("manual");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState(emptyAddress);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pincodeInfo, setPincodeInfo] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState("");

  useEffect(() => {
    if (authStatus === "loading") {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login?notice=login-first&next=/checkout");
      return;
    }

    const load = async () => {
      try {
        const raw = localStorage.getItem("grabitt_cart");
        const parsed = raw ? (JSON.parse(raw) as CheckoutItem[]) : [];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      } catch {
        setItems([]);
      }

      const [settingsResponse, addressesResponse] = await Promise.all([
        fetch("/api/account/settings"),
        fetch("/api/account/addresses"),
      ]);
      const settingsData = await settingsResponse.json().catch(() => ({}));
      const addressesData = await addressesResponse.json().catch(() => ({}));

      if (settingsResponse.ok) {
        setPhone(settingsData.profile?.phone ?? "");
      }

      if (addressesResponse.ok) {
        const addresses = Array.isArray(addressesData.items) ? addressesData.items : [];
        setSavedAddresses(addresses);
        const defaultAddress = addresses.find((item: SavedAddress) => item.isDefault) ?? addresses[0];
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setPhone((current) => current || defaultAddress.phone);
          setAddress({
            fullName: defaultAddress.fullName,
            line1: defaultAddress.line1,
            line2: defaultAddress.line2 ?? "",
            city: defaultAddress.city,
            state: defaultAddress.state,
            postalCode: defaultAddress.postalCode,
            country: defaultAddress.country,
          });
        }
      }
    };

    void load();
  }, [authStatus, isAuthenticated, router]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const codCharge = PRODUCT_PRICING.codCharge;
  const total = subtotal + codCharge;

  useEffect(() => {
    const code = address.postalCode.trim();
    if (code.length !== PIN_LENGTH) {
      setPincodeInfo("");
      return;
    }

    const controller = new AbortController();
    const lookup = async () => {
      const response = await fetch(`/api/location/pincode/${code}`, { signal: controller.signal });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setPincodeInfo(data.error ?? "PIN lookup failed.");
        return;
      }

      setAddress((prev) => ({
        ...prev,
        city: data.city ?? prev.city,
        state: data.state ?? prev.state,
        country: data.country ?? prev.country,
      }));
      setPincodeInfo(`Auto-filled: ${data.city}, ${data.state}`);
    };

    void lookup();
    return () => controller.abort();
  }, [address.postalCode]);

  const applySavedAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === "manual") {
      setAddress(emptyAddress);
      return;
    }

    const selected = savedAddresses.find((item) => item.id === addressId);
    if (!selected) {
      return;
    }

    setPhone(selected.phone);
    setAddress({
      fullName: selected.fullName,
      line1: selected.line1,
      line2: selected.line2 ?? "",
      city: selected.city,
      state: selected.state,
      postalCode: selected.postalCode,
      country: selected.country,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.price,
          })),
          phone,
          address,
        }),
      });
      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        router.push("/login?notice=login-first&next=/checkout");
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Checkout failed.");
        return;
      }

      localStorage.removeItem("grabitt_cart");
      setPlacedOrderId(String(data.orderId ?? ""));
      setMessage("Checkout processed successfully. COD order placed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageWrapper>
      <SectionShell className="pt-32 sm:pt-36 lg:pt-40">
        <div className="section-wrap">
          <Eyebrow>Checkout</Eyebrow>
          <h1 className="text-4xl text-white/95 sm:text-5xl lg:text-6xl">Cash on Delivery</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/60">
            Select a saved address or enter a new one to complete checkout.
          </p>
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <div className="section-wrap grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form onSubmit={handleSubmit} className="label-block space-y-4 rounded-2xl p-6">
            <h2 className="text-xl text-white/90">Shipping Details</h2>
            <div className="space-y-2">
              <label className="text-sm text-white/70">Use saved address</label>
              <select
                value={selectedAddressId}
                onChange={(event) => applySavedAddress(event.target.value)}
                className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              >
                <option value="manual">Manual entry</option>
                {savedAddresses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label} - {item.line1}, {item.city}
                  </option>
                ))}
              </select>
            </div>
            <input
              value={address.fullName}
              onChange={(e) => setAddress((prev) => ({ ...prev, fullName: e.target.value }))}
              placeholder="Full Name"
              className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
            />
            <input
              value={address.line1}
              onChange={(e) => setAddress((prev) => ({ ...prev, line1: e.target.value }))}
              placeholder="Address Line 1"
              className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
            />
            <input
              value={address.line2}
              onChange={(e) => setAddress((prev) => ({ ...prev, line2: e.target.value }))}
              placeholder="Address Line 2 (Optional)"
              className="h-11 w-full rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
            />
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                value={address.postalCode}
                onChange={(e) => setAddress((prev) => ({ ...prev, postalCode: e.target.value }))}
                placeholder="PIN Code"
                className="h-11 rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              />
              <input
                value={address.city}
                onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="City"
                className="h-11 rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              />
              <input
                value={address.state}
                onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
                placeholder="State"
                className="h-11 rounded-xl border border-white/15 bg-black/30 px-3 text-sm text-white"
              />
            </div>
            {pincodeInfo ? <p className="text-xs text-white/65">{pincodeInfo}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 h-12 w-full rounded-full bg-white text-xs font-semibold uppercase tracking-[0.24em] text-black disabled:opacity-60"
            >
              {submitting ? "Processing..." : "Place COD Order"}
            </button>
            {error ? <p className="text-sm text-red-200">{error}</p> : null}
            {message ? <p className="text-sm text-emerald-200">{message}</p> : null}
            {placedOrderId ? (
              <a
                href={`/api/orders/${placedOrderId}/invoice`}
                className="inline-flex rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/80 transition hover:bg-white/10"
              >
                Download Invoice
              </a>
            ) : null}
          </form>

          <div className="label-block rounded-2xl p-6">
            <h2 className="text-xl text-white/90">Order Summary</h2>
            <div className="mt-4 space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm text-white/75">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>{formatInr(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-sm">
              <div className="flex items-center justify-between text-white/70">
                <span>Subtotal</span>
                <span>{formatInr(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-white/70">
                <span>COD Charges</span>
                <span>{formatInr(codCharge)}</span>
              </div>
              <div className="flex items-center justify-between text-base text-white/95">
                <span>Total Payable (COD)</span>
                <span>{formatInr(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>
    </PageWrapper>
  );
}
