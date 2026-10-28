"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Lock, User, Key, Eye, EyeOff, ShieldCheck, ArrowLeft, Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("1234");
  const [password, setPassword] = useState("4321");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const doLogin = (userVal: string, passVal: string) => {
    setError("");
    const u = userVal.trim();
    const p = passVal.trim();

    if (u === "1234" && p === "4321") {
      setIsLoading(true);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("the_99_ornaments_admin_auth", "true");
          sessionStorage.setItem("the_99_ornaments_admin_auth", "true");
          document.cookie = "the_99_ornaments_admin_auth=true; path=/; max-age=86400";
        } catch (e) {
          console.warn("Storage restricted", e);
        }
      }
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess();
      }, 200);
    } else {
      setIsLoading(false);
      setError("Invalid Vault Credentials. Use Username: 1234 and Password: 4321");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin(username, password);
  };

  const handleInstantLogin = () => {
    setUsername("1234");
    setPassword("4321");
    doLogin("1234", "4321");
  };

  return (
    <div className="min-h-screen bg-charcoal-900 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient gold radial glow & background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C5A880_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Centered Card */}
      <div className="relative w-full max-w-md bg-cream-100/95 backdrop-blur-md rounded border border-gold-400/40 shadow-2xl overflow-hidden z-10 animate-fadeIn">
        {/* Top Gold Trim Accent Line */}
        <div className="h-1.5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />

        {/* Card Header */}
        <div className="p-8 pb-4 text-center">
          <div className="w-14 h-14 mx-auto rounded-full bg-charcoal-900 text-gold-400 flex items-center justify-center border border-gold-400/40 shadow-md mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold tracking-wider text-charcoal-900">
              ATELIER 99
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-gold-600 font-semibold -mt-0.5">
              Royal Ornaments Vault
            </span>
          </div>

          <h2 className="font-serif text-lg font-bold text-charcoal-900 mt-4">
            Admin Console Access
          </h2>
          <p className="text-xs text-charcoal-600 font-light mt-1 max-w-xs mx-auto">
            Restricted portal for 25-piece ornaments inventory CRUD, wholesale pricing, and live customer orders.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1.5">
              Vault Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
              <input
                type="text"
                required
                placeholder="Enter username (1234)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1.5">
              Secret Passkey
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password (4321)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal-900"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Preset Fill Helper Pill */}
          <div className="bg-cream-200/80 p-3 rounded border border-cream-300/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-charcoal-600 block">
                Standard Vault Credentials
              </span>
              <span className="font-mono text-charcoal-900 text-xs">
                User: <strong>1234</strong> | Pass: <strong>4321</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleInstantLogin}
              className="text-[11px] font-bold text-gold-700 hover:text-gold-900 bg-gold-400/20 px-2.5 py-1 rounded border border-gold-400/40 uppercase tracking-wider"
            >
              1-Click Enter
            </button>
          </div>

          {/* 1-Click Fast Access Button */}
          <button
            type="button"
            onClick={handleInstantLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-gold-400 hover:bg-gold-500 text-charcoal-900 text-xs font-bold uppercase tracking-wider rounded border border-gold-500 shadow transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-charcoal-900" />
            <span>Instant One-Click Admin Unlock</span>
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs sm:text-sm font-semibold uppercase tracking-widest rounded shadow-classic hover:shadow-classic-hover transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold-400" />
                <span>Verifying Vault Security...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-gold-400" />
                <span>Unlock Vault Console</span>
              </>
            )}
          </button>
        </form>

        {/* Card Footer: Back to Storefront */}
        <div className="p-4 bg-cream-200/50 border-t border-cream-300 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-charcoal-700 hover:text-gold-700 transition-colors uppercase tracking-wider font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Storefront</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

