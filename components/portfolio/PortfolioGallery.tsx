"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { PortfolioProject } from "@/lib/supabase/portfolio";
import type { CSSProperties } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

type PortfolioGalleryProps = {
  projects: PortfolioProject[];
  locale: "en" | "th";
};

const getContent = <T extends keyof PortfolioProject>(
  p: PortfolioProject,
  field: T,
  locale: string
): PortfolioProject[T] => {
  if (locale === "th") {
    const thKey = `${String(field)}_th` as keyof PortfolioProject;
    const val = p[thKey];
    if (val !== undefined && val !== null) return val as PortfolioProject[T];
  }
  return p[field];
};

const getProjectStyles = (p: PortfolioProject) => {
  const s = p.styles || {};
  return {
    "--title-font": s.titleFontFamily,
    "--title-size": s.titleFontSize,
    "--title-color": s.titleColor || "#ffffff",
    "--title-color-dark": s.titleColorDark || "#ffffff",
    
    "--desc-font": s.descriptionFontFamily,
    "--desc-size": s.descriptionFontSize,
    "--desc-color": s.descriptionColor || "#eae6d6",
    "--desc-color-dark": s.descriptionColorDark || "#eae6d6",
  } as CSSProperties;
};

const isSvgSource = (src?: string) => {
  if (!src) return false;
  const normalized = src.split("?")[0].toLowerCase();
  return normalized.endsWith(".svg") || src.startsWith("data:image/svg");
};

export default function PortfolioGallery({ projects, locale }: PortfolioGalleryProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Handle body scroll lock
  useEffect(() => {
    if (!activeId) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveId(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeId]);

  const DetailsButton = ({
    onClick,
    controlsId,
    isExpanded,
  }: {
    onClick: () => void;
    controlsId: string;
    isExpanded: boolean;
  }) => (
    <div className="actions">
      <button
        type="button"
        className="button"
        onClick={onClick}
        aria-haspopup="dialog"
        aria-controls={controlsId}
        aria-expanded={isExpanded}
      >
        Details
      </button>
    </div>
  );

  const activeProject =
    projects.find((project) => project.id === activeId) ?? null;
    
  const activeDetails = activeProject ? (getContent(activeProject, "details", locale) || []) : [];
  const activeTech = activeProject?.tech ?? [];
  const activeBreadcrumbs = activeProject ? getContent(activeProject, "breadcrumbs", locale) : "";
  
  const activeGallery =
    activeProject?.gallery?.length
      ? activeProject.gallery
      : activeProject
        ? [
            activeProject.image,
            activeProject.image,
            activeProject.image,
            activeProject.image,
          ]
        : [];
  
  const modalId = activeProject
    ? `portfolio-modal-${activeProject.id}`
    : undefined;
  const modalTitleId = activeProject ? `${modalId}-title` : undefined;
  const modalDescId = activeProject ? `${modalId}-desc` : undefined;

  return (
    <>
      <div className="portfolio-swiper-container">
        <Swiper
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView="auto"
          initialSlide={Math.floor(projects.length / 2)}
          loop={false}
          speed={800}
          coverflowEffect={{
            rotate: 25,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[EffectCoverflow, Pagination]}
          className="movies"
        >
          {projects.map((project, index) => {
            const controlsId = `portfolio-modal-${project.id}`;
            const isFirst = index === 0;
            const styleVars = getProjectStyles(project);
            
            const title = getContent(project, "title", locale);
            const desc = getContent(project, "description", locale);

            return (
              <SwiperSlide key={project.id} className="swiper-slide" style={styleVars}>
                <Image
                  src={project.image}
                  alt={title}
                  width={1100}
                  height={1600}
                  priority={isFirst}
                  sizes="(min-width: 1024px) 40vw, 80vw"
                  unoptimized={isSvgSource(project.image)}
                />
                <div className="info">
                  <h3 
                    style={{ fontFamily: "var(--title-font)", fontSize: "var(--title-size)" }}
                    className="text-[var(--title-color)] dark:text-[var(--title-color-dark)]"
                  >
                    {title}
                  </h3>
                  <p 
                    style={{ fontFamily: "var(--desc-font)", fontSize: "var(--desc-size)" }}
                    className="text-[var(--desc-color)] dark:text-[var(--desc-color-dark)]"
                  >
                    {desc}
                  </p>
                  <DetailsButton
                    onClick={() => setActiveId(project.id)}
                    controlsId={controlsId}
                    isExpanded={activeId === project.id}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {activeProject ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) setActiveId(null);
          }}
        >
          <div
            className="relative w-full max-w-[1280px] overflow-hidden rounded-[18px] bg-white text-text shadow-[0_40px_120px_rgba(0,0,0,0.35)] dark:bg-[var(--color-surface)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            aria-describedby={modalDescId}
            id={modalId}
            style={getProjectStyles(activeProject)}
          >
            <div className="flex items-center justify-between gap-6 border-b border-border px-6 py-4">
              <div className="flex flex-wrap items-center gap-2 text-lg font-semibold">
                <h2
                  id={modalTitleId}
                  className="text-lg font-semibold text-[var(--title-color)] dark:text-[var(--title-color-dark)]"
                  style={{ fontFamily: "var(--title-font)" }}
                >
                  {getContent(activeProject, "title", locale)}
                </h2>
                {activeProject.link ? (
                  <a
                    href={activeProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-accent-text transition-colors hover:bg-[var(--color-surface-alt)] hover:text-text"
                    aria-label={`Open ${activeProject.title} project`}
                  >
                    <span
                      className="material-symbols-outlined text-base"
                      aria-hidden="true"
                    >
                      link
                    </span>
                  </a>
                ) : (
                  <span className="material-symbols-outlined text-base text-accent-text">
                    link
                  </span>
                )}
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                  Live
                </span>
                <span className="text-xs font-medium text-accent-text">
                  {activeBreadcrumbs}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-accent-text transition-colors hover:bg-[var(--color-surface-alt)] hover:text-text"
                aria-label="Close modal"
                ref={closeButtonRef}
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="grid max-h-[80vh] gap-8 overflow-y-auto px-4 py-6 sm:px-6 lg:overflow-hidden lg:px-6 lg:grid-cols-[1.05fr_1.75fr]">
              <div className="pr-0 lg:max-h-[72vh] lg:overflow-y-auto lg:pr-4">
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">
                      {locale === 'th' ? 'รายละเอียดโปรเจกต์' : 'Project Description'}
                    </p>
                    <div
                      className="mt-4 space-y-4 text-sm leading-relaxed text-accent-text"
                      id={modalDescId}
                      style={{ fontFamily: "var(--desc-font)" }}
                    >
                      {activeDetails.length > 0 ? activeDetails.map((paragraph: string, i: number) => (
                        <p key={i}>{paragraph}</p>
                      )) : (
                        <p>{getContent(activeProject, "description", locale)}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-accent-text">
                      {locale === 'th' ? 'เทคโนโลยีที่ใช้' : 'Tech Stack'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {activeTech.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-border bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-semibold text-accent-text"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pr-0 lg:max-h-[72vh] lg:overflow-y-auto lg:pr-2">
                <div className="space-y-4">
                  {activeGallery.map((image, index) => (
                    <div
                      key={`${activeProject.id}-preview-${index}`}
                      className="rounded-2xl border border-border bg-white p-4 dark:bg-[var(--color-surface-alt)]"
                    >
                      <Image
                        src={image}
                        alt={`${activeProject.title} preview ${index + 1}`}
                        className="w-full rounded-xl border border-border"
                        width={1200}
                        height={750}
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        unoptimized={isSvgSource(image)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
