import "server-only";
import crypto from "crypto";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { getAdminActorLabel } from "@/lib/auth/adminAuth";
import { parseAdminSession } from "@/lib/auth/adminSession";

export type AdminAuditAction =
  | "login_success"
  | "login_failed"
  | "lockout"
  | "rate_limit"
  | "update_home"
  | "update_about"
  | "update_services"
  | "update_portfolio"
  | "update_process"
  | "update_contact"
  | "update_faq"
  | "upload_portfolio_asset";

export type AdminAuditResult = "success" | "failed" | "blocked";

export type AdminAuditEvent = {
  actorId: string;
  actorLabel: string;
  action: AdminAuditAction;
  target: string;
  result: AdminAuditResult;
  before?: unknown;
  after?: unknown;
  diff?: unknown;
  requestId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  geo?: Record<string, string | null>;
  attempts?: number;
  metadata?: Record<string, unknown>;
};

export type RequestMeta = {
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  geo?: Record<string, string | null>;
};

const LOG_TABLE = "admin_audit_log";

export function getRequestMeta(request: Request): RequestMeta {
  const headers = request.headers;
  const ipAddress =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    undefined;
  const userAgent = headers.get("user-agent") || undefined;
  const requestId =
    headers.get("x-request-id") ||
    headers.get("x-vercel-id") ||
    headers.get("cf-ray") ||
    undefined;

  const geo = {
    country: headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry"),
    city: headers.get("x-vercel-ip-city"),
    region: headers.get("x-vercel-ip-region"),
  };

  return { ipAddress, userAgent, requestId, geo };
}

export async function getSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  const value = match?.[1] ? decodeURIComponent(match[1]) : null;
  return parseAdminSession(value);
}

export function buildDiff(before: unknown, after: unknown) {
  const changes: Array<{ path: string; before: unknown; after: unknown }> = [];

  const walk = (prev: unknown, next: unknown, path: string) => {
    if (prev === next) return;
    if (typeof prev !== "object" || prev === null || typeof next !== "object" || next === null) {
      changes.push({ path, before: prev, after: next });
      return;
    }

    const prevObj = prev as Record<string, unknown>;
    const nextObj = next as Record<string, unknown>;
    const keys = new Set([...Object.keys(prevObj), ...Object.keys(nextObj)]);
    for (const key of keys) {
      walk(prevObj[key], nextObj[key], path ? `${path}.${key}` : key);
    }
  };

  walk(before, after, "");
  return changes;
}

export async function logAdminEvent(event: AdminAuditEvent) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return;

  await supabase.from(LOG_TABLE).insert({
    actor_id: event.actorId,
    actor_label: event.actorLabel,
    action: event.action,
    target: event.target,
    result: event.result,
    before_data: event.before ?? null,
    after_data: event.after ?? null,
    diff_data: event.diff ?? null,
    request_id: event.requestId ?? null,
    session_id: event.sessionId ?? null,
    ip_address: event.ipAddress ?? null,
    user_agent: event.userAgent ?? null,
    geo: event.geo ?? null,
    attempts: event.attempts ?? null,
    metadata: event.metadata ?? null,
  });
}

export async function getRecentFailedLoginCount(ipAddress?: string, minutes = 15) {
  if (!ipAddress) return 0;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return 0;
  const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();
  const { count, error } = await supabase
    .from(LOG_TABLE)
    .select("id", { count: "exact", head: true })
    .eq("action", "login_failed")
    .eq("ip_address", ipAddress)
    .gte("created_at", since);
  if (error) return 0;
  return count ?? 0;
}

export function getActorLabel(actorId: string) {
  return getAdminActorLabel(actorId);
}

export function createRequestHash(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}
