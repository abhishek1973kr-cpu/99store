"use client";

import React, { useState, useRef } from "react";
import {
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Quote,
  Sparkles,
  Heart,
  ThumbsUp,
  MessageSquarePlus,
  X,
  User,
  MapPin,
  Tag,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CuratedReview {
  id: string;
  author: string;
  avatar?: string;
  city: string;
  category: "Ladies Ornaments" | "Gents Ornaments";
  productName: string;
  productImage: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  likesCount: number;
  verified: boolean;
}

const FEATURED_REVIEWS: CuratedReview[] = [
  {
    id: "hrev-1",
    author: "Maharani Gayatri Rathore",
    city: "Jaipur, Rajasthan",
    category: "Ladies Ornaments",
    productName: "Royal Rajputana Kundan & Pearl Haar Set",
    productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    title: "Astonishing craftsmanship for ₹99 — feels like 24K heirloom jewelry!",
    comment:
      "I ordered this piece for a family royal sangeet celebration. The weight in hand, the hand-inlaid polki stones, and the adjustable woven zari dori rival custom pieces from Johari Bazaar that cost ₹25,000. To receive this wholesale for ₹99 is nothing short of incredible.",
    date: "Feb 24, 2026",
    likesCount: 142,
    verified: true,
  },
  {
    id: "hrev-2",
    author: "Kunwar Vikramaditya Singhania",
    city: "Mumbai, Maharashtra",
    category: "Gents Ornaments",
    productName: "Imperial Rajput Royal Kada with Dual Lion Heads",
    productImage: "https://images.unsplash.com/photo-1611591475152-478311396060?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    title: "Heavy solid brass heft with fierce engraved lion heads",
    comment:
      "Superb masculine architecture. The dual roaring lion heads have ruby-cut zircon eyes that look royal. I have worn it non-stop for two weeks through work, showers, and travel — zero discoloration or greening on the wrist.",
    date: "Feb 20, 2026",
    likesCount: 119,
    verified: true,
  },
  {
    id: "hrev-3",
    author: "Dr. Ananya Sundaram",
    city: "Bengaluru, Karnataka",
    category: "Ladies Ornaments",
    productName: "Emerald & Polki Chandbali Palace Jhumkas",
    productImage: "https://images.unsplash.com/photo-1611591475152-478311396060?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    title: "Sublime emerald luster and lightweight comfort drapes",
    comment:
      "The teardrop emerald drops have an ethereal translucence in natural daylight. What amazed me most is how comfortable they are to wear for 8 hours without earlobes aching. Truly regal craftsmanship at a modest ₹99.",
    date: "Feb 17, 2026",
    likesCount: 96,
    verified: true,
  },
  {
    id: "hrev-4",
    author: "Ranvijay Singh Deora",
    city: "Udaipur, Rajasthan",
    category: "Gents Ornaments",
    productName: "Maharaja Navratna Solitaire Signet Ring",
    productImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    title: "Pure aristocratic aura on the pinky and index finger",
    comment:
      "Solid brushed shank, comfortable inner contour, and the 9 micro-gem setting represents traditional planetary balance. Everyone asks where I had this crafted in Jaipur. COD was seamless.",
    date: "Feb 14, 2026",
    likesCount: 88,
    verified: true,
  },
  {
    id: "hrev-5",
    author: "Meenakshi Iyer",
    city: "Chennai, Tamil Nadu",
    category: "Ladies Ornaments",
    productName: "Victorian Rose Gold Cushion Solitaire Ring",
    productImage: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    title: "Cushion cut zirconia sparkles with fiery diamond brilliance",
    comment:
      "The micro-pavé halo setting holds light so brilliantly that multiple jewelers mistook it for genuine solitaire platinum. The presentation velvet box arrived sealed with wax. Bolera is my new favorite destination for luxury ornaments at ₹99.",
    date: "Feb 10, 2026",
    likesCount: 77,
    verified: true,
  },
  {
    id: "hrev-6",
    author: "Harshwardhan Goenka",
    city: "Kolkata, West Bengal",
    category: "Gents Ornaments",
    productName: "Royal Jaipur Enamelled Shield Brooch & Lapel Pin",
    productImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    title: "Elevated my Bandhgala jacket instantly",
    comment:
      "The Meenakari floral enamel work along the shield border is exceptionally fine. It has double safety pin locks that do not damage fine silk or wool fabrics. Indispensable for wedding attire.",
    date: "Feb 08, 2026",
    likesCount: 65,
    verified: true,
  },
];

export function HomeReviewsShowcase() {
  const [selectedFilter, setSelectedFilter] = useState<"ALL" | "Ladies Ornaments" | "Gents Ornaments">("ALL");
  const [selectedReviewModal, setSelectedReviewModal] = useState<CuratedReview | null>(null);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});

  // Review submission state
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newAuthor, setNewAuthor] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCategory, setNewCategory] = useState<"Ladies Ornaments" | "Gents Ornaments">("Ladies Ornaments");
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [userSubmittedReviews, setUserSubmittedReviews] = useState<CuratedReview[]>([]);
  const [submittedBanner, setSubmittedBanner] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const allReviews = [...userSubmittedReviews, ...FEATURED_REVIEWS];

  const filteredReviews = allReviews.filter((r) => {
    if (selectedFilter === "ALL") return true;
    return r.category === selectedFilter;
  });

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleToggleLike = (id: string, initialCount: number) => {
    const isLiked = likedIds[id];
    setLikedIds((prev) => ({ ...prev, [id]: !isLiked }));
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] ?? initialCount) + (isLiked ? -1 : 1),
    }));
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newTitle.trim() || !newComment.trim()) return;

    const newRev: CuratedReview = {
      id: `user-rev-${Date.now()}`,
      author: newAuthor.trim(),
      city: newCity.trim() || "India",
      category: newCategory,
      productName: newCategory === "Ladies Ornaments" ? "Royal Ladies Vault Piece" : "Royal Gents Vault Piece",
      productImage:
        newCategory === "Ladies Ornaments"
          ? "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
          : "https://images.unsplash.com/photo-1611591475152-478311396060?auto=format&fit=crop&w=800&q=80",
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      date: "Just now",
      likesCount: 1,
      verified: true,
    };

    setUserSubmittedReviews((prev) => [newRev, ...prev]);
    setIsWriteReviewOpen(false);
    setSubmittedBanner(true);
    setNewAuthor("");
    setNewCity("");
    setNewTitle("");
    setNewComment("");
    setTimeout(() => setSubmittedBanner(false), 5000);
  };

  return (
    <section id="reviews-showcase" className="py-16 sm:py-24 bg-cream-50 border-t border-cream-300 relative overflow-hidden">
      {/* Decorative luxury backdrop glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-cream-300">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Voice of the Patrons</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal-900 tracking-tight">
              Customer Feedback & Experiences
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-600 mt-2 max-w-xl leading-relaxed">
              Real reflections from connoisseurs and shoppers who have ordered from Bolera across India. Every single piece is backed by our universal flat ₹99 wholesale pledge.
            </p>
          </div>

          {/* Aggregate Trust Metrics Card */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gold-400/30 shadow-md flex items-center gap-5 shrink-0">
            <div className="text-center border-r border-cream-200 pr-5">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 block">
                4.9
              </span>
              <div className="flex items-center justify-center gap-0.5 text-gold-400 mt-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                ))}
              </div>
              <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block mt-1">
                Average Rating
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-charcoal-900">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>4,800+ Verified Buyers</span>
              </div>
              <div className="flex items-center gap-1.5 text-charcoal-600 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                <span>Zero Polish Fade Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5 text-charcoal-600 text-[11px]">
                <Tag className="w-3.5 h-3.5 text-gold-600" />
                <span>Wholesale ₹99 (MRP ₹349)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Filter Tabs & Navigation Controls */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedFilter("ALL")}
              className={`text-xs px-4 py-2.5 rounded-full font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedFilter === "ALL"
                  ? "bg-charcoal-900 text-cream-100 shadow-sm ring-1 ring-gold-400/40"
                  : "bg-white text-charcoal-700 hover:bg-cream-200 border border-cream-300"
              }`}
            >
              All Patrons ({allReviews.length})
            </button>

            <button
              onClick={() => setSelectedFilter("Ladies Ornaments")}
              className={`text-xs px-4 py-2.5 rounded-full font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedFilter === "Ladies Ornaments"
                  ? "bg-charcoal-900 text-cream-100 shadow-sm ring-1 ring-gold-400/40"
                  : "bg-white text-charcoal-700 hover:bg-cream-200 border border-cream-300"
              }`}
            >
              👑 Ladies Ornaments
            </button>

            <button
              onClick={() => setSelectedFilter("Gents Ornaments")}
              className={`text-xs px-4 py-2.5 rounded-full font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedFilter === "Gents Ornaments"
                  ? "bg-charcoal-900 text-cream-100 shadow-sm ring-1 ring-gold-400/40"
                  : "bg-white text-charcoal-700 hover:bg-cream-200 border border-cream-300"
              }`}
            >
              ⚔️ Gents Ornaments
            </button>
          </div>

          {/* Action & Carousel Controls */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={() => setIsWriteReviewOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider bg-gold-400 hover:bg-gold-500 text-charcoal-900 px-4 py-2.5 rounded-xl shadow-sm transition-all"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Share Experience</span>
            </button>

            <div className="hidden sm:flex items-center gap-1.5 border border-cream-300 rounded-xl p-1 bg-white">
              <button
                onClick={() => scroll("left")}
                className="p-1.5 rounded-lg hover:bg-cream-200 text-charcoal-700 hover:text-charcoal-900 transition-colors"
                aria-label="Scroll reviews left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-1.5 rounded-lg hover:bg-cream-200 text-charcoal-700 hover:text-charcoal-900 transition-colors"
                aria-label="Scroll reviews right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Success toast after submitting review */}
        {submittedBanner && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Thank you for sharing your royal review! It has been posted to our customer feedback archive.</span>
            </div>
            <button onClick={() => setSubmittedBanner(false)} className="text-emerald-700 font-bold">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Scrollable / Swipeable Feedback Cards Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-5 sm:gap-6 overflow-x-auto pb-6 pt-2 scroll-smooth snap-x snap-mandatory no-scrollbar"
        >
          {filteredReviews.map((rev) => {
            const currentLikes = likesMap[rev.id] ?? rev.likesCount;
            const isLiked = likedIds[rev.id] ?? false;

            return (
              <motion.div
                key={rev.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedReviewModal(rev)}
                className="w-[85vw] sm:w-[360px] lg:w-[380px] shrink-0 snap-start bg-white rounded-3xl border border-cream-300 p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-gold-400 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div className="space-y-4">
                  {/* Top Row: Stars + Verified Badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gold-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(rev.rating)
                              ? "fill-gold-400 text-gold-400"
                              : "text-cream-300"
                          }`}
                        />
                      ))}
                      <span className="font-semibold text-xs text-charcoal-900 ml-1">
                        {rev.rating.toFixed(1)}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>Verified Patron</span>
                    </span>
                  </div>

                  {/* Review Title */}
                  <h4 className="font-serif text-base sm:text-lg font-bold text-charcoal-900 group-hover:text-gold-700 transition-colors line-clamp-2 leading-snug">
                    &ldquo;{rev.title}&rdquo;
                  </h4>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-charcoal-600 line-clamp-4 leading-relaxed font-light">
                    {rev.comment}
                  </p>

                  {/* Ornament Attached */}
                  <div className="flex items-center gap-3 p-3 bg-cream-50 rounded-2xl border border-cream-200">
                    <img
                      src={rev.productImage}
                      alt={rev.productName}
                      className="w-11 h-11 object-cover rounded-xl shrink-0 border border-cream-300"
                    />
                    <div className="truncate">
                      <span className="text-[10px] uppercase font-semibold text-gold-700 tracking-wider block">
                        Adorned Ornament (₹99)
                      </span>
                      <span className="text-xs font-serif font-bold text-charcoal-900 truncate block">
                        {rev.productName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row: Customer Details + Helpful Action */}
                <div className="pt-4 border-t border-cream-200 mt-5 flex items-center justify-between text-xs text-charcoal-600">
                  <div>
                    <span className="font-serif font-bold text-charcoal-900 block text-sm">
                      {rev.author}
                    </span>
                    <span className="text-[11px] text-charcoal-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-gold-600 shrink-0" />
                      <span>{rev.city}</span>
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(rev.id, rev.likesCount);
                    }}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded transition-colors ${
                      isLiked
                        ? "bg-gold-50 text-gold-700 font-semibold"
                        : "text-charcoal-500 hover:bg-cream-100 hover:text-charcoal-900"
                    }`}
                    title="Mark review as helpful"
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? "fill-gold-500 text-gold-500" : ""}`} />
                    <span>{currentLikes}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="sm:hidden text-center pt-2 text-[11px] text-charcoal-500 uppercase tracking-widest flex items-center justify-center gap-2">
          <span>← Swipe to explore more patron stories →</span>
        </div>
      </div>

      {/* MODAL 1: Read Full Review Details Dialog */}
      <AnimatePresence>
        {selectedReviewModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-xl rounded-3xl border border-gold-400/30 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
            >
              {/* Top Banner */}
              <div className="flex items-start justify-between pb-4 border-b border-cream-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>Verified Royal Patron</span>
                    </span>
                    <span className="text-[11px] text-charcoal-500">• {selectedReviewModal.date}</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900 leading-snug">
                    &ldquo;{selectedReviewModal.title}&rdquo;
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReviewModal(null)}
                  className="p-1.5 rounded-full text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-100 transition-colors"
                  aria-label="Close review dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center text-gold-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(selectedReviewModal.rating)
                          ? "fill-gold-400 text-gold-400"
                          : "text-cream-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-charcoal-900">
                  {selectedReviewModal.rating.toFixed(1)} / 5.0
                </span>
                <span className="text-xs text-charcoal-500">
                  • {selectedReviewModal.category}
                </span>
              </div>

              {/* Full Comment */}
              <div className="p-4 bg-cream-50 rounded-2xl border border-cream-200 text-xs sm:text-sm text-charcoal-700 leading-relaxed font-light">
                <Quote className="w-6 h-6 text-gold-500/40 mb-2" />
                <p>{selectedReviewModal.comment}</p>
              </div>

              {/* Product preview */}
              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-cream-300">
                <img
                  src={selectedReviewModal.productImage}
                  alt={selectedReviewModal.productName}
                  className="w-14 h-14 object-cover rounded-xl border border-cream-300 shrink-0"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-gold-700 tracking-wider block">
                    Adorned Ornament Creation
                  </span>
                  <h5 className="font-serif font-bold text-charcoal-900 text-sm">
                    {selectedReviewModal.productName}
                  </h5>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-xs font-bold text-charcoal-900">Wholesale: ₹99</span>
                    <span className="text-[11px] text-charcoal-400 line-through">MRP ₹349</span>
                  </div>
                </div>
              </div>

              {/* Customer signature */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <div>
                  <span className="font-serif font-bold text-charcoal-900 text-base block">
                    {selectedReviewModal.author}
                  </span>
                  <span className="text-charcoal-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-gold-600" />
                    <span>{selectedReviewModal.city}</span>
                  </span>
                </div>
                <button
                  onClick={() => setSelectedReviewModal(null)}
                  className="px-4 py-2 bg-charcoal-900 text-cream-100 text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Close Story
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Share Customer Experience Form */}
      <AnimatePresence>
        {isWriteReviewOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white w-full max-w-lg rounded-3xl border border-gold-400/30 shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-cream-200">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold-700 font-semibold block">
                    Artisanal Feedback
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-900">
                    Share Your Ornament Experience
                  </h3>
                </div>
                <button
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="p-1.5 rounded-full text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePostReview} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sanyukta Rathore"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl focus:border-gold-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      Your City, State *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jaipur, Rajasthan"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      Collection Reviewed
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl focus:border-gold-500 focus:outline-none"
                    >
                      <option value="Ladies Ornaments">Ladies Ornaments</option>
                      <option value="Gents Ornaments">Gents Ornaments</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                      Star Rating (5 Stars)
                    </label>
                    <div className="flex items-center gap-1 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating
                                ? "fill-gold-400 text-gold-400"
                                : "text-cream-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Review Headline *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Impeccable weight and luster for ₹99"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Your Detailed Feedback *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell patrons about the craftsmanship, polish durability, transit packaging, and wholesale value..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-cream-50 border border-cream-300 rounded-xl focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 border-t border-cream-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsWriteReviewOpen(false)}
                    className="px-4 py-2.5 bg-cream-200 text-charcoal-800 uppercase tracking-wider font-semibold rounded-xl hover:bg-cream-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 uppercase tracking-wider font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Publish Feedback</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

