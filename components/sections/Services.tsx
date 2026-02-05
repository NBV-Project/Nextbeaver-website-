"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
// Removed unused imports: ChevronLeft, ChevronRight
import { cn } from "@/lib/utils";
import type { ServicesContent, ServicesStyles, ServiceItem, ServicePlan } from "@/lib/supabase/services";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ServicesProps = {
  dict: {
    services: {
      eyebrow: string;
      title: string;
      viewAll: string;
      explore: string;
      pricing: {
        closeLabel: string;
        plans: ServicePlan[];
      };
      items: {
        icon: string;
        title: string;
        body: string;
        features: string[];
        modalPlans?: ServicePlan[];
      }[];
    };
  };
  content?: ServicesContent;
  styles?: ServicesStyles;
  items?: ServiceItem[];
  locale?: "en" | "th";
  mode?: "light" | "dark";
  preview?: boolean;
  previewDevice?: "mobile" | "tablet" | "desktop";
  previewModalId?: string | null;
  onlyModal?: boolean;
};

const fallbackPricing: { closeLabel: string; plans: ServicePlan[] } = {
  closeLabel: "Close pricing modal",
  plans: [
    {
      title: "The Foundation",
      description: "For emerging visionaries establishing their digital footprint.",
      price: "2,500",
      currency: "$",
      period: "",
      cta: "Begin Journey",
      featureIcon: "check_circle",
      features: ["Custom Design System", "React Development", "SEO Fundamentals", "Standard Animation Suite", "CMS Integration"],
    },
    {
      title: "The Sovereign",
      description: "The zenith of performance for industry leaders.",
      price: "5,000",
      currency: "$",
      period: "",
      cta: "Claim Sovereignty",
      badge: "Most Popular",
      featured: true,
      icon: "crown",
      featureIcon: "verified",
      features: ["3D WebGL Interactions", "Headless CMS Architecture", "Advanced Analytics Dashboard", "Priority Concierge Support", "Volumetric Lighting Effects", "Multi-Region Deployment"],
    },
    {
      title: "The Imperial",
      description: "Unbounded power for global domination.",
      price: "Custom",
      cta: "Contact for Empire",
      featureIcon: "diamond",
      features: ["Dedicated Engineering Squad", "AR/VR Immersive Integration", "24/7 Global Concierge", "Custom AI Implementation", "Global CDN Deployment", "Bespoke SLA"],
    },
  ],
};

const buildFontKey = (base: string, lang: string) => 
  `${base}FontFamily${lang === "th" ? "Th" : "En"}` as keyof ServicesStyles;

const buildModeKey = (base: string, mode: string) => 
  `${base}${mode === "light" ? "Light" : "Dark"}` as keyof ServicesStyles;

const isSvgSource = (src?: string) => {
  if (!src) return false;
  const normalized = src.split("?")[0].toLowerCase();
  return normalized.endsWith(".svg") || src.startsWith("data:image/svg");
};

export default function Services({ dict, content, styles, items, locale = "en", mode = "dark", preview, previewDevice, previewModalId, onlyModal }: ServicesProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(Boolean(preview));
  const eyebrow = locale === "th" ? content?.eyebrow_th || content?.eyebrow || dict.services.eyebrow : content?.eyebrow || dict.services.eyebrow;
  const title = locale === "th" ? content?.title_th || content?.title || dict.services.title : content?.title || dict.services.title;
  const explore = locale === "th" ? content?.explore_th || content?.explore || dict.services.explore : content?.explore || dict.services.explore;

  const serviceItems: ServiceItem[] = items ?? dict.services.items.map((item, i) => ({
    id: `static-${i}`,
    iconType: "material" as const,
    iconValue: item.icon,
    title: item.title,
    title_th: undefined,
    body: item.body,
    body_th: undefined,
    features: item.features,
    modalPlans: item.modalPlans,
    orderIndex: i,
  }));

  const pricing = dict.services.pricing ?? fallbackPricing;
  const basePlans: ServicePlan[] =
    pricing.plans?.length ? pricing.plans : fallbackPricing.plans;
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const totalItems = serviceItems.length;

  const previewServiceIndex = useMemo(() => {
    if (!previewModalId) return -1;
    return serviceItems.findIndex(item => item.id === previewModalId);
  }, [previewModalId, serviceItems]);

  const resolvedServiceIndex =
    previewServiceIndex >= 0 ? previewServiceIndex : activeServiceIndex;

  const activeService = serviceItems[resolvedServiceIndex];
  const modalPlans =
    activeService?.modalPlans && activeService.modalPlans.length > 0
      ? activeService.modalPlans
      : basePlans;
  const baseFeaturedIndex = modalPlans.findIndex((plan) => plan.featured);
  const featuredIndex = baseFeaturedIndex >= 0 ? baseFeaturedIndex : modalPlans.length > 1 ? 1 : 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const isPortalReady = typeof window !== "undefined";

  // --- GSAP Animation ---
  useEffect(() => {
    if (preview || !sliderRef.current) return;

    // Use a small timeout to ensure DOM is fully ready and styles applied
    const timeoutId = setTimeout(() => {
      const ctx = gsap.context(() => {
        const cards = gsap.utils.toArray(".service-card-item");
        
        if (cards.length === 0) return;

        gsap.fromTo(
          cards,
          { 
            x: -800, // Start far left off-screen
            opacity: 0,
            force3D: true // Force GPU acceleration for smoother animation
          },
          {
            x: 0,
            opacity: 1,
            duration: 1, // Not too slow
            stagger: {
              from: "end", // Start with card 4 (rightmost)
              amount: 0.6 // Tighter timing for "flow" feel
            },
            ease: "power2.out", // Smooth but quick linear feel
            scrollTrigger: {
              trigger: sliderRef.current,
              start: "top 85%", 
              toggleActions: "play none none none",
              once: true,
            },
          }
        );
      }, sliderRef);

      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [preview, serviceItems]); // Add serviceItems dependency to re-run if items change

  const getStyle = (key: keyof ServicesStyles, fallback?: string | number) => {
    if (!styles) return fallback;
    return styles[key] ?? fallback;
  };

  const getThemeColor = (base: string, fallback?: string) => getStyle(buildModeKey(base, mode), fallback) as string;
  const getFont = (base: string, fallback?: string) => getStyle(buildFontKey(base, locale), fallback) as string;

  const previewIsMobile = preview && previewDevice === "mobile";
  const getLgColStart = (index: number) => {
    if (preview || previewDevice) return "";
    if (totalItems === 1) return index === 0 ? "lg:col-start-2" : "";
    if (totalItems === 2) return index === 0 ? "lg:col-start-2" : "";
    if (totalItems === 3) return index === 0 ? "lg:col-start-2" : "";
    return "";
  };

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof window === "undefined" || preview) return;
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
  }, [preview]);

  const clampPreviewFont = (value: string | number | undefined, max: number) => {
    if (!preview || typeof value !== "number") return value;
    if (previewDevice === "desktop" || previewDevice === "tablet") return value;
    return Math.min(value, max);
  };

  const closeModal = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 400); // Match globals.css animation duration
  }, []);

  useEffect(() => {
    if (onlyModal || !isModalOpen || preview) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.classList.add("services-modal-open");
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.classList.remove("services-modal-open");
      window.removeEventListener("keydown", handleKey);
    };
  }, [isModalOpen, onlyModal, preview, closeModal]);

  const handlePlanScroll = () => {
    const container = modalContainerRef.current;
    if (!container) return;
    const cards = Array.from(container.querySelectorAll<HTMLElement>(".services-pricing-card"));
    if (!cards.length) return;
    const currentLeft = container.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft - currentLeft);
      if (distance < closestDistance) { closestDistance = distance; closestIndex = index; }
    });
    setActivePlanIndex(closestIndex);
  };

  const scrollToPlan = (index: number) => {
    const container = modalContainerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(".services-pricing-card");
    const card = cards[index];
    if (!card) return;
    container.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  const openModal = useCallback((index: number) => {
    setActiveServiceIndex(index);
    setActivePlanIndex(0);
    setIsModalOpen(true);
  }, []);

  const handleCardKeyDown = (event: ReactKeyboardEvent, index: number) => {
    if (preview) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openModal(index);
    }
  };

  const productionSliderClasses = cn("flex w-full max-w-full min-w-0 snap-x snap-mandatory overflow-x-auto pb-8", "sm:grid sm:grid-cols-2 sm:gap-6 sm:pb-0 lg:grid-cols-4");
  const previewSliderClasses = cn(
    "flex w-full max-w-full min-w-0 snap-x snap-mandatory overflow-x-auto pb-8",
    !previewIsMobile && "grid grid-cols-2 gap-4 pb-0 !overflow-visible"
  );
  const sliderClasses = previewDevice ? previewSliderClasses : productionSliderClasses;
  const sliderWrapperStyle = previewIsMobile ? { width: "100vw", marginLeft: "calc((100vw - 100%) / -2)", marginRight: "calc((100vw - 100%) / -2)" } : undefined;
  const sectionContainerClasses = cn("mx-auto w-full", previewIsMobile ? "max-w-full px-0" : "sm:container sm:px-6 md:px-12 lg:px-20");
  const sectionPaddingClass = preview ? (previewIsMobile ? "py-0" : "py-6 sm:py-8") : "pt-0 pb-16 sm:py-20 md:py-24 lg:py-32";

  // --- RENDERING HELPERS ---
  const renderPlans = () => modalPlans.map((plan, index) => {
    const isFeatured = typeof plan.featured === "boolean" ? plan.featured : index === featuredIndex;
    const featureIcon = plan.featureIcon || (isFeatured ? "verified" : index === 2 ? "diamond" : "check_circle");
    const pTitle = locale === "th" && plan.title_th ? plan.title_th : plan.title;
    const pDesc = locale === "th" && plan.description_th ? plan.description_th : plan.description;
    const pPrice = locale === "th" && plan.price_th ? plan.price_th : plan.price;
    const pCurrency = locale === "th" && plan.currency_th ? plan.currency_th : plan.currency;
    const pPeriod = locale === "th" && plan.period_th ? plan.period_th : plan.period;
    const pCta = locale === "th" && plan.cta_th ? plan.cta_th : plan.cta;
    const pBadge = locale === "th" && plan.badge_th ? plan.badge_th : plan.badge;

    return (
      <div key={index} className={`services-pricing-card ${isFeatured ? "featured" : ""}`}>
        {pBadge && (
          <div className="services-pricing-badge" style={{ fontFamily: getFont("planBadge"), fontSize: getStyle("planBadgeFontSize") ? `${getStyle("planBadgeFontSize")}px` : undefined, color: getThemeColor("planBadgeColor") }}>
            {pBadge}
          </div>
        )}
        <div className="services-pricing-content">
          <div className="services-pricing-title-row">
            <h3 className="services-pricing-title" style={{ fontFamily: getFont("planTitle"), fontSize: getStyle("planTitleFontSize") ? `${getStyle("planTitleFontSize")}px` : undefined, color: getThemeColor("planTitleColor") }}>{pTitle}</h3>
            {plan.icon && <span className="material-symbols-outlined services-pricing-title-icon">{plan.icon}</span>}
          </div>
          <p className="services-pricing-subtitle" style={{ fontFamily: getFont("planDesc"), fontSize: getStyle("planDescFontSize") ? `${getStyle("planDescFontSize")}px` : undefined, color: getThemeColor("planDescColor") }}>{pDesc}</p>
          <div className="services-pricing-price">
            {pCurrency && <span className="services-pricing-price-currency" style={{ fontFamily: getFont("planCurrency"), fontSize: getStyle("planCurrencyFontSize") ? `${getStyle("planCurrencyFontSize")}px` : undefined, color: getThemeColor("planCurrencyColor") }}>{pCurrency}</span>}
            <span className={`services-pricing-price-value ${isFeatured ? "text-glow" : ""}`} style={{ fontFamily: getFont("planPrice"), fontSize: getStyle("planPriceFontSize") ? `${getStyle("planPriceFontSize")}px` : undefined, color: getThemeColor("planPriceColor") }}>{pPrice}</span>
            {pPeriod && <span className="services-pricing-price-period" style={{ fontFamily: getFont("planPeriod"), fontSize: getStyle("planPeriodFontSize") ? `${getStyle("planPeriodFontSize")}px` : undefined, color: getThemeColor("planPeriodColor") }}>{pPeriod}</span>}
          </div>
        </div>
        {isFeatured && <div className="services-pricing-divider" />}
        <ul className="services-pricing-features">
          {plan.features.map((feature: string, fIndex: number) => (
            <li key={`${feature}-${fIndex}`} className="services-pricing-feature" style={{ fontFamily: getFont("planFeature"), fontSize: getStyle("planFeatureFontSize") ? `${getStyle("planFeatureFontSize")}px` : undefined, color: getThemeColor("planFeatureColor") }}>
              <span className={`material-symbols-outlined services-pricing-feature-icon ${isFeatured ? "featured" : ""}`}>{featureIcon}</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <a 
          href="#contact" 
          onClick={() => setIsModalOpen(false)}
          className={`services-pricing-cta block text-center no-underline ${isFeatured ? "featured" : ""}`} 
          style={{ fontFamily: getFont("planCta"), fontSize: getStyle("planCtaFontSize") ? `${getStyle("planCtaFontSize")}px` : undefined, color: getThemeColor("planCtaColor") }}
        >
          {pCta}
        </a>
      </div>
    );
  });

  const renderModalFrame = () => (
    <div className="services-pricing-frame relative z-10 w-full max-w-full">
      <div className="services-pricing-grid" ref={modalContainerRef} onScroll={handlePlanScroll}>
        {renderPlans()}
      </div>
    </div>
  );

  // --- STANDALONE PREVIEW MODE ---
  if (onlyModal) {
    return (
      <section className="relative w-full flex flex-col items-center justify-center bg-[var(--color-bg)] py-10 min-h-[500px]">
        {renderModalFrame()}
        <div className="services-pricing-dots mt-6" role="tablist">
          {modalPlans.map((plan, index) => (
            <button key={`${index}-dot`} type="button" className={`services-pricing-dot ${index === activePlanIndex ? "active" : ""}`} onClick={() => scrollToPlan(index)} />
          ))}
        </div>
      </section>
    );
  }

  const shouldAnimate = preview ? true : isInView;

  return (
    <section
      id="services"
      ref={sectionRef}
      className={cn(
        "relative overflow-hidden bg-[var(--color-bg)] text-text content-auto",
        shouldAnimate && "services-fall-active",
        preview && "services-preview-static",
        sectionPaddingClass
      )}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/5 to-transparent dark:from-primary/10" />
      <div className={sectionContainerClasses}>
        <div className={cn("mb-8 flex flex-col gap-6 px-6 sm:mb-14 sm:gap-8 sm:px-0 md:mb-20 md:flex-row md:items-end md:justify-between", preview && "mb-2 gap-1.5 px-4 sm:mb-4 md:mb-5")}>
          <div className="max-w-xl">
            <h2
              className={cn(
                "services-fall-item mb-3 font-bold tracking-[0.15em] sm:mb-4 sm:tracking-[0.2em]",
                preview && "mb-1 tracking-[0.2em] text-[clamp(9px,2.4vw,11px)]"
              )}
              style={{ fontFamily: getFont("eyebrow"), fontSize: clampPreviewFont(getStyle("eyebrowFontSize"), 10) ? `${clampPreviewFont(getStyle("eyebrowFontSize"), 10)}px` : undefined }}
            >
              <span
                className="eyebrow-shimmer block"
                style={{ ["--eyebrow-color" as string]: getThemeColor("eyebrowColor", "var(--color-primary)") }}
              >
                {eyebrow}
              </span>
            </h2>
            <h3
              className={cn(
                "services-fall-item font-bold leading-tight",
                preview && "text-[clamp(14px,3.6vw,18px)]"
              )}
                style={{ fontFamily: getFont("title"), fontSize: clampPreviewFont(getStyle("titleFontSize"), 18) ? `${clampPreviewFont(getStyle("titleFontSize"), 18)}px` : undefined, color: getThemeColor("titleColor") }}>
              {title}
            </h3>
          </div>
        </div>

        <div className={cn("relative group/slider w-full max-w-full", preview && previewIsMobile && "overflow-x-hidden px-0")} style={sliderWrapperStyle}>
          <div ref={sliderRef} className={sliderClasses} style={{ scrollbarWidth: 'none' }}>
            {serviceItems.map((item, index) => {
              const itemTitle = locale === "th" && item.title_th ? item.title_th : item.title;
              const itemBody = locale === "th" && item.body_th ? item.body_th : item.body;
              return (
                <div
                  key={index}
                  className={cn(
                    "min-w-full snap-center box-border w-full",
                    !preview && !previewDevice && cn("sm:contents", getLgColStart(index)),
                    preview ? "px-0" : "px-6"
                  )}
                >
                  <article 
                    className={cn(
                      "service-card-item services-card-rise group relative flex w-full max-w-full shrink-0 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-500 hover:border-primary/50",
                      preview ? (previewIsMobile ? "mx-auto h-auto min-h-[200px] p-3.5 sm:min-h-[240px] sm:p-4" : "mx-auto h-auto w-full p-2.5") : "h-[50vh] p-6 sm:h-auto sm:min-h-[380px] sm:p-8 md:min-h-[420px]"
                    )}
                    style={{ backgroundColor: getThemeColor("cardBg", "var(--color-surface-alt)"), borderColor: getThemeColor("cardBorder", "var(--color-border)"),
                      ...(preview ? (previewIsMobile ? { minHeight: "200px", maxHeight: "260px" } : { height: "auto", minHeight: "auto" }) : {}),
                      animationDelay: `${0.4 + index * 0.18}s`,
                    }}
                    onClick={() => !preview && openModal(index)}
                    onKeyDown={(e) => handleCardKeyDown(e, index)}
                    tabIndex={preview ? -1 : 0}
                    role="button"
                    aria-label={`View details for ${itemTitle}`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 opacity-60" />
                    <div className="relative z-10">
                      <div className={cn("mb-4 flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 group-hover:bg-primary sm:h-12 sm:w-12", preview && (previewIsMobile ? "mb-1.5 h-7 w-7" : "mb-1.5 h-6 w-6"))}
                           style={{ backgroundColor: getThemeColor("cardIconBg", "rgba(255,255,255,0.05)"), color: getThemeColor("cardIconColor") }}>
                        {item.iconType === "svg" ? (
                          <Image
                            src={item.iconValue}
                            alt=""
                            className="size-6 object-contain"
                            width={24}
                            height={24}
                            sizes="24px"
                            unoptimized={isSvgSource(item.iconValue)}
                          />
                        ) : (
                          <span className="material-symbols-outlined text-xl sm:text-2xl">
                            {item.iconValue || "diamond"}
                          </span>
                        )}
                      </div>
                      <h4 className={cn("services-fall-item mb-2 font-bold")} style={{ fontFamily: getFont("cardTitle"), fontSize: clampPreviewFont(getStyle("cardTitleFontSize"), previewIsMobile ? 14 : 10) ? `${clampPreviewFont(getStyle("cardTitleFontSize"), previewIsMobile ? 14 : 10)}px` : undefined, color: getThemeColor("cardTitleColor"), animationDelay: `${0.6 + index * 0.12}s` }}>{itemTitle}</h4>
                      <p
                        className={cn("services-fall-item text-sm leading-relaxed", preview && (previewIsMobile ? "text-[clamp(11px,2.8vw,12px)]" : "text-[9px] leading-tight"))}
                        style={{
                          fontFamily: getFont("cardBody"),
                          fontSize: clampPreviewFont(getStyle("cardBodyFontSize"), previewIsMobile ? 11 : 9) ? `${clampPreviewFont(getStyle("cardBodyFontSize"), previewIsMobile ? 11 : 9)}px` : undefined,
                          color: getThemeColor("cardBodyColor"),
                          animationDelay: `${0.7 + index * 0.12}s`,
                        }}
                      >
                        {itemBody}
                      </p>
                    </div>
                    <div className={cn("relative z-10 mt-auto border-t border-border pt-6 sm:pt-8", preview && "pt-3 sm:pt-4")}>
                      <ul className={cn("mb-4 space-y-1.5 text-xs text-accent-text sm:mb-6 sm:space-y-2", preview && "mb-1.5 space-y-1 text-[10px] sm:mb-2")}>
                        {item.features.map((f, fIndex) => (
                          <li
                            key={f}
                            className="services-fall-item flex items-center gap-2"
                            style={{ animationDelay: `${0.85 + index * 0.12 + fIndex * 0.08}s` }}
                          >
                            <span className="h-1 w-1 rounded-full bg-primary" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <span
                        className={cn(
                          "services-rise-item inline-block text-sm font-bold transition-transform duration-300 group-hover:translate-x-2",
                          preview && "text-[clamp(11px,2.8vw,12px)]"
                        )}
                        style={{
                          fontFamily: getFont("explore"),
                          fontSize: clampPreviewFont(getStyle("exploreFontSize"), 11) ? `${clampPreviewFont(getStyle("exploreFontSize"), 11)}px` : undefined,
                          color: getThemeColor("exploreColor", "var(--color-primary)"),
                          animationDelay: `${1.2 + index * 0.12}s`,
                        }}
                      >
                        {explore}
                      </span>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isPortalReady && (preview ? Boolean(previewModalId) : isModalOpen) && !preview &&
        createPortal(
          <div className={cn("services-modal-scope theme-root", mode === "light" ? "theme-light" : "theme-dark")}>
            <div 
              className={cn("services-pricing-overlay", isClosing && "closing")} 
              onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
            >
              <button
                type="button"
                className="services-pricing-close"
                onClick={(event) => {
                  event.stopPropagation();
                  closeModal();
                }}
                aria-label={pricing.closeLabel}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="services-pricing-modal" role="dialog" aria-modal="true">
                {renderModalFrame()}
                <div className="services-pricing-dots" role="tablist">
                  {modalPlans.map((plan, index) => (
                    <button key={`${index}-dot`} type="button" className={`services-pricing-dot ${index === activePlanIndex ? "active" : ""}`} onClick={() => scrollToPlan(index)} />
                  ))}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </section>
  );
}
