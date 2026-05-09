import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { globalGallerySchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = globalGallerySchema.parse(body);
    const updated = await prisma.globalGallery.update({ where: { id }, data: parsed });
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    await prisma.globalGallery.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
