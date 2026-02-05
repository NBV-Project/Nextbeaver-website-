import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";
import type { PortfolioContent } from "@/lib/supabase/portfolio";
import {
  getPortfolioContentUncached,
  PORTFOLIO_HERO_TABLE,
  PORTFOLIO_PROJECTS_TABLE,
} from "@/lib/supabase/portfolio";
import { getAdminActorLabel } from "@/lib/auth/adminAuth";
import { getAdminSessionFromRequest } from "@/lib/auth/adminSession";
import { buildDiff, getRequestMeta, logAdminEvent } from "@/lib/audit/adminAudit";

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
  const beforeContent = await getPortfolioContentUncached();

  let payload: PortfolioContent | undefined;
  try {
    const body = await request.json();
    payload = body?.payload;
    if (!payload) {
      throw new Error("Missing portfolio payload");
    }
  } catch (error) {
    console.error("Failed to parse portfolio payload:", error);
    return NextResponse.json(
      { error: "Invalid request body for portfolio save." },
      { status: 400 }
    );
  }

  // 1. Upsert Hero
  const { data: existingHero } = await supabaseAdminClient
    .from(PORTFOLIO_HERO_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const heroData = {
    title: payload.hero.title,
    title_th: payload.hero.title_th,
    accent: payload.hero.accent,
    accent_th: payload.hero.accent_th,
    description: payload.hero.description,
    description_th: payload.hero.description_th,
    styles: payload.hero.styles,
    updated_at: new Date().toISOString(),
  };

  let heroError;
  if (existingHero?.id) {
    const { error } = await supabaseAdminClient
      .from(PORTFOLIO_HERO_TABLE)
      .update(heroData)
      .eq("id", existingHero.id);
    heroError = error;
  } else {
    const { error } = await supabaseAdminClient
      .from(PORTFOLIO_HERO_TABLE)
      .insert(heroData);
    heroError = error;
  }

  if (heroError) {
    console.error("Supabase hero save error:", heroError);
    return NextResponse.json({ error: "Failed to save hero section" }, { status: 500 });
  }

  // 2. Sync Projects
  const projectsToUpsert = payload.projects.map((p, index) => ({
    id: p.id && isValidUUID(p.id) ? p.id : randomUUID(),
    title: p.title,
    title_th: p.title_th,
    description: p.description,
    description_th: p.description_th,
    image: p.image,
    link: p.link,
    breadcrumbs: p.breadcrumbs,
    breadcrumbs_th: p.breadcrumbs_th,
    details: p.details,
    details_th: p.details_th,
    tech: p.tech,
    gallery: p.gallery,
    styles: p.styles,
    order_index: index,
    updated_at: new Date().toISOString(),
  }));

  if (projectsToUpsert.length > 0) {
    const { error: upsertError } = await supabaseAdminClient
      .from(PORTFOLIO_PROJECTS_TABLE)
      .upsert(projectsToUpsert, { onConflict: "id" });

    if (upsertError) {
      console.error("Supabase projects upsert error:", upsertError);
      return NextResponse.json({ error: "Failed to save projects" }, { status: 500 });
    }
  }

  // 3. Delete removed projects
  const activeIds = projectsToUpsert.map((p) => p.id);
  
  if (activeIds.length > 0) {
    const { error: deleteError } = await supabaseAdminClient
      .from(PORTFOLIO_PROJECTS_TABLE)
      .delete()
      .not("id", "in", `(${activeIds.map(id => `"${id}"`).join(',')})`);
      
    if (deleteError) {
       console.error("Supabase projects delete error:", deleteError);
    }
  } else {
    // If no active projects, delete all
    const { error: deleteError } = await supabaseAdminClient
      .from(PORTFOLIO_PROJECTS_TABLE)
      .delete()
      .gte("order_index", 0);
      
    if (deleteError) {
       console.error("Supabase projects clear error:", deleteError);
    }
  }

  const diff = buildDiff(beforeContent, payload);
  await logAdminEvent({
    actorId: session.actorId,
    actorLabel,
    action: "update_portfolio",
    target: "portfolio",
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

  revalidateTag(CACHE_TAGS.portfolio, "max");
  return NextResponse.json({ success: true });
}
