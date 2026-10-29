import { NextRequest, NextResponse } from "next/server";
import {
  getCentralOrders,
  saveCentralOrder,
  updateCentralOrderStatus,
  deleteCentralOrder,
} from "@/lib/serverDb";
import {
  saveOrderToFirestore,
  getOrdersFromFirestore,
  updateOrderStatusInFirestore,
  deleteOrderFromFirestore,
} from "@/lib/firestoreService";
import { Order, OrderStatus } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: Fetch all orders centrally from Firebase Firestore / Server Database
export async function GET() {
  try {
    let orders: Order[] = [];
    const firestoreOrders = await getOrdersFromFirestore();

    if (firestoreOrders && Array.isArray(firestoreOrders) && firestoreOrders.length > 0) {
      orders = firestoreOrders;
    } else {
      orders = getCentralOrders();
    }

    return NextResponse.json(
      {
        success: true,
        count: orders.length,
        source: firestoreOrders && firestoreOrders.length > 0 ? "firestore" : "central_db",
        orders,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (error: any) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch orders from cloud database" },
      { status: 500 }
    );
  }
}

// POST: Save an order placed from ANY device (mobile phone, laptop, etc.)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order } = body;

    if (!order || !order.customer || !order.items || order.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order payload" },
        { status: 400 }
      );
    }

    // 1. Direct write to Firebase Firestore
    try {
      await saveOrderToFirestore(order);
    } catch (fsErr) {
      console.warn("Firestore API write notice:", fsErr);
    }

    // 2. Also write to server persistent store
    const saved = saveCentralOrder(order);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed and synced to cloud Firestore successfully",
        order: saved,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to persist order to cloud database" },
      { status: 500 }
    );
  }
}

// PATCH: Update order status (Pending -> Shipped -> Delivered -> Cancelled)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body as { orderId: string; status: OrderStatus };

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: "Missing orderId or status" },
        { status: 400 }
      );
    }

    try {
      await updateOrderStatusInFirestore(orderId, status);
    } catch (fsErr) {
      console.warn("Firestore API update notice:", fsErr);
    }

    const updated = updateCentralOrderStatus(orderId, status);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order status updated in cloud database",
        order: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order status" },
      { status: 500 }
    );
  }
}

// DELETE: Cancel/Remove order from cloud database
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: "Missing orderId parameter" },
        { status: 400 }
      );
    }

    try {
      await deleteOrderFromFirestore(orderId);
    } catch (fsErr) {
      console.warn("Firestore API delete notice:", fsErr);
    }

    const success = deleteCentralOrder(orderId);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Order ${orderId} removed from cloud database`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
