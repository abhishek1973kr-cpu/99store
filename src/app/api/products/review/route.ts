import { NextRequest, NextResponse } from "next/server";
import { addCentralProductReview } from "@/lib/serverDb";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, review } = body;

    if (!productId || !review) {
      return NextResponse.json(
        { success: false, error: "Missing productId or review payload" },
        { status: 400 }
      );
    }

    const updated = addCentralProductReview(productId, review);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Review added centrally",
        product: updated,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/products/review error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add review centrally" },
      { status: 500 }
    );
  }
}

