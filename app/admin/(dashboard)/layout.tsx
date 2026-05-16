import Link from "next/link";
import { ActionToast } from "@/components/admin/action-toast";
import { LogoutButton } from "@/components/admin/logout-button";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Ringkasan" },
  { href: "/admin/site-settings", label: "Pengaturan Situs" },
  { href: "/admin/staff", label: "Staf" },
  { href: "/admin/services", label: "Layanan" },
  { href: "/admin/partners", label: "Mitra" },
  { href: "/admin/events", label: "Acara" },
  { href: "/admin/global-galleries", label: "Galeri Perusahaan" },
  { href: "/admin/users", label: "Pengguna" },
  { href: "/admin/change-password", label: "Ganti Kata Sandi" }
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <main className="section-container py-8">
      <ActionToast />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-grind-line bg-grind-surface p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">GRIND CMS</p>
          <p className="font-semibold text-white">Halo, {session.user.name}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-grind-line bg-grind-surface p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg border border-transparent px-3 py-2 text-sm text-zinc-300 hover:border-grind-line hover:bg-[#0f0f0f] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="space-y-6">{children}</section>
      </div>
    </main>
  );
}
