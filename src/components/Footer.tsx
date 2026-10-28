"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-charcoal-900 text-cream-200 border-t border-charcoal-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-charcoal-800">
          {/* Column 1: Brand Philosophy */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl tracking-widest text-cream-100 font-bold">
                ATELIER 99
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold-400 font-medium">
                Royal Ornaments Vault
              </span>
            </div>
            <p className="text-xs text-cream-400 max-w-md leading-relaxed font-light">
              We believe royal ornamentation shouldn’t be burdened with traditional showroom markups.
              Our 25-piece archive of Ladies & Gents Royal Ornaments — from Kundan necklaces to heavy lion kadas — is offered at a special wholesale rate of ₹99 (MRP ₹349) with 5+ high-resolution perspectives per piece.
            </p>
            <div className="flex items-center gap-2 text-xs text-gold-400/90 pt-2">
              <Sparkles className="w-4 h-4 text-gold-400" />
              <span>Real-Time Cloud Synchronized Jewelry Engine</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-cream-100">
              The Archive
            </h4>
            <ul className="space-y-2 text-xs text-cream-400">
              <li>
                <a href="#catalog" className="hover:text-gold-400 transition-colors">
                  All ₹99 Creations
                </a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-gold-400 transition-colors">
                  Artisanal Provenance
                </a>
              </li>
              <li>
                <a href="#delivery" className="hover:text-gold-400 transition-colors">
                  Pan-India Dispatch Policy
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-gold-400 transition-colors">
                  FAQ & Care Instructions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Administration */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-cream-100">
              Management Portal
            </h4>
            <p className="text-xs text-cream-400 leading-relaxed font-light">
              Store administrators can manage stock, introduce new creations, and monitor live dispatches.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-300 py-1.5 px-3 rounded bg-charcoal-800 border border-charcoal-700 hover:border-gold-500/50 transition-all"
            >
              <span>Access Admin Console</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-cream-400 gap-4">
          <p>© {new Date().getFullYear()} Atelier 99 / The 99 Reserve. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Strictly Flat ₹99 Storewide
            </span>
            <span>•</span>
            <span>Next.js App Router & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
