import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import path from "node:path";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const MIME_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "image/avif": ".avif"
};

type R2Config = {
  bucket: string;
  publicUrl: string;
  client: S3Client;
};

let cachedConfig: R2Config | undefined;

function normalizePublicUrl(value: string) {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error();
    return url.toString().replace(/\/$/, "");
  } catch {
    throw new Error("R2_PUBLIC_URL harus berupa URL atau domain CDN yang valid.");
  }
}

function getR2Config(): R2Config {
  if (cachedConfig) return cachedConfig;

  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  const publicUrlValue = process.env.R2_PUBLIC_URL?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrlValue) {
    throw new Error(
      "Konfigurasi R2 belum lengkap. Isi R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, dan R2_PUBLIC_URL."
    );
  }

  const publicUrl = normalizePublicUrl(publicUrlValue);

  cachedConfig = {
    bucket,
    publicUrl,
    client: new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey }
    })
  };

  return cachedConfig;
}

function encodeObjectKey(key: string) {
  return key.split("/").map(encodeURIComponent).join("/");
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

  const extension = MIME_EXTENSION[file.type];
  if (!extension) {
    throw new Error("Format gambar harus JPG, PNG, WebP, GIF, SVG, atau AVIF");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Ukuran gambar maksimal 5MB");
  }

  const config = getR2Config();
  const objectKey = `uploads/${Date.now()}-${randomUUID()}${extension}`;
  const body = Buffer.from(await file.arrayBuffer());

  await config.client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: objectKey,
      Body: body,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable"
    })
  );

  return `${config.publicUrl}/${encodeObjectKey(objectKey)}`;
}

export async function removeStoredImage(fileUrl?: string | null) {
  if (!fileUrl) return;

  // Keep cleanup support for records created before the R2 migration.
  if (fileUrl.startsWith("/uploads/") || fileUrl.startsWith("/api/uploads/")) {
    const fileName = fileUrl.replace(/^\/(?:api\/)?uploads\//, "");
    const uploadDir = path.resolve(process.cwd(), "public", "uploads");
    const diskPath = path.resolve(uploadDir, fileName);

    if (diskPath.startsWith(`${uploadDir}${path.sep}`)) {
      await unlink(diskPath).catch(() => undefined);
    }
    return;
  }

  if (fileUrl.startsWith("/")) return;

  const config = getR2Config();
  const normalizedFileUrl = /^https?:\/\//i.test(fileUrl) ? fileUrl : `https://${fileUrl}`;
  const publicPrefix = `${config.publicUrl}/`;
  if (!normalizedFileUrl.startsWith(publicPrefix)) return;

  const objectKey = decodeURIComponent(normalizedFileUrl.slice(publicPrefix.length));
  if (!objectKey.startsWith("uploads/")) return;

  await config.client.send(
    new DeleteObjectCommand({
      Bucket: config.bucket,
      Key: objectKey
    })
  );
}
