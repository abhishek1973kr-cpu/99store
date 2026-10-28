"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { ShoppingBag, Search, Compass, Sparkles, LayoutDashboard } from "lucide-react";

interface HeaderProps {
  onSearchChange?: (query: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export function Header({ onSearchChange }: HeaderProps) {
  const { cartCount, setIsCartOpen, setIsTrackOrderOpen, isInitialized } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchValue(val);
    if (onSearchChange) {
      onSearchChange(val);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-cream-100/95 backdrop-blur-md border-b border-cream-300">
      {/* 1. Top Scrolling Announcement Ticker (Continuous Smooth Marquee) */}
      <div className="bg-charcoal-900 text-cream-100 text-xs py-2.5 overflow-hidden border-b border-charcoal-800 shadow-xs relative select-none">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {/* Repeating sequence 1 */}
          <div className="flex items-center gap-8 px-4 font-medium tracking-wider">
            <span className="flex items-center gap-2">
              <span className="text-gold-400 font-bold">⚡ Fastly Shipped Within 12 Hours</span>
              <span className="text-cream-400">|</span>
              <span className="text-cream-200">Exclusive Ladies & Gents Ornaments at Flat <strong className="text-gold-400 font-semibold">₹99 Wholesale Price</strong></span>
            </span>
            <span className="text-gold-500/70">✦</span>
            <span className="flex items-center gap-2">
              <span className="text-gold-400 font-bold">⚡ Fastly Shipped Within 12 Hours</span>
              <span className="text-cream-400">|</span>
              <span className="text-cream-200">Exclusive Ladies & Gents Ornaments at Flat <strong className="text-gold-400 font-semibold">₹99 Wholesale Price</strong></span>
            </span>
            <span className="text-gold-500/70">✦</span>
            <span className="flex items-center gap-2">
              <span className="text-gold-400 font-bold">⚡ Fastly Shipped Within 12 Hours</span>
              <span className="text-cream-400">|</span>
              <span className="text-cream-200">Exclusive Ladies & Gents Ornaments at Flat <strong className="text-gold-400 font-semibold">₹99 Wholesale Price</strong></span>
            </span>
            <span className="text-gold-500/70">✦</span>
          </div>

          {/* Repeating sequence 2 (for seamless loop) */}
          <div className="flex items-center gap-8 px-4 font-medium tracking-wider">
            <span className="flex items-center gap-2">
              <span className="text-gold-400 font-bold">⚡ Fastly Shipped Within 12 Hours</span>
              <span className="text-cream-400">|</span>
              <span className="text-cream-200">Exclusive Ladies & Gents Ornaments at Flat <strong className="text-gold-400 font-semibold">₹99 Wholesale Price</strong></span>
            </span>
            <span className="text-gold-500/70">✦</span>
            <span className="flex items-center gap-2">
              <span className="text-gold-400 font-bold">⚡ Fastly Shipped Within 12 Hours</span>
              <span className="text-cream-400">|</span>
              <span className="text-cream-200">Exclusive Ladies & Gents Ornaments at Flat <strong className="text-gold-400 font-semibold">₹99 Wholesale Price</strong></span>
            </span>
            <span className="text-gold-500/70">✦</span>
            <span className="flex items-center gap-2">
              <span className="text-gold-400 font-bold">⚡ Fastly Shipped Within 12 Hours</span>
              <span className="text-cream-400">|</span>
              <span className="text-cream-200">Exclusive Ladies & Gents Ornaments at Flat <strong className="text-gold-400 font-semibold">₹99 Wholesale Price</strong></span>
            </span>
            <span className="text-gold-500/70">✦</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl tracking-wider text-charcoal-900 font-bold group-hover:text-gold-600 transition-colors">
                ATELIER 99
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600 font-medium -mt-1">
                Royal Ornaments Vault
              </span>
            </Link>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-600" />
              <input
                type="text"
                placeholder="Search Ladies Kundan, Gents Kada, Rings, Chains..."
                value={searchValue}
                onChange={handleSearchInput}
                className="w-full pl-10 pr-4 py-2 text-sm bg-cream-200/70 border border-cream-300 rounded-full text-charcoal-850 placeholder:text-charcoal-600 focus:outline-none focus:border-gold-500 focus:bg-white transition-all"
              />
              {searchValue && (
                <button
                  onClick={() => {
                    setSearchValue("");
                    onSearchChange?.("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-charcoal-600 hover:text-charcoal-900"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right: Actions & Navigation */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="md:hidden p-2 text-charcoal-850 hover:text-gold-600 transition-colors"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Track Order */}
            <button
              onClick={() => setIsTrackOrderOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-charcoal-700 hover:text-gold-600 px-3 py-1.5 rounded border border-cream-300 hover:border-gold-400 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-gold-600" />
              <span>Track Order</span>
            </button>

            {/* Direct Admin Panel Switch */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-charcoal-850 hover:bg-charcoal-900 text-cream-100 px-3.5 py-2 rounded border border-charcoal-700 shadow-sm transition-all group"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-gold-400 group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Admin Vault</span>
              <span className="sm:hidden">Admin</span>
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-cream-200 hover:bg-cream-300 text-charcoal-900 px-3.5 py-2 rounded-full border border-cream-300 transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 text-charcoal-850" />
              <span className="hidden sm:inline text-xs font-medium tracking-wide">Bag</span>
              {isInitialized && cartCount > 0 && (
                <span className="inline-flex items-center justify-center bg-gold-500 text-charcoal-900 text-[11px] font-bold w-5 h-5 rounded-full shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {searchOpen && (
          <div className="md:hidden pb-4 pt-1">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-600" />
              <input
                type="text"
                placeholder="Search ornaments..."
                value={searchValue}
                onChange={handleSearchInput}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-cream-200 border border-cream-300 rounded-md text-charcoal-850 focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
