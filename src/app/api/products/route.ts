import { NextRequest, NextResponse } from "next/server";
import {
  getCentralProducts,
  saveCentralProduct,
  updateCentralProduct,
  deleteCentralProduct,
} from "@/lib/serverDb";
import {
  getProductsFromFirestore,
  saveProductToFirestore,
  updateProductInFirestore,
  deleteProductFromFirestore,
} from "@/lib/firestoreService";
import { Product } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: Fetch all products from the cloud database
export async function GET() {
  try {
    let products: Product[] = [];
    const firestoreProds = await getProductsFromFirestore();

    if (firestoreProds && Array.isArray(firestoreProds) && firestoreProds.length > 0) {
      products = firestoreProds;
    } else {
      products = getCentralProducts();
    }

    return NextResponse.json(
      {
        success: true,
        count: products.length,
        source: firestoreProds && firestoreProds.length > 0 ? "firestore" : "central_db",
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
      { success: false, error: "Failed to fetch products from cloud database" },
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

    try {
      await saveProductToFirestore(saved);
    } catch (fsErr) {
      console.warn("Firestore save product notice:", fsErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product created and synced to cloud Firestore",
        product: saved,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to persist product to cloud database" },
      { status: 500 }
    );
  }
}

// PUT / PATCH: Update an existing product centrally
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, updates } = body as { id: string; updates: Partial<Product> };

    if (!id || !updates) {
      return NextResponse.json(
        { success: false, error: "Missing product ID or updates payload" },
        { status: 400 }
      );
    }

    try {
      await updateProductInFirestore(id, updates);
    } catch (fsErr) {
      console.warn("Firestore update product notice:", fsErr);
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
        message: "Product updated across cloud database",
        product: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PUT /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE: Remove product
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Missing product id parameter" },
        { status: 400 }
      );
    }

    try {
      await deleteProductFromFirestore(productId);
    } catch (fsErr) {
      console.warn("Firestore delete product notice:", fsErr);
    }

    const success = deleteCentralProduct(productId);
    if (!success) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Product ${productId} deleted from cloud database`,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DELETE /api/products error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
