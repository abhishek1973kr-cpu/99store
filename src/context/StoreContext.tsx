"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback, useRef } from "react";
import { Product, Order, CartItem, OrderStatus, PaymentMethod, ShippingAddress, DEFAULT_MRP, DEFAULT_WHOLESALE_PRICE, Review, HeroSlide } from "@/types";
import { INITIAL_PRODUCTS, INITIAL_ORDERS, DEFAULT_HERO_SLIDES } from "@/data/initialData";
import {
  fetchOrdersApi,
  createOrderApi,
  updateOrderStatusApi,
  deleteOrderApi,
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  addReviewApi,
  resetVaultApi,
  fetchHeroSlidesApi,
  updateHeroSlidesApi,
} from "@/lib/api";
import {
  saveOrderToFirestore,
  getOrdersFromFirestore,
  subscribeToOrdersFromFirestore,
  updateOrderStatusInFirestore,
  deleteOrderFromFirestore,
  getProductsFromFirestore,
  subscribeToProductsFromFirestore,
  saveProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
  addReviewInFirestore,
  seedInitialProductsToFirestore,
  getHeroSlidesFromFirestore,
  saveHeroSlidesToFirestore,
} from "@/lib/firestoreService";
import { isFirebaseConfigured } from "@/lib/firebase";

export const STORAGE_KEYS = {
  PRODUCTS: "the_99_ornaments_products_v2",
  ORDERS: "the_99_ornaments_orders_v2",
  CART: "the_99_ornaments_cart_v2",
};

interface SyncMessage {
  type: "PRODUCTS_UPDATED" | "ORDERS_UPDATED" | "NEW_ORDER";
  payload?: any;
}

// Local cache reader for instant zero-flash initial render
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
    console.warn("Could not read orders from local cache, fallback to initial", e);
  }
  return INITIAL_ORDERS;
}

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
    console.warn("Could not read products from local cache, fallback to initial", e);
  }
  return INITIAL_PRODUCTS;
}

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt" | "rating" | "reviewsCount">) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetCatalog: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  addReview: (productId: string, review: Omit<Review, "id" | "date" | "verified">) => Promise<void>;

  // Orders
  orders: Order[];
  placeOrder: (customer: ShippingAddress, items: CartItem[], paymentMethod: PaymentMethod) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  refreshOrdersFromStorage: () => Promise<Order[]>;

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

  // Hero Background Slides
  heroSlides: HeroSlide[];
  updateHeroSlides: (slides: HeroSlide[]) => Promise<void>;
  resetHeroSlides: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(DEFAULT_HERO_SLIDES);
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

  const broadcastRef = useRef<BroadcastChannel | null>(null);
  const knownOrderIdsRef = useRef<Set<string>>(new Set());

  // Helper to persist & broadcast cache locally
  const cacheOrdersLocally = useCallback((updated: Order[]) => {
    if (typeof window !== "undefined") {
      try {
        const serialized = JSON.stringify(updated);
        localStorage.setItem(STORAGE_KEYS.ORDERS, serialized);
        localStorage.setItem("the_99_ornaments_orders", serialized);
      } catch (e) {
        console.warn("Local storage cache write failed:", e);
      }
    }
  }, []);

  const cacheProductsLocally = useCallback((updated: Product[]) => {
    if (typeof window !== "undefined") {
      try {
        const serialized = JSON.stringify(updated);
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, serialized);
      } catch (e) {
        console.warn("Local storage cache write failed:", e);
      }
    }
  }, []);

  // Central Database Fetch: Orders
  const syncOrdersFromCloud = useCallback(async (): Promise<Order[]> => {
    const cloudOrders = await fetchOrdersApi();
    if (cloudOrders && Array.isArray(cloudOrders)) {
      setOrders((prev) => {
        // Detect if any new order arrived from another phone/device
        const prevIds = new Set(prev.map((o) => o.id));
        const newIncoming = cloudOrders.filter((o) => !prevIds.has(o.id));
        if (newIncoming.length > 0 && prev.length > 0) {
          // If a new order is detected from an external phone, trigger admin alert toast
          setRecentOrderAlert(newIncoming[0]);
        }
        return cloudOrders;
      });

      // Update known IDs
      knownOrderIdsRef.current = new Set(cloudOrders.map((o) => o.id));
      cacheOrdersLocally(cloudOrders);
      return cloudOrders;
    }
    return [];
  }, [cacheOrdersLocally]);

  // Central Database Fetch: Products
  const syncProductsFromCloud = useCallback(async (): Promise<Product[]> => {
    const cloudProducts = await fetchProductsApi();
    if (cloudProducts && Array.isArray(cloudProducts) && cloudProducts.length > 0) {
      setProducts(cloudProducts);
      cacheProductsLocally(cloudProducts);
      return cloudProducts;
    }
    return [];
  }, [cacheProductsLocally]);

  // Central Database Fetch: Hero Slides
  const syncHeroSlidesFromCloud = useCallback(async () => {
    try {
      const slides = await fetchHeroSlidesApi();
      if (slides && Array.isArray(slides) && slides.length > 0) {
        setHeroSlides(slides);
      }
    } catch (e) {
      console.warn("Could not sync hero slides from cloud:", e);
    }
  }, []);

  // Direct sync function accessible by components
  const refreshOrdersFromStorage = useCallback(async (): Promise<Order[]> => {
    return await syncOrdersFromCloud();
  }, [syncOrdersFromCloud]);

  // 1. Initial Load from Cloud DB + Fast Local Cache Fallback
  useEffect(() => {
    if (typeof window === "undefined") return;

    // A. Fast initial population from cache
    const cachedProds = getStoredProductsFromDisk();
    setProducts(cachedProds);
    const cachedOrds = getStoredOrdersFromDisk();
    setOrders(cachedOrds);
    knownOrderIdsRef.current = new Set(cachedOrds.map((o) => o.id));

    const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch {}
    }
    setIsInitialized(true);

    // B. Immediate fetch from Cloud / Server API
    syncOrdersFromCloud();
    syncProductsFromCloud();
    syncHeroSlidesFromCloud();

    // C. Attach Real-Time Firebase Firestore Listeners (Zero Polling, Instant Multi-Device Sync)
    const unsubOrders = subscribeToOrdersFromFirestore((cloudOrders) => {
      if (cloudOrders && Array.isArray(cloudOrders) && cloudOrders.length > 0) {
        setOrders((prev) => {
          const prevIds = new Set(prev.map((o) => o.id));
          const newIncoming = cloudOrders.filter((o) => !prevIds.has(o.id));
          if (newIncoming.length > 0 && prev.length > 0) {
            // Trigger live toast alert in admin panel
            setRecentOrderAlert(newIncoming[0]);
          }
          return cloudOrders;
        });
        knownOrderIdsRef.current = new Set(cloudOrders.map((o) => o.id));
        cacheOrdersLocally(cloudOrders);
      }
    });

    const unsubProducts = subscribeToProductsFromFirestore((cloudProds) => {
      if (cloudProds && Array.isArray(cloudProds) && cloudProds.length > 0) {
        setProducts(cloudProds);
        cacheProductsLocally(cloudProds);
      }
    });

    // Seed products to Firestore if empty
    seedInitialProductsToFirestore();

    // D. Setup BroadcastChannel for cross-tab sync
    try {
      const channel = new BroadcastChannel("the_99_ornaments_cloud_channel");
      broadcastRef.current = channel;
      channel.onmessage = (event: MessageEvent<SyncMessage>) => {
        if (event.data.type === "ORDERS_UPDATED" || event.data.type === "NEW_ORDER") {
          syncOrdersFromCloud();
          if (event.data.payload) {
            setRecentOrderAlert(event.data.payload);
          }
        } else if (event.data.type === "PRODUCTS_UPDATED") {
          syncProductsFromCloud();
        }
      };
    } catch (e) {
      console.warn("BroadcastChannel not available:", e);
    }

    // E. Multi-Device Real-Time Cloud Polling Loop (Every 2.5s fallback)
    const pollInterval = setInterval(() => {
      syncOrdersFromCloud();
    }, 2500);

    // F. Focus and Visibility handlers (re-fetch immediately when opening or switching tabs)
    const handleFocus = () => {
      syncOrdersFromCloud();
      syncProductsFromCloud();
      syncHeroSlidesFromCloud();
    };
    window.addEventListener("focus", handleFocus);

    const handleVisibility = () => {
      if (!document.hidden) {
        syncOrdersFromCloud();
        syncProductsFromCloud();
        syncHeroSlidesFromCloud();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (unsubOrders) unsubOrders();
      if (unsubProducts) unsubProducts();
      clearInterval(pollInterval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (broadcastRef.current) {
        broadcastRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save Cart to local storage
  useEffect(() => {
    if (!isInitialized || typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  }, [cart, isInitialized]);

  // ==========================================
  // ORDERS OPERATIONS (CLOUD PERSISTENT)
  // ==========================================
  const placeOrder = useCallback(
    async (customer: ShippingAddress, items: CartItem[], paymentMethod: PaymentMethod): Promise<Order> => {
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

      // 1. Optimistic local state update
      setOrders((prev) => {
        const updated = [newOrder, ...prev.filter((o) => o.id !== newOrder.id)];
        cacheOrdersLocally(updated);
        return updated;
      });

      // 2. Direct write to Firebase Firestore (Real-time Cloud Database)
      saveOrderToFirestore(newOrder).catch((fsErr) => {
        console.warn("Direct Firestore order write notice:", fsErr);
      });

      // 3. Transmit to Cloud / Central Server Database
      try {
        const savedCloudOrder = await createOrderApi(newOrder);
        if (savedCloudOrder) {
          // Notify other tabs
          broadcastRef.current?.postMessage({ type: "NEW_ORDER", payload: savedCloudOrder });
        }
      } catch (err) {
        console.error("Cloud DB order creation error:", err);
      }

      // 4. Clear cart items
      setCart((prevCart) => {
        const itemIdsInOrder = new Set(items.map((i) => i.product.id));
        return prevCart.filter((c) => !itemIdsInOrder.has(c.product.id));
      });

      // 5. Update UI modal states
      setLastPlacedOrder(newOrder);
      setIsCheckoutOpen(false);
      setIsOrderSuccessOpen(true);

      return newOrder;
    },
    [cacheOrdersLocally]
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus): Promise<void> => {
      // Optimistic update
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === orderId) {
            const isDelivered = status === "Delivered";
            return {
              ...order,
              status,
              updatedAt: new Date().toISOString(),
              paymentStatus: isDelivered && order.paymentMethod === "COD" ? "PAID" : order.paymentStatus,
            };
          }
          return order;
        })
      );

      // Direct Firestore update
      try {
        await updateOrderStatusInFirestore(orderId, status);
      } catch (fsErr) {
        console.warn("Direct Firestore status update notice:", fsErr);
      }

      // Cloud database update
      try {
        await updateOrderStatusApi(orderId, status);
        broadcastRef.current?.postMessage({ type: "ORDERS_UPDATED" });
      } catch (err) {
        console.error("Cloud DB order status update failed:", err);
      }
    },
    []
  );

  const deleteOrder = useCallback(
    async (orderId: string): Promise<void> => {
      // Optimistic update
      setOrders((prev) => prev.filter((o) => o.id !== orderId));

      // Direct Firestore delete
      try {
        await deleteOrderFromFirestore(orderId);
      } catch (fsErr) {
        console.warn("Direct Firestore delete notice:", fsErr);
      }

      // Cloud database delete
      try {
        await deleteOrderApi(orderId);
        broadcastRef.current?.postMessage({ type: "ORDERS_UPDATED" });
      } catch (err) {
        console.error("Cloud DB order delete failed:", err);
      }
    },
    []
  );

  // ==========================================
  // PRODUCTS OPERATIONS (CLOUD PERSISTENT)
  // ==========================================
  const addProduct = useCallback(
    async (productData: Omit<Product, "id" | "createdAt" | "rating" | "reviewsCount">): Promise<Product> => {
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

      // Optimistic
      setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);

      // Direct write to Firebase Firestore
      try {
        await saveProductToFirestore(newProduct);
      } catch (fsErr) {
        console.warn("Direct Firestore product write notice:", fsErr);
      }

      // Cloud
      try {
        const saved = await createProductApi(productData);
        if (saved) {
          setProducts((prev) => [saved, ...prev.filter((p) => p.id !== saved.id && p.id !== newProduct.id)]);
          broadcastRef.current?.postMessage({ type: "PRODUCTS_UPDATED" });
          return saved;
        }
      } catch (err) {
        console.error("Cloud DB product create error:", err);
      }

      return newProduct;
    },
    []
  );

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>): Promise<void> => {
      // Optimistic
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === id) {
            const merged = { ...p, ...updates };
            if (updates.images && updates.images.length > 0) {
              merged.image = updates.images[0];
            }
            return merged;
          }
          return p;
        })
      );

      // Direct Firestore update
      try {
        await updateProductInFirestore(id, updates);
      } catch (fsErr) {
        console.warn("Direct Firestore product update notice:", fsErr);
      }

      // Cloud
      try {
        await updateProductApi(id, updates);
        broadcastRef.current?.postMessage({ type: "PRODUCTS_UPDATED" });
      } catch (err) {
        console.error("Cloud DB product update error:", err);
      }
    },
    []
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<void> => {
      // Optimistic
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setCart((prev) => prev.filter((item) => item.product.id !== id));

      // Direct Firestore delete
      try {
        await deleteProductFromFirestore(id);
      } catch (fsErr) {
        console.warn("Direct Firestore product delete notice:", fsErr);
      }

      // Cloud
      try {
        await deleteProductApi(id);
        broadcastRef.current?.postMessage({ type: "PRODUCTS_UPDATED" });
      } catch (err) {
        console.error("Cloud DB product delete error:", err);
      }
    },
    []
  );

  const addReview = useCallback(
    async (productId: string, reviewInput: Omit<Review, "id" | "date" | "verified">): Promise<void> => {
      const newReview: Review = {
        ...reviewInput,
        id: `rev-${Date.now()}`,
        date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
        verified: true,
      };

      // Optimistic
      setProducts((prev) =>
        prev.map((p) => {
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
        })
      );

      // Direct Firestore add review
      try {
        await addReviewInFirestore(productId, reviewInput);
      } catch (fsErr) {
        console.warn("Direct Firestore add review notice:", fsErr);
      }

      // Cloud
      try {
        await addReviewApi(productId, reviewInput);
        broadcastRef.current?.postMessage({ type: "PRODUCTS_UPDATED" });
      } catch (err) {
        console.error("Cloud DB review add error:", err);
      }
    },
    []
  );

  const resetCatalog = useCallback(async (): Promise<void> => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.CART);

    try {
      await resetVaultApi();
      broadcastRef.current?.postMessage({ type: "ORDERS_UPDATED" });
      broadcastRef.current?.postMessage({ type: "PRODUCTS_UPDATED" });
    } catch (err) {
      console.error("Cloud DB reset error:", err);
    }
  }, []);

  const getProductById = useCallback(
    (id: string) => {
      return products.find((p) => p.id === id);
    },
    [products]
  );

  // Cart operations
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
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
      prevCart.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
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

  const clearOrderAlert = useCallback(() => {
    setRecentOrderAlert(null);
  }, []);

  const updateHeroSlides = useCallback(async (slides: HeroSlide[]) => {
    setHeroSlides(slides);
    try {
      await saveHeroSlidesToFirestore(slides);
    } catch (fsErr) {
      console.warn("Direct Firestore hero slides save notice:", fsErr);
    }
    await updateHeroSlidesApi(slides);
  }, []);

  const resetHeroSlides = useCallback(async () => {
    setHeroSlides(DEFAULT_HERO_SLIDES);
    await updateHeroSlidesApi(DEFAULT_HERO_SLIDES);
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
    heroSlides,
    updateHeroSlides,
    resetHeroSlides,
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
