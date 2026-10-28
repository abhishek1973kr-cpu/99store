"use client";

import React from "react";
import { ArrowDown, ShieldCheck, Sparkles, Feather, Crown, Layers } from "lucide-react";

export function Hero({ onExploreClick }: { onExploreClick: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-cream-300 bg-cream-50 pt-12 pb-16 md:pt-16 md:pb-24">
      {/* Decorative background grid and ambient royal gold glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Subtle Heritage Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream-200 border border-gold-400/40 text-charcoal-800 text-xs tracking-wider uppercase shadow-sm">
            <Crown className="w-3.5 h-3.5 text-gold-600" />
            <span>Royal Vault • Ladies & Gents Ornaments</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
            <span className="text-emerald-800 font-bold">MRP ₹349 → Wholesale ₹99</span>
          </div>

          {/* Master Serif Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-charcoal-900 leading-[1.15] tracking-tight">
            Imperial Ornamentation.{" "}
            <span className="italic font-normal block sm:inline text-gold-600">
              Wholesale Flat ₹99.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-charcoal-700 max-w-2xl mx-auto font-light leading-relaxed">
            Royal Kundan haar sets, Chandbali jhumkas, and filigree bangles for ladies — paired with sovereign lion kadas, signet rings, and curb chains for gentlemen.
            Every piece carries an original MRP of ₹349, offered directly at an exclusive wholesale rate of ₹99 with minimum 5 high-resolution perspectives.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs sm:text-sm font-semibold tracking-widest uppercase rounded shadow-classic hover:shadow-classic-hover transition-all flex items-center justify-center gap-2 group"
            >
              <span>Explore 25 Vault Pieces</span>
              <ArrowDown className="w-4 h-4 text-gold-400 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <a
              href="#ladies"
              onClick={onExploreClick}
              className="w-full sm:w-auto px-7 py-3.5 bg-cream-200 hover:bg-cream-300 text-charcoal-850 text-xs sm:text-sm font-medium tracking-wider uppercase rounded border border-cream-300 transition-colors text-center"
            >
              Ladies & Gents Collections
            </a>
          </div>

          {/* Assurance Tickers */}
          <div className="pt-8 border-t border-cream-300/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-400/20 flex items-center justify-center shrink-0">
                <span className="font-serif font-bold text-xs text-gold-700">₹99</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal-900 uppercase tracking-wider">Wholesale Deal</p>
                <p className="text-[11px] text-charcoal-600">MRP ₹349 • Save ₹250 flat</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gold-400/20 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-gold-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal-900 uppercase tracking-wider">5+ Views Per Item</p>
                <p className="text-[11px] text-charcoal-600">360° High-Res inspection</p>
              </div>
            </div>

            <div className="flex items-center gap-3 col-span-2 sm:col-span-1 justify-center sm:justify-start">
              <div className="w-9 h-9 rounded-full bg-gold-400/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-gold-700" />
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal-900 uppercase tracking-wider">24K Micro-Plating</p>
                <p className="text-[11px] text-charcoal-600">Anti-tarnish skin-safe coat</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
