import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";
import type { ServicesData } from "@/lib/supabase/services";
import { getServicesContentUncached } from "@/lib/supabase/services";
import { getAdminActorLabel } from "@/lib/auth/adminAuth";
import { getAdminSessionFromRequest } from "@/lib/auth/adminSession";
import { buildDiff, getRequestMeta, logAdminEvent } from "@/lib/audit/adminAudit";
import {
  SERVICES_CONTENT_TABLE,
  SERVICES_STYLES_TABLE,
  SERVICES_ITEMS_TABLE,
} from "@/lib/supabase/services";

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
  const beforeContent = await getServicesContentUncached();

  let payload: ServicesData | undefined;
  try {
    const body = await request.json();
    payload = body?.payload;
    if (!payload) {
      throw new Error("Missing services payload");
    }
  } catch (error) {
    console.error("Failed to parse services payload:", error);
    return NextResponse.json(
      { error: "Invalid request body for services save." },
      { status: 400 }
    );
  }

  // --- Save Content ---
  const { data: existingContent } = await supabaseAdminClient
    .from(SERVICES_CONTENT_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const contentData = {
    eyebrow: payload.content.eyebrow,
    eyebrow_th: payload.content.eyebrow_th,
    title: payload.content.title,
    title_th: payload.content.title_th,
    view_all: payload.content.viewAll,
    view_all_th: payload.content.viewAll_th,
    explore: payload.content.explore,
    explore_th: payload.content.explore_th,
    updated_at: new Date().toISOString(),
  };

  let contentError;
  if (existingContent?.id) {
    const { error } = await supabaseAdminClient
      .from(SERVICES_CONTENT_TABLE)
      .update(contentData)
      .eq("id", existingContent.id);
    contentError = error;
  } else {
    const { error } = await supabaseAdminClient
      .from(SERVICES_CONTENT_TABLE)
      .insert(contentData);
    contentError = error;
  }

  if (contentError) {
    console.error("Supabase services content save error:", contentError);
    return NextResponse.json({ error: "Failed to save services content" }, { status: 500 });
  }

  // --- Save Styles ---
  const { data: existingStyles } = await supabaseAdminClient
    .from(SERVICES_STYLES_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const stylesData = {
    eyebrow_font_family_en: payload.styles.eyebrowFontFamilyEn,
    eyebrow_font_family_th: payload.styles.eyebrowFontFamilyTh,
    eyebrow_font_size: payload.styles.eyebrowFontSize,
    eyebrow_color_light: payload.styles.eyebrowColorLight,
    eyebrow_color_dark: payload.styles.eyebrowColorDark,
    
    title_font_family_en: payload.styles.titleFontFamilyEn,
    title_font_family_th: payload.styles.titleFontFamilyTh,
    title_font_size: payload.styles.titleFontSize,
    title_color_light: payload.styles.titleColorLight,
    title_color_dark: payload.styles.titleColorDark,
    
    card_bg_light: payload.styles.cardBgLight,
    card_bg_dark: payload.styles.cardBgDark,
    card_border_light: payload.styles.cardBorderLight,
    card_border_dark: payload.styles.cardBorderDark,
    
    card_icon_color_light: payload.styles.cardIconColorLight,
    card_icon_color_dark: payload.styles.cardIconColorDark,
    card_icon_bg_light: payload.styles.cardIconBgLight,
    card_icon_bg_dark: payload.styles.cardIconBgDark,
    
    card_title_font_family_en: payload.styles.cardTitleFontFamilyEn,
    card_title_font_family_th: payload.styles.cardTitleFontFamilyTh,
    card_title_font_size: payload.styles.cardTitleFontSize,
    card_title_color_light: payload.styles.cardTitleColorLight,
    card_title_color_dark: payload.styles.cardTitleColorDark,
    
    card_body_font_family_en: payload.styles.cardBodyFontFamilyEn,
    card_body_font_family_th: payload.styles.cardBodyFontFamilyTh,
    card_body_font_size: payload.styles.cardBodyFontSize,
    card_body_color_light: payload.styles.cardBodyColorLight,
    card_body_color_dark: payload.styles.cardBodyColorDark,
    
    explore_font_family_en: payload.styles.exploreFontFamilyEn,
    explore_font_family_th: payload.styles.exploreFontFamilyTh,
    explore_font_size: payload.styles.exploreFontSize,
    explore_color_light: payload.styles.exploreColorLight,
    explore_color_dark: payload.styles.exploreColorDark,

    updated_at: new Date().toISOString(),
  };

  let stylesError;
  if (existingStyles?.id) {
    const { error } = await supabaseAdminClient
      .from(SERVICES_STYLES_TABLE)
      .update(stylesData)
      .eq("id", existingStyles.id);
    stylesError = error;
  } else {
    const { error } = await supabaseAdminClient
      .from(SERVICES_STYLES_TABLE)
      .insert(stylesData);
    stylesError = error;
  }

  if (stylesError) {
    console.error("Supabase services styles save error:", stylesError);
    return NextResponse.json({ error: "Failed to save services styles" }, { status: 500 });
  }

  // --- Save Items (Delete & Insert) ---
  await supabaseAdminClient
    .from(SERVICES_ITEMS_TABLE)
    .delete()
    .gte("order_index", 0);

  const itemsToInsert = payload.items.map((item, index) => ({
    id: item.id && isValidUUID(item.id) ? item.id : randomUUID(),
    icon_type: item.iconType,
    icon_value: item.iconValue,
    title: item.title,
    title_th: item.title_th,
    body: item.body,
    body_th: item.body_th,
    features: item.features, // JSON array
    modal_plans: item.modalPlans, // JSON array
    order_index: index,
    updated_at: new Date().toISOString(),
  }));

  if (itemsToInsert.length > 0) {
    const { error } = await supabaseAdminClient
      .from(SERVICES_ITEMS_TABLE)
      .insert(itemsToInsert);
    if (error) {
      console.error("Supabase services items save error:", error);
      return NextResponse.json({ error: "Failed to save services items" }, { status: 500 });
    }
  }

  const diff = buildDiff(beforeContent, payload);
  await logAdminEvent({
    actorId: session.actorId,
    actorLabel,
    action: "update_services",
    target: "services",
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

  revalidateTag(CACHE_TAGS.services, "max");
  return NextResponse.json({ success: true });
}
