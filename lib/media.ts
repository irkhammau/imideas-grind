export function resolveImageSrc(src: string) {
  const normalizedSrc = src.trim();
  if (!normalizedSrc) return normalizedSrc;

  if (normalizedSrc.startsWith("/api/uploads/")) {
    return normalizedSrc;
  }

  if (normalizedSrc.startsWith("/uploads/")) {
    return `/api/uploads/${normalizedSrc.replace(/^\/uploads\//, "")}`;
  }

  if (normalizedSrc.startsWith("//")) {
    return `https:${normalizedSrc}`;
  }

  // Repair legacy CDN URLs saved as "cdn.example.com/path" without a scheme.
  if (/^[a-z0-9.-]+\.[a-z]{2,}(?::\d+)?(?:\/|$)/i.test(normalizedSrc)) {
    return `https://${normalizedSrc}`;
  }

  return normalizedSrc;
}
