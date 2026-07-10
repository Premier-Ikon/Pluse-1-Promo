import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/data/site";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | Branded Goods & Print for Every Business`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Plus One Promo",
    "promotional products",
    "branded merchandise",
    "business cards",
    "direct mail",
    "EDDM",
    "yard signs",
    "postcards",
    "mailers",
    "corporate gifts",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico?v=circle", sizes: "any" },
      { url: "/favicon.png?v=circle", sizes: "32x32", type: "image/png" },
      { url: "/icon-512.png?v=circle", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=circle", sizes: "180x180" }],
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-taupe">
        <Header />
        <main className="flex-1 overflow-x-hidden">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
