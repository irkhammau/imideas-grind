import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { serviceSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(services);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = serviceSchema.parse(body);
    const created = await prisma.service.create({ data: parsed });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
