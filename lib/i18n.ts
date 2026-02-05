import type { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { en } from "@/content/en";
import { th } from "@/content/th";

export type Locale = "en" | "th";
export type Dictionary = typeof en;

const dictionaries = { en, th };

export function getLocaleFromCookies(
  cookieStore?: ReadonlyRequestCookies
): Locale {
  const locale = cookieStore?.get("locale")?.value;
  return locale === "en" ? "en" : "th";
}

export function getDictionary(locale: Locale): Dictionary {
  return (dictionaries[locale] || dictionaries.en) as Dictionary;
}
