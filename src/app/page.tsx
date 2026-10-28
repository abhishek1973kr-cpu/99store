"use client";

import React, { useState, useMemo, useRef } from "react";
import { useStore } from "@/context/StoreContext";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { OrderSuccessModal } from "@/components/OrderSuccessModal";
import { TrackOrderModal } from "@/components/TrackOrderModal";
import { HomeReviewsShowcase } from "@/components/HomeReviewsShowcase";
import { MobileQuickBar } from "@/components/MobileQuickBar";
import { Footer } from "@/components/Footer";
import { Sparkles, SlidersHorizontal, ShieldCheck, Crown, Layers } from "lucide-react";

const CATEGORIES = ["All Ornaments", "Ladies Ornaments", "Gents Ornaments"] as const;

export default function StorefrontPage() {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>("All Ornaments");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "rating" | "newest" | "alpha">("featured");

  const catalogRef = useRef<HTMLDivElement>(null);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "All Ornaments" || product.category === selectedCategory;
        const matchesSearch =
          !searchQuery.trim() ||
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.metal && product.metal.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === "alpha") return a.name.localeCompare(b.name);
        return 0; // featured/default
      });
  }, [products, selectedCategory, searchQuery, sortBy]);

  const ladiesCount = products.filter((p) => p.category === "Ladies Ornaments").length;
  const gentsCount = products.filter((p) => p.category === "Gents Ornaments").length;

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-charcoal-850 selection:bg-gold-400/30">
      {/* Navigation Header */}
      <Header
        onSearchChange={(q) => setSearchQuery(q)}
        selectedCategory={selectedCategory}
        onSelectCategory={(c) => setSelectedCategory(c)}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero onExploreClick={scrollToCatalog} />

        {/* Catalog Section - Airy, Spacious, Luxurious */}
        <section ref={catalogRef} id="catalog" className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-cream-300">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-600 mb-2">
                <Crown className="w-3.5 h-3.5" />
                <span>The Royal Ornaments Archive</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 tracking-tight break-words">
                Ladies & Gents Ornaments • Wholesale ₹99
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-600 mt-2 font-light">
                Displaying {filteredProducts.length} {filteredProducts.length === 1 ? "creation" : "creations"} in vault • Benchmark Retail MRP ₹349 • 5+ High-Res Views Per Item
              </p>
            </div>

            {/* Sorting control */}
            <div className="flex items-center gap-3">
              <label className="text-xs uppercase tracking-wider font-semibold text-charcoal-600 shrink-0">
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort products by"
                className="text-xs font-medium py-2.5 px-3.5 bg-white border border-cream-300 rounded text-charcoal-850 focus:border-gold-500 focus:outline-none shadow-xs"
              >
                <option value="featured">Featured Collection</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Latest Additions</option>
                <option value="alpha">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills (Ladies vs Gents vs All) */}
          <div className="py-6 sm:py-8 flex items-center gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => {
              const count = cat === "All Ornaments" ? products.length : cat === "Ladies Ornaments" ? ladiesCount : gentsCount;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-xs px-5 sm:px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all uppercase tracking-wider flex items-center gap-2 ${
                    selectedCategory === cat
                      ? "bg-charcoal-900 text-cream-100 shadow-md ring-1 ring-gold-400/40"
                      : "bg-white text-charcoal-700 hover:bg-cream-200 hover:text-charcoal-900 border border-cream-300 shadow-xs"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    selectedCategory === cat ? "bg-gold-500 text-charcoal-900" : "bg-cream-200 text-charcoal-700"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Product Grid - Airy, spacious mobile & desktop responsive layout */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 pt-2">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded border border-cream-300 p-8 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-cream-200 flex items-center justify-center text-charcoal-500">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-charcoal-850">
                No ornaments match your criteria
              </h3>
              <p className="text-xs text-charcoal-600 max-w-sm mx-auto">
                We couldn&apos;t find items matching &ldquo;{searchQuery}&rdquo;. Try clearing search filters or choosing another category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All Ornaments");
                  setSearchQuery("");
                }}
                className="px-5 py-2.5 bg-charcoal-900 text-cream-100 text-xs uppercase tracking-wider font-semibold rounded"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>

        {/* Philosophy & Provenance Banner */}
        <section id="philosophy" className="py-16 sm:py-20 bg-cream-200/60 border-t border-b border-cream-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
              <div className="space-y-3 p-6 sm:p-7 bg-white/70 backdrop-blur-sm rounded border border-cream-300">
                <div className="w-10 h-10 rounded-full bg-charcoal-900 text-gold-400 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">
                  Wholesale Direct Pricing
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light">
                  Traditional jewelry showrooms mark up jewelry prices up to 500% to offset retail rents. We sell our entire collection directly at an unbeatable flat wholesale rate of <strong>₹99</strong> (benchmark MRP ₹349).
                </p>
              </div>

              <div className="space-y-3 p-6 sm:p-7 bg-white/70 backdrop-blur-sm rounded border border-cream-300">
                <div className="w-10 h-10 rounded-full bg-charcoal-900 text-gold-400 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">
                  5+ Perspectives Per Piece
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light">
                  Every single ornament in our vault is photographed across minimum 5 high-resolution perspectives: macro stone setting, side clasp closure, styling scale, and royal packaging view.
                </p>
              </div>

              <div className="space-y-3 p-6 sm:p-7 bg-white/70 backdrop-blur-sm rounded border border-cream-300">
                <div className="w-10 h-10 rounded-full bg-charcoal-900 text-gold-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">
                  Instant Dual-Panel Sync
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed font-light">
                  Engineered with an immediate real-time shared state. When store administrators add, edit, or restock an ornament in the Admin Panel, it instantly updates on the live storefront.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Homepage Bottom Section: Interactive Customer Feedback & Reviews Showcase */}
        <HomeReviewsShowcase />
      </main>

      {/* Global Interactive Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <TrackOrderModal />

      {/* Mobile Specialization: Luxury Docked Bottom Quick Bar */}
      <MobileQuickBar />

      {/* Classic Luxury Footer with Address & Interactive Policies */}
      <Footer />
    </div>
  );
}
