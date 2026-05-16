import Image from "next/image";
import { SubmitButton } from "@/components/ui/submit-button";
import { createPartnerAction, deletePartnerAction, updatePartnerAction } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";
import { resolveImageSrc } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }]
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-grind-line bg-grind-surface p-6">
        <h1 className="font-heading text-2xl">Tambah Mitra</h1>
        <form action={createPartnerAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="order" required type="number" min={0} placeholder="Urutan (0,1,2...)" />
          <input name="name" required placeholder="Nama mitra" />
          <input name="websiteUrl" required type="url" placeholder="https://partner.com" className="md:col-span-2" />
          <textarea name="description" placeholder="Deskripsi (opsional)" className="md:col-span-2" />
          <input name="logoFile" required type="file" accept="image/*" className="md:col-span-2" />
          <SubmitButton>Tambah Mitra</SubmitButton>
        </form>
      </section>

      <section className="space-y-4">
        {partners.map((partner) => (
          <article key={partner.id} className="rounded-2xl border border-grind-line bg-grind-surface p-4">
            <div className="grid gap-4 md:grid-cols-[120px_1fr]">
              <div className="relative h-28 overflow-hidden rounded-xl bg-black">
                <Image src={resolveImageSrc(partner.logo)} alt={partner.name} fill unoptimized className="object-contain p-3" />
              </div>
              <div className="space-y-3">
                <form action={updatePartnerAction} className="grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={partner.id} />
                  <input type="hidden" name="existingLogo" value={partner.logo} />
                  <input name="order" type="number" min={0} defaultValue={partner.order} required />
                  <input name="name" defaultValue={partner.name} required />
                  <input name="websiteUrl" type="url" defaultValue={partner.websiteUrl} required className="md:col-span-2" />
                  <textarea name="description" defaultValue={partner.description ?? ""} className="md:col-span-2" />
                  <div className="md:col-span-2 rounded-lg border border-grind-line bg-[#111] px-3 py-2 text-xs text-zinc-400">
                    Logo saat ini: {partner.logo}
                  </div>
                  <input name="logoFile" type="file" accept="image/*" className="md:col-span-2" />
                  <SubmitButton>Simpan Mitra</SubmitButton>
                </form>
                <form action={deletePartnerAction}>
                  <input type="hidden" name="id" value={partner.id} />
                  <button className="rounded-lg border border-red-500 px-3 py-2 text-xs uppercase tracking-wider text-red-400 hover:bg-red-500/10">
                    Hapus Mitra
                  </button>
                </form>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
