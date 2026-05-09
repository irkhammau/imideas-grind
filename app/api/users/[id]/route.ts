import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const userUpdateSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(8).optional(),
  role: z.string().min(2)
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = userUpdateSchema.parse(body);

    const payload: { username: string; role: string; password?: string } = {
      username: parsed.username,
      role: parsed.role
    };

    if (parsed.password) {
      payload.password = await bcrypt.hash(parsed.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: payload,
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
        updatedAt: true
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
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return handleApiError(error);
  }
}
