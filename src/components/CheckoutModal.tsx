"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { X, CreditCard, Banknote, ShieldCheck, Lock, Loader2, Tag } from "lucide-react";
import { PaymentMethod, ShippingAddress, DEFAULT_MRP, DEFAULT_WHOLESALE_PRICE } from "@/types";

export function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, checkoutItems, placeOrder } = useStore();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ONLINE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isCheckoutOpen || checkoutItems.length === 0) return null;

  const totalQuantity = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = checkoutItems.reduce((sum, item) => sum + (item.product.price || DEFAULT_WHOLESALE_PRICE) * item.quantity, 0);
  const totalMrp = checkoutItems.reduce((sum, item) => sum + (item.product.mrp || DEFAULT_MRP) * item.quantity, 0);
  const totalSavings = Math.max(0, totalMrp - totalAmount);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!fullName.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setFormError("Please provide a valid 10-digit mobile number.");
      return;
    }
    if (!addressLine1.trim()) {
      setFormError("Please enter your delivery street address.");
      return;
    }
    if (!city.trim() || !state.trim()) {
      setFormError("Please enter your city and state.");
      return;
    }
    if (!pincode.trim() || pincode.replace(/\D/g, "").length !== 6) {
      setFormError("Please enter a valid 6-digit PIN code.");
      return;
    }

    setIsSubmitting(true);

    const shippingInfo: ShippingAddress = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim() || `${fullName.toLowerCase().replace(/\s+/g, "")}@ornaments.store99.com`,
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      landmark: landmark.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    };

    setTimeout(() => {
      placeOrder(shippingInfo, checkoutItems, paymentMethod);
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-cream-100 w-full max-w-3xl rounded-sm border border-cream-300 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-charcoal-900 text-cream-100 flex items-center justify-between border-b border-charcoal-800">
          <div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gold-400" />
              <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold">
                Encrypted Royal Vault Checkout
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1">
              Finalize Your Exclusive Ornaments Order
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full bg-charcoal-800 text-cream-300 hover:text-white transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-8">
          {formError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
              {formError}
            </div>
          )}

          {/* Section 1: Order Summary Preview with MRP vs Wholesale Savings */}
          <div className="bg-cream-200/80 p-4 rounded border border-cream-300 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-cream-300/80">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-800">
                Selected Ornaments ({totalQuantity} {totalQuantity === 1 ? "piece" : "pieces"})
              </span>
              <span className="text-xs text-emerald-800 font-bold uppercase flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                <span>You Save ₹{totalSavings}</span>
              </span>
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
              {checkoutItems.map((item) => {
                const itemImg = item.product.images?.[0] || item.product.image;
                return (
                  <div key={item.product.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={itemImg}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded border border-cream-300 shrink-0"
                      />
                      <div>
                        <span className="font-serif font-bold text-charcoal-900 line-clamp-1">
                          {item.product.name}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-charcoal-500">
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span className="text-gold-700 font-medium">{item.product.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-baseline gap-1.5 justify-end">
                        <span className="font-serif font-bold text-charcoal-900 text-sm">
                          ₹{item.quantity * item.product.price}
                        </span>
                        <span className="text-charcoal-400 line-through text-[11px]">
                          ₹{item.quantity * item.product.mrp}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-medium">
                        Wholesale Rate
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-cream-300/80 flex justify-between items-center text-sm">
              <div>
                <span className="text-xs text-charcoal-600 block">Total MRP Value: ₹{totalMrp}</span>
                <span className="font-medium text-charcoal-900">Total Payable Amount:</span>
              </div>
              <span className="font-serif text-2xl font-bold text-charcoal-900">
                ₹{totalAmount}
              </span>
            </div>
          </div>

          {/* Section 2: Delivery & Contact Details */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-charcoal-900 border-b border-cream-300 pb-2">
              1. Delivery & Contact Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Full Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharani Gayatri Singh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Mobile Number (for SMS Tracking & Courier) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Email Address (Optional - For tracking slip)
                </label>
                <input
                  type="email"
                  placeholder="e.g. name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Complete Street Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="House / Flat number, Villa / Apartment name, Street / Road"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Address Line 2 (Apartment, suite, unit, etc. - Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2nd Floor, Civil Lines"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Raj Mandir Club"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 302001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jaipur"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajasthan"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-charcoal-900 border-b border-cream-300 pb-2">
              2. Select Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Instant Online Payment */}
              <div
                onClick={() => setPaymentMethod("ONLINE")}
                className={`p-4 rounded border-2 cursor-pointer transition-all ${
                  paymentMethod === "ONLINE"
                    ? "border-charcoal-900 bg-cream-50 ring-1 ring-charcoal-900"
                    : "border-cream-300 bg-white hover:border-gold-400"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gold-600" />
                    <span className="font-semibold text-xs uppercase tracking-wider text-charcoal-900">
                      Online Payment (Instant)
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === "ONLINE" ? "border-charcoal-900" : "border-cream-400"
                    }`}
                  >
                    {paymentMethod === "ONLINE" && (
                      <div className="w-2 h-2 rounded-full bg-charcoal-900" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-charcoal-600">
                  Instant UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, NetBanking.
                </p>
                <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                  Zero Processing Surcharge
                </span>
              </div>

              {/* Option B: Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod("COD")}
                className={`p-4 rounded border-2 cursor-pointer transition-all ${
                  paymentMethod === "COD"
                    ? "border-charcoal-900 bg-cream-50 ring-1 ring-charcoal-900"
                    : "border-cream-300 bg-white hover:border-gold-400"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-gold-600" />
                    <span className="font-semibold text-xs uppercase tracking-wider text-charcoal-900">
                      Cash on Delivery (COD)
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === "COD" ? "border-charcoal-900" : "border-cream-400"
                    }`}
                  >
                    {paymentMethod === "COD" && (
                      <div className="w-2 h-2 rounded-full bg-charcoal-900" />
                    )}
                  </div>
                </div>
                <p className="text-xs text-charcoal-600">
                  Pay cash or UPI scan to courier agent upon doorstep jewelry delivery.
                </p>
                <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-charcoal-700 bg-cream-200 px-2 py-0.5 rounded font-medium">
                  Insured Tamper-Proof Box
                </span>
              </div>
            </div>
          </div>

          {/* Submission and Safety Footer */}
          <div className="pt-4 border-t border-cream-300 space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs sm:text-sm font-semibold uppercase tracking-widest rounded shadow-classic hover:shadow-classic-hover transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                  <span>Authorizing Order & Syncing Live Vault...</span>
                </>
              ) : (
                <>
                  <span>
                    Place Order • Pay ₹{totalAmount} ({paymentMethod === "ONLINE" ? "Instant Online" : "Cash on Delivery"})
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-charcoal-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-600" />
                <span>Immediate Live Sync with Admin Portal</span>
              </div>
              <span>•</span>
              <span>Wholesale Pricing Guaranteed</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
