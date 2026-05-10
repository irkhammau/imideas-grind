import { LoginForm } from "@/components/admin/login-form";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    redirect("/admin");
  }

  return (
    <main className="section-container flex min-h-[82vh] items-center justify-center py-10">
      <div className="w-full max-w-md">
        <h1 className="mb-5 text-center font-heading text-3xl font-semibold">Admin Login</h1>
        <LoginForm />
        <Link
          href="/"
          className="mt-4 block w-full rounded-xl border border-grind-line px-4 py-2.5 text-center text-sm font-semibold uppercase tracking-wider text-zinc-300 hover:border-grind-cyan hover:text-grind-cyan"
        >
          Kembali ke Home
        </Link>
      </div>
    </main>
  );
}
