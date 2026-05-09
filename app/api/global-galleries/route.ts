import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { globalGallerySchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const galleries = await prisma.globalGallery.findMany({
      orderBy: { uploadedAt: "desc" }
    });
    return NextResponse.json(galleries);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = globalGallerySchema.parse(body);
    const created = await prisma.globalGallery.create({ data: parsed });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
