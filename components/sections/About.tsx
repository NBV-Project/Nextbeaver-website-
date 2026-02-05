"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { AboutBody, AboutContent, AboutPillar, AboutStyles } from "@/lib/supabase/about";

type AboutProps = {
  dict: {
    about: {
      eyebrow: string;
      title: string;
      titleAccent: string;
      body: string[];
      highlight: {
        label: string;
        value: string;
      };
      pillars: { title: string; body: string }[];
    };
  };
  locale?: "en" | "th";
  mode?: "light" | "dark";
  previewDevice?: "desktop" | "tablet" | "mobile";
  content?: AboutContent;
  styles?: AboutStyles;
  body?: AboutBody[];
  pillars?: AboutPillar[];
};

const THEME_EVENT = "nbv-theme-change";

export default function About({
  dict,
  locale = "en",
  mode = "dark",
  previewDevice,
  content,
  styles,
  body,
  pillars,
}: AboutProps) {
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark" | null>(() => {
    if (typeof document === "undefined") return null;
    const root = document.getElementById("app-root");
    return root?.classList.contains("theme-light") ? "light" : "dark";
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [isInView, setIsInView] = useState(Boolean(previewDevice));
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.getElementById("app-root");
    if (!root) return;
    const getMode = () => (root.classList.contains("theme-light") ? "light" : "dark") as "light" | "dark";
    const update = () => setResolvedMode(getMode());
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    const handleThemeEvent = (event: Event) => {
      const next = (event as CustomEvent).detail;
      if (next === "light" || next === "dark") {
        setResolvedMode(next);
      }
    };
    window.addEventListener(THEME_EVENT, handleThemeEvent);
    return () => {
      observer.disconnect();
      window.removeEventListener(THEME_EVENT, handleThemeEvent);
    };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof window === "undefined" || previewDevice) return;
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
  }, [previewDevice]);

  const effectiveMode = previewDevice ? mode : resolvedMode ?? mode;
  const isLight = effectiveMode === "light";
  const isPreviewMobile = previewDevice === "mobile";

  const pickLocalized = (base: keyof AboutContent, fallback: string) => {
    if (!content) return fallback;
    const thKey = `${String(base)}_th` as keyof AboutContent;
    const value = locale === "th" ? content[thKey] : content[base];
    return (value as string) || (content[base] as string) || fallback;
  };

  const pickFont = (base: string) => {
    const enKey = `${base}En` as keyof AboutStyles;
    const thKey = `${base}Th` as keyof AboutStyles;
    const en = styles?.[enKey] as string | undefined;
    const th = styles?.[thKey] as string | undefined;
    return locale === "th" ? th || en : en || th;
  };

  const pickModeColor = (base: string, fallback: string) => {
    const key = `${base}${isLight ? "Light" : "Dark"}` as keyof AboutStyles;
    return (styles?.[key] as string | undefined) || fallback;
  };

  const fallbackImageUrl =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBcQdri552OE-CBYjrNJ1U797SdJSSAdo2Tk-JxDEcOxsunXqtWiLLvInfzkjsGcwwgoOQNP4ykfLchAFwV39rDkhIl6P7KFCClxhNjcUxsM7XMIxc9OZEzNTIkmSI-lje4wy6hmaZ4NzM2eZ8xNVOdj3tF5Q1_KCGHuOjXPKMT6nMzIAzVKMIsDhsNDnjdht2wX8uDOYgtXRHRrPWv-ux6BgZuMQSFSKBaJOEv2YjrkUFElhE6uhis6rQaCwmylVw9FnoHlZPZFA7x";
  const imageUrl = content?.imageUrl || fallbackImageUrl;
  const imageAlt = pickLocalized("imageAlt", "About image");
  const highlightValue = pickLocalized("highlightValue", dict.about.highlight.value);
  const highlightLabel = pickLocalized("highlightLabel", dict.about.highlight.label);
  const eyebrow = pickLocalized("eyebrow", dict.about.eyebrow);
  const title = pickLocalized("title", dict.about.title);
  const titleAccent = pickLocalized("titleAccent", dict.about.titleAccent);

  const bodyItems = body?.length
    ? body.map(item => ({
        text: locale === "th" ? item.text_th || item.text : item.text,
      }))
    : dict.about.body.map(text => ({ text }));

  const pillarItems = pillars?.length
    ? pillars.map(item => ({
        title: locale === "th" ? item.title_th || item.title : item.title,
        body: locale === "th" ? item.body_th || item.body : item.body,
      }))
    : dict.about.pillars;

  const imageOverlayColor = pickModeColor(
    "imageOverlayColor",
    "rgba(242, 127, 13, 0.2)"
  );
  const highlightBgColor = pickModeColor("highlightBgColor", "#181411");
  const highlightValueColor = pickModeColor("highlightValueColor", "#f27f0d");
  const highlightLabelColor = pickModeColor("highlightLabelColor", "#ffffff");
  const eyebrowColor = pickModeColor("eyebrowColor", "#f27f0d");
  const titleColor = pickModeColor("titleColor", isLight ? "#1b140f" : "#ffffff");
  const titleAccentColor = pickModeColor("titleAccentColor", isLight ? "#6b5d52" : "#baab9c");
  const bodyColor = pickModeColor("bodyColor", isLight ? "#6b5d52" : "#baab9c");
  const pillarTitleColor = pickModeColor("pillarTitleColor", isLight ? "#1b140f" : "#ffffff");
  const pillarBodyColor = pickModeColor("pillarBodyColor", isLight ? "#6b5d52" : "#baab9c");

  const highlightValueFontFamily = pickFont("highlightValueFontFamily");
  const highlightLabelFontFamily = pickFont("highlightLabelFontFamily");
  const eyebrowFontFamily = pickFont("eyebrowFontFamily");
  const titleFontFamily = pickFont("titleFontFamily");
  const titleAccentFontFamily = pickFont("titleAccentFontFamily") || titleFontFamily;
  const bodyFontFamily = pickFont("bodyFontFamily");
  const pillarTitleFontFamily = pickFont("pillarTitleFontFamily");
  const pillarBodyFontFamily = pickFont("pillarBodyFontFamily");

  const highlightValueFontSize = styles?.highlightValueFontSize
    ? `${styles.highlightValueFontSize}px`
    : undefined;
  const highlightLabelFontSize = styles?.highlightLabelFontSize
    ? `${styles.highlightLabelFontSize}px`
    : undefined;
  const eyebrowFontSize = styles?.eyebrowFontSize ? `${styles.eyebrowFontSize}px` : undefined;
  const titleFontSize = styles?.titleFontSize ? `${styles.titleFontSize}px` : undefined;
  const titleAccentFontSize = styles?.titleAccentFontSize
    ? `${styles.titleAccentFontSize}px`
    : undefined;
  const bodyFontSize = styles?.bodyFontSize ? `${styles.bodyFontSize}px` : undefined;
  const pillarTitleFontSize = styles?.pillarTitleFontSize
    ? `${styles.pillarTitleFontSize}px`
    : undefined;
  const pillarBodyFontSize = styles?.pillarBodyFontSize
    ? `${styles.pillarBodyFontSize}px`
    : undefined;

  return (
    <section
      id="about"
      ref={sectionRef}
      className={cn(
        "relative border-t border-border py-16 sm:py-20 md:py-24 lg:py-32 content-auto",
        previewDevice && "about-preview-static",
        isLight ? "bg-white" : "bg-background-dark"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <div className={cn(
          "grid grid-cols-1 items-start gap-10 sm:gap-12 md:gap-16 lg:grid-cols-12",
          isPreviewMobile && "gap-0"
        )}>
          {/* Image section */}
          <div
            className={cn(
              "about-slide-base relative lg:col-span-5",
              isInView && "about-image-slide",
              isPreviewMobile && "mx-auto w-full max-w-[260px]"
            )}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
              <div
                className="absolute inset-0 z-10 mix-blend-normal sm:mix-blend-overlay"
                style={{ backgroundColor: imageOverlayColor }}
              />
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="h-full w-full object-cover opacity-80"
              />
            </div>
            {/* Highlight box - repositioned for mobile */}
            <div
              className={cn(
                "absolute -bottom-4 -right-2 z-20 flex h-28 w-28 flex-col justify-center rounded-lg border border-white/10 p-4 sm:-bottom-6 sm:-right-6 sm:h-32 sm:w-32 sm:p-5 md:h-40 md:w-40 md:p-6",
                isPreviewMobile && "h-20 w-20 p-3 -bottom-3 -right-1 sm:h-20 sm:w-20 sm:p-3"
              )}
              style={{ backgroundColor: highlightBgColor }}
            >
              <span
                className="text-2xl font-bold sm:text-3xl md:text-4xl"
                style={{
                  color: highlightValueColor,
                  fontFamily: highlightValueFontFamily,
                  fontSize: highlightValueFontSize,
                }}
              >
                {highlightValue}
              </span>
              <span
                className="mt-1 text-[10px] uppercase tracking-wider sm:text-xs"
                style={{
                  color: highlightLabelColor,
                  fontFamily: highlightLabelFontFamily,
                  fontSize: highlightLabelFontSize,
                }}
              >
                {highlightLabel.split("\n").map((line, index) => (
                  <span key={`${line}-${index}`}>
                    {line}
                    {index === 0 ? <br /> : null}
                  </span>
                ))}
              </span>
            </div>
          </div>

          {/* Content section */}
          <div
            className={cn(
              "flex h-full flex-col justify-center pt-8 sm:pt-0 lg:col-span-7"
            )}
          >
            {isPreviewMobile ? (
              <button
                type="button"
                className="mb-4 inline-flex w-full items-center justify-between rounded-full border border-white/10 bg-[#1f160f]/95 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#e7d7c6] shadow-[0_12px_30px_rgba(0,0,0,0.35)]"
                onClick={() => setIsPreviewOpen(open => !open)}
                aria-expanded={isPreviewOpen}
              >
                <span className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#f27f0d]" />
                  <span>About Content</span>
                </span>
                <span className="material-symbols-outlined text-lg text-[#f4af25]">
                  {isPreviewOpen ? "expand_less" : "expand_more"}
                </span>
              </button>
            ) : null}

            <div
              className={cn(
                "about-text-fall",
                isInView && "about-text-fall-active",
                isPreviewMobile && !isPreviewOpen && "hidden"
              )}
            >
              <h2
                className="about-fall-item mb-3 text-xs font-bold tracking-[0.15em] sm:mb-4 sm:text-sm sm:tracking-[0.2em]"
                style={{
                  fontFamily: eyebrowFontFamily,
                  fontSize: eyebrowFontSize,
                  animationDelay: "0.1s",
                }}
              >
                <span
                  className="eyebrow-shimmer block"
                  style={{ ["--eyebrow-color" as string]: eyebrowColor }}
                >
                  {eyebrow}
                </span>
              </h2>
              <h3
                className="about-fall-item mb-6 text-2xl font-bold leading-tight sm:mb-8 sm:text-3xl md:text-4xl lg:text-5xl"
                style={{
                  color: titleColor,
                  fontFamily: titleFontFamily,
                  fontSize: titleFontSize,
                  animationDelay: "0.3s",
                }}
              >
                {title}
                <br />
                <span
                  style={{
                    color: titleAccentColor,
                    fontFamily: titleAccentFontFamily,
                    fontSize: titleAccentFontSize,
                  }}
                >
                  {titleAccent}
                </span>
              </h3>
              <div className="space-y-4 text-base font-light leading-relaxed sm:space-y-6 sm:text-lg">
                {bodyItems.map((paragraph, index) => (
                  <p
                    key={paragraph.text}
                    className="about-fall-item"
                    style={{
                      color: bodyColor,
                      fontFamily: bodyFontFamily,
                      fontSize: bodyFontSize ? `calc(${bodyFontSize} + 1px)` : undefined,
                      animationDelay: `${0.6 + index * 0.25}s`,
                    }}
                  >
                    {paragraph.text}
                  </p>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-1 gap-6 border-t border-border pt-6 sm:mt-12 sm:grid-cols-2 sm:gap-8 sm:pt-8">
                {pillarItems.map((pillar, index) => (
                  <div
                    key={pillar.title}
                    className="about-fall-item"
                    style={{ animationDelay: `${1.3 + index * 0.25}s` }}
                  >
                    <h4
                      className="mb-2 text-base font-bold sm:text-lg"
                      style={{
                        color: pillarTitleColor,
                        fontFamily: pillarTitleFontFamily,
                        fontSize: pillarTitleFontSize ? `calc(${pillarTitleFontSize} + 1px)` : undefined,
                      }}
                    >
                      {pillar.title}
                    </h4>
                    <p
                      className="text-sm"
                      style={{
                        color: pillarBodyColor,
                        fontFamily: pillarBodyFontFamily,
                        fontSize: pillarBodyFontSize ? `calc(${pillarBodyFontSize} + 1px)` : undefined,
                      }}
                    >
                      {pillar.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
