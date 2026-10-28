# ATELIER 99 — Exclusive Ladies & Gents Royal Ornaments Store

A production-ready, classic & timeless luxury e-commerce web application built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

Featuring a synchronized **User Storefront** and a **Secure Admin Management Console** with an exclusive **Wholesale Pricing Model** (MRP ₹349 offered at flat ₹99), **5+ High-Resolution Perspectives Per Product**, and **Protected Admin Authentication Gateway**.

---

## Key Highlights

### 1. Secure Admin Authentication Gateway (`/admin`)
- **Stunning Luxury Floating Login Box**: Centered classic card with glassmorphism, subtle gold border, radial ambient glow, and Playfair Display serif typography.
- **Hardcoded Credentials**:
  - **Username**: `1234`
  - **Password**: `4321`
- **State Persistence**: Authenticated status is preserved in browser storage (`localStorage` & `sessionStorage`).
- **Logout Feature**: Secure logout button in the header that terminates the session and returns to the login card.

---

### 2. 25 Curated Royal Ornaments
- **13 Ladies Ornaments**: Royal Kundan Haar Sets, Chandbali Jhumkas, 24K Filigree Bangles, Solitaire Rings, Meenakari Chokers, Jadau Matha Patti, Temple Jewelry Kamarbandh, Tennis Bracelets, and Baroque Pearl Malas.
- **12 Gents Ornaments**: Sovereign Lion Head 24K Gold Kadas, Imperial Shield Signet Rings with Natural Onyx, Rajputana Kalgi Brooches, Heavy Figaro Neck Chains, Damascus Steel Cufflinks, Celtic Dragon Scale Bangles, and Tiger Eye Beaded Malas.

---

### 3. Classic Pricing & Wholesale Discount Architecture
- **Original Retail MRP**: **₹349** (displayed elegantly struck-through in muted text).
- **Wholesale Clearance Rate**: **₹99** (highlighted in royal gold `#C5A880` and bold charcoal `#1A1A1A`).
- **Savings Badge**: Prominently displays *"Save ₹250 (72% Wholesale Deal)"*.

---

### 4. Mandatory 5+ High-Resolution Views per Product
- **Every product features at least 5 high-resolution images** displaying front view, macro stone setting, side clasp closure, styling scale, and royal packaging view.
- Interactive multi-angle gallery with large viewport, previous/next controls, and clickable thumbnail selector strip.

---

### 5. Admin Panel (`/admin`) Multi-Image & Pricing CRUD
- **5 Dedicated Image Input Slots** (`Image 1 (Primary)`, `Image 2`, `Image 3`, `Image 4`, `Image 5`) + local file uploader + 1-click curated suites.
- Edit Title, Category (*Ladies Ornaments* vs *Gents Ornaments*), Description, MRP (₹349), Wholesale Price (₹99), Stock, Metal, and Specifications.
- **Real-time cross-tab synchronization** with the User storefront.

---

### 6. Orders Dashboard (`/admin`)
- Displays Customer Name, Clickable Phone, Complete Shipping Address (Line 1, Line 2, Landmark, City, State, PIN).
- Ordered articles preview with image thumbnails and paid price (₹99).
- Payment method badge (Online Prepaid vs Cash on Delivery).
- Status toggle (*Pending → Shipped → Delivered*) with real-time sync.
- One-click Printable Packaging Manifest.

---

## Live Endpoints

- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Console (Login Gateway)**: [http://localhost:3000/admin](http://localhost:3000/admin)
  - **Username**: `1234`
  - **Password**: `4321`
- **Ladies Product Detail**: [http://localhost:3000/product/orn-l-001](http://localhost:3000/product/orn-l-001)
- **Gents Product Detail**: [http://localhost:3000/product/orn-g-001](http://localhost:3000/product/orn-g-001)

---

## How to Test Live Authentication & Sync

1. Open [http://localhost:3000/admin](http://localhost:3000/admin) in **Tab 1**:
   - The luxury login popup appears.
   - Enter invalid credentials to observe the error banner.
   - Click **"Auto-Fill"** or enter `1234` / `4321` and click **"Unlock Vault Console"**.
   - You are granted access to the Admin Dashboard.
2. Open [http://localhost:3000](http://localhost:3000) in **Tab 2** (Storefront).
3. In **Tab 1**, edit any ornament or add a new one using the 5 image input slots.
4. Switch to **Tab 2**: The edits or new ornament appear **immediately** without reloading.
5. In **Tab 2**, add an ornament to the bag and complete checkout.
6. Switch to **Tab 1**: A live order alert banner chimes with customer details, and the new order is placed at the top of the Orders table with customer telephone and complete address.
7. Click **"Logout"** in the top right of Tab 1 to lock the console and return to the login screen.
