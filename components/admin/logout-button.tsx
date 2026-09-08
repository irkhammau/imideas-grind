"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  async function handleLogout() {
    await signOut({ redirect: false });
    window.location.assign("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-grind-line px-3 py-2 text-xs uppercase tracking-wider text-zinc-300 hover:border-grind-red hover:text-grind-red"
    >
      Keluar
    </button>
  );
}
