import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.findFirst({ orderBy: { createdAt: "asc" } });

  const contact = (settings?.contact as { email?: string; phone?: string; address?: string } | null) ?? {};

  return (
    <>
      <Navbar
        companyName={settings?.companyName ?? "GRIND"}
        youtubeUrl={settings?.youtubeUrl ?? "https://www.youtube.com/@GELORAENERGIINDONESIA"}
        instagramUrl={settings?.instagramUrl ?? "https://www.instagram.com/grind_indonesia/"}
      />
      <main>{children}</main>
      <Footer
        companyName={settings?.companyName ?? "GRIND"}
        contact={contact}
        youtubeUrl={settings?.youtubeUrl ?? "https://www.youtube.com/@GELORAENERGIINDONESIA"}
        instagramUrl={settings?.instagramUrl ?? "https://www.instagram.com/grind_indonesia/"}
      />
    </>
  );
}
