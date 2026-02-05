import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";
import type { HomeContent } from "@/lib/supabase/home";
import { getHomeContentUncached } from "@/lib/supabase/home";
import { getAdminActorLabel } from "@/lib/auth/adminAuth";
import { getAdminSessionFromRequest } from "@/lib/auth/adminSession";
import { buildDiff, getRequestMeta, logAdminEvent } from "@/lib/audit/adminAudit";
import {
  HOME_HERO_TABLE,
  HOME_HERO_STYLES_TABLE,
  HOME_HERO_CODE_LINES_TABLE,
  HOME_HERO_CAPABILITIES_TABLE,
  HOME_LOGO_LOOP_SETTINGS_TABLE,
  HOME_LOGO_LOOP_ITEMS_TABLE,
  HOME_MARQUEE_SHOWCASE_TABLE,
  HOME_MARQUEE_STYLES_TABLE,
  HOME_MARQUEE_ITEMS_TABLE,
  HOME_QUOTE_TABLE,
  HOME_QUOTE_STYLES_TABLE,
} from "@/lib/supabase/home";

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
  const beforeContent = await getHomeContentUncached();

  let payload: HomeContent | undefined;
  try {
    const body = await request.json();
    payload = body?.payload;
    if (!payload) {
      throw new Error("Missing home payload");
    }
  } catch (error) {
    console.error("Failed to parse home payload:", error);
    return NextResponse.json(
      { error: "Invalid request body for home save." },
      { status: 400 }
    );
  }

  const { data: existingHero } = await supabaseAdminClient
    .from(HOME_HERO_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const heroData = {
    badge: payload.hero.badge,
    badge_th: payload.hero.badge_th,
    title: payload.hero.title,
    title_th: payload.hero.title_th,
    accent: payload.hero.accent,
    accent_th: payload.hero.accent_th,
    description: payload.hero.description,
    description_th: payload.hero.description_th,
    primary_cta: payload.hero.primaryCta,
    primary_cta_th: payload.hero.primaryCta_th,
    primary_cta_href: payload.hero.primaryCtaHref,
    secondary_cta: payload.hero.secondaryCta,
    secondary_cta_th: payload.hero.secondaryCta_th,
    secondary_cta_href: payload.hero.secondaryCtaHref,
    code_filename: payload.hero.codeFilename,
    status_label: payload.hero.statusLabel,
    status_label_th: payload.hero.statusLabel_th,
    status_value: payload.hero.statusValue,
    status_value_th: payload.hero.statusValue_th,
    updated_at: new Date().toISOString(),
  };

  let heroError;
  if (existingHero?.id) {
    const { error } = await supabaseAdminClient
      .from(HOME_HERO_TABLE)
      .update(heroData)
      .eq("id", existingHero.id);
    heroError = error;
  } else {
    const { error } = await supabaseAdminClient.from(HOME_HERO_TABLE).insert(heroData);
    heroError = error;
  }

  if (heroError) {
    console.error("Supabase home hero save error:", heroError);
    return NextResponse.json({ error: "Failed to save hero content" }, { status: 500 });
  }

  const { data: existingStyles } = await supabaseAdminClient
    .from(HOME_HERO_STYLES_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const stylesData = {
    badge_font_family_en: payload.heroStyles.badgeFontFamilyEn,
    badge_font_family_th: payload.heroStyles.badgeFontFamilyTh,
    badge_font_size: payload.heroStyles.badgeFontSize,
    title_font_family_en: payload.heroStyles.titleFontFamilyEn,
    title_font_family_th: payload.heroStyles.titleFontFamilyTh,
    title_font_size: payload.heroStyles.titleFontSize,
    accent_font_family_en: payload.heroStyles.accentFontFamilyEn,
    accent_font_family_th: payload.heroStyles.accentFontFamilyTh,
    accent_font_size: payload.heroStyles.accentFontSize,
    description_font_family_en: payload.heroStyles.descriptionFontFamilyEn,
    description_font_family_th: payload.heroStyles.descriptionFontFamilyTh,
    description_font_size: payload.heroStyles.descriptionFontSize,
    cta_font_family_en: payload.heroStyles.ctaFontFamilyEn,
    cta_font_family_th: payload.heroStyles.ctaFontFamilyTh,
    cta_font_size: payload.heroStyles.ctaFontSize,
    status_label_font_family_en: payload.heroStyles.statusLabelFontFamilyEn,
    status_label_font_family_th: payload.heroStyles.statusLabelFontFamilyTh,
    status_label_font_size: payload.heroStyles.statusLabelFontSize,
    status_value_font_family_en: payload.heroStyles.statusValueFontFamilyEn,
    status_value_font_family_th: payload.heroStyles.statusValueFontFamilyTh,
    status_value_font_size: payload.heroStyles.statusValueFontSize,
    code_font_family: payload.heroStyles.codeFontFamily,
    code_font_size: payload.heroStyles.codeFontSize,
    badge_text_color_light: payload.heroStyles.badgeTextColorLight,
    badge_text_color_dark: payload.heroStyles.badgeTextColorDark,
    badge_border_color_light: payload.heroStyles.badgeBorderColorLight,
    badge_border_color_dark: payload.heroStyles.badgeBorderColorDark,
    badge_bg_color_light: payload.heroStyles.badgeBgColorLight,
    badge_bg_color_dark: payload.heroStyles.badgeBgColorDark,
    badge_dot_color_light: payload.heroStyles.badgeDotColorLight,
    badge_dot_color_dark: payload.heroStyles.badgeDotColorDark,
    title_color_light: payload.heroStyles.titleColorLight,
    title_color_dark: payload.heroStyles.titleColorDark,
    accent_color_light: payload.heroStyles.accentColorLight,
    accent_color_dark: payload.heroStyles.accentColorDark,
    accent_gradient_enabled_light: payload.heroStyles.accentGradientEnabledLight,
    accent_gradient_enabled_dark: payload.heroStyles.accentGradientEnabledDark,
    accent_gradient_light_start: payload.heroStyles.accentGradientLightStart,
    accent_gradient_light_end: payload.heroStyles.accentGradientLightEnd,
    accent_gradient_dark_start: payload.heroStyles.accentGradientDarkStart,
    accent_gradient_dark_end: payload.heroStyles.accentGradientDarkEnd,
    description_color_light: payload.heroStyles.descriptionColorLight,
    description_color_dark: payload.heroStyles.descriptionColorDark,
    primary_cta_bg_light: payload.heroStyles.primaryCtaBgLight,
    primary_cta_bg_dark: payload.heroStyles.primaryCtaBgDark,
    primary_cta_text_light: payload.heroStyles.primaryCtaTextLight,
    primary_cta_text_dark: payload.heroStyles.primaryCtaTextDark,
    secondary_cta_bg_light: payload.heroStyles.secondaryCtaBgLight,
    secondary_cta_bg_dark: payload.heroStyles.secondaryCtaBgDark,
    secondary_cta_text_light: payload.heroStyles.secondaryCtaTextLight,
    secondary_cta_text_dark: payload.heroStyles.secondaryCtaTextDark,
    secondary_cta_border_light: payload.heroStyles.secondaryCtaBorderLight,
    secondary_cta_border_dark: payload.heroStyles.secondaryCtaBorderDark,
    status_label_color_light: payload.heroStyles.statusLabelColorLight,
    status_label_color_dark: payload.heroStyles.statusLabelColorDark,
    status_value_color_light: payload.heroStyles.statusValueColorLight,
    status_value_color_dark: payload.heroStyles.statusValueColorDark,
    updated_at: new Date().toISOString(),
  };

  let stylesError;
  if (existingStyles?.id) {
    const { error } = await supabaseAdminClient
      .from(HOME_HERO_STYLES_TABLE)
      .update(stylesData)
      .eq("id", existingStyles.id);
    stylesError = error;
  } else {
    const { error } = await supabaseAdminClient
      .from(HOME_HERO_STYLES_TABLE)
      .insert(stylesData);
    stylesError = error;
  }

  if (stylesError) {
    console.error("Supabase home hero styles save error:", stylesError);
    return NextResponse.json({ error: "Failed to save hero styles" }, { status: 500 });
  }

  await supabaseAdminClient
    .from(HOME_HERO_CODE_LINES_TABLE)
    .delete()
    .gte("order_index", 0);

  const codeLinesToInsert = payload.heroCodeLines.map((line, index) => ({
    id: line.id && isValidUUID(line.id) ? line.id : randomUUID(),
    line: line.line,
    order_index: index,
    updated_at: new Date().toISOString(),
  }));

  if (codeLinesToInsert.length > 0) {
    const { error } = await supabaseAdminClient
      .from(HOME_HERO_CODE_LINES_TABLE)
      .insert(codeLinesToInsert);
    if (error) {
      console.error("Supabase home code lines save error:", error);
      return NextResponse.json({ error: "Failed to save hero code lines" }, { status: 500 });
    }
  }

  await supabaseAdminClient
    .from(HOME_HERO_CAPABILITIES_TABLE)
    .delete()
    .gte("order_index", 0);

  const capabilitiesToInsert = payload.heroCapabilities.map((cap, index) => ({
    id: cap.id && isValidUUID(cap.id) ? cap.id : randomUUID(),
    label: cap.label,
    label_th: cap.label_th,
    icon: cap.icon,
    order_index: index,
    updated_at: new Date().toISOString(),
  }));

  if (capabilitiesToInsert.length > 0) {
    const { error } = await supabaseAdminClient
      .from(HOME_HERO_CAPABILITIES_TABLE)
      .insert(capabilitiesToInsert);
    if (error) {
      console.error("Supabase home capabilities save error:", error);
      return NextResponse.json({ error: "Failed to save hero capabilities" }, { status: 500 });
    }
  }

  const { data: existingLogoSettings } = await supabaseAdminClient
    .from(HOME_LOGO_LOOP_SETTINGS_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const logoSettingsData = {
    speed: payload.logoLoopSettings.speed,
    direction: payload.logoLoopSettings.direction,
    gap: payload.logoLoopSettings.gap,
    logo_height: payload.logoLoopSettings.logoHeight,
    fade_out: payload.logoLoopSettings.fadeOut,
    fade_out_color_light: payload.logoLoopSettings.fadeOutColorLight,
    fade_out_color_dark: payload.logoLoopSettings.fadeOutColorDark,
    updated_at: new Date().toISOString(),
  };

  let logoSettingsError;
  if (existingLogoSettings?.id) {
    const { error } = await supabaseAdminClient
      .from(HOME_LOGO_LOOP_SETTINGS_TABLE)
      .update(logoSettingsData)
      .eq("id", existingLogoSettings.id);
    logoSettingsError = error;
  } else {
    const { error } = await supabaseAdminClient
      .from(HOME_LOGO_LOOP_SETTINGS_TABLE)
      .insert(logoSettingsData);
    logoSettingsError = error;
  }

  if (logoSettingsError) {
    console.error("Supabase logo settings save error:", logoSettingsError);
    return NextResponse.json({ error: "Failed to save logo loop settings" }, { status: 500 });
  }

  await supabaseAdminClient
    .from(HOME_LOGO_LOOP_ITEMS_TABLE)
    .delete()
    .gte("order_index", 0);

  const logoItemsToInsert = payload.logoItems.map((item, index) => ({
    id: item.id && isValidUUID(item.id) ? item.id : randomUUID(),
    src: item.src,
    alt: item.alt,
    alt_th: item.alt_th,
    order_index: index,
    updated_at: new Date().toISOString(),
  }));

  if (logoItemsToInsert.length > 0) {
    const { error } = await supabaseAdminClient
      .from(HOME_LOGO_LOOP_ITEMS_TABLE)
      .insert(logoItemsToInsert);
    if (error) {
      console.error("Supabase logo items save error:", error);
      return NextResponse.json({ error: "Failed to save logo loop items" }, { status: 500 });
    }
  }

  // --- MARQUEE SHOWCASE SAVE ---

  const { data: existingMarquee } = await supabaseAdminClient
    .from(HOME_MARQUEE_SHOWCASE_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const marqueeData = {
    badge: payload.marqueeShowcase.badge,
    badge_th: payload.marqueeShowcase.badge_th,
    title: payload.marqueeShowcase.title,
    title_th: payload.marqueeShowcase.title_th,
    highlighted_text: payload.marqueeShowcase.highlightedText,
    highlighted_text_th: payload.marqueeShowcase.highlightedText_th,
    heading_prefix: payload.marqueeShowcase.headingPrefix,
    heading_prefix_th: payload.marqueeShowcase.headingPrefix_th,
    heading_suffix: payload.marqueeShowcase.headingSuffix,
    heading_suffix_th: payload.marqueeShowcase.headingSuffix_th,
    description: payload.marqueeShowcase.description,
    description_th: payload.marqueeShowcase.description_th,
    cta1_text: payload.marqueeShowcase.cta1Text,
    cta1_text_th: payload.marqueeShowcase.cta1Text_th,
    cta1_link: payload.marqueeShowcase.cta1Link,
    cta2_text: payload.marqueeShowcase.cta2Text,
    cta2_text_th: payload.marqueeShowcase.cta2Text_th,
    cta2_link: payload.marqueeShowcase.cta2Link,
    marquee_speed: payload.marqueeShowcase.marqueeSpeed,
    marquee_direction: payload.marqueeShowcase.marqueeDirection,
    marquee_reverse: payload.marqueeShowcase.marqueeReverse,
    updated_at: new Date().toISOString(),
  };

  let marqueeError;
  if (existingMarquee?.id) {
    const { error } = await supabaseAdminClient
      .from(HOME_MARQUEE_SHOWCASE_TABLE)
      .update(marqueeData)
      .eq("id", existingMarquee.id);
    marqueeError = error;
  } else {
    const { error } = await supabaseAdminClient.from(HOME_MARQUEE_SHOWCASE_TABLE).insert(marqueeData);
    marqueeError = error;
  }

  if (marqueeError) {
    console.error("Supabase marquee showcase save error:", marqueeError);
    return NextResponse.json({ error: "Failed to save marquee showcase" }, { status: 500 });
  }

  const { data: existingMarqueeStyles } = await supabaseAdminClient
    .from(HOME_MARQUEE_STYLES_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const marqueeStylesData = {
    badge_font_family_en: payload.marqueeStyles.badgeFontFamilyEn,
    badge_font_family_th: payload.marqueeStyles.badgeFontFamilyTh,
    badge_font_size: payload.marqueeStyles.badgeFontSize,
    badge_color_light: payload.marqueeStyles.badgeColorLight,
    badge_color_dark: payload.marqueeStyles.badgeColorDark,
    title_font_family_en: payload.marqueeStyles.titleFontFamilyEn,
    title_font_family_th: payload.marqueeStyles.titleFontFamilyTh,
    title_font_size: payload.marqueeStyles.titleFontSize,
    title_color_light: payload.marqueeStyles.titleColorLight,
    title_color_dark: payload.marqueeStyles.titleColorDark,
    heading_font_family_en: payload.marqueeStyles.headingFontFamilyEn,
    heading_font_family_th: payload.marqueeStyles.headingFontFamilyTh,
    heading_font_size: payload.marqueeStyles.headingFontSize,
    heading_color_light: payload.marqueeStyles.headingColorLight,
    heading_color_dark: payload.marqueeStyles.headingColorDark,
    highlight_bg_color_light: payload.marqueeStyles.highlightBgColorLight,
    highlight_bg_color_dark: payload.marqueeStyles.highlightBgColorDark,
    highlight_text_color_light: payload.marqueeStyles.highlightTextColorLight,
    highlight_text_color_dark: payload.marqueeStyles.highlightTextColorDark,
    desc_font_family_en: payload.marqueeStyles.descFontFamilyEn,
    desc_font_family_th: payload.marqueeStyles.descFontFamilyTh,
    desc_font_size: payload.marqueeStyles.descFontSize,
    desc_color_light: payload.marqueeStyles.descColorLight,
    desc_color_dark: payload.marqueeStyles.descColorDark,
    cta1_bg_light: payload.marqueeStyles.cta1BgLight,
    cta1_bg_dark: payload.marqueeStyles.cta1BgDark,
    cta1_text_color_light: payload.marqueeStyles.cta1TextColorLight,
    cta1_text_color_dark: payload.marqueeStyles.cta1TextColorDark,
    cta2_bg_light: payload.marqueeStyles.cta2BgLight,
    cta2_bg_dark: payload.marqueeStyles.cta2BgDark,
    cta2_text_color_light: payload.marqueeStyles.cta2TextColorLight,
    cta2_text_color_dark: payload.marqueeStyles.cta2TextColorDark,
    cta2_border_light: payload.marqueeStyles.cta2BorderLight,
    cta2_border_dark: payload.marqueeStyles.cta2BorderDark,
    updated_at: new Date().toISOString(),
  };

  let marqueeStylesError;
  if (existingMarqueeStyles?.id) {
    const { error } = await supabaseAdminClient
      .from(HOME_MARQUEE_STYLES_TABLE)
      .update(marqueeStylesData)
      .eq("id", existingMarqueeStyles.id);
    marqueeStylesError = error;
  } else {
    const { error } = await supabaseAdminClient
      .from(HOME_MARQUEE_STYLES_TABLE)
      .insert(marqueeStylesData);
    marqueeStylesError = error;
  }

  if (marqueeStylesError) {
    console.error("Supabase marquee styles save error:", marqueeStylesError);
    return NextResponse.json({ error: "Failed to save marquee styles" }, { status: 500 });
  }

  await supabaseAdminClient
    .from(HOME_MARQUEE_ITEMS_TABLE)
    .delete()
    .gte("order_index", 0);

  const marqueeItemsToInsert = payload.marqueeItems.map((item, index) => ({
    id: item.id && isValidUUID(item.id) ? item.id : randomUUID(),
    src: item.src,
    alt: item.alt,
    order_index: index,
    updated_at: new Date().toISOString(),
  }));

  if (marqueeItemsToInsert.length > 0) {
    const { error } = await supabaseAdminClient
      .from(HOME_MARQUEE_ITEMS_TABLE)
      .insert(marqueeItemsToInsert);
    if (error) {
      console.error("Supabase marquee items save error:", error);
      return NextResponse.json({ error: "Failed to save marquee items" }, { status: 500 });
    }
  }

  // --- QUOTE SAVE ---

  if (payload.quote) {
    const { data: existingQuote } = await supabaseAdminClient
      .from(HOME_QUOTE_TABLE)
      .select("id")
      .limit(1)
      .maybeSingle();

    const quoteData = {
      body: payload.quote.body,
      body_th: payload.quote.body_th,
      author_name: payload.quote.authorName,
      author_name_th: payload.quote.authorName_th,
      author_role: payload.quote.authorRole,
      author_role_th: payload.quote.authorRole_th,
      icon: payload.quote.icon,
      updated_at: new Date().toISOString(),
    };

    let quoteError;
    if (existingQuote?.id) {
      const { error } = await supabaseAdminClient
        .from(HOME_QUOTE_TABLE)
        .update(quoteData)
        .eq("id", existingQuote.id);
      quoteError = error;
    } else {
      const { error } = await supabaseAdminClient.from(HOME_QUOTE_TABLE).insert(quoteData);
      quoteError = error;
    }

    if (quoteError) {
      console.error("Supabase quote save error:", quoteError);
      return NextResponse.json({ error: "Failed to save quote content" }, { status: 500 });
    }
  }

  if (payload.quoteStyles) {
    const { data: existingQuoteStyles } = await supabaseAdminClient
      .from(HOME_QUOTE_STYLES_TABLE)
      .select("id")
      .limit(1)
      .maybeSingle();

    const quoteStylesData = {
      body_font_family_en: payload.quoteStyles.bodyFontFamilyEn,
      body_font_family_th: payload.quoteStyles.bodyFontFamilyTh,
      body_font_size: payload.quoteStyles.bodyFontSize,
      body_color_light: payload.quoteStyles.bodyColorLight,
      body_color_dark: payload.quoteStyles.bodyColorDark,
      author_font_family_en: payload.quoteStyles.authorFontFamilyEn,
      author_font_family_th: payload.quoteStyles.authorFontFamilyTh,
      author_font_size: payload.quoteStyles.authorFontSize,
      author_color_light: payload.quoteStyles.authorColorLight,
      author_color_dark: payload.quoteStyles.authorColorDark,
      role_font_family_en: payload.quoteStyles.roleFontFamilyEn,
      role_font_family_th: payload.quoteStyles.roleFontFamilyTh,
      role_font_size: payload.quoteStyles.roleFontSize,
      role_color_light: payload.quoteStyles.roleColorLight,
      role_color_dark: payload.quoteStyles.roleColorDark,
      icon_color_light: payload.quoteStyles.iconColorLight,
      icon_color_dark: payload.quoteStyles.iconColorDark,
      section_bg_light: payload.quoteStyles.sectionBgLight,
      section_bg_dark: payload.quoteStyles.sectionBgDark,
      updated_at: new Date().toISOString(),
    };

    let quoteStylesError;
    if (existingQuoteStyles?.id) {
      const { error } = await supabaseAdminClient
        .from(HOME_QUOTE_STYLES_TABLE)
        .update(quoteStylesData)
        .eq("id", existingQuoteStyles.id);
      quoteStylesError = error;
    } else {
      const { error } = await supabaseAdminClient
        .from(HOME_QUOTE_STYLES_TABLE)
        .insert(quoteStylesData);
      quoteStylesError = error;
    }

    if (quoteStylesError) {
      console.error("Supabase quote styles save error:", quoteStylesError);
      return NextResponse.json({ error: "Failed to save quote styles" }, { status: 500 });
    }
  }

  const diff = buildDiff(beforeContent, payload);
  await logAdminEvent({
    actorId: session.actorId,
    actorLabel,
    action: "update_home",
    target: "home",
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

  revalidateTag(CACHE_TAGS.home, "max");
  return NextResponse.json({ success: true });
}
