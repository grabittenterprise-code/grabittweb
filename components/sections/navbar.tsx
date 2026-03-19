"use client";

import { navItems } from "@/lib/site-data";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AccountMenu } from "@/components/ui/account-menu";
import { useAuth } from "@/components/context/auth-context";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const accountRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const isShopActive = pathname === "/shop";

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 28);
  });

  useEffect(() => {
    if (!accountOpen && !searchOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAccountOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accountOpen, searchOpen]);

  useEffect(() => {
    setAccountOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    setOpen(false);
    setSearchOpen(false);
    router.push(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
  };

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setAccountOpen((prev) => !prev);
  };

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/70 shadow-[0_22px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl" : "bg-transparent"
      }`}
    >
      <div className="section-wrap">
        <div
          className={`relative mt-4 flex items-center justify-between rounded-full border px-5 py-3 transition duration-300 sm:px-6 ${
            scrolled
              ? "border-white/18 bg-black/70 shadow-[0_22px_65px_rgba(0,0,0,0.6)]"
              : "border-white/10 bg-black/40 shadow-[0_18px_55px_rgba(0,0,0,0.48)]"
          }`}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)] opacity-60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 -bottom-px h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)]"
          />
          <Link
            href="/"
            className="flex items-center gap-3 font-serif text-lg tracking-[0.32em] text-white"
          >
            GRABITT
            <span className="hidden text-[0.6rem] font-semibold uppercase tracking-[0.45em] text-white/45 sm:inline">
              Atelier
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-[0.7rem] uppercase tracking-[0.35em] text-white/62 lg:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group relative transition hover:text-white ${isActive ? "text-white" : ""}`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span
                    className={`absolute inset-x-0 -bottom-1 h-[2px] origin-left rounded-full bg-white/80 transition duration-300 ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3 text-white/85">
            <div ref={searchRef} className="relative hidden lg:block">
              <button
                aria-label="Search"
                className="rounded-full border border-white/12 bg-white/[0.03] p-2.5 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                onClick={() => setSearchOpen((prev) => !prev)}
              >
                <Search size={16} />
              </button>
              {searchOpen ? (
                <div className="absolute right-0 top-[3.1rem] z-50 w-80 rounded-2xl border border-white/8 bg-black/70 p-3 shadow-[0_18px_55px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                  <form onSubmit={handleSearchSubmit} className="space-y-3">
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search your uploaded products"
                      className="h-11 w-full rounded-xl border border-white/12 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/25"
                    />
                    <button
                      type="submit"
                      className="luxury-button luxury-button-primary w-full py-3 text-[0.62rem] tracking-[0.32em]"
                    >
                      Search Products
                    </button>
                  </form>
                </div>
              ) : null}
            </div>
            <Link
              href="/cart"
              aria-label="Cart"
              className="hidden rounded-full border border-white/12 bg-white/[0.03] p-2.5 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white lg:inline-flex"
            >
              <ShoppingBag size={16} />
            </Link>
            <div ref={accountRef} className="relative">
              <button
                aria-label="Account"
                className="relative rounded-full border border-white/12 bg-white/[0.03] p-2.5 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                onClick={handleAccountClick}
              >
                <User size={16} />
                {isAuthenticated ? (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full border border-black/60 bg-white/80" />
                ) : null}
              </button>
              <AccountMenu open={accountOpen} onClose={() => setAccountOpen(false)} />
            </div>
            <Link
              href="/shop"
              className={`hidden luxury-button luxury-button-primary px-5 py-2 text-[0.65rem] tracking-[0.35em] lg:inline-flex ${
                isShopActive ? "shadow-[0_0_0_1px_rgba(255,255,255,0.35)]" : ""
              }`}
            >
              Shop Now
            </Link>
          </div>
          <button
            aria-label="Open menu"
            className="rounded-full border border-white/12 bg-white/[0.02] p-2.5 text-white transition hover:border-white/25 hover:bg-white/[0.08] lg:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            <Menu size={18} />
          </button>
        </div>
        {open ? (
          <div className="glass-panel mt-4 rounded-[1.5rem] p-6 lg:hidden">
            <nav className="flex flex-col gap-3 text-sm uppercase tracking-[0.26em] text-white/72">
              {navItems.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`rounded-full border px-4 py-2 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white ${
                      isActive
                        ? "border-white/25 bg-white/[0.08] text-white"
                        : "border-white/10 bg-white/[0.02]"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-5 flex items-center gap-3 text-white/85">
              <form onSubmit={handleSearchSubmit} className="flex flex-1 items-center gap-3">
                <div className="relative flex-1">
                  <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/45" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search products"
                    className="h-11 w-full rounded-full border border-white/12 bg-white/[0.03] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/25"
                  />
                </div>
                <button
                  type="submit"
                  aria-label="Search products"
                  className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2.5 text-xs uppercase tracking-[0.26em] transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                >
                  Go
                </button>
              </form>
              <Link
                href="/cart"
                aria-label="Cart"
                className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-2.5 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                onClick={() => setOpen(false)}
              >
                <ShoppingBag size={16} className="mx-auto" />
              </Link>
            </div>
            <Link
              href="/shop"
              className={`luxury-button luxury-button-primary mt-4 w-full py-3 text-[0.65rem] tracking-[0.35em] ${
                isShopActive ? "shadow-[0_0_0_1px_rgba(255,255,255,0.35)]" : ""
              }`}
              onClick={() => setOpen(false)}
            >
              Shop Now
            </Link>
          </div>
        ) : null}
      </div>
    </motion.header>
  );
}
