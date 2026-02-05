"use client";

import { useEffect, useRef, useState } from "react";
import { 
  LayoutTemplate, Palette, Plus, Trash2, GripVertical, Type, X, 
  TableProperties, CheckCircle2, ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";
import Services from "@/components/sections/Services";
import ServiceIconPicker from "./ServiceIconPicker";
import { en } from "@/content/en";
import { th } from "@/content/th";
import type { ServicesContent, ServicesStyles, ServiceItem, ServicePlan } from "@/lib/supabase/services";

type Props = {
  content: ServicesContent;
  styles: ServicesStyles;
  items: ServiceItem[];
  lang: "en" | "th";
  mode: "light" | "dark";
  onContentChange: (content: ServicesContent) => void;
  onStylesChange: (styles: ServicesStyles) => void;
  onItemsChange: (items: ServiceItem[]) => void;
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
];

const fontSizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64];

const buildFontFamilyKey = (base: string, lang: "en" | "th") =>
  `${base}FontFamily${lang === "th" ? "Th" : "En"}` as keyof ServicesStyles;

const buildModeKey = (base: string, mode: "light" | "dark") =>
  `${base}${mode === "light" ? "Light" : "Dark"}` as keyof ServicesStyles;

// --- Components ---

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
          "w-20 bg-neutral-950 border border-neutral-800 rounded-md px-2 py-1 text-[10px] text-white uppercase font-mono",
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

export default function ServicesEditor({
  content,
  styles,
  items,
  lang,
  mode,
  onContentChange,
  onStylesChange,
  onItemsChange,
}: Props) {
  const preview = true;
  const [activeTab, setActiveTab] = useState<"general" | "plans">("general");
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  
  // Plans Editing State
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [activePlanIndex, setActivePlanIndex] = useState<number | null>(null);

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const previewRef = useRef<HTMLDivElement | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);

  // --- Updaters ---

  const updateContent = (field: keyof ServicesContent, value: string) => {
    onContentChange({ ...content, [field]: value });
  };

  const updateContentLang = (base: string, value: string) => {
    const field = (lang === "th" ? `${base}_th` : base) as keyof ServicesContent;
    updateContent(field, value);
  };

  const updateStyle = (field: keyof ServicesStyles, value: unknown) => {
    onStylesChange({ ...styles, [field]: value });
  };

  const updateStyleFont = (base: string, value: string) =>
    updateStyle(buildFontFamilyKey(base, lang), value);

  const updateStyleColor = (base: string, value: string) =>
    updateStyle(buildModeKey(base, mode), value);

  // --- Items Logic ---

  const updateItem = (index: number, next: Partial<ServiceItem>) => {
    const updated = items.map((item, i) => (i === index ? { ...item, ...next } : item));
    onItemsChange(updated);
  };

  const addItem = () => {
    const newItem: ServiceItem = {
      id: `new-${Date.now()}`,
      iconType: "material",
      iconValue: "diamond",
      title: "New Service",
      title_th: "บริการใหม่",
      body: "Description of the new service.",
      body_th: "คำอธิบายบริการใหม่",
      features: ["Feature 1", "Feature 2"],
      modalPlans: [],
      orderIndex: items.length,
    };
    onItemsChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  // --- Plans Logic ---

  const selectedServiceIndex = items.findIndex(i => i.id === selectedServiceId);
  const selectedService = items[selectedServiceIndex];

  const addPlan = () => {
    if (selectedServiceIndex === -1) return;
    const newPlan: ServicePlan = {
      title: "New Plan",
      description: "Plan description",
      price: "1,000",
      currency: "$",
      period: "/mo",
      cta: "Get Started",
      features: ["Feature 1", "Feature 2"],
      icon: "diamond",
      featureIcon: "check_circle",
    };
    const currentPlans = selectedService.modalPlans || [];
    updateItem(selectedServiceIndex, { modalPlans: [...currentPlans, newPlan] });
  };

  const updatePlan = (planIndex: number, next: Partial<ServicePlan>) => {
    if (selectedServiceIndex === -1) return;
    const currentPlans = [...(selectedService.modalPlans || [])];
    currentPlans[planIndex] = { ...currentPlans[planIndex], ...next };
    updateItem(selectedServiceIndex, { modalPlans: currentPlans });
  };

  const removePlan = (planIndex: number) => {
    if (selectedServiceIndex === -1) return;
    const currentPlans = (selectedService.modalPlans || []).filter((_, i) => i !== planIndex);
    updateItem(selectedServiceIndex, { modalPlans: currentPlans });
  };

  // --- Preview Logic ---
  const previewScale = 1;
  const previewFrameClasses = "w-full";
  const previewHeightLimit =
    previewDevice === "mobile" ? 300 : previewDevice === "tablet" ? 360 : undefined;
  const previewContainerHeight =
    previewHeight && previewHeightLimit
      ? Math.min(Math.round(previewHeight * previewScale), previewHeightLimit)
      : undefined;
  const isPreviewMobile = previewDevice === "mobile";
  const previewPanelStyle = isPreviewMobile
    ? {
        width: "100vw",
        marginLeft: "calc((100vw - 100%) / -2)",
        marginRight: "calc((100vw - 100%) / -2)",
      }
    : undefined;

  useEffect(() => {
    const resolveDevice = () => {
      const width = window.innerWidth;
      if (width < 768) return "mobile";
      if (width < 1100) return "tablet";
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
  }, [previewDevice, lang, mode, content, styles, items, activeTab]);

  const dict = lang === "th" ? th : en;

  // --- Fields Config ---
  const headerFields = [
    { id: "eyebrow", label: "หัวข้อรอง (Eyebrow)", base: "eyebrow", fontBase: "eyebrow", sizeKey: "eyebrowFontSize", colorBase: "eyebrowColor" },
    { id: "title", label: "หัวข้อหลัก (Title)", base: "title", fontBase: "title", sizeKey: "titleFontSize", colorBase: "titleColor" },
    { id: "viewAll", label: "ปุ่มดูทั้งหมด", base: "viewAll", fontBase: "viewAll", sizeKey: null, colorBase: null }, 
  ];

  const cardStyleFields = [
    { label: "พื้นหลังการ์ด", bgBase: "cardBg", borderBase: "cardBorder" },
    { label: "ไอคอนการ์ด", bgBase: "cardIconBg", colorBase: "cardIconColor" },
    { label: "หัวข้อการ์ด", fontBase: "cardTitle", sizeKey: "cardTitleFontSize", colorBase: "cardTitleColor" },
    { label: "เนื้อหาการ์ด", fontBase: "cardBody", sizeKey: "cardBodyFontSize", colorBase: "cardBodyColor" },
    { label: "ลิงก์ดูเพิ่มเติม", fontBase: "explore", sizeKey: "exploreFontSize", colorBase: "exploreColor" },
  ];

  const modalStyleFields = [
    { label: "ป้ายแนะนำ (Plan Badge)", fontBase: "planBadge", sizeKey: "planBadgeFontSize", colorBase: "planBadgeColor" },
    { label: "ชื่อแพ็คเกจ", fontBase: "planTitle", sizeKey: "planTitleFontSize", colorBase: "planTitleColor" },
    { label: "คำอธิบายแพ็คเกจ", fontBase: "planDesc", sizeKey: "planDescFontSize", colorBase: "planDescColor" },
    { label: "ราคา", fontBase: "planPrice", sizeKey: "planPriceFontSize", colorBase: "planPriceColor" },
    { label: "สกุลเงิน", fontBase: "planCurrency", sizeKey: "planCurrencyFontSize", colorBase: "planCurrencyColor" },
    { label: "ระยะเวลา (เช่น /เดือน)", fontBase: "planPeriod", sizeKey: "planPeriodFontSize", colorBase: "planPeriodColor" },
    { label: "รายการฟีเจอร์", fontBase: "planFeature", sizeKey: "planFeatureFontSize", colorBase: "planFeatureColor" },
    { label: "ปุ่มกด (CTA)", fontBase: "planCta", sizeKey: "planCtaFontSize", colorBase: "planCtaColor" },
  ];

  const containerSpaceClass = isPreviewMobile ? "space-y-0" : "space-y-6";
  const previewSectionSpacing = isPreviewMobile ? "space-y-0" : "space-y-4 sm:space-y-6";

  return (
    <div className={cn(containerSpaceClass)}>
      <div className="grid gap-0 sm:gap-6 lg:grid-cols-12">
        {/* Preview Panel */}
        <div className="contents lg:block lg:col-span-7 lg:min-w-0">
          <div
            className={cn(
              "sticky pb-4 sm:pb-6",
              previewSectionSpacing
            )}
            style={{
              top: "var(--admin-nav-offset, var(--admin-nav-height, 96px))",
              ...(previewPanelStyle ?? {}),
            }}
          >
            <div
              className={cn(
                "relative rounded-none sm:rounded-2xl border-0 sm:border border-[#3a2f1d] bg-transparent sm:bg-[#1a1612] shadow-none sm:shadow-2xl",
                preview ? "overflow-visible" : "overflow-hidden"
              )}
            >
              <div className={cn("w-full px-0 pb-4 pt-0 sm:py-6", preview ? "overflow-visible" : "overflow-hidden")}>
                <div
                  className={cn(
                    "mx-auto w-full max-w-full bg-background transition-all",
                    preview
                      ? "overflow-x-visible overflow-y-auto"
                      : "overflow-x-hidden overflow-y-auto",
                    previewFrameClasses
                  )}
                  style={{
                    ...(previewContainerHeight ? { height: `${previewContainerHeight}px` } : {}),
                    ...(previewHeightLimit ? { maxHeight: `${previewHeightLimit}px` } : {}),
                  }}
                >
                  <div
                    ref={previewRef}
                    className={cn(
                      "admin-preview origin-top-left [&_*]:!animate-none [&_*]:!transition-none",
                      mode // Apply theme class
                    )}
                    style={previewScale === 1 ? undefined : { transform: `scale(${previewScale})` }}
                  >
                    {activeTab === "general" ? (
                      /* GENERAL GRID PREVIEW */
                      <Services
                        dict={dict}
                        content={content}
                        styles={styles}
                        items={items}
                        locale={lang}
                        mode={mode}
                        preview
                        previewDevice={previewDevice}
                      />
                    ) : (
                      /* PRICING PLANS PREVIEW (MODAL ONLY) */
                      <Services
                        dict={dict}
                        content={content}
                        styles={styles}
                        items={items}
                        locale={lang}
                        mode={mode}
                        preview
                        previewDevice={previewDevice}
                        onlyModal={true}
                        previewModalId={selectedServiceId}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="mt-0 lg:mt-0 lg:col-span-5 min-w-0 flex flex-col gap-4 px-0 lg:pr-0">

          {/* Tab Navigation */}
          <div className="flex p-1 bg-[#1a1612] rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab("general")}
              className={cn(
                "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                activeTab === "general" 
                  ? "bg-[#2a2419] text-[#f4af25] shadow-sm" 
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              )}
            >
              การตั้งค่าทั่วไป & ดีไซน์
            </button>
            <button
              onClick={() => setActiveTab("plans")}
              className={cn(
                "flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all",
                activeTab === "plans" 
                  ? "bg-[#2a2419] text-[#f4af25] shadow-sm" 
                  : "text-white/40 hover:text-white/60 hover:bg-white/5"
              )}
            >
              แพ็คเกจราคา
            </button>
          </div>

          {activeTab === "general" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Section 1: Header Text & Typography */}
              <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
                    หัวข้อส่วนนี้
                  </h4>
                  <LayoutTemplate className="size-4 text-[#f4af25]" />
                </div>

                <div className="space-y-4">
                  {headerFields.map(field => {
                    const value = (lang === "th" ? content[`${field.base}_th` as keyof ServicesContent] : content[field.base as keyof ServicesContent]) as string;
                    return (
                      <div key={field.id} className="rounded-xl border border-white/5 bg-[#1a1612] px-4 py-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase tracking-widest text-[#cbb790]/60 font-bold">{field.label}</span>
                          {field.fontBase && <Type className="size-3 text-[#f4af25]" />}
                        </div>

                        <input
                          className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                          value={value || ""}
                          onChange={e => updateContentLang(field.base, e.target.value)}
                        />

                        {(field.fontBase || field.colorBase) && (
                          <div className="grid gap-3 pt-2 border-t border-white/5">
                            {field.fontBase && (
                              <div className="grid grid-cols-2 gap-3">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                                  แบบอักษร
                                  <select
                                    className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white"
                                    value={styles[buildFontFamilyKey(field.fontBase, lang)] as string || ""}
                                    onChange={e => updateStyleFont(field.fontBase!, e.target.value)}
                                  >
                                    {fontOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                                </label>
                                {field.sizeKey && (
                                  <SizeInput
                                    label="ขนาด"
                                    value={styles[field.sizeKey as keyof ServicesStyles] as number}
                                    onChange={v => updateStyle(field.sizeKey as keyof ServicesStyles, v)}
                                  />
                                )}
                              </div>
                            )}
                            {field.colorBase && (
                              <ColorInput
                                label="สี"
                                value={styles[buildModeKey(field.colorBase, mode)] as string}
                                onChange={v => updateStyleColor(field.colorBase!, v)}
                                hideValueOnMobile
                              />
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Section 2: Card Styles (Global) */}
              <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
                    ดีไซน์การ์ดบริการ (ทั้งหมด)
                  </h4>
                  <Palette className="size-4 text-[#f4af25]" />
                </div>

                <div className="space-y-4">
                  {cardStyleFields.map(group => (
                    <div key={group.label} className="rounded-xl border border-white/5 bg-[#1a1612] px-4 py-4 space-y-4">
                      <span className="text-[10px] uppercase tracking-widest text-[#cbb790]/60 font-bold block mb-2">{group.label}</span>

                      <div className="space-y-3">
                        {group.fontBase && (
                          <div className="grid grid-cols-2 gap-3">
                            <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                              แบบอักษร
                              <select
                                className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white"
                                value={styles[buildFontFamilyKey(group.fontBase, lang)] as string || ""}
                                onChange={e => updateStyleFont(group.fontBase!, e.target.value)}
                              >
                                {fontOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                              </select>
                            </label>
                            {group.sizeKey && (
                              <SizeInput
                                label="ขนาด"
                                value={styles[group.sizeKey as keyof ServicesStyles] as number}
                                onChange={v => updateStyle(group.sizeKey as keyof ServicesStyles, v)}
                              />
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-1 gap-2">
                          {group.colorBase && (
                            <ColorInput
                              label="สีข้อความ"
                              value={styles[buildModeKey(group.colorBase, mode)] as string}
                              onChange={v => updateStyleColor(group.colorBase!, v)}
                              hideValueOnMobile
                            />
                          )}
                          {group.bgBase && (
                            <ColorInput
                              label="สีพื้นหลัง"
                              value={styles[buildModeKey(group.bgBase, mode)] as string}
                              onChange={v => updateStyleColor(group.bgBase!, v)}
                              hideValueOnMobile
                            />
                          )}
                          {group.borderBase && (
                            <ColorInput
                              label="เส้นขอบ"
                              value={styles[buildModeKey(group.borderBase, mode)] as string}
                              onChange={v => updateStyleColor(group.borderBase!, v)}
                              hideValueOnMobile
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 3: Items */}
              <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
                      การ์ดบริการ
                    </h4>
                    <div className="px-2 py-0.5 rounded-md bg-[#f4af25]/20 text-[#f4af25] text-[10px] font-bold">
                      {items.length}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 text-xs font-semibold text-[#f4af25] hover:text-[#f4af25]/80 transition-colors"
                  >
                    <Plus className="size-4" />
                    เพิ่มการ์ด
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => {
                    const title = lang === "th" ? item.title_th : item.title;
                    const body = lang === "th" ? item.body_th : item.body;
                    const isOpen = activeIndex === item.id;

                    return (
                      <div key={item.id} className="w-full rounded-xl border border-white/10 bg-[#1a1612] overflow-hidden">
                        {/* Item Header */}
                        <div
                          className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                          onClick={() => setActiveIndex(isOpen ? null : item.id)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-md bg-[#2a2419] border border-white/5">
                              <GripVertical className="size-4 text-white/20" />
                            </div>
                            <span className="text-sm font-medium text-white/90">{title || "บริการใหม่"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeItem(index);
                              }}
                              className="p-2 text-white/20 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>

                        {/* Item Body (Collapsible) */}
                        {isOpen && (
                          <div className="p-4 pt-0 space-y-4 border-t border-white/5 mt-2">
                            <div className="grid gap-4 pt-4">
                              {/* Icon Picker */}
                              <div className="space-y-2">
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">ไอคอน</span>
                                <ServiceIconPicker
                                  type={item.iconType}
                                  value={item.iconValue}
                                  onChange={(t, v) => updateItem(index, { iconType: t, iconValue: v })}
                                  color={styles[buildModeKey("cardIconColor", mode)] as string}
                                  bgColor={styles[buildModeKey("cardIconBg", mode)] as string}
                                />
                              </div>

                              <div className="grid gap-3">
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                                  ชื่อบริการ ({lang.toUpperCase()})
                                  <input
                                    className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                    value={title || ""}
                                    onChange={e => updateItem(index, lang === "th" ? { title_th: e.target.value } : { title: e.target.value })}
                                  />
                                </label>
                                <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                                  คำอธิบาย ({lang.toUpperCase()})
                                  <textarea
                                    className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none"
                                    rows={3}
                                    value={body || ""}
                                    onChange={e => updateItem(index, lang === "th" ? { body_th: e.target.value } : { body: e.target.value })}
                                  />
                                </label>
                              </div>

                              {/* Features List */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">รายการฟีเจอร์</span>
                                  <button
                                    type="button"
                                    onClick={() => updateItem(index, { features: [...item.features, "New Feature"] })}
                                    className="text-[10px] text-[#f4af25] font-bold hover:underline"
                                  >
                                    + เพิ่มรายการ
                                  </button>
                                </div>
                                <div className="space-y-2">
                                  {item.features.map((feat, fIndex) => (
                                    <div key={fIndex} className="flex gap-2">
                                      <input
                                        className="w-full bg-[#120f0b] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white"
                                        value={feat}
                                        onChange={e => {
                                          const newFeats = [...item.features];
                                          newFeats[fIndex] = e.target.value;
                                          updateItem(index, { features: newFeats });
                                        }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newFeats = item.features.filter((_, i) => i !== fIndex);
                                          updateItem(index, { features: newFeats });
                                        }}
                                        className="text-white/20 hover:text-red-400"
                                      >
                                        <X className="size-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === "plans" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Step 1: Select Service */}
              <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
                    เลือกบริการเพื่อแก้ไขราคา
                  </h4>
                  <TableProperties className="size-4 text-[#f4af25]" />
                </div>
                
                <div className="grid gap-2">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedServiceId(item.id);
                        setActivePlanIndex(null);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg border text-sm font-medium transition-all",
                        selectedServiceId === item.id 
                          ? "bg-[#f4af25]/10 border-[#f4af25] text-[#f4af25]" 
                          : "bg-[#1a1612] border-white/5 text-white/60 hover:border-white/20 hover:text-white"
                      )}
                    >
                      <span>{lang === "th" ? item.title_th || item.title : item.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full">
                          {(item.modalPlans || []).length} แผน
                        </span>
                        {selectedServiceId === item.id && <CheckCircle2 className="size-4" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {selectedService && (
                <>
                  {/* Step 2: Plans Manager */}
                  <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
                          กำลังจัดการแผนราคาของ: <span className="text-white">{lang === "th" ? selectedService.title_th : selectedService.title}</span>
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={addPlan}
                        className="flex items-center gap-2 text-xs font-semibold text-[#f4af25] hover:text-[#f4af25]/80 transition-colors"
                      >
                        <Plus className="size-4" />
                        เพิ่มแผนราคา
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(selectedService.modalPlans || []).length === 0 ? (
                        <div className="text-center py-8 text-white/30 text-sm">
                          ยังไม่มีแผนราคา คลิก &quot;เพิ่มแผนราคา&quot; เพื่อเริ่มต้น
                        </div>
                      ) : (
                        (selectedService.modalPlans || []).map((plan, pIndex) => {
                          const pTitle = lang === "th" && plan.title_th ? plan.title_th : plan.title;
                          const isOpen = activePlanIndex === pIndex;

                          return (
                            <div key={pIndex} className="w-full rounded-xl border border-white/10 bg-[#1a1612] overflow-hidden">
                              <div
                                className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                                onClick={() => setActivePlanIndex(isOpen ? null : pIndex)}
                              >
                                <span className="text-sm font-medium text-white/90">{pTitle || "แผนไม่มีชื่อ"}</span>
                                <div className="flex items-center gap-2">
                                  {plan.featured && <span className="text-[9px] bg-[#f4af25]/20 text-[#f4af25] px-2 py-0.5 rounded uppercase font-bold">แนะนำ</span>}
                                  <ChevronRight className={cn("size-4 text-white/30 transition-transform", isOpen && "rotate-90")} />
                                </div>
                              </div>

                              {isOpen && (
                                <div className="p-4 border-t border-white/5 space-y-6">
                                  {/* Plan Fields */}
                                  <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                                        ชื่อแผน
                                        <input
                                          className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                          value={(lang === "th" ? plan.title_th : plan.title) || ""}
                                          onChange={e => updatePlan(pIndex, lang === "th" ? { title_th: e.target.value } : { title: e.target.value })}
                                        />
                                      </label>
                                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                                        ราคา
                                        <input
                                          className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                          value={(lang === "th" ? plan.price_th : plan.price) || ""}
                                          onChange={e => updatePlan(pIndex, lang === "th" ? { price_th: e.target.value } : { price: e.target.value })}
                                        />
                                      </label>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                       <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                                        สกุลเงิน
                                        <input
                                          className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                          value={(lang === "th" ? plan.currency_th : plan.currency) || ""}
                                          onChange={e => updatePlan(pIndex, lang === "th" ? { currency_th: e.target.value } : { currency: e.target.value })}
                                        />
                                      </label>
                                       <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                                        ระยะเวลา
                                        <input
                                          className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                          value={(lang === "th" ? plan.period_th : plan.period) || ""}
                                          onChange={e => updatePlan(pIndex, lang === "th" ? { period_th: e.target.value } : { period: e.target.value })}
                                        />
                                      </label>
                                       <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                                        ข้อความปุ่ม
                                        <input
                                          className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                          value={(lang === "th" ? plan.cta_th : plan.cta) || ""}
                                          onChange={e => updatePlan(pIndex, lang === "th" ? { cta_th: e.target.value } : { cta: e.target.value })}
                                        />
                                      </label>
                                    </div>

                                    <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                                      คำอธิบาย
                                      <textarea
                                        className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none"
                                        rows={2}
                                        value={(lang === "th" ? plan.description_th : plan.description) || ""}
                                        onChange={e => updatePlan(pIndex, lang === "th" ? { description_th: e.target.value } : { description: e.target.value })}
                                      />
                                    </label>

                                    {/* Badge & Featured */}
                                    <div className="grid grid-cols-2 gap-4 items-center border-t border-white/5 pt-4">
                                      <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                                        ข้อความป้ายแนะนำ (ไม่บังคับ)
                                        <input
                                          className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white"
                                          placeholder="เช่น ยอดนิยม"
                                          value={(lang === "th" ? plan.badge_th : plan.badge) || ""}
                                          onChange={e => updatePlan(pIndex, lang === "th" ? { badge_th: e.target.value } : { badge: e.target.value })}
                                        />
                                      </label>
                                      <div className="flex items-center gap-2 pt-5">
                                        <input
                                          type="checkbox"
                                          className="size-4 rounded border-white/20 bg-transparent text-[#f4af25] focus:ring-[#f4af25]"
                                          checked={plan.featured || false}
                                          onChange={e => updatePlan(pIndex, { featured: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium text-white">เป็นแผนแนะนำ? (มีเอฟเฟกต์เรืองแสง)</span>
                                      </div>
                                    </div>

                                    {/* Icons */}
                                    <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-4">
                                      <div className="space-y-2">
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">ไอคอนแผน</span>
                                        <ServiceIconPicker
                                          type="material" // Plan icons usually material
                                          value={plan.icon || "diamond"}
                                          onChange={(_, v) => updatePlan(pIndex, { icon: v })}
                                          color={styles[buildModeKey("planTitleColor", mode)] as string}
                                          bgColor="transparent"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">ไอคอนเช็คถูก</span>
                                        <ServiceIconPicker
                                          type="material"
                                          value={plan.featureIcon || "check_circle"}
                                          onChange={(_, v) => updatePlan(pIndex, { featureIcon: v })}
                                          color={styles[buildModeKey("planFeatureColor", mode)] as string}
                                          bgColor="transparent"
                                        />
                                      </div>
                                    </div>

                                    {/* Features List */}
                                    <div className="space-y-2 border-t border-white/5 pt-4">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">รายการฟีเจอร์</span>
                                        <button
                                          type="button"
                                          onClick={() => updatePlan(pIndex, { features: [...plan.features, "New Feature"] })}
                                          className="text-[10px] text-[#f4af25] font-bold hover:underline"
                                        >
                                          + เพิ่มฟีเจอร์
                                        </button>
                                      </div>
                                      <div className="space-y-2">
                                        {plan.features.map((feat, fIndex) => (
                                          <div key={fIndex} className="flex gap-2">
                                            <input
                                              className="w-full bg-[#120f0b] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white"
                                              value={feat}
                                              onChange={e => {
                                                const newFeats = [...plan.features];
                                                newFeats[fIndex] = e.target.value;
                                                updatePlan(pIndex, { features: newFeats });
                                              }}
                                            />
                                            <button
                                              type="button"
                                              onClick={() => {
                                                const newFeats = plan.features.filter((_, i) => i !== fIndex);
                                                updatePlan(pIndex, { features: newFeats });
                                              }}
                                              className="text-white/20 hover:text-red-400"
                                            >
                                              <X className="size-3" />
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                      type="button"
                                      onClick={() => removePlan(pIndex)}
                                      className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-red-500 bg-red-500/5 hover:bg-red-500/10 rounded-lg transition-colors mt-2"
                                    >
                                      <Trash2 className="size-3" />
                                      ลบแผนนี้
                                    </button>

                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Step 3: Global Modal Styling */}
                  <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-4 space-y-4 mt-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
                        ตั้งค่าดีไซน์หน้าต่างราคา (Modal)
                      </h4>
                      <Palette className="size-4 text-[#f4af25]" />
                    </div>

                    <div className="space-y-4">
                      {modalStyleFields.map(group => (
                        <div key={group.label} className="rounded-xl border border-white/5 bg-[#1a1612] px-4 py-4 space-y-4">
                          <span className="text-[10px] uppercase tracking-widest text-[#cbb790]/60 font-bold block mb-2">{group.label}</span>

                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <label className="text-[10px] uppercase tracking-wider font-semibold text-[#cbb790]/60">
                                แบบอักษร
                                <select
                                  className="mt-2 w-full bg-[#120f0b] border border-white/10 rounded-md px-2 py-1.5 text-xs text-white"
                                  value={styles[buildFontFamilyKey(group.fontBase, lang)] as string || ""}
                                  onChange={e => updateStyleFont(group.fontBase!, e.target.value)}
                                >
                                  {fontOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                              </label>
                              {group.sizeKey && (
                                <SizeInput
                                  label="ขนาด"
                                  value={styles[group.sizeKey as keyof ServicesStyles] as number}
                                  onChange={v => updateStyle(group.sizeKey as keyof ServicesStyles, v)}
                                />
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              {group.colorBase && (
                                <ColorInput
                                  label="สีข้อความ"
                                  value={styles[buildModeKey(group.colorBase, mode)] as string}
                                  onChange={v => updateStyleColor(group.colorBase!, v)}
                                  hideValueOnMobile
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
