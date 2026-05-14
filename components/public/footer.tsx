import Link from "next/link";

interface FooterProps {
  companyName: string;
  contact: { email?: string; phone?: string; address?: string };
  youtubeUrl: string;
  instagramUrl: string;
}

export function Footer({ companyName, contact, youtubeUrl, instagramUrl }: FooterProps) {
  return (
    <footer className="mt-20 border-t border-grind-line bg-[#0b0b0b] py-10">
      <div className="section-container grid gap-6 md:grid-cols-2">
        <div>
          <p className="font-heading text-lg font-semibold text-white">{companyName}</p>
          <p className="mt-2 max-w-lg text-sm text-zinc-400">{contact.address}</p>
        </div>
        <div className="space-y-2 text-sm text-zinc-300 md:text-right">
          <p>{contact.email}</p>
          <p>{contact.phone}</p>
          <div className="flex gap-3 md:justify-end">
            <Link href={youtubeUrl} target="_blank" className="hover:text-grind-red">
              YouTube
            </Link>
            <Link href={instagramUrl} target="_blank" className="hover:text-grind-cyan">
              Instagram
            </Link>
            <Link href="/admin/login" className="hover:text-white">
              Panel Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
