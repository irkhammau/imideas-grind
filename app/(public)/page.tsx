import Image from "next/image";
import Link from "next/link";
import { FadeIn, HoverCard } from "@/components/public/motion";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [settings, staff, services, featuredEvents] = await Promise.all([
    prisma.siteSettings.findFirst({ orderBy: { createdAt: "asc" } }),
    prisma.staff.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] }),
    prisma.service.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.event.findMany({ orderBy: { date: "desc" }, take: 3, include: { galleries: true } })
  ]);

  const contact = (settings?.contact as { email?: string; phone?: string; address?: string } | null) ?? {};

  return (
    <div>
      <section className="section-container grid min-h-[78vh] gap-10 py-14 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.3em] text-grind-cyan">Sportainment Event Organizer</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight md:text-6xl">
            {settings?.companyName ?? "PT GELORA ENERGI INDONESIA"}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-zinc-300 md:text-lg">{settings?.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/events" className="rounded-xl bg-grind-red px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:brightness-110">
              Jelajahi Event
            </Link>
            <a href="#contact" className="rounded-xl border border-grind-cyan px-6 py-3 text-sm font-semibold uppercase tracking-widest text-grind-cyan hover:bg-grind-cyan hover:text-black">
              Hubungi Kami
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="rounded-3xl border border-grind-line bg-grind-surface/60 p-4 shadow-glow">
            <div className="relative overflow-hidden rounded-2xl bg-black">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.14),transparent_45%)]" />
              <Image
                src="/logo.png"
                alt="GRIND"
                width={860}
                height={860}
                className="mx-auto h-[360px] w-full object-contain p-8 md:h-[420px]"
                priority
              />
            </div>
          </div>
        </FadeIn>
      </section>

      <section id="about" className="section-container py-14">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl">About GRIND</h2>
          <p className="mt-5 max-w-4xl text-zinc-300">{settings?.aboutText}</p>
        </FadeIn>
      </section>

      <section id="services" className="section-container py-14">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl">Layanan Utama</h2>
        </FadeIn>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, idx) => (
            <FadeIn key={service.id} delay={idx * 0.06}>
              <HoverCard>
                <article className="h-full rounded-2xl border border-grind-line bg-grind-surface p-6">
                  <h3 className="font-heading text-xl text-white">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">{service.description}</p>
                </article>
              </HoverCard>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="team" className="section-container py-14">
        <FadeIn>
          <h2 className="font-heading text-3xl md:text-4xl">Jajaran Staff</h2>
        </FadeIn>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {staff.map((member, idx) => (
            <FadeIn key={member.id} delay={idx * 0.05}>
              <HoverCard>
                <article className="rounded-2xl border border-grind-line bg-grind-surface p-4">
                  <div className="relative h-72 overflow-hidden rounded-xl bg-black">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-center scale-110"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className="pt-4">
                    <p className="font-semibold text-white">{member.name}</p>
                    <p className="text-sm text-grind-cyan">{member.position}</p>
                  </div>
                </article>
              </HoverCard>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="section-container py-14">
        <FadeIn>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="font-heading text-3xl md:text-4xl">Event Terbaru</h2>
            <Link href="/events" className="text-sm uppercase tracking-wider text-grind-cyan hover:text-white">
              Lihat Semua
            </Link>
          </div>
        </FadeIn>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredEvents.map((event, idx) => (
            <FadeIn key={event.id} delay={idx * 0.07}>
              <HoverCard>
                <article className="rounded-2xl border border-grind-line bg-grind-surface p-4">
                  <div className="relative h-52 overflow-hidden rounded-xl bg-black">
                    <Image
                      src={event.logo}
                      alt={event.eventName}
                      fill
                      className="object-cover object-center scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="pt-4">
                    <h3 className="font-semibold text-white">{event.eventName}</h3>
                    <p className="mt-1 text-sm text-zinc-300">{event.location}</p>
                    <p className="mt-1 text-sm text-grind-cyan">
                      {new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(event.date)}
                    </p>
                  </div>
                </article>
              </HoverCard>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="contact" className="section-container py-14">
        <FadeIn>
          <div className="rounded-3xl border border-grind-line bg-[#101010] p-8">
            <h2 className="font-heading text-3xl md:text-4xl">Kontak</h2>
            <p className="mt-4 text-zinc-300">Email: {contact.email}</p>
            <p className="mt-2 text-zinc-300">Phone: {contact.phone}</p>
            <p className="mt-2 text-zinc-300">Alamat: {contact.address}</p>
          </div>
        </FadeIn>
      </section>
    </div>
  );
}
