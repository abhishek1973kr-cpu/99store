import { NextResponse } from "next/server";
import { resetCentralVault } from "@/lib/serverDb";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const reset = resetCentralVault();
    return NextResponse.json(
      {
        success: true,
        message: "Central vault database reset to initial 25 ornaments and sample orders",
        data: reset,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/reset error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reset central database" },
      { status: 500 }
    );
  }
}
