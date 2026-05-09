import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/ui/session-provider";

export const metadata: Metadata = {
  title: "GRIND | Company Profile",
  description: "PT Gelora Energi Indonesia - Sportainment Event Organizer"
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
