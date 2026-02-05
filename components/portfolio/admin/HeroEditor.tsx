"use client";

import { Type, Palette, Eye } from "lucide-react";
import type { PortfolioHeroConfig, PortfolioHeroStyles } from "@/lib/supabase/portfolio";
import { cn } from "@/lib/utils";

type Props = {
  hero: PortfolioHeroConfig;
  onChange: (h: PortfolioHeroConfig) => void;
  lang: "en" | "th";
  mode: "light" | "dark";
};

const fontOptions = (
  <>
    <option value="">Default (Global Theme)</option>
    <optgroup label="System Fonts">
      <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif">System UI</option>
      <option value="Arial, Helvetica, sans-serif">Arial</option>
      <option value="Verdana, Geneva, sans-serif">Verdana</option>
    </optgroup>
    <optgroup label="Popular Sans-Serif">
      <option value="Inter, sans-serif">Inter</option>
      <option value="Manrope, sans-serif">Manrope</option>
      <option value="Roboto, sans-serif">Roboto</option>
      <option value="'Open Sans', sans-serif">Open Sans</option>
      <option value="Lato, sans-serif">Lato</option>
      <option value="Montserrat, sans-serif">Montserrat</option>
      <option value="Poppins, sans-serif">Poppins</option>
    </optgroup>
    <optgroup label="Elegant Serif">
      <option value="'Playfair Display', serif">Playfair Display</option>
      <option value="Merriweather, serif">Merriweather</option>
      <option value="Lora, serif">Lora</option>
      <option value="Georgia, serif">Georgia</option>
    </optgroup>
    <optgroup label="Display & Handwritten">
      <option value="Oswald, sans-serif">Oswald</option>
      <option value="Bebas Neue, sans-serif">Bebas Neue</option>
      <option value="'Dancing Script', cursive">Dancing Script</option>
    </optgroup>
    <optgroup label="Monospace">
      <option value="'Fira Code', monospace">Fira Code</option>
      <option value="'Courier New', Courier, monospace">Courier New</option>
    </optgroup>
  </>
);

const sizeOptions = (
  <>
    <option value="">Default</option>
    <option value="1rem">XS (1rem)</option>
    <option value="1.25rem">SM (1.25rem)</option>
    <option value="1.5rem">MD (1.5rem)</option>
    <option value="2rem">LG (2rem)</option>
    <option value="2.5rem">XL (2.5rem)</option>
    <option value="3rem">2XL (3rem)</option>
    <option value="4rem">3XL (4rem)</option>
    <option value="5rem">4XL (5rem)</option>
    <option value="6rem">5XL (6rem)</option>
    <option value="clamp(2rem, 5vw, 4rem)">Responsive (Clamp 2-4rem)</option>
    <option value="clamp(3rem, 8vw, 6rem)">Responsive (Clamp 3-6rem)</option>
  </>
);

export default function HeroEditor({ hero, onChange, lang, mode }: Props) {
  const styles = hero.styles ?? {};

  const update = (field: keyof PortfolioHeroConfig, val: string) => onChange({ ...hero, [field]: val });
  const updateStyle = (key: keyof PortfolioHeroStyles, val: string) => onChange({ ...hero, styles: { ...styles, [key]: val } });

  // Helpers to get the correct field name based on mode
  const titleColorField = mode === 'dark' ? 'titleColorDark' : 'titleColor';
  const accentColorField = mode === 'dark' ? 'accentColorDark' : 'accentColor';
  const descColorField = mode === 'dark' ? 'descriptionColorDark' : 'descriptionColor';

  // Helpers for language fields
  const getLangField = (field: string) => {
    if (lang === "en") return field as keyof PortfolioHeroConfig;
    return `${field}_th` as keyof PortfolioHeroConfig;
  };

  // Default fallbacks for preview
  const currentTitleColor = styles[titleColorField] || (mode === 'dark' ? '#ffffff' : '#000000');
  const currentAccentColor = styles[accentColorField] || '#f27f0d';
  const currentDescColor = styles[descColorField] || (mode === 'dark' ? '#9ca3af' : '#4b5563');

  // Preview content
  const previewTitle = (hero[getLangField("title")] as string) || "Title";
  const previewAccent = (hero[getLangField("accent")] as string) || "Accent";
  const previewDesc = (hero[getLangField("description")] as string) || "Description...";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Content Config */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm h-fit">
        <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Type className="size-4 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-200">Content & Style</h3>
              <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Configuration ({lang.toUpperCase()})</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Main Title ({lang.toUpperCase()})</label>
            <input
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              value={(hero[getLangField("title")] as string) || ""}
              onChange={e => update(getLangField("title"), e.target.value)}
              placeholder={lang === "en" ? "e.g. Creating Digital Experiences" : "เช่น สร้างสรรค์ประสบการณ์ดิจิทัล"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Accent Text ({lang.toUpperCase()})</label>
            <input
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
              value={(hero[getLangField("accent")] as string) || ""}
              onChange={e => update(getLangField("accent"), e.target.value)}
              placeholder={lang === "en" ? "e.g. That Inspire" : "เช่น ที่สร้างแรงบันดาลใจ"}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Description ({lang.toUpperCase()})</label>
            <textarea
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700 transition-all resize-none"
              rows={4}
              value={(hero[getLangField("description")] as string) || ""}
              onChange={e => update(getLangField("description"), e.target.value)}
              placeholder={lang === "en" ? "Brief introduction..." : "คำอธิบายสั้นๆ..."}
            />
          </div>
        </div>
      </div>

      {/* Style & Preview Sim */}
      <div className="flex flex-col gap-6">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm flex-1">
          <div className="px-6 py-4 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Palette className="size-4 text-purple-500" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-200">Appearance</h3>
                <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider">Visual settings</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            <div className={cn(
               "text-xs font-medium px-3 py-2 rounded-lg mb-4 flex items-center gap-2",
               mode === 'light' ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            )}>
              <span>Editing colors for {mode === 'light' ? 'Light' : 'Dark'} Mode</span>
            </div>

            {/* Title Settings */}
            <div className="space-y-3 pb-4 border-b border-neutral-800">
               <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Title Typography</label>
               <div className="grid grid-cols-2 gap-3">
                 <div className="col-span-2">
                   <select 
                     className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                     value={styles.titleFontFamily || ""}
                     onChange={e => updateStyle('titleFontFamily', e.target.value)}
                   >
                     {fontOptions}
                   </select>
                 </div>
                 <select 
                   className="bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                   value={styles.titleFontSize || ""}
                   onChange={e => updateStyle('titleFontSize', e.target.value)}
                 >
                   {sizeOptions}
                 </select>
                 <div className="flex gap-2">
                   <div className="relative size-8 rounded border border-neutral-800 shrink-0 overflow-hidden">
                     <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 border-0 cursor-pointer" value={styles[titleColorField] || (mode === 'light' ? '#000000' : '#ffffff')} onChange={e => updateStyle(titleColorField, e.target.value)} />
                   </div>
                   <input className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-2 py-2 text-xs text-white uppercase" value={styles[titleColorField] || ""} onChange={e => updateStyle(titleColorField, e.target.value)} placeholder="COLOR" />
                 </div>
               </div>
            </div>

            {/* Accent Settings */}
             <div className="space-y-3 pb-4 border-b border-neutral-800">
               <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Accent Color</label>
               <div className="flex gap-2">
                 <div className="relative size-8 rounded border border-neutral-800 shrink-0 overflow-hidden">
                   <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 border-0 cursor-pointer" value={styles[accentColorField] || "#f27f0d"} onChange={e => updateStyle(accentColorField, e.target.value)} />
                 </div>
                 <input className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-orange-500/50" value={styles[accentColorField] || ""} onChange={e => updateStyle(accentColorField, e.target.value)} placeholder="#HEX" />
               </div>
            </div>

            {/* Description Settings */}
            <div className="space-y-3">
               <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Description Typography</label>
               <div className="grid grid-cols-2 gap-3">
                 <div className="col-span-2">
                   <select 
                     className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                     value={styles.descriptionFontFamily || ""}
                     onChange={e => updateStyle('descriptionFontFamily', e.target.value)}
                   >
                     {fontOptions}
                   </select>
                 </div>
                 <select 
                   className="bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500/50"
                   value={styles.descriptionFontSize || ""}
                   onChange={e => updateStyle('descriptionFontSize', e.target.value)}
                 >
                   {sizeOptions}
                 </select>
                 <div className="flex gap-2">
                   <div className="relative size-8 rounded border border-neutral-800 shrink-0 overflow-hidden">
                     <input type="color" className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 border-0 cursor-pointer" value={styles[descColorField] || (mode === 'light' ? '#333333' : '#9ca3af')} onChange={e => updateStyle(descColorField, e.target.value)} />
                   </div>
                   <input className="w-full bg-neutral-950 border border-neutral-800 rounded-md px-2 py-2 text-xs text-white uppercase" value={styles[descColorField] || ""} onChange={e => updateStyle(descColorField, e.target.value)} placeholder="COLOR" />
                 </div>
               </div>
            </div>
            
            {/* Live Preview Block */}
            <div className={cn(
              "relative overflow-hidden rounded-xl border p-6 sm:p-8 mt-4 transition-colors duration-300",
              mode === 'light' ? "bg-white border-neutral-200" : "bg-black border-neutral-800"
            )}>
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <div className="size-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 blur-3xl" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-medium uppercase tracking-wider mb-4">
                  <Eye className="size-3" />
                  <span>Live Preview ({mode === 'light' ? 'Light' : 'Dark'} - {lang.toUpperCase()})</span>
                </div>
                <h1 
                  className="font-bold text-3xl leading-tight tracking-tight transition-colors duration-300"
                  style={{
                    color: currentTitleColor,
                    fontFamily: styles.titleFontFamily || 'inherit',
                    fontSize: styles.titleFontSize || undefined
                  }}
                >
                  {previewTitle} <span style={{ color: currentAccentColor }}>{previewAccent}</span>
                </h1>
                <p 
                  className="mt-4 text-base transition-colors duration-300 max-w-md leading-relaxed"
                  style={{
                    color: currentDescColor,
                    fontFamily: styles.descriptionFontFamily || 'inherit',
                    fontSize: styles.descriptionFontSize || undefined
                  }}
                >
                  {previewDesc}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}