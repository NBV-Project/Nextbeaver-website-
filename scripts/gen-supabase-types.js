/* eslint-disable */
const { spawnSync } = require("node:child_process");
const { existsSync, mkdirSync, readFileSync } = require("node:fs");
const { dirname, join } = require("node:path");

const resolveEnvVar = (name) => {
  if (process.env[name]) {
    return process.env[name];
  }
  const candidates = [".env.local", ".env"];
  for (const filename of candidates) {
    const resolvedPath = join(process.cwd(), filename);
    if (!existsSync(resolvedPath)) continue;
    const content = readFileSync(resolvedPath, "utf8");
    const regex = new RegExp(`^${name}\\s*=\\s*(.*?)\\s*(?:#.*)?$`, "m");
    const match = content.match(regex);
    if (match) {
      return match[1].trim().replace(/(^["']|["']$)/g, "");
    }
  }
  return undefined;
};

let projectId = resolveEnvVar("SUPABASE_PROJECT_ID") ?? resolveEnvVar("SUPABASE_PROJECT_REF");
if (!projectId) {
  const supabaseUrl = resolveEnvVar("NEXT_PUBLIC_SUPABASE_URL");
  if (supabaseUrl) {
    try {
      const parsed = new URL(supabaseUrl);
      const hostParts = parsed.hostname.split(".");
      if (hostParts.length > 0 && hostParts[0]) {
        projectId = hostParts[0];
      }
    } catch {
      // ignore if parsing fails
    }
  }
}

if (!projectId) {
  console.error("Missing SUPABASE_PROJECT_ID (or SUPABASE_PROJECT_REF). Set it before running `npm run gen:types`.");
  process.exit(1);
}

const schema = process.env.SUPABASE_SCHEMA ?? "public";
const outputFile =
  process.env.SUPABASE_TYPES_OUT_FILE ?? join("lib", "supabase", "types", "index.ts");

mkdirSync(dirname(outputFile), { recursive: true });

const args = [
  "supabase",
  "gen",
  "types",
  "typescript",
  "--project-id",
  projectId,
  "--schema",
  schema,
];

const quoteArg = (value) => {
  if (/[\s"]/u.test(value)) {
    return `"${value.replace(/(["\\])/g, "\\$1")}"`;
  }
  return value;
};

const command = ["npx", ...args.map(quoteArg)].join(" ");
const result = spawnSync(command, {
  stdio: ["ignore", "pipe", "pipe"],
  encoding: "utf8",
  shell: true,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

if (result.status !== 0) {
  if (result.stderr) {
    console.error(result.stderr);
  }
  process.exit(result.status ?? 1);
}

if (!result.stdout) {
  console.error("Supabase CLI did not produce output.");
  process.exit(1);
}

const outputContents = result.stdout.trim();
if (!outputContents) {
  console.error("Supabase CLI returned empty types definition.");
  process.exit(1);
}

require("node:fs").writeFileSync(outputFile, `${outputContents}\n`, { encoding: "utf8" });
