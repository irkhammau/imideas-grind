"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false
    });

    setPending(false);

    if (result?.error) {
      setError("Username atau password salah.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-2xl border border-grind-line bg-grind-surface p-6">
      <div>
        <label className="mb-2 block text-sm text-zinc-300">Username</label>
        <input name="username" required placeholder="admin" />
      </div>
      <div>
        <label className="mb-2 block text-sm text-zinc-300">Kata Sandi</label>
        <input name="password" type="password" required placeholder="••••••••" />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-grind-red px-4 py-2.5 text-sm font-semibold uppercase tracking-wider text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Masuk..." : "Masuk Admin"}
      </button>
    </form>
  );
}
