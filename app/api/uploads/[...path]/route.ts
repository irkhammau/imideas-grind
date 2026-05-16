import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif"
};

type RouteContext = { params: Promise<{ path: string[] }> };

function getMimeType(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_BY_EXT[ext] ?? "application/octet-stream";
}

export async function GET(_: NextRequest, { params }: RouteContext) {
  try {
    const { path: segments } = await params;
    if (!segments?.length) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const safeSegments = segments.filter((segment) => segment && segment !== "." && segment !== "..");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const absolutePath = path.join(uploadDir, ...safeSegments);
    const normalizedUploadDir = `${path.resolve(uploadDir)}${path.sep}`;
    const normalizedFilePath = path.resolve(absolutePath);

    if (!normalizedFilePath.startsWith(normalizedUploadDir)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const file = await readFile(normalizedFilePath);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": getMimeType(normalizedFilePath),
        "Cache-Control": "public, max-age=60"
      }
    });
  } catch {
    return new NextResponse("Not Found", { status: 404 });
  }
}
