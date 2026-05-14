"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, Menu, X, Youtube } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  companyName: string;
  youtubeUrl: string;
  instagramUrl: string;
}

export function Navbar({ companyName, youtubeUrl, instagramUrl }: NavbarProps) {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-grind-line/70 bg-[#0d0d0d]/90 backdrop-blur-lg">
      <div className="section-container flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.webp"
            alt="Logo GRIND"
            width={160}
            height={90}
            className="h-10 w-[72px] rounded-md object-contain"
          />
          <span className="font-heading text-sm font-semibold tracking-[0.2em] text-white md:text-base">
            {companyName}
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-xs uppercase tracking-[0.2em] text-zinc-300 md:flex">
          <Link href="/#about" className="hover:text-grind-cyan">
            Tentang
          </Link>
          <Link href="/#services" className="hover:text-grind-cyan">
            Layanan
          </Link>
          <Link href="/#team" className="hover:text-grind-cyan">
            Tim
          </Link>
          <Link href="/#partners" className="hover:text-grind-cyan">
            Mitra
          </Link>
          <Link href="/events" className="hover:text-grind-cyan">
            Acara
          </Link>
          <Link href="/gallery" className="hover:text-grind-cyan">
            Galeri
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href={youtubeUrl} target="_blank" aria-label="YouTube" className="rounded-lg border border-grind-line p-2 text-zinc-200 hover:border-grind-red hover:text-grind-red">
            <Youtube className="h-4 w-4" />
          </Link>
          <Link href={instagramUrl} target="_blank" aria-label="Instagram" className="rounded-lg border border-grind-line p-2 text-zinc-200 hover:border-grind-cyan hover:text-grind-cyan">
            <Instagram className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            className="rounded-lg border border-grind-line p-2 text-zinc-200 hover:border-grind-cyan hover:text-grind-cyan md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="section-container pb-3 md:hidden">
          <div className="rounded-xl border border-grind-line bg-[#111] p-2 text-xs uppercase tracking-[0.18em] text-zinc-200">
            <Link href="/#about" onClick={closeMenu} className="block rounded-lg px-3 py-2 hover:bg-[#1a1a1a] hover:text-grind-cyan">
              Tentang
            </Link>
            <Link href="/#services" onClick={closeMenu} className="block rounded-lg px-3 py-2 hover:bg-[#1a1a1a] hover:text-grind-cyan">
              Layanan
            </Link>
            <Link href="/#team" onClick={closeMenu} className="block rounded-lg px-3 py-2 hover:bg-[#1a1a1a] hover:text-grind-cyan">
              Tim
            </Link>
            <Link href="/#partners" onClick={closeMenu} className="block rounded-lg px-3 py-2 hover:bg-[#1a1a1a] hover:text-grind-cyan">
              Mitra
            </Link>
            <Link href="/events" onClick={closeMenu} className="block rounded-lg px-3 py-2 hover:bg-[#1a1a1a] hover:text-grind-cyan">
              Acara
            </Link>
            <Link href="/gallery" onClick={closeMenu} className="block rounded-lg px-3 py-2 hover:bg-[#1a1a1a] hover:text-grind-cyan">
              Galeri
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
