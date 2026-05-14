import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { partnerSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const item = await prisma.partner.findUnique({ where: { id } });
    return NextResponse.json(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = partnerSchema.parse(body);
    const updated = await prisma.partner.update({
      where: { id },
      data: {
        ...parsed,
        description: parsed.description || null
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    await prisma.partner.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
