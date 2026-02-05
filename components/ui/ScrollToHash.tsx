"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SCROLL_OFFSET = 96;
const MAX_ATTEMPTS = 12;
const RETRY_DELAY_MS = 120;

const scrollToHash = (hash: string) => {
  if (!hash) return false;
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return false;
  const target = document.getElementById(id);
  if (!target) return false;
  const top = target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
  return true;
};

export default function ScrollToHash() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let attempts = 0;

    const tryScroll = () => {
      attempts += 1;
      if (scrollToHash(window.location.hash)) return;
      if (attempts < MAX_ATTEMPTS) {
        window.setTimeout(tryScroll, RETRY_DELAY_MS);
      }
    };

    if (window.location.hash) {
      requestAnimationFrame(() => {
        window.setTimeout(tryScroll, 0);
      });
    }

    const handleHashChange = () => {
      attempts = 0;
      tryScroll();
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  return null;
}
