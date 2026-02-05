import { NextResponse } from "next/server";
import {
  verifyAdminCode,
} from "@/lib/auth/adminAuth";
import { createAdminSessionValue, getAdminSessionCookieOptions } from "@/lib/auth/adminSession";
import {
  createRequestHash,
  getRecentFailedLoginCount,
  getRequestMeta,
  logAdminEvent,
} from "@/lib/audit/adminAudit";

type RateLimitState = {
  count: number;
  firstAttemptAt: number;
  blockedUntil?: number;
};

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const BASE_DELAY_MS = 400;
const MAX_DELAY_MS = 2500;

const rateLimitStore: Map<string, RateLimitState> =
  (globalThis as { __adminRateLimit?: Map<string, RateLimitState> }).__adminRateLimit ??
  new Map<string, RateLimitState>();

if (!(globalThis as { __adminRateLimit?: Map<string, RateLimitState> }).__adminRateLimit) {
  (globalThis as { __adminRateLimit?: Map<string, RateLimitState> }).__adminRateLimit = rateLimitStore;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getRateState(key: string): RateLimitState {
  const now = Date.now();
  const existing = rateLimitStore.get(key);
  if (!existing) {
    const fresh = { count: 0, firstAttemptAt: now } satisfies RateLimitState;
    rateLimitStore.set(key, fresh);
    return fresh;
  }

  if (now - existing.firstAttemptAt > RATE_LIMIT_WINDOW_MS) {
    const reset = { count: 0, firstAttemptAt: now } satisfies RateLimitState;
    rateLimitStore.set(key, reset);
    return reset;
  }

  return existing;
}

export async function POST(request: Request) {
  const meta = getRequestMeta(request);
  const ipKey = meta.ipAddress || "unknown";
  const state = getRateState(ipKey);
  const now = Date.now();

  if (state.blockedUntil && now < state.blockedUntil) {
    await logAdminEvent({
      actorId: "unknown",
      actorLabel: "Unknown",
      action: "lockout",
      target: "admin.login",
      result: "blocked",
      requestId: meta.requestId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      geo: meta.geo,
      attempts: state.count,
      metadata: { blockedUntil: state.blockedUntil },
    });
    return NextResponse.json({ ok: false, error: "Too many attempts" }, { status: 429 });
  }

  const failedCount = await getRecentFailedLoginCount(meta.ipAddress);
  if (failedCount >= MAX_ATTEMPTS) {
    await logAdminEvent({
      actorId: "unknown",
      actorLabel: "Unknown",
      action: "lockout",
      target: "admin.login",
      result: "blocked",
      requestId: meta.requestId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      geo: meta.geo,
      attempts: failedCount,
    });
    return NextResponse.json({ ok: false, error: "Too many attempts" }, { status: 429 });
  }

  const body = await request.json().catch(() => ({}));
  const code = typeof body?.password === "string" ? body.password.trim() : "";

  if (!code || code.length !== 13) {
    state.count += 1;
    if (state.count >= MAX_ATTEMPTS) {
      state.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
    }
    const delay = Math.min(BASE_DELAY_MS + state.count * 250, MAX_DELAY_MS);
    await sleep(delay);
    await logAdminEvent({
      actorId: "unknown",
      actorLabel: "Unknown",
      action: "login_failed",
      target: "admin.login",
      result: "failed",
      requestId: meta.requestId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      geo: meta.geo,
      attempts: failedCount + 1,
      metadata: { reason: "invalid_length" },
    });
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const actor = verifyAdminCode(code);
  if (!actor) {
    state.count += 1;
    if (state.count >= MAX_ATTEMPTS) {
      state.blockedUntil = now + RATE_LIMIT_WINDOW_MS;
    }
    const delay = Math.min(BASE_DELAY_MS + state.count * 250, MAX_DELAY_MS);
    await sleep(delay);
    await logAdminEvent({
      actorId: "unknown",
      actorLabel: "Unknown",
      action: "login_failed",
      target: "admin.login",
      result: "failed",
      requestId: meta.requestId,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
      geo: meta.geo,
      attempts: failedCount + 1,
      metadata: { reason: "invalid_code" },
    });
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  rateLimitStore.delete(ipKey);
  const sessionValue = await createAdminSessionValue(actor.id);
  if (!sessionValue) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", sessionValue, getAdminSessionCookieOptions());
  await logAdminEvent({
    actorId: actor.id,
    actorLabel: actor.label,
    action: "login_success",
    target: "admin.login",
    result: "success",
    requestId: meta.requestId,
    sessionId: createRequestHash(sessionValue),
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    geo: meta.geo,
    metadata: { sessionIssuedAt: Date.now() },
  });
  return response;
}
