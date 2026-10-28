import { NextRequest, NextResponse } from "next/server";
import { getCentralHeroSlides, updateCentralHeroSlides } from "@/lib/serverDb";
import { HeroSlide } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: Fetch the 3 hero background slides
export async function GET() {
  try {
    const slides = getCentralHeroSlides();
    return NextResponse.json(
      {
        success: true,
        count: slides.length,
        slides,
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
    console.error("GET /api/banners error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero slides" },
      { status: 500 }
    );
  }
}

// POST or PUT: Update the 3 hero background slides
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slides } = body as { slides: HeroSlide[] };

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json(
        { success: false, error: "Slides array is required" },
        { status: 400 }
      );
    }

    const updated = updateCentralHeroSlides(slides);
    return NextResponse.json(
      {
        success: true,
        slides: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("POST /api/banners error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update hero slides" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
