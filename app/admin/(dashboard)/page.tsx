import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";


export default async function AdminOverviewPage() {
  const [staffCount, servicesCount, eventsCount, globalGalleryCount, userCount] = await Promise.all([
    prisma.staff.count(),
    prisma.service.count(),
    prisma.event.count(),
    prisma.globalGallery.count(),
    prisma.user.count()
  ]);

  const cards = [
    { label: "Staff", value: staffCount },
    { label: "Services", value: servicesCount },
    { label: "Events", value: eventsCount },
    { label: "Galeri Perusahaan", value: globalGalleryCount },
    { label: "Users", value: userCount }
  ];

  return (
    <div>
      <h1 className="font-heading text-3xl">Dashboard Overview</h1>
      <p className="mt-2 text-zinc-400">Kelola konten company profile GRIND dari panel ini.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="rounded-2xl border border-grind-line bg-grind-surface p-5">
            <p className="text-sm text-zinc-400">{card.label}</p>
            <p className="mt-2 font-heading text-4xl">{card.value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
