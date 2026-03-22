import { Instagram, Twitter, Youtube } from "lucide-react";
import { BrandLogo } from "@/components/ui/brand-logo";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-white/10 py-12">
      <div className="section-wrap">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_repeat(4,0.8fr)]">
          <div>
            <BrandLogo className="max-w-[12rem]" imageClassName="object-contain" />
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/55">
              Scientific skincare in a matte black object designed to elevate the everyday cleanse.
            </p>
          </div>
          {[
            { title: "About", links: ["Brand Story", "Journal", "Store Locator"] },
            { title: "Products", links: ["Face Wash", "Routine Sets", "Gift Editions"] },
            { title: "Support", links: ["FAQ", "Shipping", "Returns"] },
            { title: "Social", links: ["Instagram", "Twitter", "YouTube"] }
          ].map((column) => (
            <div key={column.title}>
              <p className="text-sm uppercase tracking-[0.26em] text-white">{column.title}</p>
              <div className="mt-4 space-y-3 text-sm text-white/55">
                {column.links.map((link) => (
                  <a key={link} href="#" className="block transition hover:text-white">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 pt-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 GRABITT. Natural Inner Beauty.</p>
          <div className="flex items-center gap-3 text-white/75">
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full border border-white/10 bg-white/[0.02] p-2 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              <Instagram size={16} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="rounded-full border border-white/10 bg-white/[0.02] p-2 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              <Twitter size={16} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="rounded-full border border-white/10 bg-white/[0.02] p-2 transition hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
            >
              <Youtube size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
