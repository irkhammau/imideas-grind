import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { eventSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: "desc" },
      include: { galleries: true }
    });
    return NextResponse.json(events);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = eventSchema.parse(body);
    const created = await prisma.event.create({ data: parsed });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
