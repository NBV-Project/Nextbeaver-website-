import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[class~="theme-dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "16px",
        sm: "20px",
        md: "32px",
        lg: "48px",
        xl: "64px",
        "2xl": "80px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Manrope", "system-ui", "sans-serif"],
      },
      colors: {
        primary: "var(--color-accent)",
        "background-light": "var(--color-bg)",
        "background-dark": "var(--color-surface)",
        espresso: "var(--color-espresso)",
        "espresso-light": "var(--color-espresso-light)",
        "accent-text": "var(--color-muted)",
        border: "var(--color-border)",
        "border-strong": "var(--color-border-strong)",
        text: "var(--color-text)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
      },
      keyframes: {
        "scroll-vertical": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
      animation: {
        "scroll-vertical": "scroll-vertical 20s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
