"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  FileText,
  Lock,
  ExternalLink,
} from "lucide-react";
import { PolicyModal, PolicyType } from "@/components/PolicyModal";

export function Footer() {
  const [activePolicyModal, setActivePolicyModal] = useState<PolicyType | null>(null);

  const openPolicy = (policy: PolicyType) => {
    setActivePolicyModal(policy);
  };

  return (
    <footer className="bg-charcoal-900 text-cream-200 border-t border-charcoal-800 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-charcoal-800">
          {/* Column 1: Brand & Wholesale Philosophy */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl tracking-widest text-cream-100 font-bold">
                BOLERA
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400 font-bold -mt-0.5">
                Har Ek Maal ₹99
              </span>
            </div>
            <p className="text-xs text-cream-400 leading-relaxed font-light">
              Democratizing ultra-luxury lifestyle and jewelry adornment. Every single creation in our store is universally priced at flat <strong>₹99</strong> (benchmark retail MRP ₹349) with insured 12-hour express dispatch and Cash on Delivery.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-gold-400">
              <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
              <span>Bolera Universal ₹99 Wholesale Architecture</span>
            </div>
          </div>

          {/* Column 2: Flagship Business & Store Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-cream-100 pb-1 border-b border-charcoal-800">
              Bolera Store Flagship
            </h4>
            <div className="space-y-2.5 text-xs text-cream-400 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-cream-100 block font-medium">Bolera Flagship Studio</strong>
                  <p>Heritage Palace Arcade, Suite 402</p>
                  <p>Mirza Ismail (M.I.) Road, Civil Lines</p>
                  <p>Jaipur, Rajasthan 302001, India</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Mon – Sat: 10:00 AM – 8:00 PM IST</span>
              </div>
            </div>
          </div>

          {/* Column 3: Concierge & Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-cream-100 pb-1 border-b border-charcoal-800">
              Customer Concierge Desk
            </h4>
            <div className="space-y-2.5 text-xs text-cream-400 font-light">
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href="tel:+919829014810"
                    className="hover:text-gold-400 transition-colors font-medium text-cream-100 block"
                  >
                    +91 98290 14810
                  </a>
                  <span className="text-[11px] text-cream-400">WhatsApp & Direct Call Assistance</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <div>
                  <a
                    href="mailto:support@bolera.store99.com"
                    className="hover:text-gold-400 transition-colors font-medium text-cream-100 block"
                  >
                    support@bolera.store99.com
                  </a>
                  <span className="text-[11px] text-cream-400">Order & Dispatch Inquiries</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wider text-gold-400 py-1.5 px-3 rounded bg-charcoal-800 border border-charcoal-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
                  <span>100% Insured Pan-India Courier Transit</span>
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: Essential Legal & Consumer Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-cream-100 pb-1 border-b border-charcoal-800">
              Trust & Legal Policies
            </h4>
            <ul className="space-y-2 text-xs text-cream-400">
              <li>
                <button
                  onClick={() => openPolicy("shipping")}
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Truck className="w-3.5 h-3.5 text-gold-600" />
                  <span>Shipping & COD Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy("returns")}
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gold-600" />
                  <span>7-Day Return & Replacement</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy("privacy")}
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Lock className="w-3.5 h-3.5 text-gold-600" />
                  <span>Privacy Policy & Data Shield</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicy("terms")}
                  className="hover:text-gold-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-gold-600" />
                  <span>Terms of Wholesale Service</span>
                </button>
              </li>
            </ul>

            <div className="pt-2 p-3 bg-charcoal-850 rounded border border-charcoal-800 text-[11px] text-cream-400">
              <span className="text-gold-400 font-semibold block">Pan-India Transit:</span>
              <span>100% Insured courier transit with wax seal verification.</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 gap-4">
          <p>© {new Date().getFullYear()} Bolera • Har Ek Maal ₹99 Flat Store. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
            <button onClick={() => openPolicy("shipping")} className="hover:text-white">Shipping</button>
            <span>•</span>
            <button onClick={() => openPolicy("returns")} className="hover:text-white">Returns</button>
            <span>•</span>
            <button onClick={() => openPolicy("privacy")} className="hover:text-white">Privacy</button>
            <span>•</span>
            <button onClick={() => openPolicy("terms")} className="hover:text-white">Terms</button>
            <span>•</span>
            <span className="text-gold-400 font-semibold">Strictly Flat ₹99 Wholesale</span>
          </div>
        </div>
      </div>

      {/* Interactive Policy Modal */}
      {activePolicyModal && (
        <PolicyModal
          isOpen={true}
          onClose={() => setActivePolicyModal(null)}
          initialPolicy={activePolicyModal}
        />
      )}
    </footer>
  );
}
