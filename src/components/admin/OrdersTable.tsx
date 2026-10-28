"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export function OrdersTable() {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedOrderReceipt, setSelectedOrderReceipt] = useState<Order | null>(null);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const cleanSearch = search.trim().toLowerCase();
    const matchesSearch =
      !cleanSearch ||
      order.id.toLowerCase().includes(cleanSearch) ||
      order.customer.fullName.toLowerCase().includes(cleanSearch) ||
      order.customer.phone.toLowerCase().includes(cleanSearch) ||
      order.customer.city.toLowerCase().includes(cleanSearch);
    return matchesStatus && matchesSearch;
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
            placeholder="Search by Customer, Phone, City, or Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-cream-50 border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
          />
        </div>

        {/* Status Filters */}
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
              • Real-Time Synchronized Table
            </span>
          </div>
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
                  <th className="py-3 px-4">Order ID & Timestamp</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Shipping Destination</th>
                  <th className="py-3 px-4">Reserved Ornaments</th>
                  <th className="py-3 px-4">Wholesale Total</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status Update</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {filteredOrders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-cream-50/80 transition-colors">
                      {/* 1. Order ID & Timestamp */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-mono font-bold text-charcoal-900 block text-xs">
                          {order.id}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-charcoal-500 mt-1">
                          <Clock className="w-3 h-3 text-gold-600" />
                          <span suppressHydrationWarning>
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
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

                      {/* 2. Customer Name & Phone */}
                      <td className="py-4 px-4 align-top">
                        <span className="font-serif font-bold text-charcoal-900 block text-sm">
                          {order.customer.fullName}
                        </span>
                        <a
                          href={`tel:${order.customer.phone}`}
                          className="flex items-center gap-1.5 text-xs text-charcoal-700 hover:text-gold-600 mt-1 font-medium"
                        >
                          <Phone className="w-3 h-3 text-gold-600" />
                          <span>{order.customer.phone}</span>
                        </a>
                        {order.customer.email && (
                          <span className="text-[11px] text-charcoal-500 block mt-0.5 truncate max-w-[150px]">
                            {order.customer.email}
                          </span>
                        )}
                      </td>

                      {/* 3. Complete Delivery Address */}
                      <td className="py-4 px-4 align-top max-w-xs">
                        <div className="flex items-start gap-1.5 text-charcoal-800">
                          <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0 mt-0.5" />
                          <div className="space-y-0.5 leading-relaxed">
                            <p className="font-medium">{order.customer.addressLine1}</p>
                            {order.customer.addressLine2 && (
                              <p className="text-charcoal-600">{order.customer.addressLine2}</p>
                            )}
                            {order.customer.landmark && (
                              <p className="text-charcoal-500 text-[11px]">
                                Landmark: {order.customer.landmark}
                              </p>
                            )}
                            <p className="font-semibold text-charcoal-900">
                              {order.customer.city}, {order.customer.state} -{" "}
                              <span className="font-mono">{order.customer.pincode}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* 4. Product Details with Multi-Angle Previews */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-2 max-w-xs">
                          {order.items.map((it, idx) => (
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

                      {/* 5. Paid Price & Savings */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-0.5">
                          <span className="font-serif font-bold text-charcoal-900 text-sm block">
                            ₹{order.totalAmount}
                          </span>
                          <span className="text-[10px] text-charcoal-400 line-through block">
                            MRP ₹{order.totalMrp || order.itemCount * 349}
                          </span>
                          <span className="text-[10px] text-emerald-800 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 inline-block">
                            Saved ₹{order.totalSavings || order.itemCount * 250}
                          </span>
                        </div>
                      </td>

                      {/* 6. Payment Method & Status */}
                      <td className="py-4 px-4 align-top">
                        <div className="space-y-1">
                          {order.paymentMethod === "ONLINE" ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <CreditCard className="w-3 h-3" />
                              <span>Online (Prepaid)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <Banknote className="w-3 h-3" />
                              <span>Cash on Delivery</span>
                            </span>
                          )}

                          <span className="block text-[10px] text-charcoal-500">
                            Status: <strong>{order.paymentStatus}</strong>
                          </span>
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
                              → Mark Delivered
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
              <div className="bg-cream-50 p-3 rounded border border-cream-200">
                <span className="font-semibold uppercase text-charcoal-500 text-[10px] block">
                  Consignee / Destination
                </span>
                <p className="font-serif font-bold text-charcoal-900 text-sm mt-1">
                  {selectedOrderReceipt.customer.fullName}
                </p>
                <p className="text-charcoal-700">{selectedOrderReceipt.customer.addressLine1}</p>
                {selectedOrderReceipt.customer.addressLine2 && (
                  <p className="text-charcoal-700">{selectedOrderReceipt.customer.addressLine2}</p>
                )}
                <p className="text-charcoal-800 font-semibold">
                  {selectedOrderReceipt.customer.city}, {selectedOrderReceipt.customer.state} -{" "}
                  {selectedOrderReceipt.customer.pincode}
                </p>
                <p className="text-charcoal-600 mt-1">Phone: {selectedOrderReceipt.customer.phone}</p>
              </div>

              <div className="bg-cream-50 p-3 rounded border border-cream-200">
                <span className="font-semibold uppercase text-charcoal-500 text-[10px] block">
                  Wholesale Invoice Summary
                </span>
                <p className="text-charcoal-800 mt-1">
                  Payment Method: <strong>{selectedOrderReceipt.paymentMethod}</strong>
                </p>
                <p className="text-charcoal-800">
                  Order Status: <strong>{selectedOrderReceipt.status}</strong>
                </p>
                <p className="text-charcoal-800">
                  Total Collectable:{" "}
                  <strong className="text-charcoal-900 font-serif text-base">
                    ₹{selectedOrderReceipt.totalAmount}
                  </strong>
                </p>
                <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                  Total Wholesale Savings: ₹{selectedOrderReceipt.totalSavings || 0}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-charcoal-900">
                Items In Insured Velvet Box
              </h4>
              <div className="border border-cream-200 rounded divide-y divide-cream-100 text-xs">
                {selectedOrderReceipt.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={it.image} alt={it.name} className="w-8 h-8 object-cover rounded" />
                      <div>
                        <span className="font-serif font-medium text-charcoal-900 block">{it.name}</span>
                        <span className="text-[10px] text-charcoal-500">{it.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold block">
                        {it.quantity} × ₹{it.price} = ₹{it.quantity * it.price}
                      </span>
                      <span className="text-[10px] text-charcoal-400 line-through">
                        MRP ₹{it.quantity * it.mrp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-cream-200">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs uppercase font-semibold rounded flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Dispatch Slip</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
