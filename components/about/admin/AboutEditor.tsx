"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon, Plus, Trash2, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUploader from "@/components/ui/ImageUploader";
import About from "@/components/sections/About";
import { en } from "@/content/en";
import { th } from "@/content/th";
import type {
  AboutBody,
  AboutContent,
  AboutPillar,
  AboutStyles,
} from "@/lib/supabase/about";

type Props = {
  content: AboutContent;
  styles: AboutStyles;
  body: AboutBody[];
  pillars: AboutPillar[];
  lang: "en" | "th";
  mode: "light" | "dark";
  onContentChange: (content: AboutContent) => void;
  onStylesChange: (styles: AboutStyles) => void;
  onBodyChange: (body: AboutBody[]) => void;
  onPillarsChange: (pillars: AboutPillar[]) => void;
};

type PanelId =
  | "image"
  | "highlightValue"
  | "highlightLabel"
  | "eyebrow"
  | "title"
  | "accent"
  | "body"
  | "pillars"
  | null;

type PanelCard = {
  id: Exclude<PanelId, null>;
  title: string;
  desc: string;
  icon: typeof ImageIcon;
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
  10,
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
];

const buildFontFamilyKey = (base: string, lang: "en" | "th") =>
  (base + (lang === "th" ? "Th" : "En")) as keyof AboutStyles;

const buildModeKey = (base: string, mode: "light" | "dark") =>
  (base + (mode === "light" ? "Light" : "Dark")) as keyof AboutStyles;

const panelCards: PanelCard[] = [
  {
    id: "image",
    title: "รูปภาพ & พื้นหลัง",
    desc: "จัดการรูปภาพและสี Overlay",
    icon: ImageIcon,
  },
  {
    id: "highlightValue",
    title: "ตัวเลขไฮไลท์",
    desc: "สไตล์ของตัวเลข",
    icon: Type,
  },
  {
    id: "highlightLabel",
    title: "ป้ายกำกับไฮไลท์",
    desc: "สไตล์ของป้ายกำกับ",
    icon: Type,
  },
  {
    id: "eyebrow",
    title: "หัวข้อรอง (Eyebrow)",
    desc: "สไตล์หัวข้อเล็กด้านบน",
    icon: Type,
  },
  {
    id: "title",
    title: "หัวข้อหลัก (Title)",
    desc: "สไตล์หัวข้อหลัก",
    icon: Type,
  },
  {
    id: "accent",
    title: "คำเน้น (Accent)",
    desc: "สไตล์คำที่เน้นสี",
    icon: Type,
  },
  {
    id: "body",
    title: "เนื้อหา (Body Copy)",
    desc: "จัดการย่อหน้า",
    icon: Type,
  },
  {
    id: "pillars",
    title: "จุดเด่น (Pillars)",
    desc: "รายการจุดเด่น 2 คอลัมน์",
    icon: Type,
  },
];

const ColorInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) => (
  <label className="grid grid-cols-[96px_auto] items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
    <span className="text-right">{label}</span>
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        className="h-7 w-7 rounded border border-neutral-800 bg-neutral-950"
        value={value || "#000000"}
        onChange={e => onChange(e.target.value)}
      />
      <input
        className="w-24 bg-neutral-950 border border-neutral-800 rounded-md px-2 py-1 text-[10px] text-white uppercase"
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

export default function AboutEditor({
  content,
  styles,
  body,
  pillars,
  lang,
  mode,
  onContentChange,
  onStylesChange,
  onBodyChange,
  onPillarsChange,
}: Props) {
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const swipeDeltaX = useRef(0);

  const dict = lang === "th" ? th : en;

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
    const update = () => setPreviewHeight(node.scrollHeight);
    update();
    if (typeof ResizeObserver === "undefined") {
      const handle = window.requestAnimationFrame(update);
      return () => window.cancelAnimationFrame(handle);
    }
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [previewDevice, lang, mode, content, styles, body, pillars]);

  const previewScale =
    previewDevice === "mobile" ? 0.48 : previewDevice === "tablet" ? 0.65 : 0.55;
  const previewFrameClasses =
    previewDevice === "desktop"
      ? "w-full"
      : previewDevice === "tablet"
      ? "w-full max-w-[860px]"
      : "w-full max-w-none";

  const updateContentField = (field: keyof AboutContent, value: string) =>
    onContentChange({ ...content, [field]: value });

  const updateStyles = (field: keyof AboutStyles, value: string | number) =>
    onStylesChange({ ...styles, [field]: value });

  const updateStyleColor = (base: string, value: string) =>
    updateStyles(buildModeKey(base, mode), value);

  const updateStyleFont = (base: string, value: string) =>
    updateStyles(buildFontFamilyKey(base, lang), value);

  const updateStyleSize = (field: keyof AboutStyles, value: number) =>
    updateStyles(field, value);

  const updateBodyItem = (index: number, value: string) => {
    const updated = body.map((item, idx) =>
      idx === index
        ? {
            ...item,
            ...(lang === "th" ? { text_th: value } : { text: value }),
          }
        : item
    );
    onBodyChange(updated);
  };

  const addBodyItem = () => {
    const next: AboutBody = {
      id: "about-body-" + Date.now(),
      text: "New paragraph",
      text_th: "ย่อหน้าใหม่",
      orderIndex: body.length,
    };
    onBodyChange([...body, next]);
  };

  const removeBodyItem = (index: number) => {
    const updated = body.filter((_, idx) => idx !== index).map((item, idx) => ({
      ...item,
      orderIndex: idx,
    }));
    onBodyChange(updated);
  };

  const updatePillarItem = (index: number, updates: Partial<AboutPillar>) => {
    const updated = pillars.map((item, idx) => (idx === index ? { ...item, ...updates } : item));
    onPillarsChange(updated);
  };

  const addPillar = () => {
    const next: AboutPillar = {
      id: "about-pillar-" + Date.now(),
      title: "New Pillar",
      title_th: "จุดเด่นใหม่",
      body: "Add a short supporting detail.",
      body_th: "เพิ่มรายละเอียดสั้นๆ",
      orderIndex: pillars.length,
    };
    onPillarsChange([...pillars, next]);
  };

  const removePillar = (index: number) => {
    const updated = pillars.filter((_, idx) => idx !== index).map((item, idx) => ({
      ...item,
      orderIndex: idx,
    }));
    onPillarsChange(updated);
  };

  const activePanel = activeIndex !== null ? panelCards[activeIndex].id : null;
  const activeTitle = activeIndex !== null ? panelCards[activeIndex].title : "";
  const highlightLabelValue =
    lang === "th" ? content.highlightLabel_th || "" : content.highlightLabel;

  const getCardDescription = (panelId: Exclude<PanelId, null>) => {
    switch (panelId) {
      case "image":
        return "รูปภาพ";
      case "highlightValue":
        return content.highlightValue || "เพิ่มตัวเลข";
      case "highlightLabel":
        return highlightLabelValue || "เพิ่มป้ายกำกับ";
      case "eyebrow":
        return (lang === "th" ? content.eyebrow_th : content.eyebrow) || "เพิ่มหัวข้อรอง";
      case "title":
        return (lang === "th" ? content.title_th : content.title) || "เพิ่มหัวข้อหลัก";
      case "accent":
        return (lang === "th" ? content.titleAccent_th : content.titleAccent) || "เพิ่มคำเน้น";
      case "body":
        return (lang === "th" ? body[0]?.text_th : body[0]?.text) || "เพิ่มเนื้อหา";
      case "pillars":
        return (lang === "th" ? pillars[0]?.title_th : pillars[0]?.title) || "เพิ่มจุดเด่น";
      default:
        return "";
    }
  };

  const setActivePanel = (panelId: PanelId) => {
    if (!panelId) {
      setActiveIndex(null);
      return;
    }
    const nextIndex = panelCards.findIndex(card => card.id === panelId);
    setActiveIndex(nextIndex >= 0 ? nextIndex : null);
  };

  const panelWidth = `${100 * panelCards.length}%`;
  const panelOffset =
    activeIndex !== null ? `-${(100 / panelCards.length) * activeIndex}%` : "0%";

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
      return Math.min(prev + 1, panelCards.length - 1);
    });
  };

  const renderPanel = (panelId: Exclude<PanelId, null>) => {
    switch (panelId) {
      case "image":
        return (
          <>
            <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
              ลิงก์รูปภาพ (Image URL)
              <input
                className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                value={content.imageUrl}
                onChange={e => updateContentField("imageUrl", e.target.value)}
              />
            </label>

            <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
              คำอธิบายรูปภาพ (Alt Text - {lang.toUpperCase()})
              <input
                className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white"
                value={lang === "th" ? content.imageAlt_th || "" : content.imageAlt}
                onChange={e =>
                  updateContentField(
                    lang === "th" ? "imageAlt_th" : "imageAlt",
                    e.target.value
                  )
                }
              />
            </label>

            <ImageUploader
              label="อัปโหลดรูปภาพ"
              value={content.imageUrl}
              onUploaded={value => updateContentField("imageUrl", value)}
              compact
            />

            <ColorInput
              label="สี Overlay"
              value={styles[buildModeKey("imageOverlayColor", mode)] as string}
              onChange={value => updateStyleColor("imageOverlayColor", value)}
            />
          </>
        );
      case "highlightValue":
        return (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
                ตัวเลข (Value)
                <input
                  className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                  value={content.highlightValue}
                  onChange={e => updateContentField("highlightValue", e.target.value)}
                />
              </label>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                แบบอักษร
                <select
                  className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                  value={
                    (styles[buildFontFamilyKey("highlightValueFontFamily", lang)] as string) || ""
                  }
                  onChange={e => updateStyleFont("highlightValueFontFamily", e.target.value)}
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
                value={styles.highlightValueFontSize as number | undefined}
                onChange={value => updateStyleSize("highlightValueFontSize", value)}
              />
            </div>

            <ColorInput
              label="สีตัวเลข"
              value={styles[buildModeKey("highlightValueColor", mode)] as string}
              onChange={value => updateStyleColor("highlightValueColor", value)}
            />
          </>
        );
      case "highlightLabel":
        return (
          <>
            <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
              ป้ายกำกับ ({lang.toUpperCase()})
              <input
                className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                value={highlightLabelValue}
                onChange={e =>
                  updateContentField(
                    lang === "th" ? "highlightLabel_th" : "highlightLabel",
                    e.target.value
                  )
                }
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                แบบอักษร
                <select
                  className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                  value={
                    (styles[buildFontFamilyKey("highlightLabelFontFamily", lang)] as string) || ""
                  }
                  onChange={e => updateStyleFont("highlightLabelFontFamily", e.target.value)}
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
                value={styles.highlightLabelFontSize as number | undefined}
                onChange={value => updateStyleSize("highlightLabelFontSize", value)}
              />
            </div>

            <ColorInput
              label="สีป้ายกำกับ"
              value={styles[buildModeKey("highlightLabelColor", mode)] as string}
              onChange={value => updateStyleColor("highlightLabelColor", value)}
            />
          </>
        );
      case "eyebrow":
        return (
          <>
            <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
              หัวข้อรอง ({lang.toUpperCase()})
              <input
                className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                value={lang === "th" ? content.eyebrow_th || "" : content.eyebrow}
                onChange={e =>
                  updateContentField(
                    lang === "th" ? "eyebrow_th" : "eyebrow",
                    e.target.value
                  )
                }
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                แบบอักษร
                <select
                  className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                  value={(styles[buildFontFamilyKey("eyebrowFontFamily", lang)] as string) || ""}
                  onChange={e => updateStyleFont("eyebrowFontFamily", e.target.value)}
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
                value={styles.eyebrowFontSize as number | undefined}
                onChange={value => updateStyleSize("eyebrowFontSize", value)}
              />
            </div>

            <ColorInput
              label="สีข้อความ"
              value={styles[buildModeKey("eyebrowColor", mode)] as string}
              onChange={value => updateStyleColor("eyebrowColor", value)}
            />
          </>
        );
      case "title":
        return (
          <>
            <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
              หัวข้อหลัก ({lang.toUpperCase()})
              <input
                className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                value={lang === "th" ? content.title_th || "" : content.title}
                onChange={e =>
                  updateContentField(lang === "th" ? "title_th" : "title", e.target.value)
                }
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                แบบอักษร
                <select
                  className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                  value={(styles[buildFontFamilyKey("titleFontFamily", lang)] as string) || ""}
                  onChange={e => updateStyleFont("titleFontFamily", e.target.value)}
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
                value={styles.titleFontSize as number | undefined}
                onChange={value => updateStyleSize("titleFontSize", value)}
              />
            </div>

            <ColorInput
              label="สีข้อความ"
              value={styles[buildModeKey("titleColor", mode)] as string}
              onChange={value => updateStyleColor("titleColor", value)}
            />
          </>
        );
      case "accent":
        return (
          <>
            <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
              คำเน้น ({lang.toUpperCase()})
              <input
                className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                value={lang === "th" ? content.titleAccent_th || "" : content.titleAccent}
                onChange={e =>
                  updateContentField(
                    lang === "th" ? "titleAccent_th" : "titleAccent",
                    e.target.value
                  )
                }
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                แบบอักษร
                <select
                  className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                  value={
                    (styles[buildFontFamilyKey("titleAccentFontFamily", lang)] as string) || ""
                  }
                  onChange={e => updateStyleFont("titleAccentFontFamily", e.target.value)}
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
                value={styles.titleAccentFontSize as number | undefined}
                onChange={value => updateStyleSize("titleAccentFontSize", value)}
              />
            </div>

            <ColorInput
              label="สีข้อความ"
              value={styles[buildModeKey("titleAccentColor", mode)] as string}
              onChange={value => updateStyleColor("titleAccentColor", value)}
            />
          </>
        );
      case "body":
        return (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                แบบอักษร
                <select
                  className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                  value={(styles[buildFontFamilyKey("bodyFontFamily", lang)] as string) || ""}
                  onChange={e => updateStyleFont("bodyFontFamily", e.target.value)}
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
                value={styles.bodyFontSize as number | undefined}
                onChange={value => updateStyleSize("bodyFontSize", value)}
              />
            </div>

            <ColorInput
              label="สีข้อความ"
              value={styles[buildModeKey("bodyColor", mode)] as string}
              onChange={value => updateStyleColor("bodyColor", value)}
            />

            <div className="space-y-3">
              {body.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/10 p-4 bg-[#1a1612] space-y-3"
                >
                  <textarea
                    className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none"
                    rows={4}
                    value={lang === "th" ? item.text_th || "" : item.text}
                    onChange={e => updateBodyItem(index, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeBodyItem(index)}
                    className="text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-2"
                  >
                    <Trash2 className="size-4" />
                    ลบย่อหน้านี้
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addBodyItem}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#f4af25]"
            >
              <Plus className="size-4" />
              เพิ่มย่อหน้าใหม่
            </button>
          </>
        );
      case "pillars":
        return (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                แบบอักษรหัวข้อ
                <select
                  className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                  value={
                    (styles[buildFontFamilyKey("pillarTitleFontFamily", lang)] as string) || ""
                  }
                  onChange={e => updateStyleFont("pillarTitleFontFamily", e.target.value)}
                >
                  {fontOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <SizeInput
                label="ขนาดหัวข้อ"
                value={styles.pillarTitleFontSize as number | undefined}
                onChange={value => updateStyleSize("pillarTitleFontSize", value)}
              />
            </div>

            <ColorInput
              label="สีหัวข้อ"
              value={styles[buildModeKey("pillarTitleColor", mode)] as string}
              onChange={value => updateStyleColor("pillarTitleColor", value)}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                แบบอักษรเนื้อหา
                <select
                  className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                  value={
                    (styles[buildFontFamilyKey("pillarBodyFontFamily", lang)] as string) || ""
                  }
                  onChange={e => updateStyleFont("pillarBodyFontFamily", e.target.value)}
                >
                  {fontOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <SizeInput
                label="ขนาดเนื้อหา"
                value={styles.pillarBodyFontSize as number | undefined}
                onChange={value => updateStyleSize("pillarBodyFontSize", value)}
              />
            </div>

            <ColorInput
              label="สีเนื้อหา"
              value={styles[buildModeKey("pillarBodyColor", mode)] as string}
              onChange={value => updateStyleColor("pillarBodyColor", value)}
            />

            <div className="space-y-3">
              {pillars.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/10 p-4 bg-[#1a1612] space-y-3"
                >
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
                    หัวข้อ ({lang.toUpperCase()})
                    <input
                      className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                      value={lang === "th" ? item.title_th || "" : item.title}
                      onChange={e =>
                        updatePillarItem(index, {
                          ...(lang === "th" ? { title_th: e.target.value } : { title: e.target.value }),
                        })
                      }
                    />
                  </label>
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
                    เนื้อหา ({lang.toUpperCase()})
                    <textarea
                      className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none"
                      rows={3}
                      value={lang === "th" ? item.body_th || "" : item.body}
                      onChange={e =>
                        updatePillarItem(index, {
                          ...(lang === "th" ? { body_th: e.target.value } : { body: e.target.value }),
                        })
                      }
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => removePillar(index)}
                    className="text-xs text-red-400 hover:text-red-300 inline-flex items-center gap-2"
                  >
                    <Trash2 className="size-4" />
                    ลบจุดเด่นนี้
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addPillar}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#f4af25]"
            >
              <Plus className="size-4" />
              เพิ่มจุดเด่นใหม่
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-0 sm:gap-6 lg:grid-cols-12">
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
                      ? { height: String(Math.round(previewHeight * previewScale)) + "px" }
                      : undefined
                  }
                >
                  <div
                    ref={previewRef}
                    className={cn(
                      "admin-preview origin-top-left [&_*]:!animate-none [&_*]:!transition-none",
                      previewDevice === "mobile" ? "pointer-events-auto" : "pointer-events-none"
                    )}
                    style={{
                      transform: "scale(" + previewScale + ")",
                      width: String(100 / previewScale) + "%",
                    }}
                  >
                    <About
                      dict={dict}
                      locale={lang}
                      mode={mode}
                      previewDevice={previewDevice}
                      content={content}
                      styles={styles}
                      body={body}
                      pillars={pillars}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6 lg:pr-2">
          <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
                ตั้งค่าส่วนเกี่ยวกับเรา
              </h4>
            </div>

            <div className="grid gap-3">
              {panelCards.map(card => {
                const Icon = card.icon;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setActivePanel(card.id)}
                    className="w-full text-left rounded-xl border border-white/5 bg-[#1a1612] px-4 py-3 flex items-center justify-between gap-4 hover:border-[#f4af25]/40 transition"
                  >
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-widest text-[#cbb790]/60 font-bold">
                        {card.title}
                      </div>
                      <div className="text-sm text-white/80">{getCardDescription(card.id)}</div>
                    </div>
                    <div className="size-9 rounded-full border border-white/10 bg-[#120f0b] text-[#cbb790] flex items-center justify-center">
                      <Icon className="size-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {activePanel && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-end px-0 sm:px-6 pb-0 sm:pb-5"
          style={{ paddingTop: "calc(var(--admin-nav-height, 96px) + 20px)" }}
        >
          <div className="w-full max-w-none sm:max-w-md h-[80vh] sm:h-[60vh] min-h-0 overflow-hidden rounded-none sm:rounded-2xl border border-[#3a2f1d] bg-[#1a1612] shadow-[0_30px_80px_rgba(0,0,0,0.55)] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#bfa67a]">กำลังแก้ไข</div>
                <div className="text-lg font-semibold text-white">{activeTitle}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(prev => (prev === null ? prev : Math.max(prev - 1, 0)))
                  }
                  disabled={activeIndex === 0}
                  className="size-9 rounded-full border border-white/10 bg-[#120f0b] flex items-center justify-center text-[#cbb790] disabled:opacity-40"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(prev =>
                      prev === null ? prev : Math.min(prev + 1, panelCards.length - 1)
                    )
                  }
                  disabled={activeIndex === panelCards.length - 1}
                  className="size-9 rounded-full border border-white/10 bg-[#120f0b] flex items-center justify-center text-[#cbb790] disabled:opacity-40"
                >
                  <ChevronRight className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActivePanel(null)}
                  className="size-9 rounded-full border border-white/10 bg-[#120f0b] flex items-center justify-center text-[#cbb790]"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            <div
              className="overflow-hidden flex-1 min-h-0"
              onTouchStart={handleSwipeStart}
              onTouchMove={handleSwipeMove}
              onTouchEnd={handleSwipeEnd}
            >
              <div
                className="flex h-full min-h-0 transition-transform duration-300 ease-out"
                style={{ width: panelWidth, transform: `translateX(${panelOffset})` }}
              >
                {panelCards.map(card => (
                  <div
                    key={card.id}
                    className="w-full px-6 py-5 space-y-5 overflow-y-auto h-full min-h-0"
                  >
                    {renderPanel(card.id)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
