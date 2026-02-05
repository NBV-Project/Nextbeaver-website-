import type { PortfolioHeroConfig } from "@/lib/supabase/portfolio";

type Props = {
  hero: PortfolioHeroConfig;
  locale: "en" | "th";
};

export default function PortfolioHero({ hero, locale }: Props) {
  const heroStyles = hero.styles ?? {};
  
  // Language Selection
  const title = (locale === "th" && hero.title_th) ? hero.title_th : hero.title;
  const accent = (locale === "th" && hero.accent_th) ? hero.accent_th : hero.accent;
  const description = (locale === "th" && hero.description_th) ? hero.description_th : hero.description;

  // Defaults
  const c = {
    title: heroStyles.titleColor || "#181411",
    titleDark: heroStyles.titleColorDark || "#f5f1da",
    accent: heroStyles.accentColor || "#f27f0d",
    accentDark: heroStyles.accentColorDark || "#ffffff",
    desc: heroStyles.descriptionColor || "#6b5d52",
    descDark: heroStyles.descriptionColorDark || "#bbae9b",
  };

  return (
    <section className="hero-dynamic-scope mx-auto flex max-w-[1400px] flex-col items-center px-4 pt-24 text-center sm:px-6 sm:pt-28 lg:px-8">
      <style dangerouslySetInnerHTML={{__html: `
        .hero-dynamic-scope {
          --h-title: ${c.title};
          --h-accent: ${c.accent};
          --h-desc: ${c.desc};
        }
        .theme-dark .hero-dynamic-scope {
          --h-title: ${c.titleDark};
          --h-accent: ${c.accentDark};
          --h-desc: ${c.descDark};
        }
      `}} />

      <h1
        className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl sm:leading-none sm:tracking-tighter md:text-7xl lg:text-8xl transition-colors duration-300"
        style={{ 
          fontFamily: heroStyles.titleFontFamily, 
          fontSize: heroStyles.titleFontSize,
          color: "var(--h-title)"
        }}
      >
        {title}
        <br className="hidden md:block" />
        <span
          className="font-semibold transition-colors duration-300"
          style={{ color: "var(--h-accent) !important" }}
        >
          {accent}
        </span>
      </h1>
      <p
        className="mt-3 max-w-2xl text-base font-light leading-relaxed sm:mt-6 sm:text-lg md:text-xl transition-colors duration-300"
        style={{ 
          fontFamily: heroStyles.descriptionFontFamily, 
          fontSize: heroStyles.descriptionFontSize,
          color: "var(--h-desc)"
        }}
      >
        {description}
      </p>
    </section>
  );
}
