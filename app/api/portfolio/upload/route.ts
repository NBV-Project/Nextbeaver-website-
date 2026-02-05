import { NextResponse } from "next/server";

import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getAdminActorLabel } from "@/lib/auth/adminAuth";
import { getAdminSessionFromRequest } from "@/lib/auth/adminSession";
import { getRequestMeta, logAdminEvent } from "@/lib/audit/adminAudit";

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "portfolio-assets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const sanitizeFileName = (input: string) =>
  input
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\-+|\-+$/g, "");

export async function POST(request: Request) {
  const supabaseAdminClient = getSupabaseAdminClient();
  if (!supabaseAdminClient) {
    return NextResponse.json(
      { error: "Supabase service role key is not configured." },
      { status: 500 }
    );
  }

  const session = await getAdminSessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const actorLabel = getAdminActorLabel(session.actorId);
  const requestMeta = getRequestMeta(request);

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "File is required." }, { status: 400 });
  }

  const bucketFromBody = formData.get("bucket");
  const bucket = typeof bucketFromBody === "string" && bucketFromBody.trim()
    ? bucketFromBody.trim()
    : DEFAULT_BUCKET;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileName = sanitizeFileName(file.name || `upload-${Date.now()}`);
  const path = `${Date.now()}-${fileName}`;

  const { error } = await supabaseAdminClient.storage
    .from(bucket)
    .upload(path, buffer, {
      upsert: true,
      cacheControl: `${60 * 60 * 24}`,
      contentType: file.type || undefined,
    });

  if (error) {
    console.error("Storage upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: publicData } = supabaseAdminClient.storage
    .from(bucket)
    .getPublicUrl(path);

  if (!publicData?.publicUrl) {
    return NextResponse.json({ error: "Could not generate public URL." }, { status: 500 });
  }

  await logAdminEvent({
    actorId: session.actorId,
    actorLabel,
    action: "upload_portfolio_asset",
    target: `portfolio.asset:${path}`,
    result: "success",
    requestId: requestMeta.requestId,
    sessionId: session.sessionId,
    ipAddress: requestMeta.ipAddress,
    userAgent: requestMeta.userAgent,
    geo: requestMeta.geo,
    metadata: {
      bucket,
      fileName: file.name,
      storedPath: path,
      publicUrl: publicData.publicUrl,
      contentType: file.type || undefined,
      size: file.size,
    },
  });

  return NextResponse.json({ url: publicData.publicUrl });
}
