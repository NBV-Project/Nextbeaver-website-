import { cookies } from "next/headers";
import type { Metadata } from "next";
import dynamicImport from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import DynamicFontLoader from "@/components/portfolio/DynamicFontLoader";
import { getPortfolioContent } from "@/lib/supabase/portfolio";
import { getDictionary, getLocaleFromCookies } from "@/lib/i18n";

export const dynamic = "auto";
export const revalidate = 600;

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextbeaver.co";

export const metadata: Metadata = {
  title: "Portfolio | Nextbeaver",
  description: "Explore selected projects and case studies from Nextbeaver Studio.",
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    title: "Portfolio | Nextbeaver",
    description: "Explore selected projects and case studies from Nextbeaver Studio.",
    url: `${baseUrl}/portfolio`,
    siteName: "Nextbeaver Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Nextbeaver",
    description: "Explore selected projects and case studies from Nextbeaver Studio.",
    images: ["/og-image.jpg"],
  },
};

const PortfolioGallery = dynamicImport(() => import("@/components/portfolio/PortfolioGallery"), {
  loading: () => <div className="min-h-[520px] w-full" aria-hidden />,
});

export default async function PortfolioPage() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore);
  const dict = getDictionary(locale);
  const content = await getPortfolioContent();

  return (
    <>
      <Header dict={dict} locale={locale} />
      <div className="portfolio-page">
        <DynamicFontLoader projects={content.projects} />
        <main className="flex-1">
        <PortfolioHero hero={content.hero} locale={locale} />
        <PortfolioGallery projects={content.projects} locale={locale} />
      </main>
      <Footer dict={dict} />
    </div>
    </>
  );
}
