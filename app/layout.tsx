import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/ui/session-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.grind.co.id"),
  title: {
    default: "GRIND | PT Gelora Energi Indonesia",
    template: "%s | GRIND"
  },
  description: "PT Gelora Energi Indonesia - Penyelenggara Acara Sportainment",
  applicationName: "GRIND",
  keywords: [
    "GRIND",
    "PT Gelora Energi Indonesia",
    "Penyelenggara Acara Sportainment",
    "Produksi Kreatif",
    "Manajemen Tiket",
    "Koordinasi Venue",
    "Publikasi Media",
    "Live Score",
    "E-Sertifikat",
    "Layanan Sponsorship"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://www.grind.co.id",
    siteName: "GRIND",
    title: "GRIND | PT Gelora Energi Indonesia",
    description: "PT Gelora Energi Indonesia - Penyelenggara Acara Sportainment",
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
    title: "GRIND | PT Gelora Energi Indonesia",
    description: "PT Gelora Energi Indonesia - Penyelenggara Acara Sportainment",
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
