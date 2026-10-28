import { NextRequest, NextResponse } from "next/server";
import {
  getCentralProducts,
  saveCentralProduct,
  updateCentralProduct,
  deleteCentralProduct,
} from "@/lib/serverDb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: Fetch all products from the central database
export async function GET() {
  try {
    const products = getCentralProducts();
    return NextResponse.json(
      {
        success: true,
        count: products.length,
        products,
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
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products from central database" },
      { status: 500 }
    );
  }
}

// POST: Add a new product centrally (with 5+ images, MRP ₹349, Wholesale ₹99)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product } = body;

    if (!product || !product.name || !product.category) {
      return NextResponse.json(
        { success: false, error: "Missing required product fields" },
        { status: 400 }
      );
    }

    const saved = saveCentralProduct(product);

    return NextResponse.json(
      {
        success: true,
        message: "Product created and synced centrally",
        product: saved,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create product in central database" },
      { status: 500 }
    );
  }
}

// PATCH: Update an existing product
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json(
        { success: false, error: "Missing product id or updates" },
        { status: 400 }
      );
    }

    const updated = updateCentralProduct(id, updates);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product updated centrally",
        product: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PATCH /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product in central database" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a product
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing product id parameter" },
        { status: 400 }
      );
    }

    const deleted = deleteCentralProduct(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted from central database",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product from central database" },
      { status: 500 }
    );
  }
}
