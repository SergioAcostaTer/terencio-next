import type { Metadata, Viewport } from "next";
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
  applicationName: siteData.name,
  keywords: siteData.seo.keywords,
  authors: [{ name: siteData.name, url: siteData.url }],
  creator: siteData.name,
  publisher: siteData.legalName,
  category: "Supermercado",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: siteData.meta.locale.replace("_", "-"),
    url: siteData.url,
    siteName: siteData.name,
    title: siteData.name,
    description: siteData.seo.description,
    images: [
      {
        url: "/social-share.png",
        width: 1200,
        height: 630,
        alt: siteData.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteData.name,
    description: siteData.seo.description,
    images: ["/social-share.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: siteData.meta.themeColor,
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
