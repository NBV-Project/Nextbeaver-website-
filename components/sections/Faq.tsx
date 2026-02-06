"use client";

import { useEffect, useRef, useState } from "react";
import type { FaqContent, FaqItem } from "@/lib/supabase/faq";

type Props = {
  content?: FaqContent;
  items?: FaqItem[];
  lang?: "en" | "th";
};

const resolveText = (lang: "en" | "th", en: string, th?: string) =>
  lang === "th" ? th || en : en;

export default function Faq({ content, items, lang = "en" }: Props) {
  const eyebrow = content?.eyebrow ?? "FAQS";
  const eyebrowTh = content?.eyebrow_th ?? "FAQS";
  const title = content?.title ?? "Have Questions?";
  const titleTh = content?.title_th ?? "มีคำถามไหม?";
  const list = items && items.length ? items : [];
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof window === "undefined") return;
    const revealIfVisible = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.9) {
        setTimeout(() => setIsInView(true), 0);
        return true;
      }
      return false;
    };
    if (revealIfVisible()) return;
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
      { threshold: 0.45 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`faq-section bg-background-light text-text dark:bg-espresso transition-colors duration-300 ${isInView ? "faq-fall-active" : ""}`}
    >
      <div className="relative flex flex-col w-full overflow-x-hidden">
        <section className="px-6 pt-24 pb-24">
          <div className="mx-auto w-full max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:items-start">
              <div className="text-left">
                <span className="faq-fall-item font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
                  <span
                    className="block"
                    style={{
                      ["--eyebrow-color" as string]: "#f98c1f",
                      color: "#f98c1f",
                    }}
                  >
                    {resolveText(lang, eyebrow, eyebrowTh)}
                  </span>
                </span>
                <h2
                  className="faq-fall-item text-text text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight"
                  style={{ animationDelay: "0.15s" }}
                >
                  {resolveText(lang, title, titleTh)}
                </h2>
              </div>
              <div className="flex flex-col space-y-0">
                {list.map((item, index) => (
                  <details
                    key={item.question}
                    className={`group faq-fall-item border-t border-border-strong dark:border-primary/40 py-6 ${index === list.length - 1 ? "border-b" : ""}`}
                    style={{ animationDelay: `${0.3 + index * 0.12}s` }}
                    open={index === 0}
                  >
                    <summary className="flex cursor-pointer items-center justify-between list-none">
                      <h3 className="text-text text-lg md:text-xl font-bold group-hover:text-primary transition-colors duration-200">
                        {resolveText(lang, item.question, item.question_th)}
                      </h3>
                      <div className="text-primary transition-transform duration-300 group-open:rotate-180">
                        <span className="material-symbols-outlined text-2xl">expand_more</span>
                      </div>
                    </summary>
                    <div className="mt-4 pr-12">
                      <p className="text-accent-text text-base md:text-lg leading-relaxed font-normal">
                        {resolveText(lang, item.answer, item.answer_th)}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA section intentionally removed per request */}
      </div>
    </section>
  );
}
