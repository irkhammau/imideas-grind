export function resolveImageSrc(src: string) {
  if (!src) return src;

  if (src.startsWith("/api/uploads/")) {
    return src;
  }

  if (src.startsWith("/uploads/")) {
    return `/api/uploads/${src.replace(/^\/uploads\//, "")}`;
  }

  return src;
}
