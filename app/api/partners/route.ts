import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { partnerSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }]
    });
    return NextResponse.json(partners);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = partnerSchema.parse(body);
    const created = await prisma.partner.create({
      data: {
        ...parsed,
        description: parsed.description || null
      }
    });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
