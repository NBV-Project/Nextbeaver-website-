"use client";

import { ThreeDMarquee } from "@/components/ui/3d-marquee";

type MarqueeVisualProps = {
  className?: string;
  images: string[];
  interactive?: boolean;
  autoScroll?: boolean;
  speed?: number;
};

export default function MarqueeVisual({
  className,
  images,
  interactive = true,
  autoScroll = true,
  speed = 1,
}: MarqueeVisualProps) {
  return (
    <ThreeDMarquee
      className={className}
      images={images}
      interactive={interactive}
      autoScroll={autoScroll}
      speed={speed}
    />
  );
}
