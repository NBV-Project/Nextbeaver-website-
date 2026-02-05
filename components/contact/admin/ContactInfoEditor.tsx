"use client";

import { useMemo, useRef, useState } from "react";
import { Type, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContactContent, ContactStyles } from "@/lib/supabase/contact";

type Props = {
  content: ContactContent;
  styles: ContactStyles;
  lang: "en" | "th";
  mode: "light" | "dark";
  onChange: (content: ContactContent, styles: ContactStyles) => void;
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

const fontSizes = [12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

const buildFontFamilyKey = (base: string, lang: "en" | "th") =>
  `${base}${lang === "th" ? "Th" : "En"}` as keyof ContactStyles;

const buildModeKey = (base: string, mode: "light" | "dark") =>
  `${base}${mode === "light" ? "Light" : "Dark"}` as keyof ContactStyles;

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
        className="h-7 w-7 rounded border border-neutral-800 bg-neutral-950"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        className={cn(
          "w-20 bg-neutral-950 border border-neutral-800 rounded-md px-2 py-1 text-[10px] text-white uppercase",
          hideValueOnMobile && "hidden sm:block"
        )}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
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
      onChange={(e) => onChange(Number(e.target.value))}
    >
      <option value="">อัตโนมัติ</option>
      {fontSizes.map((size) => (
        <option key={size} value={size}>
          {size}px
        </option>
      ))}
    </select>
  </label>
);

export default function ContactInfoEditor({ content, styles, lang, mode, onChange }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const swipeDeltaX = useRef(0);

  const updateContent = (field: keyof ContactContent, value: string) => {
    onChange({ ...content, [field]: value }, styles);
  };

  const updateContentText = (base: string, value: string) => {
    const field = (lang === "th" ? `${base}_th` : base) as keyof ContactContent;
    updateContent(field, value);
  };

  const updateStyle = (field: keyof ContactStyles, value: string | number) => {
    onChange(content, { ...styles, [field]: value });
  };

  const updateStyleFont = (base: string, value: string) =>
    updateStyle(buildFontFamilyKey(base, lang), value);

  const updateStyleColor = (base: string, value: string) =>
    updateStyle(buildModeKey(base, mode), value);

  const getContentText = (base: string) => {
    const field = (lang === "th" ? `${base}_th` : base) as keyof ContactContent;
    return (content[field] as string) || "";
  };

  const fields = useMemo(
    () => [
      {
        id: "eyebrow",
        label: "หัวข้อรอง (บนสุด)",
        base: "eyebrow",
        type: "text",
        fontBase: "eyebrowFontFamily",
        sizeKey: "eyebrowFontSize" as keyof ContactStyles,
        colorBase: "eyebrowColor",
      },
      {
        id: "titleTop",
        label: "หัวข้อหลัก (บรรทัดบน)",
        base: "titleTop",
        type: "text",
        fontBase: "titleFontFamily",
        sizeKey: "titleFontSize" as keyof ContactStyles,
        colorBase: "titleColor",
      },
      {
        id: "titleBottom",
        label: "หัวข้อหลัก (บรรทัดล่าง)",
        base: "titleBottom",
        type: "text",
        fontBase: "titleFontFamily",
        sizeKey: "titleFontSize" as keyof ContactStyles,
        colorBase: "titleColor",
      },
      {
        id: "body",
        label: "รายละเอียด/เนื้อหา",
        base: "body",
        type: "textarea",
        fontBase: "bodyFontFamily",
        sizeKey: "bodyFontSize" as keyof ContactStyles,
        colorBase: "bodyColor",
      },
      {
        id: "email",
        label: "ส่วนแสดงอีเมล",
        base: "email",
        isShared: true, // Not localized
        type: "text",
        fontBase: "infoFontFamily",
        sizeKey: "infoFontSize" as keyof ContactStyles,
        colorBase: "infoColor",
        extra: [
          { label: "สีป้ายกำกับ", base: "labelColor" },
          { label: "สีไอคอน", base: "iconColor" },
          { label: "สีพื้นหลังไอคอน", base: "iconBg" },
        ],
      },
      {
        id: "location",
        label: "ส่วนแสดงที่อยู่",
        base: "location",
        type: "text",
        fontBase: "infoFontFamily",
        sizeKey: "infoFontSize" as keyof ContactStyles,
        colorBase: "infoColor",
      },
    ],
    []
  );

  const currentField = activeIndex !== null ? fields[activeIndex] : null;
  const panelWidth = `${100 * fields.length}%`;
  const panelOffset = activeIndex !== null ? `-${(100 / fields.length) * activeIndex}%` : "0%";

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
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      if (delta > 0) return Math.max(prev - 1, 0);
      return Math.min(prev + 1, fields.length - 1);
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
            ข้อมูลการติดต่อ & ดีไซน์
          </h4>
          <Type className="size-4 text-[#f4af25]" />
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => {
            const value = field.isShared ? content[field.base as keyof ContactContent] : getContentText(field.base);
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
                  <div className="text-sm text-white/80 line-clamp-1">{value || "—"}</div>
                </div>
                <div className="size-9 rounded-full border border-white/10 bg-[#120f0b] text-[#cbb790] flex items-center justify-center">
                  <Type className="size-4" />
                </div>
              </button>
            );
          })}
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
                {fields.map((field) => {
                  const value = field.isShared
                    ? (content[field.base as keyof ContactContent] as string)
                    : getContentText(field.base);
                  const colorValue = (styles[buildModeKey(field.colorBase, mode)] as string) || "";

                  return (
                    <div key={field.id} className="w-full px-6 py-5 space-y-4">
                      {field.type === "textarea" ? (
                        <textarea
                          className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white resize-none"
                          rows={4}
                          value={value}
                          onChange={(e) =>
                            field.isShared
                              ? updateContent(field.base as keyof ContactContent, e.target.value)
                              : updateContentText(field.base, e.target.value)
                          }
                        />
                      ) : (
                        <input
                          className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white"
                          value={value}
                          onChange={(e) =>
                            field.isShared
                              ? updateContent(field.base as keyof ContactContent, e.target.value)
                              : updateContentText(field.base, e.target.value)
                          }
                        />
                      )}

                      <div className="grid gap-3 grid-cols-2">
                        <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                          แบบอักษร
                          <select
                            className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                            value={(styles[buildFontFamilyKey(field.fontBase, lang)] as string) || ""}
                            onChange={(e) => updateStyleFont(field.fontBase, e.target.value)}
                          >
                            {fontOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </label>
                        <SizeInput
                          label="ขนาดอักษร"
                          value={styles[field.sizeKey] as number | undefined}
                          onChange={(val) => updateStyle(field.sizeKey, val)}
                        />
                      </div>

                      <div className="grid gap-2 sm:gap-3 grid-cols-2">
                        <ColorInput
                          label="สีข้อความ"
                          value={colorValue}
                          onChange={(val) => updateStyleColor(field.colorBase, val)}
                          hideValueOnMobile
                        />
                        {field.extra?.map((extra) => (
                          <ColorInput
                            key={extra.base}
                            label={extra.label}
                            value={
                              styles[buildModeKey(extra.base, mode)] as string
                            }
                            onChange={(val) => updateStyleColor(extra.base, val)}
                            hideValueOnMobile
                          />
                        ))}
                      </div>
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