"use client";

import React, { useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Sparkles, Tag } from "lucide-react";

export function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartMrpTotal,
    cartSavingsTotal,
    cartCount,
    openCheckoutWithCart,
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream-100 border-l border-cream-300 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-6 border-b border-cream-300 flex items-center justify-between bg-cream-50">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-gold-600" />
              <h2 className="font-serif text-xl font-bold text-charcoal-900">
                Your Bolera Bag
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold-400/20 text-charcoal-800">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-charcoal-600 hover:text-charcoal-900 rounded-full hover:bg-cream-200 transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pricing Assurance Banner */}
          <div className="bg-charcoal-850 px-6 py-2.5 text-cream-100 flex items-center justify-between text-xs tracking-wider">
            <span className="flex items-center gap-1.5 text-gold-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bolera • Har Ek Maal Flat ₹99</span>
            </span>
            <span className="text-emerald-400 font-semibold text-[11px]">
              Save ₹250 per item
            </span>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center text-charcoal-400">
                  <ShoppingBag className="w-8 h-8 text-gold-600/60" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal-800">
                    Your Ornaments Bag is Empty
                  </h3>
                  <p className="text-xs text-charcoal-600 max-w-xs mt-1">
                    Select from our curated Ladies & Gents Royal Ornaments — every piece has an MRP of ₹349, offered at a flat wholesale rate of ₹99.
                  </p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs uppercase tracking-wider font-semibold rounded"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemImage = item.product.images?.[0] || item.product.image;
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3.5 rounded bg-white border border-cream-200 shadow-sm"
                  >
                    <div className="w-20 h-20 bg-cream-200 rounded overflow-hidden shrink-0 border border-cream-300">
                      <img
                        src={itemImage}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif text-sm font-bold text-charcoal-900 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-charcoal-400 hover:text-red-600 transition-colors p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[10px] text-gold-700 font-semibold uppercase tracking-wider bg-gold-400/10 px-1.5 py-0.5 rounded">
                          {item.product.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-cream-300 rounded bg-cream-50">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-2.5 py-0.5 text-xs text-charcoal-700 hover:bg-cream-200"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-0.5 text-xs font-semibold text-charcoal-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="px-2.5 py-0.5 text-xs text-charcoal-700 hover:bg-cream-200 disabled:opacity-30"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-serif text-sm font-bold text-charcoal-900">
                              ₹{item.quantity * item.product.price}
                            </span>
                            <span className="text-[11px] text-charcoal-400 line-through">
                              ₹{item.quantity * item.product.mrp}
                            </span>
                          </div>
                          <span className="block text-[10px] text-emerald-800 font-semibold">
                            Save ₹{item.quantity * (item.product.mrp - item.product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-cream-300 bg-cream-50 space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-charcoal-600">
                  <span>Total MRP Value</span>
                  <span className="line-through text-charcoal-500 font-serif">₹{cartMrpTotal}</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Special Wholesale Discount</span>
                  </span>
                  <span>- ₹{cartSavingsTotal}</span>
                </div>
                <div className="flex justify-between text-charcoal-700">
                  <span>Packaging & Insured Transit</span>
                  <span className="text-emerald-700 font-semibold uppercase text-[11px]">
                    FREE (Royal Seal)
                  </span>
                </div>
                <div className="border-t border-cream-300 pt-2 flex justify-between text-sm">
                  <div>
                    <span className="font-serif font-bold text-charcoal-900 block">
                      Wholesale Total
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      You Save ₹{cartSavingsTotal} Today!
                    </span>
                  </div>
                  <span className="font-serif text-2xl font-bold text-charcoal-900">
                    ₹{cartTotal}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={openCheckoutWithCart}
                  className="w-full py-3.5 px-4 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold uppercase tracking-widest rounded shadow-md hover:shadow-classic-hover transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Proceed to Wholesale Checkout</span>
                  <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={clearCart}
                    className="text-[11px] text-charcoal-500 hover:text-red-600 transition-colors underline"
                  >
                    Clear Bag
                  </button>
                  <div className="flex items-center gap-1 text-[11px] text-charcoal-600">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                    <span>256-bit Encrypted Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
