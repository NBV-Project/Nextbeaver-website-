"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { HomeQuote, HomeQuoteStyles } from "@/lib/supabase/home";
import Quote from "@/components/sections/Quote";
import IconPicker from "./IconPicker";

type Props = {
  content: HomeQuote;
  styles: HomeQuoteStyles;
  lang: "en" | "th";
  mode: "light" | "dark";
  onContentChange: (content: HomeQuote) => void;
  onStylesChange: (styles: HomeQuoteStyles) => void;
};

export default function QuoteEditor({
  content,
  styles,
  lang,
  mode,
  onContentChange,
  onStylesChange,
}: Props) {
  const memoizedContent = useMemo(() => content, [content]);
  const memoizedStyles = useMemo(() => styles, [styles]);

  const updateContent = <T extends keyof HomeQuote>(key: T, value: HomeQuote[T]) => {
    onContentChange({ ...content, [key]: value });
  };

  const updateStyle = <T extends keyof HomeQuoteStyles>(key: T, value: HomeQuoteStyles[T]) => {
    onStylesChange({ ...styles, [key]: value });
  };

  // Helper to get correct value based on lang/mode for the preview
  const getVal = (en?: string, th?: string) => (lang === "th" ? th || en : en);
  const getStyle = (light?: string, dark?: string) => (mode === "light" ? light : dark);

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
                  Quote Section
                </h2>
              </div>
              <div className="px-0 py-0 sm:px-0 sm:py-0">
                {/* Render the actual Quote component with overridden props for preview */}
                <Quote
                  dict={{
                    quote: {
                      body: getVal(content.body, content.body_th) || "",
                      name: getVal(content.authorName, content.authorName_th) || "",
                      role: getVal(content.authorRole, content.authorRole_th) || "",
                    }
                  }}
                  previewContent={memoizedContent}
                  previewStyles={memoizedStyles}
                  previewMode={mode}
                  previewLang={lang}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col gap-6 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto lg:pr-2 lg:admin-scrollbar">
        
        {/* Content Editor */}
        <div className="p-6 bg-[#2a2419] rounded-xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
              เนื้อหา ({lang.toUpperCase()})
            </h4>
            <span className="material-symbols-outlined text-primary">edit_note</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold mb-2 block">
                เนื้อหาคำคม
              </label>
              <textarea
                className="w-full h-32 bg-[#15110d] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none resize-none"
                value={lang === "th" ? content.body_th || "" : content.body}
                onChange={(e) => updateContent(lang === "th" ? "body_th" : "body", e.target.value)}
                placeholder="กรอกข้อความคำคม..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                <label className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold mb-2 block">
                  ชื่อผู้แต่ง
                </label>
                <input
                  type="text"
                  className="w-full bg-[#15110d] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-primary/50 outline-none"
                  value={lang === "th" ? content.authorName_th || "" : content.authorName}
                  onChange={(e) => updateContent(lang === "th" ? "authorName_th" : "authorName", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold mb-2 block">
                  ตำแหน่ง/บทบาท
                </label>
                <input
                  type="text"
                  className="w-full bg-[#15110d] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-primary/50 outline-none"
                  value={lang === "th" ? content.authorRole_th || "" : content.authorRole}
                  onChange={(e) => updateContent(lang === "th" ? "authorRole_th" : "authorRole", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Icon Editor */}
        <div className="p-6 bg-[#2a2419] rounded-xl border border-white/5 space-y-6">
           <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
              ไอคอน
            </h4>
            <span className="material-symbols-outlined text-primary">image</span>
          </div>

          <div className="space-y-4">
             <label className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold mb-2 block">
                เลือกไอคอน
             </label>
             <IconPicker 
                value={content.icon}
                onChange={(val) => updateContent("icon", val)}
                color={getStyle(styles.iconColorLight, styles.iconColorDark)}
                bgColor={getStyle(styles.sectionBgLight, styles.sectionBgDark)}
             />
          </div>
        </div>


        {/* Styles Editor */}
        <div className="p-6 bg-[#2a2419] rounded-xl border border-white/5 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
              ตัวอักษรและสี ({mode === 'light' ? 'สว่าง' : 'มืด'})
            </h4>
            <span className="material-symbols-outlined text-primary">palette</span>
          </div>
          
          {/* Section Background */}
          <div className="flex items-center justify-between gap-4">
            <label className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold">
              สีพื้นหลังส่วนนี้
            </label>
            <div className="flex items-center gap-2">
               <input
                type="color"
                className="size-8 rounded cursor-pointer bg-transparent border-none"
                value={getStyle(styles.sectionBgLight, styles.sectionBgDark)}
                onChange={(e) => updateStyle(mode === "light" ? "sectionBgLight" : "sectionBgDark", e.target.value)}
              />
              <span className="text-[10px] font-mono text-white/60">{getStyle(styles.sectionBgLight, styles.sectionBgDark)}</span>
            </div>
          </div>

           {/* Icon Color */}
           <div className="flex items-center justify-between gap-4">
            <label className="text-[10px] uppercase tracking-widest text-[#cbb790]/50 font-bold">
              สีไอคอน
            </label>
             {/* Note: Color input doesn't support alpha well, but let's provide text input for precision */}
            <div className="flex items-center gap-2">
                <input
                  type="text" 
                  className="w-24 bg-[#15110d] border border-white/10 rounded px-2 py-1 text-xs text-white text-right"
                  value={getStyle(styles.iconColorLight, styles.iconColorDark)}
                  onChange={(e) => updateStyle(mode === "light" ? "iconColorLight" : "iconColorDark", e.target.value)}
                />
            </div>
          </div>

          <div className="h-px bg-white/5 my-4" />

          {/* Body Text Style */}
          <div className="space-y-3">
             <div className="text-[10px] uppercase tracking-widest text-primary/80 font-bold">สไตล์เนื้อหาคำคม</div>
             <div className="grid grid-cols-2 gap-4">
                <select
                  className="bg-[#15110d] border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                  value={getVal(styles.bodyFontFamilyEn, styles.bodyFontFamilyTh)}
                  onChange={(e) => updateStyle(lang === "th" ? "bodyFontFamilyTh" : "bodyFontFamilyEn", e.target.value)}
                >
                  {FONT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <input
                  type="number"
                  className="bg-[#15110d] border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                  value={styles.bodyFontSize}
                  onChange={(e) => updateStyle("bodyFontSize", Number(e.target.value))}
                  placeholder="ขนาด (px)"
                />
                 <div className="col-span-2 flex items-center justify-between">
                    <span className="text-xs text-white/60">สีข้อความ</span>
                     <input
                      type="color"
                      className="size-6 rounded cursor-pointer bg-transparent border-none"
                      value={getStyle(styles.bodyColorLight, styles.bodyColorDark)}
                      onChange={(e) => updateStyle(mode === "light" ? "bodyColorLight" : "bodyColorDark", e.target.value)}
                    />
                 </div>
             </div>
          </div>

           <div className="h-px bg-white/5 my-4" />

          {/* Author Name Style */}
          <div className="space-y-3">
             <div className="text-[10px] uppercase tracking-widest text-primary/80 font-bold">สไตล์ชื่อผู้แต่ง</div>
             <div className="grid grid-cols-2 gap-4">
                <select
                  className="bg-[#15110d] border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                  value={getVal(styles.authorFontFamilyEn, styles.authorFontFamilyTh)}
                  onChange={(e) => updateStyle(lang === "th" ? "authorFontFamilyTh" : "authorFontFamilyEn", e.target.value)}
                >
                  {FONT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <input
                  type="number"
                  className="bg-[#15110d] border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                  value={styles.authorFontSize}
                  onChange={(e) => updateStyle("authorFontSize", Number(e.target.value))}
                  placeholder="ขนาด (px)"
                />
                 <div className="col-span-2 flex items-center justify-between">
                    <span className="text-xs text-white/60">สีข้อความ</span>
                     <input
                      type="color"
                      className="size-6 rounded cursor-pointer bg-transparent border-none"
                      value={getStyle(styles.authorColorLight, styles.authorColorDark)}
                      onChange={(e) => updateStyle(mode === "light" ? "authorColorLight" : "authorColorDark", e.target.value)}
                    />
                 </div>
             </div>
          </div>

          <div className="h-px bg-white/5 my-4" />

           {/* Author Role Style */}
          <div className="space-y-3">
             <div className="text-[10px] uppercase tracking-widest text-primary/80 font-bold">สไตล์ตำแหน่ง/บทบาท</div>
             <div className="grid grid-cols-2 gap-4">
                <select
                  className="bg-[#15110d] border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                  value={getVal(styles.roleFontFamilyEn, styles.roleFontFamilyTh)}
                  onChange={(e) => updateStyle(lang === "th" ? "roleFontFamilyTh" : "roleFontFamilyEn", e.target.value)}
                >
                   {FONT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <input
                  type="number"
                  className="bg-[#15110d] border border-white/10 rounded px-2 py-1.5 text-xs text-white"
                  value={styles.roleFontSize}
                  onChange={(e) => updateStyle("roleFontSize", Number(e.target.value))}
                  placeholder="ขนาด (px)"
                />
                 <div className="col-span-2 flex items-center justify-between">
                    <span className="text-xs text-white/60">สีข้อความ</span>
                     <input
                      type="color"
                      className="size-6 rounded cursor-pointer bg-transparent border-none"
                      value={getStyle(styles.roleColorLight, styles.roleColorDark)}
                      onChange={(e) => updateStyle(mode === "light" ? "roleColorLight" : "roleColorDark", e.target.value)}
                    />
                 </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
const FONT_OPTIONS = [
  { label: "Space Grotesk", value: "Space Grotesk, sans-serif" },
  { label: "Inter", value: "Inter, sans-serif" },
  { label: "Playfair Display", value: "Playfair Display, serif" },
  { label: "Fira Code", value: "Fira Code, monospace" },
];
