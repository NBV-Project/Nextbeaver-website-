import { supabaseClient } from "@/lib/supabase/client";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";

export type HomeHero = {
  badge: string;
  badge_th?: string;
  title: string;
  title_th?: string;
  accent: string;
  accent_th?: string;
  description: string;
  description_th?: string;
  primaryCta: string;
  primaryCta_th?: string;
  primaryCtaHref: string;
  secondaryCta: string;
  secondaryCta_th?: string;
  secondaryCtaHref: string;
  codeFilename: string;
  statusLabel: string;
  statusLabel_th?: string;
  statusValue: string;
  statusValue_th?: string;
};

export type HomeHeroStyles = {
  badgeFontFamilyEn?: string;
  badgeFontFamilyTh?: string;
  badgeFontSize?: number;
  titleFontFamilyEn?: string;
  titleFontFamilyTh?: string;
  titleFontSize?: number;
  accentFontFamilyEn?: string;
  accentFontFamilyTh?: string;
  accentFontSize?: number;
  descriptionFontFamilyEn?: string;
  descriptionFontFamilyTh?: string;
  descriptionFontSize?: number;
  ctaFontFamilyEn?: string;
  ctaFontFamilyTh?: string;
  ctaFontSize?: number;
  statusLabelFontFamilyEn?: string;
  statusLabelFontFamilyTh?: string;
  statusLabelFontSize?: number;
  statusValueFontFamilyEn?: string;
  statusValueFontFamilyTh?: string;
  statusValueFontSize?: number;
  codeFontFamily?: string;
  codeFontSize?: number;
  badgeTextColorLight?: string;
  badgeTextColorDark?: string;
  badgeBorderColorLight?: string;
  badgeBorderColorDark?: string;
  badgeBgColorLight?: string;
  badgeBgColorDark?: string;
  badgeDotColorLight?: string;
  badgeDotColorDark?: string;
  titleColorLight?: string;
  titleColorDark?: string;
  accentColorLight?: string;
  accentColorDark?: string;
  accentGradientEnabledLight?: boolean;
  accentGradientEnabledDark?: boolean;
  accentGradientLightStart?: string;
  accentGradientLightEnd?: string;
  accentGradientDarkStart?: string;
  accentGradientDarkEnd?: string;
  descriptionColorLight?: string;
  descriptionColorDark?: string;
  primaryCtaBgLight?: string;
  primaryCtaBgDark?: string;
  primaryCtaTextLight?: string;
  primaryCtaTextDark?: string;
  secondaryCtaBgLight?: string;
  secondaryCtaBgDark?: string;
  secondaryCtaTextLight?: string;
  secondaryCtaTextDark?: string;
  secondaryCtaBorderLight?: string;
  secondaryCtaBorderDark?: string;
  statusLabelColorLight?: string;
  statusLabelColorDark?: string;
  statusValueColorLight?: string;
  statusValueColorDark?: string;
};

export type HomeHeroCodeLine = {
  id: string;
  line: string;
  orderIndex: number;
};

export type HomeHeroCapability = {
  id: string;
  label: string;
  label_th?: string;
  icon: string;
  orderIndex: number;
};


export type HomeLogoLoopSettings = {
  speed: number;
  direction: "left" | "right";
  gap: number;
  logoHeight: number;
  fadeOut: boolean;
  fadeOutColorLight: string;
  fadeOutColorDark: string;
};

export type HomeLogoItem = {
  id: string;
  src: string;
  alt: string;
  alt_th?: string;
  orderIndex: number;
};

export type HomeMarqueeShowcase = {
  badge: string;
  badge_th?: string;
  title: string;
  title_th?: string;
  highlightedText: string;
  highlightedText_th?: string;
  headingPrefix: string;
  headingPrefix_th?: string;
  headingSuffix: string;
  headingSuffix_th?: string;
  description: string;
  description_th?: string;
  cta1Text: string;
  cta1Text_th?: string;
  cta1Link: string;
  cta2Text: string;
  cta2Text_th?: string;
  cta2Link: string;
  marqueeSpeed: number;
  marqueeDirection: "left" | "right";
  marqueeReverse: boolean;
};

export type HomeMarqueeStyles = {
  badgeFontFamilyEn?: string;
  badgeFontFamilyTh?: string;
  badgeFontSize?: number;
  badgeColorLight?: string;
  badgeColorDark?: string;
  titleFontFamilyEn?: string;
  titleFontFamilyTh?: string;
  titleFontSize?: number;
  titleColorLight?: string;
  titleColorDark?: string;
  headingFontFamilyEn?: string;
  headingFontFamilyTh?: string;
  headingFontSize?: number;
  headingColorLight?: string;
  headingColorDark?: string;
  highlightBgColorLight?: string;
  highlightBgColorDark?: string;
  highlightTextColorLight?: string;
  highlightTextColorDark?: string;
  descFontFamilyEn?: string;
  descFontFamilyTh?: string;
  descFontSize?: number;
  descColorLight?: string;
  descColorDark?: string;
  cta1BgLight?: string;
  cta1BgDark?: string;
  cta1TextColorLight?: string;
  cta1TextColorDark?: string;
  cta2BgLight?: string;
  cta2BgDark?: string;
  cta2TextColorLight?: string;
  cta2TextColorDark?: string;
  cta2BorderLight?: string;
  cta2BorderDark?: string;
};

export type HomeMarqueeItem = {
  id: string;
  src: string;
  alt: string;
  orderIndex: number;
};

export type HomeQuote = {
  body: string;
  body_th?: string;
  authorName: string;
  authorName_th?: string;
  authorRole: string;
  authorRole_th?: string;
  icon: string;
};

export type HomeQuoteStyles = {
  bodyFontFamilyEn?: string;
  bodyFontFamilyTh?: string;
  bodyFontSize?: number;
  bodyColorLight?: string;
  bodyColorDark?: string;
  authorFontFamilyEn?: string;
  authorFontFamilyTh?: string;
  authorFontSize?: number;
  authorColorLight?: string;
  authorColorDark?: string;
  roleFontFamilyEn?: string;
  roleFontFamilyTh?: string;
  roleFontSize?: number;
  roleColorLight?: string;
  roleColorDark?: string;
  iconColorLight?: string;
  iconColorDark?: string;
  sectionBgLight?: string;
  sectionBgDark?: string;
};

export type HomeContent = {
  hero: HomeHero;
  heroStyles: HomeHeroStyles;
  heroCodeLines: HomeHeroCodeLine[];
  heroCapabilities: HomeHeroCapability[];
  logoLoopSettings: HomeLogoLoopSettings;
  logoItems: HomeLogoItem[];
  marqueeShowcase: HomeMarqueeShowcase;
  marqueeStyles: HomeMarqueeStyles;
  marqueeItems: HomeMarqueeItem[];
  quote: HomeQuote;
  quoteStyles: HomeQuoteStyles;
};

export const HOME_HERO_TABLE = "home_hero";
export const HOME_HERO_STYLES_TABLE = "home_hero_styles";
export const HOME_HERO_CODE_LINES_TABLE = "home_hero_code_lines";
export const HOME_HERO_CAPABILITIES_TABLE = "home_hero_capabilities";
export const HOME_LOGO_LOOP_SETTINGS_TABLE = "home_logo_loop_settings";
export const HOME_LOGO_LOOP_ITEMS_TABLE = "home_logo_loop_items";
export const HOME_MARQUEE_SHOWCASE_TABLE = "home_marquee_showcase";
export const HOME_MARQUEE_STYLES_TABLE = "home_marquee_styles";
export const HOME_MARQUEE_ITEMS_TABLE = "home_marquee_items";
export const HOME_QUOTE_TABLE = "home_quote";
export const HOME_QUOTE_STYLES_TABLE = "home_quote_styles";

const defaultHero: HomeHero = {
  badge: "Accepting New Ventures",
  badge_th: "Accepting New Ventures",
  title: "BESPOKE",
  title_th: "BESPOKE",
  accent: "WEB SOLUTIONS",
  accent_th: "WEB SOLUTIONS",
  description:
    "We operate at the precise point where aesthetics meet engineering, crafting digital experiences that function as flawlessly as they feel.",
  description_th:
    "We operate at the precise point where aesthetics meet engineering, crafting digital experiences that function as flawlessly as they feel.",
  primaryCta: "DISCOVER THE CRAFT",
  primaryCta_th: "DISCOVER THE CRAFT",
  primaryCtaHref: "#contact",
  secondaryCta: "VIEW SHOWREEL",
  secondaryCta_th: "VIEW SHOWREEL",
  secondaryCtaHref: "/portfolio",
  codeFilename: "nextbeaver.tsx",
  statusLabel: "Status",
  statusLabel_th: "Status",
  statusValue: "System Optimized",
  statusValue_th: "System Optimized",
};

const defaultHeroStyles: HomeHeroStyles = {
  badgeFontFamilyEn: "Space Grotesk, sans-serif",
  badgeFontFamilyTh: "Space Grotesk, sans-serif",
  badgeFontSize: 12,
  titleFontFamilyEn: "Space Grotesk, sans-serif",
  titleFontFamilyTh: "Space Grotesk, sans-serif",
  titleFontSize: 64,
  accentFontFamilyEn: "Space Grotesk, sans-serif",
  accentFontFamilyTh: "Space Grotesk, sans-serif",
  accentFontSize: 64,
  descriptionFontFamilyEn: "Space Grotesk, sans-serif",
  descriptionFontFamilyTh: "Space Grotesk, sans-serif",
  descriptionFontSize: 20,
  ctaFontFamilyEn: "Space Grotesk, sans-serif",
  ctaFontFamilyTh: "Space Grotesk, sans-serif",
  ctaFontSize: 16,
  statusLabelFontFamilyEn: "Space Grotesk, sans-serif",
  statusLabelFontFamilyTh: "Space Grotesk, sans-serif",
  statusLabelFontSize: 12,
  statusValueFontFamilyEn: "Space Grotesk, sans-serif",
  statusValueFontFamilyTh: "Space Grotesk, sans-serif",
  statusValueFontSize: 14,
  codeFontFamily: "Fira Code, monospace",
  codeFontSize: 14,
  badgeTextColorLight: "#f98c1f",
  badgeTextColorDark: "#f98c1f",
  badgeBorderColorLight: "rgba(249, 140, 31, 0.2)",
  badgeBorderColorDark: "rgba(249, 140, 31, 0.2)",
  badgeBgColorLight: "rgba(249, 140, 31, 0.05)",
  badgeBgColorDark: "rgba(249, 140, 31, 0.05)",
  badgeDotColorLight: "#f98c1f",
  badgeDotColorDark: "#f98c1f",
  titleColorLight: "#181411",
  titleColorDark: "#ffffff",
  accentColorLight: "#f98c1f",
  accentColorDark: "#f98c1f",
  accentGradientEnabledLight: false,
  accentGradientEnabledDark: true,
  accentGradientLightStart: "#f98c1f",
  accentGradientLightEnd: "#fcd9b4",
  accentGradientDarkStart: "#f98c1f",
  accentGradientDarkEnd: "#ffd9b0",
  descriptionColorLight: "#525252",
  descriptionColorDark: "#a3a3a3",
  primaryCtaBgLight: "#ea580c",
  primaryCtaBgDark: "#f98c1f",
  primaryCtaTextLight: "#ffffff",
  primaryCtaTextDark: "#181411",
  secondaryCtaBgLight: "#f5f5f4",
  secondaryCtaBgDark: "rgba(255, 255, 255, 0.05)",
  secondaryCtaTextLight: "#0f172a",
  secondaryCtaTextDark: "#ffffff",
  secondaryCtaBorderLight: "#e7e5e4",
  secondaryCtaBorderDark: "rgba(255, 255, 255, 0.1)",
  statusLabelColorLight: "#9ca3af",
  statusLabelColorDark: "#9ca3af",
  statusValueColorLight: "#ffffff",
  statusValueColorDark: "#ffffff",
};

const defaultHeroCodeLines: HomeHeroCodeLine[] = [
  { id: "home-code-01", line: "import { Excellence } from '@grandeur/core';", orderIndex: 0 },
  { id: "home-code-02", line: "const Initialize = async () => {", orderIndex: 1 },
  { id: "home-code-03", line: "  // Configuring premium parameters", orderIndex: 2 },
  { id: "home-code-04", line: "  const config = {", orderIndex: 3 },
  { id: "home-code-05", line: "    target: 'Market_Leader',", orderIndex: 4 },
  { id: "home-code-06", line: "    quality: Infinity,", orderIndex: 5 },
  { id: "home-code-07", line: "    style: 'Bespoke'", orderIndex: 6 },
  { id: "home-code-08", line: "  };", orderIndex: 7 },
  { id: "home-code-09", line: "  await Excellence.deploy(config);", orderIndex: 8 },
  { id: "home-code-10", line: "};", orderIndex: 9 },
  { id: "home-code-11", line: "export default Initialize;", orderIndex: 10 },
];

const defaultHeroCapabilities: HomeHeroCapability[] = [
  { id: "home-cap-01", label: "Strategy", label_th: "Strategy", icon: "diamond", orderIndex: 0 },
  { id: "home-cap-02", label: "UI/UX", label_th: "UI/UX", icon: "layers", orderIndex: 1 },
  { id: "home-cap-03", label: "Engineering", label_th: "Engineering", icon: "code-2", orderIndex: 2 },
  { id: "home-cap-04", label: "DevOps", label_th: "DevOps", icon: "terminal", orderIndex: 3 },
];

const defaultLogoLoopSettings: HomeLogoLoopSettings = {
  speed: 40,
  direction: "left",
  gap: 48,
  logoHeight: 32,
  fadeOut: true,
  fadeOutColorLight: "#ffffff",
  fadeOutColorDark: "#181411",
};

const defaultLogoItems: HomeLogoItem[] = [
  { id: "home-logo-01", src: "/tech/bun.svg", alt: "Bun.js", alt_th: "Bun.js", orderIndex: 0 },
  { id: "home-logo-02", src: "/tech/nextjs.svg", alt: "Next.js", alt_th: "Next.js", orderIndex: 1 },
  { id: "home-logo-03", src: "/tech/tailwind.svg", alt: "Tailwind CSS", alt_th: "Tailwind CSS", orderIndex: 2 },
  { id: "home-logo-04", src: "/tech/supabase.svg", alt: "Supabase", alt_th: "Supabase", orderIndex: 3 },
  { id: "home-logo-05", src: "/tech/typescript.svg", alt: "TypeScript", alt_th: "TypeScript", orderIndex: 4 },
  { id: "home-logo-06", src: "/tech/react.svg", alt: "React", alt_th: "React", orderIndex: 5 },
  { id: "home-logo-07", src: "/tech/nodejs.svg", alt: "Node.js", alt_th: "Node.js", orderIndex: 6 },
  { id: "home-logo-08", src: "/tech/docker.svg", alt: "Docker", alt_th: "Docker", orderIndex: 7 },
  { id: "home-logo-09", src: "/tech/python.svg", alt: "Python", alt_th: "Python", orderIndex: 8 },
  { id: "home-logo-10", src: "/tech/firebase.svg", alt: "Firebase", alt_th: "Firebase", orderIndex: 9 },
  { id: "home-logo-11", src: "/tech/figma.svg", alt: "Figma", alt_th: "Figma", orderIndex: 10 },
  { id: "home-logo-12", src: "/tech/github.svg", alt: "GitHub", alt_th: "GitHub", orderIndex: 11 },
];

const defaultMarqueeShowcase: HomeMarqueeShowcase = {
  badge: "CURATED PORTFOLIO",
  badge_th: "CURATED PORTFOLIO",
  title: "SIGNATURE WORK BUILT\nFOR AMBITIOUS BRANDS",
  title_th: "SIGNATURE WORK BUILT\nFOR AMBITIOUS BRANDS",
  highlightedText: "what we build",
  highlightedText_th: "what we build",
  headingPrefix: "Work that proves ",
  headingPrefix_th: "Work that proves ",
  headingSuffix: " together.",
  headingSuffix_th: " together.",
  description: "Explore the systems, products, and visual experiences we've shipped for teams that care about clarity, speed, and results.",
  description_th: "Explore the systems, products, and visual experiences we've shipped for teams that care about clarity, speed, and results.",
  cta1Text: "View portfolio",
  cta1Text_th: "View portfolio",
  cta1Link: "/portfolio",
  cta2Text: "Start a project",
  cta2Text_th: "Start a project",
  cta2Link: "/#contact",
  marqueeSpeed: 40,
  marqueeDirection: "left",
  marqueeReverse: false,
};

const defaultMarqueeStyles: HomeMarqueeStyles = {
  badgeFontFamilyEn: "Space Grotesk, sans-serif",
  badgeFontFamilyTh: "Space Grotesk, sans-serif",
  badgeFontSize: 12,
  badgeColorLight: "#ea580c",
  badgeColorDark: "#ea580c",
  titleFontFamilyEn: "Space Grotesk, sans-serif",
  titleFontFamilyTh: "Space Grotesk, sans-serif",
  titleFontSize: 30,
  titleColorLight: "#181411",
  titleColorDark: "#ffffff",
  headingFontFamilyEn: "Space Grotesk, sans-serif",
  headingFontFamilyTh: "Space Grotesk, sans-serif",
  headingFontSize: 48,
  headingColorLight: "#181411",
  headingColorDark: "#ffffff",
  highlightBgColorLight: "rgba(234, 88, 12, 0.25)",
  highlightBgColorDark: "rgba(234, 88, 12, 0.25)",
  highlightTextColorLight: "#181411",
  highlightTextColorDark: "#ffffff",
  descFontFamilyEn: "Space Grotesk, sans-serif",
  descFontFamilyTh: "Space Grotesk, sans-serif",
  descFontSize: 16,
  descColorLight: "#333333",
  descColorDark: "#d4d4d4",
  cta1BgLight: "#ea580c",
  cta1BgDark: "#ea580c",
  cta1TextColorLight: "#ffffff",
  cta1TextColorDark: "#181411",
  cta2BgLight: "rgba(255, 255, 255, 0.7)",
  cta2BgDark: "rgba(255, 255, 255, 0.05)",
  cta2TextColorLight: "#181411",
  cta2TextColorDark: "#ffffff",
  cta2BorderLight: "#e7e5e4",
  cta2BorderDark: "#ffffff",
};

const defaultMarqueeItems: HomeMarqueeItem[] = [
  { id: "mq-01", src: "https://assets.aceternity.com/cloudinary_bkp/3d-card.png", alt: "", orderIndex: 0 },
  { id: "mq-02", src: "https://assets.aceternity.com/animated-modal.png", alt: "", orderIndex: 1 },
  { id: "mq-03", src: "https://assets.aceternity.com/animated-testimonials.webp", alt: "", orderIndex: 2 },
];

const defaultQuote: HomeQuote = {
  body: "\"Atelier didn't just build a website; they constructed a digital legacy for our firm. The attention to detail is simply unparalleled in the industry.\"",
  body_th: "\"Atelier didn't just build a website; they constructed a digital legacy for our firm. The attention to detail is simply unparalleled in the industry.\"",
  authorName: "Alexander Thorne",
  authorName_th: "Alexander Thorne",
  authorRole: "CEO, Thorne Capital",
  authorRole_th: "CEO, Thorne Capital",
  icon: "format_quote",
};

const defaultQuoteStyles: HomeQuoteStyles = {
  bodyFontFamilyEn: "Space Grotesk, sans-serif",
  bodyFontFamilyTh: "Space Grotesk, sans-serif",
  bodyFontSize: 24,
  bodyColorLight: "#ffffff",
  bodyColorDark: "#ffffff",
  authorFontFamilyEn: "Space Grotesk, sans-serif",
  authorFontFamilyTh: "Space Grotesk, sans-serif",
  authorFontSize: 14,
  authorColorLight: "#ffffff",
  authorColorDark: "#ffffff",
  roleFontFamilyEn: "Space Grotesk, sans-serif",
  roleFontFamilyTh: "Space Grotesk, sans-serif",
  roleFontSize: 12,
  roleColorLight: "#a3a3a3",
  roleColorDark: "#a3a3a3",
  iconColorLight: "rgba(234, 88, 12, 0.3)",
  iconColorDark: "rgba(234, 88, 12, 0.3)",
  sectionBgLight: "#181411",
  sectionBgDark: "#181411",
};

const CACHE_ENABLED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const HOME_REVALIDATE_SECONDS = 600;

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: defaultHero,
  heroStyles: defaultHeroStyles,
  heroCodeLines: defaultHeroCodeLines,
  heroCapabilities: defaultHeroCapabilities,
  logoLoopSettings: defaultLogoLoopSettings,
  logoItems: defaultLogoItems,
  marqueeShowcase: defaultMarqueeShowcase,
  marqueeStyles: defaultMarqueeStyles,
  marqueeItems: defaultMarqueeItems,
  quote: defaultQuote,
  quoteStyles: defaultQuoteStyles,
};

const getHomeReader = () => {
  if (typeof window !== "undefined") {
    return supabaseClient;
  }
  const adminClient = getSupabaseAdminClient();
  return adminClient ?? supabaseClient;
};

const getHomeContentInternal = async (): Promise<HomeContent> => {
  const reader = getHomeReader();

  const heroQuery = reader.from(HOME_HERO_TABLE).select("*").limit(1).maybeSingle();
  const stylesQuery = reader.from(HOME_HERO_STYLES_TABLE).select("*").limit(1).maybeSingle();
  const codeLinesQuery = reader
    .from(HOME_HERO_CODE_LINES_TABLE)
    .select("*")
    .order("order_index", { ascending: true });
  const capabilitiesQuery = reader
    .from(HOME_HERO_CAPABILITIES_TABLE)
    .select("*")
    .order("order_index", { ascending: true });
  const logoSettingsQuery = reader.from(HOME_LOGO_LOOP_SETTINGS_TABLE).select("*").limit(1).maybeSingle();
  const logoItemsQuery = reader
    .from(HOME_LOGO_LOOP_ITEMS_TABLE)
    .select("*")
    .order("order_index", { ascending: true });

  const marqueeQuery = reader.from(HOME_MARQUEE_SHOWCASE_TABLE).select("*").limit(1).maybeSingle();
  const marqueeStylesQuery = reader.from(HOME_MARQUEE_STYLES_TABLE).select("*").limit(1).maybeSingle();
  const marqueeItemsQuery = reader
    .from(HOME_MARQUEE_ITEMS_TABLE)
    .select("*")
    .order("order_index", { ascending: true });
  
  const quoteQuery = reader.from(HOME_QUOTE_TABLE).select("*").limit(1).maybeSingle();
  const quoteStylesQuery = reader.from(HOME_QUOTE_STYLES_TABLE).select("*").limit(1).maybeSingle();

  const [
    heroRes,
    stylesRes,
    codeLinesRes,
    capabilitiesRes,
    logoSettingsRes,
    logoItemsRes,
    marqueeRes,
    marqueeStylesRes,
    marqueeItemsRes,
    quoteRes,
    quoteStylesRes
  ] =
    await Promise.all([
      heroQuery,
      stylesQuery,
      codeLinesQuery,
      capabilitiesQuery,
      logoSettingsQuery,
      logoItemsQuery,
      marqueeQuery,
      marqueeStylesQuery,
      marqueeItemsQuery,
      quoteQuery,
      quoteStylesQuery
    ]);

  if (heroRes.error) console.error("Error fetching home hero:", heroRes.error);
  if (stylesRes.error) console.error("Error fetching home hero styles:", stylesRes.error);
  if (codeLinesRes.error) console.error("Error fetching home hero code:", codeLinesRes.error);
  if (capabilitiesRes.error) console.error("Error fetching home hero capabilities:", capabilitiesRes.error);
  if (logoSettingsRes.error) console.error("Error fetching logo loop settings:", logoSettingsRes.error);
  if (logoItemsRes.error) console.error("Error fetching logo loop items:", logoItemsRes.error);
  if (marqueeRes.error) console.error("Error fetching marquee showcase:", marqueeRes.error);
  if (marqueeStylesRes.error) console.error("Error fetching marquee styles:", marqueeStylesRes.error);
  if (marqueeItemsRes.error) {
    console.error("Error fetching marquee items:", marqueeItemsRes.error);
  }
  if (quoteRes.error) console.error("Error fetching home quote:", quoteRes.error);
  if (quoteStylesRes.error) console.error("Error fetching home quote styles:", quoteStylesRes.error);

  const hero = heroRes.data
    ? {
      badge: heroRes.data.badge,
      badge_th: heroRes.data.badge_th,
      title: heroRes.data.title,
      title_th: heroRes.data.title_th,
      accent: heroRes.data.accent,
      accent_th: heroRes.data.accent_th,
      description: heroRes.data.description,
      description_th: heroRes.data.description_th,
      primaryCta: heroRes.data.primary_cta,
      primaryCta_th: heroRes.data.primary_cta_th,
      primaryCtaHref: heroRes.data.primary_cta_href,
      secondaryCta: heroRes.data.secondary_cta,
      secondaryCta_th: heroRes.data.secondary_cta_th,
      secondaryCtaHref: heroRes.data.secondary_cta_href,
      codeFilename: heroRes.data.code_filename,
      statusLabel: heroRes.data.status_label,
      statusLabel_th: heroRes.data.status_label_th,
      statusValue: heroRes.data.status_value,
      statusValue_th: heroRes.data.status_value_th,
    }
    : defaultHero;

  const heroStyles = stylesRes.data
    ? {
      badgeFontFamilyEn: stylesRes.data.badge_font_family_en,
      badgeFontFamilyTh: stylesRes.data.badge_font_family_th,
      badgeFontSize: stylesRes.data.badge_font_size,
      titleFontFamilyEn: stylesRes.data.title_font_family_en,
      titleFontFamilyTh: stylesRes.data.title_font_family_th,
      titleFontSize: stylesRes.data.title_font_size,
      accentFontFamilyEn: stylesRes.data.accent_font_family_en,
      accentFontFamilyTh: stylesRes.data.accent_font_family_th,
      accentFontSize: stylesRes.data.accent_font_size,
      descriptionFontFamilyEn: stylesRes.data.description_font_family_en,
      descriptionFontFamilyTh: stylesRes.data.description_font_family_th,
      descriptionFontSize: stylesRes.data.description_font_size,
      ctaFontFamilyEn: stylesRes.data.cta_font_family_en,
      ctaFontFamilyTh: stylesRes.data.cta_font_family_th,
      ctaFontSize: stylesRes.data.cta_font_size,
      statusLabelFontFamilyEn: stylesRes.data.status_label_font_family_en,
      statusLabelFontFamilyTh: stylesRes.data.status_label_font_family_th,
      statusLabelFontSize: stylesRes.data.status_label_font_size,
      statusValueFontFamilyEn: stylesRes.data.status_value_font_family_en,
      statusValueFontFamilyTh: stylesRes.data.status_value_font_family_th,
      statusValueFontSize: stylesRes.data.status_value_font_size,
      codeFontFamily: stylesRes.data.code_font_family,
      codeFontSize: stylesRes.data.code_font_size,
      badgeTextColorLight: stylesRes.data.badge_text_color_light,
      badgeTextColorDark: stylesRes.data.badge_text_color_dark,
      badgeBorderColorLight: stylesRes.data.badge_border_color_light,
      badgeBorderColorDark: stylesRes.data.badge_border_color_dark,
      badgeBgColorLight: stylesRes.data.badge_bg_color_light,
      badgeBgColorDark: stylesRes.data.badge_bg_color_dark,
      badgeDotColorLight: stylesRes.data.badge_dot_color_light,
      badgeDotColorDark: stylesRes.data.badge_dot_color_dark,
      titleColorLight: stylesRes.data.title_color_light,
      titleColorDark: stylesRes.data.title_color_dark,
      accentColorLight: stylesRes.data.accent_color_light,
      accentColorDark: stylesRes.data.accent_color_dark,
      accentGradientEnabledLight: stylesRes.data.accent_gradient_enabled_light,
      accentGradientEnabledDark: stylesRes.data.accent_gradient_enabled_dark,
      accentGradientLightStart: stylesRes.data.accent_gradient_light_start,
      accentGradientLightEnd: stylesRes.data.accent_gradient_light_end,
      accentGradientDarkStart: stylesRes.data.accent_gradient_dark_start,
      accentGradientDarkEnd: stylesRes.data.accent_gradient_dark_end,
      descriptionColorLight: stylesRes.data.description_color_light,
      descriptionColorDark: stylesRes.data.description_color_dark,
      primaryCtaBgLight: stylesRes.data.primary_cta_bg_light,
      primaryCtaBgDark: stylesRes.data.primary_cta_bg_dark,
      primaryCtaTextLight: stylesRes.data.primary_cta_text_light,
      primaryCtaTextDark: stylesRes.data.primary_cta_text_dark,
      secondaryCtaBgLight: stylesRes.data.secondary_cta_bg_light,
      secondaryCtaBgDark: stylesRes.data.secondary_cta_bg_dark,
      secondaryCtaTextLight: stylesRes.data.secondary_cta_text_light,
      secondaryCtaTextDark: stylesRes.data.secondary_cta_text_dark,
      secondaryCtaBorderLight: stylesRes.data.secondary_cta_border_light,
      secondaryCtaBorderDark: stylesRes.data.secondary_cta_border_dark,
      statusLabelColorLight: stylesRes.data.status_label_color_light,
      statusLabelColorDark: stylesRes.data.status_label_color_dark,
      statusValueColorLight: stylesRes.data.status_value_color_light,
      statusValueColorDark: stylesRes.data.status_value_color_dark,
    }
    : defaultHeroStyles;

  const heroCodeLines = (codeLinesRes.data || []).map((line: { id: string; line: string; order_index: number }) => ({
    id: line.id,
    line: line.line,
    orderIndex: line.order_index,
  }));

  const heroCapabilities = (capabilitiesRes.data || []).map((cap: { id: string; label: string; label_th?: string; icon: string; order_index: number }) => ({
    id: cap.id,
    label: cap.label,
    label_th: cap.label_th,
    icon: cap.icon,
    orderIndex: cap.order_index,
  }));

  const logoLoopSettings = logoSettingsRes.data
    ? {
      speed: logoSettingsRes.data.speed,
      direction: logoSettingsRes.data.direction,
      gap: logoSettingsRes.data.gap,
      logoHeight: logoSettingsRes.data.logo_height,
      fadeOut: logoSettingsRes.data.fade_out,
      fadeOutColorLight: logoSettingsRes.data.fade_out_color_light,
      fadeOutColorDark: logoSettingsRes.data.fade_out_color_dark,
    }
    : defaultLogoLoopSettings;

  const normalizeLogoSrc = (src: string) => {
    if (!src) return "";
    if (src.startsWith("http://") || src.startsWith("https://")) return src;
    return src.startsWith("/") ? src : `/${src}`;
  };

  const logoItems = (logoItemsRes.data || [])
    .map((item: { id: string; src: string; alt: string; alt_th?: string; order_index: number }) => ({
      id: item.id,
      src: normalizeLogoSrc(item.src),
      alt: item.alt,
      alt_th: item.alt_th,
      orderIndex: item.order_index,
    }))
    .filter((item) => typeof item.src === "string" && item.src.trim().length > 0);

  const marqueeShowcase = marqueeRes.data
    ? {
      badge: marqueeRes.data.badge,
      badge_th: marqueeRes.data.badge_th,
      title: marqueeRes.data.title,
      title_th: marqueeRes.data.title_th,
      highlightedText: marqueeRes.data.highlighted_text,
      highlightedText_th: marqueeRes.data.highlighted_text_th,
      headingPrefix: marqueeRes.data.heading_prefix,
      headingPrefix_th: marqueeRes.data.heading_prefix_th,
      headingSuffix: marqueeRes.data.heading_suffix,
      headingSuffix_th: marqueeRes.data.heading_suffix_th,
      description: marqueeRes.data.description,
      description_th: marqueeRes.data.description_th,
      cta1Text: marqueeRes.data.cta1_text,
      cta1Text_th: marqueeRes.data.cta1_text_th,
      cta1Link: marqueeRes.data.cta1_link,
      cta2Text: marqueeRes.data.cta2_text,
      cta2Text_th: marqueeRes.data.cta2_text_th,
      cta2Link: marqueeRes.data.cta2_link,
      marqueeSpeed: marqueeRes.data.marquee_speed,
      marqueeDirection: marqueeRes.data.marquee_direction,
      marqueeReverse: marqueeRes.data.marquee_reverse,
    }
    : defaultMarqueeShowcase;

  const marqueeStyles = marqueeStylesRes.data
    ? {
      badgeFontFamilyEn: marqueeStylesRes.data.badge_font_family_en,
      badgeFontFamilyTh: marqueeStylesRes.data.badge_font_family_th,
      badgeFontSize: marqueeStylesRes.data.badge_font_size,
      badgeColorLight: marqueeStylesRes.data.badge_color_light,
      badgeColorDark: marqueeStylesRes.data.badge_color_dark,
      titleFontFamilyEn: marqueeStylesRes.data.title_font_family_en,
      titleFontFamilyTh: marqueeStylesRes.data.title_font_family_th,
      titleFontSize: marqueeStylesRes.data.title_font_size,
      titleColorLight: marqueeStylesRes.data.title_color_light,
      titleColorDark: marqueeStylesRes.data.title_color_dark,
      headingFontFamilyEn: marqueeStylesRes.data.heading_font_family_en,
      headingFontFamilyTh: marqueeStylesRes.data.heading_font_family_th,
      headingFontSize: marqueeStylesRes.data.heading_font_size,
      headingColorLight: marqueeStylesRes.data.heading_color_light,
      headingColorDark: marqueeStylesRes.data.heading_color_dark,
      highlightBgColorLight: marqueeStylesRes.data.highlight_bg_color_light,
      highlightBgColorDark: marqueeStylesRes.data.highlight_bg_color_dark,
      highlightTextColorLight: marqueeStylesRes.data.highlight_text_color_light,
      highlightTextColorDark: marqueeStylesRes.data.highlight_text_color_dark,
      descFontFamilyEn: marqueeStylesRes.data.desc_font_family_en,
      descFontFamilyTh: marqueeStylesRes.data.desc_font_family_th,
      descFontSize: marqueeStylesRes.data.desc_font_size,
      descColorLight: marqueeStylesRes.data.desc_color_light,
      descColorDark: marqueeStylesRes.data.desc_color_dark,
      cta1BgLight: marqueeStylesRes.data.cta1_bg_light,
      cta1BgDark: marqueeStylesRes.data.cta1_bg_dark,
      cta1TextColorLight: marqueeStylesRes.data.cta1_text_color_light,
      cta1TextColorDark: marqueeStylesRes.data.cta1_text_color_dark,
      cta2BgLight: marqueeStylesRes.data.cta2_bg_light,
      cta2BgDark: marqueeStylesRes.data.cta2_bg_dark,
      cta2TextColorLight: marqueeStylesRes.data.cta2_text_color_light,
      cta2TextColorDark: marqueeStylesRes.data.cta2_text_color_dark,
      cta2BorderLight: marqueeStylesRes.data.cta2_border_light,
      cta2BorderDark: marqueeStylesRes.data.cta2_border_dark,
    }
    : defaultMarqueeStyles;

  const marqueeItems = (marqueeItemsRes.data || []).map((item: { id: string; src: string; alt: string; order_index: number }) => ({
    id: item.id,
    src: item.src,
    alt: item.alt,
    orderIndex: item.order_index,
  }));

  const quote = quoteRes.data
    ? {
        body: quoteRes.data.body,
        body_th: quoteRes.data.body_th,
        authorName: quoteRes.data.author_name,
        authorName_th: quoteRes.data.author_name_th,
        authorRole: quoteRes.data.author_role,
        authorRole_th: quoteRes.data.author_role_th,
        icon: quoteRes.data.icon,
      }
    : defaultQuote;

  const quoteStyles = quoteStylesRes.data
    ? {
        bodyFontFamilyEn: quoteStylesRes.data.body_font_family_en,
        bodyFontFamilyTh: quoteStylesRes.data.body_font_family_th,
        bodyFontSize: quoteStylesRes.data.body_font_size,
        bodyColorLight: quoteStylesRes.data.body_color_light,
        bodyColorDark: quoteStylesRes.data.body_color_dark,
        authorFontFamilyEn: quoteStylesRes.data.author_font_family_en,
        authorFontFamilyTh: quoteStylesRes.data.author_font_family_th,
        authorFontSize: quoteStylesRes.data.author_font_size,
        authorColorLight: quoteStylesRes.data.author_color_light,
        authorColorDark: quoteStylesRes.data.author_color_dark,
        roleFontFamilyEn: quoteStylesRes.data.role_font_family_en,
        roleFontFamilyTh: quoteStylesRes.data.role_font_family_th,
        roleFontSize: quoteStylesRes.data.role_font_size,
        roleColorLight: quoteStylesRes.data.role_color_light,
        roleColorDark: quoteStylesRes.data.role_color_dark,
        iconColorLight: quoteStylesRes.data.icon_color_light,
        iconColorDark: quoteStylesRes.data.icon_color_dark,
        sectionBgLight: quoteStylesRes.data.section_bg_light,
        sectionBgDark: quoteStylesRes.data.section_bg_dark,
      }
    : defaultQuoteStyles;

  if (!heroRes.data && !stylesRes.data && heroCodeLines.length === 0 && heroCapabilities.length === 0 && !marqueeRes.data) {
    return DEFAULT_HOME_CONTENT;
  }

  return {
    hero,
    heroStyles,
    heroCodeLines: heroCodeLines.length > 0 ? heroCodeLines : defaultHeroCodeLines,
    heroCapabilities: heroCapabilities.length > 0 ? heroCapabilities : defaultHeroCapabilities,
    logoLoopSettings,
    logoItems: logoItems.length > 0 ? logoItems : defaultLogoItems,
    marqueeShowcase,
    marqueeStyles,
    marqueeItems: marqueeItems,
    quote,
    quoteStyles,
  };
};

const getHomeContentCached = unstable_cache(getHomeContentInternal, [CACHE_TAGS.home], {
  revalidate: HOME_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.home],
});

export async function getHomeContent(): Promise<HomeContent> {
  if (!CACHE_ENABLED) {
    return DEFAULT_HOME_CONTENT;
  }

  return getHomeContentCached();
}

export async function getHomeContentUncached(): Promise<HomeContent> {
  return getHomeContentInternal();
}
