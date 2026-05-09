import { LoginForm } from "@/components/admin/login-form";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

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
      </div>
    </main>
  );
}
