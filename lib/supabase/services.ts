import { supabaseClient } from "@/lib/supabase/client";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";

// --- Types ---

export type ServicesContent = {
  eyebrow: string;
  eyebrow_th?: string;
  title: string;
  title_th?: string;
  viewAll: string;
  viewAll_th?: string;
  explore: string;
  explore_th?: string;
};

export type ServicesStyles = {
  // Eyebrow
  eyebrowFontFamilyEn?: string;
  eyebrowFontFamilyTh?: string;
  eyebrowFontSize?: number;
  eyebrowColorLight?: string;
  eyebrowColorDark?: string;

  // Title
  titleFontFamilyEn?: string;
  titleFontFamilyTh?: string;
  titleFontSize?: number;
  titleColorLight?: string;
  titleColorDark?: string;

  // Card General
  cardBgLight?: string;
  cardBgDark?: string;
  cardBorderLight?: string;
  cardBorderDark?: string;

  // Card Icon
  cardIconColorLight?: string;
  cardIconColorDark?: string;
  cardIconBgLight?: string;
  cardIconBgDark?: string;

  // Card Title
  cardTitleFontFamilyEn?: string;
  cardTitleFontFamilyTh?: string;
  cardTitleFontSize?: number;
  cardTitleColorLight?: string;
  cardTitleColorDark?: string;

  // Card Body
  cardBodyFontFamilyEn?: string;
  cardBodyFontFamilyTh?: string;
  cardBodyFontSize?: number;
  cardBodyColorLight?: string;
  cardBodyColorDark?: string;

  // Explore Link
  exploreFontFamilyEn?: string;
  exploreFontFamilyTh?: string;
  exploreFontSize?: number;
  exploreColorLight?: string;
  exploreColorDark?: string;

  // --- Plan Modal Styles ---

  // Plan Title
  planTitleFontFamilyEn?: string;
  planTitleFontFamilyTh?: string;
  planTitleFontSize?: number;
  planTitleColorLight?: string;
  planTitleColorDark?: string;

  // Plan Description
  planDescFontFamilyEn?: string;
  planDescFontFamilyTh?: string;
  planDescFontSize?: number;
  planDescColorLight?: string;
  planDescColorDark?: string;

  // Plan Price
  planPriceFontFamilyEn?: string;
  planPriceFontFamilyTh?: string;
  planPriceFontSize?: number;
  planPriceColorLight?: string;
  planPriceColorDark?: string;

  // Plan Currency
  planCurrencyFontFamilyEn?: string;
  planCurrencyFontFamilyTh?: string;
  planCurrencyFontSize?: number;
  planCurrencyColorLight?: string;
  planCurrencyColorDark?: string;

  // Plan Period
  planPeriodFontFamilyEn?: string;
  planPeriodFontFamilyTh?: string;
  planPeriodFontSize?: number;
  planPeriodColorLight?: string;
  planPeriodColorDark?: string;

  // Plan CTA
  planCtaFontFamilyEn?: string;
  planCtaFontFamilyTh?: string;
  planCtaFontSize?: number;
  planCtaColorLight?: string;
  planCtaColorDark?: string;

  // Plan Badge
  planBadgeFontFamilyEn?: string;
  planBadgeFontFamilyTh?: string;
  planBadgeFontSize?: number;
  planBadgeColorLight?: string;
  planBadgeColorDark?: string;

  // Plan Features
  planFeatureFontFamilyEn?: string;
  planFeatureFontFamilyTh?: string;
  planFeatureFontSize?: number;
  planFeatureColorLight?: string;
  planFeatureColorDark?: string;
};

export type ServicePlan = {
  title: string;
  title_th?: string;
  description: string;
  description_th?: string;
  price: string;
  price_th?: string;
  currency?: string;
  currency_th?: string;
  period?: string;
  period_th?: string;
  cta: string;
  cta_th?: string;
  features: string[];
  badge?: string;
  badge_th?: string;
  featured?: boolean;
  icon?: string; // Material symbol or URL
  featureIcon?: string; // Material symbol or URL
};

export type ServiceItem = {
  id: string;
  iconType: "material" | "svg";
  iconValue: string;
  title: string;
  title_th?: string;
  body: string;
  body_th?: string;
  features: string[]; // JSONB array in DB
  modalPlans?: ServicePlan[]; // JSONB array in DB
  orderIndex: number;
};

export type ServicesData = {
  content: ServicesContent;
  styles: ServicesStyles;
  items: ServiceItem[];
};

// --- Table Constants ---
export const SERVICES_CONTENT_TABLE = "services_content";
export const SERVICES_STYLES_TABLE = "services_styles";
export const SERVICES_ITEMS_TABLE = "services_items";

// --- Defaults (Fallback) ---
const defaultContent: ServicesContent = {
  eyebrow: "CURATED CAPABILITIES",
  title: "BESPOKE SERVICES FOR DEMANDING BRANDS",
  viewAll: "VIEW ALL SERVICES",
  explore: "EXPLORE →",
};

const defaultStyles: ServicesStyles = {
  eyebrowFontFamilyEn: "Space Grotesk, sans-serif",
  eyebrowFontSize: 12,
  eyebrowColorLight: "#ea580c",
  eyebrowColorDark: "#ea580c",
  titleFontFamilyEn: "Space Grotesk, sans-serif",
  titleFontSize: 36,
  titleColorLight: "#0f172a",
  titleColorDark: "#f5f5f4",
  cardBgLight: "#f5f5f4",
  cardBgDark: "#1c1917",
  cardBorderLight: "#e7e5e4",
  cardBorderDark: "rgba(255, 255, 255, 0.1)",
  cardIconColorLight: "#181411",
  cardIconColorDark: "#ffffff",
  cardIconBgLight: "#ffffff",
  cardIconBgDark: "rgba(255, 255, 255, 0.05)",
  cardTitleFontFamilyEn: "Space Grotesk, sans-serif",
  cardTitleFontSize: 24,
  cardTitleColorLight: "#0f172a",
  cardTitleColorDark: "#f5f5f4",
  cardBodyFontFamilyEn: "Inter, sans-serif",
  cardBodyFontSize: 14,
  cardBodyColorLight: "#4b5563",
  cardBodyColorDark: "#a8a29e",
  exploreFontFamilyEn: "Space Grotesk, sans-serif",
  exploreFontSize: 14,
  exploreColorLight: "#ea580c",
  exploreColorDark: "#ea580c",
};

const defaultItems: ServiceItem[] = [];

// --- Logic ---

const CACHE_ENABLED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const SERVICES_REVALIDATE_SECONDS = 600;

const getReader = () => {
  if (typeof window !== "undefined") {
    return supabaseClient;
  }
  const adminClient = getSupabaseAdminClient();
  return adminClient ?? supabaseClient;
};

const getServicesContentInternal = async (): Promise<ServicesData> => {
  const reader = getReader();

  const contentQuery = reader.from(SERVICES_CONTENT_TABLE).select("*").limit(1).maybeSingle();
  const stylesQuery = reader.from(SERVICES_STYLES_TABLE).select("*").limit(1).maybeSingle();
  const itemsQuery = reader
    .from(SERVICES_ITEMS_TABLE)
    .select("*")
    .order("order_index", { ascending: true });

  const [contentRes, stylesRes, itemsRes] = await Promise.all([
    contentQuery,
    stylesQuery,
    itemsQuery,
  ]);

  if (contentRes.error) console.error("Error fetching services content:", contentRes.error);
  if (stylesRes.error) console.error("Error fetching services styles:", stylesRes.error);
  if (itemsRes.error) console.error("Error fetching services items:", itemsRes.error);

  const content: ServicesContent = contentRes.data
    ? {
        eyebrow: contentRes.data.eyebrow,
        eyebrow_th: contentRes.data.eyebrow_th,
        title: contentRes.data.title,
        title_th: contentRes.data.title_th,
        viewAll: contentRes.data.view_all,
        viewAll_th: contentRes.data.view_all_th,
        explore: contentRes.data.explore,
        explore_th: contentRes.data.explore_th,
      }
    : defaultContent;

  const styles: ServicesStyles = stylesRes.data
    ? {
        // ... Existing styles ...
        eyebrowFontFamilyEn: stylesRes.data.eyebrow_font_family_en,
        eyebrowFontFamilyTh: stylesRes.data.eyebrow_font_family_th,
        eyebrowFontSize: stylesRes.data.eyebrow_font_size,
        eyebrowColorLight: stylesRes.data.eyebrow_color_light,
        eyebrowColorDark: stylesRes.data.eyebrow_color_dark,
        
        titleFontFamilyEn: stylesRes.data.title_font_family_en,
        titleFontFamilyTh: stylesRes.data.title_font_family_th,
        titleFontSize: stylesRes.data.title_font_size,
        titleColorLight: stylesRes.data.title_color_light,
        titleColorDark: stylesRes.data.title_color_dark,
        
        cardBgLight: stylesRes.data.card_bg_light,
        cardBgDark: stylesRes.data.card_bg_dark,
        cardBorderLight: stylesRes.data.card_border_light,
        cardBorderDark: stylesRes.data.card_border_dark,
        
        cardIconColorLight: stylesRes.data.card_icon_color_light,
        cardIconColorDark: stylesRes.data.card_icon_color_dark,
        cardIconBgLight: stylesRes.data.card_icon_bg_light,
        cardIconBgDark: stylesRes.data.card_icon_bg_dark,
        
        cardTitleFontFamilyEn: stylesRes.data.card_title_font_family_en,
        cardTitleFontFamilyTh: stylesRes.data.card_title_font_family_th,
        cardTitleFontSize: stylesRes.data.card_title_font_size,
        cardTitleColorLight: stylesRes.data.card_title_color_light,
        cardTitleColorDark: stylesRes.data.card_title_color_dark,
        
        cardBodyFontFamilyEn: stylesRes.data.card_body_font_family_en,
        cardBodyFontFamilyTh: stylesRes.data.card_body_font_family_th,
        cardBodyFontSize: stylesRes.data.card_body_font_size,
        cardBodyColorLight: stylesRes.data.card_body_color_light,
        cardBodyColorDark: stylesRes.data.card_body_color_dark,
        
        exploreFontFamilyEn: stylesRes.data.explore_font_family_en,
        exploreFontFamilyTh: stylesRes.data.explore_font_family_th,
        exploreFontSize: stylesRes.data.explore_font_size,
        exploreColorLight: stylesRes.data.explore_color_light,
        exploreColorDark: stylesRes.data.explore_color_dark,

        // ... Plan Modal Styles ...
        planTitleFontFamilyEn: stylesRes.data.plan_title_font_family_en,
        planTitleFontFamilyTh: stylesRes.data.plan_title_font_family_th,
        planTitleFontSize: stylesRes.data.plan_title_font_size,
        planTitleColorLight: stylesRes.data.plan_title_color_light,
        planTitleColorDark: stylesRes.data.plan_title_color_dark,

        planDescFontFamilyEn: stylesRes.data.plan_desc_font_family_en,
        planDescFontFamilyTh: stylesRes.data.plan_desc_font_family_th,
        planDescFontSize: stylesRes.data.plan_desc_font_size,
        planDescColorLight: stylesRes.data.plan_desc_color_light,
        planDescColorDark: stylesRes.data.plan_desc_color_dark,

        planPriceFontFamilyEn: stylesRes.data.plan_price_font_family_en,
        planPriceFontFamilyTh: stylesRes.data.plan_price_font_family_th,
        planPriceFontSize: stylesRes.data.plan_price_font_size,
        planPriceColorLight: stylesRes.data.plan_price_color_light,
        planPriceColorDark: stylesRes.data.plan_price_color_dark,

        planCurrencyFontFamilyEn: stylesRes.data.plan_currency_font_family_en,
        planCurrencyFontFamilyTh: stylesRes.data.plan_currency_font_family_th,
        planCurrencyFontSize: stylesRes.data.plan_currency_font_size,
        planCurrencyColorLight: stylesRes.data.plan_currency_color_light,
        planCurrencyColorDark: stylesRes.data.plan_currency_color_dark,

        planPeriodFontFamilyEn: stylesRes.data.plan_period_font_family_en,
        planPeriodFontFamilyTh: stylesRes.data.plan_period_font_family_th,
        planPeriodFontSize: stylesRes.data.plan_period_font_size,
        planPeriodColorLight: stylesRes.data.plan_period_color_light,
        planPeriodColorDark: stylesRes.data.plan_period_color_dark,

        planCtaFontFamilyEn: stylesRes.data.plan_cta_font_family_en,
        planCtaFontFamilyTh: stylesRes.data.plan_cta_font_family_th,
        planCtaFontSize: stylesRes.data.plan_cta_font_size,
        planCtaColorLight: stylesRes.data.plan_cta_color_light,
        planCtaColorDark: stylesRes.data.plan_cta_color_dark,

        planBadgeFontFamilyEn: stylesRes.data.plan_badge_font_family_en,
        planBadgeFontFamilyTh: stylesRes.data.plan_badge_font_family_th,
        planBadgeFontSize: stylesRes.data.plan_badge_font_size,
        planBadgeColorLight: stylesRes.data.plan_badge_color_light,
        planBadgeColorDark: stylesRes.data.plan_badge_color_dark,

        planFeatureFontFamilyEn: stylesRes.data.plan_feature_font_family_en,
        planFeatureFontFamilyTh: stylesRes.data.plan_feature_font_family_th,
        planFeatureFontSize: stylesRes.data.plan_feature_font_size,
        planFeatureColorLight: stylesRes.data.plan_feature_color_light,
        planFeatureColorDark: stylesRes.data.plan_feature_color_dark,
      }
    : defaultStyles;

  const items: ServiceItem[] = (itemsRes.data || []).map((item: { id: string; icon_type: string; icon_value: string; title: string; title_th?: string; body: string; body_th?: string; features: string[]; modal_plans: ServicePlan[]; order_index: number }) => ({
    id: item.id,
    iconType: item.icon_type as "material" | "svg",
    iconValue: item.icon_value,
    title: item.title,
    title_th: item.title_th,
    body: item.body,
    body_th: item.body_th,
    features: item.features, 
    modalPlans: item.modal_plans, // Map JSONB to modalPlans
    orderIndex: item.order_index,
  }));

  return { content, styles, items };
};

const getServicesContentCached = unstable_cache(getServicesContentInternal, [CACHE_TAGS.services], {
  revalidate: SERVICES_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.services],
});

export async function getServicesContent(): Promise<ServicesData> {
  if (!CACHE_ENABLED) {
    return { content: defaultContent, styles: defaultStyles, items: defaultItems };
  }

  return getServicesContentCached();
}

export async function getServicesContentUncached(): Promise<ServicesData> {
  return getServicesContentInternal();
}
