"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { X, Search, Package, CheckCircle, Truck } from "lucide-react";
import { Order, OrderStatus } from "@/types";

export function TrackOrderModal() {
  const { isTrackOrderOpen, setIsTrackOrderOpen, orders } = useStore();
  const [query, setQuery] = useState("");
  const [matchedOrders, setMatchedOrders] = useState<Order[] | null>(null);
  const [searched, setSearched] = useState(false);

  if (!isTrackOrderOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    const results = orders.filter((o) => {
      const matchId = o.id.toLowerCase().includes(clean);
      const matchPhone = o.customer.phone.replace(/\D/g, "").includes(clean.replace(/\D/g, ""));
      const matchName = o.customer.fullName.toLowerCase().includes(clean);
      return matchId || matchPhone || matchName;
    });

    setMatchedOrders(results);
    setSearched(true);
  };

  const getStatusStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Shipped":
        return 1;
      case "Delivered":
        return 2;
      case "Cancelled":
        return -1;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-cream-100 w-full max-w-2xl rounded-3xl border border-gold-400/30 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-charcoal-900 text-cream-100 flex items-center justify-between border-b border-charcoal-800">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold">
              Live Courier Tracking
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
              Track Your Bolera Order
            </h2>
          </div>
          <button
            onClick={() => setIsTrackOrderOpen(false)}
            className="p-1.5 rounded-full bg-charcoal-800 text-cream-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-600" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. ORD-99-8491) or Phone Number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded-xl focus:border-gold-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              Track
            </button>
          </form>

          {/* Search Results */}
          {searched && (
            <div className="space-y-4">
              {matchedOrders && matchedOrders.length > 0 ? (
                matchedOrders.map((ord) => {
                  const step = getStatusStepIndex(ord.status);
                  return (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl bg-white border border-cream-300 shadow-sm space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-cream-200">
                        <div>
                          <span className="font-mono text-xs font-bold text-charcoal-900">
                            {ord.id}
                          </span>
                          <span suppressHydrationWarning className="text-charcoal-500 text-xs ml-2">
                            Placed on {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded font-semibold uppercase ${
                            ord.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : ord.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>

                      {/* Timeline Steps */}
                      {ord.status !== "Cancelled" && (
                        <div className="grid grid-cols-3 gap-2 text-center pt-2">
                          <div className={`space-y-1 ${step >= 0 ? "text-charcoal-900" : "text-charcoal-400"}`}>
                            <div
                              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                                step >= 0 ? "bg-charcoal-900 text-gold-400" : "bg-cream-200 text-charcoal-400"
                              }`}
                            >
                              <Package className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-semibold block uppercase">1. Confirmed</span>
                          </div>

                          <div className={`space-y-1 ${step >= 1 ? "text-charcoal-900" : "text-charcoal-400"}`}>
                            <div
                              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                                step >= 1 ? "bg-charcoal-900 text-gold-400" : "bg-cream-200 text-charcoal-400"
                              }`}
                            >
                              <Truck className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-semibold block uppercase">2. In Transit</span>
                          </div>

                          <div className={`space-y-1 ${step >= 2 ? "text-emerald-800" : "text-charcoal-400"}`}>
                            <div
                              className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                                step >= 2 ? "bg-emerald-700 text-white" : "bg-cream-200 text-charcoal-400"
                              }`}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-semibold block uppercase">3. Delivered</span>
                          </div>
                        </div>
                      )}

                      {/* Items & Address Summary */}
                      <div className="bg-cream-50 p-3 rounded text-xs space-y-1.5 border border-cream-200">
                        <div className="flex justify-between font-medium">
                          <span>Recipient: {ord.customer.fullName} ({ord.customer.city})</span>
                          <span>Total: ₹{ord.totalAmount} ({ord.paymentMethod})</span>
                        </div>
                        <p className="text-charcoal-600 text-[11px]">
                          Articles: {ord.items.map((i) => `${i.name} (×${i.quantity})`).join(", ")}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center p-6 bg-cream-50 rounded border border-cream-200 text-xs text-charcoal-600">
                  No orders found matching &ldquo;{query}&rdquo;. Please verify your phone number or Order ID.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
