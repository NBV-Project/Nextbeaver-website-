"use client";

import { useEffect } from "react";
import type { PortfolioProject } from "@/lib/supabase/portfolio";

// List of fonts that are either system fonts or already loaded in layout.tsx
// We shouldn't request these from Google Fonts to save bandwidth.
const IGNORED_FONTS = new Set([
  "Inter", "Manrope", "Montserrat", "Arial", "Helvetica", "Verdana", 
  "Tahoma", "Trebuchet MS", "Times New Roman", "Georgia", "Garamond", 
  "Courier New", "Brush Script MT", "system-ui", "-apple-system"
]);

export default function DynamicFontLoader({ projects }: { projects: PortfolioProject[] }) {
  useEffect(() => {
    if (!projects || projects.length === 0) return;

    const fontsToLoad = new Set<string>();

    projects.forEach(p => {
      if (p.styles?.titleFontFamily) {
        // Extract font family name (e.g., "'Playfair Display', serif" -> "Playfair Display")
        const family = p.styles.titleFontFamily.split(',')[0].replace(/['"]/g, '').trim();
        if (!IGNORED_FONTS.has(family)) {
          fontsToLoad.add(family);
        }
      }
      if (p.styles?.descriptionFontFamily) {
        const family = p.styles.descriptionFontFamily.split(',')[0].replace(/['"]/g, '').trim();
        if (!IGNORED_FONTS.has(family)) {
          fontsToLoad.add(family);
        }
      }
    });

    if (fontsToLoad.size === 0) return;

    // Construct Google Fonts URL
    // Format: family=Font1&family=Font2
    const families = Array.from(fontsToLoad).map(f => `family=${f.replace(/ /g, '+')}:wght@400;700`);
    const href = `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap`;

    // Check if this link already exists to prevent duplicate loading
    if (document.querySelector(`link[href="${href}"]`)) return;

    const link = document.createElement('link');
    link.href = href;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Cleanup not really needed as we want fonts to stay, but good practice in some SPAs.
    // Here we let them persist.

  }, [projects]);

  return null;
}
