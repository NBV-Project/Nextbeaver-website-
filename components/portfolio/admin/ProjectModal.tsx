"use client";

import { useState } from "react";
import ImageUploader from "@/components/ui/ImageUploader";
import type { PortfolioProject } from "@/lib/supabase/portfolio";
import { Trash2, Link as LinkIcon, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  project: PortfolioProject;
  onClose: () => void;
  onSave: (p: PortfolioProject) => void;
  lang: "en" | "th";
  mode: "light" | "dark";
};

export default function ProjectModal({ project: initialProject, onClose, onSave, lang, mode }: Props) {
  const [project, setProject] = useState<PortfolioProject>(initialProject);
  const [activeTab, setActiveTab] = useState<"info" | "content" | "media" | "style">("info");

  const update = <T extends keyof PortfolioProject>(f: T, v: PortfolioProject[T]) => {
    const updated = { ...project, [f]: v };
    setProject(updated);
    onSave(updated); // Live sync
  };

  const getLangField = (field: string) => {
    if (lang === "en") return field as keyof PortfolioProject;
    return `${field}_th` as keyof PortfolioProject;
  };

  const titleColorField = mode === 'dark' ? 'titleColorDark' : 'titleColor';
  const currentTitleColor = project.styles?.[titleColorField] || (mode === 'dark' ? '#ffffff' : '#181411');

  const tags = ((project.tech || []) as string[]).join("\n");
  const detailsRaw = (project[getLangField("details")] || []) as string[];
  const details = detailsRaw.join("\n");
  const gallery = (project.gallery || []) as string[];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl shadow-black animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              {project.title || "Untitled Project"}
            </h2>
            <p className="text-xs text-neutral-500">Editing Project Details ({lang.toUpperCase()})</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={onClose}
               className="size-8 flex items-center justify-center rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
             >
               <X className="size-5" />
             </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 pb-0 overflow-x-auto shrink-0 border-b border-neutral-800">
          <div className="flex gap-6">
            {["info", "content", "media", "style"].map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t as "info" | "content" | "media" | "style")}
                className={cn(
                  "pb-3 text-sm font-medium transition-all relative",
                  activeTab === t 
                    ? "text-orange-500" 
                    : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {activeTab === t && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {activeTab === "info" && (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Project Title ({lang.toUpperCase()})</label>
                </div>
                <input 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-neutral-700" 
                  value={(project[getLangField("title")] as string) || ""} 
                  onChange={e => update(getLangField("title"), e.target.value)} 
                  placeholder={lang === "en" ? "Enter project name..." : "ชื่อโปรเจกต์..."}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">External Link (Shared)</label>
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-3.5 size-4 text-neutral-600" />
                  <input 
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all placeholder:text-neutral-700" 
                    value={project.link || ""} 
                    onChange={e => update('link', e.target.value)} 
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Short Description ({lang.toUpperCase()})</label>
                <textarea 
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none placeholder:text-neutral-700" 
                  rows={4} 
                  value={(project[getLangField("description")] as string) || ""} 
                  onChange={e => update(getLangField("description"), e.target.value)} 
                  placeholder={lang === "en" ? "Brief summary..." : "รายละเอียดโดยย่อ..."}
                />
              </div>
            </div>
          )}

          {activeTab === "content" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tech Stack (Shared)</label>
                  <span className="text-[10px] text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">One per line</span>
                </div>
                <textarea
                  className="w-full h-[300px] bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm font-mono text-neutral-300 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none leading-relaxed"
                  value={tags}
                  onChange={e => update('tech', e.target.value.split('\n'))}
                  placeholder="React&#10;TypeScript&#10;Tailwind"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Key Features ({lang.toUpperCase()})</label>
                  <span className="text-[10px] text-neutral-600 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">One per line</span>
                </div>
                <textarea
                  className="w-full h-[300px] bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-300 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all resize-none leading-relaxed"
                  value={details}
                  onChange={e => update(getLangField("details"), e.target.value.split('\n'))}
                  placeholder={lang === "en" ? "Feature 1...\nFeature 2..." : "คุณสมบัติ 1...\nคุณสมบัติ 2..."}
                />
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-8 max-w-3xl mx-auto">
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Cover Image</label>
                <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-2">
                   <ImageUploader value={project.image} onUploaded={u => update('image', u)} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Gallery</label>
                  <span className="text-xs font-medium text-neutral-400">{gallery.length} Images</span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {gallery.map((url, i) => (
                    <div key={i} className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shadow-sm">
                      <Image
                        src={url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 200px, 25vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button
                          onClick={() => {
                            const newG = [...gallery];
                            newG.splice(i, 1);
                            update('gallery', newG);
                          }}
                          className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all scale-90 group-hover:scale-100"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="aspect-square flex flex-col items-center justify-center bg-neutral-900/50 border border-dashed border-neutral-800 rounded-xl text-neutral-600 hover:bg-neutral-900 hover:border-neutral-700 transition-all p-2">
                     <span className="text-xs text-center px-1 mb-2">Upload new</span>
                     <ArrowRight className="size-4 opacity-50" />
                  </div>
                </div>
                
                <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-2 mt-4">
                   <ImageUploader label="Add Image to Gallery" onUploaded={u => update('gallery', [...gallery, u])} />
                </div>
              </div>
            </div>
          )}

                                        {activeTab === "style" && (

                                          <div className="space-y-6 max-w-2xl mx-auto">

                                            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl mb-6">

                                               <p className="text-xs text-orange-400 flex items-start gap-2">

                                                 <span className="text-lg leading-none">💡</span>

                                                 These settings override global styles for this specific project card.

                                               </p>

                                            </div>

                    

                                  <div className="space-y-2">

                                     <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Title Font Family</label>

                                     <div className="relative">

                                       <select

                                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all appearance-none cursor-pointer"

                                          value={project.styles?.titleFontFamily || ""}

                                          onChange={e => update('styles', { ...project.styles, titleFontFamily: e.target.value })}

                                       >

                                          <option value="">Default (Global Theme)</option>

                                          <optgroup label="System Fonts">

                                            <option value="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'">System UI (macOS, iOS)</option>

                                            <option value="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'">System UI (Windows, Linux)</option>

                                            <option value="'Segoe UI', Arial, sans-serif">Segoe UI</option>

                                            <option value="Arial, Helvetica, sans-serif">Arial</option>

                                            <option value="Verdana, Geneva, sans-serif">Verdana</option>

                                            <option value="Tahoma, Geneva, sans-serif">Tahoma</option>

                                          </optgroup>

                                          <optgroup label="Popular Sans-Serif">

                                            <option value="Inter, sans-serif">Inter</option>

                                            <option value="Manrope, sans-serif">Manrope</option>

                                            <option value="Roboto, sans-serif">Roboto</option>

                                            <option value="'Open Sans', sans-serif">Open Sans</option>

                                            <option value="Lato, sans-serif">Lato</option>

                                            <option value="Montserrat, sans-serif">Montserrat</option>

                                            <option value="Poppins, sans-serif">Poppins</option>

                                            <option value="Raleway, sans-serif">Raleway</option>

                                            <option value="Nunito, sans-serif">Nunito</option>

                                            <option value="Ubuntu, sans-serif">Ubuntu</option>

                                            <option value="Quicksand, sans-serif">Quicksand</option>

                                            <option value="Source Sans Pro, sans-serif">Source Sans Pro</option>

                                            <option value="Rubik, sans-serif">Rubik</option>

                                            <option value="Outfit, sans-serif">Outfit</option>

                                          </optgroup>

                                          <optgroup label="Elegant Serif">

                                            <option value="'Playfair Display', serif">Playfair Display</option>

                                            <option value="Merriweather, serif">Merriweather</option>

                                            <option value="Lora, serif">Lora</option>

                                            <option value="Georgia, serif">Georgia</option>

                                            <option value="'Times New Roman', Times, serif">Times New Roman</option>

                                            <option value="Cormorant Garamond, serif">Cormorant Garamond</option>

                                            <option value="Spectral, serif">Spectral</option>

                                          </optgroup>

                                          <optgroup label="Display & Handwritten">

                                            <option value="Oswald, sans-serif">Oswald</option>

                                            <option value="Bebas Neue, sans-serif">Bebas Neue</option>

                                            <option value="'Dancing Script', cursive">Dancing Script</option>

                                            <option value="'Pacifico', cursive">Pacifico</option>

                                            <option value="'Lobster', cursive">Lobster</option>

                                          </optgroup>

                                          <optgroup label="Monospace">

                                            <option value="'Fira Code', monospace">Fira Code</option>

                                            <option value="'Source Code Pro', monospace">Source Code Pro</option>

                                            <option value="'Roboto Mono', monospace">Roboto Mono</option>

                                            <option value="'Space Mono', monospace">Space Mono</option>

                                            <option value="Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace">Menlo (macOS)</option>

                                            <option value="'Courier New', Courier, monospace">Courier New</option>

                                          </optgroup>

                                       </select>

                                       <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">

                                         <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>

                                       </div>

                                     </div>

                                  </div>

                    

                                  <div className="space-y-2">

                                     <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Title Color ({mode === 'light' ? 'Light' : 'Dark'})</label>

                                     <div className="flex gap-3">

                                       <div className="relative size-11 rounded-lg border border-neutral-800 shrink-0 shadow-inner overflow-hidden group">

                                         <input 

                                           type="color" 

                                           className="absolute inset-0 w-[150%] h-[150%] -top-[25%] -left-[25%] p-0 border-0 cursor-pointer"

                                           value={currentTitleColor}

                                           onChange={e => update('styles', { ...project.styles, [titleColorField]: e.target.value })}

                                         />

                                       </div>

                                       <input 

                                          className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all font-mono uppercase"

                                          value={currentTitleColor} 

                                          onChange={e => update('styles', { ...project.styles, [titleColorField]: e.target.value })}

                                          placeholder="#FFFFFF or var(--color-text)" 

                                       />

                                     </div>

                                  </div>

                    

                                  {/* Card Preview */}

                                  <div className="mt-8 pt-6 border-t border-neutral-800">

                                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4 block">Live Preview ({mode})</label>

                                    <div 

                                      className={cn(

                                        "relative w-full max-w-sm mx-auto aspect-[3/4] rounded-xl overflow-hidden shadow-2xl transition-colors duration-300",

                                        mode === 'light' ? "bg-white" : "bg-[#181411]"

                                      )}

                                    >

                                      <div className="h-[60%] w-full bg-neutral-800 relative">

                                        {project.image ? (

                                          <Image
                                            src={project.image}
                                            alt=""
                                            fill
                                            className="object-cover"
                                            sizes="200px"
                                            unoptimized
                                          />

                                        ) : (

                                          <div className="size-full flex items-center justify-center text-neutral-600">No Image</div>

                                        )}

                                      </div>

                                      <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 to-transparent pt-12">

                                        <h3 

                                          className="text-2xl font-bold leading-tight"

                                          style={{

                                            fontFamily: project.styles?.titleFontFamily || 'inherit',

                                            color: currentTitleColor

                                          }}

                                        >

                                          {project.title || "Project Title"}

                                        </h3>

                                        <p className="mt-2 text-sm opacity-80 text-white line-clamp-2">

                                          {project.description || "Project description preview..."}

                                        </p>

                                      </div>

                                    </div>

                                  </div>

                                </div>

                              )}

          
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-800 bg-neutral-900/95 backdrop-blur rounded-b-2xl shrink-0 flex justify-end gap-3">
          <button 
             onClick={onClose}
             className="px-5 py-2.5 rounded-lg border border-neutral-800 hover:bg-neutral-800 text-neutral-300 text-sm font-medium transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
