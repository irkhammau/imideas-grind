import Image from "next/image";
import type { Metadata } from "next";
import { FadeIn, HoverCard } from "@/components/public/motion";
import { prisma } from "@/lib/prisma";
import { resolveImageSrc } from "@/lib/media";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Galeri Dokumentasi Perusahaan",
  description: "Dokumentasi visual kegiatan perusahaan GRIND: foto event, aktivitas tim, dan momen penting lainnya."
};

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

      <div className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {galleries.map((item, idx) => (
          <FadeIn key={item.id} delay={idx * 0.05} className="h-full">
            <HoverCard className="h-full">
              <figure className="flex h-full flex-col rounded-2xl border border-grind-line bg-grind-surface p-3">
                <div className="relative h-64 overflow-hidden rounded-xl bg-black">
                  <Image
                    src={resolveImageSrc(item.imageUrl)}
                    alt={item.caption ?? "Galeri GRIND"}
                    fill
                    unoptimized
                    className="object-cover object-center scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <figcaption className="min-h-[3rem] pt-3 text-sm text-zinc-300">{item.caption ?? ""}</figcaption>
              </figure>
            </HoverCard>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
