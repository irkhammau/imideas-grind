import { SubmitButton } from "@/components/ui/submit-button";
import { createGlobalGalleryAction, deleteGlobalGalleryAction, updateGlobalGalleryAction } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export default async function GlobalGalleriesPage() {
  const galleries = await prisma.globalGallery.findMany({ orderBy: { uploadedAt: "desc" } });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-grind-line bg-grind-surface p-6">
        <h1 className="font-heading text-2xl">Create Global Gallery</h1>
        <form action={createGlobalGalleryAction} className="mt-4 grid gap-3">
          <input name="imageUrl" type="url" required placeholder="Image URL" />
          <input name="caption" placeholder="Caption (opsional)" />
          <SubmitButton>Tambah Foto</SubmitButton>
        </form>
      </section>

      <section className="space-y-4">
        {galleries.map((item) => (
          <article key={item.id} className="rounded-2xl border border-grind-line bg-grind-surface p-4">
            <form action={updateGlobalGalleryAction} className="grid gap-3">
              <input type="hidden" name="id" value={item.id} />
              <input name="imageUrl" defaultValue={item.imageUrl} required type="url" />
              <input name="caption" defaultValue={item.caption ?? ""} />
              <SubmitButton>Simpan</SubmitButton>
            </form>
            <form action={deleteGlobalGalleryAction} className="mt-3">
              <input type="hidden" name="id" value={item.id} />
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
