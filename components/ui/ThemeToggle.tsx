"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  isScrolled?: boolean;
  labels: {
    label: string;
    light: string;
    dark: string;
  };
};

type ThemeValue = "dark" | "light";

const ROOT_ID = "app-root";
const THEME_KEY = "nbv-theme";
const THEME_EVENT = "nbv-theme-change";

export default function ThemeToggle({ labels, isScrolled }: ThemeToggleProps) {
  const [theme, setTheme] = useState<ThemeValue>("dark");

  function applyTheme(next: ThemeValue) {
    const root = document.getElementById(ROOT_ID);
    if (root) {
      root.classList.toggle("theme-dark", next === "dark");
      root.classList.toggle("theme-light", next === "light");
    }
    document.documentElement.style.colorScheme = next;
    document.cookie = `theme=${next}; path=/; max-age=31536000`;
    window.localStorage.setItem(THEME_KEY, next);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
  }

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY) as ThemeValue | null;
    const root = document.getElementById(ROOT_ID);
    const current =
      stored ?? (root?.classList.contains("theme-light") ? "light" : "dark");
    applyTheme(current);
    requestAnimationFrame(() => {
      setTheme(current);
    });
  }, []);

  function handleToggle() {
    const next = theme === "dark" ? "light" : "dark";
    const root = document.getElementById(ROOT_ID);
    const html = document.documentElement;
    const previousScrollBehavior = html.style.scrollBehavior;
    const previousHtmlOverflowAnchor = html.style.overflowAnchor;
    const previousBodyOverflowAnchor = document.body.style.overflowAnchor;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    html.style.scrollBehavior = "auto";
    html.style.overflowAnchor = "none";
    document.body.style.overflowAnchor = "none";
    if (!root) {
      setTheme(next);
      applyTheme(next);
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "auto" });
      html.style.scrollBehavior = previousScrollBehavior;
      html.style.overflowAnchor = previousHtmlOverflowAnchor;
      document.body.style.overflowAnchor = previousBodyOverflowAnchor;
      return;
    }

    setTheme(next);
    applyTheme(next);
    window.scrollTo({ left: scrollX, top: scrollY, behavior: "auto" });
    html.style.scrollBehavior = previousScrollBehavior;
    html.style.overflowAnchor = previousHtmlOverflowAnchor;
    document.body.style.overflowAnchor = previousBodyOverflowAnchor;
  }

  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-white/5 transition-colors hover:border-primary hover:text-text sm:h-8 sm:w-8",
        isScrolled ? "text-white" : "text-accent-text"
      )}
      onClick={handleToggle}
      aria-label={labels.label}
      data-theme-toggle
      suppressHydrationWarning
    >
      <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
        {theme === "dark" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
}
