"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { Product, OrnamentCategory, DEFAULT_MRP, DEFAULT_WHOLESALE_PRICE } from "@/types";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Check,
  X,
  Star,
  Image as ImageIcon,
  Layers,
  Sparkles,
} from "lucide-react";

// Curated 5-image jewelry photo suites for 1-click preset filling
const PRESET_ORNAMENT_SUITES = [
  {
    name: "Royal Kundan Set (5 Views)",
    category: "Ladies Ornaments",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611591475152-478311396060?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    name: "Solitaire Cocktail Ring (5 Views)",
    category: "Ladies Ornaments",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611591475152-478311396060?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    name: "Men's Lion Head Kada (5 Views)",
    category: "Gents Ornaments",
    images: [
      "https://images.unsplash.com/photo-1611591475152-478311396060?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
    ],
  },
  {
    name: "Heavy Link Neck Chain (5 Views)",
    category: "Gents Ornaments",
    images: [
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611591475152-478311396060?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    ],
  },
];

export function ProductManagement() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<OrnamentCategory>("Ladies Ornaments");
  const [mrp, setMrp] = useState<number>(DEFAULT_MRP);
  const [price, setPrice] = useState<number>(DEFAULT_WHOLESALE_PRICE);

  // Minimum 5 Image Slots
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [image5, setImage5] = useState("");

  const [stock, setStock] = useState<number>(25);
  const [badge, setBadge] = useState<string>("Wholesale Deal");
  const [metal, setMetal] = useState("24K Micro Gold Plated Brass");
  const [weight, setWeight] = useState("45 grams");
  const [dimensions, setDimensions] = useState("Standard Royal Sizing");
  const [featuresText, setFeaturesText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
    setTagline("");
    setDescription("");
    setCategory("Ladies Ornaments");
    setMrp(DEFAULT_MRP);
    setPrice(DEFAULT_WHOLESALE_PRICE);

    // Default to Preset 0
    const def = PRESET_ORNAMENT_SUITES[0].images;
    setImage1(def[0]);
    setImage2(def[1]);
    setImage3(def[2]);
    setImage4(def[3]);
    setImage5(def[4]);

    setStock(25);
    setBadge("Wholesale Deal");
    setMetal("24K Micro Gold Plated Brass & Gemstones");
    setWeight("42 grams");
    setDimensions("Adjustable Free Size");
    setFeaturesText("Master artisan casting\n24K micro-gold dipped finish\nHypoallergenic skin barrier seal\nTamper-proof royal jewelry packaging");
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setTagline(prod.tagline || "");
    setDescription(prod.description);
    setCategory((prod.category as OrnamentCategory) || "Ladies Ornaments");
    setMrp(prod.mrp || DEFAULT_MRP);
    setPrice(prod.price || DEFAULT_WHOLESALE_PRICE);

    const imgs = prod.images && prod.images.length >= 5 ? prod.images : [prod.image, prod.image, prod.image, prod.image, prod.image];
    setImage1(imgs[0] || "");
    setImage2(imgs[1] || "");
    setImage3(imgs[2] || "");
    setImage4(imgs[3] || "");
    setImage5(imgs[4] || "");

    setStock(prod.stock);
    setBadge(prod.badge || "Wholesale Deal");
    setMetal(prod.metal || "Gold Plated Brass");
    setWeight(prod.weight || "");
    setDimensions(prod.dimensions || "");
    setFeaturesText((prod.features || []).join("\n"));
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const applyPresetSuite = (suite: typeof PRESET_ORNAMENT_SUITES[0]) => {
    setImage1(suite.images[0]);
    setImage2(suite.images[1]);
    setImage3(suite.images[2]);
    setImage4(suite.images[3]);
    setImage5(suite.images[4]);
    setCategory(suite.category as OrnamentCategory);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, slot: 1 | 2 | 3 | 4 | 5) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        if (slot === 1) setImage1(reader.result);
        if (slot === 2) setImage2(reader.result);
        if (slot === 3) setImage3(reader.result);
        if (slot === 4) setImage4(reader.result);
        if (slot === 5) setImage5(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter an ornament article name.");
      return;
    }
    if (!description.trim()) {
      setErrorMsg("Please enter an article description.");
      return;
    }

    // Require all 5 image slots
    const allImages = [image1.trim(), image2.trim(), image3.trim(), image4.trim(), image5.trim()].filter(Boolean);
    if (allImages.length < 5) {
      setErrorMsg("Requirement: Please provide all 5 high-resolution image URLs or uploads.");
      return;
    }

    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const productPayload = {
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      mrp: Number(mrp) || DEFAULT_MRP,
      price: Number(price) || DEFAULT_WHOLESALE_PRICE,
      images: allImages,
      image: allImages[0],
      stock: Number(stock) || 0,
      badge: badge as any,
      metal: metal.trim() || "24K Gold Plated Alloy",
      weight: weight.trim() || undefined,
      dimensions: dimensions.trim() || undefined,
      features,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, prodName: string) => {
    if (confirm(`Permanently remove "${prodName}" from the ornaments vault?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-white p-4 rounded border border-cream-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-lg font-bold text-charcoal-900">
            Ornaments Inventory ({products.length} Articles)
          </h3>
          <p className="text-xs text-charcoal-600">
            Manage Ladies & Gents Ornaments. Each product strictly requires 5+ high-resolution images, MRP (₹349), and Wholesale Rate (₹99).
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto px-4 py-2.5 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold uppercase tracking-wider rounded shadow flex items-center justify-center gap-2 group transition-all"
        >
          <Plus className="w-4 h-4 text-gold-400 group-hover:rotate-90 transition-transform" />
          <span>Add New Ornament (5+ Images)</span>
        </button>
      </div>

      {/* Pricing Policy Banner */}
      <div className="bg-amber-50 border border-amber-200 p-3.5 rounded flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            <strong>Classic Pricing Structure:</strong> Original MRP is set at <strong>₹349</strong>, offered at the special wholesale rate of <strong>₹99</strong> (Save ₹250).
          </span>
        </div>
        <span className="text-[11px] font-semibold uppercase bg-amber-100 text-amber-900 px-2.5 py-1 rounded">
          72% Wholesale Deal
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded border border-cream-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-cream-200/70 border-b border-cream-300 text-[11px] uppercase tracking-wider text-charcoal-700 font-semibold">
                <th className="py-3 px-4">Ornament Article</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Pricing (Wholesale vs MRP)</th>
                <th className="py-3 px-4">5-Image Gallery Preview</th>
                <th className="py-3 px-4">Vault Stock</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200">
              {products.map((prod) => {
                const prodImages = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
                return (
                  <tr key={prod.id} className="hover:bg-cream-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prodImages[0] || prod.image}
                          alt={prod.name}
                          className="w-12 h-12 object-cover rounded border border-cream-300 shrink-0"
                        />
                        <div className="max-w-xs">
                          <span className="font-serif font-bold text-charcoal-900 block text-sm truncate">
                            {prod.name}
                          </span>
                          <span className="text-[11px] text-charcoal-500 line-clamp-1">
                            {prod.tagline || prod.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        prod.category === "Ladies Ornaments"
                          ? "bg-rose-50 text-rose-800 border border-rose-200"
                          : "bg-slate-100 text-slate-800 border border-slate-300"
                      }`}>
                        {prod.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-serif font-bold text-charcoal-900 text-sm">
                          ₹{prod.price}
                        </span>
                        <span className="text-xs text-charcoal-400 line-through">
                          MRP ₹{prod.mrp}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-semibold block">
                        Save ₹{prod.mrp - prod.price} (72% Off)
                      </span>
                    </td>

                    {/* 5-Image Strip Preview */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {prodImages.slice(0, 5).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt=""
                            className="w-7 h-7 object-cover rounded border border-cream-300"
                          />
                        ))}
                        {prodImages.length > 5 && (
                          <span className="text-[10px] text-charcoal-500 font-bold ml-1">
                            +{prodImages.length - 5}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-charcoal-500 block mt-0.5">
                        {prodImages.length} High-Res Views
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {prod.stock <= 5 ? (
                        <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {prod.stock} left (Low)
                        </span>
                      ) : (
                        <span className="text-emerald-800 font-medium">
                          {prod.stock} units
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-charcoal-850 text-gold-300">
                        {prod.badge || "Wholesale Deal"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1.5 text-charcoal-700 hover:text-charcoal-900 hover:bg-cream-200 rounded transition-colors inline-block"
                        title="Edit Article & Images"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 text-charcoal-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors inline-block"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal with 5 Image Fields */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div
            className="bg-cream-100 max-w-3xl w-full rounded border border-cream-300 shadow-2xl overflow-hidden my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-charcoal-900 text-cream-100 flex items-center justify-between border-b border-charcoal-800">
              <div>
                <h3 className="font-serif text-xl font-bold">
                  {editingProduct ? "Edit Ornament (5+ Image Suite)" : "Add New Royal Ornament (5+ Image Suite)"}
                </h3>
                <p className="text-xs text-cream-400 mt-0.5">
                  Mandatory: 5 high-resolution images, MRP ₹349, and Wholesale Rate ₹99.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-charcoal-800 text-cream-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 max-h-[82vh] overflow-y-auto">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
                  {errorMsg}
                </div>
              )}

              {/* Title & Tagline */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Ornament Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Rajputana Kundan & Pearl Haar Set"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Tagline (One-line subtitle)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hand-embossed 24K gold micro-plated necklace with jhumkas"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category, Pricing & Inventory */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as OrnamentCategory)}
                    className="w-full px-3 py-2 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none font-semibold text-charcoal-900"
                  >
                    <option value="Ladies Ornaments">Ladies Ornaments</option>
                    <option value="Gents Ornaments">Gents Ornaments</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Original MRP (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Wholesale Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none font-bold text-charcoal-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Vault Stock Units *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Quick Presets Picker */}
              <div className="bg-cream-50 p-3 rounded border border-cream-300 space-y-2">
                <span className="text-[11px] font-semibold text-charcoal-700 uppercase tracking-wider block">
                  Quick 1-Click 5-Image Suite Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_ORNAMENT_SUITES.map((suite, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPresetSuite(suite)}
                      className="px-3 py-1.5 bg-white hover:bg-cream-200 text-charcoal-800 rounded border border-cream-300 text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-gold-600" />
                      <span>{suite.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* MANDATORY 5 IMAGE SLOTS */}
              <div className="space-y-4 pt-2 border-t border-cream-300">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-gold-600" />
                    <span>5 Mandatory High-Resolution Product Images</span>
                  </h4>
                  <span className="text-[10px] uppercase font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    5 Slots Active
                  </span>
                </div>

                {/* Image Slot 1: Primary */}
                <div className="p-3 bg-white rounded border border-cream-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-charcoal-900 uppercase">
                      Image 1 (Primary Front View) *
                    </span>
                    <label className="cursor-pointer text-[11px] text-charcoal-700 bg-cream-100 hover:bg-cream-200 px-2 py-1 rounded border border-cream-300 flex items-center gap-1">
                      <Upload className="w-3 h-3 text-gold-600" />
                      <span>Upload File</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 1)} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-3 items-center">
                    {image1 ? (
                      <img src={image1} alt="Slot 1" className="w-12 h-12 object-cover rounded border border-cream-300 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-cream-200 border border-dashed border-cream-400 shrink-0" />
                    )}
                    <input
                      type="url"
                      required
                      placeholder="Paste Image URL 1 (https://...)"
                      value={image1}
                      onChange={(e) => setImage1(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Slot 2 */}
                <div className="p-3 bg-white rounded border border-cream-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-charcoal-900 uppercase">
                      Image 2 (Macro / Stone Detail View) *
                    </span>
                    <label className="cursor-pointer text-[11px] text-charcoal-700 bg-cream-100 hover:bg-cream-200 px-2 py-1 rounded border border-cream-300 flex items-center gap-1">
                      <Upload className="w-3 h-3 text-gold-600" />
                      <span>Upload File</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 2)} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-3 items-center">
                    {image2 ? (
                      <img src={image2} alt="Slot 2" className="w-12 h-12 object-cover rounded border border-cream-300 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-cream-200 border border-dashed border-cream-400 shrink-0" />
                    )}
                    <input
                      type="url"
                      required
                      placeholder="Paste Image URL 2 (https://...)"
                      value={image2}
                      onChange={(e) => setImage2(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Slot 3 */}
                <div className="p-3 bg-white rounded border border-cream-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-charcoal-900 uppercase">
                      Image 3 (Side / Back Clasp Angle) *
                    </span>
                    <label className="cursor-pointer text-[11px] text-charcoal-700 bg-cream-100 hover:bg-cream-200 px-2 py-1 rounded border border-cream-300 flex items-center gap-1">
                      <Upload className="w-3 h-3 text-gold-600" />
                      <span>Upload File</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 3)} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-3 items-center">
                    {image3 ? (
                      <img src={image3} alt="Slot 3" className="w-12 h-12 object-cover rounded border border-cream-300 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-cream-200 border border-dashed border-cream-400 shrink-0" />
                    )}
                    <input
                      type="url"
                      required
                      placeholder="Paste Image URL 3 (https://...)"
                      value={image3}
                      onChange={(e) => setImage3(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Slot 4 */}
                <div className="p-3 bg-white rounded border border-cream-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-charcoal-900 uppercase">
                      Image 4 (Styling / Scale Perspective) *
                    </span>
                    <label className="cursor-pointer text-[11px] text-charcoal-700 bg-cream-100 hover:bg-cream-200 px-2 py-1 rounded border border-cream-300 flex items-center gap-1">
                      <Upload className="w-3 h-3 text-gold-600" />
                      <span>Upload File</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 4)} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-3 items-center">
                    {image4 ? (
                      <img src={image4} alt="Slot 4" className="w-12 h-12 object-cover rounded border border-cream-300 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-cream-200 border border-dashed border-cream-400 shrink-0" />
                    )}
                    <input
                      type="url"
                      required
                      placeholder="Paste Image URL 4 (https://...)"
                      value={image4}
                      onChange={(e) => setImage4(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image Slot 5 */}
                <div className="p-3 bg-white rounded border border-cream-300 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-charcoal-900 uppercase">
                      Image 5 (Packaging / Royal Case View) *
                    </span>
                    <label className="cursor-pointer text-[11px] text-charcoal-700 bg-cream-100 hover:bg-cream-200 px-2 py-1 rounded border border-cream-300 flex items-center gap-1">
                      <Upload className="w-3 h-3 text-gold-600" />
                      <span>Upload File</span>
                      <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 5)} className="hidden" />
                    </label>
                  </div>
                  <div className="flex gap-3 items-center">
                    {image5 ? (
                      <img src={image5} alt="Slot 5" className="w-12 h-12 object-cover rounded border border-cream-300 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-cream-200 border border-dashed border-cream-400 shrink-0" />
                    )}
                    <input
                      type="url"
                      required
                      placeholder="Paste Image URL 5 (https://...)"
                      value={image5}
                      onChange={(e) => setImage5(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Complete Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail the royal heritage, craftsmanship, stones, and tactile feel..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Metal / Plating
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 24K Micro Gold Plated Brass"
                    value={metal}
                    onChange={(e) => setMetal(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Net Weight
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 48 grams"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                    Dimensions / Sizing
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Free Size / Adjustable"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bullet Features */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-800 mb-1">
                  Artisanal Features (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="24K gold dipped polish&#10;Includes matching jhumkas&#10;Hypoallergenic skin safe coat"
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-cream-300 rounded focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Submission Controls */}
              <div className="pt-4 border-t border-cream-300 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-cream-200 hover:bg-cream-300 text-charcoal-800 text-xs font-semibold uppercase tracking-wider rounded border border-cream-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-charcoal-900 hover:bg-charcoal-850 text-cream-100 text-xs font-semibold uppercase tracking-wider rounded shadow transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-gold-400" />
                  <span>{editingProduct ? "Save Changes" : "Publish to Vault (₹99)"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
