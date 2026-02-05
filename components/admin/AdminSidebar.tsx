"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Briefcase, ClipboardList, Home, Info, Menu, X, Wrench, GalleryHorizontal, MessageSquare, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  active: "home" | "portfolio" | "about" | "services" | "marquee" | "contact" | "faq" | "logs";
  title: string;
  subtitle: string;
  icon: ReactNode;
  controls?: ReactNode;
};

export default function AdminSidebar({
  active,
  title,
  subtitle,
  icon,
  controls,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const updateNavHeight = () => {
      const height = headerRef.current?.offsetHeight ?? 0;
      const width = window.innerWidth;
      const offset = width < 640 ? Math.max(height - 12, 0) : height;
      document.documentElement.style.setProperty("--admin-nav-height", `${height}px`);
      document.documentElement.style.setProperty("--admin-nav-offset", `${offset}px`);
    };
    updateNavHeight();
    window.addEventListener("resize", updateNavHeight);
    return () => window.removeEventListener("resize", updateNavHeight);
  }, [isOpen]);

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#2a2116]/80 bg-[#120f0b]/85 backdrop-blur-2xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl border border-[#3a2f1d] bg-gradient-to-br from-[#2a2419] via-[#1a1612] to-[#120f0b] flex items-center justify-center shadow-[0_12px_30px_rgba(0,0,0,0.35)]">
                {icon}
              </div>
              <div>
                <h1 className="font-semibold text-lg tracking-[0.03em] text-white">{title}</h1>
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b7a57]">
                  {subtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="md:hidden size-10 rounded-full border border-[#2a2116] bg-[#1a1612] text-neutral-200 flex items-center justify-center"
              onClick={() => setIsOpen(prev => !prev)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>

          <div
            className={cn(
              "flex flex-col gap-3 md:flex-row md:items-center",
              isOpen ? "block" : "hidden md:flex"
            )}
          >
            <nav className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/home"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200",
                  active === "home"
                    ? "bg-[#2a2419] text-[#f4af25] border border-[#4a3b24] shadow-[0_8px_20px_rgba(244,175,37,0.12)]"
                    : "text-[#cbb790]/70 border border-[#2a2116] hover:text-white hover:border-[#4a3b24]"
                )}
              >
                <Home className="size-4" />
                <span>Home</span>
              </Link>
              <Link
                href="/admin/about"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200",
                  active === "about"
                    ? "bg-[#2a2419] text-[#f4af25] border border-[#4a3b24] shadow-[0_8px_20px_rgba(244,175,37,0.12)]"
                    : "text-[#cbb790]/70 border border-[#2a2116] hover:text-white hover:border-[#4a3b24]"
                )}
              >
                <Info className="size-4" />
                <span>About</span>
              </Link>
              <Link
                href="/admin/services"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200",
                  active === "services"
                    ? "bg-[#2a2419] text-[#f4af25] border border-[#4a3b24] shadow-[0_8px_20px_rgba(244,175,37,0.12)]"
                    : "text-[#cbb790]/70 border border-[#2a2116] hover:text-white hover:border-[#4a3b24]"
                )}
              >
                <Wrench className="size-4" />
                <span>Services</span>
              </Link>
              <Link
                href="/admin/portfolio"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200",
                  active === "portfolio"
                    ? "bg-[#2a2419] text-[#f4af25] border border-[#4a3b24] shadow-[0_8px_20px_rgba(244,175,37,0.12)]"
                    : "text-[#cbb790]/70 border border-[#2a2116] hover:text-white hover:border-[#4a3b24]"
                )}
              >
                <Briefcase className="size-4" />
                <span>Portfolio</span>
              </Link>
              <Link
                href="/admin/marquee"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200",
                  active === "marquee"
                    ? "bg-[#2a2419] text-[#f4af25] border border-[#4a3b24] shadow-[0_8px_20px_rgba(244,175,37,0.12)]"
                    : "text-[#cbb790]/70 border border-[#2a2116] hover:text-white hover:border-[#4a3b24]"
                )}
              >
                <GalleryHorizontal className="size-4" />
                <span>Marquee</span>
              </Link>
              <Link
                href="/admin/contact"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200",
                  active === "contact"
                    ? "bg-[#2a2419] text-[#f4af25] border border-[#4a3b24] shadow-[0_8px_20px_rgba(244,175,37,0.12)]"
                    : "text-[#cbb790]/70 border border-[#2a2116] hover:text-white hover:border-[#4a3b24]"
                )}
              >
                <MessageSquare className="size-4" />
                <span>Contact</span>
              </Link>
              <Link
                href="/admin/faq"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200",
                  active === "faq"
                    ? "bg-[#2a2419] text-[#f4af25] border border-[#4a3b24] shadow-[0_8px_20px_rgba(244,175,37,0.12)]"
                    : "text-[#cbb790]/70 border border-[#2a2116] hover:text-white hover:border-[#4a3b24]"
                )}
              >
                <HelpCircle className="size-4" />
                <span>FAQ</span>
              </Link>
              <Link
                href="/admin/logs"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold uppercase tracking-[0.2em] transition-all duration-200",
                  active === "logs"
                    ? "bg-[#2a2419] text-[#f4af25] border border-[#4a3b24] shadow-[0_8px_20px_rgba(244,175,37,0.12)]"
                    : "text-[#cbb790]/70 border border-[#2a2116] hover:text-white hover:border-[#4a3b24]"
                )}
              >
                <ClipboardList className="size-4" />
                <span>Logs</span>
              </Link>
            </nav>
            {controls}
          </div>
        </div>
      </div>
    </header>
  );
}
