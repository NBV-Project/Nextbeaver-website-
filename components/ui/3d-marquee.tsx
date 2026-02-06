"use client";

import { LazyMotion, domAnimation, m, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const isSvgSource = (src?: string) => {
  if (!src) return false;
  const normalized = src.split("?")[0].toLowerCase();
  return normalized.endsWith(".svg") || src.startsWith("data:image/svg");
};

const MotionImage = motion.create(Image);
export const ThreeDMarquee = ({
  images,
  className,
  interactive = true,
  autoScroll = true,
  speed = 1,
}: {
  images: string[];
  className?: string;
  interactive?: boolean;
  autoScroll?: boolean;
  speed?: number;
}) => {
  // Split the images array into 4 equal parts
  const chunkSize = Math.ceil(images.length / 4);
  const chunks = useMemo(
    () =>
      Array.from({ length: 4 }, (_, colIndex) => {
        const start = colIndex * chunkSize;
        return images.slice(start, start + chunkSize);
      }),
    [images, chunkSize],
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isThemeAnimating, setIsThemeAnimating] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const html = document.documentElement;
    const update = () =>
      setIsThemeAnimating(html.dataset.themeAnimating === "true");
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, {
      attributes: true,
      attributeFilter: ["data-theme-animating"],
    });
    return () => observer.disconnect();
  }, []);

  const shouldAnimate = isInView && !reduceMotion && !isThemeAnimating && autoScroll;
  return (
    <LazyMotion features={domAnimation}>
      <div
        className={cn(
          "mx-auto block h-[600px] overflow-hidden rounded-2xl max-sm:h-100",
          className,
        )}
        ref={containerRef}
      >
        <div className="flex size-full items-center justify-center">
          <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
            <div
              style={{
                transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
              }}
              className="marquee-grid relative top-96 right-[50%] grid size-full origin-top-left grid-cols-4 gap-8 transform-3d"
            >
              {chunks.map((subarray, colIndex) => (
                <m.div
                  animate={shouldAnimate ? { y: colIndex % 2 === 0 ? 100 : -100 } : { y: 0 }}
                  transition={
                    shouldAnimate
                      ? {
                        duration: (colIndex % 2 === 0 ? 8 : 12) / speed,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }
                      : { duration: 0 }
                  }
                  key={colIndex + "marquee"}
                  className="flex flex-col items-start gap-8 will-change-transform"
                >
                  <GridLineVertical className="-left-4" offset="80px" />
                  {subarray.map((image, imageIndex) => (
                    <div className="relative" key={imageIndex + image}>
                      <GridLineHorizontal className="-top-4" offset="20px" />
                      {interactive ? (
                        <MotionImage
                          whileHover={{
                            y: -10,
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                          }}
                          key={imageIndex + image}
                          src={image}
                          alt={`Image ${imageIndex + 1}`}
                          className="aspect-[970/700] rounded-lg object-cover ring ring-gray-950/5 hover:shadow-2xl"
                          width={970}
                          height={700}
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          draggable={false}
                          sizes="(min-width: 1280px) 485px, (min-width: 1024px) 420px, 80vw"
                          unoptimized={isSvgSource(image)}
                        />
                      ) : (
                        <Image
                          key={imageIndex + image}
                          src={image}
                          alt={`Image ${imageIndex + 1}`}
                          className="aspect-[970/700] rounded-lg object-cover ring ring-gray-950/5"
                          width={970}
                          height={700}
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          draggable={false}
                          sizes="(min-width: 1280px) 485px, (min-width: 1024px) 420px, 80vw"
                          unoptimized={isSvgSource(image)}
                        />
                      )}
                    </div>
                  ))}
                </m.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
};

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};
