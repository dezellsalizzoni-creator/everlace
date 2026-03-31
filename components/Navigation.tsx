"use client";

import Link from "next/link";
import { Search, UserRound, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";

const links = ["Companions", "Technology", "Craftsmanship", "Support"];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { itemCount, openCart } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 z-50 w-full transition ${scrolled ? "glass-nav border-b border-black/5" : ""}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-charcoal">
        <Link href="/" className="text-sm tracking-brand">
          EVERLACE
        </Link>
        <div className="hidden gap-8 text-sm md:flex">
          {links.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-burnishedGold">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Search size={18} />
          <UserRound size={18} />
          <Link href="/track-order" className="text-xs text-charcoal/80 transition hover:text-burnishedGold">
            Track Order
          </Link>
          <button className="relative" onClick={openCart} aria-label="Open cart">
            <ShoppingBag size={18} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-burnishedGold px-1 text-[10px] font-semibold text-charcoal">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
