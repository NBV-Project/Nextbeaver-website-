import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";
import type { ContactPageContent } from "@/lib/supabase/contact";
import { getContactContentUncached } from "@/lib/supabase/contact";
import { getAdminActorLabel } from "@/lib/auth/adminAuth";
import { getAdminSessionFromRequest } from "@/lib/auth/adminSession";
import { buildDiff, getRequestMeta, logAdminEvent } from "@/lib/audit/adminAudit";
import {
  CONTACT_CONTENT_TABLE,
  CONTACT_FORM_CONTENT_TABLE,
  CONTACT_STYLES_TABLE,
  FLOATING_SOCIAL_ITEMS_TABLE,
} from "@/lib/supabase/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidUUID(uuid: string) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

export async function POST(request: Request) {
  const supabaseAdminClient = getSupabaseAdminClient();

  if (!supabaseAdminClient) {
    return NextResponse.json(
      {
        error:
          "Supabase service role key is not configured. Set SUPABASE_SERVICE_ROLE_KEY.",
      },
      { status: 500 }
    );
  }

  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const actorLabel = getAdminActorLabel(session.actorId);
  const requestMeta = getRequestMeta(request);
  const beforeContent = await getContactContentUncached();

  let payload: ContactPageContent | undefined;
  try {
    const body = await request.json();
    payload = body?.payload;
    if (!payload) {
      throw new Error("Missing contact payload");
    }
  } catch (error) {
    console.error("Failed to parse contact payload:", error);
    return NextResponse.json(
      { error: "Invalid request body for contact save." },
      { status: 400 }
    );
  }

  // --- SAVE CONTACT INFO ---
  const { data: existingContact } = await supabaseAdminClient
    .from(CONTACT_CONTENT_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const contactData = {
    eyebrow: payload.contact.eyebrow,
    eyebrow_th: payload.contact.eyebrow_th,
    title_top: payload.contact.titleTop,
    title_top_th: payload.contact.titleTop_th,
    title_bottom: payload.contact.titleBottom,
    title_bottom_th: payload.contact.titleBottom_th,
    body: payload.contact.body,
    body_th: payload.contact.body_th,
    email_label: payload.contact.emailLabel,
    email_label_th: payload.contact.emailLabel_th,
    email: payload.contact.email,
    location_label: payload.contact.locationLabel,
    location_label_th: payload.contact.locationLabel_th,
    location: payload.contact.location,
    location_th: payload.contact.location_th,
    updated_at: new Date().toISOString(),
  };

  if (existingContact?.id) {
    const { error } = await supabaseAdminClient
      .from(CONTACT_CONTENT_TABLE)
      .update(contactData)
      .eq("id", existingContact.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdminClient
      .from(CONTACT_CONTENT_TABLE)
      .insert(contactData);
    if (error) throw error;
  }

  // --- SAVE FORM INFO ---
  const { data: existingForm } = await supabaseAdminClient
    .from(CONTACT_FORM_CONTENT_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const formData = {
    name_label: payload.form.nameLabel,
    name_label_th: payload.form.nameLabel_th,
    name_placeholder: payload.form.namePlaceholder,
    name_placeholder_th: payload.form.namePlaceholder_th,
    company_label: payload.form.companyLabel,
    company_label_th: payload.form.companyLabel_th,
    company_placeholder: payload.form.companyPlaceholder,
    company_placeholder_th: payload.form.companyPlaceholder_th,
    email_label: payload.form.emailLabel,
    email_label_th: payload.form.emailLabel_th,
    email_placeholder: payload.form.emailPlaceholder,
    email_placeholder_th: payload.form.emailPlaceholder_th,
    details_label: payload.form.detailsLabel,
    details_label_th: payload.form.detailsLabel_th,
    details_placeholder: payload.form.detailsPlaceholder,
    details_placeholder_th: payload.form.detailsPlaceholder_th,
    submit_label: payload.form.submitLabel,
    submit_label_th: payload.form.submitLabel_th,
    updated_at: new Date().toISOString(),
  };

  if (existingForm?.id) {
    const { error } = await supabaseAdminClient
      .from(CONTACT_FORM_CONTENT_TABLE)
      .update(formData)
      .eq("id", existingForm.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdminClient
      .from(CONTACT_FORM_CONTENT_TABLE)
      .insert(formData);
    if (error) throw error;
  }

  // --- SAVE STYLES ---
  const { data: existingStyles } = await supabaseAdminClient
    .from(CONTACT_STYLES_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const stylesData = {
    eyebrow_font_family_en: payload.styles.eyebrowFontFamilyEn,
    eyebrow_font_family_th: payload.styles.eyebrowFontFamilyTh,
    eyebrow_font_size: payload.styles.eyebrowFontSize,
    title_font_family_en: payload.styles.titleFontFamilyEn,
    title_font_family_th: payload.styles.titleFontFamilyTh,
    title_font_size: payload.styles.titleFontSize,
    body_font_family_en: payload.styles.bodyFontFamilyEn,
    body_font_family_th: payload.styles.bodyFontFamilyTh,
    body_font_size: payload.styles.bodyFontSize,
    label_font_family_en: payload.styles.labelFontFamilyEn,
    label_font_family_th: payload.styles.labelFontFamilyTh,
    label_font_size: payload.styles.labelFontSize,
    info_font_family_en: payload.styles.infoFontFamilyEn,
    info_font_family_th: payload.styles.infoFontFamilyTh,
    info_font_size: payload.styles.infoFontSize,
    form_label_font_family_en: payload.styles.formLabelFontFamilyEn,
    form_label_font_family_th: payload.styles.formLabelFontFamilyTh,
    form_label_font_size: payload.styles.formLabelFontSize,
    input_font_family_en: payload.styles.inputFontFamilyEn,
    input_font_family_th: payload.styles.inputFontFamilyTh,
    input_font_size: payload.styles.inputFontSize,
    button_font_family_en: payload.styles.buttonFontFamilyEn,
    button_font_family_th: payload.styles.buttonFontFamilyTh,
    button_font_size: payload.styles.buttonFontSize,

    eyebrow_color_light: payload.styles.eyebrowColorLight,
    eyebrow_color_dark: payload.styles.eyebrowColorDark,
    title_color_light: payload.styles.titleColorLight,
    title_color_dark: payload.styles.titleColorDark,
    body_color_light: payload.styles.bodyColorLight,
    body_color_dark: payload.styles.bodyColorDark,
    label_color_light: payload.styles.labelColorLight,
    label_color_dark: payload.styles.labelColorDark,
    info_color_light: payload.styles.infoColorLight,
    info_color_dark: payload.styles.infoColorDark,
    icon_bg_light: payload.styles.iconBgLight,
    icon_bg_dark: payload.styles.iconBgDark,
    icon_color_light: payload.styles.iconColorLight,
    icon_color_dark: payload.styles.iconColorDark,
    
    form_bg_light: payload.styles.formBgLight,
    form_bg_dark: payload.styles.formBgDark,
    form_border_light: payload.styles.formBorderLight,
    form_border_dark: payload.styles.formBorderDark,
    form_label_color_light: payload.styles.formLabelColorLight,
    form_label_color_dark: payload.styles.formLabelColorDark,
    input_bg_light: payload.styles.inputBgLight,
    input_bg_dark: payload.styles.inputBgDark,
    input_border_light: payload.styles.inputBorderLight,
    input_border_dark: payload.styles.inputBorderDark,
    input_text_light: payload.styles.inputTextLight,
    input_text_dark: payload.styles.inputTextDark,
    input_placeholder_light: payload.styles.inputPlaceholderLight,
    input_placeholder_dark: payload.styles.inputPlaceholderDark,
    
    button_bg_light: payload.styles.buttonBgLight,
    button_bg_dark: payload.styles.buttonBgDark,
    button_text_light: payload.styles.buttonTextLight,
    button_text_dark: payload.styles.buttonTextDark,
    
    updated_at: new Date().toISOString(),
  };

  if (existingStyles?.id) {
    const { error } = await supabaseAdminClient
      .from(CONTACT_STYLES_TABLE)
      .update(stylesData)
      .eq("id", existingStyles.id);
    if (error) throw error;
  } else {
    const { error } = await supabaseAdminClient
      .from(CONTACT_STYLES_TABLE)
      .insert(stylesData);
    if (error) throw error;
  }

  // --- SAVE FLOATING SOCIAL ITEMS ---
  await supabaseAdminClient
    .from(FLOATING_SOCIAL_ITEMS_TABLE)
    .delete()
    .gte("order_index", 0);

  const socialItemsToInsert = payload.socialItems.map((item, index) => ({
    id: item.id && isValidUUID(item.id) ? item.id : randomUUID(),
    label: item.label,
    label_th: item.label_th,
    href: item.href,
    icon_svg: item.iconSvg,
    type: item.type,
    bg_color: item.bgColor,
    icon_color: item.iconColor,
    order_index: index,
    updated_at: new Date().toISOString(),
  }));

  if (socialItemsToInsert.length > 0) {
    const { error } = await supabaseAdminClient
      .from(FLOATING_SOCIAL_ITEMS_TABLE)
      .insert(socialItemsToInsert);
    if (error) throw error;
  }

  const diff = buildDiff(beforeContent, payload);
  await logAdminEvent({
    actorId: session.actorId,
    actorLabel,
    action: "update_contact",
    target: "contact",
    result: "success",
    before: beforeContent,
    after: payload,
    diff,
    requestId: requestMeta.requestId,
    sessionId: session.sessionId,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
    geo: requestMeta.geo,
  });

  revalidateTag(CACHE_TAGS.contact, "max");
  return NextResponse.json({ success: true });
}
