import { supabaseClient } from "@/lib/supabase/client";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";

export type AboutContent = {
  imageUrl: string;
  imageAlt: string;
  imageAlt_th?: string;
  highlightValue: string;
  highlightLabel: string;
  highlightLabel_th?: string;
  eyebrow: string;
  eyebrow_th?: string;
  title: string;
  title_th?: string;
  titleAccent: string;
  titleAccent_th?: string;
};

export type AboutBody = {
  id: string;
  text: string;
  text_th?: string;
  orderIndex: number;
};

export type AboutPillar = {
  id: string;
  title: string;
  title_th?: string;
  body: string;
  body_th?: string;
  orderIndex: number;
};

export type AboutStyles = {
  imageOverlayColorLight?: string;
  imageOverlayColorDark?: string;
  highlightBgColorLight?: string;
  highlightBgColorDark?: string;
  highlightValueColorLight?: string;
  highlightValueColorDark?: string;
  highlightLabelColorLight?: string;
  highlightLabelColorDark?: string;
  highlightValueFontFamilyEn?: string;
  highlightValueFontFamilyTh?: string;
  highlightValueFontSize?: number;
  highlightLabelFontFamilyEn?: string;
  highlightLabelFontFamilyTh?: string;
  highlightLabelFontSize?: number;
  eyebrowColorLight?: string;
  eyebrowColorDark?: string;
  eyebrowFontFamilyEn?: string;
  eyebrowFontFamilyTh?: string;
  eyebrowFontSize?: number;
  titleColorLight?: string;
  titleColorDark?: string;
  titleFontFamilyEn?: string;
  titleFontFamilyTh?: string;
  titleFontSize?: number;
  titleAccentColorLight?: string;
  titleAccentColorDark?: string;
  titleAccentFontFamilyEn?: string;
  titleAccentFontFamilyTh?: string;
  titleAccentFontSize?: number;
  bodyColorLight?: string;
  bodyColorDark?: string;
  bodyFontFamilyEn?: string;
  bodyFontFamilyTh?: string;
  bodyFontSize?: number;
  pillarTitleColorLight?: string;
  pillarTitleColorDark?: string;
  pillarTitleFontFamilyEn?: string;
  pillarTitleFontFamilyTh?: string;
  pillarTitleFontSize?: number;
  pillarBodyColorLight?: string;
  pillarBodyColorDark?: string;
  pillarBodyFontFamilyEn?: string;
  pillarBodyFontFamilyTh?: string;
  pillarBodyFontSize?: number;
};

export type AboutContentBundle = {
  content: AboutContent;
  styles: AboutStyles;
  body: AboutBody[];
  pillars: AboutPillar[];
};

export const ABOUT_CONTENT_TABLE = "about_content";
export const ABOUT_STYLES_TABLE = "about_styles";
export const ABOUT_BODY_TABLE = "about_body";
export const ABOUT_PILLARS_TABLE = "about_pillars";

const defaultContent: AboutContent = {
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBcQdri552OE-CBYjrNJ1U797SdJSSAdo2Tk-JxDEcOxsunXqtWiLLvInfzkjsGcwwgoOQNP4ykfLchAFwV39rDkhIl6P7KFCClxhNjcUxsM7XMIxc9OZEzNTIkmSI-lje4wy6hmaZ4NzM2eZ8xNVOdj3tF5Q1_KCGHuOjXPKMT6nMzIAzVKMIsDhsNDnjdht2wX8uDOYgtXRHRrPWv-ux6BgZuMQSFSKBaJOEv2YjrkUFElhE6uhis6rQaCwmylVw9FnoHlZPZFA7x",
  imageAlt: "Abstract architectural details in warm lighting",
  imageAlt_th: "Abstract architectural details in warm lighting",
  highlightValue: "10+",
  highlightLabel: "Years of\nExcellence",
  highlightLabel_th: "Years of\nExcellence",
  eyebrow: "THE ATELIER PHILOSOPHY",
  eyebrow_th: "THE ATELIER PHILOSOPHY",
  title: "THE INTERSECTION OF",
  title_th: "THE INTERSECTION OF",
  titleAccent: "ART AND CODE",
  titleAccent_th: "ART AND CODE",
};

const defaultBody: AboutBody[] = [
  {
    id: "about-body-01",
    text:
      "In a digital landscape cluttered with templates, we choose to tailor. Every line of code is a stitch, every pixel a deliberate choice in the fabric of your brand's digital identity.",
    text_th:
      "In a digital landscape cluttered with templates, we choose to tailor. Every line of code is a stitch, every pixel a deliberate choice in the fabric of your brand's digital identity.",
    orderIndex: 0,
  },
  {
    id: "about-body-02",
    text:
      "Our approach is not merely functional; it is emotional. We build platforms that don't just host content but elevate it, creating environments where your enterprise commands the authority it deserves.",
    text_th:
      "Our approach is not merely functional; it is emotional. We build platforms that don't just host content but elevate it, creating environments where your enterprise commands the authority it deserves.",
    orderIndex: 1,
  },
];

const defaultPillars: AboutPillar[] = [
  {
    id: "about-pillar-01",
    title: "Strategy First",
    title_th: "Strategy First",
    body: "We diagnose before we design, ensuring every pixel serves a business purpose.",
    body_th: "We diagnose before we design, ensuring every pixel serves a business purpose.",
    orderIndex: 0,
  },
  {
    id: "about-pillar-02",
    title: "Pixel Precision",
    title_th: "Pixel Precision",
    body: "Obsessive attention to detail in motion, typography, and interaction.",
    body_th: "Obsessive attention to detail in motion, typography, and interaction.",
    orderIndex: 1,
  },
];

const defaultStyles: AboutStyles = {
  imageOverlayColorLight: "rgba(242, 127, 13, 0.2)",
  imageOverlayColorDark: "rgba(242, 127, 13, 0.2)",
  highlightBgColorLight: "#181411",
  highlightBgColorDark: "#181411",
  highlightValueColorLight: "#f27f0d",
  highlightValueColorDark: "#f27f0d",
  highlightLabelColorLight: "#ffffff",
  highlightLabelColorDark: "#ffffff",
  highlightValueFontFamilyEn: "Space Grotesk, sans-serif",
  highlightValueFontFamilyTh: "Space Grotesk, sans-serif",
  highlightValueFontSize: 32,
  highlightLabelFontFamilyEn: "Space Grotesk, sans-serif",
  highlightLabelFontFamilyTh: "Space Grotesk, sans-serif",
  highlightLabelFontSize: 12,
  eyebrowColorLight: "#f27f0d",
  eyebrowColorDark: "#f27f0d",
  eyebrowFontFamilyEn: "Space Grotesk, sans-serif",
  eyebrowFontFamilyTh: "Space Grotesk, sans-serif",
  eyebrowFontSize: 12,
  titleColorLight: "#1b140f",
  titleColorDark: "#ffffff",
  titleFontFamilyEn: "Space Grotesk, sans-serif",
  titleFontFamilyTh: "Space Grotesk, sans-serif",
  titleFontSize: 48,
  titleAccentColorLight: "#6b5d52",
  titleAccentColorDark: "#baab9c",
  titleAccentFontFamilyEn: "Space Grotesk, sans-serif",
  titleAccentFontFamilyTh: "Space Grotesk, sans-serif",
  titleAccentFontSize: 48,
  bodyColorLight: "#6b5d52",
  bodyColorDark: "#baab9c",
  bodyFontFamilyEn: "Space Grotesk, sans-serif",
  bodyFontFamilyTh: "Space Grotesk, sans-serif",
  bodyFontSize: 18,
  pillarTitleColorLight: "#1b140f",
  pillarTitleColorDark: "#ffffff",
  pillarTitleFontFamilyEn: "Space Grotesk, sans-serif",
  pillarTitleFontFamilyTh: "Space Grotesk, sans-serif",
  pillarTitleFontSize: 18,
  pillarBodyColorLight: "#6b5d52",
  pillarBodyColorDark: "#baab9c",
  pillarBodyFontFamilyEn: "Space Grotesk, sans-serif",
  pillarBodyFontFamilyTh: "Space Grotesk, sans-serif",
  pillarBodyFontSize: 14,
};

const CACHE_ENABLED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const ABOUT_REVALIDATE_SECONDS = 600;

const getAboutReader = () => {
  if (typeof window !== "undefined") {
    return supabaseClient;
  }
  const adminClient = getSupabaseAdminClient();
  return adminClient ?? supabaseClient;
};

const getAboutContentInternal = async (): Promise<AboutContentBundle> => {
  const reader = getAboutReader();
  const contentQuery = reader.from(ABOUT_CONTENT_TABLE).select("*").limit(1).maybeSingle();
  const stylesQuery = reader.from(ABOUT_STYLES_TABLE).select("*").limit(1).maybeSingle();
  const bodyQuery = reader.from(ABOUT_BODY_TABLE).select("*").order("order_index", { ascending: true });
  const pillarsQuery = reader
    .from(ABOUT_PILLARS_TABLE)
    .select("*")
    .order("order_index", { ascending: true });

  const [contentRes, stylesRes, bodyRes, pillarsRes] = await Promise.all([
    contentQuery,
    stylesQuery,
    bodyQuery,
    pillarsQuery,
  ]);

  if (contentRes.error) console.error("Error fetching about content:", contentRes.error);
  if (stylesRes.error) console.error("Error fetching about styles:", stylesRes.error);
  if (bodyRes.error) console.error("Error fetching about body:", bodyRes.error);
  if (pillarsRes.error) console.error("Error fetching about pillars:", pillarsRes.error);

  const content = contentRes.data
    ? {
        imageUrl: contentRes.data.image_url,
        imageAlt: contentRes.data.image_alt,
        imageAlt_th: contentRes.data.image_alt_th,
        highlightValue: contentRes.data.highlight_value,
        highlightLabel: contentRes.data.highlight_label,
        highlightLabel_th: contentRes.data.highlight_label_th,
        eyebrow: contentRes.data.eyebrow,
        eyebrow_th: contentRes.data.eyebrow_th,
        title: contentRes.data.title,
        title_th: contentRes.data.title_th,
        titleAccent: contentRes.data.title_accent,
        titleAccent_th: contentRes.data.title_accent_th,
      }
    : defaultContent;

  const styles = stylesRes.data
    ? {
        imageOverlayColorLight: stylesRes.data.image_overlay_color_light,
        imageOverlayColorDark: stylesRes.data.image_overlay_color_dark,
        highlightBgColorLight: stylesRes.data.highlight_bg_color_light,
        highlightBgColorDark: stylesRes.data.highlight_bg_color_dark,
        highlightValueColorLight: stylesRes.data.highlight_value_color_light,
        highlightValueColorDark: stylesRes.data.highlight_value_color_dark,
        highlightLabelColorLight: stylesRes.data.highlight_label_color_light,
        highlightLabelColorDark: stylesRes.data.highlight_label_color_dark,
        highlightValueFontFamilyEn: stylesRes.data.highlight_value_font_family_en,
        highlightValueFontFamilyTh: stylesRes.data.highlight_value_font_family_th,
        highlightValueFontSize: stylesRes.data.highlight_value_font_size,
        highlightLabelFontFamilyEn: stylesRes.data.highlight_label_font_family_en,
        highlightLabelFontFamilyTh: stylesRes.data.highlight_label_font_family_th,
        highlightLabelFontSize: stylesRes.data.highlight_label_font_size,
        eyebrowColorLight: stylesRes.data.eyebrow_color_light,
        eyebrowColorDark: stylesRes.data.eyebrow_color_dark,
        eyebrowFontFamilyEn: stylesRes.data.eyebrow_font_family_en,
        eyebrowFontFamilyTh: stylesRes.data.eyebrow_font_family_th,
        eyebrowFontSize: stylesRes.data.eyebrow_font_size,
        titleColorLight: stylesRes.data.title_color_light,
        titleColorDark: stylesRes.data.title_color_dark,
        titleFontFamilyEn: stylesRes.data.title_font_family_en,
        titleFontFamilyTh: stylesRes.data.title_font_family_th,
        titleFontSize: stylesRes.data.title_font_size,
        titleAccentColorLight: stylesRes.data.title_accent_color_light,
        titleAccentColorDark: stylesRes.data.title_accent_color_dark,
        titleAccentFontFamilyEn: stylesRes.data.title_accent_font_family_en,
        titleAccentFontFamilyTh: stylesRes.data.title_accent_font_family_th,
        titleAccentFontSize: stylesRes.data.title_accent_font_size,
        bodyColorLight: stylesRes.data.body_color_light,
        bodyColorDark: stylesRes.data.body_color_dark,
        bodyFontFamilyEn: stylesRes.data.body_font_family_en,
        bodyFontFamilyTh: stylesRes.data.body_font_family_th,
        bodyFontSize: stylesRes.data.body_font_size,
        pillarTitleColorLight: stylesRes.data.pillar_title_color_light,
        pillarTitleColorDark: stylesRes.data.pillar_title_color_dark,
        pillarTitleFontFamilyEn: stylesRes.data.pillar_title_font_family_en,
        pillarTitleFontFamilyTh: stylesRes.data.pillar_title_font_family_th,
        pillarTitleFontSize: stylesRes.data.pillar_title_font_size,
        pillarBodyColorLight: stylesRes.data.pillar_body_color_light,
        pillarBodyColorDark: stylesRes.data.pillar_body_color_dark,
        pillarBodyFontFamilyEn: stylesRes.data.pillar_body_font_family_en,
        pillarBodyFontFamilyTh: stylesRes.data.pillar_body_font_family_th,
        pillarBodyFontSize: stylesRes.data.pillar_body_font_size,
      }
    : defaultStyles;

  const body = (bodyRes.data || []).map((row: { id: string; text: string; text_th?: string; order_index: number }) => ({
    id: row.id,
    text: row.text,
    text_th: row.text_th,
    orderIndex: row.order_index,
  }));

  const pillars = (pillarsRes.data || []).map((row: { id: string; title: string; title_th?: string; body: string; body_th?: string; order_index: number }) => ({
    id: row.id,
    title: row.title,
    title_th: row.title_th,
    body: row.body,
    body_th: row.body_th,
    orderIndex: row.order_index,
  }));

  if (!contentRes.data && !stylesRes.data && body.length === 0 && pillars.length === 0) {
    return {
      content: defaultContent,
      styles: defaultStyles,
      body: defaultBody,
      pillars: defaultPillars,
    };
  }

  return {
    content,
    styles,
    body: body.length > 0 ? body : defaultBody,
    pillars: pillars.length > 0 ? pillars : defaultPillars,
  };
};

const getAboutContentCached = unstable_cache(getAboutContentInternal, [CACHE_TAGS.about], {
  revalidate: ABOUT_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.about],
});

export async function getAboutContent(): Promise<AboutContentBundle> {
  if (!CACHE_ENABLED) {
    return {
      content: defaultContent,
      styles: defaultStyles,
      body: defaultBody,
      pillars: defaultPillars,
    };
  }

  return getAboutContentCached();
}

export async function getAboutContentUncached(): Promise<AboutContentBundle> {
  return getAboutContentInternal();
}
