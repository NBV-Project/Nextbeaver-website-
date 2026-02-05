"use client";

import { useState, useRef, useCallback, useId } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  label?: string;
  bucket?: string;
  value?: string;
  onUploaded: (url: string) => void;
  onError?: (error: string) => void;
  accept?: string;
  maxSizeMB?: number;
  compact?: boolean;
  iconOnly?: boolean;
};

const DEFAULT_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_BUCKET ?? "portfolio-assets";

export default function ImageUploader({
  label,
  bucket = DEFAULT_BUCKET,
  value,
  onUploaded,
  onError,
  accept = "image/*,image/svg+xml",
  maxSizeMB = 10,
  compact = false,
  iconOnly = false,
}: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  const handleFiles = useCallback(async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      onError?.(`File limit: ${maxSizeMB}MB`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", bucket);

      const response = await fetch("/api/portfolio/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Upload failed");
      }

      onUploaded(payload.url);
    } catch (error) {
      onError?.(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  }, [bucket, maxSizeMB, onError, onUploaded]);

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div className="w-full">
      {label && <label className="text-[11px] font-medium text-neutral-500 uppercase mb-2 block">{label}</label>}

      <label
        htmlFor={inputId}
        className={cn(
          "relative border-2 border-dashed rounded-xl transition-all duration-200 cursor-pointer overflow-hidden group",
          iconOnly ? "p-2 w-10 h-10 flex items-center justify-center" : compact ? "p-4" : "p-8",
          isDragging 
            ? "border-orange-500 bg-orange-500/5" 
            : "border-neutral-800 bg-neutral-900/30 hover:bg-neutral-900/50 hover:border-neutral-700"
        )}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={e => { e.preventDefault(); setIsDragging(false); }}
        onDrop={handleDrop}
      >
        {isUploading && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-2">
            <Loader2 className="size-6 text-orange-500 animate-spin" />
            <span className="text-xs text-neutral-400 font-medium">Uploading...</span>
          </div>
        )}

        <div className={cn("flex flex-col items-center gap-3 text-center", iconOnly && "gap-0")}>
          <div className={cn(
            iconOnly ? "size-6" : compact ? "size-10" : "size-12",
            "rounded-full flex items-center justify-center transition-colors duration-200",
            isDragging ? "bg-orange-500/20 text-orange-500" : "bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700 group-hover:text-neutral-200"
          )}>
            <Upload className={cn(iconOnly ? "size-4" : compact ? "size-4" : "size-5")} />
          </div>
          {iconOnly ? null : (
            <div>
              <p className={cn(compact ? "text-xs" : "text-sm", "font-medium text-neutral-200")}>
                Click to upload or drag & drop
              </p>
              <p className={cn(compact ? "text-[10px]" : "text-xs", "text-neutral-500 mt-1")}>
                PNG, JPG, SVG up to {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>

        {value && !iconOnly && (
          <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="relative size-10 shrink-0 rounded-md overflow-hidden bg-neutral-950 border border-neutral-800">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                sizes="40px"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-emerald-500 mb-0.5">
                <CheckCircle2 className="size-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Upload Complete</span>
              </div>
              <p className="text-xs text-neutral-500 truncate font-mono">{value.split('/').pop()}</p>
            </div>
          </div>
        )}

        <input
          id={inputId}
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={e => handleFiles(e.target.files)}
        />
      </label>
    </div>
  );
}
