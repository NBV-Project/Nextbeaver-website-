"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PortfolioItem = {
  title: string;
  subtitle: string;
  number: string;
};

type PortfolioSwapProps = {
  items: PortfolioItem[];
  cardImages: string[];
};

const CardSwap = dynamic(() => import("@/components/CardSwap"), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden />,
});

const cardBaseClass =
  "absolute top-1/2 left-1/2 rounded-xl [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden]";
const cardClass =
  "border border-black/10 bg-[#f8f7f5] text-[#1b140f] shadow-[0_20px_60px_rgba(0,0,0,0.2)] dark:border-transparent dark:bg-[#1c1916] dark:text-white dark:shadow-[0_20px_60px_rgba(0,0,0,0.55)]";

export default function PortfolioSwap({ items, cardImages }: PortfolioSwapProps) {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      setTimeout(() => setIsInView(true), 0);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      {isInView ? (
        <CardSwap
          width="100%"
          height="100%"
          cardDistance={52}
          verticalDistance={38}
          delay={5000}
          pauseOnHover={false}
          skewAmount={10}
          easing="elastic"
          containerClassName="!top-1/2 !bottom-auto !translate-y-[-25%] !translate-x-[8%] max-[768px]:!top-auto max-[768px]:!bottom-0 max-[768px]:!translate-y-[26%] max-[768px]:!translate-x-0"
        >
          {items.map((item, index) => (
            <div key={item.title} className={`${cardBaseClass} ${cardClass}`}>
              <div className="relative h-full overflow-hidden rounded-xl">
                <Image
                  src={cardImages[index]}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 40vw, 80vw"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-transparent" />
                <div className="relative z-10 px-4 pt-4 text-white sm:px-6 sm:pt-6">
                  <span className="text-[10px] uppercase tracking-[0.15em] text-primary sm:text-xs sm:tracking-[0.2em]">
                    {item.number}
                  </span>
                  <h4 className="mt-1.5 text-sm font-semibold text-white sm:mt-2 sm:text-base">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 text-xs text-white/70 sm:mt-1 sm:text-sm">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardSwap>
      ) : (
        <div className="h-full w-full rounded-xl border border-border bg-[var(--color-surface-alt)]" />
      )}
    </div>
  );
}
