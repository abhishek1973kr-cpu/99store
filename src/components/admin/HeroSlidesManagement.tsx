"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";
import { HeroSlide } from "@/types";
import { DEFAULT_HERO_SLIDES } from "@/data/initialData";
import {
  Sparkles,
  Save,
  RotateCcw,
  Image as ImageIcon,
  CheckCircle,
  ExternalLink,
  Layers,
  Crown,
  Eye,
} from "lucide-react";

// Curated luxury presets for instant selection
const LUXURY_PRESETS = [
  {
    name: "Ladies Kundan Haar",
    url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1920&q=80",
    category: "Ladies",
  },
  {
    name: "Ladies Polki Choker",
    url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=80",
    category: "Ladies",
  },
  {
    name: "Ladies Victorian Ring",
    url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1920&q=80",
    category: "Ladies",
  },
  {
    name: "Gents Lion Kada",
    url: "https://images.unsplash.com/photo-1611591475152-478311396060?auto=format&fit=crop&w=1920&q=80",
    category: "Gents",
  },
  {
    name: "Gents Signet Ring",
    url: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1920&q=80",
    category: "Gents",
  },
  {
    name: "Wholesale Gold Vault",
    url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1920&q=80",
    category: "Wholesale",
  },
];

export function HeroSlidesManagement() {
  const { heroSlides, updateHeroSlides, resetHeroSlides } = useStore();
  const [slides, setSlides] = useState<HeroSlide[]>(heroSlides && heroSlides.length > 0 ? heroSlides : DEFAULT_HERO_SLIDES);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (heroSlides && heroSlides.length > 0) {
      setSlides(heroSlides);
    }
  }, [heroSlides]);

  const handleFieldChange = (index: number, field: keyof HeroSlide, value: string) => {
    setSlides((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      await updateHeroSlides(slides);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to save hero slides:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (confirm("Restore original 3 default luxury ornament background images?")) {
      setIsSaving(true);
      await resetHeroSlides();
      setSlides(DEFAULT_HERO_SLIDES);
      setIsSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded border border-cream-300 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded bg-gold-400/20 text-gold-700">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
              Hero Background Slider Settings
            </h2>
          </div>
          <p className="text-xs text-charcoal-600 mt-1 max-w-2xl">
            Configure the 3 smooth-animating background images showcased at the top of the store.
            Display luxury Ladies & Gents ornaments with custom badges, titles, and high-resolution visuals.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleReset}
            disabled={isSaving}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded border border-cream-300 hover:border-cream-400 bg-cream-100 text-charcoal-700 hover:text-charcoal-900 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-gold-400" />
            )}
            <span>Save All Slides</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs">
            <strong className="font-semibold block">Hero Slides Live Updated!</strong>
            The 3 background ornament images and text have been synced across all public storefront devices.
          </div>
        </div>
      )}

      {/* 3 Slide Cards Grid */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {slides.map((slide, index) => {
            const slideNumber = index + 1;
            const isLadies = index === 0;
            const isGents = index === 1;

            return (
              <div
                key={slide.id || index}
                className="bg-white rounded border border-cream-300 shadow-sm overflow-hidden flex flex-col"
              >
                {/* Card Header Bar */}
                <div className="bg-cream-100 p-3.5 border-b border-cream-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-charcoal-900 text-gold-400 text-xs font-bold flex items-center justify-center font-mono">
                      {slideNumber}
                    </span>
                    <span className="font-serif font-bold text-sm text-charcoal-900">
                      {isLadies
                        ? "Slide 1: Ladies Ornaments"
                        : isGents
                        ? "Slide 2: Gents Ornaments"
                        : "Slide 3: Wholesale ₹99 Offer"}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-700 bg-gold-400/20 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>

                {/* Live Image Preview */}
                <div className="relative h-44 bg-charcoal-900 overflow-hidden group">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-transparent to-transparent flex items-end p-3">
                    <div className="text-white">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gold-400 block">
                        {slide.badge || "Hero Badge"}
                      </span>
                      <p className="text-xs font-semibold truncate max-w-xs">{slide.title}</p>
                    </div>
                  </div>
                </div>

                {/* Editable Inputs */}
                <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Image URL Input */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                        High-Res Image URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={slide.imageUrl}
                        onChange={(e) => handleFieldChange(index, "imageUrl", e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded text-charcoal-900 focus:outline-none focus:border-gold-500 focus:bg-white font-mono"
                      />
                    </div>

                    {/* Quick Preset Selector */}
                    <div>
                      <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block mb-1">
                        Or Pick Preset Jewelry Image:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {LUXURY_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleFieldChange(index, "imageUrl", preset.url)}
                            className="text-[10px] px-2 py-0.5 rounded bg-cream-200 hover:bg-gold-400/20 text-charcoal-750 border border-cream-300 transition-colors"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Badge Tag Input */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                        Hero Slide Badge
                      </label>
                      <input
                        type="text"
                        value={slide.badge}
                        onChange={(e) => handleFieldChange(index, "badge", e.target.value)}
                        placeholder="e.g. Ladies Royal Ornaments"
                        className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded text-charcoal-900 focus:outline-none focus:border-gold-500 focus:bg-white"
                      />
                    </div>

                    {/* Slide Title Input */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                        Headline Title
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => handleFieldChange(index, "title", e.target.value)}
                        placeholder="e.g. Royal Ladies Kundan & Polki Haar"
                        className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded text-charcoal-900 focus:outline-none focus:border-gold-500 focus:bg-white font-serif font-bold"
                      />
                    </div>

                    {/* Slide Subtitle Input */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-charcoal-700 mb-1">
                        Subtitle / Description
                      </label>
                      <textarea
                        rows={2}
                        value={slide.subtitle}
                        onChange={(e) => handleFieldChange(index, "subtitle", e.target.value)}
                        placeholder="Describe the ornaments, craftsmanship, and ₹99 wholesale pledge..."
                        className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded text-charcoal-900 focus:outline-none focus:border-gold-500 focus:bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Save Bar */}
        <div className="bg-white p-4 rounded border border-cream-300 shadow-sm flex items-center justify-between">
          <p className="text-xs text-charcoal-600">
            Changes will take effect instantly across all customer devices without restarting the server.
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold uppercase tracking-wider shadow-sm flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-gold-400" />
            )}
            <span>Save All Slides</span>
          </button>
        </div>
      </form>
    </div>
  );
}
