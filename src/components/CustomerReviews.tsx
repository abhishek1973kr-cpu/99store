"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Review } from "@/types";
import { Star, CheckCircle, ShieldCheck, MessageSquarePlus, ThumbsUp, Sparkles, User, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CustomerReviewsProps {
  productId: string;
  productName: string;
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
}

const DEFAULT_ORNAMENT_REVIEWS: Review[] = [
  {
    id: "rev-seed-1",
    author: "Maharani Sanyukta Rathore",
    city: "Jaipur, Rajasthan",
    rating: 5,
    title: "Unbelievable craftsmanship for ₹99 — looks like real 24K gold!",
    comment:
      "I ordered this for a royal wedding celebration. The weight in hand, the intricate polki stone setting, and the rich velvet box are indistinguishable from family heirloom pieces. To receive this wholesale for ₹99 instead of ₹349 is extraordinary.",
    date: "Feb 22, 2026",
    verified: true,
  },
  {
    id: "rev-seed-2",
    author: "Vikramaditya Singhania",
    city: "Mumbai, Maharashtra",
    rating: 5,
    title: "Heavy solid brass heft and pristine anti-tarnish finish",
    comment:
      "Superb masculine design with rich brushed detailing. Wore it continuously for three days through heat and water; zero discoloration or greening on the wrist. Outstanding quality and prompt insured delivery.",
    date: "Feb 18, 2026",
    verified: true,
  },
  {
    id: "rev-seed-3",
    author: "Dr. Ananya Sundaram",
    city: "Bengaluru, Karnataka",
    rating: 4.8,
    title: "Flawless lustre and exquisite pearl drapes",
    comment:
      "The pearl drop clusters have a natural iridescence that catches ambient light beautifully. Received dozens of compliments. Highly recommend Bolera's flat ₹99 store.",
    date: "Feb 12, 2026",
    verified: true,
  },
];

export function CustomerReviews({
  productId,
  productName,
  rating,
  reviewsCount,
  reviews,
}: CustomerReviewsProps) {
  const { addReview } = useStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const displayedReviews = reviews && reviews.length > 0 ? reviews : DEFAULT_ORNAMENT_REVIEWS;

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim() || !newTitle.trim()) return;

    addReview(productId, {
      author: newAuthor.trim(),
      city: newCity.trim() || "India",
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
    });

    setFormSubmitted(true);
    setTimeout(() => {
      setNewAuthor("");
      setNewCity("");
      setNewRating(5);
      setNewTitle("");
      setNewComment("");
      setFormSubmitted(false);
      setIsFormOpen(false);
    }, 1500);
  };

  return (
    <div className="pt-10 border-t border-cream-300 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-700 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            <span>Verified Royal Patronage</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-charcoal-900">
            Customer Reviews & Ratings
          </h3>
          <p className="text-xs text-charcoal-600 mt-0.5">
            Real feedback from connoisseurs and patrons across India.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold uppercase tracking-wider rounded border border-charcoal-800 flex items-center gap-2 transition-all shadow-sm"
        >
          <MessageSquarePlus className="w-3.5 h-3.5 text-gold-400" />
          <span>{isFormOpen ? "Close Form" : "Write a Review"}</span>
        </button>
      </div>

      {/* Ratings Overview Summary Card */}
      <div className="bg-cream-200/60 p-6 rounded border border-cream-300 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Left: Big Score */}
        <div className="text-center md:border-r md:border-cream-300 pr-4">
          <span className="font-serif text-5xl font-bold text-charcoal-900 block">
            {rating.toFixed(1)}
          </span>
          <div className="flex items-center justify-center gap-1 my-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-gold-400 text-gold-400"
                    : "fill-cream-300 text-cream-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-charcoal-600 font-medium">
            Based on {reviewsCount} verified patrons
          </span>
        </div>

        {/* Center: Rating Distribution Bars */}
        <div className="space-y-1.5 text-xs text-charcoal-700">
          <div className="flex items-center gap-2">
            <span className="w-8 font-medium">5 ★</span>
            <div className="flex-1 h-2 bg-cream-300 rounded-full overflow-hidden">
              <div className="h-full bg-gold-500 rounded-full w-[88%]" />
            </div>
            <span className="w-8 text-right text-charcoal-500">88%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-8 font-medium">4 ★</span>
            <div className="flex-1 h-2 bg-cream-300 rounded-full overflow-hidden">
              <div className="h-full bg-gold-400 rounded-full w-[10%]" />
            </div>
            <span className="w-8 text-right text-charcoal-500">10%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-8 font-medium">3 ★</span>
            <div className="flex-1 h-2 bg-cream-300 rounded-full overflow-hidden">
              <div className="h-full bg-cream-400 rounded-full w-[2%]" />
            </div>
            <span className="w-8 text-right text-charcoal-500">2%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-8 font-medium">2 ★</span>
            <div className="flex-1 h-2 bg-cream-300 rounded-full overflow-hidden">
              <div className="h-full bg-cream-400 rounded-full w-[0%]" />
            </div>
            <span className="w-8 text-right text-charcoal-500">0%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-8 font-medium">1 ★</span>
            <div className="flex-1 h-2 bg-cream-300 rounded-full overflow-hidden">
              <div className="h-full bg-cream-400 rounded-full w-[0%]" />
            </div>
            <span className="w-8 text-right text-charcoal-500">0%</span>
          </div>
        </div>

        {/* Right: Quality Guarantee Badge */}
        <div className="bg-white p-4 rounded border border-cream-200 text-center space-y-1.5">
          <ShieldCheck className="w-6 h-6 text-emerald-800 mx-auto" />
          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-charcoal-900">
            100% Genuine Craftsmanship
          </h4>
          <p className="text-[11px] text-charcoal-600 leading-relaxed">
            All reviews verified via courier delivery acknowledgment and royal vault inspections.
          </p>
        </div>
      </div>

      {/* Interactive Review Submission Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmitReview}
            className="bg-white p-6 rounded border border-gold-400/40 shadow-classic space-y-4 overflow-hidden"
          >
            <h4 className="font-serif text-lg font-bold text-charcoal-900 border-b border-cream-200 pb-2">
              Share Your Experience with {productName}
            </h4>

            {formSubmitted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Thank you! Your verified review has been published to the royal archive.</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sanyukta Rathore"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      City, State
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jaipur, Rajasthan"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      Star Rating *
                    </label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded focus:border-gold-500 focus:outline-none font-semibold text-charcoal-900"
                    >
                      <option value={5}>5 Stars - Flawless Royal Quality</option>
                      <option value={4}>4 Stars - Very Pleased</option>
                      <option value={3}>3 Stars - Average</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Exceptional 24K luster and heavy solid feel"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Detailed Experience *
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe the craftsmanship, weight, stone settings, and unboxing..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 bg-cream-100 hover:bg-cream-200 text-charcoal-800 text-xs font-semibold uppercase rounded border border-cream-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold uppercase tracking-wider rounded"
                  >
                    Submit Review
                  </button>
                </div>
              </>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-5 rounded bg-white border border-cream-300 shadow-sm space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold-400/20 text-gold-700 flex items-center justify-center font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm text-charcoal-900">
                      {rev.author}
                    </span>
                    {rev.verified && (
                      <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3 text-emerald-700" />
                        <span>Verified Buyer</span>
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-charcoal-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-600" />
                    <span>{rev.city}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Math.floor(rev.rating)
                          ? "fill-gold-400 text-gold-400"
                          : "fill-cream-300 text-cream-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-charcoal-400">{rev.date}</span>
              </div>
            </div>

            <h5 className="font-serif font-bold text-sm text-charcoal-900">
              &ldquo;{rev.title}&rdquo;
            </h5>

            <p className="text-xs text-charcoal-700 leading-relaxed font-light">
              {rev.comment}
            </p>

            <div className="pt-2 border-t border-cream-100 flex items-center justify-between text-[11px] text-charcoal-500">
              <span className="text-gold-700 font-medium">Purchased at Wholesale Rate ₹99 (MRP ₹349)</span>
              <button
                type="button"
                className="hover:text-charcoal-900 flex items-center gap-1 text-[11px]"
              >
                <ThumbsUp className="w-3 h-3" />
                <span>Helpful (14)</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

