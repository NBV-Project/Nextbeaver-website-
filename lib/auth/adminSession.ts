type AdminSession = {
  actorId: string;
  issuedAt: number;
  sessionId: string;
};

const ADMIN_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD_HASH || "";
const ADMIN_SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;
const ADMIN_SESSION_ROTATE_AFTER_MS = 15 * 60 * 1000;

const textEncoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 =
    typeof btoa === "function"
      ? btoa(binary)
      : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary =
    typeof atob === "function"
      ? atob(padded)
      : Buffer.from(padded, "base64").toString("binary");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

function createNonce() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

function createSessionPayload(actorId: string, issuedAt: number) {
  const raw = JSON.stringify({ actorId, issuedAt, nonce: createNonce() });
  return toBase64Url(textEncoder.encode(raw));
}

async function signPayload(payload: string) {
  if (!ADMIN_SESSION_SECRET) return "";
  const key = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(ADMIN_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, textEncoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

async function hashValue(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", textEncoder.encode(value));
  return bytesToHex(new Uint8Array(digest));
}

export async function createAdminSessionValue(actorId: string): Promise<string> {
  if (!ADMIN_SESSION_SECRET) return "";
  const issuedAt = Date.now();
  const payload = createSessionPayload(actorId, issuedAt);
  const signature = await signPayload(payload);
  if (!signature) return "";
  return `${payload}.${signature}`;
}

export async function parseAdminSession(value?: string | null): Promise<AdminSession | null> {
  if (!value || !ADMIN_SESSION_SECRET) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = await signPayload(payload);
  if (!expected) return null;
  const sigBytes = fromBase64Url(signature);
  const expBytes = fromBase64Url(expected);
  if (!constantTimeEqual(sigBytes, expBytes)) return null;

  try {
    const decoded = new TextDecoder().decode(fromBase64Url(payload));
    const data = JSON.parse(decoded) as { actorId?: string; issuedAt?: number };
    if (!data?.actorId || !data?.issuedAt) return null;
    if (Date.now() - data.issuedAt > ADMIN_SESSION_MAX_AGE_MS) return null;
    const sessionId = await hashValue(value);
    return { actorId: data.actorId, issuedAt: data.issuedAt, sessionId };
  } catch {
    return null;
  }
}

export async function getAdminSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  const value = match?.[1] ? decodeURIComponent(match[1]) : null;
  return parseAdminSession(value);
}

export async function isAdminSessionValid(value?: string | null) {
  return Boolean(await parseAdminSession(value));
}

export function shouldRotateAdminSession(session: AdminSession | null) {
  if (!session) return false;
  return Date.now() - session.issuedAt >= ADMIN_SESSION_ROTATE_AFTER_MS;
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  };
}
