import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function loadEnvVar(name: string): string | undefined {
  if (process.env[name]) return process.env[name];
  for (const filename of [".env.local", ".env"]) {
    const path = join(process.cwd(), filename);
    if (!existsSync(path)) continue;
    const content = readFileSync(path, "utf8");
    const match = content.match(new RegExp(`^${name}\\s*=\\s*(.*?)\\s*(?:#.*)?$`, "m"));
    if (match) {
      return match[1].trim().replace(/(^["']|["']$)/g, "");
    }
  }
  return undefined;
}
