"use client";

import { useState } from "react";
import { Image as ImageIcon, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUploader from "@/components/ui/ImageUploader";
import Image from "next/image";

type Props = {
  type: "material" | "svg";
  value: string;
  onChange: (type: "material" | "svg", value: string) => void;
  color?: string;
  bgColor?: string;
};

const commonIcons = [
  "architecture",
  "palette",
  "diamond",
  "auto_awesome",
  "code",
  "rocket_launch",
  "verified",
  "terminal",
  "security",
  "cloud",
  "analytics",
  "brush",
  "campaign",
  "speed",
  "smart_toy",
];

export default function ServiceIconPicker({
  type,
  value,
  onChange,
  color = "#ffffff",
  bgColor = "rgba(255,255,255,0.1)",
}: Props) {
  const [tab, setTab] = useState<"material" | "svg">(type);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap bg-[#120f0b] p-1 rounded-lg border border-white/10 w-full">
        <button
          type="button"
          onClick={() => {
            setTab("material");
            if (type !== "material") onChange("material", "diamond");
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
            setTab("svg");
            if (type !== "svg") onChange("svg", "");
          }}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all",
            tab === "svg"
              ? "bg-[#2a2419] text-[#f4af25] shadow-sm"
              : "text-white/40 hover:text-white/70"
          )}
        >
          <ImageIcon className="size-3" />
          SVG Upload
        </button>
      </div>

      {/* Content */}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div className="space-y-3">
          {tab === "material" ? (
            <div className="space-y-3">
              <input
                className="w-full bg-[#120f0b] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20"
                placeholder="e.g. rocket_launch"
                value={value}
                onChange={(e) => onChange("material", e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => onChange("material", icon)}
                    className={cn(
                      "flex items-center justify-center size-8 rounded-md border transition-all",
                      value === icon
                        ? "bg-[#f4af25]/20 border-[#f4af25] text-[#f4af25]"
                        : "bg-[#1a1612] border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                    )}
                    title={icon}
                  >
                    <span className="material-symbols-outlined text-lg">{icon}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full max-w-xs">
              <ImageUploader
                bucket="portfolio-assets"
                value={value}
                onUploaded={(url) => onChange("svg", url)}
                compact
                iconOnly={false}
                accept="image/svg+xml,image/png,image/jpeg"
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
            className="flex items-center justify-center size-16 rounded-xl border border-white/10 transition-all duration-300"
            style={{ backgroundColor: bgColor }}
          >
            {tab === "material" ? (
              <span
                className="material-symbols-outlined text-3xl transition-colors duration-300"
                style={{ color }}
              >
                {value || "diamond"}
              </span>
            ) : value ? (
              <Image
                src={value}
                alt="Icon"
                width={32}
                height={32}
                className="size-8 object-contain transition-all duration-300"
                style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                unoptimized
              />
            ) : (
              <ImageIcon className="size-6 text-white/20" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
