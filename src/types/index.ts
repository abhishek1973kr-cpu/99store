export const DEFAULT_MRP = 349;
export const DEFAULT_WHOLESALE_PRICE = 99;

export type OrnamentCategory = "Ladies Ornaments" | "Gents Ornaments";

export interface Review {
  id: string;
  author: string;
  city: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: OrnamentCategory | string;
  mrp: number; // Original MRP (default ₹349)
  price: number; // Special Wholesale Price (default ₹99)
  images: string[]; // Minimum 5 images required
  image: string; // Primary image (convenience alias to images[0])
  stock: number;
  badge?: "Wholesale Deal" | "Artisan Royal" | "Bestseller" | "Limited Reserve" | "Pure 24K Plated";
  rating: number;
  reviewsCount: number;
  reviews?: Review[];
  features: string[];
  metal: string;
  weight?: string;
  dimensions?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentMethod = "ONLINE" | "COD";

export interface OrderItem {
  productId: string;
  name: string;
  category?: string;
  mrp: number;
  price: number; // Wholesale price paid (₹99)
  quantity: number;
  image: string;
  images?: string[];
}

export interface Order {
  id: string;
  customer: ShippingAddress;
  items: OrderItem[];
  totalAmount: number; // Sum of price * quantity
  totalMrp: number; // Sum of mrp * quantity
  totalSavings: number; // totalMrp - totalAmount
  itemCount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: "PAID" | "PENDING";
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  notes?: string;
}

export interface StoreStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalProducts: number;
  ladiesCount: number;
  gentsCount: number;
}

export interface HeroSlide {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  badge: string;
  category?: string;
}

