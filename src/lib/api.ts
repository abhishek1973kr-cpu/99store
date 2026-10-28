import { Order, OrderStatus, Product, Review } from "@/types";

// Helper to determine base URL (works seamlessly in client browser, mobile browser, and server)
const API_BASE = "";

export async function fetchOrdersApi(): Promise<Order[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.orders || [];
  } catch (err) {
    console.warn("fetchOrdersApi network error:", err);
    return null;
  }
}

export async function createOrderApi(order: Order): Promise<Order | null> {
  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.order || null;
  } catch (err) {
    console.warn("createOrderApi network error:", err);
    return null;
  }
}

export async function updateOrderStatusApi(orderId: string, status: OrderStatus): Promise<Order | null> {
  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.order || null;
  } catch (err) {
    console.warn("updateOrderStatusApi network error:", err);
    return null;
  }
}

export async function deleteOrderApi(orderId: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/orders?orderId=${encodeURIComponent(orderId)}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (err) {
    console.warn("deleteOrderApi network error:", err);
    return false;
  }
}

export async function fetchProductsApi(): Promise<Product[] | null> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.products || [];
  } catch (err) {
    console.warn("fetchProductsApi network error:", err);
    return null;
  }
}

export async function createProductApi(product: Omit<Product, "id" | "createdAt" | "rating" | "reviewsCount">): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product || null;
  } catch (err) {
    console.warn("createProductApi network error:", err);
    return null;
  }
}

export async function updateProductApi(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/api/products`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, updates }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product || null;
  } catch (err) {
    console.warn("updateProductApi network error:", err);
    return null;
  }
}

export async function deleteProductApi(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/products?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (err) {
    console.warn("deleteProductApi network error:", err);
    return false;
  }
}

export async function addReviewApi(productId: string, review: Omit<Review, "id" | "date" | "verified">): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/api/products/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, review }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.product || null;
  } catch (err) {
    console.warn("addReviewApi network error:", err);
    return null;
  }
}

export async function resetVaultApi(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/api/reset`, {
      method: "POST",
    });
    return res.ok;
  } catch (err) {
    console.warn("resetVaultApi network error:", err);
    return false;
  }
}

