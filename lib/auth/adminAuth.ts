import crypto from "crypto";

type AdminActor = {
  id: string;
  label: string;
  hash: string;
};

const ADMIN_CODE_SLOTS = [1, 2, 3];

function parsePasswordHash(hash: string) {
  const [salt, key] = hash.split(":");
  if (!salt || !key) return null;
  const keyBuffer = Buffer.from(key, "hex");
  if (keyBuffer.length === 0) return null;
  return { salt, keyBuffer };
}

function getAdminActors(): AdminActor[] {
  const actors = ADMIN_CODE_SLOTS.map((slot) => {
    const hash = process.env[`ADMIN_CODE_${slot}_HASH`] || "";
    const label = process.env[`ADMIN_CODE_${slot}_LABEL`] || `Admin ${slot}`;
    const id = process.env[`ADMIN_CODE_${slot}_ID`] || `admin-${slot}`;
    if (!hash) return null;
    return { id, label, hash };
  }).filter(Boolean) as AdminActor[];

  if (actors.length > 0) return actors;

  const fallbackHash = process.env.ADMIN_PASSWORD_HASH || "";
  if (!fallbackHash) return [];
  return [{ id: "admin-default", label: "Admin", hash: fallbackHash }];
}

export function getAdminActorLabel(actorId: string) {
  return getAdminActors().find((actor) => actor.id === actorId)?.label ?? "Unknown";
}

export function verifyAdminCode(code: string): AdminActor | null {
  const actors = getAdminActors();
  if (!actors.length) return null;

  for (const actor of actors) {
    const parsed = parsePasswordHash(actor.hash);
    if (!parsed) continue;
    const derivedKey = crypto.scryptSync(code, parsed.salt, parsed.keyBuffer.length);
    if (crypto.timingSafeEqual(parsed.keyBuffer, derivedKey)) {
      return actor;
    }
  }

  return null;
}
