 "use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { HomeQuote, HomeQuoteStyles } from "@/lib/supabase/home";

const isSvgSource = (src?: string) => {
  if (!src) return false;
  const normalized = src.split("?")[0].toLowerCase();
  return normalized.endsWith(".svg") || src.startsWith("data:image/svg");
};

type QuoteProps = {
  dict: {
    quote: {
      body: string;
      name: string;
      role: string;
    };
  };
  // Optional props for live preview from Admin
  previewContent?: HomeQuote;
  previewStyles?: HomeQuoteStyles;
  previewMode?: "light" | "dark";
  previewLang?: "en" | "th";
};

export default function Quote({ 
  dict, 
  previewContent, 
  previewStyles, 
  previewMode = "dark", 
  previewLang = "en" 
}: QuoteProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  
  // Use preview content if available, otherwise fall back to dict (static content)
  // Note: On the real page, we might want to pass fetching content via props too, 
  // but for now, we keep backward compatibility with dict or use preview if present.
  
  const content = previewContent;
  const styles = previewStyles;

  // If no dynamic content is passed (normal page load without DB fetch yet), use dict.
  // Ideally, page.tsx should fetch and pass content, but here we handle the "preview" override logic.
  
  const bodyText = content ? (previewLang === "th" ? content.body_th || content.body : content.body) : dict.quote.body;
  const authorName = content ? (previewLang === "th" ? content.authorName_th || content.authorName : content.authorName) : dict.quote.name;
  const authorRole = content ? (previewLang === "th" ? content.authorRole_th || content.authorRole : content.authorRole) : dict.quote.role;
  const iconSource = content?.icon || "format_quote";

  // Helper for styles
  const getStyle = (light?: string, dark?: string) => (previewMode === "light" ? light : dark);
  const getFont = (en?: string, th?: string) => (previewLang === "th" ? th || en : en);

  // Computed Styles
  const sectionBg = styles ? getStyle(styles.sectionBgLight, styles.sectionBgDark) : undefined;
  const iconColor = styles ? getStyle(styles.iconColorLight, styles.iconColorDark) : undefined;
  
  const bodyFont = styles ? getFont(styles.bodyFontFamilyEn, styles.bodyFontFamilyTh) : undefined;
  const bodySize = styles?.bodyFontSize;
  const bodyColor = styles ? getStyle(styles.bodyColorLight, styles.bodyColorDark) : undefined;

  const authorFont = styles ? getFont(styles.authorFontFamilyEn, styles.authorFontFamilyTh) : undefined;
  const authorSize = styles?.authorFontSize;
  const authorColor = styles ? getStyle(styles.authorColorLight, styles.authorColorDark) : undefined;

  const roleFont = styles ? getFont(styles.roleFontFamilyEn, styles.roleFontFamilyTh) : undefined;
  const roleSize = styles?.roleFontSize;
  const roleColor = styles ? getStyle(styles.roleColorLight, styles.roleColorDark) : undefined;

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

  return (
    <section 
      ref={sectionRef}
      className={cn("relative py-16 sm:py-20 md:py-24 content-auto", !sectionBg && "bg-espresso")}
      style={{ backgroundColor: sectionBg }}
    >
      <div className="container mx-auto px-4 text-center sm:px-6 md:px-12 lg:px-20">
        {iconSource.startsWith("http") || iconSource.startsWith("/") ? (
          <div
            className={cn("quote-fall-item mx-auto mb-6 relative sm:mb-8 !w-[80px] !h-[80px]", isInView && "quote-fall-active")}
            style={{ width: "80px", height: "80px", minWidth: "80px", minHeight: "80px", opacity: 0.4 }}
          >
            <Image
              src={iconSource}
              alt="Quote Icon"
              fill
              sizes="80px"
              className="object-contain scale-[1.2]"
              unoptimized={isSvgSource(iconSource)}
            />
          </div>
        ) : (
          <span 
            className={cn("quote-fall-item material-symbols-outlined mb-6 leading-none sm:mb-8", isInView && "quote-fall-active")}
            style={{ color: iconColor, animationDelay: "0.1s", fontSize: "80px" }}
          >
            {iconSource}
          </span>
        )}
        
        <h3 
          className={cn("quote-fall-item mx-auto mb-6 max-w-4xl font-light italic leading-relaxed sm:mb-8 sm:leading-normal md:mb-10", isInView && "quote-fall-active")}
          style={{
             fontFamily: bodyFont,
             fontSize: bodySize ? `${bodySize}px` : undefined,
             color: bodyColor,
             // Fallback classes if no dynamic styles
             ...(!styles && { color: "white" }),
             animationDelay: "0.3s",
          }}
        >
          {bodyText}
        </h3>
        
        <div className="flex flex-col items-center gap-1.5 sm:gap-2">
          <p 
            className={cn("quote-fall-item font-bold uppercase tracking-widest", isInView && "quote-fall-active")}
            style={{
              fontFamily: authorFont,
              fontSize: authorSize ? `${authorSize}px` : undefined,
              color: authorColor,
               ...(!styles && { color: "white", fontSize: "0.875rem" }), // text-sm
               animationDelay: "0.55s",
            }}
          >
            {authorName}
          </p>
          <p 
            className={cn("quote-fall-item", isInView && "quote-fall-active")}
            style={{
              fontFamily: roleFont,
              fontSize: roleSize ? `${roleSize}px` : undefined,
              color: roleColor,
               ...(!styles && { color: "var(--color-accent-text)", fontSize: "0.75rem" }), // text-xs, accent-text
               animationDelay: "0.7s",
            }}
          >
            {authorRole}
          </p>
        </div>
      </div>
    </section>
  );
}
