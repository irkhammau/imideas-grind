import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const MIME_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg"
};

function resolveExtension(file: File) {
  const extFromName = path.extname(file.name || "").toLowerCase();
  if (extFromName) return extFromName;
  return MIME_EXTENSION[file.type] ?? ".bin";
}

export async function saveImageFromFormData(
  formData: FormData,
  fieldName: string,
  required = false
): Promise<string | null> {
  const entry = formData.get(fieldName);

  if (!entry || typeof entry === "string") {
    if (required) throw new Error(`File ${fieldName} wajib diunggah`);
    return null;
  }

  const file = entry as File;

  if (!file.size) {
    if (required) throw new Error(`File ${fieldName} wajib diunggah`);
    return null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Hanya file gambar yang diperbolehkan");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Ukuran gambar maksimal 5MB");
  }

  const fileName = `${Date.now()}-${randomUUID()}${resolveExtension(file)}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const diskPath = path.join(uploadDir, fileName);

  await mkdir(uploadDir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(diskPath, buffer);

  return `/api/uploads/${fileName}`;
}

export async function removePublicUpload(filePath?: string | null) {
  if (!filePath) return;

  let relativePath = "";
  if (filePath.startsWith("/uploads/")) {
    relativePath = filePath.replace(/^\//, "");
  } else if (filePath.startsWith("/api/uploads/")) {
    relativePath = `uploads/${filePath.replace(/^\/api\/uploads\//, "")}`;
  } else {
    return;
  }

  const diskPath = path.join(process.cwd(), "public", relativePath);
  await unlink(diskPath).catch(() => undefined);
}
