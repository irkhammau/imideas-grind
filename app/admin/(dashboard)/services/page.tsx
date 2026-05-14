import { SubmitButton } from "@/components/ui/submit-button";
import { createServiceAction, deleteServiceAction, updateServiceAction } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function ServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-grind-line bg-grind-surface p-6">
        <h1 className="font-heading text-2xl">Tambah Layanan</h1>
        <form action={createServiceAction} className="mt-4 grid gap-3">
          <input name="title" required placeholder="Judul layanan" />
          <textarea name="description" required rows={3} placeholder="Deskripsi layanan" />
          <SubmitButton>Tambah Layanan</SubmitButton>
        </form>
      </section>

      <section className="space-y-4">
        {services.map((service) => (
          <article key={service.id} className="rounded-2xl border border-grind-line bg-grind-surface p-4">
            <form action={updateServiceAction} className="grid gap-3">
              <input type="hidden" name="id" value={service.id} />
              <input name="title" defaultValue={service.title} required />
              <textarea name="description" defaultValue={service.description} required rows={4} />
              <SubmitButton>Simpan Layanan</SubmitButton>
            </form>
            <form action={deleteServiceAction} className="mt-3">
              <input type="hidden" name="id" value={service.id} />
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
