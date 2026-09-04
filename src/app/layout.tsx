import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono } from "next/font/google";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: ["500", "600"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Taslak AI",
  description: "Boş oda fotoğraflarını AI ile gerçekçi taslaklara çeviren araç.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable}`}>
      <body>
        <SessionProviderWrapper>
          <SiteHeader />
          {children}
          <SiteFooter />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
