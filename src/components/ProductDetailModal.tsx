"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { CustomerReviews } from "@/components/CustomerReviews";
import { X, Star, ShoppingBag, Zap, ShieldCheck, Truck, CheckCircle2, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ProductDetailModal() {
  const { activeProductModal, setActiveProductModal, addToCart, buyNow } = useStore();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (activeProductModal) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setAddedNotice(false);
    }
  }, [activeProductModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveProductModal(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setActiveProductModal]);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[selectedImageIndex] || product.image;

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAdd = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleInstantBuy = () => {
    buyNow(product);
  };

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-cream-100 w-full max-w-4xl rounded-sm border border-cream-300 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Top Modal Bar */}
        <div className="p-4 px-6 bg-charcoal-900 text-cream-100 flex items-center justify-between border-b border-charcoal-800 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span className="font-serif text-sm font-bold tracking-wider">
              {product.name}
            </span>
          </div>
          <button
            onClick={() => setActiveProductModal(null)}
            className="p-1 rounded-full bg-charcoal-800 text-cream-300 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-10">
          {/* Main Product Showcase Row */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Fluid Animated Image Gallery */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                {/* Main Image Stage with Fluid Cross-Fade Animation */}
                <div className="aspect-square w-full rounded overflow-hidden bg-white border border-cream-300 shadow-inner relative group">
                  {product.badge && (
                    <span className="absolute top-3 left-3 z-10 text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-charcoal-900 text-gold-300 border border-gold-400/30 flex items-center gap-1 shadow-sm">
                      <Sparkles className="w-3 h-3 text-gold-400" />
                      <span>{product.badge}</span>
                    </span>
                  )}
                  <span className="absolute top-3 right-3 z-10 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-800 text-cream-100 shadow-sm">
                    {discountPercent}% Wholesale Deal
                  </span>

                  {/* AnimatePresence for smooth slide/fade transition */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={selectedImageIndex}
                      src={activeImage}
                      alt={product.name}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="w-full h-full object-cover object-center"
                    />
                  </AnimatePresence>

                  {/* Prev / Next Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-charcoal-900 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-charcoal-900 flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-2 right-2 bg-charcoal-900/70 backdrop-blur-sm text-cream-100 text-[10px] px-2 py-0.5 rounded">
                    View {selectedImageIndex + 1} of {images.length}
                  </div>
                </div>

                {/* Clickable 5+ Thumbnail Selector Strip */}
                <div className="mt-4">
                  <span className="text-[11px] font-semibold text-charcoal-600 uppercase tracking-wider block mb-1.5">
                    Multi-Angle Gallery ({images.length} High-Res Views):
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`aspect-square rounded overflow-hidden border-2 transition-all relative ${
                          selectedImageIndex === idx
                            ? "border-gold-600 ring-2 ring-gold-400/50 scale-105"
                            : "border-cream-300 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="mt-6 pt-4 border-t border-cream-300/80 grid grid-cols-2 gap-3 text-xs text-charcoal-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>24K Micro-Gold Dipped</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gold-600 shrink-0" />
                  <span>Cash on Delivery Available</span>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Actions */}
            <div className="md:w-1/2 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div>
                  <span className="text-xs uppercase tracking-widest font-semibold text-gold-700 bg-gold-400/10 px-2.5 py-0.5 rounded">
                    {product.category}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 mt-2 leading-snug">
                    {product.name}
                  </h2>
                  {product.tagline && (
                    <p className="text-xs sm:text-sm text-charcoal-600 italic mt-1 font-serif">
                      {product.tagline}
                    </p>
                  )}
                </div>

                {/* Rating and Stock */}
                <div className="flex items-center justify-between pb-3 border-b border-cream-300">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating)
                              ? "fill-gold-400 text-gold-400"
                              : "fill-cream-300 text-cream-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-charcoal-800">
                      {product.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-charcoal-500">
                      ({product.reviewsCount} reviews)
                    </span>
                  </div>

                  <div className="text-xs">
                    {product.stock > 0 ? (
                      <span className="text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        {product.stock} Pieces In Vault
                      </span>
                    ) : (
                      <span className="text-red-700 font-medium bg-red-50 px-2 py-0.5 rounded border border-red-100">
                        Sold Out
                      </span>
                    )}
                  </div>
                </div>

                {/* Classic MRP vs Wholesale Deal Banner */}
                <div className="bg-cream-200/90 p-4 rounded border border-cream-300 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-charcoal-500 block">
                      Wholesale Clearance Deal
                    </span>
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-serif text-3xl font-bold text-charcoal-900">
                        ₹{product.price}
                      </span>
                      <span className="text-base text-charcoal-400 line-through font-serif">
                        MRP ₹{product.mrp}
                      </span>
                      <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider bg-emerald-100 px-1.5 py-0.5 rounded">
                        Save ₹{product.mrp - product.price}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                      Direct Artisan Rate
                    </span>
                    <span className="text-[10px] text-charcoal-500">COD Available</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
                  {product.description}
                </p>

                {/* Features list */}
                {product.features && product.features.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-900">
                      Artisanal Specifications
                    </h4>
                    <ul className="space-y-1 text-xs text-charcoal-700">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-gold-600 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metal & dimensions meta */}
                {(product.metal || product.weight || product.dimensions) && (
                  <div className="pt-1 grid grid-cols-2 gap-3 text-xs bg-cream-50 p-3 rounded border border-cream-200">
                    {product.metal && (
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-charcoal-500 block text-[10px] uppercase tracking-wider">Metal / Plating</span>
                        <span className="font-medium text-charcoal-800">{product.metal}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="col-span-2 sm:col-span-1">
                        <span className="text-charcoal-500 block text-[10px] uppercase tracking-wider">Net Weight</span>
                        <span className="font-medium text-charcoal-800">{product.weight}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="col-span-2">
                        <span className="text-charcoal-500 block text-[10px] uppercase tracking-wider">Dimensions</span>
                        <span className="font-medium text-charcoal-800">{product.dimensions}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Row */}
              <div className="pt-4 border-t border-cream-300 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-medium text-charcoal-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-cream-300 rounded bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1 text-charcoal-700 hover:bg-cream-200 transition-colors font-semibold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-xs font-semibold text-charcoal-900 min-w-[2.5rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      className="px-3 py-1 text-charcoal-700 hover:bg-cream-200 transition-colors font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAdd}
                    disabled={product.stock === 0}
                    className="py-3 px-4 bg-cream-200 hover:bg-cream-300 text-charcoal-900 text-xs font-semibold uppercase tracking-wider rounded border border-cream-300 hover:border-gold-400 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-gold-600" />
                    <span>{addedNotice ? "Added to Bag ✓" : "Add to Bag"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleInstantBuy}
                    disabled={product.stock === 0}
                    className="py-3 px-4 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold tracking-wider uppercase rounded shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-gold-400 fill-gold-400" />
                    <span>Instant Checkout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DEDICATED CUSTOMER REVIEWS & RATINGS SECTION */}
          <CustomerReviews
            productId={product.id}
            productName={product.name}
            rating={product.rating}
            reviewsCount={product.reviewsCount}
            reviews={product.reviews}
          />
        </div>
      </div>
    </div>
  );
}
