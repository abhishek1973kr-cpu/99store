"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { useStore } from "@/context/StoreContext";
import { CheckCircle2, Printer, ArrowRight, Package, Tag, Clock } from "lucide-react";

export function OrderSuccessModal() {
  const { isOrderSuccessOpen, setIsOrderSuccessOpen, lastPlacedOrder } = useStore();

  useEffect(() => {
    if (isOrderSuccessOpen) {
      try {
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C5A880", "#1A1A1A", "#E8E4DA", "#B8966C"],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [isOrderSuccessOpen]);

  if (!isOrderSuccessOpen || !lastPlacedOrder) return null;

  const order = lastPlacedOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-cream-100 w-full max-w-2xl rounded-sm border border-cream-300 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Success Banner */}
        <div className="bg-charcoal-900 text-cream-100 p-8 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-gold-400/20 text-gold-400 mx-auto flex items-center justify-center mb-4 border border-gold-400/40">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-400 font-semibold block mb-1">
            Exclusive Vault Dispatch Registered
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Order Successfully Confirmed!
          </h2>
          <p className="text-xs sm:text-sm text-cream-300 mt-2 font-light max-w-md mx-auto">
            Thank you, <span className="text-white font-medium">{order.customer.fullName}</span>. Your order is registered for express dispatch. Order ID:{" "}
            <span className="text-gold-300 font-mono font-semibold">{order.id}</span>
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Status & Method Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-cream-200/60 p-3.5 rounded border border-cream-300">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500 block">Status</span>
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-0.5 border border-emerald-100">
                {order.status}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500 block">Payment</span>
              <span className="font-semibold text-charcoal-800 inline-block mt-0.5">
                {order.paymentMethod === "ONLINE" ? "Instant Online (Paid)" : "Cash On Delivery"}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500 block">Paid Amount</span>
              <span className="font-serif font-bold text-charcoal-900 inline-block mt-0.5 text-sm">
                ₹{order.totalAmount}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500 block">Tracking ID</span>
              <span className="font-mono text-charcoal-800 font-semibold inline-block mt-0.5 text-[11px]">
                {order.trackingNumber}
              </span>
            </div>
          </div>

          {/* Savings Badge */}
          {order.totalSavings > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded flex items-center justify-between text-xs text-emerald-900">
              <span className="flex items-center gap-1.5 font-medium">
                <Tag className="w-4 h-4 text-emerald-700" />
                <span>Wholesale Special Deal Applied (MRP: ₹{order.totalMrp})</span>
              </span>
              <span className="font-bold text-emerald-800 font-serif text-sm">
                Saved ₹{order.totalSavings}
              </span>
            </div>
          )}

          {/* Delivery Destination */}
          <div className="border border-cream-300 rounded p-4 bg-white space-y-1 text-xs">
            <h4 className="font-semibold text-charcoal-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-gold-600" />
              <span>Insured Delivery Destination</span>
            </h4>
            <p className="font-serif font-bold text-charcoal-900 text-sm">{order.customer.fullName}</p>
            <p className="text-charcoal-700">{order.customer.addressLine1}</p>
            {order.customer.addressLine2 && <p className="text-charcoal-700">{order.customer.addressLine2}</p>}
            {order.customer.landmark && <p className="text-charcoal-500">Landmark: {order.customer.landmark}</p>}
            <p className="text-charcoal-700">
              {order.customer.city}, {order.customer.state} - {order.customer.pincode}
            </p>
            <p className="text-charcoal-600 pt-1">Contact: {order.customer.phone}</p>
          </div>

          {/* Ordered Articles with Wholesale vs MRP Preview */}
          <div className="space-y-3">
            <h4 className="font-semibold text-charcoal-900 uppercase tracking-wider text-[11px]">
              Reserved Ornaments ({order.itemCount} pieces)
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-xs p-2.5 rounded bg-white border border-cream-200"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded border border-cream-300"
                    />
                    <div>
                      <p className="font-serif font-bold text-charcoal-900 line-clamp-1">{item.name}</p>
                      <p className="text-charcoal-500 text-[11px]">
                        Qty: {item.quantity} × ₹{item.price} (Wholesale)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-serif font-bold text-charcoal-900">
                      ₹{item.quantity * item.price}
                    </span>
                    <span className="block text-[10px] text-charcoal-400 line-through">
                      MRP ₹{item.quantity * item.mrp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-cream-300 space-y-3">
            <div className="bg-gold-400/10 border border-gold-400/30 p-3.5 rounded flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-gold-400/20 text-gold-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-gold-600" />
              </div>
              <div>
                <p className="font-semibold text-charcoal-900">
                  ⚡ Fast Priority Dispatch Within 12 Hours
                </p>
                <p className="text-charcoal-600 text-[11px] mt-0.5">
                  Your royal ornaments will be packaged in velvet protective casing and handed over for insured express transit.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 py-3 px-4 bg-cream-200 hover:bg-cream-300 text-charcoal-900 text-xs uppercase tracking-wider font-semibold rounded border border-cream-300 flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4 text-charcoal-700" />
                <span>Print Packaging Slip</span>
              </button>

              <button
                onClick={() => setIsOrderSuccessOpen(false)}
                className="flex-1 py-3 px-4 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs uppercase tracking-wider font-semibold rounded flex items-center justify-center gap-2 transition-colors"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
