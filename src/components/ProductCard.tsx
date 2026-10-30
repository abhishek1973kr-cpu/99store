"use client";

import React, { useState } from "react";
import { Product } from "@/types";
import { useStore } from "@/context/StoreContext";
import { ShoppingBag, Eye, Star, Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setActiveProductModal, buyNow } = useStore();
  const [addedAnimation, setAddedAnimation] = useState(false);

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];
  const primaryImage = imagesList[0] || product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleOpenDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveProductModal(product);
  };

  const discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={() => setActiveProductModal(product)}
      className="group relative bg-white border border-cream-300/80 rounded-3xl overflow-hidden flex flex-col hover:border-gold-400 hover:shadow-xl transition-all duration-300 cursor-pointer p-3 sm:p-3.5"
    >
      {/* Top Image Container with Smooth Rounded Corners */}
      <div className="relative aspect-[4/3] bg-cream-200 rounded-2xl overflow-hidden shadow-inner">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          <span className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-charcoal-900/90 text-gold-300 backdrop-blur-sm border border-gold-400/30 flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-gold-400" />
            <span>{product.badge || "Wholesale Deal"}</span>
          </span>
          <span className="text-[9px] uppercase tracking-wider font-bold px-2.5 py-0.5 rounded-full bg-emerald-800 text-cream-100 shadow-sm">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Stock warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 z-10 text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 z-10 text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200 shadow-sm">
            Sold Out
          </span>
        )}

        {/* Product Image with smooth hover scale */}
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Clean View Button Hover Overlay */}
        <div className="absolute inset-0 bg-charcoal-900/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={handleOpenDetails}
            className="px-5 py-2.5 bg-cream-100/95 text-charcoal-900 text-xs font-semibold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1.5 hover:bg-white hover:text-gold-700 transition-all hover:scale-105 backdrop-blur-sm"
          >
            <Eye className="w-3.5 h-3.5 text-gold-600" />
            <span>View Details</span>
          </button>
        </div>
      </div>

      {/* Content Container - Spacious & Airy */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-charcoal-600 mb-2">
            <span className="uppercase tracking-wider text-[11px] font-semibold text-gold-700 bg-gold-400/15 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-charcoal-700">
              <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              <span className="font-semibold text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-[11px] text-charcoal-500 font-light">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg font-bold text-charcoal-900 group-hover:text-gold-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-charcoal-600 line-clamp-2 mt-1 leading-relaxed font-light">
            {product.tagline || product.description}
          </p>
        </div>

        {/* Price & Action Row (MRP ₹349 Struck-Through vs Flat ₹99 in Royal Gold) */}
        <div className="pt-3 border-t border-cream-200/80">
          <div className="flex flex-wrap items-baseline justify-between gap-1 mb-3.5">
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-gold-500 tracking-tight">
                  ₹{product.price || 99}
                </span>
                <span className="text-xs sm:text-sm text-charcoal-400 line-through font-serif font-light">
                  MRP ₹{product.mrp || 349}
                </span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                Save ₹{(product.mrp || 349) - (product.price || 99)} • Har Ek Maal ₹99
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-gold-700 font-bold bg-gold-400/20 px-3 py-1 rounded-full border border-gold-400/40">
              Wholesale Deal
            </span>
          </div>

          {/* Action Buttons: Rounded Smooth Buttons (View + Buy Now) */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleOpenDetails}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-cream-100 hover:bg-cream-200 border border-cream-300 text-charcoal-850 hover:border-gold-400 active:scale-98 transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Eye className="w-4 h-4 text-gold-600 shrink-0" />
              <span>View</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                buyNow(product);
              }}
              disabled={product.stock === 0}
              className="w-full min-h-[44px] py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 hover:text-gold-300 border border-charcoal-900 shadow-md active:scale-98 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60"
            >
              <ShoppingBag className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
