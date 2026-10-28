"use client";

import React from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Store, RefreshCw, DollarSign, Package, ShoppingBag, Clock, Sparkles, LogOut } from "lucide-react";

interface AdminHeaderProps {
  onLogout?: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  const { products, orders, resetCatalog } = useStore();

  const totalRevenue = orders.reduce((sum, o) => {
    return o.status !== "Cancelled" ? sum + o.totalAmount : sum;
  }, 0);

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  const ladiesCount = products.filter((p) => p.category === "Ladies Ornaments").length;
  const gentsCount = products.filter((p) => p.category === "Gents Ornaments").length;

  return (
    <div className="bg-charcoal-900 text-cream-100 border-b border-charcoal-800">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-charcoal-800 border border-gold-400/30 flex items-center justify-center font-serif font-bold text-gold-400 text-lg shadow-sm">
              99
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-wide">
                  Atelier 99 Ornaments Console
                </h1>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] uppercase font-semibold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Sync Active</span>
                </div>
              </div>
              <p className="text-xs text-cream-400 font-light mt-0.5">
                Ladies & Gents Exclusive Royal Ornaments • MRP ₹349 | Wholesale Flat ₹99
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm("Reset store to default 25 Ornaments (Ladies + Gents) and sample orders?")) {
                  resetCatalog();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-cream-300 hover:text-white bg-charcoal-800 hover:bg-charcoal-700 rounded border border-charcoal-700 transition-colors"
              title="Reset to default 25 items"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset 25 Vault Items</span>
            </button>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-widest bg-gold-400 hover:bg-gold-500 text-charcoal-900 rounded shadow transition-all group"
            >
              <Store className="w-4 h-4 text-charcoal-900 group-hover:scale-110 transition-transform" />
              <span>Live Storefront</span>
            </Link>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-cream-300 hover:text-red-400 bg-charcoal-800 hover:bg-charcoal-700 rounded border border-charcoal-700 transition-colors"
                title="Lock Console & Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time KPI Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-charcoal-800">
          <div className="bg-charcoal-850 p-4 rounded border border-charcoal-800">
            <div className="flex items-center justify-between text-xs text-cream-400 uppercase tracking-wider">
              <span>Wholesale Revenue</span>
              <DollarSign className="w-4 h-4 text-gold-400" />
            </div>
            <p className="font-serif text-2xl font-bold text-cream-100 mt-2">
              ₹{totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-cream-400 mt-1">
              From {orders.length} orders (Wholesale ₹99/ea)
            </p>
          </div>

          <div className="bg-charcoal-850 p-4 rounded border border-charcoal-800">
            <div className="flex items-center justify-between text-xs text-cream-400 uppercase tracking-wider">
              <span>Orders Queue</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif text-2xl font-bold text-amber-400">
                {pendingCount}
              </span>
              <span className="text-xs text-cream-400">Pending Dispatch</span>
            </div>
            <p className="text-[11px] text-cream-400 mt-1">
              {shippedCount} in transit • {deliveredCount} delivered
            </p>
          </div>

          <div className="bg-charcoal-850 p-4 rounded border border-charcoal-800">
            <div className="flex items-center justify-between text-xs text-cream-400 uppercase tracking-wider">
              <span>Total Orders</span>
              <Package className="w-4 h-4 text-blue-400" />
            </div>
            <p className="font-serif text-2xl font-bold text-cream-100 mt-2">
              {orders.length}
            </p>
            <p className="text-[11px] text-cream-400 mt-1">
              Online UPI & COD records
            </p>
          </div>

          <div className="bg-charcoal-850 p-4 rounded border border-charcoal-800">
            <div className="flex items-center justify-between text-xs text-cream-400 uppercase tracking-wider">
              <span>Vault Catalog</span>
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="font-serif text-2xl font-bold text-cream-100">
                {products.length}
              </span>
              <span className="text-xs text-cream-400">Total Ornaments</span>
            </div>
            <p className="text-[11px] text-emerald-400 mt-1">
              {ladiesCount} Ladies • {gentsCount} Gents
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
