import { supabaseClient } from "@/lib/supabase/client";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";

// --- Types ---

export type ContactContent = {
  eyebrow: string;
  eyebrow_th?: string;
  titleTop: string;
  titleTop_th?: string;
  titleBottom: string;
  titleBottom_th?: string;
  body: string;
  body_th?: string;
  emailLabel: string;
  emailLabel_th?: string;
  email: string;
  locationLabel: string;
  locationLabel_th?: string;
  location: string;
  location_th?: string;
};

export type ContactFormContent = {
  nameLabel: string;
  nameLabel_th?: string;
  namePlaceholder: string;
  namePlaceholder_th?: string;
  companyLabel: string;
  companyLabel_th?: string;
  companyPlaceholder: string;
  companyPlaceholder_th?: string;
  emailLabel: string;
  emailLabel_th?: string;
  emailPlaceholder: string;
  emailPlaceholder_th?: string;
  detailsLabel: string;
  detailsLabel_th?: string;
  detailsPlaceholder: string;
  detailsPlaceholder_th?: string;
  submitLabel: string;
  submitLabel_th?: string;
};

export type ContactStyles = {
  // Fonts
  eyebrowFontFamilyEn?: string;
  eyebrowFontFamilyTh?: string;
  eyebrowFontSize?: number;
  titleFontFamilyEn?: string;
  titleFontFamilyTh?: string;
  titleFontSize?: number;
  bodyFontFamilyEn?: string;
  bodyFontFamilyTh?: string;
  bodyFontSize?: number;
  labelFontFamilyEn?: string;
  labelFontFamilyTh?: string;
  labelFontSize?: number;
  infoFontFamilyEn?: string;
  infoFontFamilyTh?: string;
  infoFontSize?: number;
  formLabelFontFamilyEn?: string;
  formLabelFontFamilyTh?: string;
  formLabelFontSize?: number;
  inputFontFamilyEn?: string;
  inputFontFamilyTh?: string;
  inputFontSize?: number;
  buttonFontFamilyEn?: string;
  buttonFontFamilyTh?: string;
  buttonFontSize?: number;

  // Colors
  eyebrowColorLight?: string;
  eyebrowColorDark?: string;
  titleColorLight?: string;
  titleColorDark?: string;
  bodyColorLight?: string;
  bodyColorDark?: string;
  labelColorLight?: string;
  labelColorDark?: string;
  infoColorLight?: string;
  infoColorDark?: string;
  iconBgLight?: string;
  iconBgDark?: string;
  iconColorLight?: string;
  iconColorDark?: string;
  
  formBgLight?: string;
  formBgDark?: string;
  formBorderLight?: string;
  formBorderDark?: string;
  formLabelColorLight?: string;
  formLabelColorDark?: string;
  inputBgLight?: string;
  inputBgDark?: string;
  inputBorderLight?: string;
  inputBorderDark?: string;
  inputTextLight?: string;
  inputTextDark?: string;
  inputPlaceholderLight?: string;
  inputPlaceholderDark?: string;
  
  buttonBgLight?: string;
  buttonBgDark?: string;
  buttonTextLight?: string;
  buttonTextDark?: string;
};

export type FloatingSocialItem = {
  id: string;
  label: string;
  label_th?: string;
  href: string;
  iconSvg: string;
  type: string;
  orderIndex: number;
  bgColor?: string;
  iconColor?: string;
};

export type ContactPageContent = {
  contact: ContactContent;
  form: ContactFormContent;
  styles: ContactStyles;
  socialItems: FloatingSocialItem[];
};

// --- Tables ---

export const CONTACT_CONTENT_TABLE = "contact_content";
export const CONTACT_FORM_CONTENT_TABLE = "contact_form_content";
export const CONTACT_STYLES_TABLE = "contact_styles";
export const FLOATING_SOCIAL_ITEMS_TABLE = "floating_social_items";

// --- Defaults ---

const defaultContactContent: ContactContent = {
  eyebrow: "BEGIN THE DIALOGUE",
  eyebrow_th: "BEGIN THE DIALOGUE",
  titleTop: "READY TO ELEVATE",
  titleTop_th: "READY TO ELEVATE",
  titleBottom: "YOUR PRESENCE?",
  titleBottom_th: "YOUR PRESENCE?",
  body: "We take on a limited number of clients each year to ensure undivided attention. Tell us about your vision.",
  body_th: "We take on a limited number of clients each year to ensure undivided attention. Tell us about your vision.",
  emailLabel: "Email Us",
  emailLabel_th: "Email Us",
  email: "hello@atelier-studio.com",
  locationLabel: "Visit Us",
  locationLabel_th: "Visit Us",
  location: "Zurich, Switzerland",
  location_th: "Zurich, Switzerland",
};

const defaultContactFormContent: ContactFormContent = {
  nameLabel: "Name",
  nameLabel_th: "Name",
  namePlaceholder: "John Doe",
  namePlaceholder_th: "John Doe",
  companyLabel: "Company",
  companyLabel_th: "Company",
  companyPlaceholder: "Acme Inc.",
  companyPlaceholder_th: "Acme Inc.",
  emailLabel: "Email",
  emailLabel_th: "Email",
  emailPlaceholder: "john@example.com",
  emailPlaceholder_th: "john@example.com",
  detailsLabel: "Project Details",
  detailsLabel_th: "Project Details",
  detailsPlaceholder: "Tell us about your goals...",
  detailsPlaceholder_th: "Tell us about your goals...",
  submitLabel: "Send Inquiry",
  submitLabel_th: "Send Inquiry",
};

const defaultContactStyles: ContactStyles = {
  eyebrowFontFamilyEn: "Manrope, sans-serif",
  eyebrowFontFamilyTh: "Manrope, sans-serif",
  eyebrowFontSize: 14,
  titleFontFamilyEn: "Manrope, sans-serif",
  titleFontFamilyTh: "Manrope, sans-serif",
  titleFontSize: 48,
  bodyFontFamilyEn: "Manrope, sans-serif",
  bodyFontFamilyTh: "Manrope, sans-serif",
  bodyFontSize: 16,
  labelFontFamilyEn: "Manrope, sans-serif",
  labelFontFamilyTh: "Manrope, sans-serif",
  labelFontSize: 12,
  infoFontFamilyEn: "Manrope, sans-serif",
  infoFontFamilyTh: "Manrope, sans-serif",
  infoFontSize: 16,
  formLabelFontFamilyEn: "Manrope, sans-serif",
  formLabelFontFamilyTh: "Manrope, sans-serif",
  formLabelFontSize: 12,
  inputFontFamilyEn: "Manrope, sans-serif",
  inputFontFamilyTh: "Manrope, sans-serif",
  inputFontSize: 16,
  buttonFontFamilyEn: "Manrope, sans-serif",
  buttonFontFamilyTh: "Manrope, sans-serif",
  buttonFontSize: 16,

  eyebrowColorLight: "#f98c1f",
  eyebrowColorDark: "#f98c1f",
  titleColorLight: "#181411",
  titleColorDark: "#ffffff",
  bodyColorLight: "#525252",
  bodyColorDark: "#a3a3a3",
  labelColorLight: "#525252",
  labelColorDark: "#a3a3a3",
  infoColorLight: "#181411",
  infoColorDark: "#ffffff",
  iconBgLight: "rgba(0,0,0,0.05)",
  iconBgDark: "rgba(255,255,255,0.05)",
  iconColorLight: "#f98c1f",
  iconColorDark: "#f98c1f",
  
  formBgLight: "#ffffff",
  formBgDark: "rgba(255,255,255,0.05)",
  formBorderLight: "#e5e5e5",
  formBorderDark: "rgba(255,255,255,0.1)",
  formLabelColorLight: "#525252",
  formLabelColorDark: "#a3a3a3",
  inputBgLight: "transparent",
  inputBgDark: "transparent",
  inputBorderLight: "#e5e5e5",
  inputBorderDark: "rgba(255,255,255,0.2)",
  inputTextLight: "#181411",
  inputTextDark: "#ffffff",
  inputPlaceholderLight: "rgba(0,0,0,0.3)",
  inputPlaceholderDark: "rgba(255,255,255,0.2)",
  
  buttonBgLight: "#f98c1f",
  buttonBgDark: "#f98c1f",
  buttonTextLight: "#181411",
  buttonTextDark: "#181411",
};

const defaultSocialItems: FloatingSocialItem[] = [
  { id: "social-01", label: "Facebook", label_th: "Facebook", href: "https://facebook.com", type: "facebook", iconSvg: "", orderIndex: 0, bgColor: "#3b5998", iconColor: "#ffffff" },
  { id: "social-02", label: "Line", label_th: "Line", href: "https://line.me", type: "line", iconSvg: "", orderIndex: 1, bgColor: "#06c755", iconColor: "#ffffff" },
];

const CACHE_ENABLED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const CONTACT_REVALIDATE_SECONDS = 600;

const getReader = () => {
  if (typeof window !== "undefined") {
    return supabaseClient;
  }
  const adminClient = getSupabaseAdminClient();
  return adminClient ?? supabaseClient;
};

// --- Fetcher ---

const getContactContentInternal = async (): Promise<ContactPageContent> => {
  const reader = getReader();

  const [contactRes, formRes, stylesRes, socialRes] = await Promise.all([
    reader.from(CONTACT_CONTENT_TABLE).select("*").limit(1).maybeSingle(),
    reader.from(CONTACT_FORM_CONTENT_TABLE).select("*").limit(1).maybeSingle(),
    reader.from(CONTACT_STYLES_TABLE).select("*").limit(1).maybeSingle(),
    reader.from(FLOATING_SOCIAL_ITEMS_TABLE).select("*").order("order_index", { ascending: true }),
  ]);

  if (contactRes.error) console.error("Error fetching contact content:", contactRes.error);
  if (formRes.error) console.error("Error fetching contact form:", formRes.error);
  if (stylesRes.error) console.error("Error fetching contact styles:", stylesRes.error);
  if (socialRes.error) console.error("Error fetching social items:", socialRes.error);

  const contact = contactRes.data
    ? {
        eyebrow: contactRes.data.eyebrow,
        eyebrow_th: contactRes.data.eyebrow_th,
        titleTop: contactRes.data.title_top,
        titleTop_th: contactRes.data.title_top_th,
        titleBottom: contactRes.data.title_bottom,
        titleBottom_th: contactRes.data.title_bottom_th,
        body: contactRes.data.body,
        body_th: contactRes.data.body_th,
        emailLabel: contactRes.data.email_label,
        emailLabel_th: contactRes.data.email_label_th,
        email: contactRes.data.email,
        locationLabel: contactRes.data.location_label,
        locationLabel_th: contactRes.data.location_label_th,
        location: contactRes.data.location,
        location_th: contactRes.data.location_th,
      }
    : defaultContactContent;

  const form = formRes.data
    ? {
        nameLabel: formRes.data.name_label,
        nameLabel_th: formRes.data.name_label_th,
        namePlaceholder: formRes.data.name_placeholder,
        namePlaceholder_th: formRes.data.name_placeholder_th,
        companyLabel: formRes.data.company_label,
        companyLabel_th: formRes.data.company_label_th,
        companyPlaceholder: formRes.data.company_placeholder,
        companyPlaceholder_th: formRes.data.company_placeholder_th,
        emailLabel: formRes.data.email_label,
        emailLabel_th: formRes.data.email_label_th,
        emailPlaceholder: formRes.data.email_placeholder,
        emailPlaceholder_th: formRes.data.email_placeholder_th,
        detailsLabel: formRes.data.details_label,
        detailsLabel_th: formRes.data.details_label_th,
        detailsPlaceholder: formRes.data.details_placeholder,
        detailsPlaceholder_th: formRes.data.details_placeholder_th,
        submitLabel: formRes.data.submit_label,
        submitLabel_th: formRes.data.submit_label_th,
      }
    : defaultContactFormContent;

  const styles = stylesRes.data
    ? {
        eyebrowFontFamilyEn: stylesRes.data.eyebrow_font_family_en,
        eyebrowFontFamilyTh: stylesRes.data.eyebrow_font_family_th,
        eyebrowFontSize: stylesRes.data.eyebrow_font_size,
        titleFontFamilyEn: stylesRes.data.title_font_family_en,
        titleFontFamilyTh: stylesRes.data.title_font_family_th,
        titleFontSize: stylesRes.data.title_font_size,
        bodyFontFamilyEn: stylesRes.data.body_font_family_en,
        bodyFontFamilyTh: stylesRes.data.body_font_family_th,
        bodyFontSize: stylesRes.data.body_font_size,
        labelFontFamilyEn: stylesRes.data.label_font_family_en,
        labelFontFamilyTh: stylesRes.data.label_font_family_th,
        labelFontSize: stylesRes.data.label_font_size,
        infoFontFamilyEn: stylesRes.data.info_font_family_en,
        infoFontFamilyTh: stylesRes.data.info_font_family_th,
        infoFontSize: stylesRes.data.info_font_size,
        formLabelFontFamilyEn: stylesRes.data.form_label_font_family_en,
        formLabelFontFamilyTh: stylesRes.data.form_label_font_family_th,
        formLabelFontSize: stylesRes.data.form_label_font_size,
        inputFontFamilyEn: stylesRes.data.input_font_family_en,
        inputFontFamilyTh: stylesRes.data.input_font_family_th,
        inputFontSize: stylesRes.data.input_font_size,
        buttonFontFamilyEn: stylesRes.data.button_font_family_en,
        buttonFontFamilyTh: stylesRes.data.button_font_family_th,
        buttonFontSize: stylesRes.data.button_font_size,

        eyebrowColorLight: stylesRes.data.eyebrow_color_light,
        eyebrowColorDark: stylesRes.data.eyebrow_color_dark,
        titleColorLight: stylesRes.data.title_color_light,
        titleColorDark: stylesRes.data.title_color_dark,
        bodyColorLight: stylesRes.data.body_color_light,
        bodyColorDark: stylesRes.data.body_color_dark,
        labelColorLight: stylesRes.data.label_color_light,
        labelColorDark: stylesRes.data.label_color_dark,
        infoColorLight: stylesRes.data.info_color_light,
        infoColorDark: stylesRes.data.info_color_dark,
        iconBgLight: stylesRes.data.icon_bg_light,
        iconBgDark: stylesRes.data.icon_bg_dark,
        iconColorLight: stylesRes.data.icon_color_light,
        iconColorDark: stylesRes.data.icon_color_dark,
        
        formBgLight: stylesRes.data.form_bg_light,
        formBgDark: stylesRes.data.form_bg_dark,
        formBorderLight: stylesRes.data.form_border_light,
        formBorderDark: stylesRes.data.form_border_dark,
        formLabelColorLight: stylesRes.data.form_label_color_light,
        formLabelColorDark: stylesRes.data.form_label_color_dark,
        inputBgLight: stylesRes.data.input_bg_light,
        inputBgDark: stylesRes.data.input_bg_dark,
        inputBorderLight: stylesRes.data.input_border_light,
        inputBorderDark: stylesRes.data.input_border_dark,
        inputTextLight: stylesRes.data.input_text_light,
        inputTextDark: stylesRes.data.input_text_dark,
        inputPlaceholderLight: stylesRes.data.input_placeholder_light,
        inputPlaceholderDark: stylesRes.data.input_placeholder_dark,
        
        buttonBgLight: stylesRes.data.button_bg_light,
        buttonBgDark: stylesRes.data.button_bg_dark,
        buttonTextLight: stylesRes.data.button_text_light,
        buttonTextDark: stylesRes.data.button_text_dark,
      }
    : defaultContactStyles;

  const socialItems = (socialRes.data || []).map((item: { id: string; label: string; label_th?: string; href: string; icon_svg?: string; type: string; order_index: number; bg_color?: string; icon_color?: string }) => ({
    id: item.id,
    label: item.label,
    label_th: item.label_th,
    href: item.href,
    iconSvg: item.icon_svg || "",
    type: item.type,
    orderIndex: item.order_index,
    bgColor: item.bg_color,
    iconColor: item.icon_color,
  }));

  return {
    contact,
    form,
    styles,
    socialItems: socialItems.length > 0 ? socialItems : defaultSocialItems,
  };
};

const getContactContentCached = unstable_cache(getContactContentInternal, [CACHE_TAGS.contact], {
  revalidate: CONTACT_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.contact],
});

export async function getContactContent(): Promise<ContactPageContent> {
  if (!CACHE_ENABLED) {
    return {
      contact: defaultContactContent,
      form: defaultContactFormContent,
      styles: defaultContactStyles,
      socialItems: defaultSocialItems,
    };
  }

  return getContactContentCached();
}

export async function getContactContentUncached(): Promise<ContactPageContent> {
  return getContactContentInternal();
}
