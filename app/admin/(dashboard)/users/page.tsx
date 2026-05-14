import { SubmitButton } from "@/components/ui/submit-button";
import { createUserAction, deleteUserAction, updateUserAction } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function UsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-grind-line bg-grind-surface p-6">
        <h1 className="font-heading text-2xl">Tambah Pengguna</h1>
        <form action={createUserAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="username" required placeholder="Nama pengguna" />
          <input name="role" defaultValue="SuperAdmin" required placeholder="Peran" />
          <input name="password" required type="password" placeholder="Kata sandi" className="md:col-span-2" />
          <SubmitButton>Tambah Pengguna</SubmitButton>
        </form>
      </section>

      <section className="space-y-4">
        {users.map((user) => (
          <article key={user.id} className="rounded-2xl border border-grind-line bg-grind-surface p-4">
            <form action={updateUserAction} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={user.id} />
              <input name="username" defaultValue={user.username} required />
              <input name="role" defaultValue={user.role} required />
              <input name="password" type="password" placeholder="Kosongkan jika tidak diganti" className="md:col-span-2" />
              <SubmitButton>Simpan Pengguna</SubmitButton>
            </form>
            <form action={deleteUserAction} className="mt-3">
              <input type="hidden" name="id" value={user.id} />
              <button className="rounded-lg border border-red-500 px-3 py-2 text-xs uppercase tracking-wider text-red-400 hover:bg-red-500/10">
                Hapus
              </button>
            </form>
          </article>
        ))}
      </section>
    </div>
  );
}
