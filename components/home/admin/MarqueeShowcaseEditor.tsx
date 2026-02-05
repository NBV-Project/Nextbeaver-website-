"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Type,
  X,
  GalleryHorizontal,
  Plus,
  Trash2,
  Upload,
  GripVertical,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import MarqueeShowcase from "@/components/sections/MarqueeShowcase";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import type {
  HomeMarqueeShowcase,
  HomeMarqueeStyles,
  HomeMarqueeItem,
} from "@/lib/supabase/home";

type Props = {
  content: HomeMarqueeShowcase;
  styles: HomeMarqueeStyles;
  items: HomeMarqueeItem[];
  lang: "en" | "th";
  mode: "light" | "dark";
  onContentChange: (content: HomeMarqueeShowcase) => void;
  onStylesChange: (styles: HomeMarqueeStyles) => void;
  onItemsChange: (items: HomeMarqueeItem[]) => void;
};

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "portfolio-assets";
const MAX_FILE_MB = 2;

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
  12, 14, 16, 18, 20, 22, 24, 28, 30, 32, 36, 40, 48, 56, 60, 64, 72, 80, 96,
];

const buildFontFamilyKey = (base: string, lang: "en" | "th") =>
  `${base}${lang === "th" ? "Th" : "En"}` as keyof HomeMarqueeStyles;

const buildModeKey = (base: string, mode: "light" | "dark") =>
  `${base}${mode === "light" ? "Light" : "Dark"}` as keyof HomeMarqueeStyles;

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `mq-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const normalizeOrder = (list: HomeMarqueeItem[]) =>
  list.map((item, index) => ({ ...item, orderIndex: index }));

// --- Reusable UI Helpers ---

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

// --- Sortable Item for DND ---

function SortableMarqueeItem({ item, index, onRemove, onReplace }: { item: HomeMarqueeItem; index: number; onRemove: (idx: number) => void; onReplace: (idx: number, file: File) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const inputRef = useRef<HTMLInputElement>(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-[#15110d] p-2 transition-colors",
        isDragging ? "border-primary/60 bg-primary/10 z-50" : "hover:border-primary/30"
      )}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onReplace(index, file);
            e.target.value = "";
          }
        }}
      />
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <button
          type="button"
          className="cursor-grab text-white/20 hover:text-white/40 active:cursor-grabbing p-1"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
        <div
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
          className="size-10 shrink-0 rounded bg-white/5 flex items-center justify-center p-1 overflow-hidden cursor-pointer hover:ring-1 hover:ring-primary/50 transition-all"
          title="คลิกเพื่อเปลี่ยนรูปภาพ"
        >
          {item.src ? (
            <Image
              src={item.src}
              alt="thumb"
              width={120}
              height={120}
              className="max-h-full max-w-full object-contain pointer-events-none"
              unoptimized
            />
          ) : (
            <span className="text-[8px] text-white/30 pointer-events-none">No Img</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-white/40 truncate select-none">
            {item.src.split("/").pop()}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

// --- Static Item for SSR (Prevents Hydration Mismatch) ---

function StaticMarqueeItem({ item, index, onRemove, onReplace }: { item: HomeMarqueeItem; index: number; onRemove: (idx: number) => void; onReplace: (idx: number, file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div
      className={cn(
        "relative group flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-[#15110d] p-2 transition-colors hover:border-primary/30"
      )}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onReplace(index, file);
            e.target.value = "";
          }
        }}
      />
      <div className="flex items-center gap-3 flex-1 overflow-hidden">
        <button type="button" className="cursor-grab text-white/20 hover:text-white/40 active:cursor-grabbing p-1">
          <GripVertical className="size-4" />
        </button>
        <div
          onMouseDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();
            inputRef.current?.click();
          }}
          className="size-10 shrink-0 rounded bg-white/5 flex items-center justify-center p-1 overflow-hidden cursor-pointer hover:ring-1 hover:ring-primary/50 transition-all"
        >
          {item.src ? (
            <Image
              src={item.src}
              alt="thumb"
              width={120}
              height={120}
              className="max-h-full max-w-full object-contain pointer-events-none"
              unoptimized
            />
          ) : (
            <span className="text-[8px] text-white/30 pointer-events-none">No Img</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] text-white/40 truncate select-none">
            {item.src.split("/").pop()}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-2 text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

// --- Main Editor Component ---

export default function MarqueeShowcaseEditor({
  content,
  styles,
  items,
  lang,
  mode,
  onContentChange,
  onStylesChange,
  onItemsChange,
}: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preview Refs & State
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const [scale, setScale] = useState(0.5); // Default start scale
  const [mounted, setMounted] = useState(false);

  // Swipe logic for mobile panel
  const swipeStartX = useRef<number | null>(null);
  const swipeDeltaX = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const updateScale = () => {
      // Simple responsive scale logic: 0.5 for mobile, 0.65 for desktop
      const isDesktop = window.innerWidth >= 1024;
      setScale(isDesktop ? 0.65 : 0.5);
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const node = previewRef.current;
    if (!node) return;
    const handle = window.requestAnimationFrame(() => {
      setPreviewHeight(node.scrollHeight);
    });
    return () => window.cancelAnimationFrame(handle);
  }, [lang, mode, content, styles, items]);

  // Field Config
  const fields = useMemo(
    () => [
      {
        id: "badge",
        label: "ป้ายกำกับ (Badge)",
        base: "badge",
        type: "text" as const,
        fontBase: "badgeFontFamily",
        sizeKey: "badgeFontSize" as keyof HomeMarqueeStyles,
        colorBase: "badgeColor",
      },
      {
        id: "title",
        label: "หัวข้อ (Title)",
        base: "title",
        type: "textarea" as const,
        fontBase: "titleFontFamily",
        sizeKey: "titleFontSize" as keyof HomeMarqueeStyles,
        colorBase: "titleColor",
      },
      {
        id: "heading",
        label: "พาดหัว & ไฮไลท์",
        base: "headingPrefix", // Special handler for composite
        type: "composite" as const,
        fontBase: "headingFontFamily",
        sizeKey: "headingFontSize" as keyof HomeMarqueeStyles,
        colorBase: "headingColor",
        extra: [
          { label: "สีพื้นหลังไฮไลท์", base: "highlightBgColor" },
          { label: "สีข้อความไฮไลท์", base: "highlightTextColor" },
        ]
      },
      {
        id: "description",
        label: "คำบรรยาย",
        base: "description",
        type: "textarea" as const,
        fontBase: "descFontFamily",
        sizeKey: "descFontSize" as keyof HomeMarqueeStyles,
        colorBase: "descColor",
      },
      {
        id: "cta1",
        label: "ปุ่มหลัก (Primary CTA)",
        base: "cta1Text",
        type: "text" as const,
        linkKey: "cta1Link" as keyof HomeMarqueeShowcase,
        fontBase: "ctaFontFamily", 
        noFont: true,
        bgBase: "cta1Bg",
        colorBase: "cta1TextColor",
      },
      {
        id: "cta2",
        label: "ปุ่มรอง (Secondary CTA)",
        base: "cta2Text",
        type: "text" as const,
        linkKey: "cta2Link" as keyof HomeMarqueeShowcase,
        noFont: true,
        bgBase: "cta2Bg",
        colorBase: "cta2TextColor",
        borderBase: "cta2Border",
      },
    ],
    []
  );

  const updateContentText = (base: string, value: string) => {
    const field = (lang === "th" ? `${base}_th` : base) as keyof HomeMarqueeShowcase;
    onContentChange({ ...content, [field]: value });
  };

  const updateContentField = <T extends keyof HomeMarqueeShowcase>(field: T, value: HomeMarqueeShowcase[T]) => {
    onContentChange({ ...content, [field]: value });
  };

  const updateStyle = <T extends keyof HomeMarqueeStyles>(field: T, value: HomeMarqueeStyles[T]) =>
    onStylesChange({ ...styles, [field]: value });

  const updateStyleFont = (base: string, value: string) => {
    const key = buildFontFamilyKey(base, lang);
    updateStyle(key, value as HomeMarqueeStyles[typeof key]);
  };

  const updateStyleColor = (base: string, value: string) => {
    const key = buildModeKey(base, mode);
    updateStyle(key, value as HomeMarqueeStyles[typeof key]);
  };

  const getText = (base: string) => {
    const field = (lang === "th" ? `${base}_th` : base) as keyof HomeMarqueeShowcase;
    return content[field] as string;
  };

  // --- Marquee Image Handlers ---

  const addItem = (src = "") => {
    const next: HomeMarqueeItem = {
      id: makeId(),
      src,
      alt: "",
      orderIndex: items.length,
    };
    onItemsChange(normalizeOrder([...items, next]));
  };

  const removeItem = (index: number) => {
    onItemsChange(normalizeOrder(items.filter((_, idx) => idx !== index)));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onItemsChange(normalizeOrder(arrayMove(items, oldIndex, newIndex)));
      }
    }
  };

  const handleReplaceImage = async (index: number, file: File) => {
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", DEFAULT_BUCKET);

      const res = await fetch("/api/portfolio/upload", {
        method: "POST",
        credentials: "include",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Upload failed");

      // Update specific item
      const newItems = [...items];
      newItems[index] = {
        ...newItems[index],
        src: data.url
      };
      onItemsChange(newItems);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadFiles = async (files: FileList | null) => {
    const list = files ? Array.from(files) : [];
    if (!list.length) return;

    setIsUploading(true);

    try {
      for (const file of list) {
        if (file.size > MAX_FILE_MB * 1024 * 1024) throw new Error(`Limit: ${MAX_FILE_MB}MB`);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", DEFAULT_BUCKET);

        const res = await fetch("/api/portfolio/upload", {
          method: "POST",
          credentials: "include",
          body: formData
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error ?? "Upload failed");

        addItem(data.url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleUploadFiles(e.dataTransfer.files);
  };

  // --- Panel Swipe Logic ---
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

  const currentField = activeIndex !== null ? fields[activeIndex] : null;
  const panelWidth = `${100 * fields.length}%`;
  const panelOffset = activeIndex !== null ? `-${(100 / fields.length) * activeIndex}%` : "0%";



  return (
    <div className="space-y-0 lg:space-y-6">
      <div className="grid grid-cols-1 gap-0 lg:gap-6 lg:grid-cols-12">
        {/* LEFT: Preview */}
        <div className="contents lg:block lg:col-span-7">
          <div className="sticky top-16 lg:top-24 z-30">
            {/* Premium Preview Container - Full Width on Mobile */}
            <div className="relative overflow-hidden rounded-none lg:rounded-2xl border-0 lg:border lg:border-[#3a2f1d]/30 bg-gradient-to-br from-[#1a1612] via-[#2a2419] to-[#1a1612] shadow-2xl">

              {/* Animated Background Effects */}
              <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#f4af25]/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#cbb790]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>

              {/* Header Section */}
              <div className="hidden lg:block relative z-10 px-4 lg:px-6 pt-4 lg:pt-6 pb-3 lg:pb-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-gradient-to-br from-[#f4af25] to-[#cbb790] flex items-center justify-center shadow-lg shadow-[#f4af25]/20">
                      <GalleryHorizontal className="size-5 text-[#1a1612]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">ตัวอย่างการแสดงผล</h3>
                      <p className="text-[10px] text-[#cbb790]/60 uppercase tracking-widest">Marquee Showcase</p>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest">
                      <span className="text-white/30">{lang.toUpperCase()}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-white/30">{mode === 'light' ? '☀️ สว่าง' : '🌙 มืด'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50" />
                      <span className="text-emerald-500/80 font-bold text-[10px] uppercase tracking-widest">Live</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Content Area - Scaled on Mobile */}
              <div
                className="relative z-10 overflow-hidden transition-[height] duration-300 ease-out"
                style={{
                  height: previewHeight ? `${previewHeight * scale}px` : 'auto'
                }}
              >
                {/* Container that scales with content */}
                <div
                  ref={previewRef}
                  className="origin-top-left transition-transform duration-300"
                  style={{
                    transform: `scale(${scale})`,
                    width: `${100 / scale}%`
                  }}
                >
                  {/* Actual MarqueeShowcase Component */}
                  <div className={cn(
                    "w-full [&_*]:!animate-none [&_*]:!transition-none",
                    mode === "light" ? "theme-light" : "theme-dark"
                  )}>
                    <MarqueeShowcase
                      content={content}
                      styles={styles}
                      items={items}
                      lang={lang}
                      mode={mode}
                      isAdmin={true}
                    />
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="relative z-10 px-4 lg:px-6 py-3 lg:py-4 border-t border-white/5 bg-[#120f0b]/30 backdrop-blur-sm">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
                  <span className="text-white/40">
                    <span className="text-[#f4af25] font-bold">{items.length}</span> รูปภาพ
                  </span>
                  <span className="text-white/40">
                    ความเร็ว: <span className="text-[#f4af25] font-bold">{content.marqueeSpeed}%</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6 px-4 lg:px-0 lg:pr-2 pb-24 -mt-24 lg:mt-0">

          {/* Text & Typography Controls */}
          <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
                เนื้อหา Marquee
              </h4>
              <Type className="size-4 text-[#f4af25]" />
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => {
                let displayValue = getText(field.base);
                if (field.id === "heading") {
                  displayValue = getText("headingPrefix") + getText("highlightedText") + getText("headingSuffix");
                }

                return (
                  <button
                    key={field.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="w-full text-left rounded-xl border border-white/5 bg-[#1a1612] px-4 py-3 flex items-center justify-between gap-4 hover:border-[#f4af25]/40 transition"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="text-[10px] uppercase tracking-widest text-[#cbb790]/60 font-bold">
                        {field.label}
                      </div>
                      <div className="text-sm text-white/80 line-clamp-1 truncate">
                        {displayValue || "—"}
                      </div>
                    </div>
                    <div className="size-8 shrink-0 rounded-full border border-white/10 bg-[#120f0b] text-[#cbb790] flex items-center justify-center">
                      <ChevronRight className="size-4" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Marquee Settings & Images */}
          <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
                แกลเลอรี่รูปภาพ
              </h4>
              <GalleryHorizontal className="size-4 text-[#f4af25]" />
            </div>

            {/* Speed Control */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold flex justify-between">
                <span>ความเร็วการเลื่อน</span>
                <span>{content.marqueeSpeed}%</span>
              </label>
              <input
                type="range"
                min="10"
                max="200"
                value={content.marqueeSpeed}
                onChange={e => updateContentField("marqueeSpeed", Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Drop Zone */}
            <div
              className={cn(
                "relative border-2 border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer",
                "hover:border-primary/40 hover:bg-primary/5",
                isUploading && "opacity-70"
              )}
              onMouseDown={(event) => {
                event.stopPropagation();
              }}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              onClick={(event) => {
                event.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Upload className="size-8 text-primary/40" />
              <p className="text-xs font-bold uppercase tracking-widest text-white/60">อัปโหลดรูปภาพ</p>
              {isUploading && <p className="text-[10px] text-primary animate-pulse">กำลังอัปโหลด...</p>}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={e => handleUploadFiles(e.target.files)}
              />
            </div>

            {/* Sortable List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold">
                  {items.length} รูปภาพ
                </span>
                <button
                  type="button"
                  onClick={() => addItem()}
                  className="text-[10px] uppercase font-bold text-primary flex items-center gap-1"
                >
                  <Plus className="size-3" /> เพิ่มรูปตัวอย่าง
                </button>
              </div>

              {mounted ? (
                <DndContext
                  id="marquee-editor-dnd"
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {items.map((item, idx) => (
                        <SortableMarqueeItem
                          key={item.id}
                          item={item}
                          index={idx}
                          onRemove={removeItem}
                          onReplace={handleReplaceImage}
                        />
                      ))}
                    </div>
                  </SortableContext>
                  <DragOverlay>
                    {/* Minimal drag overlay */}
                    <div className="size-10 bg-primary/20 rounded border border-primary"></div>
                  </DragOverlay>
                </DndContext>
              ) : (
                /* Static fallback for SSR/Initial Render */
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {items.map((item, idx) => (
                    <StaticMarqueeItem
                      key={item.id}
                      item={item}
                      index={idx}
                      onRemove={removeItem}
                      onReplace={handleReplaceImage}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide-up Editor Panel (Reused from HeroEditor pattern) */}
      {currentField && activeIndex !== null && (
        <div
          className="fixed inset-0 z-[120] flex items-end justify-end px-0 sm:px-6 pb-0 sm:pb-5 pointer-events-none"
          style={{ paddingTop: "calc(var(--admin-nav-height, 96px) + 20px)" }}
        >
          {/* Overlay to close */}
          <div className="absolute inset-0 pointer-events-auto" onClick={() => setActiveIndex(null)} />

          <div className="pointer-events-auto w-full max-w-none sm:max-w-md max-h-[50vh] sm:max-h-[58vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border-t sm:border border-[#3a2f1d] bg-[#1a1612] shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#1a1612] z-10">
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
                {fields.map((field) => (
                  <div key={field.id} className="w-full px-6 py-6 space-y-6">
                    {/* Input Fields */}
                    {field.id === "heading" ? (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-[#cbb790]/60">คำนำหน้า (Prefix)</label>
                          <input
                            className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white"
                            value={getText("headingPrefix") || ""}
                            onChange={e => updateContentText("headingPrefix", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-primary">คำไฮไลท์ (Highlighted)</label>
                          <input
                            className="w-full bg-[#120f0b] border border-primary/30 rounded-lg px-4 py-3 text-sm text-white"
                            value={getText("highlightedText") || ""}
                            onChange={e => updateContentText("highlightedText", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-[#cbb790]/60">คำลงท้าย (Suffix)</label>
                          <input
                            className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white"
                            value={getText("headingSuffix") || ""}
                            onChange={e => updateContentText("headingSuffix", e.target.value)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {field.type === "textarea" ? (
                          <textarea
                            className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white resize-none"
                            rows={4}
                            value={getText(field.base) || ""}
                            onChange={e => updateContentText(field.base, e.target.value)}
                          />
                        ) : (
                          <input
                            className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-3 text-sm text-white"
                            value={getText(field.base) || ""}
                            onChange={e => updateContentText(field.base, e.target.value)}
                          />
                        )}
                        {field.linkKey && (
                          <input
                            className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-2 text-xs text-white"
                            placeholder="ลิงก์ปลายทาง (เช่น /portfolio)"
                            value={content[field.linkKey] as string || ""}
                            onChange={e => updateContentField(field.linkKey!, e.target.value)}
                          />
                        )}
                      </div>
                    )}

                    <div className="h-px bg-white/5 my-4" />

                    {/* Styling Controls */}
                    <div className="space-y-4">
                      {!field.noFont && field.fontBase && (
                        <div className="grid gap-3 grid-cols-2">
                          <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                            แบบอักษร
                            <select
                              className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                              value={(styles[buildFontFamilyKey(field.fontBase, lang)] as string) || ""}
                              onChange={e => updateStyleFont(field.fontBase!, e.target.value)}
                            >
                              {fontOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          {field.sizeKey && (
                            <SizeInput
                              label="ขนาดอักษร"
                              value={styles[field.sizeKey] as number | undefined}
                              onChange={val => updateStyle(field.sizeKey!, val)}
                            />
                          )}
                        </div>
                      )}

                      <div className="grid gap-4 grid-cols-2">
                        {field.colorBase && (
                          <ColorInput
                            label="สีข้อความ"
                            value={styles[buildModeKey(field.colorBase, mode)] as string}
                            onChange={val => updateStyleColor(field.colorBase!, val)}
                            hideValueOnMobile
                          />
                        )}
                        {field.bgBase && (
                          <ColorInput
                            label="สีพื้นหลัง"
                            value={styles[buildModeKey(field.bgBase, mode)] as string}
                            onChange={val => updateStyleColor(field.bgBase!, val)}
                            hideValueOnMobile
                          />
                        )}
                        {field.borderBase && (
                          <ColorInput
                            label="สีขอบ"
                            value={styles[buildModeKey(field.borderBase, mode)] as string}
                            onChange={val => updateStyleColor(field.borderBase!, val)}
                            hideValueOnMobile
                          />
                        )}
                        {field.extra?.map(ex => (
                          <ColorInput
                            key={ex.base}
                            label={ex.label}
                            value={styles[buildModeKey(ex.base, mode)] as string}
                            onChange={val => updateStyleColor(ex.base, val)}
                            hideValueOnMobile
                          />
                        ))}
                      </div>
                    </div>
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
