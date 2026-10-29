"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import {
  X,
  CreditCard,
  Banknote,
  ShieldCheck,
  Lock,
  Loader2,
  Tag,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";
import { PaymentMethod, ShippingAddress, DEFAULT_MRP, DEFAULT_WHOLESALE_PRICE } from "@/types";

export function CheckoutModal() {
  const { isCheckoutOpen, setIsCheckoutOpen, checkoutItems, placeOrder } = useStore();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  if (!isCheckoutOpen || checkoutItems.length === 0) return null;

  const totalQuantity = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = checkoutItems.reduce(
    (sum, item) => sum + (item.product.price || DEFAULT_WHOLESALE_PRICE) * item.quantity,
    0
  );
  const totalMrp = checkoutItems.reduce(
    (sum, item) => sum + (item.product.mrp || DEFAULT_MRP) * item.quantity,
    0
  );
  const totalSavings = Math.max(0, totalMrp - totalAmount);

  const handleClose = () => {
    setIsCheckoutOpen(false);
  };

  const handleProductClick = (productId: string) => {
    handleClose();
    router.push(`/product/${productId}`);
  };

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

    try {
      await placeOrder(shippingInfo, checkoutItems, paymentMethod);
      // Reset form on success
      setFullName("");
      setPhone("");
      setEmail("");
      setAddressLine1("");
      setAddressLine2("");
      setLandmark("");
      setCity("");
      setState("");
      setPincode("");
      setIsCheckoutOpen(false);
    } catch (err) {
      console.error("Order submission error:", err);
      setFormError("Failed to register order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={handleClose}
    >
      {/* Centered Half-Screen Modal / Popup Box (roughly 60-70% height & width) */}
      <div
        className="relative bg-cream-100 w-full max-w-xl md:max-w-2xl max-h-[85vh] md:max-h-[75vh] flex flex-col rounded-lg border border-gold-400/40 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HALF-SCREEN CHECKOUT POPUP FORM */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-charcoal-900 text-cream-100 flex items-center justify-between border-b border-charcoal-800 shrink-0">
            <div>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gold-400" />
                <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold">
                  Royal Vault Quick Checkout
                </span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold mt-0.5">
                Complete Your Ornament Order
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-full bg-charcoal-800 text-cream-300 hover:text-white transition-colors"
              aria-label="Close checkout"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {formError}
                </div>
              )}

              {/* Section 1: Order Summary with Clickable Products */}
              <div className="bg-cream-200/80 p-3 sm:p-3.5 rounded border border-cream-300 space-y-2">
                <div className="flex items-center justify-between pb-1.5 border-b border-cream-300/80">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal-800">
                    Selected Items ({totalQuantity}) • Click to inspect
                  </span>
                  <span className="text-[11px] text-emerald-800 font-bold uppercase flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Save ₹{totalSavings}</span>
                  </span>
                </div>

                <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                  {checkoutItems.map((item) => {
                    const itemImg = item.product.images?.[0] || item.product.image;
                    return (
                      <div
                        key={item.product.id}
                        onClick={() => handleProductClick(item.product.id)}
                        className="flex items-center justify-between p-1.5 bg-white rounded border border-cream-200 hover:border-gold-400 transition-all cursor-pointer group"
                        title="Click to view product details"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <img
                            src={itemImg}
                            alt={item.product.name}
                            className="w-9 h-9 object-cover rounded border border-cream-300 shrink-0 group-hover:scale-105 transition-transform"
                          />
                          <div className="truncate text-left">
                            <span className="font-serif font-bold text-charcoal-900 text-xs block truncate group-hover:text-gold-700 underline-offset-2 group-hover:underline">
                              {item.product.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-charcoal-500">
                              <span>Qty: {item.quantity}</span>
                              <span>•</span>
                              <span className="text-gold-700 font-semibold">₹{item.product.price || DEFAULT_WHOLESALE_PRICE}</span>
                              <span className="line-through text-charcoal-400">MRP ₹{item.product.mrp || DEFAULT_MRP}</span>
                            </div>
                          </div>
                        </div>
                        <span className="font-serif font-bold text-charcoal-900 text-xs shrink-0 ml-2">
                          ₹{(item.product.price || DEFAULT_WHOLESALE_PRICE) * item.quantity}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-1.5 border-t border-cream-300/80 flex items-center justify-between text-xs font-semibold text-charcoal-900">
                  <span>Wholesale Total Payable</span>
                  <span className="font-serif text-sm font-bold text-gold-700">₹{totalAmount}</span>
                </div>
              </div>

              {/* Section 2: Delivery Details */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-300 pb-1">
                  1. Delivery Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharani Gayatri Singh"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      Mobile Number (for Courier & Tracking) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="House / Flat no., Apartment / Villa, Street / Road"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      Landmark / Area (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Near Raj Mandir Club, Civil Lines"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaipur"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      State & PIN Code *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="State"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="6-digit PIN"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Payment Method - Cash on Delivery Featured */}
              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-charcoal-900 border-b border-cream-300 pb-1">
                  2. Payment Method
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Option 1: Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod("COD")}
                    className={`p-3 rounded border-2 cursor-pointer transition-all ${
                      paymentMethod === "COD"
                        ? "border-charcoal-900 bg-cream-50 ring-1 ring-charcoal-900"
                        : "border-cream-300 bg-white hover:border-gold-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-gold-600" />
                        <span className="font-bold text-xs uppercase tracking-wider text-charcoal-900">
                          Cash on Delivery (COD)
                        </span>
                      </div>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "COD" ? "border-charcoal-900" : "border-cream-400"
                        }`}
                      >
                        {paymentMethod === "COD" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-charcoal-600 mt-1">
                      Pay cash or UPI scan at delivery. <strong>₹0 Extra Fee</strong>.
                    </p>
                  </div>

                  {/* Option 2: Instant Online */}
                  <div
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`p-3 rounded border-2 cursor-pointer transition-all ${
                      paymentMethod === "ONLINE"
                        ? "border-charcoal-900 bg-cream-50 ring-1 ring-charcoal-900"
                        : "border-cream-300 bg-white hover:border-gold-400"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-gold-600" />
                        <span className="font-bold text-xs uppercase tracking-wider text-charcoal-900">
                          Online Prepaid
                        </span>
                      </div>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          paymentMethod === "ONLINE" ? "border-charcoal-900" : "border-cream-400"
                        }`}
                      >
                        {paymentMethod === "ONLINE" && (
                          <div className="w-1.5 h-1.5 rounded-full bg-charcoal-900" />
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-charcoal-600 mt-1">
                      UPI, NetBanking, Credit/Debit Cards.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-cream-300 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs sm:text-sm font-semibold uppercase tracking-widest rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                      <span>Transmitting Order to Cloud Vault...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        Confirm Order • Pay ₹{totalAmount} ({paymentMethod === "COD" ? "Cash on Delivery" : "Online"})
                      </span>
                      <ArrowRight className="w-4 h-4 text-gold-400" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-3 text-[11px] text-charcoal-600">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                    <span>100% Insured Transit</span>
                  </div>
                  <span>•</span>
                  <span>⚡ Dispatched Within 12 Hours</span>
                </div>
              </div>
            </form>
          </div>
      </div>
    </div>
  );
}
