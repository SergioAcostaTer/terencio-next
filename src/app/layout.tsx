import type { Metadata } from "next";
import { Outfit } from "next/font/google";

import AppShell from "@/components/AppShell";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import siteData from "@/data/siteData.json";

import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteData.url),
  title: {
    default: siteData.name,
    template: `%s | ${siteData.name}`,
  },
  description: siteData.seo.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-gray-50 text-gray-800">
        <LocalBusinessSchema />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
