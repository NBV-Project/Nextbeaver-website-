"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isAnimating, setIsAnimating] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

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
    if (isAnimating) return;
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

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      setTheme(next);
      applyTheme(next);
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "auto" });
      html.style.scrollBehavior = previousScrollBehavior;
      html.style.overflowAnchor = previousHtmlOverflowAnchor;
      document.body.style.overflowAnchor = previousBodyOverflowAnchor;
      return;
    }

    setIsAnimating(true);
    document.documentElement.dataset.themeAnimating = "true";
    const overlay = document.createElement("div");
    overlay.className = "theme-clip";
    overlay.setAttribute("aria-hidden", "true");

    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      overlay.style.setProperty(
        "--clip-x",
        `${rect.left + rect.width / 2}px`,
      );
      overlay.style.setProperty(
        "--clip-y",
        `${rect.top + rect.height / 2}px`,
      );
    }

    const clone = root.cloneNode(true) as HTMLElement;
    clone.id = `${ROOT_ID}-clone`;
    clone.setAttribute("aria-hidden", "true");
    clone.classList.remove("theme-dark", "theme-light");
    clone.classList.add(`theme-${next}`);
    clone
      .querySelectorAll<HTMLSpanElement>(
        "[data-theme-toggle] .material-symbols-outlined",
      )
      .forEach((icon) => {
        icon.textContent = next === "dark" ? "dark_mode" : "light_mode";
      });
    clone.style.position = "absolute";
    clone.style.top = `${-window.scrollY}px`;
    clone.style.left = "0";
    clone.style.right = "0";
    clone.style.width = "100%";
    clone.style.height = `${document.documentElement.scrollHeight}px`;
    clone.style.pointerEvents = "none";

    overlay.appendChild(clone);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      overlay.classList.add("theme-clip--animating");
    });

    window.setTimeout(() => {
      applyTheme(next);
      setTheme(next);
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "auto" });
      overlay.remove();
      delete document.documentElement.dataset.themeAnimating;
      html.style.scrollBehavior = previousScrollBehavior;
      html.style.overflowAnchor = previousHtmlOverflowAnchor;
      document.body.style.overflowAnchor = previousBodyOverflowAnchor;
      setIsAnimating(false);
    }, 1100);
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
      aria-disabled={isAnimating}
      disabled={isAnimating}
      ref={buttonRef}
      data-theme-toggle
      suppressHydrationWarning
    >
      <span className="material-symbols-outlined text-[16px] sm:text-[18px]">
        {theme === "dark" ? "dark_mode" : "light_mode"}
      </span>
    </button>
  );
}
