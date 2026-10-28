"use client";

import React, { useState, useEffect } from "react";
import { ArrowDown, ShieldCheck, Crown, Layers, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { DEFAULT_HERO_SLIDES } from "@/data/initialData";

export function Hero({ onExploreClick }: { onExploreClick: () => void }) {
  const { heroSlides } = useStore();
  const slides = heroSlides && heroSlides.length > 0 ? heroSlides : DEFAULT_HERO_SLIDES;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const active = slides[currentSlide] || slides[0];

  return (
    <section
      className="relative overflow-hidden border-b border-cream-300 bg-cream-100 pt-8 pb-14 sm:pt-12 sm:pb-16 md:pt-16 md:pb-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ============================================================== */}
      {/* 3-IMAGE BACKGROUND SLIDER WITH SMOOTH CROSS-FADE ANIMATION     */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-35 sm:opacity-30" : "opacity-0"
              }`}
            >
              {/* Background Ornament Image with gentle zoom effect */}
              <div
                className={`w-full h-full bg-cover bg-center transition-transform duration-[7000ms] ease-out ${
                  isActive ? "scale-105" : "scale-100"
                }`}
                style={{ backgroundImage: `url(${slide.imageUrl})` }}
              />
            </div>
          );
        })}

        {/* Ambient Luxury Gradients for maximum readability & aesthetic richness */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream-100/95 via-cream-50/80 to-cream-100/95 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
      </div>

      {/* Slider Manual Controls (Subtle Chevrons on Hover) */}
      <button
        onClick={handlePrev}
        aria-label="Previous ornament slide"
        className="hidden sm:flex absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-cream-100/80 hover:bg-white text-charcoal-850 hover:text-gold-700 border border-gold-400/40 shadow-md items-center justify-center transition-all opacity-70 hover:opacity-100"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next ornament slide"
        className="hidden sm:flex absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-cream-100/80 hover:bg-white text-charcoal-850 hover:text-gold-700 border border-gold-400/40 shadow-md items-center justify-center transition-all opacity-70 hover:opacity-100"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Main Foreground Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">

          {/* Top Heritage Badge: Perfectly fitted and wrapped for narrow mobile screens */}
          <div className="flex justify-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-cream-200/90 backdrop-blur-md border border-gold-400/50 text-charcoal-800 text-[10px] sm:text-xs tracking-wider uppercase shadow-sm max-w-full text-center">
              <div className="flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                <span className="font-semibold text-charcoal-900">Royal Ornaments Vault</span>
              </div>
              <span className="hidden xs:inline text-gold-400">•</span>
              <div className="flex items-center gap-1.5">
                <span className="text-charcoal-600 line-through text-[10px] sm:text-xs">₹349</span>
                <span className="text-emerald-800 font-bold bg-emerald-100/90 px-2 py-0.5 rounded text-[10px] sm:text-xs">
                  Wholesale Flat ₹99
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Slide Badge Tag */}
          <div className="flex justify-center items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-gold-700 bg-gold-400/20 px-3 py-1 rounded-full border border-gold-400/30">
              <Sparkles className="w-3 h-3 text-gold-600" />
              <span>{active.badge || "Exclusive Collection"}</span>
            </span>
          </div>

          {/* Master Serif Headline - Sized responsively to never clip or break awkwardly */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-charcoal-900 leading-[1.18] tracking-tight break-words px-2">
            Imperial Ornamentation.{" "}
            <span className="italic font-normal block sm:inline text-gold-600">
              Wholesale Flat ₹99.
            </span>
          </h1>

          {/* Dynamic Slide Subheading */}
          <p className="text-xs sm:text-base md:text-lg text-charcoal-700 max-w-2xl mx-auto font-light leading-relaxed px-2 transition-all duration-500">
            {active.subtitle ||
              "Royal Kundan haar sets, Chandbali jhumkas, and filigree bangles for ladies — paired with sovereign lion kadas, signet rings, and curb chains for gentlemen. Every piece carries an original MRP of ₹349, offered directly at an exclusive wholesale rate of ₹99."}
          </p>

          {/* CTA Buttons - Mobile-first stacked on small screens, row on sm+ */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md sm:max-w-none mx-auto px-2">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-7 py-3 sm:py-3.5 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs sm:text-sm font-semibold tracking-widest uppercase rounded shadow-classic hover:shadow-classic-hover transition-all flex items-center justify-center gap-2 group active:scale-95"
            >
              <span>Explore 25 Vault Pieces</span>
              <ArrowDown className="w-4 h-4 text-gold-400 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <a
              href="#ladies"
              onClick={onExploreClick}
              className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-cream-200 hover:bg-cream-300 text-charcoal-850 text-xs sm:text-sm font-medium tracking-wider uppercase rounded border border-cream-300 transition-colors text-center active:scale-95"
            >
              Ladies & Gents Collections
            </a>
          </div>

          {/* Slide Indicator Dots (Clickable with active gold accent) */}
          <div className="pt-2 flex items-center justify-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id || idx}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full ${
                  idx === currentSlide
                    ? "w-8 h-2.5 bg-gold-600 shadow-sm"
                    : "w-2.5 h-2.5 bg-charcoal-300 hover:bg-charcoal-500"
                }`}
              />
            ))}
          </div>

          {/* Assurance Tickers (Spacious & Clean for Mobile & Desktop) */}
          <div className="pt-6 sm:pt-8 border-t border-cream-300/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-2xl mx-auto">
            <div className="flex items-center gap-3 p-2 rounded bg-white/50 sm:bg-transparent border sm:border-0 border-cream-200">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gold-400/20 flex items-center justify-center shrink-0">
                <span className="font-serif font-bold text-xs text-gold-700">₹99</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-charcoal-900 uppercase tracking-wider truncate">
                  Wholesale Deal
                </p>
                <p className="text-[11px] text-charcoal-600 truncate">MRP ₹349 • Save ₹250 flat</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded bg-white/50 sm:bg-transparent border sm:border-0 border-cream-200">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gold-400/20 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-gold-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-charcoal-900 uppercase tracking-wider truncate">
                  5+ Views Per Item
                </p>
                <p className="text-[11px] text-charcoal-600 truncate">360° High-Res inspection</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded bg-white/50 sm:bg-transparent border sm:border-0 border-cream-200">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gold-400/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 text-gold-700" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-charcoal-900 uppercase tracking-wider truncate">
                  24K Micro-Plating
                </p>
                <p className="text-[11px] text-charcoal-600 truncate">Anti-tarnish skin-safe coat</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
