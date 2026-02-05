import PortfolioSwap from "@/components/sections/PortfolioSwap";
import RotatingText from "@/components/RotatingText";

const cardImages = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=900&q=80",
];

type PortfolioProps = {
  dict: {
    portfolio: {
      eyebrow: string;
      title: string;
      swap: {
        badge: string;
        stat: string;
        statSuffix: string;
        statLabel: string;
        brand: string;
      };
      items: { title: string; subtitle: string; number: string }[];
    };
  };
};

export default function Portfolio({ dict }: PortfolioProps) {
  const rotatingTexts = dict.portfolio.items.map((item) => item.title);

  return (
    <section
      id="portfolio"
      className="bg-[var(--color-bg)] py-20 text-text sm:py-24 md:py-28 lg:py-36 content-auto"
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:gap-8 md:mb-16 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="max-w-2xl">
            <h2 className="mb-3 text-xs font-bold tracking-[0.15em] sm:mb-4 sm:text-sm sm:tracking-[0.2em]">
              <span
                className="eyebrow-shimmer eyebrow-shimmer-animate block"
                style={{
                  ["--eyebrow-color" as string]: "var(--color-accent)",
                  animation: "eyebrow-shimmer 2.2s linear infinite",
                  WebkitAnimation: "eyebrow-shimmer 2.2s linear infinite",
                }}
              >
                {dict.portfolio.eyebrow}
              </span>
            </h2>
            <h3 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
              {dict.portfolio.title}
            </h3>
          </div>
        </div>

        <div className="portfolio-dark relative overflow-hidden rounded-2xl border border-border bg-[var(--color-surface-alt)] p-4 sm:rounded-[28px] sm:p-6 md:p-10 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,_rgba(242,127,13,0.16),_transparent_60%)]" />

          {/* Mobile/Tablet: Stack layout, Desktop: Side by side */}
          <div className="grid gap-8 sm:gap-10 lg:grid-cols-[1fr_1.3fr] lg:items-center lg:gap-6">
            {/* Content side */}
            <div className="relative z-10 lg:pl-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-3 py-1.5 text-[10px] text-white/70 sm:px-4 sm:py-2 sm:text-xs">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>{dict.portfolio.swap.badge}</span>
                <span className="material-symbols-outlined text-sm">public</span>
              </div>
              <div className="mt-6 sm:mt-8 md:mt-10">
                <RotatingText
                  texts={rotatingTexts}
                  mainClassName="text-[clamp(24px,4.5vw,64px)] font-semibold tracking-tight text-text"
                  staggerFrom="last"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden pb-1"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2200}
                />
              </div>
              <div className="mt-6 text-3xl font-semibold tracking-tight text-text sm:mt-8 sm:text-4xl md:mt-10 md:text-5xl">
                {dict.portfolio.swap.brand}
              </div>
            </div>

            {/* Card swap side */}
            <div className="relative mx-auto h-[240px] w-full max-w-[420px] sm:h-[280px] md:h-[330px] lg:mx-0 lg:h-[380px] lg:max-w-[560px]">
              <PortfolioSwap items={dict.portfolio.items} cardImages={cardImages} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
