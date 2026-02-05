import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";
import type { AboutContentBundle } from "@/lib/supabase/about";
import { getAboutContentUncached } from "@/lib/supabase/about";
import { getAdminActorLabel } from "@/lib/auth/adminAuth";
import { getAdminSessionFromRequest } from "@/lib/auth/adminSession";
import { buildDiff, getRequestMeta, logAdminEvent } from "@/lib/audit/adminAudit";
import {
  ABOUT_BODY_TABLE,
  ABOUT_CONTENT_TABLE,
  ABOUT_PILLARS_TABLE,
  ABOUT_STYLES_TABLE,
} from "@/lib/supabase/about";

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
  const beforeContent = await getAboutContentUncached();

  let payload: AboutContentBundle | undefined;
  try {
    const body = await request.json();
    payload = body?.payload;
    if (!payload) {
      throw new Error("Missing about payload");
    }
  } catch (error) {
    console.error("Failed to parse about payload:", error);
    return NextResponse.json(
      { error: "Invalid request body for about save." },
      { status: 400 }
    );
  }

  const { data: existingContent } = await supabaseAdminClient
    .from(ABOUT_CONTENT_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const contentData = {
    image_url: payload.content.imageUrl,
    image_alt: payload.content.imageAlt,
    image_alt_th: payload.content.imageAlt_th,
    highlight_value: payload.content.highlightValue,
    highlight_label: payload.content.highlightLabel,
    highlight_label_th: payload.content.highlightLabel_th,
    eyebrow: payload.content.eyebrow,
    eyebrow_th: payload.content.eyebrow_th,
    title: payload.content.title,
    title_th: payload.content.title_th,
    title_accent: payload.content.titleAccent,
    title_accent_th: payload.content.titleAccent_th,
    updated_at: new Date().toISOString(),
  };

  let contentError;
  if (existingContent?.id) {
    const { error } = await supabaseAdminClient
      .from(ABOUT_CONTENT_TABLE)
      .update(contentData)
      .eq("id", existingContent.id);
    contentError = error;
  } else {
    const { error } = await supabaseAdminClient.from(ABOUT_CONTENT_TABLE).insert(contentData);
    contentError = error;
  }

  if (contentError) {
    console.error("Supabase about content save error:", contentError);
    return NextResponse.json({ error: "Failed to save about content" }, { status: 500 });
  }

  const { data: existingStyles } = await supabaseAdminClient
    .from(ABOUT_STYLES_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const stylesData = {
    image_overlay_color_light: payload.styles.imageOverlayColorLight,
    image_overlay_color_dark: payload.styles.imageOverlayColorDark,
    highlight_bg_color_light: payload.styles.highlightBgColorLight,
    highlight_bg_color_dark: payload.styles.highlightBgColorDark,
    highlight_value_color_light: payload.styles.highlightValueColorLight,
    highlight_value_color_dark: payload.styles.highlightValueColorDark,
    highlight_label_color_light: payload.styles.highlightLabelColorLight,
    highlight_label_color_dark: payload.styles.highlightLabelColorDark,
    highlight_value_font_family_en: payload.styles.highlightValueFontFamilyEn,
    highlight_value_font_family_th: payload.styles.highlightValueFontFamilyTh,
    highlight_value_font_size: payload.styles.highlightValueFontSize,
    highlight_label_font_family_en: payload.styles.highlightLabelFontFamilyEn,
    highlight_label_font_family_th: payload.styles.highlightLabelFontFamilyTh,
    highlight_label_font_size: payload.styles.highlightLabelFontSize,
    eyebrow_color_light: payload.styles.eyebrowColorLight,
    eyebrow_color_dark: payload.styles.eyebrowColorDark,
    eyebrow_font_family_en: payload.styles.eyebrowFontFamilyEn,
    eyebrow_font_family_th: payload.styles.eyebrowFontFamilyTh,
    eyebrow_font_size: payload.styles.eyebrowFontSize,
    title_color_light: payload.styles.titleColorLight,
    title_color_dark: payload.styles.titleColorDark,
    title_font_family_en: payload.styles.titleFontFamilyEn,
    title_font_family_th: payload.styles.titleFontFamilyTh,
    title_font_size: payload.styles.titleFontSize,
    title_accent_color_light: payload.styles.titleAccentColorLight,
    title_accent_color_dark: payload.styles.titleAccentColorDark,
    title_accent_font_family_en: payload.styles.titleAccentFontFamilyEn,
    title_accent_font_family_th: payload.styles.titleAccentFontFamilyTh,
    title_accent_font_size: payload.styles.titleAccentFontSize,
    body_color_light: payload.styles.bodyColorLight,
    body_color_dark: payload.styles.bodyColorDark,
    body_font_family_en: payload.styles.bodyFontFamilyEn,
    body_font_family_th: payload.styles.bodyFontFamilyTh,
    body_font_size: payload.styles.bodyFontSize,
    pillar_title_color_light: payload.styles.pillarTitleColorLight,
    pillar_title_color_dark: payload.styles.pillarTitleColorDark,
    pillar_title_font_family_en: payload.styles.pillarTitleFontFamilyEn,
    pillar_title_font_family_th: payload.styles.pillarTitleFontFamilyTh,
    pillar_title_font_size: payload.styles.pillarTitleFontSize,
    pillar_body_color_light: payload.styles.pillarBodyColorLight,
    pillar_body_color_dark: payload.styles.pillarBodyColorDark,
    pillar_body_font_family_en: payload.styles.pillarBodyFontFamilyEn,
    pillar_body_font_family_th: payload.styles.pillarBodyFontFamilyTh,
    pillar_body_font_size: payload.styles.pillarBodyFontSize,
    updated_at: new Date().toISOString(),
  };

  let stylesError;
  if (existingStyles?.id) {
    const { error } = await supabaseAdminClient
      .from(ABOUT_STYLES_TABLE)
      .update(stylesData)
      .eq("id", existingStyles.id);
    stylesError = error;
  } else {
    const { error } = await supabaseAdminClient.from(ABOUT_STYLES_TABLE).insert(stylesData);
    stylesError = error;
  }

  if (stylesError) {
    console.error("Supabase about styles save error:", stylesError);
    return NextResponse.json({ error: "Failed to save about styles" }, { status: 500 });
  }

  await supabaseAdminClient.from(ABOUT_BODY_TABLE).delete().gte("order_index", 0);

  const bodyToInsert = payload.body.map((item, index) => ({
    id: item.id && isValidUUID(item.id) ? item.id : randomUUID(),
    text: item.text,
    text_th: item.text_th,
    order_index: index,
    updated_at: new Date().toISOString(),
  }));

  if (bodyToInsert.length > 0) {
    const { error } = await supabaseAdminClient.from(ABOUT_BODY_TABLE).insert(bodyToInsert);
    if (error) {
      console.error("Supabase about body save error:", error);
      return NextResponse.json({ error: "Failed to save about body" }, { status: 500 });
    }
  }

  await supabaseAdminClient.from(ABOUT_PILLARS_TABLE).delete().gte("order_index", 0);

  const pillarsToInsert = payload.pillars.map((item, index) => ({
    id: item.id && isValidUUID(item.id) ? item.id : randomUUID(),
    title: item.title,
    title_th: item.title_th,
    body: item.body,
    body_th: item.body_th,
    order_index: index,
    updated_at: new Date().toISOString(),
  }));

  if (pillarsToInsert.length > 0) {
    const { error } = await supabaseAdminClient.from(ABOUT_PILLARS_TABLE).insert(pillarsToInsert);
    if (error) {
      console.error("Supabase about pillars save error:", error);
      return NextResponse.json({ error: "Failed to save about pillars" }, { status: 500 });
    }
  }

  const diff = buildDiff(beforeContent, payload);
  await logAdminEvent({
    actorId: session.actorId,
    actorLabel,
    action: "update_about",
    target: "about",
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

  revalidateTag(CACHE_TAGS.about, "max");
  return NextResponse.json({ success: true });
}
