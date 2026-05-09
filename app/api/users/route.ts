import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { userSchema } from "@/lib/validators";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = userSchema.parse(body);
    const hashed = await bcrypt.hash(parsed.password, 10);

    const created = await prisma.user.create({
      data: {
        username: parsed.username,
        password: hashed,
        role: parsed.role
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
