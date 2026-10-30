"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { CheckoutModal } from "@/components/CheckoutModal";
import { OrderSuccessModal } from "@/components/OrderSuccessModal";
import { TrackOrderModal } from "@/components/TrackOrderModal";
import { CustomerReviews } from "@/components/CustomerReviews";
import { MobileQuickBar } from "@/components/MobileQuickBar";
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Crown,
  Eye,
  Layers,
  ZoomIn,
  X,
  Maximize2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_MRP, DEFAULT_WHOLESALE_PRICE } from "@/types";

export default function ProductDetailPage() {
  const params = useParams();
  const { products, addToCart, buyNow } = useStore();
  const productId = params?.id as string;

  const product = products.find((p) => p.id === productId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [bottomCategoryFilter, setBottomCategoryFilter] = useState<string>("ALL");
  const [bottomAddedMap, setBottomAddedMap] = useState<Record<string, boolean>>({});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-cream-100 text-charcoal-850">
        <Header />
        <div className="flex-1 max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
          <h2 className="font-serif text-2xl font-bold text-charcoal-900">
            Ornament Article Not Found
          </h2>
          <p className="text-xs text-charcoal-600">
            The requested ornament may have been archived or removed from the vault.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal-900 text-cream-100 text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-charcoal-850 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Vault Collection</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = images[selectedImageIndex] || product.image;

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBottomAddToCart = (p: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(p, 1);
    setBottomAddedMap((prev) => ({ ...prev, [p.id]: true }));
    setTimeout(() => {
      setBottomAddedMap((prev) => ({ ...prev, [p.id]: false }));
    }, 1200);
  };

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  // Bottom All Products (excluding current)
  const otherProducts = products.filter((p) => {
    if (bottomCategoryFilter === "ALL") return p.id !== product.id;
    return p.category === bottomCategoryFilter && p.id !== product.id;
  });

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-charcoal-850 pb-20 md:pb-0">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-charcoal-600">
          <Link href="/" className="hover:text-charcoal-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Ornaments</span>
          </Link>
          <span>/</span>
          <span className="text-gold-700 font-medium">{product.category}</span>
          <span>/</span>
          <span className="text-charcoal-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Details Section - Rounded 3xl & Generously Spacious */}
        <div className="bg-white border border-cream-300 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Left: Animated 5-Image Gallery */}
          <div className="md:w-1/2 p-6 sm:p-10 bg-cream-50/80 flex flex-col justify-between border-b md:border-b-0 md:border-r border-cream-300/80">
            <div>
              {/* Main Image Stage with Click-to-Zoom Lightbox */}
              <div
                onClick={() => setIsLightboxOpen(true)}
                className="aspect-square w-full rounded-2xl overflow-hidden bg-white border border-cream-300 shadow-inner relative group cursor-zoom-in"
                title="Click to view full-screen high-res image"
              >
                {product.badge && (
                  <span className="absolute top-4 left-4 z-10 text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-charcoal-900/90 text-gold-300 border border-gold-400/30 flex items-center gap-1.5 shadow-sm backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-gold-400" />
                    <span>{product.badge}</span>
                  </span>
                )}
                <span className="absolute top-4 right-4 z-10 text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-800 text-cream-100 shadow-sm">
                  {discountPercent}% Wholesale Discount
                </span>

                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImageIndex}
                    src={activeImage}
                    alt={`${product.name} - Angle ${selectedImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                </AnimatePresence>

                {/* Click to Zoom Pill Indicator */}
                <div className="absolute bottom-4 right-4 bg-charcoal-900/80 text-cream-100 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity backdrop-blur-md shadow-lg border border-gold-400/30">
                  <ZoomIn className="w-3.5 h-3.5 text-gold-400" />
                  <span className="font-medium text-[11px]">Click to Zoom</span>
                </div>

                {/* Arrow Navigation */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-charcoal-900 shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 hover:bg-white text-charcoal-900 shadow-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row (Minimum 5 High-Res Images) */}
              <div className="mt-5">
                <span className="text-[10px] uppercase tracking-wider text-charcoal-500 font-semibold block mb-2.5">
                  5 High-Resolution Perspectives (Click thumbnail or image to zoom):
                </span>
                <div className="grid grid-cols-5 gap-2.5">
                  {images.map((imgUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all relative ${
                        selectedImageIndex === idx
                          ? "border-charcoal-900 ring-2 ring-gold-400 shadow-md scale-105"
                          : "border-cream-300 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Angle ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 bg-charcoal-900/80 text-[8px] text-cream-100 px-1 rounded font-mono">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Quality & Transit Guarantees */}
            <div className="mt-8 pt-6 border-t border-cream-300/80 grid grid-cols-2 gap-4 text-xs text-charcoal-700">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-cream-200">
                <ShieldCheck className="w-4 h-4 text-gold-600 shrink-0" />
                <span className="font-medium">Anti-Tarnish Micro Plating</span>
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-cream-200">
                <Truck className="w-4 h-4 text-gold-600 shrink-0" />
                <span className="font-medium">⚡ Ships Within 12 Hours</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Actions */}
          <div className="md:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-gold-700 bg-gold-400/15 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-charcoal-900 mt-2.5 leading-tight">
                  {product.name}
                </h1>
                <p className="text-xs text-charcoal-500 font-light mt-1.5">
                  Item SKU: <span className="font-mono">{product.id}</span> • Certified Handcrafted Quality
                </p>
              </div>

              {/* Rating Summary */}
              <div className="flex items-center gap-2.5 text-xs text-charcoal-700">
                <div className="flex items-center text-gold-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-gold-400 text-gold-400"
                          : "text-cream-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold">{product.rating.toFixed(1)} / 5.0</span>
                <span className="text-charcoal-500">
                  ({product.reviewsCount} Verified Customer Reviews)
                </span>
              </div>

              {/* Pricing Box (MRP ₹349 Strikethrough vs Flat Wholesale ₹99 in Royal Gold) */}
              <div className="p-5 bg-cream-50 rounded-2xl border border-cream-300 space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold">
                    Universal Price:
                  </span>
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-gold-500">
                    ₹{product.price || 99}
                  </span>
                  <span className="text-base sm:text-lg text-charcoal-400 line-through font-serif font-light">
                    MRP ₹{product.mrp || 349}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-1 rounded-full">
                    Save ₹{(product.mrp || 349) - (product.price || 99)} Flat • Wholesale Deal (Har Ek Maal ₹99)
                  </span>
                  <span className="text-[11px] text-charcoal-500">• Cash on Delivery</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-800">
                  Description & Details
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Key Features */}
              {product.features && product.features.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-cream-200">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-charcoal-800">
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-charcoal-700">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Purchase CTA Bar ("Buy Now" prominently updated) */}
            <div className="pt-6 border-t border-cream-300 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-800">
                  Select Quantity:
                </span>
                <div className="flex items-center border border-cream-300 rounded-xl bg-white overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 py-2 text-charcoal-700 hover:bg-cream-200 transition-colors font-semibold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-xs font-semibold text-charcoal-900 min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-4 py-2 text-charcoal-700 hover:bg-cream-200 transition-colors font-semibold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="py-3.5 px-4 bg-cream-200 hover:bg-cream-300 text-charcoal-900 text-xs font-semibold uppercase tracking-wider rounded-xl border border-cream-300 hover:border-gold-400 transition-all flex items-center justify-center gap-2 shadow-xs active:scale-98"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-gold-600" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => buyNow(product)}
                  disabled={product.stock === 0}
                  className="py-3.5 px-4 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold tracking-wider uppercase rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Zap className="w-4 h-4 text-gold-400 fill-gold-400" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* IMAGE LIGHTBOX / FULL-SCREEN ZOOM MODAL                        */}
        {/* ============================================================== */}
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-charcoal-900/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-charcoal-800 text-cream-200 hover:text-white hover:bg-charcoal-700 transition-all z-20 shadow-xl border border-gold-400/30"
              aria-label="Close zoom preview"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev/Next Navigation Controls */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-charcoal-800/90 hover:bg-charcoal-700 text-cream-100 transition-all z-20 shadow-2xl border border-charcoal-700"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3.5 rounded-full bg-charcoal-800/90 hover:bg-charcoal-700 text-cream-100 transition-all z-20 shadow-2xl border border-charcoal-700"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Main Zoomed High-Res Image Container */}
            <div
              className="relative max-w-4xl max-h-[90vh] flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activeImage}
                alt={`${product.name} zoomed angle ${selectedImageIndex + 1}`}
                className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl border border-gold-400/40"
              />

              {/* Thumbnails in Zoom view */}
              <div className="mt-4 flex items-center justify-center gap-2 overflow-x-auto py-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-gold-400 ring-2 ring-gold-400 scale-105"
                        : "border-charcoal-700 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews & Star Ratings Section - Rounded 3xl */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-cream-300 shadow-sm">
          <CustomerReviews
            productId={product.id}
            productName={product.name}
            rating={product.rating}
            reviewsCount={product.reviewsCount}
            reviews={product.reviews}
          />
        </div>

        {/* ============================================================== */}
        {/* REQUIREMENT 3: RELATED / ALL PRODUCTS GRID (BOTTOM OF DETAIL) */}
        {/* ============================================================== */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-cream-300">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-600 mb-1">
                <Crown className="w-3.5 h-3.5" />
                <span>The Entire Royal Vault</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900">
                Explore More Ornaments • Flat ₹99 Wholesale
              </h2>
              <p className="text-xs text-charcoal-600 mt-0.5">
                Benchmark retail MRP ₹349. Click &ldquo;Add to Cart&rdquo; or &ldquo;Buy Now&rdquo; on any piece below.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {["ALL", "Ladies Ornaments", "Gents Ornaments"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setBottomCategoryFilter(cat)}
                  className={`text-xs px-3.5 py-1.5 rounded-full font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                    bottomCategoryFilter === cat
                      ? "bg-charcoal-900 text-cream-100 shadow-sm"
                      : "bg-white text-charcoal-700 hover:bg-cream-200 border border-cream-300"
                  }`}
                >
                  {cat === "ALL" ? "All Ornaments" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of All / Related Products - Rounded 3xl & Spacious */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {otherProducts.map((p) => {
              const pImg = p.images?.[0] || p.image;
              const isAdded = bottomAddedMap[p.id] || false;
              const disc = Math.round(((p.mrp - p.price) / p.mrp) * 100);

              return (
                <div
                  key={p.id}
                  className="bg-white border border-cream-300 rounded-3xl p-3 sm:p-3.5 shadow-sm hover:border-gold-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Top Image Stage with Rounded 2xl */}
                  <Link href={`/product/${p.id}`} className="relative aspect-[4/3] bg-cream-200 rounded-2xl overflow-hidden block">
                    <span className="absolute top-2.5 left-2.5 z-10 text-[9px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-800 text-cream-100 shadow-sm">
                      {disc}% OFF
                    </span>
                    <img
                      src={pImg}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>

                  {/* Body Details */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-charcoal-500 mb-1">
                        <span className="text-gold-700 font-semibold uppercase">{p.category}</span>
                        <div className="flex items-center gap-0.5 text-gold-500 font-medium">
                          <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                          <span>{p.rating.toFixed(1)}</span>
                        </div>
                      </div>

                      <Link href={`/product/${p.id}`} className="block">
                        <h4 className="font-serif font-bold text-charcoal-900 text-sm group-hover:text-gold-700 transition-colors line-clamp-1">
                          {p.name}
                        </h4>
                      </Link>
                      <p className="text-xs text-charcoal-600 line-clamp-1 mt-0.5 font-light">
                        {p.tagline || p.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-cream-200 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif font-bold text-gold-500 text-lg">
                            ₹{p.price || 99}
                          </span>
                          <span className="text-xs text-charcoal-400 line-through font-serif font-light">
                            MRP ₹{p.mrp || 349}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          Save ₹{(p.mrp || 349) - (p.price || 99)}
                        </span>
                      </div>

                      {/* Direct Add to Cart & Buy Now Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={(e) => handleBottomAddToCart(p, e)}
                          className="py-2.5 px-3 bg-cream-200 hover:bg-cream-300 text-charcoal-900 text-[11px] font-semibold uppercase tracking-wider rounded-xl border border-cream-300 flex items-center justify-center gap-1 transition-all active:scale-98 shadow-xs"
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-gold-600" />
                              <span>Add</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => buyNow(p)}
                          className="py-2.5 px-3 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-[11px] font-semibold uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-1 transition-all active:scale-98"
                        >
                          <Zap className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Global Interactive Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <TrackOrderModal />

      {/* Mobile Specialization: Luxury Docked Bottom Quick Bar */}
      <MobileQuickBar />

      <Footer />
    </div>
  );
}
