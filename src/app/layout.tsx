import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const display = Oswald({ subsets: ["latin"], weight: ["300", "400"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "PhotoPRO | Eventos", template: "%s | PhotoPRO" },
  description: "Encontre o seu evento e acesse as fotos da cobertura da PhotoPRO.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
