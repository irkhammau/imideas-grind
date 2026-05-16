"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import clsx from "clsx";

type ToastState = {
  type: "success" | "error";
  message: string;
};

export function ActionToast() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [toast, setToast] = useState<ToastState | null>(null);
  const lastToastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const type = searchParams.get("toast");
    const message = searchParams.get("toastMessage");

    if (!type || !message || (type !== "success" && type !== "error")) {
      return;
    }

    const key = `${type}:${message}`;
    if (lastToastKeyRef.current !== key) {
      setToast({ type, message });
      lastToastKeyRef.current = key;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");
    params.delete("toastMessage");
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    window.history.replaceState({}, "", nextUrl);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  if (!toast) return null;

  return (
    <div
      className={clsx(
        "fixed right-4 top-4 z-[90] max-w-sm rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-md",
        toast.type === "success"
          ? "border-emerald-500/60 bg-emerald-950/85 text-emerald-200"
          : "border-red-500/60 bg-red-950/85 text-red-200"
      )}
      role="status"
      aria-live="polite"
    >
      <p>{toast.message}</p>
    </div>
  );
}
