import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { staffSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(staff);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = staffSchema.parse(body);
    const created = await prisma.staff.create({ data: parsed });
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
