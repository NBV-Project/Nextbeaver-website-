"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Code2, GripVertical, Plus, Type, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Hero from "@/components/sections/Hero";
import { en } from "@/content/en";
import { th } from "@/content/th";
import type {
  HomeHero,
  HomeHeroCapability,
  HomeHeroCodeLine,
  HomeHeroStyles,
} from "@/lib/supabase/home";

type Props = {
  hero: HomeHero;
  styles: HomeHeroStyles;
  codeLines: HomeHeroCodeLine[];
  capabilities: HomeHeroCapability[];
  lang: "en" | "th";
  mode: "light" | "dark";
  onHeroChange: (hero: HomeHero) => void;
  onStylesChange: (styles: HomeHeroStyles) => void;
  onCodeLinesChange: (lines: HomeHeroCodeLine[]) => void;
  onCapabilitiesChange: (caps: HomeHeroCapability[]) => void;
};

const fontOptions = [
  { label: "ค่าเริ่มต้น (Theme)", value: "" },
  { label: "Space Grotesk", value: "Space Grotesk, sans-serif" },
  { label: "Manrope", value: "Manrope, sans-serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Poppins", value: "Poppins, sans-serif" },
  { label: "Montserrat", value: "Montserrat, sans-serif" },
  { label: "Playfair Display", value: "Playfair Display, serif" },
  { label: "Lora", value: "Lora, serif" },
  { label: "Fira Code", value: "Fira Code, monospace" },
  { label: "JetBrains Mono", value: "JetBrains Mono, monospace" },
];

const fontSizes = [
  12,
  14,
  16,
  18,
  20,
  22,
  24,
  28,
  32,
  36,
  40,
  48,
  56,
  64,
  72,
  80,
  96,
];

const iconOptions = [
  { label: "เพชร (Diamond)", value: "diamond" },
  { label: "เลเยอร์ (Layers)", value: "layers" },
  { label: "โค้ด (Code)", value: "code-2" },
  { label: "เทอร์มินัล (Terminal)", value: "terminal" },
  { label: "เลย์เอาต์ (Layout)", value: "layout" },
  { label: "จรวด (Rocket)", value: "rocket" },
  { label: "โล่ (Shield)", value: "shield" },
  { label: "ประกายวิ้ง (Sparkles)", value: "sparkles" },
];

const buildFontFamilyKey = (base: string, lang: "en" | "th") =>
  `${base}${lang === "th" ? "Th" : "En"}` as keyof HomeHeroStyles;

const buildModeKey = (base: string, mode: "light" | "dark") =>
  `${base}${mode === "light" ? "Light" : "Dark"}` as keyof HomeHeroStyles;

const ColorInput = ({
  label,
  value,
  onChange,
  hideValueOnMobile,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  hideValueOnMobile?: boolean;
}) => (
  <label className="grid grid-cols-[88px_auto] items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
    <span className="text-right">{label}</span>
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        className="h-7 w-7 rounded border border-neutral-800 bg-neutral-950 cursor-pointer"
        value={value || "#000000"}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className={cn(
          "w-20 bg-neutral-950 border border-neutral-800 rounded-md px-2 py-1 text-[10px] text-white uppercase",
          hideValueOnMobile && "hidden sm:block"
        )}
        value={value || ""}
        onChange={e => onChange(e.target.value)}
        placeholder="#ffffff"
      />
    </div>
  </label>
);

const SizeInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (value: number) => void;
}) => (
  <label className="text-[10px] font-semibold uppercase tracking-wider text-[#cbb790]/60">
    {label}
    <select
      className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
      value={value ?? ""}
      onChange={e => onChange(Number(e.target.value))}
    >
      <option value="">อัตโนมัติ</option>
      {fontSizes.map(size => (
        <option key={size} value={size}>
          {size}px
        </option>
      ))}
    </select>
  </label>
);
export default function HeroEditor({
  hero,
  styles,
  codeLines,
  capabilities,
  lang,
  mode,
  onHeroChange,
  onStylesChange,
  onCodeLinesChange,
  onCapabilitiesChange,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">
    (
    "desktop"
  );
  const swipeStartX = useRef<number | null>(null);
  const swipeDeltaX = useRef(0);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);

  const updateHeroField = (field: keyof HomeHero, value: string) =>
    onHeroChange({ ...hero, [field]: value });

  const updateHeroText = (base: string, value: string) => {
    const field = (lang === "th" ? `${base}_th` : base) as keyof HomeHero;
    updateHeroField(field, value);
  };

  const updateStyle = (field: keyof HomeHeroStyles, value: string | number | boolean) =>
    onStylesChange({ ...styles, [field]: value });

  const updateStyleFont = (base: string, value: string) =>
    updateStyle(buildFontFamilyKey(base, lang), value);

  const updateStyleColor = (base: string, value: string) =>
    updateStyle(buildModeKey(base, mode), value);

  const updateStyleBool = (base: string, value: boolean) =>
    updateStyle(buildModeKey(base, mode), value);

  const heroText = (base: string) => {
    const field = (lang === "th" ? `${base}_th` : base) as keyof HomeHero;
    return hero[field] as string;
  };

  const dict = lang === "th" ? th : en;
  const previewScale =
    previewDevice === "mobile" ? 0.5 : previewDevice === "tablet" ? 0.65 : 0.55;
  const previewFrameClasses =
    previewDevice === "desktop"
      ? "w-full"
      : previewDevice === "tablet"
      ? "w-full max-w-[860px]"
      : "w-full max-w-none";

  useEffect(() => {
    const resolveDevice = () => {
      const width = window.innerWidth;
      if (width < 768) return "mobile";
      if (width < 1024) return "tablet";
      return "desktop";
    };
    const updateDevice = () => setPreviewDevice(resolveDevice());
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  useEffect(() => {
    const node = previewRef.current;
    if (!node) return;
    const handle = window.requestAnimationFrame(() => {
      setPreviewHeight(node.scrollHeight);
    });
    return () => window.cancelAnimationFrame(handle);
  }, [previewDevice, lang, mode, hero, styles, codeLines, capabilities]);

  const codeText = codeLines.map(line => line.line).join("\n");

  const handleCodeChange = (value: string) => {
    const next = value.split("\n").map((line, index) => ({
      id: codeLines[index]?.id || `code-${index}-${Date.now()}`,
      line,
      orderIndex: index,
    }));
    onCodeLinesChange(next);
  };

  const handleCapabilityChange = (index: number, next: Partial<HomeHeroCapability>) => {
    const updated = capabilities.map((cap, idx) =>
      idx === index ? { ...cap, ...next } : cap
    );
    onCapabilitiesChange(updated);
  };

  const addCapability = () => {
    const next: HomeHeroCapability = {
      id: `cap-${Date.now()}`,
      label: "ความสามารถใหม่",
      label_th: "ความสามารถใหม่",
      icon: "diamond",
      orderIndex: capabilities.length,
    };
    onCapabilitiesChange([...capabilities, next]);
  };

  const removeCapability = (index: number) => {
    const updated = capabilities.filter((_, idx) => idx !== index);
    onCapabilitiesChange(updated);
  };

  const fields = useMemo(
    () => [
      {
        id: "badge",
        label: "ป้ายกำกับ (Badge)",
        base: "badge",
        type: "text" as const,
        fontBase: "badgeFontFamily",
        sizeKey: "badgeFontSize" as keyof HomeHeroStyles,
        colorBase: "badgeTextColor",
        extra: [
          { label: "สีขอบ", base: "badgeBorderColor" },
          { label: "สีพื้นหลัง", base: "badgeBgColor" },
          { label: "สีจุด", base: "badgeDotColor" },
        ],
      },
      {
        id: "title",
        label: "หัวข้อ (Title)",
        base: "title",
        type: "text" as const,
        fontBase: "titleFontFamily",
        sizeKey: "titleFontSize" as keyof HomeHeroStyles,
        colorBase: "titleColor",
      },
      {
        id: "accent",
        label: "ข้อความเน้น (Accent)",
        base: "accent",
        type: "text" as const,
        fontBase: "accentFontFamily",
        sizeKey: "accentFontSize" as keyof HomeHeroStyles,
        colorBase: "accentColor",
        gradient: true,
      },
      {
        id: "description",
        label: "คำอธิบาย (Description)",
        base: "description",
        type: "textarea" as const,
        fontBase: "descriptionFontFamily",
        sizeKey: "descriptionFontSize" as keyof HomeHeroStyles,
        colorBase: "descriptionColor",
      },
      {
        id: "primaryCta",
        label: "ปุ่มหลัก (Primary CTA)",
        base: "primaryCta",
        type: "text" as const,
        fontBase: "ctaFontFamily",
        sizeKey: "ctaFontSize" as keyof HomeHeroStyles,
        colorBase: "primaryCtaText",
        bgBase: "primaryCtaBg",
        linkKey: "primaryCtaHref" as keyof HomeHero,
      },
      {
        id: "secondaryCta",
        label: "ปุ่มรอง (Secondary CTA)",
        base: "secondaryCta",
        type: "text" as const,
        fontBase: "ctaFontFamily",
        sizeKey: "ctaFontSize" as keyof HomeHeroStyles,
        colorBase: "secondaryCtaText",
        bgBase: "secondaryCtaBg",
        borderBase: "secondaryCtaBorder",
        linkKey: "secondaryCtaHref" as keyof HomeHero,
      },
      {
        id: "statusLabel",
        label: "ป้ายสถานะ (Status Label)",
        base: "statusLabel",
        type: "text" as const,
        fontBase: "statusLabelFontFamily",
        sizeKey: "statusLabelFontSize" as keyof HomeHeroStyles,
        colorBase: "statusLabelColor",
      },
      {
        id: "statusValue",
        label: "ค่าสถานะ (Status Value)",
        base: "statusValue",
        type: "text" as const,
        fontBase: "statusValueFontFamily",
        sizeKey: "statusValueFontSize" as keyof HomeHeroStyles,
        colorBase: "statusValueColor",
      },
    ],
    []
  );

  const currentField = activeIndex !== null ? fields[activeIndex] : null;

  const panelWidth = `${100 * fields.length}%`;
  const panelOffset = activeIndex !== null ? `-${(100 / fields.length) * activeIndex}%` : "0%";

  const accentGradientEnabled = Boolean(
    styles[buildModeKey("accentGradientEnabled", mode)]
  );

  const handleSwipeStart = (event: React.TouchEvent<HTMLDivElement>) => {
    swipeStartX.current = event.touches[0]?.clientX ?? null;
    swipeDeltaX.current = 0;
  };

  const handleSwipeMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null) return;
    swipeDeltaX.current = event.touches[0].clientX - swipeStartX.current;
  };

  const handleSwipeEnd = () => {
    if (swipeStartX.current === null || activeIndex === null) return;
    const delta = swipeDeltaX.current;
    swipeStartX.current = null;
    swipeDeltaX.current = 0;
    if (Math.abs(delta) < 60) return;
    setActiveIndex(prev => {
      if (prev === null) return prev;
      if (delta > 0) return Math.max(prev - 1, 0);
      return Math.min(prev + 1, fields.length - 1);
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="contents lg:block lg:col-span-7">
          <div
            className="sticky space-y-6"
            style={{ top: "var(--admin-nav-offset, var(--admin-nav-height, 96px))" }}
          >
            <div className="relative overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border border-[#3a2f1d] bg-transparent sm:bg-[#1a1612] shadow-none sm:shadow-2xl">
              <div className="w-full overflow-hidden px-0 sm:px-6 py-3 sm:py-6">
                <div
                  className={cn("mx-auto w-full overflow-hidden", previewFrameClasses)}
                  style={
                    previewHeight
                      ? { height: `${Math.round(previewHeight * previewScale)}px` }
                      : undefined
                  }
                >
                  <div
                    ref={previewRef}
                    className="admin-preview origin-top-left pointer-events-none [&_*]:!animate-none [&_*]:!transition-none"
                    style={{
                      transform: `scale(${previewScale})`,
                      width: `${100 / previewScale}%`,
                    }}
                  >
                    <Hero
                      dict={dict}
                      locale={lang}
                      mode={mode}
                      previewDevice={previewDevice}
                      content={hero}
                      styles={styles}
                      codeLines={codeLines}
                      capabilities={capabilities}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6 lg:pr-2">
          <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
                ข้อความ & การออกแบบ
              </h4>
              <Type className="size-4 text-[#f4af25]" />
            </div>

            <div className="space-y-4">
              {[["badge"], ["title", "accent"], ["description"], ["primaryCta", "secondaryCta"], ["statusLabel", "statusValue"]].map(row => {
                const rowFields = row
                  .map(id => fields.find(field => field.id === id))
                  .filter(Boolean) as typeof fields;

                return (
                  <div
                    key={row.join("-")}
                    className={cn(
                      "grid gap-3",
                      rowFields.length === 2 ? "sm:grid-cols-2" : "grid-cols-1"
                    )}
                  >
                    {rowFields.map(field => {
                      const value = heroText(field.base) || "";
                      const index = fields.findIndex(item => item.id === field.id);

                      return (
                        <button
                          key={field.id}
                          type="button"
                          onClick={() => setActiveIndex(index)}
                          className="w-full text-left rounded-xl border border-white/5 bg-[#1a1612] px-4 py-3 flex items-center justify-between gap-4 hover:border-[#f4af25]/40 transition"
                        >
                          <div className="space-y-1">
                            <div className="text-[10px] uppercase tracking-widest text-[#cbb790]/60 font-bold">
                              {field.label}
                            </div>
                            <div className="text-sm text-white/80 line-clamp-2">
                              {value || "—"}
                            </div>
                          </div>
                          <div className="size-9 rounded-full border border-white/10 bg-[#120f0b] text-[#cbb790] flex items-center justify-center">
                            <Type className="size-4" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-6 space-y-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="size-9 rounded-lg bg-[#1a1612] flex items-center justify-center text-[#f4af25]">
                <Code2 className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">กล่องโค้ด (Code Block)</h3>
                <p className="text-[10px] text-[#cbb790]/60 uppercase tracking-wider">
                  แสดงตัวอย่างโค้ดและชื่อไฟล์
                </p>
              </div>
            </div>
            <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
              ชื่อไฟล์
              <input
                className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                value={hero.codeFilename || ""}
                onChange={e => updateHeroField("codeFilename", e.target.value)}
              />
            </label>
            <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
              บรรทัดโค้ด
              <textarea
                className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-4 py-3 text-xs text-white font-mono resize-none"
                rows={8}
                value={codeText}
                onChange={e => handleCodeChange(e.target.value)}
              />
            </label>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-[#1a1612] flex items-center justify-center text-[#f4af25]">
                  <GripVertical className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">ความสามารถ (Capabilities)</h3>
                  <p className="text-[10px] text-[#cbb790]/60 uppercase tracking-wider">
                    รายการป้ายกำกับ ({lang.toUpperCase()})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={addCapability}
                className="flex items-center gap-2 text-xs font-semibold text-[#f4af25]"
              >
                <Plus className="size-4" />
                เพิ่ม
              </button>
            </div>

            <div className="space-y-3">
              {capabilities.map((cap, index) => (
                <div key={cap.id} className="rounded-xl border border-white/10 p-4 space-y-3 bg-[#1a1612]">
                  <div className="grid gap-3 sm:grid-cols-[1fr_140px] items-end">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#cbb790]/60">
                      ชื่อ
                      <input
                        className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                        value={lang === "th" ? cap.label_th || "" : cap.label || ""}
                        onChange={e =>
                          handleCapabilityChange(index, {
                            ...(lang === "th"
                              ? { label_th: e.target.value }
                              : { label: e.target.value }),
                          })
                        }
                      />
                    </label>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#cbb790]/60">
                      ไอคอน
                      <select
                        className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white"
                        value={cap.icon}
                        onChange={e => handleCapabilityChange(index, { icon: e.target.value })}
                      >
                        {iconOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCapability(index)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    ลบรายการนี้
                  </button>
                </div>
              ))}
              {capabilities.length === 0 && (
                <div className="text-xs text-[#cbb790]/60">ยังไม่มีรายการ</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {currentField && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-end px-0 sm:px-6 pb-0 sm:pb-5"
          style={{ paddingTop: "calc(var(--admin-nav-height, 96px) + 20px)" }}
        >
          <div className="w-full max-w-none sm:max-w-md max-h-[84vh] sm:max-h-[58vh] overflow-y-auto rounded-none sm:rounded-2xl border border-[#3a2f1d] bg-[#1a1612] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#bfa67a]">กำลังแก้ไข</div>
                <div className="text-lg font-semibold text-white">{currentField.label}</div>
              </div>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="size-9 rounded-full border border-white/10 bg-[#120f0b] flex items-center justify-center text-[#cbb790]"
              >
                <X className="size-4" />
              </button>
            </div>

            <div
              className="relative overflow-hidden"
              onTouchStart={handleSwipeStart}
              onTouchMove={handleSwipeMove}
              onTouchEnd={handleSwipeEnd}
            >
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
                style={{ width: panelWidth, transform: `translateX(${panelOffset})` }}
              >
                {fields.map(field => {
                  const value = heroText(field.base) || "";
                  const linkValue = field.linkKey ? (hero[field.linkKey] as string) : "";
                  const colorValue =
                    (styles[buildModeKey(field.colorBase, mode) as keyof HomeHeroStyles] as string) ||
                    "";
                  const bgValue = field.bgBase
                    ? (styles[buildModeKey(field.bgBase, mode) as keyof HomeHeroStyles] as string)
                    : undefined;
                  const borderValue = field.borderBase
                    ? (styles[buildModeKey(field.borderBase, mode) as keyof HomeHeroStyles] as string)
                    : undefined;

                  return (
                    <div key={field.id} className="w-full px-6 py-5 space-y-4">
                      {field.type === "textarea" ? (
                        <textarea
                          className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white resize-none"
                          rows={4}
                          value={value}
                          onChange={e => updateHeroText(field.base, e.target.value)}
                        />
                      ) : (
                        <input
                          className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white"
                          value={value}
                          onChange={e => updateHeroText(field.base, e.target.value)}
                        />
                      )}

                      {field.linkKey && (
                        <input
                          className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-2 text-xs text-white"
                          value={linkValue || ""}
                          onChange={e => updateHeroField(field.linkKey!, e.target.value)}
                          placeholder="ลิงก์ปลายทาง (เช่น /portfolio)"
                        />
                      )}

                      <div className="grid gap-3 grid-cols-2">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                          แบบอักษร
                          <select
                            className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                            value={(styles[buildFontFamilyKey(field.fontBase, lang)] as string) || ""}
                            onChange={e => updateStyleFont(field.fontBase, e.target.value)}
                          >
                            {fontOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <SizeInput
                          label="ขนาดอักษร"
                          value={styles[field.sizeKey] as number | undefined}
                          onChange={val => updateStyle(field.sizeKey, val)}
                        />
                      </div>

                      <div className="grid gap-2 sm:gap-3 grid-cols-2">
                        <ColorInput
                          label="สีข้อความ"
                          value={colorValue}
                          onChange={val => updateStyleColor(field.colorBase, val)}
                          hideValueOnMobile
                        />
                        {field.borderBase && (
                          <ColorInput
                            label="สีขอบ"
                            value={borderValue}
                            onChange={val => updateStyleColor(field.borderBase!, val)}
                            hideValueOnMobile
                          />
                        )}
                        {field.bgBase && (
                          <ColorInput
                            label="สีพื้นหลัง"
                            value={bgValue}
                            onChange={val => updateStyleColor(field.bgBase!, val)}
                            hideValueOnMobile
                          />
                        )}
                        {field.extra?.map(extra => (
                          <ColorInput
                            key={extra.base}
                            label={extra.label}
                            value={
                              styles[buildModeKey(extra.base, mode) as keyof HomeHeroStyles] as string
                            }
                            onChange={val => updateStyleColor(extra.base, val)}
                            hideValueOnMobile
                          />
                        ))}
                      </div>

                      {field.gradient && (
                        <div className="rounded-xl border border-white/10 bg-[#120f0b] p-3 space-y-2">
                          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#cbb790]/60">
                            <span>ไล่เฉดสี (Gradient)</span>
                            <button
                              type="button"
                              onClick={() =>
                                updateStyleBool("accentGradientEnabled", !accentGradientEnabled)
                              }
                              className={cn(
                                "px-2 py-1 rounded-full text-[10px] font-semibold border",
                                accentGradientEnabled
                                  ? "bg-[#f4af25]/20 text-[#f4af25] border-[#f4af25]/30"
                                  : "bg-[#1a1612] text-[#bfa67a] border-white/10"
                              )}
                            >
                              {accentGradientEnabled ? "เปิด" : "ปิด"}
                            </button>
                          </div>
                          {accentGradientEnabled ? (
                          <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
                            <ColorInput
                              label="สีเริ่มต้น"
                              value={
                                styles[
                                  `${buildModeKey("accentGradient", mode)}Start` as keyof HomeHeroStyles
                                ] as string
                              }
                              onChange={value =>
                                updateStyle(
                                  `${buildModeKey("accentGradient", mode)}Start` as keyof HomeHeroStyles,
                                  value
                                )
                              }
                              hideValueOnMobile
                            />
                            <ColorInput
                              label="สีสิ้นสุด"
                              value={
                                styles[
                                  `${buildModeKey("accentGradient", mode)}End` as keyof HomeHeroStyles
                                ] as string
                              }
                              onChange={value =>
                                updateStyle(
                                  `${buildModeKey("accentGradient", mode)}End` as keyof HomeHeroStyles,
                                  value
                                )
                              }
                              hideValueOnMobile
                            />
                          </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
