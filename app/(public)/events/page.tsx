import Image from "next/image";
import type { Metadata } from "next";
import { FadeIn } from "@/components/public/motion";
import { prisma } from "@/lib/prisma";
import { resolveImageSrc } from "@/lib/media";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Portofolio Acara Sportainment",
  description:
    "Lihat portofolio acara GRIND: dokumentasi event, lokasi, tanggal penyelenggaraan, serta galeri kegiatan sportainment."
};

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
    include: {
      galleries: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  return (
    <section className="section-container py-12">
      <FadeIn>
        <h1 className="font-heading text-4xl">Portofolio Acara</h1>
      </FadeIn>
      <div className="mt-8 space-y-8">
        {events.map((event, index) => (
          <FadeIn key={event.id} delay={index * 0.08}>
            <article className="rounded-3xl border border-grind-line bg-grind-surface p-5 md:p-6">
              <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
                <div>
                  <div className="relative mx-auto aspect-[2/3] w-full max-w-sm overflow-hidden rounded-xl bg-black">
                    <Image src={resolveImageSrc(event.logo)} alt={event.eventName} fill unoptimized className="object-cover object-center" />
                  </div>
                  <h2 className="mt-4 font-heading text-2xl">{event.eventName}</h2>
                  <p className="text-zinc-300">{event.location}</p>
                  <p className="text-sm text-grind-cyan">
                    {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(event.date)}
                  </p>
                </div>
                <div>
                  <p className="mb-3 text-sm uppercase tracking-[0.18em] text-zinc-400">Galeri Acara</p>
                  <div className="grid auto-rows-fr grid-cols-2 gap-3">
                    {event.galleries.map((gallery) => (
                      <figure key={gallery.id} className="flex h-full flex-col rounded-xl border border-grind-line bg-[#0f0f0f] p-2">
                        <div className="relative h-32 overflow-hidden rounded-lg bg-black sm:h-40">
                          <Image
                            src={resolveImageSrc(gallery.imageUrl)}
                            alt={gallery.caption ?? event.eventName}
                            fill
                            unoptimized
                            className="object-cover object-center scale-110"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        <figcaption className="min-h-[2.5rem] pt-2 text-xs text-zinc-400">{gallery.caption ?? ""}</figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
