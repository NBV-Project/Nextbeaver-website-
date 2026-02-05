"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Layout, Settings, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import Process from "@/components/sections/Process";
import ImageUploader from "@/components/ui/ImageUploader";
import type { ProcessContent, ProcessStep, ProcessStyles } from "@/lib/supabase/process";
import Image from "next/image";

type Props = {
  content: ProcessContent;
  styles: ProcessStyles;
  steps: ProcessStep[];
  lang: "en" | "th";
  mode: "light" | "dark";
  onContentChange: (content: ProcessContent) => void;
  onStylesChange: (styles: ProcessStyles) => void;
  onStepsChange: (steps: ProcessStep[]) => void;
};

type PanelId =
  | "title"
  | "subtitle"
  | "accent"
  | "lines"
  | "step-1"
  | "step-2"
  | "step-3"
  | "step-4"
  | "step-5"
  | null;

type PanelCard = {
  id: Exclude<PanelId, null>;
  title: string;
  icon: typeof Layout;
};

const fontOptions = [
  { label: "Default (Theme)", value: "" },
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

const fontSizes = [10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80];
const iconOptions = [
  "visibility",
  "architecture",
  "science",
  "terminal",
  "rocket_launch",
  "auto_awesome",
  "bolt",
  "brush",
  "diamond",
  "layers",
  "insights",
  "verified",
];

const panelCards: PanelCard[] = [
  { id: "title", title: "Title", icon: Type },
  { id: "subtitle", title: "Subtitle", icon: Type },
  { id: "accent", title: "Accent + Icons", icon: Settings },
  { id: "lines", title: "Lines & Motion", icon: Settings },
  { id: "step-1", title: "Step 01", icon: Layout },
  { id: "step-2", title: "Step 02", icon: Layout },
  { id: "step-3", title: "Step 03", icon: Layout },
  { id: "step-4", title: "Step 04", icon: Layout },
  { id: "step-5", title: "Step 05", icon: Layout },
];

const isIconUrl = (value: string) => value.startsWith("http") || value.startsWith("/");
const isHexColor = (value?: string) => Boolean(value && /^#[0-9a-fA-F]{6}$/.test(value));

const SpeedDial = ({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value?: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}) => {
  const safeValue = typeof value === "number" && Number.isFinite(value) ? value : min;
  const clamped = Math.min(max, Math.max(min, safeValue));
  const radius = 24;
  const halfCircumference = Math.PI * radius;
  const normalized = (clamped - min) / (max - min);
  const progress = Math.max(0.06, 1 - normalized);
  const dashOffset = halfCircumference * (1 - progress);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#1a1612] px-3 py-2">
      <div className="relative h-12 w-16">
        <svg viewBox="0 0 64 32" className="h-12 w-16">
          <path
            d="M8,28 A24,24 0 0 1 56,28"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M8,28 A24,24 0 0 1 56,28"
            fill="none"
            stroke="#f4af25"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={halfCircumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center text-[10px] font-semibold text-[#cbb790]">
          {clamped}s
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-[#cbb790]/60 font-bold">
          {label}
        </p>
        <input
          type="range"
          min={min}
          max={max}
          step={0.5}
          value={clamped}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
};

const ColorInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) => {
  const normalized = isHexColor(value) ? value : "#000000";
  return (
    <label className="grid grid-cols-[96px_auto] items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
      <span className="text-right">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="color"
          className="h-7 w-7 rounded border border-neutral-800 bg-neutral-950"
          value={normalized}
          onChange={e => {
            const next = e.target.value;
            if (next === normalized) return;
            onChange(next);
          }}
        />
        <input
          className="w-24 bg-neutral-950 border border-neutral-800 rounded-md px-2 py-1 text-[10px] text-white uppercase"
          value={value || ""}
          onChange={e => {
            const next = e.target.value;
            if (next === (value || "")) return;
            onChange(next);
          }}
          placeholder="#ffffff"
        />
      </div>
    </label>
  );
};

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
      <option value="">Auto</option>
      {fontSizes.map(size => (
        <option key={size} value={size}>
          {size}px
        </option>
      ))}
    </select>
  </label>
);

export default function ProcessEditor({
  content,
  styles,
  steps,
  lang,
  mode,
  onContentChange,
  onStylesChange,
  onStepsChange,
}: Props) {
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [openIconPicker, setOpenIconPicker] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);
  const swipeStartX = useRef<number | null>(null);
  const swipeDeltaX = useRef(0);

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
  }, [previewDevice, lang, mode, content, styles, steps]);

  const previewScale =
    previewDevice === "mobile" ? 0.36 : previewDevice === "tablet" ? 0.65 : 0.55;
  const previewFrameClasses =
    previewDevice === "desktop"
      ? "w-full"
      : previewDevice === "tablet"
      ? "w-full max-w-[860px]"
      : "w-full max-w-none";
  const previewRenderDevice = previewDevice === "mobile" ? "desktop" : previewDevice;

  const setActivePanel = (panelId: PanelId) => {
    if (!panelId) {
      setActiveIndex(null);
      return;
    }
    const nextIndex = panelCards.findIndex(card => card.id === panelId);
    setActiveIndex(nextIndex >= 0 ? nextIndex : null);
  };

  const activePanel = activeIndex !== null ? panelCards[activeIndex].id : null;
  const activeTitle = activeIndex !== null ? panelCards[activeIndex].title : "";
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

  const updateContentField = (field: keyof ProcessContent, value: string) =>
    onContentChange({ ...content, [field]: value });

  const updateStyles = (field: keyof ProcessStyles, value: string | number | undefined) => {
    const current = styles[field];
    if ((current ?? "") === (value ?? "")) return;
    onStylesChange({ ...styles, [field]: value });
  };

  const updateStep = (index: number, updates: Partial<ProcessStep>) => {
    const updated = steps.map((step, idx) => (idx === index ? { ...step, ...updates } : step));
    onStepsChange(updated);
  };

  const updateStepText = (index: number, field: "title" | "body", value: string) => {
    const key = lang === "th" ? `${field}_th` : field;
    updateStep(index, { [key]: value } as Partial<ProcessStep>);
  };

  const getCardDescription = (panelId: Exclude<PanelId, null>) => {
    if (panelId === "title") return (lang === "th" ? content.title_th : content.title) || "Title";
    if (panelId === "subtitle")
      return (lang === "th" ? content.subtitle_th : content.subtitle) || "Subtitle";
    if (panelId === "accent") return "Accent + icons";
    if (panelId === "lines") return "Line colors & speed";
    if (panelId.startsWith("step")) {
      const index = Number(panelId.split("-")[1]) - 1;
      const step = steps[index];
      if (!step) return "Step";
      return (lang === "th" ? step.title_th : step.title) || `Step ${step.number}`;
    }
    return "";
  };

  const renderStepPanel = (index: number) => {
    const step = steps[index];
    if (!step) return null;
    const stepTitle = lang === "th" ? step.title_th || step.title : step.title;
    const stepBody = lang === "th" ? step.body_th || step.body : step.body;

    const iconButton = isIconUrl(step.icon) ? (
      <Image
        src={step.icon}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        className="h-6 w-6 object-contain"
        unoptimized
      />
    ) : (
      <span className="material-symbols-outlined text-[20px]">{step.icon}</span>
    );

    return (
      <>
        <div className="grid grid-cols-2 gap-3">
          <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
            Number
            <input
              className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
              value={step.number}
              onChange={e => updateStep(index, { number: e.target.value })}
            />
          </label>
          <div className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
            Icon
            <button
              type="button"
              onClick={() => setOpenIconPicker(prev => (prev === index ? null : index))}
              className="mt-2 w-full flex items-center justify-between gap-3 rounded-md border border-white/10 bg-[#120f0b] px-3 py-2 text-xs text-white"
            >
              <span className="inline-flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#1a1612] text-[#cbb790]">
                  {iconButton}
                </span>
                <span className="hidden sm:inline text-xs text-white/80">Select icon</span>
              </span>
              <ChevronDown className="size-4 text-[#cbb790]" />
            </button>

            {openIconPicker === index ? (
              <div className="mt-2 rounded-xl border border-white/10 bg-[#120f0b] p-3 space-y-3">
                <div className="grid grid-cols-6 gap-3">
                  {iconOptions.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => {
                        updateStep(index, { icon });
                        setOpenIconPicker(null);
                      }}
                      className={cn(
                        "h-9 w-9 rounded-full border border-white/10 bg-[#1a1612] flex items-center justify-center text-[#cbb790] transition",
                        step.icon === icon && "border-[#f4af25] text-[#f4af25]"
                      )}
                      aria-label={icon}
                      title={icon}
                    >
                      <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    </button>
                  ))}
                  <div className="col-span-6 flex items-center gap-2 text-[10px] text-[#cbb790]/70">
                    <ImageUploader
                      label=""
                      value={isIconUrl(step.icon) ? step.icon : ""}
                      onUploaded={value => {
                        updateStep(index, { icon: value });
                        setOpenIconPicker(null);
                      }}
                      compact
                      iconOnly
                    />
                    <span>Upload icon</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <ColorInput
          label="Icon Color"
          value={mode === "light" ? step.iconColorLight : step.iconColorDark}
          onChange={value =>
            updateStep(index, mode === "light" ? { iconColorLight: value } : { iconColorDark: value })
          }
        />

        <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
          Title ({lang.toUpperCase()})
          <input
            className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
            value={stepTitle}
            onChange={e => updateStepText(index, "title", e.target.value)}
          />
        </label>

        <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
          Body ({lang.toUpperCase()})
          <textarea
            className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-3 py-2 text-xs text-white resize-none"
            rows={3}
            value={stepBody}
            onChange={e => updateStepText(index, "body", e.target.value)}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
            Title Font
            <select
              className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
              value={(lang === "th" ? step.titleFontFamilyTh : step.titleFontFamilyEn) || ""}
              onChange={e =>
                updateStep(index, {
                  ...(lang === "th"
                    ? { titleFontFamilyTh: e.target.value }
                    : { titleFontFamilyEn: e.target.value }),
                })
              }
            >
              {fontOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <SizeInput
            label="Title Size"
            value={step.titleFontSize}
            onChange={value => updateStep(index, { titleFontSize: value })}
          />
        </div>

        <ColorInput
          label="Title Color"
          value={mode === "light" ? step.titleColorLight : step.titleColorDark}
          onChange={value =>
            updateStep(index, mode === "light" ? { titleColorLight: value } : { titleColorDark: value })
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
            Body Font
            <select
              className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
              value={(lang === "th" ? step.bodyFontFamilyTh : step.bodyFontFamilyEn) || ""}
              onChange={e =>
                updateStep(index, {
                  ...(lang === "th"
                    ? { bodyFontFamilyTh: e.target.value }
                    : { bodyFontFamilyEn: e.target.value }),
                })
              }
            >
              {fontOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <SizeInput
            label="Body Size"
            value={step.bodyFontSize}
            onChange={value => updateStep(index, { bodyFontSize: value })}
          />
        </div>

        <ColorInput
          label="Body Color"
          value={mode === "light" ? step.bodyColorLight : step.bodyColorDark}
          onChange={value =>
            updateStep(index, mode === "light" ? { bodyColorLight: value } : { bodyColorDark: value })
          }
        />

        <label className="flex items-center gap-3 text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
          Highlight
          <input
            type="checkbox"
            checked={Boolean(step.highlight)}
            onChange={() => updateStep(index, { highlight: !step.highlight })}
          />
        </label>
      </>
    );
  };

  const renderPanel = (panelId: Exclude<PanelId, null>) => {
    switch (panelId) {
      case "title":
        return (
          <>
            <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
              Title ({lang.toUpperCase()})
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
                Title Font
                <select
                  className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                  value={(lang === "th" ? styles.titleFontFamilyTh : styles.titleFontFamilyEn) || ""}
                  onChange={e =>
                    updateStyles(
                      lang === "th" ? "titleFontFamilyTh" : "titleFontFamilyEn",
                      e.target.value
                    )
                  }
                >
                  {fontOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <SizeInput
                label="Title Size"
                value={styles.titleFontSize as number | undefined}
                onChange={value => updateStyles("titleFontSize", value)}
              />
            </div>

            <ColorInput
              label="Title Color"
              value={mode === "light" ? styles.titleColorLight : styles.titleColorDark}
              onChange={value =>
                updateStyles(mode === "light" ? "titleColorLight" : "titleColorDark", value)
              }
            />
          </>
        );
      case "subtitle":
        return (
          <>
            <label className="text-xs uppercase tracking-wider font-semibold text-[#cbb790]/60">
              Subtitle ({lang.toUpperCase()})
              <textarea
                className="mt-2 w-full bg-[#1a1612] border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none"
                rows={3}
                value={lang === "th" ? content.subtitle_th || "" : content.subtitle}
                onChange={e =>
                  updateContentField(lang === "th" ? "subtitle_th" : "subtitle", e.target.value)
                }
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                Subtitle Font
                <select
                  className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-3 py-2 text-xs text-white"
                  value={(lang === "th" ? styles.subtitleFontFamilyTh : styles.subtitleFontFamilyEn) || ""}
                  onChange={e =>
                    updateStyles(
                      lang === "th" ? "subtitleFontFamilyTh" : "subtitleFontFamilyEn",
                      e.target.value
                    )
                  }
                >
                  {fontOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <SizeInput
                label="Subtitle Size"
                value={styles.subtitleFontSize as number | undefined}
                onChange={value => updateStyles("subtitleFontSize", value)}
              />
            </div>

            <ColorInput
              label="Subtitle Color"
              value={mode === "light" ? styles.subtitleColorLight : styles.subtitleColorDark}
              onChange={value =>
                updateStyles(mode === "light" ? "subtitleColorLight" : "subtitleColorDark", value)
              }
            />
          </>
        );
      case "accent":
        return (
          <>
            <ColorInput
              label="Accent"
              value={mode === "light" ? styles.accentColorLight : styles.accentColorDark}
              onChange={value =>
                updateStyles(mode === "light" ? "accentColorLight" : "accentColorDark", value)
              }
            />
            <ColorInput
              label="Icon"
              value={mode === "light" ? styles.stepIconColorLight : styles.stepIconColorDark}
              onChange={value =>
                updateStyles(mode === "light" ? "stepIconColorLight" : "stepIconColorDark", value)
              }
            />
            <ColorInput
              label="Number"
              value={mode === "light" ? styles.stepNumberColorLight : styles.stepNumberColorDark}
              onChange={value =>
                updateStyles(mode === "light" ? "stepNumberColorLight" : "stepNumberColorDark", value)
              }
            />
          </>
        );
      case "lines":
        return (
          <>
            <ColorInput
              label="Line Base"
              value={mode === "light" ? styles.lineBaseColorLight : styles.lineBaseColorDark}
              onChange={value =>
                updateStyles(mode === "light" ? "lineBaseColorLight" : "lineBaseColorDark", value)
              }
            />
            <ColorInput
              label="Line Accent"
              value={mode === "light" ? styles.lineAccentColorLight : styles.lineAccentColorDark}
              onChange={value =>
                updateStyles(
                  mode === "light" ? "lineAccentColorLight" : "lineAccentColorDark",
                  value
                )
              }
            />
            <ColorInput
              label="Line Dash"
              value={mode === "light" ? styles.lineDashColorLight : styles.lineDashColorDark}
              onChange={value =>
                updateStyles(mode === "light" ? "lineDashColorLight" : "lineDashColorDark", value)
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <SpeedDial
                label="Desktop Pulse"
                value={styles.linePulseDurationDesktop}
                min={2}
                max={12}
                onChange={next => updateStyles("linePulseDurationDesktop", next)}
              />
              <SpeedDial
                label="Mobile Pulse"
                value={styles.linePulseDurationMobile}
                min={2}
                max={12}
                onChange={next => updateStyles("linePulseDurationMobile", next)}
              />
              <SpeedDial
                label="Desktop Dash"
                value={styles.lineDashDurationDesktop}
                min={2}
                max={16}
                onChange={next => updateStyles("lineDashDurationDesktop", next)}
              />
              <SpeedDial
                label="Mobile Dash"
                value={styles.lineDashDurationMobile}
                min={2}
                max={16}
                onChange={next => updateStyles("lineDashDurationMobile", next)}
              />
            </div>
          </>
        );
      case "step-1":
        return renderStepPanel(0);
      case "step-2":
        return renderStepPanel(1);
      case "step-3":
        return renderStepPanel(2);
      case "step-4":
        return renderStepPanel(3);
      case "step-5":
        return renderStepPanel(4);
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
              <div className="w-full overflow-hidden px-0 sm:px-6 pt-2 pb-0 sm:py-6">
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
                    className="origin-top-left"
                    style={{
                      transform: `scale(${previewScale})`,
                      width: `${100 / previewScale}%`,
                    }}
                  >
                    <Process
                      content={content}
                      styles={styles}
                      steps={steps}
                      locale={lang}
                      mode={mode}
                      previewDevice={previewRenderDevice}
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
                Our Process Controls
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
          <div className="w-full max-w-none sm:max-w-md h-[54vh] sm:h-[70vh] min-h-0 overflow-hidden rounded-none sm:rounded-2xl border border-[#3a2f1d] bg-[#1a1612] shadow-[0_30px_80px_rgba(0,0,0,0.55)] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#bfa67a]">Editing</div>
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
