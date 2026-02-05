 "use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HomeMarqueeShowcase, HomeMarqueeStyles, HomeMarqueeItem } from "@/lib/supabase/home";
import MarqueeVisual from "@/components/sections/MarqueeVisual";

type Props = {
  content?: HomeMarqueeShowcase;
  styles?: HomeMarqueeStyles;
  items?: HomeMarqueeItem[];
  lang?: "en" | "th";
  mode?: "light" | "dark";
  isAdmin?: boolean;
};

export default function MarqueeShowcase({
  content,
  styles,
  items,
  lang = "en",
  mode = "dark",
  isAdmin = false,
}: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof window === "undefined" || isAdmin) return;
    if (!("IntersectionObserver" in window)) {
      setTimeout(() => setIsInView(true), 0);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isAdmin]);

  // Safe fallbacks if content is missing (though it shouldn't be with the setup)
  if (!content) return null;

  const images = items ? items.map((i) => i.src).filter((src) => src && src.length > 0) : [];

  const getVal = (en?: string, th?: string) => (lang === "th" ? th || en : en);
  const getStyle = (light?: string, dark?: string) => (mode === "light" ? light : dark);

  // Badge Styles
  const badgeFont = getVal(styles?.badgeFontFamilyEn, styles?.badgeFontFamilyTh);
  const badgeColor = getStyle(styles?.badgeColorLight, styles?.badgeColorDark);

  // Title Styles
  const titleFont = getVal(styles?.titleFontFamilyEn, styles?.titleFontFamilyTh);
  const titleColor = getStyle(styles?.titleColorLight, styles?.titleColorDark);

  // Heading Styles
  const headingFont = getVal(styles?.headingFontFamilyEn, styles?.headingFontFamilyTh);
  const headingColor = getStyle(styles?.headingColorLight, styles?.headingColorDark);

  // Desc Styles
  const descFont = getVal(styles?.descFontFamilyEn, styles?.descFontFamilyTh);
  const descColor = getStyle(styles?.descColorLight, styles?.descColorDark);

  // CTA 1
  const cta1Bg = getStyle(styles?.cta1BgLight, styles?.cta1BgDark);
  const cta1TextCol = getStyle(styles?.cta1TextColorLight, styles?.cta1TextColorDark);

  // CTA 2
  const cta2Bg = getStyle(styles?.cta2BgLight, styles?.cta2BgDark);
  const cta2TextCol = getStyle(styles?.cta2TextColorLight, styles?.cta2TextColorDark);
  const cta2Border = getStyle(styles?.cta2BorderLight, styles?.cta2BorderDark);
  const rawCta2Link = content.cta2Link || "#";
  const cta2Href =
    rawCta2Link === "/contact" || rawCta2Link === "contact"
      ? "/#contact"
      : rawCta2Link;
  const cta2IsHash = cta2Href.includes("#");

  return (
    <section
      ref={sectionRef}
      className={cn(
        "marquee-freeze relative overflow-hidden bg-white text-text dark:bg-background-dark content-auto",
        isInView && "marquee-fall-active",
        isAdmin ? "py-6 lg:py-20" : "py-20 sm:py-24 md:py-28"
      )}
    >
      <div className="container mx-auto">
        <div className={cn("flex flex-col gap-3 text-left", isAdmin ? "mb-3 lg:mb-12" : "mb-10 sm:mb-12")}>
          <p
            className="marquee-fall-item text-xs font-bold tracking-[0.15em] sm:text-sm sm:tracking-[0.2em]"
            style={{
              fontFamily: badgeFont,
              fontSize: styles?.badgeFontSize,
              animationDelay: "0.1s",
            }}
          >
            <span
              className="eyebrow-shimmer eyebrow-shimmer-animate inline-block"
              style={{ ["--eyebrow-color" as string]: badgeColor || "var(--color-accent)" }}
            >
              {getVal(content.badge, content.badge_th)}
            </span>
          </p>
          <p
            className="marquee-fall-item text-2xl font-bold leading-tight sm:text-3xl md:text-4xl whitespace-pre-wrap"
            style={{
              fontFamily: titleFont,
              fontSize: styles?.titleFontSize ? `${styles.titleFontSize}px` : undefined,
              color: titleColor,
              animationDelay: "0.3s",
            }}
          >
            {getVal(content.title, content.title_th)}
          </p>
        </div>
        <div
          className={cn(
            "marquee-dark relative mx-auto flex w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl border border-border bg-[var(--color-surface)] text-text shadow-soft",
            isAdmin ? "min-h-[25vh] lg:h-[70vh] w-auto lg:w-full py-6 lg:py-0" : "h-[70vh]"
          )}
        >
          <h2
            className="marquee-fall-item relative z-20 mx-auto max-w-4xl text-center font-semibold text-balance md:text-4xl lg:text-6xl"
            style={{
              fontFamily: headingFont,
              fontSize: styles?.headingFontSize ? `${styles.headingFontSize}px` : undefined,
              color: headingColor,
              animationDelay: "0.6s",
            }}
          >
            {getVal(content.headingPrefix, content.headingPrefix_th)}
            <span className="relative z-20">
              {getVal(content.highlightedText, content.highlightedText_th)}
            </span>{" "}
            {getVal(content.headingSuffix, content.headingSuffix_th)}
          </h2>
          <p
            className="marquee-fall-item relative z-20 mx-auto max-w-2xl py-8 text-center text-sm md:text-base font-medium opacity-90 transition-colors duration-300"
            style={{
              fontFamily: descFont,
              fontSize: styles?.descFontSize,
              color: descColor,
              animationDelay: "0.9s",
            }}
          >
            {getVal(content.description, content.description_th)}
          </p>

          <div className="marquee-rise relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href={content.cta1Link || "#"}
              className="cta-uiverse marquee-rise-item rounded-md px-6 py-2.5 text-sm font-bold transition-colors hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: cta1Bg,
                color: cta1TextCol,
                ["--cta-base" as string]: cta1Bg,
                ["--cta-text" as string]: cta1TextCol,
                ["--cta-hover-start" as string]: "#f27f0d",
                ["--cta-hover-end" as string]: "#ffd9b0"
              }}
            >
              <span className="cta-label">
                {getVal(content.cta1Text, content.cta1Text_th)}
              </span>
            </Link>
            <Link
              href={cta2Href}
              scroll={cta2IsHash ? false : undefined}
              className="cta-uiverse marquee-rise-item marquee-cta-blur rounded-md border px-6 py-2.5 text-sm font-medium backdrop-blur-sm transition-colors hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: cta2Bg,
                borderColor: cta2Border,
                color: cta2TextCol,
                ["--cta-base" as string]: cta2Bg,
                ["--cta-text" as string]: cta2TextCol,
                ["--cta-border" as string]: cta2Border,
                ["--cta-hover-start" as string]: "#3a2b22",
                ["--cta-hover-end" as string]: "#f27f0d"
              }}
            >
              <span className="cta-label">
                {getVal(content.cta2Text, content.cta2Text_th)}
              </span>
            </Link>
          </div>

          <div className="marquee-overlay absolute inset-0 z-10 h-full w-full" />
          <MarqueeVisual
            className="pointer-events-none absolute inset-0 h-full w-full"
            images={images}
            interactive={false}
            autoScroll={true}
            speed={content.marqueeSpeed / 100} // Adjust scale if needed
          />
        </div>
      </div>
    </section>
  );
}
