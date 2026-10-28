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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={() => setActiveProductModal(product)}
      className="group relative bg-white border border-cream-300 rounded-sm overflow-hidden flex flex-col hover:border-gold-400 hover:shadow-classic transition-all duration-300 cursor-pointer"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] bg-cream-200 overflow-hidden">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-charcoal-900/90 text-gold-300 backdrop-blur-sm border border-gold-400/30 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-gold-400" />
            <span>{product.badge || "Wholesale Deal"}</span>
          </span>
          <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-emerald-800 text-cream-100 shadow-sm">
            {discountPercent}% OFF
          </span>
        </div>

        {/* Stock warning */}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 z-10 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 z-10 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-200">
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
        <div className="absolute inset-0 bg-charcoal-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={handleOpenDetails}
            className="px-5 py-2.5 bg-cream-100/95 text-charcoal-900 text-xs font-semibold uppercase tracking-wider rounded-sm shadow-md flex items-center gap-1.5 hover:bg-white hover:text-gold-700 transition-all hover:scale-105"
          >
            <Eye className="w-3.5 h-3.5 text-gold-600" />
            <span>View Ornament</span>
          </button>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-charcoal-600 mb-1.5">
            <span className="uppercase tracking-wider text-[11px] font-semibold text-gold-700 bg-gold-400/10 px-2 py-0.5 rounded">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-charcoal-700">
              <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
              <span className="font-medium text-xs">{product.rating.toFixed(1)}</span>
              <span className="text-[11px] text-charcoal-500">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-lg font-bold text-charcoal-900 group-hover:text-gold-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Tagline */}
          <p className="text-xs text-charcoal-600 line-clamp-2 mt-1 leading-relaxed">
            {product.tagline || product.description}
          </p>
        </div>

        {/* Price & Action Row (MRP ₹349 Struck-Through vs Wholesale ₹99) */}
        <div className="pt-3 border-t border-cream-200">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] uppercase tracking-wider text-charcoal-500 font-medium">Wholesale:</span>
                <span className="font-serif text-2xl font-bold text-charcoal-900">
                  ₹{product.price}
                </span>
                <span className="text-xs text-charcoal-400 line-through font-serif">
                  MRP ₹{product.mrp}
                </span>
              </div>
              <span className="text-[10px] text-emerald-800 font-semibold block">
                Save ₹{product.mrp - product.price} (Direct Artisan Deal)
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-gold-700 font-semibold bg-gold-400/15 px-2 py-1 rounded border border-gold-400/30">
              Wholesale Rate
            </span>
          </div>

          {/* Action Buttons: Clean "View" + "Add" */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleOpenDetails}
              className="w-full py-2.5 px-3 rounded text-xs font-semibold uppercase tracking-wider bg-cream-100 hover:bg-cream-200 border border-cream-300 text-charcoal-850 hover:border-gold-400 transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-gold-600" />
              <span>View</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-2.5 px-3 rounded text-xs font-semibold uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
                addedAnimation
                  ? "bg-emerald-700 border-emerald-700 text-white"
                  : product.stock === 0
                  ? "bg-cream-200 text-charcoal-400 border-cream-300 cursor-not-allowed"
                  : "bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 hover:text-gold-300 shadow-sm border-charcoal-900"
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
