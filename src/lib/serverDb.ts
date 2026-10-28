import fs from "fs";
import path from "path";
import { Product, Order, OrderStatus, DEFAULT_MRP, DEFAULT_WHOLESALE_PRICE } from "@/types";
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from "@/data/initialData";

// Central persistent data directory on the server
const DATA_DIR = path.join(process.cwd(), ".data");
const DB_FILE = path.join(DATA_DIR, "central_vault_db.json");

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  lastUpdated: string;
}

// In-memory fallback if filesystem is read-only (e.g. edge lambdas)
let memoryStore: DatabaseSchema = {
  products: INITIAL_PRODUCTS,
  orders: INITIAL_ORDERS,
  lastUpdated: new Date().toISOString(),
};

function ensureDbFile(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initialDb: DatabaseSchema = {
        products: INITIAL_PRODUCTS,
        orders: INITIAL_ORDERS,
        lastUpdated: new Date().toISOString(),
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf8");
      memoryStore = initialDb;
      return initialDb;
    }

    const raw = fs.readFileSync(DB_FILE, "utf8");
    if (!raw.trim()) {
      throw new Error("Empty DB file");
    }
    const data = JSON.parse(raw) as DatabaseSchema;
    memoryStore = data;
    return data;
  } catch (err) {
    console.warn("Server file DB fallback to memory store:", err);
    return memoryStore;
  }
}

function writeDbFile(data: DatabaseSchema) {
  memoryStore = data;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("Failed to write central DB to disk, using memory store:", err);
  }
}

// ==========================================
// ORDERS OPERATIONS (CENTRALIZED)
// ==========================================

export function getCentralOrders(): Order[] {
  const db = ensureDbFile();
  return db.orders || [];
}

export function saveCentralOrder(order: Order): Order {
  const db = ensureDbFile();
  const existingOrders = db.orders || [];
  
  // Prepend new order, prevent duplicate IDs
  const updatedOrders = [order, ...existingOrders.filter((o) => o.id !== order.id)];
  
  // Also decrement product stock centrally
  let updatedProducts = db.products || [];
  if (order.items && order.items.length > 0) {
    updatedProducts = updatedProducts.map((prod) => {
      const boughtItem = order.items.find((i) => i.productId === prod.id);
      if (boughtItem) {
        return { ...prod, stock: Math.max(0, prod.stock - boughtItem.quantity) };
      }
      return prod;
    });
  }

  writeDbFile({
    products: updatedProducts,
    orders: updatedOrders,
    lastUpdated: new Date().toISOString(),
  });

  return order;
}

export function updateCentralOrderStatus(orderId: string, status: OrderStatus): Order | null {
  const db = ensureDbFile();
  let found: Order | null = null;

  const updatedOrders = (db.orders || []).map((order) => {
    if (order.id === orderId) {
      const isDelivered = status === "Delivered";
      const updated: Order = {
        ...order,
        status,
        updatedAt: new Date().toISOString(),
        paymentStatus: isDelivered && order.paymentMethod === "COD" ? "PAID" : order.paymentStatus,
      };
      found = updated;
      return updated;
    }
    return order;
  });

  if (found) {
    writeDbFile({
      ...db,
      orders: updatedOrders,
      lastUpdated: new Date().toISOString(),
    });
  }

  return found;
}

export function deleteCentralOrder(orderId: string): boolean {
  const db = ensureDbFile();
  const initialLength = (db.orders || []).length;
  const filtered = (db.orders || []).filter((o) => o.id !== orderId);

  if (filtered.length !== initialLength) {
    writeDbFile({
      ...db,
      orders: filtered,
      lastUpdated: new Date().toISOString(),
    });
    return true;
  }
  return false;
}

// ==========================================
// PRODUCTS OPERATIONS (CENTRALIZED)
// ==========================================

export function getCentralProducts(): Product[] {
  const db = ensureDbFile();
  return db.products || [];
}

export function saveCentralProduct(productData: Omit<Product, "id" | "createdAt" | "rating" | "reviewsCount">): Product {
  const db = ensureDbFile();
  const validImages = productData.images && productData.images.length >= 5
    ? productData.images
    : [
        productData.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1611591475152-478311396060?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
      ];

  const newProduct: Product = {
    ...productData,
    id: `orn-cloud-${Date.now()}`,
    mrp: productData.mrp || DEFAULT_MRP,
    price: productData.price || DEFAULT_WHOLESALE_PRICE,
    rating: 5.0,
    reviewsCount: 1,
    images: validImages,
    image: validImages[0],
    createdAt: new Date().toISOString(),
  };

  const updatedProducts = [newProduct, ...(db.products || []).filter((p) => p.id !== newProduct.id)];
  writeDbFile({
    ...db,
    products: updatedProducts,
    lastUpdated: new Date().toISOString(),
  });

  return newProduct;
}

export function updateCentralProduct(id: string, updates: Partial<Product>): Product | null {
  const db = ensureDbFile();
  let found: Product | null = null;

  const updatedProducts = (db.products || []).map((p) => {
    if (p.id === id) {
      const merged: Product = { ...p, ...updates };
      if (updates.images && updates.images.length > 0) {
        merged.image = updates.images[0];
      }
      found = merged;
      return merged;
    }
    return p;
  });

  if (found) {
    writeDbFile({
      ...db,
      products: updatedProducts,
      lastUpdated: new Date().toISOString(),
    });
  }

  return found;
}

export function deleteCentralProduct(id: string): boolean {
  const db = ensureDbFile();
  const initialLength = (db.products || []).length;
  const filtered = (db.products || []).filter((p) => p.id !== id);

  if (filtered.length !== initialLength) {
    writeDbFile({
      ...db,
      products: filtered,
      lastUpdated: new Date().toISOString(),
    });
    return true;
  }
  return false;
}

export function addCentralProductReview(productId: string, reviewInput: any): Product | null {
  const db = ensureDbFile();
  let found: Product | null = null;

  const newReview = {
    ...reviewInput,
    id: `rev-${Date.now()}`,
    date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
    verified: true,
  };

  const updatedProducts = (db.products || []).map((p) => {
    if (p.id === productId) {
      const existingReviews = p.reviews || [];
      const updatedReviews = [newReview, ...existingReviews];
      const newReviewsCount = p.reviewsCount + 1;
      const newRating = Number(((p.rating * p.reviewsCount + reviewInput.rating) / newReviewsCount).toFixed(1));
      const updatedProd: Product = {
        ...p,
        rating: newRating,
        reviewsCount: newReviewsCount,
        reviews: updatedReviews,
      };
      found = updatedProd;
      return updatedProd;
    }
    return p;
  });

  if (found) {
    writeDbFile({
      ...db,
      products: updatedProducts,
      lastUpdated: new Date().toISOString(),
    });
  }

  return found;
}

export function resetCentralVault(): DatabaseSchema {
  const resetDb: DatabaseSchema = {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    lastUpdated: new Date().toISOString(),
  };
  writeDbFile(resetDb);
  return resetDb;
}
