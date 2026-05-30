import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/ui/session-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.grind.co.id"),
  title: {
    default: "GRIND | EO Sportainment & Aktivasi Brand di Indonesia",
    template: "%s | GRIND"
  },
  description:
    "GRIND (PT Gelora Energi Indonesia) adalah penyelenggara acara sportainment: produksi kreatif, manajemen venue, publikasi media, live score, e-sertifikat, dan sponsorship.",
  applicationName: "GRIND",
  keywords: [
    "GRIND",
    "PT Gelora Energi Indonesia",
    "EO Sportainment",
    "Penyelenggara Acara",
    "Manajemen Venue",
    "Publikasi Media",
    "Sponsorship"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.grind.co.id",
    siteName: "GRIND",
    title: "GRIND | EO Sportainment & Aktivasi Brand di Indonesia",
    description:
      "Penyelenggara acara sportainment untuk brand, komunitas, dan institusi: produksi kreatif, venue, media, live score, e-sertifikat, serta sponsorship.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Logo GRIND"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "GRIND | EO Sportainment & Aktivasi Brand di Indonesia",
    description:
      "Penyelenggara acara sportainment: produksi kreatif, manajemen venue, publikasi media, live score, e-sertifikat, dan sponsorship.",
    images: ["/logo.png"]
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico"
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="id">
      <body className="font-body">
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
