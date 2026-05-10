import Image from "next/image";
import { FadeIn } from "@/components/public/motion";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


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
        <h1 className="font-heading text-4xl">Event Portfolio</h1>
      </FadeIn>
      <div className="mt-8 space-y-8">
        {events.map((event, index) => (
          <FadeIn key={event.id} delay={index * 0.08}>
            <article className="rounded-3xl border border-grind-line bg-grind-surface p-5 md:p-6">
              <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
                <div>
                  <div className="relative h-64 overflow-hidden rounded-xl bg-black">
                    <Image src={event.logo} alt={event.eventName} fill className="object-cover object-center scale-110" />
                  </div>
                  <h2 className="mt-4 font-heading text-2xl">{event.eventName}</h2>
                  <p className="text-zinc-300">{event.location}</p>
                  <p className="text-sm text-grind-cyan">
                    {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(event.date)}
                  </p>
                </div>
                <div>
                  <p className="mb-3 text-sm uppercase tracking-[0.18em] text-zinc-400">Galeri Event</p>
                  <div className="grid grid-cols-2 gap-3">
                    {event.galleries.map((gallery) => (
                      <figure key={gallery.id} className="rounded-xl border border-grind-line bg-[#0f0f0f] p-2">
                        <div className="relative h-32 overflow-hidden rounded-lg bg-black sm:h-40">
                          <Image
                            src={gallery.imageUrl}
                            alt={gallery.caption ?? event.eventName}
                            fill
                            className="object-cover object-center scale-110"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        </div>
                        {gallery.caption && <figcaption className="pt-2 text-xs text-zinc-400">{gallery.caption}</figcaption>}
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
