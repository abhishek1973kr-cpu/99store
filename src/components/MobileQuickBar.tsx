"use client";

import React from "react";
import { useStore } from "@/context/StoreContext";
import { Crown, Star, ShoppingBag, Compass } from "lucide-react";

export function MobileQuickBar() {
  const { cartCount, setIsCartOpen, setIsTrackOrderOpen, isInitialized } = useStore();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside aria-label="Mobile Navigation" className="md:hidden fixed bottom-3 inset-x-3 z-40 animate-slideUp">
      <div className="bg-charcoal-900/95 backdrop-blur-md border border-gold-400/30 rounded-full shadow-2xl px-5 py-2 flex items-center justify-around text-cream-100">
        {/* 1. Catalog */}
        <button
          onClick={() => scrollToSection("catalog")}
          className="flex flex-col items-center gap-1 p-2 text-cream-300 hover:text-gold-400 active:scale-95 transition-all"
        >
          <Crown className="w-4 h-4 text-gold-400" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Vault</span>
        </button>

        {/* 2. Reviews */}
        <button
          onClick={() => scrollToSection("reviews-showcase")}
          className="flex flex-col items-center gap-1 p-2 text-cream-300 hover:text-gold-400 active:scale-95 transition-all"
        >
          <Star className="w-4 h-4 text-gold-400" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Reviews</span>
        </button>

        {/* 3. Shopping Bag (Center Highlight) */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 p-2 text-charcoal-900 bg-gold-400 hover:bg-gold-500 rounded-full px-5 -my-1 shadow-md active:scale-95 transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 text-charcoal-900" />
            {isInitialized && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-charcoal-900 text-gold-400 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-gold-400">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[9px] font-bold tracking-wider uppercase">Bag</span>
        </button>

        {/* 4. Track Order */}
        <button
          onClick={() => setIsTrackOrderOpen(true)}
          className="flex flex-col items-center gap-1 p-2 text-cream-300 hover:text-gold-400 active:scale-95 transition-all"
        >
          <Compass className="w-4 h-4 text-gold-400" />
          <span className="text-[10px] font-semibold tracking-wider uppercase">Track</span>
        </button>
      </div>
    </aside>
  );
}

