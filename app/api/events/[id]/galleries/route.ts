import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  imageUrl: z.string().url(),
  caption: z.string().optional()
});

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const data = await prisma.eventGallery.findMany({
      where: { eventId: id },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = createSchema.parse(body);
    const created = await prisma.eventGallery.create({
      data: { eventId: id, imageUrl: parsed.imageUrl, caption: parsed.caption }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
