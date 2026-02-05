"use client";
import { useEffect, useState, type ReactNode } from "react";

import Link from "next/link";
import {
  MessageSquare,
  PlayCircle,
  Diamond,
  CheckCircle,
  Code2,
  Terminal,
  Layers,
  Layout,
  Rocket,
  Shield,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n";
import type {
  HomeHero,
  HomeHeroStyles,
  HomeHeroCodeLine,
  HomeHeroCapability,
} from "@/lib/supabase/home";

type HeroProps = {
  dict: Dictionary;
  locale: "en" | "th";
  mode: "light" | "dark";
  previewDevice?: "desktop" | "tablet" | "mobile";
  content?: HomeHero;
  styles?: HomeHeroStyles;
  codeLines?: HomeHeroCodeLine[];
  capabilities?: HomeHeroCapability[];
};

const THEME_EVENT = "nbv-theme-change";

const iconMap = {
  diamond: Diamond,
  layers: Layers,
  "code-2": Code2,
  terminal: Terminal,
  layout: Layout,
  rocket: Rocket,
  shield: Shield,
  sparkles: Sparkles,
} as const;

export default function Hero({
  dict,
  locale,
  mode,
  previewDevice,
  content,
  styles,
  codeLines,
  capabilities,
}: HeroProps) {
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark" | null>(() => {
    if (typeof document === "undefined") return null;
    const root = document.getElementById("app-root");
    return root?.classList.contains("theme-light") ? "light" : "dark";
  });

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

  const effectiveMode = previewDevice ? mode : resolvedMode ?? mode;
  const isLight = effectiveMode === "light";
  const isPreview = Boolean(previewDevice);
  const previewIsDesktop = previewDevice === "desktop";
  const previewIsTablet = previewDevice === "tablet";
  const previewIsMobile = previewDevice === "mobile";
  const isPreviewCompact = isPreview && (previewIsMobile || previewIsTablet);

  const gridClasses = isPreview
    ? previewIsDesktop
      ? "grid grid-cols-2 gap-20 items-center"
      : "grid grid-cols-1 gap-12 items-center"
    : "grid lg:grid-cols-2 gap-12 lg:gap-20 items-center";

  const rightVisualClasses = isPreview
    ? previewIsDesktop
      ? "block"
      : "hidden"
    : "hidden lg:block";

  const headlineClasses = isPreview
    ? previewIsMobile
      ? "text-5xl"
      : previewIsTablet
      ? "text-6xl"
      : "text-7xl"
    : "text-5xl sm:text-6xl lg:text-7xl";

  const descriptionClasses = isPreview
    ? previewIsMobile
      ? "text-lg"
      : "text-xl"
    : "text-lg sm:text-xl";

  const pickLocalized = (base: string, fallback: string) => {
    if (!content) {
      return fallback;
    }
    const thKey = `${base}_th` as keyof HomeHero;
    const enKey = base as keyof HomeHero;
    const value = locale === "th" ? content[thKey] : content[enKey];
    return (value as string) || (content[enKey] as string) || fallback;
  };

  const title = pickLocalized("title", dict.hero?.titleTop || "ARCHITECTING");
  const accent = pickLocalized("accent", dict.hero?.titleStroke || "DIGITAL LEGACIES");
  const description = pickLocalized(
    "description",
    dict.hero?.body ||
      "We craft bespoke web applications and high-performance platforms with uncompromising quality and precision for the world's most visionary brands."
  );
  const primaryCtaText = pickLocalized("primaryCta", dict.hero?.primaryCta || "Start Your Project");
  const secondaryCtaText = pickLocalized("secondaryCta", dict.hero?.secondaryCta || "View Showreel");
  const badgeText = pickLocalized("badge", "Accepting New Ventures");
  const statusLabel = pickLocalized("statusLabel", "Status");
  const statusValue = pickLocalized("statusValue", "System Optimized");

  const primaryCtaHref = content?.primaryCtaHref || "#contact";
  const secondaryCtaHref = content?.secondaryCtaHref || "/portfolio";
  const codeFilename = content?.codeFilename || "nextbeaver.tsx";

  const pickFont = (base: string) => {
    const enKey = `${base}En` as keyof HomeHeroStyles;
    const thKey = `${base}Th` as keyof HomeHeroStyles;
    const en = styles?.[enKey] as string | undefined;
    const th = styles?.[thKey] as string | undefined;
    return locale === "th" ? th || en : en || th;
  };

  const forceDarkPalette = isLight;
  const pickMode = (base: string, fallback?: string) => {
    const key = `${base}${forceDarkPalette ? "Dark" : isLight ? "Light" : "Dark"}` as keyof HomeHeroStyles;
    return (styles?.[key] as string | undefined) || fallback;
  };

  const pickModeBool = (base: string, fallback: boolean) => {
    const key = `${base}${forceDarkPalette ? "Dark" : isLight ? "Light" : "Dark"}` as keyof HomeHeroStyles;
    const value = styles?.[key];
    return typeof value === "boolean" ? value : fallback;
  };

  const titleColor = pickMode("titleColor", isLight ? "#181411" : "#ffffff");
  const descriptionColor = pickMode("descriptionColor", isLight ? "#525252" : "#a3a3a3");
  const badgeTextColor = pickMode("badgeTextColor", "#f98c1f");
  const badgeBorderColor = pickMode("badgeBorderColor", "rgba(249, 140, 31, 0.2)");
  const badgeBgColor = pickMode("badgeBgColor", "rgba(249, 140, 31, 0.05)");
  const badgeDotColor = pickMode("badgeDotColor", "#f98c1f");
  const accentColor = pickMode("accentColor", "#f98c1f");
  const accentGradientEnabled = pickModeBool("accentGradientEnabled", true);
  const accentGradientStart = forceDarkPalette
    ? styles?.accentGradientDarkStart || "#f98c1f"
    : styles?.accentGradientLightStart || "#f98c1f";
  const accentGradientEnd = forceDarkPalette
    ? styles?.accentGradientDarkEnd || "#ffd9b0"
    : styles?.accentGradientLightEnd || "#ffd9b0";
  const primaryCtaBg = pickMode("primaryCtaBg", isLight ? "#ea580c" : "#f98c1f");
  const primaryCtaTextColor = pickMode("primaryCtaText", isLight ? "#ffffff" : "#181411");
  const secondaryCtaBg = pickMode("secondaryCtaBg", isLight ? "#f5f5f4" : "rgba(255, 255, 255, 0.05)");
  const secondaryCtaTextColor = pickMode("secondaryCtaText", isLight ? "#0f172a" : "#ffffff");
  const secondaryCtaBorderColor = pickMode("secondaryCtaBorder", isLight ? "#e7e5e4" : "rgba(255, 255, 255, 0.1)");
  const statusLabelColor = pickMode("statusLabelColor", "#9ca3af");
  const statusValueColor = pickMode("statusValueColor", "#ffffff");

  const titleFontFamily = pickFont("titleFontFamily");
  const accentFontFamily = pickFont("accentFontFamily") || titleFontFamily;
  const descriptionFontFamily = pickFont("descriptionFontFamily");
  const badgeFontFamily = pickFont("badgeFontFamily");
  const ctaFontFamily = pickFont("ctaFontFamily");
  const statusLabelFontFamily = pickFont("statusLabelFontFamily");
  const statusValueFontFamily = pickFont("statusValueFontFamily");

  const titleFontSize = styles?.titleFontSize ? `${styles.titleFontSize}px` : undefined;
  const accentFontSize = styles?.accentFontSize ? `${styles.accentFontSize}px` : undefined;
  const descriptionFontSize = styles?.descriptionFontSize ? `${styles.descriptionFontSize}px` : undefined;
  const badgeFontSize = styles?.badgeFontSize ? `${styles.badgeFontSize}px` : undefined;
  const ctaFontSize = styles?.ctaFontSize ? `${styles.ctaFontSize}px` : undefined;
  const statusLabelFontSize = styles?.statusLabelFontSize ? `${styles.statusLabelFontSize}px` : undefined;
  const statusValueFontSize = styles?.statusValueFontSize ? `${styles.statusValueFontSize}px` : undefined;
  const codeFontFamily = styles?.codeFontFamily;
  const codeFontSize = styles?.codeFontSize ? `${styles.codeFontSize}px` : undefined;

  const fallbackCapabilities = [
    { label: "Strategy", icon: Diamond },
    { label: "UI/UX", icon: Layers },
    { label: "Engineering", icon: Code2 },
    { label: "DevOps", icon: Terminal },
  ];

  const normalizedCapabilities =
    capabilities && capabilities.length > 0
      ? capabilities.map(cap => ({
          label: locale === "th" ? cap.label_th || cap.label : cap.label,
          icon: iconMap[cap.icon as keyof typeof iconMap] ?? Diamond,
        }))
      : fallbackCapabilities;

  const baseCodeLines =
    codeLines && codeLines.length > 0
      ? codeLines
      : [
          { line: "import { Excellence } from '@grandeur/core';" },
          { line: "const Initialize = async () => {" },
          { line: "  // Configuring premium parameters" },
          { line: "  const config = {" },
          { line: "    target: 'Market_Leader'," },
          { line: "    quality: Infinity," },
          { line: "    style: 'Bespoke'" },
          { line: "  };" },
          { line: "  await Excellence.deploy(config);" },
          { line: "};" },
          { line: "export default Initialize;" },
        ];

  const sectionClasses = cn(
    "hero-section relative flex flex-col overflow-hidden transition-colors duration-300",
    "bg-espresso",
    isPreviewCompact ? "min-h-0 py-0" : "min-h-[calc(100vh-80px)]",
    isPreview && "hero-preview-static"
  );

  const renderAnimatedLine = (
    text: ReactNode,
    className: string,
    style?: React.CSSProperties,
    delay = 0
  ) => (
    <span
      className={cn("hero-fall-item", className)}
      style={{ ...style, animationDelay: `${delay}s` }}
    >
      {text}
    </span>
  );

  return (
    <section id="home" className={sectionClasses}>
      {/* Background Effects */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-100"
        style={{
          backgroundImage: 'radial-gradient(circle at 70% 50%, rgba(249, 140, 31, 0.15) 0%, rgba(24, 20, 17, 0) 50%)'
        }}
      />
      <div className={cn("absolute top-1/4 left-0 w-96 h-96 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-normal", isLight ? "bg-orange-500/10" : "bg-primary/5")}></div>

      <div
        className={cn(
          "relative z-10 flex items-center justify-center px-6 sm:px-10",
          isPreviewCompact ? "py-1" : "pt-20 sm:pt-24 pb-12 lg:pb-0"
        )}
      >
        <div className={cn("max-w-7xl w-full mx-auto", gridClasses)}>
          
          {/* Left Content */}
          <div className={cn("flex flex-col max-w-2xl", isPreviewCompact ? "gap-3" : "gap-8")}>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border w-fit"
              style={{
                borderColor: badgeBorderColor,
                backgroundColor: badgeBgColor,
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: badgeDotColor }}
                ></span>
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: badgeDotColor }}
                ></span>
              </span>
              {renderAnimatedLine(
                <span
                  className="eyebrow-shimmer block"
                  style={{
                    ["--eyebrow-color" as string]: badgeTextColor,
                    animation: "eyebrow-shimmer 2.2s linear infinite",
                    WebkitAnimation: "eyebrow-shimmer 2.2s linear infinite",
                  }}
                >
                  {badgeText}
                </span>,
                "text-xs font-semibold tracking-wider uppercase",
                {
                  color: badgeTextColor,
                  fontFamily: badgeFontFamily,
                  fontSize: badgeFontSize,
                },
                0.1
              )}
            </div>

            {/* Headline */}
            <h1
              className={cn(
                "font-bold leading-[1.1] tracking-tight font-display transition-colors duration-300",
                headlineClasses
              )}
              style={{
                color: titleColor,
                fontFamily: titleFontFamily,
                fontSize: titleFontSize,
              }}
            >
              {renderAnimatedLine(title, "block", undefined, 0.3)}
              {renderAnimatedLine(
                accent,
                "block -mt-0.5 sm:-mt-1 lg:-mt-2 font-semibold transition-none",
                accentGradientEnabled
                  ? {
                      backgroundImage: `linear-gradient(to right, ${accentGradientStart}, ${accentGradientEnd})`,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      fontFamily: accentFontFamily,
                      fontSize: accentFontSize,
                    }
                  : { color: accentColor, fontFamily: accentFontFamily, fontSize: accentFontSize },
                0.55
              )}
            </h1>

            {/* Description */}
            <p
              className={cn(
                "hero-desc-fall leading-relaxed max-w-lg border-l-2 pl-6 transition-colors duration-300",
                descriptionClasses
              )}
              style={{
                color: descriptionColor,
                borderColor: accentColor,
                fontFamily: descriptionFontFamily,
                fontSize: descriptionFontSize,
              }}
            >
              {renderAnimatedLine(description, "block", undefined, 0.85)}
            </p>

            {/* Buttons */}
            <div className="hero-cta-rise flex flex-wrap gap-4 pt-4">
              <Link
                href={primaryCtaHref}
                className="hero-cta-uiverse flex items-center justify-center gap-3 text-base font-bold transition-all hover:brightness-110"
                style={{
                  fontFamily: ctaFontFamily,
                  fontSize: ctaFontSize,
                  boxShadow: isLight
                    ? "0 10px 20px rgba(249, 140, 31, 0.2)"
                    : "0 0 20px rgba(249, 140, 31, 0.25)",
                  ["--cta-base" as string]: primaryCtaBg,
                  ["--cta-text" as string]: primaryCtaTextColor,
                  ["--cta-hover-start" as string]: "#f27f0d",
                  ["--cta-hover-end" as string]: "#ffd9b0",
                }}
              >
                <span className="hero-cta-label">
                  {primaryCtaText}
                  <MessageSquare className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
              <Link
                href={secondaryCtaHref}
                className="hero-cta-uiverse flex items-center justify-center gap-3 text-base font-medium transition-all hover:brightness-110"
                style={{
                  fontFamily: ctaFontFamily,
                  fontSize: ctaFontSize,
                  ["--cta-base" as string]: secondaryCtaBg,
                  ["--cta-text" as string]: secondaryCtaTextColor,
                  ["--cta-border" as string]: secondaryCtaBorderColor,
                  ["--cta-hover-start" as string]: "#3a2b22",
                  ["--cta-hover-end" as string]: "#f27f0d",
                }}
              >
                <span className="hero-cta-label">
                  <PlayCircle className="w-5 h-5" />
                  {secondaryCtaText}
                </span>
              </Link>
            </div>

            <div className={cn("border-t border-white/5 flex flex-col gap-2", isPreviewCompact ? "pt-1" : "pt-8")}>
              <span className="text-xs uppercase tracking-widest font-semibold text-neutral-500">Capabilities</span>
              <div className="hero-cap-rise flex flex-wrap gap-3">
                {normalizedCapabilities.map(({ label, icon: Icon }) => (
                  <div
                    key={label}
                    className={cn(
                      "hero-cap-item",
                      "flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest border transition-colors",
                      isLight
                        ? "border-neutral-200 bg-neutral-100 text-neutral-600"
                        : "border-white/10 bg-white/5 text-neutral-400"
                    )}
                  >
                    <Icon className={cn("h-4 w-4")} style={{ color: accentColor }} />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Visual (Code Editor) */}
          <div className={cn("hero-right-slide relative group perspective-[1000px]", rightVisualClasses)}>
            <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 dark:from-orange-500/30 to-transparent rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-700"></div>
            <div
              className={cn(
                "relative rounded-2xl shadow-2xl p-6 transform transition-transform duration-700 group-hover:rotate-y-6 group-hover:rotate-x-6",
                isLight ? "bg-[#1a1614] border border-neutral-800" : "bg-[#0f0b08] border border-white/10"
              )}
            >
              
              {/* Editor Header */}
              <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4 z-20 relative">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                <div
                  className="ml-auto flex bg-white/5 rounded px-2 py-1 text-[10px] font-mono border border-white/5"
                  style={{ color: statusLabelColor, fontFamily: codeFontFamily, fontSize: codeFontSize }}
                >
                  {codeFilename}
                </div>
              </div>

              {/* Editor Content with Scroll Animation */}
              <div className="relative h-[320px] overflow-hidden">
                <div className={cn(
                  "absolute inset-x-0 top-0 h-12 bg-gradient-to-b to-transparent z-10 pointer-events-none",
                  isLight ? "from-[#1a1614]" : "from-[#0f0b08]"
                )}></div>
                <div className={cn(
                  "absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t to-transparent z-10 pointer-events-none",
                  isLight ? "from-[#1a1614]" : "from-[#0f0b08]"
                )}></div>
                
                <div className="animate-scroll-vertical">
                  {/* Block 1 */}
                  {[baseCodeLines, baseCodeLines].map((block, blockIndex) => (
                    <div
                      key={`block-${blockIndex}`}
                      className="font-mono text-sm leading-relaxed text-neutral-400 space-y-2 pb-8"
                      style={{ fontFamily: codeFontFamily, fontSize: codeFontSize }}
                    >
                      {block.map((line, index) => (
                        <div key={`${blockIndex}-${index}`} className="flex">
                          <span className="text-purple-400 w-8 text-right mr-4 opacity-50">
                            {String(blockIndex * baseCodeLines.length + index + 1).padStart(2, "0")}
                          </span>
                          <span className="whitespace-pre">{line.line}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute right-0 bottom-0 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl opacity-20 pointer-events-none translate-x-1/3 translate-y-1/3"></div>
            </div>

            {/* Status Badge */}
            <div className="absolute -bottom-6 -left-6 bg-[#23190f] border border-white/10 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="bg-green-500/20 text-green-500 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs" style={{ color: statusLabelColor, fontFamily: statusLabelFontFamily, fontSize: statusLabelFontSize }}>
                  {statusLabel}
                </div>
                <div className="text-sm font-bold" style={{ color: statusValueColor, fontFamily: statusValueFontFamily, fontSize: statusValueFontSize }}>
                  {statusValue}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
