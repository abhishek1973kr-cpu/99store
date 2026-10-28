"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useStore } from "@/context/StoreContext";
import { Order, OrderStatus } from "@/types";
import {
  Search,
  Phone,
  MapPin,
  CreditCard,
  Banknote,
  Clock,
  Trash2,
  Printer,
  X,
  Tag,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Building,
} from "lucide-react";

export function OrdersTable() {
  const { orders, updateOrderStatus, deleteOrder, refreshOrdersFromStorage } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>("");

  // 1. Direct Sync on Mount & Event Listeners
  const handleSyncOrders = useCallback(async () => {
    setIsRefreshing(true);
    await refreshOrdersFromStorage();
    setLastSyncedTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    setIsRefreshing(false);
  }, [refreshOrdersFromStorage]);

  useEffect(() => {
    // Initial mount sync
    handleSyncOrders();

    // Listen to in-tab custom event
    const handleCustomUpdate = () => {
      handleSyncOrders();
    };
    window.addEventListener("ornaments_orders_updated", handleCustomUpdate);

    // Listen to cross-tab storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes("orders")) {
        handleSyncOrders();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // Sync when tab gets focus or becomes visible
    const handleFocus = () => {
      handleSyncOrders();
    };
    window.addEventListener("focus", handleFocus);

    const handleVisibility = () => {
      if (!document.hidden) {
        handleSyncOrders();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Polling interval every 2.5 seconds to guarantee 100% zero-miss sync
    const intervalId = setInterval(() => {
      refreshOrdersFromStorage();
    }, 2500);

    return () => {
      window.removeEventListener("ornaments_orders_updated", handleCustomUpdate);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(intervalId);
    };
  }, [handleSyncOrders, refreshOrdersFromStorage]);

  // Safe filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const cleanSearch = search.trim().toLowerCase();
    if (!matchesStatus) return false;
    if (!cleanSearch) return true;

    const idMatch = (order.id || "").toLowerCase().includes(cleanSearch);
    const nameMatch = (order.customer?.fullName || "").toLowerCase().includes(cleanSearch);
    const phoneMatch = (order.customer?.phone || "").toLowerCase().includes(cleanSearch);
    const cityMatch = (order.customer?.city || "").toLowerCase().includes(cleanSearch);
    const paymentMatch = (order.paymentMethod || "").toLowerCase().includes(cleanSearch);

    return idMatch || nameMatch || phoneMatch || cityMatch || paymentMatch;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleDelete = (orderId: string) => {
    if (confirm(`Are you sure you want to delete order ${orderId}?`)) {
      deleteOrder(orderId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-4 rounded border border-cream-300 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
          <input
            type="text"
            placeholder="Search by Customer, Phone, City, Order ID, or COD..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-cream-50 border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
          />
        </div>

        {/* Status Filters & Manual Refresh */}
        <div className="flex items-center gap-2 overflow-x-auto">
          {["ALL", "Pending", "Shipped", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`text-xs px-3 py-1.5 rounded font-medium transition-colors uppercase tracking-wider ${
                statusFilter === st
                  ? "bg-charcoal-900 text-cream-100"
                  : "bg-cream-100 text-charcoal-700 hover:bg-cream-200"
              }`}
            >
              {st} {st !== "ALL" && `(${orders.filter((o) => o.status === st).length})`}
            </button>
          ))}

          {/* Sync Button */}
          <button
            onClick={handleSyncOrders}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded font-medium bg-gold-400 hover:bg-gold-500 text-charcoal-900 transition-all uppercase tracking-wider shadow-xs ml-2 shrink-0"
            title="Force refresh orders from shared localStorage storage"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded border border-cream-300 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-cream-300 bg-cream-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-base font-bold text-charcoal-900">
              Live Vault Orders ({filteredOrders.length})
            </h3>
            <span className="text-xs text-charcoal-500">
              • Real-Time Centralized Storage Sync
            </span>
          </div>
          {lastSyncedTime && (
            <span className="text-[11px] text-charcoal-500">
              Last synced at <span className="font-mono font-medium">{lastSyncedTime}</span>
            </span>
          )}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-charcoal-500 text-xs">
            No ornament orders found matching the filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-cream-200/70 border-b border-cream-300 text-[11px] uppercase tracking-wider text-charcoal-700 font-semibold">
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Complete Shipping Address</th>
                  <th className="py-3 px-4">Reserved Ornaments</th>
                  <th className="py-3 px-4">Wholesale Price (₹99)</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Order Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {filteredOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-cream-50/80 transition-colors">
                      {/* 1. Order ID & Date/Timestamp */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-mono font-bold text-charcoal-900 block text-xs">
                          {order.id}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-charcoal-500 mt-1">
                          <Clock className="w-3 h-3 text-gold-600 shrink-0" />
                          <span suppressHydrationWarning>
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        {order.trackingNumber && (
                          <span className="font-mono text-[10px] text-charcoal-500 mt-1 block">
                            Track: {order.trackingNumber}
                          </span>
                        )}
                      </td>

                      {/* 2. Customer Name & Phone Number */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-serif font-bold text-charcoal-900 block text-sm">
                          {order.customer?.fullName || "Valued Customer"}
                        </span>
                        <a
                          href={`tel:${order.customer?.phone}`}
                          className="flex items-center gap-1.5 text-xs text-charcoal-700 hover:text-gold-600 mt-1 font-semibold"
                        >
                          <Phone className="w-3 h-3 text-gold-600 shrink-0" />
                          <span>{order.customer?.phone}</span>
                        </a>
                        {order.customer?.email && (
                          <span className="text-[11px] text-charcoal-500 block mt-0.5 truncate max-w-[150px]">
                            {order.customer.email}
                          </span>
                        )}
                      </td>

                      {/* 3. Complete Shipping/Delivery Address */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        <div className="flex items-start gap-1.5 text-charcoal-800">
                          <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5 leading-relaxed">
                            <p className="font-semibold text-charcoal-900">
                              {order.customer?.addressLine1}
                            </p>
                            {order.customer?.addressLine2 && (
                              <p className="text-charcoal-600">{order.customer.addressLine2}</p>
                            )}
                            {order.customer?.landmark && (
                              <p className="text-charcoal-500 text-[11px] flex items-center gap-1">
                                <Building className="w-2.5 h-2.5 text-gold-600" />
                                <span>Near {order.customer.landmark}</span>
                              </p>
                            )}
                            <p className="font-medium text-charcoal-900 text-xs mt-0.5">
                              {order.customer?.city}, {order.customer?.state} -{" "}
                              <span className="font-mono font-bold text-charcoal-950">{order.customer?.pincode}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 4. Reserved Ornaments & Quantity */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-2 max-w-xs">
                          {order.items?.map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <img
                                src={it.image}
                                alt={it.name}
                                className="w-10 h-10 object-cover rounded border border-cream-300 shrink-0"
                              />
                              <div className="truncate">
                                <span className="font-serif font-medium text-charcoal-900 block truncate">
                                  {it.name}
                                </span>
                                <div className="flex items-baseline gap-1 text-[11px]">
                                  <span className="font-semibold text-charcoal-900">
                                    Qty: {it.quantity} × ₹{it.price}
                                  </span>
                                  <span className="text-charcoal-400 line-through">
                                    (MRP ₹{it.mrp})
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* 5. Wholesale Total Price (₹99 Model) */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-0.5">
                          <span className="font-serif font-bold text-charcoal-900 text-base block">
                            ₹{order.totalAmount}
                          </span>
                          <span className="text-[10px] text-charcoal-400 line-through block">
                            MRP ₹{order.totalMrp || order.itemCount * 349}
                          </span>
                          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
                            Wholesale ₹99/ea
                          </span>
                        </div>
                      </td>

                      {/* 6. Payment Method: Explicit COD or Online Badge */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1.5">
                          {order.paymentMethod === "COD" ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 shadow-xs">
                              <Banknote className="w-3.5 h-3.5 text-amber-700" />
                              <span>Cash on Delivery (COD)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 shadow-xs">
                              <CreditCard className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Online (Prepaid)</span>
                            </span>
                          )}

                          <div className="flex items-center gap-1 text-[11px] text-charcoal-600">
                            <span>Status:</span>
                            <span
                              className={`font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.2 rounded ${
                                order.paymentStatus === "PAID"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-50 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 7. Order Status Update Toggle */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-2">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(order.id, e.target.value as OrderStatus)
                            }
                            aria-label={`Update status for order ${order.id}`}
                            className={`text-xs font-semibold py-1.5 px-2.5 rounded border focus:outline-none transition-colors ${
                              order.status === "Delivered"
                                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                : order.status === "Shipped"
                                ? "bg-blue-50 border-blue-300 text-blue-800"
                                : order.status === "Cancelled"
                                ? "bg-red-50 border-red-300 text-red-800"
                                : "bg-amber-50 border-amber-300 text-amber-800"
                            }`}
                          >
                            <option value="Pending">⏳ Pending</option>
                            <option value="Shipped">🚚 Shipped</option>
                            <option value="Delivered">✓ Delivered</option>
                            <option value="Cancelled">✕ Cancelled</option>
                          </select>

                          {order.status === "Pending" && (
                            <button
                              onClick={() => handleStatusChange(order.id, "Shipped")}
                              className="text-[10px] uppercase font-semibold text-blue-700 hover:text-blue-900 block"
                            >
                              → Mark Dispatched
                            </button>
                          )}
                          {order.status === "Shipped" && (
                            <button
                              onClick={() => handleStatusChange(order.id, "Delivered")}
                              className="text-[10px] uppercase font-semibold text-emerald-700 hover:text-emerald-900 block"
                            >
                              → Mark Delivered (COD Paid)
                            </button>
                          )}
                        </div>
                      </td>

                      {/* 8. Actions */}
                      <td className="py-4 px-4 align-top text-right space-y-1">
                        <button
                          onClick={() => setSelectedOrderReceipt(order)}
                          className="p-1.5 text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-200 rounded transition-colors inline-block mr-1"
                          title="View & Print Packing Slip"
                        >
                          <Printer className="w-4 h-4 text-gold-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors inline-block"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Packaging Slip Modal */}
      {selectedOrderReceipt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white max-w-xl w-full p-6 sm:p-8 rounded border border-cream-300 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-cream-300">
              <div>
                <h3 className="font-serif text-xl font-bold text-charcoal-900">
                  Royal Jewelry Dispatch Manifest
                </h3>
                <span className="font-mono text-xs text-charcoal-600">
                  {selectedOrderReceipt.id} • Track: {selectedOrderReceipt.trackingNumber}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderReceipt(null)}
                className="p-1 text-charcoal-500 hover:text-charcoal-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-cream-50 rounded border border-cream-200 space-y-1">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-charcoal-500 block">
                  Delivery Destination
                </span>
                <p className="font-bold text-charcoal-900">{selectedOrderReceipt.customer?.fullName}</p>
                <p className="text-charcoal-700">{selectedOrderReceipt.customer?.phone}</p>
                <p className="text-charcoal-600">{selectedOrderReceipt.customer?.addressLine1}</p>
                {selectedOrderReceipt.customer?.addressLine2 && (
                  <p className="text-charcoal-600">{selectedOrderReceipt.customer.addressLine2}</p>
                )}
                {selectedOrderReceipt.customer?.landmark && (
                  <p className="text-charcoal-500 text-[11px]">Near {selectedOrderReceipt.customer.landmark}</p>
                )}
                <p className="font-semibold text-charcoal-900">
                  {selectedOrderReceipt.customer?.city}, {selectedOrderReceipt.customer?.state} - {selectedOrderReceipt.customer?.pincode}
                </p>
              </div>

              <div className="p-3 bg-cream-50 rounded border border-cream-200 space-y-1">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-charcoal-500 block">
                  Payment & Invoice
                </span>
                <p className="font-serif text-lg font-bold text-charcoal-900">
                  ₹{selectedOrderReceipt.totalAmount}
                </p>
                <p className="text-charcoal-700 font-semibold">
                  Method: {selectedOrderReceipt.paymentMethod === "COD" ? "Cash on Delivery" : "Online"}
                </p>
                <p className="text-charcoal-500 text-[11px]">
                  Payment Status: {selectedOrderReceipt.paymentStatus}
                </p>
                <p className="text-charcoal-500 text-[11px]">
                  Order Status: {selectedOrderReceipt.status}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-semibold uppercase tracking-wider text-[10px] text-charcoal-500 block">
                Manifest Items
              </span>
              <div className="divide-y divide-cream-200 border border-cream-200 rounded max-h-48 overflow-y-auto">
                {selectedOrderReceipt.items?.map((it, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={it.image} alt={it.name} className="w-8 h-8 rounded object-cover" />
                      <div>
                        <span className="font-medium text-charcoal-900 block">{it.name}</span>
                        <span className="text-[10px] text-charcoal-500">Qty: {it.quantity}</span>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-charcoal-900">
                      ₹{it.price * it.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-cream-300 flex items-center justify-end gap-3">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-charcoal-900 text-cream-100 text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-gold-400" />
                <span>Print Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
