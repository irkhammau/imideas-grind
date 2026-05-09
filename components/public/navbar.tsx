import Link from "next/link";
import Image from "next/image";
import { Instagram, Youtube } from "lucide-react";

interface NavbarProps {
  companyName: string;
  youtubeUrl: string;
  instagramUrl: string;
}

export function Navbar({ companyName, youtubeUrl, instagramUrl }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-grind-line/70 bg-[#0d0d0d]/90 backdrop-blur-lg">
      <div className="section-container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="GRIND Logo" width={42} height={42} className="h-10 w-10 rounded-md object-cover" />
          <span className="font-heading text-sm font-semibold tracking-[0.2em] text-white md:text-base">
            {companyName}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-xs uppercase tracking-[0.2em] text-zinc-300 md:flex">
          <Link href="/#about" className="hover:text-grind-cyan">
            About
          </Link>
          <Link href="/#services" className="hover:text-grind-cyan">
            Services
          </Link>
          <Link href="/#team" className="hover:text-grind-cyan">
            Team
          </Link>
          <Link href="/events" className="hover:text-grind-cyan">
            Events
          </Link>
          <Link href="/gallery" className="hover:text-grind-cyan">
            Gallery
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href={youtubeUrl} target="_blank" aria-label="YouTube" className="rounded-lg border border-grind-line p-2 text-zinc-200 hover:border-grind-red hover:text-grind-red">
            <Youtube className="h-4 w-4" />
          </Link>
          <Link href={instagramUrl} target="_blank" aria-label="Instagram" className="rounded-lg border border-grind-line p-2 text-zinc-200 hover:border-grind-cyan hover:text-grind-cyan">
            <Instagram className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
