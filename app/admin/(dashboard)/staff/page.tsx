import Image from "next/image";
import { SubmitButton } from "@/components/ui/submit-button";
import { createStaffAction, deleteStaffAction, updateStaffAction } from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export default async function StaffPage() {
  const staff = await prisma.staff.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }]
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-grind-line bg-grind-surface p-6">
        <h1 className="font-heading text-2xl">Create Staff</h1>
        <form action={createStaffAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="order" required type="number" min={0} placeholder="Urutan (0,1,2...)" />
          <input name="name" required placeholder="Nama" />
          <input name="position" required placeholder="Jabatan" />
          <input name="imageFile" required type="file" accept="image/*" className="md:col-span-2" />
          <SubmitButton>Tambah Staff</SubmitButton>
        </form>
      </section>

      <section className="space-y-4">
        {staff.map((member) => (
          <article key={member.id} className="rounded-2xl border border-grind-line bg-grind-surface p-4">
            <div className="grid gap-4 md:grid-cols-[120px_1fr]">
              <div className="relative h-28 overflow-hidden rounded-xl bg-black">
                <Image src={member.image} alt={member.name} fill className="object-cover object-center scale-110" />
              </div>
              <div className="space-y-3">
                <form action={updateStaffAction} className="grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={member.id} />
                  <input type="hidden" name="existingImage" value={member.image} />
                  <input name="order" type="number" min={0} defaultValue={member.order} required />
                  <input name="name" defaultValue={member.name} required />
                  <input name="position" defaultValue={member.position} required />
                  <div className="md:col-span-2 rounded-lg border border-grind-line bg-[#111] px-3 py-2 text-xs text-zinc-400">
                    Current image: {member.image}
                  </div>
                  <input name="imageFile" type="file" accept="image/*" className="md:col-span-2" />
                  <SubmitButton>Simpan Staff</SubmitButton>
                </form>
                <form action={deleteStaffAction}>
                  <input type="hidden" name="id" value={member.id} />
                  <button className="rounded-lg border border-red-500 px-3 py-2 text-xs uppercase tracking-wider text-red-400 hover:bg-red-500/10">
                    Hapus Staff
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
