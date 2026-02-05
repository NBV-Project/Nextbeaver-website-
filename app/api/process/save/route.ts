import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";
import type { ProcessContentBundle } from "@/lib/supabase/process";
import { getProcessContentUncached } from "@/lib/supabase/process";
import { getAdminActorLabel } from "@/lib/auth/adminAuth";
import { getAdminSessionFromRequest } from "@/lib/auth/adminSession";
import { buildDiff, getRequestMeta, logAdminEvent } from "@/lib/audit/adminAudit";
import {
  PROCESS_CONTENT_TABLE,
  PROCESS_STYLES_TABLE,
  PROCESS_STEPS_TABLE,
} from "@/lib/supabase/process";

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
  const beforeContent = await getProcessContentUncached();

  let payload: ProcessContentBundle | undefined;
  try {
    const body = await request.json();
    payload = body?.payload;
    if (!payload) {
      throw new Error("Missing process payload");
    }
  } catch (error) {
    console.error("Failed to parse process payload:", error);
    return NextResponse.json(
      { error: "Invalid request body for process save." },
      { status: 400 }
    );
  }

  const { data: existingContent } = await supabaseAdminClient
    .from(PROCESS_CONTENT_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const contentData = {
    title: payload.content.title,
    title_th: payload.content.title_th,
    subtitle: payload.content.subtitle,
    subtitle_th: payload.content.subtitle_th,
    updated_at: new Date().toISOString(),
  };

  let contentError;
  if (existingContent?.id) {
    const { error } = await supabaseAdminClient
      .from(PROCESS_CONTENT_TABLE)
      .update(contentData)
      .eq("id", existingContent.id);
    contentError = error;
  } else {
    const { error } = await supabaseAdminClient.from(PROCESS_CONTENT_TABLE).insert(contentData);
    contentError = error;
  }

  if (contentError) {
    console.error("Supabase process content save error:", contentError);
    return NextResponse.json({ error: "Failed to save process content" }, { status: 500 });
  }

  const { data: existingStyles } = await supabaseAdminClient
    .from(PROCESS_STYLES_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const stylesData = {
    title_color_light: payload.styles.titleColorLight,
    title_color_dark: payload.styles.titleColorDark,
    title_font_family_en: payload.styles.titleFontFamilyEn,
    title_font_family_th: payload.styles.titleFontFamilyTh,
    title_font_size: payload.styles.titleFontSize,
    subtitle_color_light: payload.styles.subtitleColorLight,
    subtitle_color_dark: payload.styles.subtitleColorDark,
    subtitle_font_family_en: payload.styles.subtitleFontFamilyEn,
    subtitle_font_family_th: payload.styles.subtitleFontFamilyTh,
    subtitle_font_size: payload.styles.subtitleFontSize,
    accent_color_light: payload.styles.accentColorLight,
    accent_color_dark: payload.styles.accentColorDark,
    step_icon_color_light: payload.styles.stepIconColorLight,
    step_icon_color_dark: payload.styles.stepIconColorDark,
    step_number_color_light: payload.styles.stepNumberColorLight,
    step_number_color_dark: payload.styles.stepNumberColorDark,
    step_title_color_light: payload.styles.stepTitleColorLight,
    step_title_color_dark: payload.styles.stepTitleColorDark,
    step_title_font_family_en: payload.styles.stepTitleFontFamilyEn,
    step_title_font_family_th: payload.styles.stepTitleFontFamilyTh,
    step_title_font_size: payload.styles.stepTitleFontSize,
    step_body_color_light: payload.styles.stepBodyColorLight,
    step_body_color_dark: payload.styles.stepBodyColorDark,
    step_body_font_family_en: payload.styles.stepBodyFontFamilyEn,
    step_body_font_family_th: payload.styles.stepBodyFontFamilyTh,
    step_body_font_size: payload.styles.stepBodyFontSize,
    line_base_color_light: payload.styles.lineBaseColorLight,
    line_base_color_dark: payload.styles.lineBaseColorDark,
    line_accent_color_light: payload.styles.lineAccentColorLight,
    line_accent_color_dark: payload.styles.lineAccentColorDark,
    line_dash_color_light: payload.styles.lineDashColorLight,
    line_dash_color_dark: payload.styles.lineDashColorDark,
    line_pulse_duration_desktop: payload.styles.linePulseDurationDesktop,
    line_pulse_duration_mobile: payload.styles.linePulseDurationMobile,
    line_dash_duration_desktop: payload.styles.lineDashDurationDesktop,
    line_dash_duration_mobile: payload.styles.lineDashDurationMobile,
    updated_at: new Date().toISOString(),
  };

  let stylesError;
  if (existingStyles?.id) {
    const { error } = await supabaseAdminClient
      .from(PROCESS_STYLES_TABLE)
      .update(stylesData)
      .eq("id", existingStyles.id);
    stylesError = error;
  } else {
    const { error } = await supabaseAdminClient.from(PROCESS_STYLES_TABLE).insert(stylesData);
    stylesError = error;
  }

  if (stylesError) {
    console.error("Supabase process styles save error:", stylesError);
    return NextResponse.json({ error: "Failed to save process styles" }, { status: 500 });
  }

  await supabaseAdminClient.from(PROCESS_STEPS_TABLE).delete().gte("order_index", 0);

  const stepsToInsert = payload.steps.map((item, index) => ({
    id: item.id && isValidUUID(item.id) ? item.id : randomUUID(),
    number: item.number,
    title: item.title,
    title_th: item.title_th,
    body: item.body,
    body_th: item.body_th,
    icon: item.icon,
    icon_color_light: item.iconColorLight,
    icon_color_dark: item.iconColorDark,
    highlight: item.highlight ?? false,
    offset_class: item.offsetClass,
    title_color_light: item.titleColorLight,
    title_color_dark: item.titleColorDark,
    title_font_family_en: item.titleFontFamilyEn,
    title_font_family_th: item.titleFontFamilyTh,
    title_font_size: item.titleFontSize,
    body_color_light: item.bodyColorLight,
    body_color_dark: item.bodyColorDark,
    body_font_family_en: item.bodyFontFamilyEn,
    body_font_family_th: item.bodyFontFamilyTh,
    body_font_size: item.bodyFontSize,
    order_index: index,
    updated_at: new Date().toISOString(),
  }));

  if (stepsToInsert.length > 0) {
    const { error } = await supabaseAdminClient.from(PROCESS_STEPS_TABLE).insert(stepsToInsert);
    if (error) {
      console.error("Supabase process steps save error:", error);
      return NextResponse.json({ error: "Failed to save process steps" }, { status: 500 });
    }
  }

  const diff = buildDiff(beforeContent, payload);
  await logAdminEvent({
    actorId: session.actorId,
    actorLabel,
    action: "update_process",
    target: "process",
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

  revalidateTag(CACHE_TAGS.process, "max");
  return NextResponse.json({ success: true });
}
