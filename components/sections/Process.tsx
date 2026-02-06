"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProcessContent, ProcessStep, ProcessStyles } from "@/lib/supabase/process";

type ProcessProps = {
  content: ProcessContent;
  styles: ProcessStyles;
  steps: ProcessStep[];
  locale: "en" | "th";
  mode: "light" | "dark";
  previewDevice?: "desktop" | "tablet" | "mobile";
};

const resolveText = (locale: "en" | "th", value: string, valueTh?: string) =>
  locale === "th" ? valueTh || value : value;

const resolveFont = (locale: "en" | "th", enFont?: string, thFont?: string) =>
  locale === "th" ? thFont || enFont : enFont || thFont;

const resolveColor = (mode: "light" | "dark", light?: string, dark?: string) =>
  mode === "light" ? light || dark : dark || light;

const isIconUrl = (value: string) => value.startsWith("http") || value.startsWith("/");
const isSvgSource = (src?: string) => {
  if (!src) return false;
  const normalized = src.split("?")[0].toLowerCase();
  return normalized.endsWith(".svg") || src.startsWith("data:image/svg");
};

export default function Process({
  content,
  styles,
  steps,
  locale,
  mode,
  previewDevice,
}: ProcessProps) {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof window === "undefined") return;
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
  }, []);
  const title = resolveText(locale, content.title, content.title_th);
  const subtitle = resolveText(locale, content.subtitle, content.subtitle_th);
  const titleWords = title.trim().split(" ");
  const titlePrimary = titleWords.slice(0, -1).join(" ");
  const titleAccent = titleWords.slice(-1).join("");

  const accentColor = resolveColor(mode, styles.accentColorLight, styles.accentColorDark) || "#f98c1f";
  const lineBaseColor =
    resolveColor(mode, styles.lineBaseColorLight, styles.lineBaseColorDark) || "#3a3027";
  const lineAccentColor =
    resolveColor(mode, styles.lineAccentColorLight, styles.lineAccentColorDark) || accentColor;
  const lineDashColor =
    resolveColor(mode, styles.lineDashColorLight, styles.lineDashColorDark) || accentColor;
  const stepNumberColor =
    resolveColor(mode, styles.stepNumberColorLight, styles.stepNumberColorDark) || accentColor;

  const titleStyle: CSSProperties = {
    color: resolveColor(mode, styles.titleColorLight, styles.titleColorDark),
    fontFamily: resolveFont(locale, styles.titleFontFamilyEn, styles.titleFontFamilyTh),
    fontSize: styles.titleFontSize ? `${styles.titleFontSize}px` : undefined,
  };

  const subtitleStyle: CSSProperties = {
    color: resolveColor(mode, styles.subtitleColorLight, styles.subtitleColorDark),
    fontFamily: resolveFont(locale, styles.subtitleFontFamilyEn, styles.subtitleFontFamilyTh),
    fontSize: styles.subtitleFontSize ? `${styles.subtitleFontSize}px` : undefined,
  };

  const titleAccentStyle: CSSProperties = {
    color: accentColor,
  };

  const isForcedMobile = previewDevice === "mobile";
  const forceDesktopLayout = previewDevice === "desktop";
  const showDesktopLines = previewDevice ? previewDevice !== "mobile" : true;
  const showMobileLines = previewDevice ? previewDevice === "mobile" : true;
  const shouldShowMobileLines = forceDesktopLayout ? false : showMobileLines;

  const linePulseDesktop = styles.linePulseDurationDesktop ?? 6;
  const linePulseMobile = styles.linePulseDurationMobile ?? 4;
  const lineDashDesktop = styles.lineDashDurationDesktop ?? 8;
  const lineDashMobile = styles.lineDashDurationMobile ?? 8;

  return (
    <div
      id="process"
      ref={sectionRef}
      className={cn(
        "process-section content-auto",
        isInView && "process-animate",
        mode === "light" ? "bg-white text-neutral-800" : "bg-[#181411] text-white"
      )}
      style={
        {
          "--process-accent": accentColor,
          "--process-line-base": lineBaseColor,
          "--process-line-accent": lineAccentColor,
          "--process-line-dash": lineDashColor,
        } as CSSProperties
      }
    >
      <section className={cn("relative pb-1 pt-1 text-left", mode === "light" ? "bg-white" : "bg-[#181411]")}>
        <div className="pointer-events-none absolute inset-0 bg-[url('/textures/noise.svg')] opacity-20 mix-blend-soft-light" />
        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
          <div className="relative z-10">
            <div
              className={cn(
                "absolute left-0 top-0 h-[320px] w-full max-w-[560px] rounded-full blur-[120px] -z-10 pointer-events-none",
                mode === "light" ? "bg-orange-500/10" : "bg-primary/10"
              )}
            />
            <h1
              className={cn(
                "process-heading process-fall-item mb-4 mt-6 text-3xl font-black tracking-tighter md:text-5xl",
                mode === "light" ? "text-neutral-900" : "text-white"
              )}
              style={{ ...titleStyle, animationDelay: "0.1s" }}
            >
              {titlePrimary || title}
              {titlePrimary ? (
                <span className={cn(mode === "light" ? "text-orange-600" : "text-primary")} style={titleAccentStyle}>
                  {" "}
                  {titleAccent}
                </span>
              ) : null}
            </h1>
            {subtitle ? (
              <p
                className={cn(
                  "process-fall-item max-w-xl text-sm font-light leading-relaxed md:text-base",
                  mode === "light" ? "text-neutral-600" : "text-[#bbab9b]"
                )}
                style={{ ...subtitleStyle, animationDelay: "0.35s" }}
              >
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className={cn("relative w-full overflow-hidden px-4 py-10 md:px-10", mode === "light" ? "bg-white" : "bg-[#181411]")}>
        <div className="pointer-events-none absolute inset-0 bg-[url('/textures/noise.svg')] opacity-20 mix-blend-soft-light" />
        <div className="relative mx-auto max-w-[1400px]">
          {showDesktopLines ? (
            <div
              className={cn(
                "pointer-events-none absolute left-0 top-[60px] h-[150px] w-full -z-0",
                forceDesktopLayout ? "block" : "hidden md:block"
              )}
            >
              <svg
                className="line-glow"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 1200 150"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor={lineBaseColor} stopOpacity="0.2" />
                    <stop offset="20%" stopColor={lineAccentColor} stopOpacity="0.8" />
                    <stop offset="50%" stopColor={lineAccentColor} stopOpacity="1" />
                    <stop offset="80%" stopColor={lineAccentColor} stopOpacity="0.8" />
                    <stop offset="100%" stopColor={lineBaseColor} stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <path
                  className="process-line-main"
                  d="M0,75 C100,75 120,40 240,40 C360,40 380,110 480,110 C580,110 620,50 720,50 C820,50 860,100 960,100 C1060,100 1100,75 1200,75"
                  stroke="url(#lineGradient)"
                  strokeLinecap="round"
                  strokeWidth="2"
                  style={{ animationDuration: `${linePulseDesktop}s` }}
                />
                <path
                  className="process-desktop-dash"
                  d="M0,75 C100,80 120,45 240,45 C360,45 380,115 480,115 C580,115 620,55 720,55 C820,55 860,105 960,105 C1060,105 1100,80 1200,80"
                  fill="none"
                  stroke={lineDashColor}
                  strokeDasharray="4 4"
                  strokeOpacity="0.3"
                  strokeWidth="1"
                  style={{ animationDuration: `${lineDashDesktop}s` }}
                />
              </svg>
            </div>
          ) : null}

          {shouldShowMobileLines ? (
            <div
              className={cn(
                "pointer-events-none absolute inset-0 h-full w-full -z-0 md:hidden",
                forceDesktopLayout && "hidden"
              )}
            >
              <svg
                className="line-glow h-full w-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="mobileLineGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor={lineBaseColor} stopOpacity="0" />
                    <stop offset="10%" stopColor={lineAccentColor} stopOpacity="0.7" />
                    <stop offset="50%" stopColor={lineAccentColor} stopOpacity="1" />
                    <stop offset="90%" stopColor={lineAccentColor} stopOpacity="0.7" />
                    <stop offset="100%" stopColor={lineBaseColor} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  className="process-line-main"
                  d="M 18,10 C 18,20 82,20 82,30 C 82,40 18,40 18,50 C 18,60 82,60 82,70 C 82,80 18,80 18,90"
                  stroke="url(#mobileLineGradient)"
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  style={{ animationDuration: `${linePulseMobile}s` }}
                />
                <path
                  d="M 18,10 C 18,20 82,20 82,30 C 82,40 18,40 18,50 C 18,60 82,60 82,70 C 82,80 18,80 18,90"
                  className="process-mobile-dash"
                  stroke={lineDashColor}
                  strokeDasharray="2 4"
                  strokeOpacity="0.6"
                  strokeWidth="0.5"
                  style={{ animationDuration: `${lineDashMobile}s` }}
                />
              </svg>
            </div>
          ) : null}

          <div
            className={cn(
              "relative z-10 grid grid-cols-1 gap-y-16",
              forceDesktopLayout ? "grid-cols-5 gap-4" : "md:grid-cols-5 md:gap-4",
              isForcedMobile && "md:grid-cols-1 md:gap-8"
            )}
          >
            {steps.map((step, index) => {
              const isEven = index % 2 === 1;
              const isHighlight = step.highlight;
              const rowClass = forceDesktopLayout
                ? ""
                : isEven
                ? "flex-row-reverse text-right"
                : "flex-row";
              const layoutClass = forceDesktopLayout
                ? "flex-col justify-center gap-0 text-center"
                : "md:flex-col md:justify-center md:gap-0 md:text-center";
              const contentAlign = forceDesktopLayout
                ? "items-center"
                : isEven
                ? "items-end"
                : "items-start";
              const stepTitleColor = resolveColor(
                mode,
                step.titleColorLight || styles.stepTitleColorLight,
                step.titleColorDark || styles.stepTitleColorDark
              );
              const stepIconColor = resolveColor(
                mode,
                step.iconColorLight || styles.stepIconColorLight,
                step.iconColorDark || styles.stepIconColorDark
              );
              const resolvedIconColor = stepIconColor || (isHighlight ? accentColor : undefined);
              const stepBodyColor = resolveColor(
                mode,
                step.bodyColorLight || styles.stepBodyColorLight,
                step.bodyColorDark || styles.stepBodyColorDark
              );
              const stepTitleFont = resolveFont(
                locale,
                step.titleFontFamilyEn || styles.stepTitleFontFamilyEn,
                step.titleFontFamilyTh || styles.stepTitleFontFamilyTh
              );
              const stepBodyFont = resolveFont(
                locale,
                step.bodyFontFamilyEn || styles.stepBodyFontFamilyEn,
                step.bodyFontFamilyTh || styles.stepBodyFontFamilyTh
              );
              const stepTitleSize = step.titleFontSize ?? styles.stepTitleFontSize;
              const stepBodySize = step.bodyFontSize ?? styles.stepBodyFontSize;
              const stepTitleText = resolveText(locale, step.title, step.title_th);
              const stepBodyText = resolveText(locale, step.body, step.body_th);

              return (
                <div
                  key={step.id}
                  className={cn(
                    "group relative flex items-center justify-between gap-6 text-left",
                    layoutClass,
                    rowClass,
                    step.offsetClass ?? ""
                  )}
                >
                  <div
                    className={cn(
                      "process-step-orb relative shrink-0 transition-transform duration-500 group-hover:-translate-y-2",
                      forceDesktopLayout ? "mb-8" : "md:mb-8"
                    )}
                    style={{ animationDelay: `${index * 0.25}s` }}
                  >
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-[20px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <div
                      className={cn(
                        "relative z-10 flex h-20 w-20 items-center justify-center rounded-full shadow-xl md:h-24 md:w-24",
                        isHighlight
                          ? "border-2 border-[var(--process-accent)] bg-[#23190f] shadow-[0_0_25px_rgba(249,140,31,0.25)]"
                          : "border border-[#55473a] bg-[#23190f] transition-colors duration-300 group-hover:border-[var(--process-accent)]"
                      )}
                    >
                      {isIconUrl(step.icon) ? (
                        <Image
                          src={step.icon}
                          alt=""
                          aria-hidden="true"
                          className="h-10 w-10 object-contain"
                          width={40}
                          height={40}
                          sizes="40px"
                          unoptimized={isSvgSource(step.icon)}
                        />
                      ) : (
                        <span
                          className={cn(
                            "material-symbols-outlined text-4xl transition-colors duration-300",
                            isHighlight
                              ? "text-[var(--process-accent)]"
                              : "group-hover:text-[var(--process-accent)]"
                          )}
                          style={{ color: resolvedIconColor }}
                          aria-hidden="true"
                        >
                          {step.icon}
                        </span>
                      )}
                    </div>
                    <div
                      className={cn(
                        "absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold uppercase tracking-widest transition-colors",
                        isHighlight ? "text-[var(--process-accent)]" : "group-hover:text-[var(--process-accent)]"
                      )}
                      style={{ color: isHighlight ? accentColor : stepNumberColor }}
                    >
                      {step.number}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "flex flex-1 flex-col",
                      contentAlign,
                      forceDesktopLayout ? "" : !isForcedMobile && "md:items-center"
                    )}
                  >
                    <h3
                      className={cn(
                        "process-step-heading process-step-fall mb-2 text-xl font-bold uppercase tracking-wide transition-colors",
                        isHighlight ? "text-glow text-white" : "text-white group-hover:text-[var(--process-accent)]"
                      )}
                      style={{
                        color: stepTitleColor,
                        fontFamily: stepTitleFont,
                        fontSize: stepTitleSize ? `${stepTitleSize}px` : undefined,
                        animationDelay: `${index * 0.25 + 0.2}s`,
                      }}
                    >
                      {stepTitleText}
                    </h3>
                    <p
                      className="process-step-fall text-sm font-light leading-relaxed md:max-w-[200px]"
                      style={{
                        color: stepBodyColor,
                        fontFamily: stepBodyFont,
                        fontSize: stepBodySize ? `${stepBodySize}px` : undefined,
                        animationDelay: `${index * 0.25 + 0.45}s`,
                      }}
                    >
                      {stepBodyText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
