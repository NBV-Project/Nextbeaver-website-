import Script from "next/script";
import type { Dictionary } from "@/lib/i18n";

type StructuredDataProps = {
  locale: string;
  dict: Dictionary;
};

export default function StructuredData({ locale, dict }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nextbeaver.co";
  const services = dict.services?.items ?? [];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Nextbeaver Studio",
        "url": baseUrl,
        "description": locale === "th" ? "รับทำเว็บไซต์ระดับพรีเมียม และแอปพลิเคชันประสิทธิภาพสูง" : "High-performance digital craftsmanship studio.",
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`
        }
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Nextbeaver Studio",
        "description": dict.seo?.description,
        "publisher": { "@id": `${baseUrl}/#organization` },
        "inLanguage": locale === "th" ? "th-TH" : "en-US"
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/#webpage`,
        "url": baseUrl,
        "name": dict.seo?.title ?? "Nextbeaver Studio",
        "description": dict.seo?.description,
        "isPartOf": { "@id": `${baseUrl}/#website` },
        "about": { "@id": `${baseUrl}/#organization` },
        "inLanguage": locale === "th" ? "th-TH" : "en-US"
      },
      ...(services.length > 0 ? [{
        "@type": "OfferCatalog",
        "@id": `${baseUrl}/#services`,
        "name": locale === "th" ? "บริการ" : "Services",
        "itemListElement": services.map((service, index) => ({
          "@type": "Offer",
          "position": index + 1,
          "itemOffered": {
            "@type": "Service",
            "name": service.title,
            "description": service.body,
            "provider": { "@id": `${baseUrl}/#organization` },
          }
        }))
      }] : [])
    ]
  };

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
