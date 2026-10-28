"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { ProductManagement } from "@/components/admin/ProductManagement";
import { HeroSlidesManagement } from "@/components/admin/HeroSlidesManagement";
import { useStore } from "@/context/StoreContext";
import {
  Package,
  Layers,
  ShieldCheck,
  Bell,
  X,
  Lock,
  ArrowRight,
  Sparkles,
  Sliders,
} from "lucide-react";
import Link from "next/link";
import { DEFAULT_MRP, DEFAULT_WHOLESALE_PRICE } from "@/types";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "hero" | "policy">("orders");
  const { recentOrderAlert, clearOrderAlert, orders, products, refreshOrdersFromStorage } = useStore();

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const auth =
          localStorage.getItem("the_99_ornaments_admin_auth") === "true" ||
          sessionStorage.getItem("the_99_ornaments_admin_auth") === "true" ||
          document.cookie.includes("the_99_ornaments_admin_auth=true");
        setIsAuthenticated(!!auth);
        if (auth) {
          refreshOrdersFromStorage();
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    }
  }, [refreshOrdersFromStorage]);

  // Safety fallback: Never leave user stuck on spinner on mobile devices
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAuthenticated((prev) => (prev === null ? false : prev));
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    refreshOrdersFromStorage();
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("the_99_ornaments_admin_auth");
        sessionStorage.removeItem("the_99_ornaments_admin_auth");
        document.cookie = "the_99_ornaments_admin_auth=; path=/; max-age=0";
      } catch {}
    }
    setIsAuthenticated(false);
  };

  // Prevent hydration flash (capped at 200ms)
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-charcoal-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in -> Show Luxury Login Card
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-charcoal-850">
      {/* Admin Top Header with metrics & Logout */}
      <AdminHeader onLogout={handleLogout} />

      {/* Real-Time Live Order Alert Toast */}
      {recentOrderAlert && (
        <div className="bg-charcoal-900 text-cream-100 border-b border-gold-500/50 py-3 px-4 sm:px-8 shadow-lg flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center animate-bounce">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif font-bold text-gold-300 text-sm">
                New Ornaments Order Placed!
              </span>
              <p className="text-xs text-cream-300">
                Order <strong className="font-mono text-white">{recentOrderAlert.id}</strong> by{" "}
                <strong>{recentOrderAlert.customer.fullName}</strong> ({recentOrderAlert.customer.city}) for{" "}
                <strong>₹{recentOrderAlert.totalAmount}</strong> via {recentOrderAlert.paymentMethod}.
              </p>
            </div>
          </div>
          <button
            onClick={clearOrderAlert}
            className="p-1.5 text-cream-400 hover:text-white rounded-full"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-cream-300 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
              activeTab === "orders"
                ? "bg-charcoal-900 text-cream-100 shadow-sm"
                : "bg-cream-200 text-charcoal-700 hover:bg-cream-300 hover:text-charcoal-900"
            }`}
          >
            <Package className="w-4 h-4 text-gold-400" />
            <span>Orders Management</span>
            {pendingOrdersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-charcoal-900">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "products"
                ? "bg-charcoal-900 text-cream-100 shadow-sm"
                : "bg-cream-200 text-charcoal-700 hover:bg-cream-300 hover:text-charcoal-900"
            }`}
          >
            <Layers className="w-4 h-4 text-gold-400" />
            <span>Product Catalog CRUD ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "hero"
                ? "bg-charcoal-900 text-cream-100 shadow-sm"
                : "bg-cream-200 text-charcoal-700 hover:bg-cream-300 hover:text-charcoal-900"
            }`}
          >
            <Sliders className="w-4 h-4 text-gold-400" />
            <span>Hero Background & Banners (3 Images)</span>
          </button>

          <button
            onClick={() => setActiveTab("policy")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === "policy"
                ? "bg-charcoal-900 text-cream-100 shadow-sm"
                : "bg-cream-200 text-charcoal-700 hover:bg-cream-300 hover:text-charcoal-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>Wholesale Pricing & Security</span>
          </button>
        </div>

        {/* Tab 1: Orders Dashboard */}
        {activeTab === "orders" && <OrdersTable />}

        {/* Tab 2: Product Management */}
        {activeTab === "products" && <ProductManagement />}

        {/* Tab 3: Hero Slides & Backgrounds */}
        {activeTab === "hero" && <HeroSlidesManagement />}

        {/* Tab 4: Flat Pricing Policy & Architectural Overview */}
        {activeTab === "policy" && (
          <div className="bg-white p-6 sm:p-8 rounded border border-cream-300 shadow-sm space-y-6 max-w-4xl">
            <div className="flex items-center gap-3 pb-4 border-b border-cream-200">
              <div className="w-12 h-12 rounded-full bg-gold-400/20 text-gold-700 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">
                  Ornaments Pricing & Multi-Image Architecture
                </h3>
                <p className="text-xs text-charcoal-600">
                  MRP ₹349 with Special Wholesale Offer ₹99 (Save ₹250) + 5 High-Res Views
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-charcoal-700 leading-relaxed">
              <p>
                <strong>Classic Pricing Model:</strong> Every single ornament across the vault has a benchmark retail MRP of <strong className="text-charcoal-900">₹{DEFAULT_MRP}</strong>, offered to customers at an exclusive wholesale rate of <strong className="text-charcoal-900 font-bold">₹{DEFAULT_WHOLESALE_PRICE}</strong>.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-cream-50 rounded border border-cream-200 space-y-2">
                  <span className="font-semibold text-charcoal-900 uppercase tracking-wider text-[11px] block">
                    Secure Admin Authentication
                  </span>
                  <p>
                    Protected by credential gateway (Username: <code>1234</code>, Password: <code>4321</code>). Authenticated state is safely preserved across browser sessions.
                  </p>
                </div>

                <div className="p-4 bg-cream-50 rounded border border-cream-200 space-y-2">
                  <span className="font-semibold text-charcoal-900 uppercase tracking-wider text-[11px] block">
                    Mandatory 5+ High-Resolution Views
                  </span>
                  <p>
                    Every product is backed by minimum 5 distinct image URLs or uploads, allowing customers to view front, macro stone setting, side clasp, styling perspective, and royal packaging.
                  </p>
                </div>

                <div className="p-4 bg-cream-50 rounded border border-cream-200 space-y-2">
                  <span className="font-semibold text-charcoal-900 uppercase tracking-wider text-[11px] block">
                    Real-Time State Synchronization
                  </span>
                  <p>
                    Built using a unified reactive store accompanied by browser <code className="bg-cream-200 px-1 rounded font-mono">BroadcastChannel</code> and storage events. Modifying an ornament in the Admin panel updates storefront tabs instantaneously.
                  </p>
                </div>

                <div className="p-4 bg-cream-50 rounded border border-cream-200 space-y-2">
                  <span className="font-semibold text-charcoal-900 uppercase tracking-wider text-[11px] block">
                    Zero-Friction Checkout Flow
                  </span>
                  <p>
                    Customers submit their address and select either instant online gateway or Cash on Delivery. Orders immediately surface in the Orders table with customer telephone numbers and full shipping destinations.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
                <span className="text-charcoal-600">
                  Ready to test the live purchasing experience?
                </span>
                <Link
                  href="/"
                  className="px-4 py-2 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1.5"
                >
                  <span>Go to Storefront</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
