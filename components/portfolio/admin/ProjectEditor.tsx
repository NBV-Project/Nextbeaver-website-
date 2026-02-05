"use client";

import { useState } from "react";
import type { PortfolioProject } from "@/lib/supabase/portfolio";
import { Trash2, Edit2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  project: PortfolioProject;
  index: number;
  onEdit: () => void;
  onRemove: () => void;
};

export default function ProjectEditor({ project, index, onEdit, onRemove }: Props) {
  const [deleting, setDeleting] = useState(false);

  if (deleting) {
    return (
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[140px] animate-in fade-in zoom-in-95 duration-200">
        <h3 className="text-sm font-semibold text-red-500 mb-2">Delete &quot;{project.title}&quot;?</h3>
        <p className="text-xs text-neutral-400 mb-6 max-w-[200px]">This action cannot be undone.</p>
        <div className="flex items-center gap-3">
          <button 
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium transition-colors" 
            onClick={() => setDeleting(false)}
          >
            Cancel
          </button>
          <button 
            className="px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 border border-red-500/20 text-xs font-medium transition-colors" 
            onClick={onRemove}
          >
            Confirm Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/50 hover:border-neutral-700">
      {/* Thumbnail */}
      <div className="aspect-video w-full bg-neutral-950 relative border-b border-neutral-800 overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt=""
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 400px, 100vw"
            unoptimized
          />
        ) : (
          <div className="size-full flex items-center justify-center text-neutral-700">
            <ImageIcon className="size-8 opacity-50" />
          </div>
        )}
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
           <button 
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-600 text-white font-medium text-xs shadow-lg shadow-orange-900/40 hover:scale-105 transition-transform"
           >
             <Edit2 className="size-3.5" />
             Edit
           </button>
           <button 
            onClick={() => setDeleting(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-medium text-xs border border-neutral-700 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30 transition-all"
           >
             <Trash2 className="size-3.5" />
           </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider bg-orange-500/10 px-1.5 py-0.5 rounded">
            #{index + 1}
          </span>
          {project.link && (
            <a href={project.link} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-neutral-300 transition-colors ml-auto">
              <LinkIcon className="size-3" />
            </a>
          )}
        </div>
        
        <h3 className="font-bold text-neutral-100 truncate text-sm mb-1 group-hover:text-orange-500 transition-colors">
          {project.title || "Untitled Project"}
        </h3>
        <p className="text-xs text-neutral-500 line-clamp-2 min-h-[2.5em]">
          {project.description || "No description provided"}
        </p>
      </div>
    </div>
  );
}
