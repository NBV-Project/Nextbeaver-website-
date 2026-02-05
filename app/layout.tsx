import type { Metadata, Viewport } from "next";
import { Manrope, Montserrat } from "next/font/google";
import { cookies } from "next/headers";
import ServiceWorker from "@/components/pwa/ServiceWorker";
import { getDictionary, getLocaleFromCookies } from "@/lib/i18n";
import { getContactContent } from "@/lib/supabase/contact";
import "./globals.css";
import FloatingSocial from "@/components/layout/FloatingSocial";
import ScrollToHash from "@/components/ui/ScrollToHash";
import CookieConsent from "@/components/ui/CookieConsent";

import { ViewTransitions } from "next-view-transitions";
import { SpeculationRules } from "@/components/pwa/SpeculationRules";
import StructuredData from "@/components/seo/StructuredData";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://nextbeaver.co"),
  title: {
    default: "Nextbeaver Studio | Digital Craftsmanship & Web Engineering",
    template: "%s | Nextbeaver Studio",
  },
  description:
    "We craft bespoke web applications, high-performance platforms, and immersive digital experiences. The intersection of aesthetics and engineering.",
  keywords: ["Web Design", "Web Development", "Next.js Agency", "Bangkok Web Design", "High Performance Web", "Digital Agency", "Thailand"],
  authors: [{ name: "Nextbeaver Studio" }],
  creator: "Nextbeaver Studio",
  publisher: "Nextbeaver Studio",
  applicationName: "Nextbeaver Studio",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nextbeaver Studio | Digital Craftsmanship",
    description: "Crafting digital experiences that function as flawlessly as they feel.",
    url: "https://nextbeaver.co",
    siteName: "Nextbeaver Studio",
    images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
        },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nextbeaver Studio",
    description: "Digital Craftsmanship & Web Engineering",
    creator: "@nextbeaver", // ถ้ามี Twitter
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon/icon_192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon/icon_512x512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/icon/icon_192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#181411",
  colorScheme: "dark light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "light" ? "light" : "dark";
  const locale = getLocaleFromCookies(cookieStore);
  const dict = getDictionary(locale);
  const contactContent = await getContactContent();

  return (
    <ViewTransitions>
      <html
        lang={locale}
        suppressHydrationWarning
        style={{ backgroundColor: theme === "light" ? "#f8f7f5" : "#181411" }}
      >
        <head>
          <style>{`
            html, body {
              background-color: ${theme === "light" ? "#f8f7f5" : "#181411"};
            }
            #app-root {
              background-color: ${theme === "light" ? "#f8f7f5" : "#181411"};
            }
          `}</style>
        </head>
        <body
          className={`${manrope.variable} ${montserrat.variable}`}
          style={{ backgroundColor: theme === "light" ? "#f8f7f5" : "#181411" }}
        >
          <div id="app-root" className={`theme-root theme-${theme}`}>
            <ScrollToHash />
            <CookieConsent />
            {children}
            <FloatingSocial labels={dict.social} items={contactContent.socialItems} lang={locale} />
          </div>
          <ServiceWorker />
          <SpeculationRules />
          <StructuredData locale={locale} dict={dict} />
        </body>
      </html>
    </ViewTransitions>
  );
}
