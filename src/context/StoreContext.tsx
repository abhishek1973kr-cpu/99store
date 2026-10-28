"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { Product, Order, CartItem, OrderStatus, PaymentMethod, ShippingAddress, DEFAULT_MRP, DEFAULT_WHOLESALE_PRICE, Review } from "@/types";
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from "@/data/initialData";

export const STORAGE_KEYS = {
  PRODUCTS: "the_99_ornaments_products_v2",
  ORDERS: "the_99_ornaments_orders_v2",
  CART: "the_99_ornaments_cart_v2",
};

interface SyncMessage {
  type: "PRODUCTS_UPDATED" | "ORDERS_UPDATED" | "NEW_ORDER";
  payload?: any;
}

// Safely retrieve orders directly from disk/localStorage
export function getStoredOrdersFromDisk(): Order[] {
  if (typeof window === "undefined") return INITIAL_ORDERS;
  try {
    const raw =
      localStorage.getItem(STORAGE_KEYS.ORDERS) ||
      localStorage.getItem("the_99_ornaments_orders") ||
      localStorage.getItem("the_99_store_orders");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read orders from localStorage, fallback to default", e);
  }
  return INITIAL_ORDERS;
}

// Safely retrieve products directly from disk/localStorage
export function getStoredProductsFromDisk(): Product[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  try {
    const raw =
      localStorage.getItem(STORAGE_KEYS.PRODUCTS) ||
      localStorage.getItem("the_99_ornaments_products") ||
      localStorage.getItem("the_99_store_products");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read products from localStorage, fallback to default", e);
  }
  return INITIAL_PRODUCTS;
}

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt" | "rating" | "reviewsCount">) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetCatalog: () => void;
  getProductById: (id: string) => Product | undefined;
  addReview: (productId: string, review: Omit<Review, "id" | "date" | "verified">) => void;

  // Orders
  orders: Order[];
  placeOrder: (customer: ShippingAddress, items: CartItem[], paymentMethod: PaymentMethod) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  refreshOrdersFromStorage: () => Order[];

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartMrpTotal: number;
  cartSavingsTotal: number;
  cartCount: number;

  // UI Modal & Drawer States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  checkoutItems: CartItem[];
  buyNow: (product: Product) => void;
  openCheckoutWithCart: () => void;
  lastPlacedOrder: Order | null;
  setLastPlacedOrder: (order: Order | null) => void;
  isOrderSuccessOpen: boolean;
  setIsOrderSuccessOpen: (open: boolean) => void;
  isTrackOrderOpen: boolean;
  setIsTrackOrderOpen: (open: boolean) => void;

  // Real-time notification for admin
  recentOrderAlert: Order | null;
  clearOrderAlert: () => void;
  isInitialized: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Modals & UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [recentOrderAlert, setRecentOrderAlert] = useState<Order | null>(null);

  // Broadcast Channel for live real-time sync across multiple tabs
  const broadcastRef = React.useRef<BroadcastChannel | null>(null);

  // Direct sync function to reload orders from disk
  const refreshOrdersFromStorage = useCallback((): Order[] => {
    const freshest = getStoredOrdersFromDisk();
    setOrders(freshest);
    return freshest;
  }, []);

  // Helper to persist & broadcast orders
  const saveOrders = useCallback((updated: Order[], newOrder?: Order) => {
    setOrders(updated);
    if (typeof window !== "undefined") {
      try {
        const serialized = JSON.stringify(updated);
        localStorage.setItem(STORAGE_KEYS.ORDERS, serialized);
        // Fallback keys to ensure zero cross-version or migration drop
        localStorage.setItem("the_99_ornaments_orders", serialized);
        localStorage.setItem("the_99_store_orders", serialized);
      } catch (e) {
        console.error("Failed to write orders to localStorage", e);
      }

      // 1. Dispatch custom event for same-tab / same-window components
      try {
        window.dispatchEvent(
          new CustomEvent("ornaments_orders_updated", {
            detail: newOrder || updated,
          })
        );
      } catch (err) {
        console.warn("Could not dispatch ornaments_orders_updated event", err);
      }

      // 2. Broadcast across tabs via BroadcastChannel
      try {
        if (newOrder) {
          broadcastRef.current?.postMessage({ type: "NEW_ORDER", payload: newOrder });
        } else {
          broadcastRef.current?.postMessage({ type: "ORDERS_UPDATED" });
        }
      } catch (err) {
        console.warn("Broadcast postMessage error", err);
      }
    }
  }, []);

  // Helper to persist & broadcast products
  const saveProducts = useCallback((updated: Product[]) => {
    setProducts(updated);
    if (typeof window !== "undefined") {
      try {
        const serialized = JSON.stringify(updated);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, serialized);
        localStorage.setItem("the_99_ornaments_products", serialized);
        localStorage.setItem("the_99_store_products", serialized);
      } catch (e) {
        console.error("Failed to write products to localStorage", e);
      }

      try {
        window.dispatchEvent(new CustomEvent("ornaments_products_updated", { detail: updated }));
      } catch {}

      try {
        broadcastRef.current?.postMessage({ type: "PRODUCTS_UPDATED" });
      } catch {}
    }
  }, []);

  // 1. Initial Load from LocalStorage & Live Event Handlers
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const storedProds = getStoredProductsFromDisk();
      setProducts(storedProds);

      const storedOrds = getStoredOrdersFromDisk();
      setOrders(storedOrds);

      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error("Failed to load store data from localStorage", e);
    } finally {
      setIsInitialized(true);
    }

    // Initialize BroadcastChannel
    try {
      const channel = new BroadcastChannel("the_99_ornaments_sync_channel");
      broadcastRef.current = channel;

      channel.onmessage = (event: MessageEvent<SyncMessage>) => {
        const { type, payload } = event.data;
        if (type === "PRODUCTS_UPDATED") {
          const freshProds = getStoredProductsFromDisk();
          setProducts(freshProds);
        } else if (type === "ORDERS_UPDATED" || type === "NEW_ORDER") {
          const freshOrds = getStoredOrdersFromDisk();
          setOrders(freshOrds);
          if (type === "NEW_ORDER" && payload) {
            setRecentOrderAlert(payload);
          }
        }
      };
    } catch (err) {
      console.warn("BroadcastChannel not supported in this environment", err);
    }

    // Multi-Window / Storage event listener
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ORDERS || e.key === "the_99_ornaments_orders") {
        const freshOrds = getStoredOrdersFromDisk();
        setOrders(freshOrds);
      } else if (e.key === STORAGE_KEYS.PRODUCTS || e.key === "the_99_ornaments_products") {
        const freshProds = getStoredProductsFromDisk();
        setProducts(freshProds);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // In-Window Custom Event listener
    const handleCustomOrdersUpdate = (e: Event) => {
      const freshOrds = getStoredOrdersFromDisk();
      setOrders(freshOrds);
      const customDetail = (e as CustomEvent).detail;
      if (customDetail && !Array.isArray(customDetail) && customDetail.id) {
        setRecentOrderAlert(customDetail);
      }
    };
    window.addEventListener("ornaments_orders_updated", handleCustomOrdersUpdate);

    // Tab visibility & focus change handlers (instant sync when switching tabs)
    const handleTabFocus = () => {
      refreshOrdersFromStorage();
    };
    window.addEventListener("focus", handleTabFocus);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshOrdersFromStorage();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("ornaments_orders_updated", handleCustomOrdersUpdate);
      window.removeEventListener("focus", handleTabFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (broadcastRef.current) {
        broadcastRef.current.close();
      }
    };
  }, [refreshOrdersFromStorage]);

  // Save Cart state to localStorage
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
  }, [cart, isInitialized]);

  // PRODUCT CRUD
  const addProduct = useCallback(
    (productData: Omit<Product, "id" | "createdAt" | "rating" | "reviewsCount">) => {
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
        id: `orn-custom-${Date.now()}`,
        mrp: productData.mrp || DEFAULT_MRP,
        price: productData.price || DEFAULT_WHOLESALE_PRICE,
        rating: 5.0,
        reviewsCount: 1,
        images: validImages,
        image: validImages[0],
        createdAt: new Date().toISOString(),
      };

      const diskProds = getStoredProductsFromDisk();
      const updated = [newProduct, ...diskProds.filter((p) => p.id !== newProduct.id)];
      saveProducts(updated);
      return newProduct;
    },
    [saveProducts]
  );

  const updateProduct = useCallback(
    (id: string, updates: Partial<Product>) => {
      const diskProds = getStoredProductsFromDisk();
      const updated = diskProds.map((p) => {
        if (p.id === id) {
          const merged = { ...p, ...updates };
          if (updates.images && updates.images.length > 0) {
            merged.image = updates.images[0];
          }
          return merged;
        }
        return p;
      });
      saveProducts(updated);
      if (activeProductModal && activeProductModal.id === id) {
        const found = updated.find((p) => p.id === id);
        if (found) setActiveProductModal(found);
      }
    },
    [saveProducts, activeProductModal]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const diskProds = getStoredProductsFromDisk();
      const updated = diskProds.filter((p) => p.id !== id);
      saveProducts(updated);
      setCart((prev) => prev.filter((item) => item.product.id !== id));
      if (activeProductModal?.id === id) {
        setActiveProductModal(null);
      }
    },
    [saveProducts, activeProductModal]
  );

  const resetCatalog = useCallback(() => {
    saveProducts(INITIAL_PRODUCTS);
    saveOrders(INITIAL_ORDERS);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.CART);
  }, [saveProducts, saveOrders]);

  const getProductById = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  const addReview = useCallback(
    (productId: string, reviewInput: Omit<Review, "id" | "date" | "verified">) => {
      const newReview: Review = {
        ...reviewInput,
        id: `rev-${Date.now()}`,
        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
        verified: true,
      };

      const diskProds = getStoredProductsFromDisk();
      const updated = diskProds.map((p) => {
        if (p.id === productId) {
          const existingReviews = p.reviews || [];
          const updatedReviews = [newReview, ...existingReviews];
          const newReviewsCount = p.reviewsCount + 1;
          const newRating = Number(((p.rating * p.reviewsCount + reviewInput.rating) / newReviewsCount).toFixed(1));
          return {
            ...p,
            rating: newRating,
            reviewsCount: newReviewsCount,
            reviews: updatedReviews,
          };
        }
        return p;
      });

      saveProducts(updated);

      if (activeProductModal && activeProductModal.id === productId) {
        const updatedProd = updated.find((p) => p.id === productId);
        if (updatedProd) setActiveProductModal(updatedProd);
      }
    },
    [saveProducts, activeProductModal]
  );

  // CART OPERATIONS
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  const updateCartQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const buyNow = useCallback((product: Product) => {
    setCheckoutItems([{ product, quantity: 1 }]);
    setIsCheckoutOpen(true);
  }, []);

  const openCheckoutWithCart = useCallback(() => {
    if (cart.length === 0) return;
    setCheckoutItems([...cart]);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, [cart]);

  // ORDERS OPERATIONS - 100% Guaranteed Persistent & Live Synchronized
  const placeOrder = useCallback(
    (customer: ShippingAddress, items: CartItem[], paymentMethod: PaymentMethod): Order => {
      const orderItems = items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        category: item.product.category,
        mrp: item.product.mrp || DEFAULT_MRP,
        price: item.product.price || DEFAULT_WHOLESALE_PRICE,
        quantity: item.quantity,
        image: item.product.images?.[0] || item.product.image || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        images: item.product.images,
      }));

      const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = items.reduce((sum, item) => sum + (item.product.price || DEFAULT_WHOLESALE_PRICE) * item.quantity, 0);
      const totalMrp = items.reduce((sum, item) => sum + (item.product.mrp || DEFAULT_MRP) * item.quantity, 0);
      const totalSavings = Math.max(0, totalMrp - totalAmount);

      const uniqueSuffix = Date.now().toString().slice(-4) + Math.floor(100 + Math.random() * 900);
      const newOrder: Order = {
        id: `ORD-99-${uniqueSuffix}`,
        customer,
        items: orderItems,
        totalAmount,
        totalMrp,
        totalSavings,
        itemCount: totalItemsCount,
        paymentMethod,
        paymentStatus: paymentMethod === "ONLINE" ? "PAID" : "PENDING",
        status: "Pending",
        trackingNumber: `EXP-ROYAL-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 1. Read existing orders directly from localStorage to ensure NO overwrite of recent items
      const existingDiskOrders = getStoredOrdersFromDisk();
      const updatedOrders = [newOrder, ...existingDiskOrders.filter((o) => o.id !== newOrder.id)];

      // 2. Persist to storage immediately and broadcast
      saveOrders(updatedOrders, newOrder);

      // 3. Decrement stock in products
      const diskProds = getStoredProductsFromDisk();
      const updatedProducts = diskProds.map((prod) => {
        const boughtItem = items.find((i) => i.product.id === prod.id);
        if (boughtItem) {
          const newStock = Math.max(0, prod.stock - boughtItem.quantity);
          return { ...prod, stock: newStock };
        }
        return prod;
      });
      saveProducts(updatedProducts);

      // 4. Remove purchased items from cart
      setCart((prevCart) => {
        const itemIdsInOrder = new Set(items.map((i) => i.product.id));
        return prevCart.filter((c) => !itemIdsInOrder.has(c.product.id));
      });

      // 5. Update user view modal states
      setLastPlacedOrder(newOrder);
      setIsCheckoutOpen(false);
      setIsOrderSuccessOpen(true);

      return newOrder;
    },
    [saveOrders, saveProducts]
  );

  const updateOrderStatus = useCallback(
    (orderId: string, status: OrderStatus) => {
      const diskOrders = getStoredOrdersFromDisk();
      const updated = diskOrders.map((order) => {
        if (order.id === orderId) {
          const isDelivered = status === "Delivered";
          return {
            ...order,
            status,
            updatedAt: new Date().toISOString(),
            paymentStatus: isDelivered && order.paymentMethod === "COD" ? ("PAID" as const) : order.paymentStatus,
          };
        }
        return order;
      });
      saveOrders(updated);
    },
    [saveOrders]
  );

  const deleteOrder = useCallback(
    (orderId: string) => {
      const diskOrders = getStoredOrdersFromDisk();
      const updated = diskOrders.filter((o) => o.id !== orderId);
      saveOrders(updated);
    },
    [saveOrders]
  );

  const clearOrderAlert = useCallback(() => {
    setRecentOrderAlert(null);
  }, []);

  // Computed Cart Totals
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price || DEFAULT_WHOLESALE_PRICE) * item.quantity, 0);
  }, [cart]);

  const cartMrpTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.mrp || DEFAULT_MRP) * item.quantity, 0);
  }, [cart]);

  const cartSavingsTotal = useMemo(() => {
    return Math.max(0, cartMrpTotal - cartTotal);
  }, [cartMrpTotal, cartTotal]);

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetCatalog,
    getProductById,
    addReview,
    orders,
    placeOrder,
    updateOrderStatus,
    deleteOrder,
    refreshOrdersFromStorage,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartMrpTotal,
    cartSavingsTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    activeProductModal,
    setActiveProductModal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    checkoutItems,
    buyNow,
    openCheckoutWithCart,
    lastPlacedOrder,
    setLastPlacedOrder,
    isOrderSuccessOpen,
    setIsOrderSuccessOpen,
    isTrackOrderOpen,
    setIsTrackOrderOpen,
    recentOrderAlert,
    clearOrderAlert,
    isInitialized,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
