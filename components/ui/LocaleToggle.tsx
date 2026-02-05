"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LocaleToggleProps = {
  currentLocale: Locale;
  isScrolled?: boolean;
  labels: {
    label: string;
    en: string;
    th: string;
  };
};

const LOCALE_KEY = "nbv-locale";

export default function LocaleToggle({ currentLocale, labels, isScrolled }: LocaleToggleProps) {
  const router = useRouter();
  const nextLocale = currentLocale === "en" ? "th" : "en";
  const display = currentLocale === "en" ? labels.en : labels.th;
  const flagSrc = currentLocale === "en" ? "/flags/gb.svg" : "/flags/th.svg";

  function handleToggle() {
    document.cookie = `locale=${nextLocale}; path=/; max-age=31536000`;
    window.localStorage.setItem(LOCALE_KEY, nextLocale);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      className="inline-flex items-center gap-1 sm:gap-2"
      onClick={handleToggle}
      aria-label={labels.label}
      suppressHydrationWarning
    >
      <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full border border-border bg-white/5 sm:h-8 sm:w-8">
        <Image
          src={flagSrc}
          alt=""
          fill
          sizes="(min-width: 640px) 32px, 28px"
          className="object-cover"
        />
      </span>
      <span className={cn(
        "hidden text-[10px] font-bold uppercase tracking-[0.2em] sm:inline transition-colors duration-700",
        isScrolled ? "text-white" : "text-accent-text"
      )}>
        {display}
      </span>
    </button>
  );
}
