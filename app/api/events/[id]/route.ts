import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { eventSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const item = await prisma.event.findUnique({
      where: { id },
      include: { galleries: true }
    });
    return NextResponse.json(item);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = eventSchema.parse(body);
    const updated = await prisma.event.update({ where: { id }, data: parsed });
    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
