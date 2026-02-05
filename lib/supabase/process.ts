import { supabaseClient } from "@/lib/supabase/client";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";
import { en } from "@/content/en";

export type ProcessContent = {
  title: string;
  title_th?: string;
  subtitle: string;
  subtitle_th?: string;
};

export type ProcessStep = {
  id: string;
  number: string;
  title: string;
  title_th?: string;
  body: string;
  body_th?: string;
  icon: string;
  iconColorLight?: string;
  iconColorDark?: string;
  highlight?: boolean;
  offsetClass?: string;
  titleColorLight?: string;
  titleColorDark?: string;
  titleFontFamilyEn?: string;
  titleFontFamilyTh?: string;
  titleFontSize?: number;
  bodyColorLight?: string;
  bodyColorDark?: string;
  bodyFontFamilyEn?: string;
  bodyFontFamilyTh?: string;
  bodyFontSize?: number;
};

export type ProcessStyles = {
  titleColorLight?: string;
  titleColorDark?: string;
  titleFontFamilyEn?: string;
  titleFontFamilyTh?: string;
  titleFontSize?: number;
  subtitleColorLight?: string;
  subtitleColorDark?: string;
  subtitleFontFamilyEn?: string;
  subtitleFontFamilyTh?: string;
  subtitleFontSize?: number;
  accentColorLight?: string;
  accentColorDark?: string;
  stepIconColorLight?: string;
  stepIconColorDark?: string;
  stepNumberColorLight?: string;
  stepNumberColorDark?: string;
  stepTitleColorLight?: string;
  stepTitleColorDark?: string;
  stepTitleFontFamilyEn?: string;
  stepTitleFontFamilyTh?: string;
  stepTitleFontSize?: number;
  stepBodyColorLight?: string;
  stepBodyColorDark?: string;
  stepBodyFontFamilyEn?: string;
  stepBodyFontFamilyTh?: string;
  stepBodyFontSize?: number;
  lineBaseColorLight?: string;
  lineBaseColorDark?: string;
  lineAccentColorLight?: string;
  lineAccentColorDark?: string;
  lineDashColorLight?: string;
  lineDashColorDark?: string;
  linePulseDurationDesktop?: number;
  linePulseDurationMobile?: number;
  lineDashDurationDesktop?: number;
  lineDashDurationMobile?: number;
};

export type ProcessContentBundle = {
  content: ProcessContent;
  styles: ProcessStyles;
  steps: ProcessStep[];
};

export const PROCESS_CONTENT_TABLE = "process_content";
export const PROCESS_STYLES_TABLE = "process_styles";
export const PROCESS_STEPS_TABLE = "process_steps";

const defaultContent: ProcessContent = {
  title: en.process.title,
  title_th: en.process.title,
  subtitle: en.process.subtitle,
  subtitle_th: en.process.subtitle,
};

const defaultStyles: ProcessStyles = {
  titleColorLight: "#1b140f",
  titleColorDark: "#ffffff",
  titleFontFamilyEn: "Space Grotesk, sans-serif",
  titleFontFamilyTh: "Space Grotesk, sans-serif",
  titleFontSize: 48,
  subtitleColorLight: "#6b5d52",
  subtitleColorDark: "#bbab9b",
  subtitleFontFamilyEn: "Space Grotesk, sans-serif",
  subtitleFontFamilyTh: "Space Grotesk, sans-serif",
  subtitleFontSize: 16,
  accentColorLight: "#f97316",
  accentColorDark: "#f98c1f",
  stepIconColorLight: "#1b140f",
  stepIconColorDark: "#ffffff",
  stepNumberColorLight: "#f97316",
  stepNumberColorDark: "#f98c1f",
  stepTitleColorLight: "#1b140f",
  stepTitleColorDark: "#ffffff",
  stepTitleFontFamilyEn: "Space Grotesk, sans-serif",
  stepTitleFontFamilyTh: "Space Grotesk, sans-serif",
  stepTitleFontSize: 20,
  stepBodyColorLight: "#6b5d52",
  stepBodyColorDark: "#bbab9b",
  stepBodyFontFamilyEn: "Space Grotesk, sans-serif",
  stepBodyFontFamilyTh: "Space Grotesk, sans-serif",
  stepBodyFontSize: 14,
  lineBaseColorLight: "#ffedd5",
  lineBaseColorDark: "#3a3027",
  lineAccentColorLight: "#f97316",
  lineAccentColorDark: "#f98c1f",
  lineDashColorLight: "#ffffff",
  lineDashColorDark: "#f98c1f",
  linePulseDurationDesktop: 6,
  linePulseDurationMobile: 4,
  lineDashDurationDesktop: 8,
  lineDashDurationMobile: 8,
};

const defaultSteps: ProcessStep[] = en.process.steps.map((step, index) => ({
  id: `process-step-${String(index + 1).padStart(2, "0")}`,
  number: step.number,
  title: step.title,
  title_th: step.title,
  body: step.body,
  body_th: step.body,
  icon: step.icon,
  iconColorLight: defaultStyles.stepIconColorLight,
  iconColorDark: defaultStyles.stepIconColorDark,
  highlight: step.highlight,
  offsetClass: step.offsetClass,
  titleColorLight: defaultStyles.stepTitleColorLight,
  titleColorDark: defaultStyles.stepTitleColorDark,
  titleFontFamilyEn: defaultStyles.stepTitleFontFamilyEn,
  titleFontFamilyTh: defaultStyles.stepTitleFontFamilyTh,
  titleFontSize: defaultStyles.stepTitleFontSize,
  bodyColorLight: defaultStyles.stepBodyColorLight,
  bodyColorDark: defaultStyles.stepBodyColorDark,
  bodyFontFamilyEn: defaultStyles.stepBodyFontFamilyEn,
  bodyFontFamilyTh: defaultStyles.stepBodyFontFamilyTh,
  bodyFontSize: defaultStyles.stepBodyFontSize,
}));

const CACHE_ENABLED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const PROCESS_REVALIDATE_SECONDS = 600;

const getProcessReader = () => {
  if (typeof window !== "undefined") {
    return supabaseClient;
  }
  const adminClient = getSupabaseAdminClient();
  return adminClient ?? supabaseClient;
};

const getProcessContentInternal = async (): Promise<ProcessContentBundle> => {
  const reader = getProcessReader();
  const contentQuery = reader.from(PROCESS_CONTENT_TABLE).select("*").limit(1).maybeSingle();
  const stylesQuery = reader.from(PROCESS_STYLES_TABLE).select("*").limit(1).maybeSingle();
  const stepsQuery = reader.from(PROCESS_STEPS_TABLE).select("*").order("order_index", { ascending: true });

  const [contentRes, stylesRes, stepsRes] = await Promise.all([
    contentQuery,
    stylesQuery,
    stepsQuery,
  ]);

  if (contentRes.error) console.error("Error fetching process content:", contentRes.error);
  if (stylesRes.error) console.error("Error fetching process styles:", stylesRes.error);
  if (stepsRes.error) console.error("Error fetching process steps:", stepsRes.error);

  const content = contentRes.data
    ? {
        title: contentRes.data.title,
        title_th: contentRes.data.title_th,
        subtitle: contentRes.data.subtitle,
        subtitle_th: contentRes.data.subtitle_th,
      }
    : defaultContent;

  const styles = stylesRes.data
    ? {
        titleColorLight: stylesRes.data.title_color_light,
        titleColorDark: stylesRes.data.title_color_dark,
        titleFontFamilyEn: stylesRes.data.title_font_family_en,
        titleFontFamilyTh: stylesRes.data.title_font_family_th,
        titleFontSize: stylesRes.data.title_font_size,
        subtitleColorLight: stylesRes.data.subtitle_color_light,
        subtitleColorDark: stylesRes.data.subtitle_color_dark,
        subtitleFontFamilyEn: stylesRes.data.subtitle_font_family_en,
        subtitleFontFamilyTh: stylesRes.data.subtitle_font_family_th,
        subtitleFontSize: stylesRes.data.subtitle_font_size,
        accentColorLight: stylesRes.data.accent_color_light,
        accentColorDark: stylesRes.data.accent_color_dark,
        stepIconColorLight: stylesRes.data.step_icon_color_light,
        stepIconColorDark: stylesRes.data.step_icon_color_dark,
        stepNumberColorLight: stylesRes.data.step_number_color_light,
        stepNumberColorDark: stylesRes.data.step_number_color_dark,
        stepTitleColorLight: stylesRes.data.step_title_color_light,
        stepTitleColorDark: stylesRes.data.step_title_color_dark,
        stepTitleFontFamilyEn: stylesRes.data.step_title_font_family_en,
        stepTitleFontFamilyTh: stylesRes.data.step_title_font_family_th,
        stepTitleFontSize: stylesRes.data.step_title_font_size,
        stepBodyColorLight: stylesRes.data.step_body_color_light,
        stepBodyColorDark: stylesRes.data.step_body_color_dark,
        stepBodyFontFamilyEn: stylesRes.data.step_body_font_family_en,
        stepBodyFontFamilyTh: stylesRes.data.step_body_font_family_th,
        stepBodyFontSize: stylesRes.data.step_body_font_size,
        lineBaseColorLight: stylesRes.data.line_base_color_light,
        lineBaseColorDark: stylesRes.data.line_base_color_dark,
        lineAccentColorLight: stylesRes.data.line_accent_color_light,
        lineAccentColorDark: stylesRes.data.line_accent_color_dark,
        lineDashColorLight: stylesRes.data.line_dash_color_light,
        lineDashColorDark: stylesRes.data.line_dash_color_dark,
        linePulseDurationDesktop: stylesRes.data.line_pulse_duration_desktop,
        linePulseDurationMobile: stylesRes.data.line_pulse_duration_mobile,
        lineDashDurationDesktop: stylesRes.data.line_dash_duration_desktop,
        lineDashDurationMobile: stylesRes.data.line_dash_duration_mobile,
      }
    : defaultStyles;

  const steps = (stepsRes.data || []).map((row: { id: string; number: string; title: string; title_th?: string; body: string; body_th?: string; icon: string; icon_color_light?: string; icon_color_dark?: string; highlight?: boolean; order_index: number }) => ({
    id: row.id,
    number: row.number,
    title: row.title,
    title_th: row.title_th,
    body: row.body,
    body_th: row.body_th,
    icon: row.icon,
    iconColorLight: row.icon_color_light,
    iconColorDark: row.icon_color_dark,
    highlight: row.highlight,
    orderIndex: row.order_index,
  }));

  if (!contentRes.data && !stylesRes.data && steps.length === 0) {
    return {
      content: defaultContent,
      styles: defaultStyles,
      steps: defaultSteps,
    };
  }

  return {
    content,
    styles,
    steps: steps.length > 0 ? steps : defaultSteps,
  };
};

const getProcessContentCached = unstable_cache(getProcessContentInternal, [CACHE_TAGS.process], {
  revalidate: PROCESS_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.process],
});

export async function getProcessContent(): Promise<ProcessContentBundle> {
  if (!CACHE_ENABLED) {
    return {
      content: defaultContent,
      styles: defaultStyles,
      steps: defaultSteps,
    };
  }

  return getProcessContentCached();
}

export async function getProcessContentUncached(): Promise<ProcessContentBundle> {
  return getProcessContentInternal();
}
