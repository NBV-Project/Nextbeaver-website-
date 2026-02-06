import { cookies } from "next/headers";
import dynamicImport from "next/dynamic";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import MarqueeShowcase from "@/components/sections/MarqueeShowcase";
import ScrollReveal from "@/components/ui/ScrollReveal";
import type { LogoItem } from "@/components/LogoLoop";
import Faq from "@/components/sections/Faq";

import { getDictionary, getLocaleFromCookies } from "@/lib/i18n";
import { DEFAULT_HOME_CONTENT, getHomeContent } from "@/lib/supabase/home";
import { getAboutContent } from "@/lib/supabase/about";
import { getProcessContent } from "@/lib/supabase/process";
import { getServicesContent } from "@/lib/supabase/services";
import { getContactContent } from "@/lib/supabase/contact";
import { getFaqContent } from "@/lib/supabase/faq";
import { Metadata } from "next";

const LogoLoop = dynamicImport(() => import("@/components/LogoLoop"), {
  loading: () => <div className="min-h-[56px] w-full" aria-hidden />,
});
const About = dynamicImport(() => import("@/components/sections/About"), {
  loading: () => <div className="min-h-[600px] w-full" aria-hidden />,
});
const Process = dynamicImport(() => import("@/components/sections/Process"), {
  loading: () => <div className="process-loading w-full" aria-hidden />,
});
const Services = dynamicImport(() => import("@/components/sections/Services"), {
  loading: () => <div className="services-loading w-full" aria-hidden />,
});
const Quote = dynamicImport(() => import("@/components/sections/Quote"), {
  loading: () => <div className="min-h-[360px] w-full" aria-hidden />,
});
const Contact = dynamicImport(() => import("@/components/sections/Contact"), {
  loading: () => <div className="min-h-[700px] w-full" aria-hidden />,
});

export const dynamic = "auto";
export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore);
  const dict = getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextbeaver.co";

  return {
    title: dict.seo?.title || "Nextbeaver Studio | Digital Craftsmanship",
    description: dict.seo?.description || "Crafting digital experiences that function as flawlessly as they feel.",
    openGraph: {
      title: dict.seo?.title || "Nextbeaver Studio",
      description: dict.seo?.description || "Crafting digital experiences that function as flawlessly as they feel.",
      url: baseUrl,
      siteName: "Nextbeaver Studio",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
        },
      ],
      locale: locale === "th" ? "th_TH" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.seo?.title || "Nextbeaver Studio",
      description: dict.seo?.description || "Crafting digital experiences that function as flawlessly as they feel.",
      images: ["/og-image.jpg"],
    },
  };
}

export default async function Home() {
  const cookieStore = await cookies();
  const locale = getLocaleFromCookies(cookieStore);
  const themeCookie = cookieStore.get("theme")?.value;
  const mode = themeCookie === "light" ? "light" : "dark"; // Get mode here for LogoLoop and other dynamic components
  const dict = getDictionary(locale);

  // Parallel Data Fetching for Maximum Performance (Year 2026 Standard)
  const [
    homeContent,
    aboutContent,
    processContent,
    servicesContent,
    contactContent,
    faqContent
  ] = await Promise.all([
    getHomeContent(),
    getAboutContent(),
    getProcessContent(),
    getServicesContent(),
    getContactContent(),
    getFaqContent()
  ]);

  const safeLogoItems =
    homeContent.logoItems.length > 0
      ? homeContent.logoItems
      : DEFAULT_HOME_CONTENT.logoItems;

  const logoLoopLogos: LogoItem[] = safeLogoItems.map(item => ({
    src: item.src,
    alt: locale === "th" ? item.alt_th || item.alt : item.alt,
  }));

  const logoLoopSettings = homeContent.logoLoopSettings;
  const safeLogoHeight =
    typeof logoLoopSettings.logoHeight === "number" && logoLoopSettings.logoHeight > 0
      ? logoLoopSettings.logoHeight
      : 32;
  const safeGap =
    typeof logoLoopSettings.gap === "number" && logoLoopSettings.gap > 0
      ? logoLoopSettings.gap
      : 48;
  const safeSpeed =
    typeof logoLoopSettings.speed === "number" && logoLoopSettings.speed > 0
      ? logoLoopSettings.speed
      : 40;

  return (
    <>
      <Header dict={dict} locale={locale} />
      <div className="min-h-screen w-full overflow-x-hidden bg-background-light text-text">
        <main className="flex w-full flex-1 flex-col bg-background-light">
        <Hero
          dict={dict}
          locale={locale}
          mode={mode}
          content={homeContent.hero}
          styles={homeContent.heroStyles}
          codeLines={homeContent.heroCodeLines}
          capabilities={homeContent.heroCapabilities}
        />

        <ScrollReveal variant="slide-right" delay={0.2} duration={1.2}>
          <LogoLoop
            logos={logoLoopLogos}
            speed={safeSpeed}
            direction={logoLoopSettings.direction ?? "left"}
            gap={safeGap}
            logoHeight={safeLogoHeight}
            fadeOut={logoLoopSettings.fadeOut ?? true}
            fadeOutColor={logoLoopSettings.fadeOutColorDark}
            className="py-3 sm:py-5 bg-[#181411] transition-colors duration-300 content-auto"
          />
        </ScrollReveal>

        <ScrollReveal variant="slide-left" duration={1.2} threshold={0.1}>
          <About
            dict={dict}
            locale={locale}
            mode={mode}
            content={aboutContent.content}
            styles={aboutContent.styles}
            body={aboutContent.body}
            pillars={aboutContent.pillars}
          />
        </ScrollReveal>

        <ScrollReveal variant="slide-right" duration={1.2} threshold={0.1}>
          <Process
            content={processContent.content}
            styles={processContent.styles}
            steps={processContent.steps}
            locale={locale}
            mode={mode}
          />
        </ScrollReveal>

        <ScrollReveal variant="slide-left" duration={1.2} threshold={0.1}>
          <Services 
            dict={dict}
            content={servicesContent.content}
            styles={servicesContent.styles}
            items={servicesContent.items}
            locale={locale}
            mode={mode}
          />
        </ScrollReveal>

        <ScrollReveal variant="slide-right" duration={1.2} threshold={0.1}>
          <MarqueeShowcase 
            content={homeContent.marqueeShowcase}
            styles={homeContent.marqueeStyles}
            items={homeContent.marqueeItems}
            lang={locale}
            mode={mode}
          />
        </ScrollReveal>

        <ScrollReveal variant="slide-right" duration={1.2} threshold={0.1}>
          <Faq content={faqContent.content} items={faqContent.items} lang={locale} />
        </ScrollReveal>

        <ScrollReveal variant="slide-left" duration={1.2} threshold={0.2}>
          <Quote 
            dict={dict} 
            previewContent={homeContent.quote}
            previewStyles={homeContent.quoteStyles}
            previewLang={locale}
            previewMode={mode}
          />
        </ScrollReveal>

        <ScrollReveal variant="slide-right" duration={1.2} threshold={0.1}>
          <Contact 
            dict={dict} 
            locale={locale}
            mode={mode}
            content={contactContent.contact}
            formContent={contactContent.form}
            styles={contactContent.styles}
          />
        </ScrollReveal>
      </main>
      <Footer dict={dict} socialItems={contactContent.socialItems} />
    </div>
    </>
  );
}
