import Image from "next/image";
import { FadeIn, HoverCard } from "@/components/public/motion";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function GlobalGalleryPage() {
  const galleries = await prisma.globalGallery.findMany({
    orderBy: { uploadedAt: "desc" }
  });

  return (
    <section className="section-container py-12">
      <FadeIn>
        <h1 className="font-heading text-4xl">Galeri Perusahaan</h1>
        <p className="mt-3 text-zinc-300">Dokumentasi umum perusahaan GRIND.</p>
      </FadeIn>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleries.map((item, idx) => (
          <FadeIn key={item.id} delay={idx * 0.05}>
            <HoverCard>
              <figure className="rounded-2xl border border-grind-line bg-grind-surface p-3">
                <div className="relative h-64 overflow-hidden rounded-xl bg-black">
                  <Image
                    src={item.imageUrl}
                    alt={item.caption ?? "Galeri GRIND"}
                    fill
                    className="object-cover object-center scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                {item.caption && <figcaption className="pt-3 text-sm text-zinc-300">{item.caption}</figcaption>}
              </figure>
            </HoverCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
