"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import LogoLoop from "@/components/LogoLoop";
import ImageUploader from "@/components/ui/ImageUploader";
import type { HomeLogoItem, HomeLogoLoopSettings } from "@/lib/supabase/home";
import Image from "next/image";

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "portfolio-assets";
const MAX_FILE_MB = 2;

type Props = {
  items: HomeLogoItem[];
  settings: HomeLogoLoopSettings;
  lang: "en" | "th";
  mode: "light" | "dark";
  onItemsChange: (items: HomeLogoItem[]) => void;
  onSettingsChange: (settings: HomeLogoLoopSettings) => void;
};

type SortableRowProps = {
  item: HomeLogoItem;
  index: number;
  lang: "en" | "th";
  onOpen: (index: number) => void;
  onRemove: (index: number) => void;
};

const makeId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `logo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const normalizeOrder = (list: HomeLogoItem[]) =>
  list.map((item, index) => ({ ...item, orderIndex: index }));

function SortableLogoRow({ item, index, lang, onOpen, onRemove }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const displayName = item.src ? item.src.split("/").pop() : "ไม่มีชื่อ";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-[#15110d] p-3 transition-colors",
        isDragging ? "border-primary/60 bg-primary/10" : "hover:border-primary/30"
      )}
    >
      <button
        type="button"
        className="flex items-center gap-4 text-left flex-1"
        onClick={() => {
          if (!isDragging) onOpen(index);
        }}
      >
        <span
          className="material-symbols-outlined text-sm text-white/20"
          {...attributes}
          {...listeners}
          aria-label="ลากเพื่อย้าย"
        >
          drag_indicator
        </span>
        <div className="size-10 rounded bg-white/5 flex items-center justify-center p-2">
          {item.src ? (
            <Image
              src={item.src}
              alt="preview"
              width={40}
              height={40}
              className="max-h-full grayscale"
              unoptimized
            />
          ) : (
            <span className="text-[10px] text-white/30">ไม่มีรูป</span>
          )}
        </div>
        <div className="min-w-0">
          <div className="text-xs font-medium text-white/80 truncate">
            {displayName}
          </div>
          <div className="text-[10px] text-white/40 truncate">
            {lang === "th" ? item.alt_th || item.alt : item.alt}
          </div>
        </div>
      </button>
      <button
        type="button"
        className="text-white/20 hover:text-red-400"
        onClick={() => onRemove(index)}
        aria-label="ลบโลโก้"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

export default function LogoLoopEditor({
  items,
  settings,
  lang,
  mode,
  onItemsChange,
  onSettingsChange,
}: Props) {
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);
  const swipeDeltaX = useRef(0);
  const swipeDeltaY = useRef(0);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 6 } })
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () => setIsMobilePreview(window.innerWidth < 640);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const updateSetting = (key: keyof HomeLogoLoopSettings, value: string | number | boolean) =>
    onSettingsChange({ ...settings, [key]: value } as HomeLogoLoopSettings);

  const updateItem = (index: number, next: Partial<HomeLogoItem>) => {
    const updated = items.map((item, idx) => (idx === index ? { ...item, ...next } : item));
    onItemsChange(updated);
  };

  const addItem = (src = "") => {
    const next: HomeLogoItem = {
      id: makeId(),
      src,
      alt: "",
      alt_th: "",
      orderIndex: items.length,
    };
    onItemsChange(normalizeOrder([...items, next]));
  };

  const removeItem = (index: number) => {
    const updated = normalizeOrder(items.filter((_, idx) => idx !== index));
    onItemsChange(updated);
    if (activeIndex !== null) {
      setActiveIndex(updated.length ? Math.min(activeIndex, updated.length - 1) : null);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active?.id as string ?? null);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(8);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const reordered = normalizeOrder(arrayMove(items, oldIndex, newIndex));
        onItemsChange(reordered);
      }
    }
    setActiveDragId(null);
  };

  const handleDragCancel = () => {
    setActiveDragId(null);
  };

  const handleUploadFiles = async (files: FileList | null) => {
    const list = files ? Array.from(files) : [];
    if (!list.length) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      for (const file of list) {
        if (file.size > MAX_FILE_MB * 1024 * 1024) {
          throw new Error(`File limit: ${MAX_FILE_MB}MB`);
        }
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", DEFAULT_BUCKET);

        const response = await fetch("/api/portfolio/upload", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload?.error ?? "Upload failed");
        }

        addItem(payload.url);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleUploadFiles(event.dataTransfer.files);
  };

  const handleSwipeStart = (event: React.TouchEvent<HTMLDivElement>) => {
    swipeStartX.current = event.touches[0]?.clientX ?? null;
    swipeStartY.current = event.touches[0]?.clientY ?? null;
    swipeDeltaX.current = 0;
    swipeDeltaY.current = 0;
  };

  const handleSwipeMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null || swipeStartY.current === null) return;
    swipeDeltaX.current = event.touches[0].clientX - swipeStartX.current;
    swipeDeltaY.current = event.touches[0].clientY - swipeStartY.current;
  };

  const handleSwipeEnd = () => {
    if (swipeStartX.current === null || swipeStartY.current === null || activeIndex === null) return;
    const deltaX = swipeDeltaX.current;
    const deltaY = swipeDeltaY.current;
    swipeStartX.current = null;
    swipeStartY.current = null;
    swipeDeltaX.current = 0;
    swipeDeltaY.current = 0;
    if (Math.abs(deltaX) < 60 || Math.abs(deltaX) < Math.abs(deltaY)) return;
    setActiveIndex(prev => {
      if (prev === null) return prev;
      if (deltaX > 0) return Math.max(prev - 1, 0);
      return Math.min(prev + 1, items.length - 1);
    });
  };

  const previewLogos = useMemo(
    () =>
      items
        .filter(item => item.src)
        .map(item => ({
          src: item.src,
          alt: lang === "th" ? item.alt_th || item.alt : item.alt,
        })),
    [items, lang]
  );

  const fadeOutColor = settings.fadeOutColorDark;
  const speedCircumference = 2 * Math.PI * 30;
  const rawProgress = Math.min(1, Math.max(0, (settings.speed - 10) / 150));
  const speedProgress = rawProgress === 0 ? 0.06 : rawProgress;
  const speedDashOffset = speedCircumference * (1 - speedProgress);
  const previewLogoHeight = isMobilePreview
    ? Math.max(12, Math.round(settings.logoHeight * 0.7))
    : settings.logoHeight;
  const previewGap = isMobilePreview
    ? Math.max(8, Math.round(settings.gap * 0.7))
    : settings.gap;

  const activeItem = items.find(item => item.id === activeDragId);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="contents lg:block lg:col-span-7">
        <div className="sticky logo-preview-sticky z-40">
          <div className="relative overflow-hidden rounded-none sm:rounded-2xl border-0 sm:border border-[#3a2f1d] bg-transparent sm:bg-[#1a1612] shadow-none sm:shadow-2xl">
            <div
              className={cn(
                "theme-root relative overflow-hidden min-h-0 rounded-none sm:rounded-2xl bg-background-light text-text",
                mode === "light" ? "theme-light" : "theme-dark"
              )}
            >
              <div className="px-4 pt-4 text-center sm:px-8 sm:pt-10">
                <span className="hidden sm:block text-[10px] uppercase tracking-[0.4em] text-accent-text/60 mb-2 font-bold">
                  ตัวอย่างการแสดงผล
                </span>
                <h2 className="hidden sm:block text-xl font-light tracking-widest uppercase text-text">
                  Logo Loop
                </h2>
              </div>
              <div className="px-4 py-4 sm:px-8 sm:py-12">
                <LogoLoop
                  logos={previewLogos}
                  speed={settings.speed}
                  direction={settings.direction}
                  gap={previewGap}
                  logoHeight={previewLogoHeight}
                  fadeOut={settings.fadeOut}
                  fadeOutColor={fadeOutColor}
                  className="py-3 sm:py-5 bg-[#181411] transition-colors duration-300"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-[#2a2419] rounded-xl border border-white/5 space-y-6 sm:p-6 mt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
              ตั้งค่าการแสดงผล
            </h4>
            <span className="material-symbols-outlined text-primary">tune</span>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-center justify-between gap-6 lg:flex-1">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/80">
                    เปิดใช้งาน Fade ขอบ
                  </p>
                  <p className="text-[10px] text-white/40 italic">
                    ไล่สีที่ขอบซ้าย-ขวาเพื่อให้ดูสมูท
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.fadeOut}
                    onChange={() => updateSetting("fadeOut", !settings.fadeOut)}
                  />
                  <div className="w-11 h-6 bg-[#15110d] rounded-full peer peer-checked:bg-[#f4af25] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-white/20 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              <div className="space-y-2 lg:w-[360px]">
                <div className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold">
                  สี Gradient Fade
                </div>
                <div className="flex items-center gap-4 p-4 bg-[#15110d] rounded-xl border border-white/5">
                  <div className="size-12 rounded-lg bg-[#15110d] border border-primary/20 flex items-center justify-center overflow-hidden">
                    <input
                      className="size-24 cursor-pointer bg-transparent border-none"
                      type="color"
                      value={fadeOutColor}
                      onChange={e =>
                        updateSetting(
                          mode === "light" ? "fadeOutColorLight" : "fadeOutColorDark",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#cbb790]">เลือกสีที่ต้องการ</p>
                  </div>
                  <div className="text-xs font-mono text-primary/60">
                    {fadeOutColor?.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold">
                  ความเร็วการเลื่อน
                </label>
                <div className="flex items-center gap-6 p-4 bg-[#15110d] rounded-xl border border-white/5">
                  <div className="relative size-20 flex items-center justify-center rounded-full bg-gradient-to-tr from-[#2a2419] to-primary/20 border border-white/10 shadow-inner">
                    <div className="size-14 bg-[#15110d] rounded-full flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold">{settings.speed}</span>
                      <span className="text-[8px] text-white/40">px/s</span>
                    </div>
                    <svg
                      className="absolute inset-0"
                      viewBox="0 0 80 80"
                      aria-hidden
                    >
                      <circle
                        cx="40"
                        cy="40"
                        r="30"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="3"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="30"
                        fill="none"
                        stroke="#f4af25"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeDasharray={speedCircumference}
                        strokeDashoffset={speedDashOffset}
                        transform="rotate(-90 40 40)"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 hidden lg:block">
                    <p className="text-xs font-bold text-[#cbb790]">ความเร็ว Loop</p>
                    <p className="text-[10px] text-white/40">
                      ปรับความเร็วในการเลื่อนของโลโก้
                    </p>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={160}
                    value={settings.speed}
                    onChange={e => updateSetting("speed", Number(e.target.value))}
                    className="w-32"
                  />
                </div>
              </div>

              <div className="space-y-4 lg:self-center lg:mt-8">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold">
                    ทิศทาง
                  </span>
                  <select
                    className="w-32 bg-[#15110d] border border-white/10 rounded-md px-2 py-1 text-xs text-white"
                    value={settings.direction}
                    onChange={e => updateSetting("direction", e.target.value as "left" | "right")}
                  >
                    <option value="left">ซ้าย (Left)</option>
                    <option value="right">ขวา (Right)</option>
                  </select>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold">
                    ระยะห่าง (Gap)
                  </span>
                  <input
                    type="number"
                    min={8}
                    max={120}
                    className="w-32 bg-[#15110d] border border-white/10 rounded-md px-2 py-1 text-xs text-white"
                    value={settings.gap}
                    onChange={e => updateSetting("gap", Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold">
                    ความสูงโลโก้
                  </span>
                  <input
                    type="number"
                    min={12}
                    max={96}
                    className="w-32 bg-[#15110d] border border-white/10 rounded-md px-2 py-1 text-xs text-white"
                    value={settings.logoHeight}
                    onChange={e => updateSetting("logoHeight", Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto lg:pr-2 lg:admin-scrollbar">
        <div className="p-6 bg-[#2a2419] rounded-xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
              โลโก้พาร์ทเนอร์
            </h4>
            <span className="material-symbols-outlined text-primary">collections</span>
          </div>

          <div
            className={cn(
              "relative border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-all",
              "hover:border-primary/40 hover:bg-primary/5",
              isUploading && "opacity-70"
            )}
            onDrop={handleDrop}
            onDragOver={event => event.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <Upload className="size-10 text-primary/40" />
            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest">ลากไฟล์มาวางที่นี่</p>
              <p className="text-[10px] text-white/40 mt-1">
                SVG, PNG, หรือ WEBP (สูงสุด {MAX_FILE_MB}MB)
              </p>
            </div>
            {isUploading && (
              <p className="text-[10px] uppercase tracking-widest text-primary">กำลังอัปโหลด...</p>
            )}
            {uploadError && (
              <p className="text-[10px] uppercase tracking-widest text-red-400">{uploadError}</p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,image/svg+xml"
              className="hidden"
              multiple
              onChange={event => handleUploadFiles(event.target.files)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold">
                รายการโลโก้ (ลากเพื่อจัดลำดับ)
              </label>
              <button
                type="button"
                onClick={() => addItem()}
                className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80"
              >
                <Plus className="size-4" />
                เพิ่มโลโก้
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 gap-2">
                  {items.map((item, index) => (
                    <SortableLogoRow
                      key={item.id}
                      item={item}
                      index={index}
                      lang={lang}
                      onOpen={setActiveIndex}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </SortableContext>
              <DragOverlay>
                {activeItem ? (
                  <div className="flex items-center gap-4 rounded-lg border border-primary/40 bg-[#15110d] p-3 shadow-2xl">
                    <GripVertical className="size-4 text-primary/70" />
                    <div className="size-10 rounded bg-white/5 flex items-center justify-center p-2">
                      {activeItem.src ? (
                        <Image
                          src={activeItem.src}
                          alt="preview"
                          width={40}
                          height={40}
                          className="max-h-full grayscale"
                          unoptimized
                        />
                      ) : (
                        <span className="text-[10px] text-white/30">ไม่มีรูป</span>
                      )}
                    </div>
                    <div className="text-xs text-white/70">
                      {activeItem.src ? activeItem.src.split("/").pop() : "ไม่มีชื่อ"}
                    </div>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
          </div>
        </div>


      </div>

      {activeIndex !== null && items[activeIndex] && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-stretch sm:justify-end pb-0 px-0">
          <button
            type="button"
            aria-label="ปิดหน้าต่างแก้ไข"
            className="absolute inset-0"
            onClick={() => setActiveIndex(null)}
          />
          <div
            className={cn(
              "overflow-visible animate-in duration-300 rounded-none sm:overflow-hidden sm:rounded-none",
              isMobilePreview
                ? "fixed inset-x-0 bottom-0 w-screen h-auto slide-in-from-bottom-6"
                : "relative w-full max-w-[480px] h-[calc(100%-128px)] mt-32 slide-in-from-right-8"
            )}
          >
            <div
              className="flex h-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
              style={{ transform: `translateX(-${(activeIndex ?? 0) * 100}%)` }}
              onTouchStart={handleSwipeStart}
              onTouchMove={handleSwipeMove}
              onTouchEnd={handleSwipeEnd}
            >
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "w-full shrink-0",
                    isMobilePreview ? "px-0 pb-0 pt-0" : "px-6 py-6"
                  )}
                >
                  <div className="h-full overflow-visible sm:overflow-y-auto sm:admin-scrollbar">
                    <div
                      className={cn(
                        "bg-[#2a2419] space-y-4",
                        isMobilePreview ? "rounded-none border-0 p-4 pb-4" : "rounded-xl border border-white/10 p-4"
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[10px] uppercase tracking-widest text-[#cbb790]/60">
                            แก้ไขโลโก้
                          </div>
                          <div className="text-lg font-semibold text-white">
                            {lang === "th" ? item.alt_th || item.alt : item.alt}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="size-9 rounded-full border border-white/10 bg-[#15110d] flex items-center justify-center text-white/60 disabled:opacity-40"
                            onClick={() => setActiveIndex(prev => (prev === null ? prev : Math.max(prev - 1, 0)))}
                            disabled={index === 0}
                            aria-label="โลโก้ก่อนหน้า"
                          >
                            <ChevronLeft className="size-4" />
                          </button>
                          <button
                            type="button"
                            className="size-9 rounded-full border border-white/10 bg-[#15110d] flex items-center justify-center text-white/60 disabled:opacity-40"
                            onClick={() => setActiveIndex(prev => (prev === null ? prev : Math.min(prev + 1, items.length - 1)))}
                            disabled={index === items.length - 1}
                            aria-label="โลโก้ถัดไป"
                          >
                            <ChevronRight className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveIndex(null)}
                            className="size-10 rounded-full border border-white/10 bg-[#15110d] flex items-center justify-center text-white/70"
                            aria-label="ปิด"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="size-16 rounded-lg border border-white/10 bg-[#15110d] flex items-center justify-center">
                          {item.src ? (
                            <Image
                              src={item.src}
                              alt="preview"
                              width={40}
                              height={40}
                              className="h-10 w-auto"
                              unoptimized
                            />
                          ) : (
                            <span className="text-xs text-white/30">ไม่มีรูป</span>
                          )}
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="text-xs uppercase tracking-wider font-semibold text-white/60">
                            ลิงก์รูปภาพ
                            <input
                              className="mt-2 w-full bg-[#15110d] border border-white/10 rounded-lg px-4 py-2 text-xs text-white"
                              value={item.src}
                              onChange={e => updateItem(index, { src: e.target.value })}
                              placeholder="/tech/logo.svg"
                            />
                          </label>
                          <label className="text-xs uppercase tracking-wider font-semibold text-white/60">
                            ข้อความอธิบาย ({lang.toUpperCase()})
                            <input
                              className="mt-2 w-full bg-[#15110d] border border-white/10 rounded-lg px-4 py-2 text-xs text-white"
                              value={lang === "th" ? item.alt_th || "" : item.alt || ""}
                              onChange={e =>
                                updateItem(index, {
                                  ...(lang === "th"
                                    ? { alt_th: e.target.value }
                                    : { alt: e.target.value }),
                                })
                              }
                            />
                          </label>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <ImageUploader
                          label="อัปโหลดโลโก้ใหม่"
                          value={item.src}
                          bucket={DEFAULT_BUCKET}
                          maxSizeMB={MAX_FILE_MB}
                          compact
                          onUploaded={url => updateItem(index, { src: url })}
                          onError={msg => setUploadError(msg)}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="size-4" />
                        ลบโลโก้นี้
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
