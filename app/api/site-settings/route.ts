import { prisma } from "@/lib/prisma";
import { handleApiError } from "@/lib/api";
import { siteSettingsSchema } from "@/lib/validators";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst({
      orderBy: { createdAt: "asc" }
    });
    return NextResponse.json(settings);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = siteSettingsSchema.parse(body);
    const existing = body.id
      ? await prisma.siteSettings.findUnique({ where: { id: body.id as string } })
      : await prisma.siteSettings.findFirst({ orderBy: { createdAt: "asc" } });

    const payload = {
      companyName: parsed.companyName,
      tagline: parsed.tagline,
      contact: {
        email: parsed.email,
        phone: parsed.phone,
        address: parsed.address
      },
      aboutText: parsed.aboutText,
      youtubeUrl: parsed.youtubeUrl,
      instagramUrl: parsed.instagramUrl
    };

    const updated = existing
      ? await prisma.siteSettings.update({
          where: { id: existing.id },
          data: payload
        })
      : await prisma.siteSettings.create({
          data: payload
        });

    return NextResponse.json(updated);
  } catch (error) {
    return handleApiError(error);
  }
}
