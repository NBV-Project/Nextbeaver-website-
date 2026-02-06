"use client";

import Image from "next/image";
import { Link } from "next-view-transitions";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LocaleToggle from "@/components/ui/LocaleToggle";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type HeaderProps = {
  dict: {
    nav: Record<string, string>;
    header: {
      brand: string;
      tagline: string;
      cta: string;
      openMenu: string;
    };
    toggles: {
      theme: string;
      language: string;
      light: string;
      dark: string;
      en: string;
      th: string;
    };
  };
  locale: Locale;
};

export default function Header({ dict, locale }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolledRef = useRef(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 8;
      if (next !== isScrolledRef.current) {
        isScrolledRef.current = next;
        setIsScrolled(next);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for Active Section logic
  useEffect(() => {
    if (pathname !== "/") {
      requestAnimationFrame(() => {
        setActiveSection(pathname.startsWith("/portfolio") ? "portfolio" : "");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If the section is taking up more than 40% of the viewport
          if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: "-20% 0px -20% 0px", // Detect when section is in the middle 60% of viewport
        threshold: [0.1, 0.4, 0.6, 0.8] 
      }
    );

    const sections = ["home", "about", "services", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/#home", label: dict.nav.home, isActive: pathname === "/" && (activeSection === "home" || !activeSection) },
    { href: "/#about", label: dict.nav.about, isActive: pathname === "/" && activeSection === "about" },
    { href: "/#services", label: dict.nav.services, isActive: pathname === "/" && activeSection === "services" },
    { href: "/portfolio", label: dict.nav.portfolio, isActive: pathname.startsWith("/portfolio") },
    { href: "/#contact", label: dict.nav.contact, isActive: pathname === "/" && activeSection === "contact" },
  ];

  const scrollToId = (hash: string) => {
    const id = decodeURIComponent(hash.replace(/^#/, ""));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleHashNav = (href: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    handleNavClick();
    const hashIndex = href.indexOf("#");
    const hash = hashIndex >= 0 ? href.slice(hashIndex) : "";
    if (pathname === "/") {
      scrollToId(hash);
      window.history.replaceState(null, "", href);
      return;
    }
    router.push(href, { scroll: false });
    window.setTimeout(() => scrollToId(hash), 200);
  };

  return (
    <>
      <header className={cn(
        "fixed left-0 z-[100] w-full transition-all duration-700 ease-in-out",
        isScrolled ? "top-[24px]" : "top-2"
      )}>
        <div className={cn(
          "mx-auto w-full transition-all duration-700 ease-in-out",
          isScrolled 
            ? "lg:px-[calc((100%-1000px)/2+24px)] px-4 sm:px-6 md:px-8" 
            : "max-w-none px-4 sm:px-6 md:px-8 lg:px-12"
        )}>
          <div className="relative mx-auto w-full">
            <div
              aria-hidden
              className={cn(
                "header-bg pointer-events-none absolute left-1/2 top-1/2 w-full max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-700 lg:max-w-[1000px]",
                isScrolled
                  ? "header-bg-scrolled bg-[#181411]/95 md:backdrop-blur-md md:shadow-[0_18px_40px_rgba(0,0,0,0.25)] opacity-100 h-16"
                  : "opacity-0 h-14 sm:h-14 md:h-16"
              )}
            />
            <div className={cn(
              "relative flex items-center transition-all duration-700",
              isScrolled ? "h-16" : "h-14 md:h-16"
            )}>
              {/* Left Container: Logo */}
              <div 
                className={cn(
                  "flex items-center gap-0 transition-all duration-700 ease-in-out",
                  isScrolled && "pl-4 sm:pl-6 md:pl-8"
                )}
              >
                <Image
                  src="/logo.png"
                  alt="Nextbeaver logo"
                  width={80}
                  height={80}
                  className="h-14 w-14 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20"
                  priority
                  fetchPriority="high"
                  sizes="(min-width: 768px) 80px, 56px"
                />
                <span className="-ml-2 h-4 w-0.5 bg-primary sm:-ml-3 sm:h-5 md:-ml-4 md:h-6" aria-hidden />
                <div className="flex flex-col justify-center pl-1">
                  <h1 className="text-sm font-bold leading-none tracking-[0.15em] sm:text-base sm:tracking-[0.18em] md:text-lg md:tracking-[0.2em] transition-all duration-700 text-white">
                    {dict.header.brand}
                  </h1>
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Center Container: Desktop Navigation */}
              <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
                {navLinks.map((link) => (
                  (() => {
                    const isHashLink = link.href.includes("#");
                    return (
                  <Link
                    key={link.href}
                    className={cn(
                      "group relative text-sm font-medium tracking-wide transition-colors duration-300 hover:text-white",
                      link.isActive 
                        ? (isScrolled ? "text-white" : "text-primary") 
                        : "text-white/90"
                    )}
                    href={link.href}
                    scroll={isHashLink ? false : undefined}
                    onClick={isHashLink ? handleHashNav(link.href) : undefined}
                  >
                    {link.label}
                    <span className={cn(
                      "absolute -bottom-1 left-0 h-0.5 transition-all duration-300",
                      link.isActive ? "w-full" : "w-0 group-hover:w-full",
                      isScrolled ? "bg-white" : "bg-primary"
                    )} />
                  </Link>
                    );
                  })()
                ))}
              </nav>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Right Container: Controls */}
              <div className={cn(
                "flex items-center gap-2 transition-all duration-700 ease-in-out",
                isScrolled && "pr-4 sm:pr-6 md:pr-8"
              )}>
                <div className="hidden items-center gap-2 sm:gap-3 md:gap-4 lg:flex">
                  <LocaleToggle
                    currentLocale={locale}
                    isScrolled={isScrolled}
                    labels={{
                      label: dict.toggles.language,
                      en: dict.toggles.en,
                      th: dict.toggles.th,
                    }}
                  />
                  <ThemeToggle
                    isScrolled={isScrolled}
                    labels={{
                      label: dict.toggles.theme,
                      light: dict.toggles.light,
                      dark: dict.toggles.dark,
                    }}
                  />
                </div>

                {/* Mobile menu button */}
                <button
                  className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/5 text-text transition-colors hover:border-primary lg:hidden"
                  type="button"
                  aria-label={dict.header.openMenu}
                  aria-expanded={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen((open) => !open)}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {isMobileMenuOpen ? "close" : "menu"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <nav
        className={`fixed right-0 top-0 z-40 h-[100dvh] w-[280px] max-w-[85vw] overflow-y-auto bg-espresso/95 backdrop-blur-xl transition-transform duration-300 ease-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        <div className="flex h-full flex-col px-6 pt-24 pb-8">
          {/* Nav links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              (() => {
                const isHashLink = link.href.includes("#");
                return (
              <Link
                key={link.href}
                href={link.href}
                scroll={isHashLink ? false : undefined}
                onClick={isHashLink ? handleHashNav(link.href) : handleNavClick}
                className="group flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-medium text-white/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                {link.label}
              </Link>
                );
              })()
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-white/10" />

          {/* Mobile toggles info */}
          <div className="mt-auto space-y-4">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Settings
            </p>
            <div className="flex items-center gap-4">
              <LocaleToggle
                currentLocale={locale}
                labels={{
                  label: dict.toggles.language,
                  en: dict.toggles.en,
                  th: dict.toggles.th,
                }}
              />
              <ThemeToggle
                labels={{
                  label: dict.toggles.theme,
                  light: dict.toggles.light,
                  dark: dict.toggles.dark,
                }}
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
