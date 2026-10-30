"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Truck, RotateCcw, FileText, Lock, CheckCircle2, Printer } from "lucide-react";

export type PolicyType = "shipping" | "returns" | "privacy" | "terms";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPolicy?: PolicyType;
}

export function PolicyModal({ isOpen, onClose, initialPolicy = "shipping" }: PolicyModalProps) {
  const [activePolicy, setActivePolicy] = useState<PolicyType>(initialPolicy);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-cream-100 w-full max-w-3xl rounded-3xl border border-gold-400/30 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-charcoal-900 text-cream-100 flex items-center justify-between border-b border-charcoal-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold">
                Bolera Trust & Legal Assurance
              </span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold mt-1">
              Store Policies & Consumer Protections
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-charcoal-800 text-cream-300 hover:text-white transition-colors"
            aria-label="Close policies"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-cream-200/80 border-b border-cream-300 px-4 sm:px-6 pt-3 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          <button
            onClick={() => setActivePolicy("shipping")}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
              activePolicy === "shipping"
                ? "border-charcoal-900 text-charcoal-900"
                : "border-transparent text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-gold-600" />
            <span>Shipping Policy</span>
          </button>

          <button
            onClick={() => setActivePolicy("returns")}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
              activePolicy === "returns"
                ? "border-charcoal-900 text-charcoal-900"
                : "border-transparent text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-gold-600" />
            <span>Returns & Exchanges</span>
          </button>

          <button
            onClick={() => setActivePolicy("privacy")}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
              activePolicy === "privacy"
                ? "border-charcoal-900 text-charcoal-900"
                : "border-transparent text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-gold-600" />
            <span>Privacy Policy</span>
          </button>

          <button
            onClick={() => setActivePolicy("terms")}
            className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap ${
              activePolicy === "terms"
                ? "border-charcoal-900 text-charcoal-900"
                : "border-transparent text-charcoal-600 hover:text-charcoal-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-gold-600" />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Policy Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-charcoal-700 leading-relaxed">
          {/* 1. SHIPPING POLICY */}
          {activePolicy === "shipping" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-cream-300">
                <Truck className="w-5 h-5 text-gold-700" />
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  Pan-India Insured Transit & Packaging Protocol
                </h3>
              </div>
              <p>
                At <strong>Bolera</strong>, each ornament and lifestyle article is prepared inside an individual velvet-cushioned protective gift case, hermetically wrapped in water-resistant shielding, and dispatched within 12 hours.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-white rounded border border-cream-300 space-y-1">
                  <span className="font-semibold text-charcoal-900 block text-xs uppercase tracking-wider">
                    Dispatch Window
                  </span>
                  <p className="text-xs text-charcoal-600">
                    All orders (both Cash on Delivery and Online Prepaid) are dispatched within <strong>24 business hours</strong> directly from our Jaipur Vault Archive.
                  </p>
                </div>
                <div className="p-3 bg-white rounded border border-cream-300 space-y-1">
                  <span className="font-semibold text-charcoal-900 block text-xs uppercase tracking-wider">
                    Courier Carriers
                  </span>
                  <p className="text-xs text-charcoal-600">
                    Delivered via priority express logistics (BlueDart, Delhivery Air Express, SpeedPost) with real-time SMS tracking updates.
                  </p>
                </div>
                <div className="p-3 bg-white rounded border border-cream-300 space-y-1">
                  <span className="font-semibold text-charcoal-900 block text-xs uppercase tracking-wider">
                    Cash on Delivery (COD)
                  </span>
                  <p className="text-xs text-charcoal-600">
                    COD is accessible across 19,000+ Indian PIN codes at <strong>₹0 extra surcharge</strong>. Pay cash or UPI scan directly to the courier executive.
                  </p>
                </div>
                <div className="p-3 bg-white rounded border border-cream-300 space-y-1">
                  <span className="font-semibold text-charcoal-900 block text-xs uppercase tracking-wider">
                    Full Transit Insurance
                  </span>
                  <p className="text-xs text-charcoal-600">
                    100% covered against transit damage, package theft, or courier loss until doorstep handoff.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. RETURNS & EXCHANGES */}
          {activePolicy === "returns" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-cream-300">
                <RotateCcw className="w-5 h-5 text-gold-700" />
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  7-Day Royal Guarantee & Hassle-Free Replacement
                </h3>
              </div>
              <p>
                We stand with uncompromising pride behind our wholesale craftsmanship. If your ornament arrives with any stone setting defect, transit blemish, or sizing incompatibility, we offer an effortless <strong>7-day door replacement warranty</strong>.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 bg-white rounded border border-cream-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-charcoal-900 block text-xs">Free Doorstep Pickup:</strong>
                    <span className="text-xs text-charcoal-600">
                      Our courier partner arranges doorstep pickup from your registered delivery address at zero return shipping expense to you.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 bg-white rounded border border-cream-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-charcoal-900 block text-xs">Instant Replacement or Refund:</strong>
                    <span className="text-xs text-charcoal-600">
                      Choose either an immediate replacement piece dispatched express within 24 hours or a full refund back to your original source / UPI.
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 p-3 bg-white rounded border border-cream-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-charcoal-900 block text-xs">Simple Notification:</strong>
                    <span className="text-xs text-charcoal-600">
                      Simply message our concierge desk at <code>support@bolera.store99.com</code> or WhatsApp <code>+91 98290 14810</code> with your Order ID.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. PRIVACY POLICY */}
          {activePolicy === "privacy" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-cream-300">
                <Lock className="w-5 h-5 text-gold-700" />
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  Bank-Grade Encryption & Discretion Assurance
                </h3>
              </div>
              <p>
                Your privacy is regarded as sacred. Bolera complies strictly with the Digital Personal Data Protection Act (DPDPA) and international consumer safety protocols.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-xs text-charcoal-700">
                <li>
                  <strong>Zero Third-Party Sharing:</strong> We do not sell, rent, or trade your telephone number, full delivery address, or purchase history to marketing networks or brokers.
                </li>
                <li>
                  <strong>Encrypted Payment Gateways:</strong> Prepaid transactions are routed through PCI-DSS Level 1 compliant gateways with 256-bit SSL encryption. We never store credit/debit card numbers.
                </li>
                <li>
                  <strong>Discreet Billing & Packaging:</strong> Outer dispatch packages feature discreet labeling without bold jewelry declarations to protect your purchase during transit.
                </li>
                <li>
                  <strong>Right to Deletion:</strong> You may request complete erasure of your shipping address records by emailing our data officer at <code>privacy@bolera.store99.com</code>.
                </li>
              </ul>
            </div>
          )}

          {/* 4. TERMS OF SERVICE */}
          {activePolicy === "terms" && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center gap-2 pb-2 border-b border-cream-300">
                <FileText className="w-5 h-5 text-gold-700" />
                <h3 className="font-serif text-lg font-bold text-charcoal-900">
                  Artisanal Wholesale Commitment & Terms of Service
                </h3>
              </div>
              <p>
                By placing an order on Bolera (Har Ek Maal ₹99), you agree to the following transparent commercial agreements:
              </p>
              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 bg-white rounded border border-cream-300 space-y-1">
                  <span className="font-semibold text-charcoal-900 uppercase tracking-wider text-[11px] block">
                    1. Fixed Wholesale Flat ₹99 Pricing
                  </span>
                  <p className="text-charcoal-600 leading-relaxed">
                    Every article listed in the vault carries an authentic benchmark retail MRP of ₹349 and is exclusively provided at ₹99 wholesale to direct retail patrons without showroom intermediary surcharges.
                  </p>
                </div>

                <div className="p-3 bg-white rounded border border-cream-300 space-y-1">
                  <span className="font-semibold text-charcoal-900 uppercase tracking-wider text-[11px] block">
                    2. Artisanal Craft & Hypoallergenic Plating
                  </span>
                  <p className="text-charcoal-600 leading-relaxed">
                    Our ornaments feature 24K yellow gold and 18K rose gold micro-plating over high-grade brass and lead-free alloy, crowned with precision-cut zircon, synthetic polki kundan, and cultured faux pearls.
                  </p>
                </div>

                <div className="p-3 bg-white rounded border border-cream-300 space-y-1">
                  <span className="font-semibold text-charcoal-900 uppercase tracking-wider text-[11px] block">
                    3. Genuine Order Placements
                  </span>
                  <p className="text-charcoal-600 leading-relaxed">
                    Cash on Delivery orders are registered with customer telephone verification. Customers are encouraged to provide accurate mobile coordinates for seamless OTP courier handoffs.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-cream-200/90 border-t border-cream-300 flex items-center justify-between shrink-0">
          <span className="text-xs text-charcoal-600 hidden sm:inline">
            Questions? Contact <strong>+91 98290 14810</strong> (Jaipur Vault)
          </span>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white hover:bg-cream-100 text-charcoal-800 text-xs font-semibold uppercase tracking-wider rounded-xl border border-cream-300 flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5 text-gold-600" />
              <span>Print Policy</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold uppercase tracking-wider rounded-xl shadow-md transition-all"
            >
              I Understand & Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

