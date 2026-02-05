import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { revalidateTag } from "next/cache";

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";
import type { FaqContentBundle } from "@/lib/supabase/faq";
import { getFaqContentUncached, FAQ_CONTENT_TABLE, FAQ_ITEMS_TABLE } from "@/lib/supabase/faq";
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
      { error: "Supabase service role key is not configured. Set SUPABASE_SERVICE_ROLE_KEY." },
      { status: 500 }
    );
  }

  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const actorLabel = getAdminActorLabel(session.actorId);
  const requestMeta = getRequestMeta(request);
  const beforeContent = await getFaqContentUncached();

  let payload: FaqContentBundle | undefined;
  try {
    const body = await request.json();
    payload = body?.payload;
    if (!payload) {
      throw new Error("Missing FAQ payload");
    }
  } catch (error) {
    console.error("Failed to parse FAQ payload:", error);
    return NextResponse.json({ error: "Invalid request body for FAQ save." }, { status: 400 });
  }

  const { data: existingContent } = await supabaseAdminClient
    .from(FAQ_CONTENT_TABLE)
    .select("id")
    .limit(1)
    .maybeSingle();

  const contentData = {
    eyebrow: payload.content.eyebrow,
    eyebrow_th: payload.content.eyebrow_th,
    title: payload.content.title,
    title_th: payload.content.title_th,
    updated_at: new Date().toISOString(),
  };

  let contentError;
  if (existingContent?.id) {
    const { error } = await supabaseAdminClient
      .from(FAQ_CONTENT_TABLE)
      .update(contentData)
      .eq("id", existingContent.id);
    contentError = error;
  } else {
    const { error } = await supabaseAdminClient
      .from(FAQ_CONTENT_TABLE)
      .insert(contentData);
    contentError = error;
  }

  if (contentError) {
    console.error("Supabase FAQ content save error:", contentError);
    return NextResponse.json({ error: "Failed to save FAQ content" }, { status: 500 });
  }

  await supabaseAdminClient.from(FAQ_ITEMS_TABLE).delete().gte("order_index", 0);

  const itemsToInsert = payload.items.map((item, index) => ({
    id: item.id && isValidUUID(item.id) ? item.id : randomUUID(),
    question: item.question,
    question_th: item.question_th,
    answer: item.answer,
    answer_th: item.answer_th,
    order_index: index,
    updated_at: new Date().toISOString(),
  }));

  if (itemsToInsert.length > 0) {
    const { error } = await supabaseAdminClient.from(FAQ_ITEMS_TABLE).insert(itemsToInsert);
    if (error) {
      console.error("Supabase FAQ items save error:", error);
      return NextResponse.json({ error: "Failed to save FAQ items" }, { status: 500 });
    }
  }

  const diff = buildDiff(beforeContent, payload);
  await logAdminEvent({
    actorId: session.actorId,
    actorLabel,
    action: "update_faq",
    target: "faq",
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

  revalidateTag(CACHE_TAGS.faq, "max");
  return NextResponse.json({ success: true });
}
