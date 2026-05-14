import { SubmitButton } from "@/components/ui/submit-button";
import {
  createEventAction,
  createEventGalleryAction,
  deleteEventAction,
  deleteEventGalleryAction,
  updateEventAction
} from "@/app/admin/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: { galleries: { orderBy: { createdAt: "desc" } } }
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-grind-line bg-grind-surface p-6">
        <h1 className="font-heading text-2xl">Tambah Acara</h1>
        <form action={createEventAction} className="mt-4 grid gap-3 md:grid-cols-2">
          <input name="eventName" required placeholder="Nama acara" />
          <input name="location" required placeholder="Lokasi" />
          <input name="logoFile" required type="file" accept="image/*" className="md:col-span-2" />
          <input name="date" required type="date" className="md:col-span-2" />
          <SubmitButton>Tambah Event</SubmitButton>
        </form>
      </section>

      <section className="space-y-4">
        {events.map((event) => (
          <article key={event.id} className="rounded-2xl border border-grind-line bg-grind-surface p-4">
            <form action={updateEventAction} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={event.id} />
              <input type="hidden" name="existingLogo" value={event.logo} />
              <input name="eventName" defaultValue={event.eventName} required />
              <input name="location" defaultValue={event.location} required />
              <div className="md:col-span-2 rounded-lg border border-grind-line bg-[#111] px-3 py-2 text-xs text-zinc-400">
                Logo saat ini: {event.logo}
              </div>
              <input name="logoFile" type="file" accept="image/*" className="md:col-span-2" />
              <input
                name="date"
                required
                type="date"
                defaultValue={new Date(event.date).toISOString().slice(0, 10)}
                className="md:col-span-2"
              />
              <SubmitButton>Simpan Event</SubmitButton>
            </form>
            <form action={deleteEventAction} className="mt-3">
              <input type="hidden" name="id" value={event.id} />
              <button className="rounded-lg border border-red-500 px-3 py-2 text-xs uppercase tracking-wider text-red-400 hover:bg-red-500/10">
                Hapus Event
              </button>
            </form>

            <div className="mt-4 rounded-xl border border-grind-line bg-[#0f0f0f] p-3">
              <p className="mb-3 text-sm uppercase tracking-wider text-zinc-400">Galeri untuk {event.eventName}</p>
              <form action={createEventGalleryAction} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="eventId" value={event.id} />
                <input name="imageFile" type="file" accept="image/*" required className="md:col-span-2" />
                <input name="caption" placeholder="Caption (opsional)" className="md:col-span-2" />
                <SubmitButton>Tambah Foto</SubmitButton>
              </form>

              <div className="mt-3 space-y-2">
                {event.galleries.map((gallery) => (
                  <form key={gallery.id} action={deleteEventGalleryAction} className="flex items-center justify-between rounded-lg border border-grind-line p-3">
                    <input type="hidden" name="id" value={gallery.id} />
                    <div>
                      <p className="text-sm text-zinc-300">{gallery.caption || "Tanpa caption"}</p>
                      <p className="text-xs text-zinc-500">{gallery.imageUrl}</p>
                    </div>
                    <button className="rounded-lg border border-red-500 px-3 py-2 text-xs uppercase tracking-wider text-red-400 hover:bg-red-500/10">
                      Hapus
                    </button>
                  </form>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
