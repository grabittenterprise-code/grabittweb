import {
  Droplets,
  FlaskConical,
  Leaf,
  ShieldCheck,
  Sparkles,
  Star,
  Truck
} from "lucide-react";
import { PRODUCT_PRICING, formatInr } from "@/lib/pricing";

export const navItems = [
  { label: "Product", href: "/product" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Reviews", href: "/reviews" },
  { label: "Story", href: "/story" }
];

export const metrics = [
  { value: "25K+", label: "Customers", icon: Sparkles },
  { value: "6,000+", label: "Followers", icon: Star },
  { value: "800+", label: "Orders", icon: Truck },
  { value: "98%", label: "Satisfaction", icon: ShieldCheck }
];

export const features = [
  {
    title: "Natural Ingredients",
    copy: "Made with botanical extracts safe for daily use.",
    icon: Leaf
  },
  {
    title: "Dermatologically Tested",
    copy: "Safe for sensitive skin with a skin-barrier-first formulation.",
    icon: FlaskConical
  },
  {
    title: "Luxury Formula",
    copy: "A premium cleansing ritual with soft hydration and a clean finish.",
    icon: Droplets
  }
];

export const productBullets = [
  "Deep cleansing",
  "Hydrates skin",
  "Removes impurities",
  "All skin types"
];

export const ingredients = [
  {
    name: "Aloe Vera",
    copy: "Soothes daily irritation and supports hydration after cleansing.",
    icon: Leaf
  },
  {
    name: "Niacinamide",
    copy: "Refines the look of pores while helping strengthen the skin barrier.",
    icon: FlaskConical
  },
  {
    name: "Green Tea Extract",
    copy: "Delivers antioxidant support with a fresh, calming finish.",
    icon: Sparkles
  }
];

export const testimonials = [
  {
    name: "Mia R.",
    role: "Beauty Editor",
    review: "This face wash completely changed my skincare routine.",
    tone: "from-white/18 to-zinc-500/10"
  },
  {
    name: "Aarav P.",
    role: "Daily User",
    review: "Luxury texture, clean formula, and my skin feels balanced after every wash.",
    tone: "from-white/30 to-zinc-400/10"
  },
  {
    name: "Sara L.",
    role: "Content Creator",
    review: "It feels like a premium studio facial in a matte black bottle.",
    tone: "from-slate-200/20 to-neutral-500/10"
  }
];

export const faqs = [
  {
    question: "Is it suitable for oily skin?",
    answer:
      "Yes. The formula clears excess oil and residue without leaving the skin tight or stripped."
  },
  {
    question: "Can I use it daily?",
    answer: "Yes. GRABITT is designed as a gentle daily cleanser for morning and evening use."
  },
  {
    question: "Does it contain chemicals?",
    answer:
      "It is formulated with carefully selected cosmetic ingredients and botanical extracts, without harsh sulfates."
  }
];

export const productHighlights = [
  {
    title: "Studio-Grade Cleanse",
    copy: "A velvety gel that dissolves buildup without a squeak-clean finish."
  },
  {
    title: "Barrier-First Formula",
    copy: "Niacinamide + botanical humectants keep skin calm and resilient."
  },
  {
    title: "Matte Object Design",
    copy: "An architectural bottle that anchors the ritual and looks editorial."
  }
];

export const reviewStats = [
  { label: "Average Rating", value: "4.9", note: "Based on 2,140 verified reviews" },
  { label: "Repurchase Rate", value: "72%", note: "Return customers within 90 days" },
  { label: "Sensitive-Safe", value: "96%", note: "Reported zero irritation" }
];

export const storyTimeline = [
  {
    year: "2018",
    title: "The Studio Concept",
    copy: "A single ritual product designed like a matte sculpture."
  },
  {
    year: "2020",
    title: "Formula Lab",
    copy: "Botanical actives balanced for everyday barrier care."
  },
  {
    year: "2023",
    title: "Ritual Launch",
    copy: "Limited release with minimalist design language and tactile packaging."
  },
  {
    year: "2026",
    title: "Global Editions",
    copy: "A refined lineup of routines and seasonal refills."
  }
];

export const shopItems = [
  {
    id: "signature-face-wash",
    name: "Signature Face Wash",
    description: "Full-size ritual cleanser in matte black bottle.",
    unitPrice: PRODUCT_PRICING.salePrice,
    price: formatInr(PRODUCT_PRICING.salePrice),
    originalPrice: formatInr(PRODUCT_PRICING.originalPrice),
    offer: PRODUCT_PRICING.offerLabel,
    tag: "Core",
    category: "Cleanser",
    keywords: ["face wash", "cleanser", "ritual", "matte black"]
  },
  {
    id: "travel-ritual-set",
    name: "Travel Ritual Set",
    description: "Carry-on trio with cleanser, mist, and cloth.",
    unitPrice: PRODUCT_PRICING.salePrice,
    price: formatInr(PRODUCT_PRICING.salePrice),
    originalPrice: formatInr(PRODUCT_PRICING.originalPrice),
    offer: PRODUCT_PRICING.offerLabel,
    tag: "Set",
    category: "Sets",
    keywords: ["travel", "set", "mist", "cloth", "cleanser"]
  },
  {
    id: "refill-pouch",
    name: "Refill Pouch",
    description: "Low-waste refill with the same luxury formula.",
    unitPrice: PRODUCT_PRICING.salePrice,
    price: formatInr(PRODUCT_PRICING.salePrice),
    originalPrice: formatInr(PRODUCT_PRICING.originalPrice),
    offer: PRODUCT_PRICING.offerLabel,
    tag: "Refill",
    category: "Refills",
    keywords: ["refill", "pouch", "low-waste", "formula"]
  }
];
