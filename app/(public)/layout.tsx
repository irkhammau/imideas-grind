import { Footer } from "@/components/public/footer";
import { Navbar } from "@/components/public/navbar";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await prisma.siteSettings.findFirst({ orderBy: { createdAt: "asc" } });

  const contact = (settings?.contact as { email?: string; phone?: string; address?: string } | null) ?? {};
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.companyName ?? "GRIND",
    url: "https://www.grind.co.id",
    logo: "https://www.grind.co.id/logo.png",
    sameAs: [settings?.youtubeUrl, settings?.instagramUrl].filter(Boolean),
    contactPoint: contact.phone
      ? [
          {
            "@type": "ContactPoint",
            telephone: contact.phone,
            contactType: "customer service",
            areaServed: "ID",
            availableLanguage: ["id", "en"]
          }
        ]
      : undefined,
    email: contact.email,
    address: contact.address
      ? {
          "@type": "PostalAddress",
          streetAddress: contact.address,
          addressCountry: "ID"
        }
      : undefined
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
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
