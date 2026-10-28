import { NextRequest, NextResponse } from "next/server";
import {
  getCentralOrders,
  saveCentralOrder,
  updateCentralOrderStatus,
  deleteCentralOrder,
} from "@/lib/serverDb";
import { Order, OrderStatus } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: Fetch all orders centrally from the cloud database
export async function GET() {
  try {
    const orders = getCentralOrders();
    return NextResponse.json(
      {
        success: true,
        count: orders.length,
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
      { success: false, error: "Failed to fetch orders from central database" },
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

    const saved = saveCentralOrder(order);

    return NextResponse.json(
      {
        success: true,
        message: "Order placed and synced to central vault database successfully",
        order: saved,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to persist order to central database" },
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
        message: "Order status updated centrally",
        order: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update order in central database" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an order from the central database
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

    const deleted = deleteCentralOrder(orderId);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order deleted from central database",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete order from central database" },
      { status: 500 }
    );
  }
}

