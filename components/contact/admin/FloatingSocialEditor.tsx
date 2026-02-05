"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, X, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FloatingSocialItem } from "@/lib/supabase/contact";

type Props = {
  items: FloatingSocialItem[];
  lang: "en" | "th";
  onChange: (items: FloatingSocialItem[]) => void;
};

// Expanded list of popular social media SVGs
const presetIcons = {
  facebook: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103.435.057.807.123 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>',
  line: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>',
  instagram: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-.99 0-1.49.18-1.76.91-3.43 2.1-4.76 1.46-1.7 3.6-2.7 5.8-2.79.02 1.9.01 3.8 0 5.7-.13-.01-.26 0-.38.01-1.14.04-2.25.67-2.75 1.69-.45.76-.47 1.73-.2 2.55.29.93 1.11 1.67 2.04 1.87.46.08.93.08 1.4 0 .78-.14 1.44-.62 1.78-1.32.25-.47.37-1 .37-1.54-.01-3.07 0-6.13 0-9.2z"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.87 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.149-1.613a11.881 11.881 0 005.899 1.558h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.737-1.851 3.363-1.851 3.6 0 4.273 2.369 4.273 5.455v6.287zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  phone: '<span class="material-icons">phone</span>',
  mail: '<span class="material-icons">mail</span>',
};

const ColorInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
}) => (
  <label className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
    <span className="text-left">{label}</span>
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        className="h-7 w-7 rounded border border-neutral-800 bg-neutral-950 cursor-pointer"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
      />
      <input
        className="w-20 bg-neutral-950 border border-neutral-800 rounded-md px-2 py-1 text-[10px] text-white uppercase"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#ffffff"
      />
    </div>
  </label>
);

export default function FloatingSocialEditor({ items, lang, onChange }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addItem = () => {
    const newItem: FloatingSocialItem = {
      id: `social-${Date.now()}`,
      label: "New Link",
      label_th: "ช่องทางใหม่",
      href: "#",
      type: "other",
      iconSvg: presetIcons.mail,
      orderIndex: items.length,
      bgColor: "#1a1612",
      iconColor: "#ffffff",
    };
    onChange([...items, newItem]);
    setEditingId(newItem.id);
  };

  const removeItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const updateItem = (id: string, updates: Partial<FloatingSocialItem>) => {
    onChange(items.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= items.length) return;
    const newItems = [...items];
    const [movedItem] = newItems.splice(index, 1);
    newItems.splice(newIndex, 0, movedItem);
    onChange(newItems.map((item, idx) => ({ ...item, orderIndex: idx })));
  };

  const activeItem = items.find((item) => item.id === editingId);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-[#2a2419] rounded-xl border border-white/5 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
             <h4 className="uppercase tracking-[0.2em] text-xs font-bold text-[#cbb790]">
               ช่องทางโซเชียล
             </h4>
             <div className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] text-primary font-bold">
                {items.length}
             </div>
          </div>
          <button
            onClick={addItem}
            className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80"
          >
            <Plus className="size-4" />
            เพิ่มช่องทาง
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border bg-[#15110d] transition-all",
                editingId === item.id
                  ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                  : "border-white/5 hover:border-white/10"
              )}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div
                  className="size-9 rounded-lg border border-white/10 flex items-center justify-center shrink-0 overflow-hidden [&_svg]:size-5 [&_span]:text-lg"
                  style={{
                    backgroundColor: item.bgColor || "#1a1612",
                    color: item.iconColor || "#f4af25"
                  }}
                  dangerouslySetInnerHTML={{ __html: item.iconSvg }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">
                    {lang === "th" ? item.label_th || item.label : item.label}
                  </div>
                  <div className="text-[10px] text-white/40 truncate font-mono">
                    {item.href}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <div className="flex flex-col">
                   <button
                     onClick={() => moveItem(index, -1)}
                     disabled={index === 0}
                     className="p-0.5 text-white/40 hover:text-white disabled:opacity-10"
                   >
                     <ChevronUp className="size-3" />
                   </button>
                   <button
                     onClick={() => moveItem(index, 1)}
                     disabled={index === items.length - 1}
                     className="p-0.5 text-white/40 hover:text-white disabled:opacity-10"
                   >
                     <ChevronDown className="size-3" />
                   </button>
                </div>
                <button
                  onClick={() => setEditingId(item.id)}
                  className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[#1a1612] border border-white/5 text-[#cbb790] hover:border-primary/40 hover:text-white transition-all ml-1"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-white/20 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
          
          {items.length === 0 && (
             <div className="text-center py-10 rounded-xl border border-dashed border-white/5 bg-[#15110d]">
                <p className="text-xs text-[#cbb790]/40">ยังไม่ได้เพิ่มช่องทางโซเชียล</p>
             </div>
          )}
        </div>
      </div>

      {activeItem && (
        <div className="fixed inset-0 z-[120] flex items-end justify-end px-0 sm:px-6 pb-0 sm:pb-5" style={{ paddingTop: "calc(var(--admin-nav-height, 96px) + 20px)" }}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingId(null)} />
          <div className="relative w-full max-w-none sm:max-w-md max-h-[84vh] sm:max-h-[70vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-[#3a2f1d] bg-[#1a1612] shadow-[0_30px_80px_rgba(0,0,0,0.55)] p-6 space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                 <div className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">กำลังแก้ไข</div>
                 <h3 className="text-lg font-bold text-white">ช่องทางโซเชียล</h3>
              </div>
              <button
                onClick={() => setEditingId(null)}
                className="size-9 rounded-full border border-white/10 bg-[#15110d] flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Color Customization */}
              <div className="p-4 bg-[#120f0b] rounded-xl border border-white/5 space-y-3">
                <div className="text-[10px] uppercase tracking-widest font-bold text-[#cbb790]/60 mb-2">
                  ธีมสี
                </div>
                <ColorInput
                  label="สีพื้นหลัง"
                  value={activeItem.bgColor}
                  onChange={(val) => updateItem(activeItem.id, { bgColor: val })}
                />
                <ColorInput
                  label="สีไอคอน"
                  value={activeItem.iconColor}
                  onChange={(val) => updateItem(activeItem.id, { iconColor: val })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="text-[10px] uppercase tracking-widest font-bold text-[#cbb790]/60 mb-2 block">
                     ชื่อเรียก (Label)
                   </label>
                   <input
                     className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary/50 outline-none"
                     value={lang === "th" ? activeItem.label_th || "" : activeItem.label}
                     onChange={(e) =>
                       updateItem(activeItem.id, {
                         ...(lang === "th" ? { label_th: e.target.value } : { label: e.target.value }),
                       })
                     }
                   />
                 </div>
                 <div>
                   <label className="text-[10px] uppercase tracking-widest font-bold text-[#cbb790]/60 mb-2 block">
                     ประเภท
                   </label>
                   <select 
                      className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary/50 outline-none"
                      value={activeItem.type}
                      onChange={(e) => updateItem(activeItem.id, { type: e.target.value })}
                   >
                      <option value="facebook">Facebook</option>
                      <option value="line">Line</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="x">X (Twitter)</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="youtube">YouTube</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="phone">Phone Call</option>
                      <option value="mail">Email</option>
                      <option value="other">Other Link</option>
                   </select>
                 </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#cbb790]/60 mb-2 block">
                  ลิงก์ปลายทาง (URL / tel: / mailto:)
                </label>
                <input
                  className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary/50 outline-none font-mono"
                  value={activeItem.href}
                  onChange={(e) => updateItem(activeItem.id, { href: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#cbb790]/60 block">
                  เลือกไอคอน
                </label>
                <div className="grid grid-cols-5 gap-2 p-3 bg-[#120f0b] rounded-xl border border-white/5">
                  {Object.entries(presetIcons).map(([key, svg]) => (
                    <button
                      key={key}
                      onClick={() => updateItem(activeItem.id, { iconSvg: svg, type: key })}
                      className={cn(
                        "aspect-square rounded-lg border flex items-center justify-center transition-all group relative",
                        activeItem.iconSvg === svg
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-[#15110d] border-white/5 text-white/40 hover:border-white/20 hover:text-white"
                      )}
                      dangerouslySetInnerHTML={{ __html: svg }}
                      title={key}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/5 p-4 space-y-3">
                 <div className="flex items-center gap-2 text-primary">
                    <Info className="size-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">ขั้นสูง: ฝังโค้ด SVG เอง</span>
                 </div>
                 <textarea
                   className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-4 py-3 text-[10px] text-white/50 font-mono h-20 resize-none focus:border-primary/30 outline-none"
                   value={activeItem.iconSvg}
                   onChange={(e) => updateItem(activeItem.id, { iconSvg: e.target.value, type: "custom" })}
                   placeholder="<svg>...</svg>"
                 />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
