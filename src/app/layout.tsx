import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Red_Hat_Display, Baloo_2 } from "next/font/google";
import { getSiteContent } from "@/lib/content";
import MobileScrollReset from "@/components/MobileScrollReset";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const redHat = Red_Hat_Display({
  variable: "--font-red-hat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const site = getSiteContent();

// Basis-URL voor absolute metadata-URL's (og:url, og:image). Op Vercel wordt
// automatisch het productiedomein gebruikt, lokaal of elders overschrijfbaar
// via NEXT_PUBLIC_SITE_URL. De fallback is het huidige domein.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.goodnessforall.nl");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.settings.defaultMetaTitle,
  description: site.settings.defaultMetaDescription,
  openGraph: {
    type: "website",
    siteName: site.settings.siteName,
    title: site.settings.defaultMetaTitle,
    description: site.settings.defaultMetaDescription,
    url: "/",
    locale: "nl_NL",
    images: [
      {
        url: "/images/home/hero.jpg",
        width: 512,
        height: 384,
        alt: site.settings.logoAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.settings.defaultMetaTitle,
    description: site.settings.defaultMetaDescription,
    images: ["/images/home/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${jakarta.variable} ${redHat.variable} ${baloo.variable}`}>
      <head>
        {/* Material Symbols Outlined — icon glyphs used across every page */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>
      <body className="text-evergreen overflow-x-hidden">
        <MobileScrollReset />
        {children}
      </body>
    </html>
  );
}
