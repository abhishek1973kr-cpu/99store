import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  Unsubscribe,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { Order, Product, OrderStatus, Review, HeroSlide } from "@/types";
import { INITIAL_PRODUCTS, INITIAL_ORDERS, DEFAULT_HERO_SLIDES } from "@/data/initialData";

const ORDERS_COLLECTION = "orders";
const PRODUCTS_COLLECTION = "products";
const SETTINGS_COLLECTION = "settings";

// ==========================================
// ORDERS FIRESTORE CRUD & REAL-TIME LISTENER
// ==========================================

/**
 * Direct real-time write of an order to Firebase Firestore.
 * Ensures orders placed from any mobile phone or external browser
 * persist immediately in the cloud database.
 */
export async function saveOrderToFirestore(order: Order): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) {
    return false;
  }

  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, order.id);
    const writePromise = setDoc(
      orderDocRef,
      {
        ...order,
        createdAt: order.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // Strict 2-second timeout so user checkout can never hang
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Firestore write timeout")), 2000)
    );

    await Promise.race([writePromise, timeoutPromise]);

    // Also update product stock in Firestore if items present
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        try {
          const prodRef = doc(db, PRODUCTS_COLLECTION, item.productId);
          const snap = await getDoc(prodRef);
          if (snap.exists()) {
            const currentStock = snap.data().stock ?? 20;
            const newStock = Math.max(0, currentStock - item.quantity);
            await updateDoc(prodRef, { stock: newStock });
          }
        } catch (stockErr) {
          console.warn("Stock decrement warning for item:", item.productId, stockErr);
        }
      }
    }

    return true;
  } catch (error) {
    console.warn("Firestore save order notice:", error);
    return false;
  }
}

/**
 * Fetch all orders once from Firestore.
 */
export async function getOrdersFromFirestore(): Promise<Order[] | null> {
  if (!isFirebaseConfigured() || !db) return null;

  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    const q = query(ordersCol, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return [];
    }

    const orders: Order[] = [];
    snapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as Order);
    });

    return orders;
  } catch (error) {
    console.warn("Firestore fetch orders notice:", error);
    return null;
  }
}

/**
 * Real-time orders listener.
 * Whenever any customer places an order from their phone,
 * this listener fires instantly in the Admin Panel without polling or manual refresh.
 */
export function subscribeToOrdersFromFirestore(
  onOrdersChange: (orders: Order[]) => void,
  onError?: (error: Error) => void
): Unsubscribe | null {
  if (!isFirebaseConfigured() || !db) return null;

  try {
    const ordersCol = collection(db, ORDERS_COLLECTION);
    const q = query(ordersCol, orderBy("createdAt", "desc"));

    return onSnapshot(
      q,
      (snapshot) => {
        const orders: Order[] = [];
        snapshot.forEach((docSnap) => {
          orders.push(docSnap.data() as Order);
        });
        onOrdersChange(orders);
      },
      (error) => {
        console.warn("Firestore orders subscription notice:", error);
        onError?.(error);
      }
    );
  } catch (err: any) {
    console.warn("Could not attach orders subscription:", err);
    return null;
  }
}

/**
 * Update order status (Pending -> Shipped -> Delivered -> Cancelled) in Firestore.
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  status: OrderStatus
): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false;

  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderDocRef, {
      status,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.warn("Firestore update order status notice:", error);
    return false;
  }
}

/**
 * Delete an order in Firestore.
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false;

  try {
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await deleteDoc(orderDocRef);
    return true;
  } catch (error) {
    console.warn("Firestore delete order notice:", error);
    return false;
  }
}

// ==========================================
// PRODUCTS FIRESTORE CRUD & REAL-TIME LISTENER
// ==========================================

/**
 * Fetch all products from Firestore.
 */
export async function getProductsFromFirestore(): Promise<Product[] | null> {
  if (!isFirebaseConfigured() || !db) return null;

  try {
    const prodsCol = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(prodsCol);

    if (snapshot.empty) {
      return null;
    }

    const products: Product[] = [];
    snapshot.forEach((docSnap) => {
      products.push(docSnap.data() as Product);
    });

    return products;
  } catch (error) {
    console.warn("Firestore fetch products notice:", error);
    return null;
  }
}

/**
 * Real-time products listener.
 * Reflects product edits/additions made in Admin on user phones instantly.
 */
export function subscribeToProductsFromFirestore(
  onProductsChange: (products: Product[]) => void,
  onError?: (error: Error) => void
): Unsubscribe | null {
  if (!isFirebaseConfigured() || !db) return null;

  try {
    const prodsCol = collection(db, PRODUCTS_COLLECTION);

    return onSnapshot(
      prodsCol,
      (snapshot) => {
        if (!snapshot.empty) {
          const products: Product[] = [];
          snapshot.forEach((docSnap) => {
            products.push(docSnap.data() as Product);
          });
          onProductsChange(products);
        }
      },
      (error) => {
        console.warn("Firestore products subscription notice:", error);
        onError?.(error);
      }
    );
  } catch (err: any) {
    console.warn("Could not attach products subscription:", err);
    return null;
  }
}

/**
 * Save / Create a new product in Firestore.
 */
export async function saveProductToFirestore(product: Product): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false;

  try {
    const prodDocRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(prodDocRef, product, { merge: true });
    return true;
  } catch (error) {
    console.warn("Firestore save product notice:", error);
    return false;
  }
}

/**
 * Update an existing product in Firestore.
 */
export async function updateProductInFirestore(
  productId: string,
  updates: Partial<Product>
): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false;

  try {
    const prodDocRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(prodDocRef, updates);
    return true;
  } catch (error) {
    console.warn("Firestore update product notice:", error);
    return false;
  }
}

/**
 * Delete a product from Firestore.
 */
export async function deleteProductFromFirestore(productId: string): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false;

  try {
    const prodDocRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(prodDocRef);
    return true;
  } catch (error) {
    console.warn("Firestore delete product notice:", error);
    return false;
  }
}

/**
 * Add a review to a product in Firestore.
 */
export async function addReviewInFirestore(
  productId: string,
  reviewInput: Omit<Review, "id" | "date" | "verified">
): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false;

  try {
    const prodDocRef = doc(db, PRODUCTS_COLLECTION, productId);
    const snap = await getDoc(prodDocRef);
    if (!snap.exists()) return false;

    const prod = snap.data() as Product;
    const newReview: Review = {
      ...reviewInput,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      verified: true,
    };

    const existingReviews = prod.reviews || [];
    const updatedReviews = [newReview, ...existingReviews];
    const newCount = (prod.reviewsCount || 0) + 1;
    const newRating = Number((((prod.rating || 5) * (prod.reviewsCount || 1) + reviewInput.rating) / newCount).toFixed(1));

    await updateDoc(prodDocRef, {
      reviews: updatedReviews,
      reviewsCount: newCount,
      rating: newRating,
    });

    return true;
  } catch (error) {
    console.warn("Firestore add review notice:", error);
    return false;
  }
}

/**
 * Seed initial curated products to Firestore if collection is empty.
 */
export async function seedInitialProductsToFirestore(): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;

  try {
    const prodsCol = collection(db, PRODUCTS_COLLECTION);
    const snap = await getDocs(prodsCol);

    if (snap.empty) {
      console.log("Seeding 25 curated ornaments to cloud Firestore...");
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), prod);
      }
    }
  } catch (err) {
    console.warn("Firestore initial seeding notice:", err);
  }
}

// ==========================================
// HERO SLIDES SETTINGS IN FIRESTORE
// ==========================================

export async function getHeroSlidesFromFirestore(): Promise<HeroSlide[] | null> {
  if (!isFirebaseConfigured() || !db) return null;

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, "heroSlides");
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data().slides) {
      return snap.data().slides as HeroSlide[];
    }
    return null;
  } catch (err) {
    console.warn("Could not get hero slides from Firestore:", err);
    return null;
  }
}

export async function saveHeroSlidesToFirestore(slides: HeroSlide[]): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) return false;

  try {
    const docRef = doc(db, SETTINGS_COLLECTION, "heroSlides");
    await setDoc(docRef, { slides, updatedAt: new Date().toISOString() }, { merge: true });
    return true;
  } catch (err) {
    console.warn("Could not save hero slides to Firestore:", err);
    return false;
  }
}

