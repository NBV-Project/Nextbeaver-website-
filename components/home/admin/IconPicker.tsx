"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUploader from "@/components/ui/ImageUploader";
import Image from "next/image";

type Props = {
  value: string;
  onChange: (value: string) => void;
  color?: string;
  bgColor?: string;
};

const commonIcons = [
  "format_quote",
  "star",
  "favorite",
  "lightbulb",
  "bolt",
  "auto_awesome",
  "verified",
  "thumb_up",
  "chat",
  "reviews",
  "psychology",
  "diamond",
];

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "portfolio-assets";

export default function IconPicker({
  value,
  onChange,
  color = "#ffffff",
  bgColor = "rgba(255,255,255,0.1)",
}: Props) {
  // Determine initial type based on value
  const isUrl = value.startsWith("http") || value.startsWith("/");
  const [tab, setTab] = useState<"material" | "image">(isUrl ? "image" : "material");

  // Sync tab when value becomes an image URL, but don't force-switch away from Image tab
  useEffect(() => {
    if (value.startsWith("http") || value.startsWith("/")) {
      if (tab !== "image") {
        requestAnimationFrame(() => setTab("image"));
      }
    }
  }, [value, tab]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap bg-[#120f0b] p-1 rounded-lg border border-white/10 w-full">
        <button
          type="button"
          onClick={() => {
            setTab("material");
            // If current value is an URL, switch to default material icon
            if (isUrl) onChange("format_quote");
          }}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
            tab === "material"
              ? "bg-[#2a2419] text-[#f4af25] shadow-sm"
              : "text-white/40 hover:text-white/70"
          )}
        >
          <Type className="size-3" />
          Material Symbol
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("image");
          }}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
            tab === "image"
              ? "bg-[#2a2419] text-[#f4af25] shadow-sm"
              : "text-white/40 hover:text-white/70"
          )}
        >
          <ImageIcon className="size-3" />
          Image Upload
        </button>
      </div>

      {/* Content */}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          {tab === "material" ? (
            <div className="space-y-3">
              <input
                className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20"
                placeholder="e.g. format_quote"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => onChange(icon)}
                    className={cn(
                      "flex items-center justify-center size-10 rounded-lg border transition-all",
                      value === icon
                        ? "bg-[#f4af25]/20 border-[#f4af25] text-[#f4af25]"
                        : "bg-[#1a1612] border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                    )}
                    title={icon}
                  >
                    <span className="material-symbols-outlined text-xl">{icon}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full">
              <ImageUploader
                label="Upload Icon / Logo"
                bucket={DEFAULT_BUCKET}
                value={value}
                onUploaded={(url) => onChange(url)}
                compact
                iconOnly={false}
                accept="image/svg+xml,image/png,image/jpeg,image/webp"
              />
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center gap-2 min-w-[100px]">
          <span className="text-[10px] uppercase tracking-wider text-white/40 font-semibold">
            Preview
          </span>
          <div
            className="flex items-center justify-center size-20 rounded-xl border border-white/10 transition-all duration-300"
            style={{ backgroundColor: bgColor }}
          >
            {tab === "material" ? (
              <span
                className="material-symbols-outlined text-4xl transition-colors duration-300"
                style={{ color }}
              >
                {value || "format_quote"}
              </span>
            ) : value ? (
              <Image
                src={value}
                alt="Icon"
                width={40}
                height={40}
                className="size-10 object-contain transition-all duration-300"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                unoptimized
              />
            ) : (
              <ImageIcon className="size-8 text-white/20" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
