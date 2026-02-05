"use client";

import { useEffect, useState } from "react";
import HeroEditor from "@/components/portfolio/admin/HeroEditor";
import ProjectEditor from "@/components/portfolio/admin/ProjectEditor";
import ProjectModal from "@/components/portfolio/admin/ProjectModal";
import type { PortfolioContent, PortfolioHeroConfig, PortfolioProject } from "@/lib/supabase/portfolio";
import { LayoutDashboard, Save, Plus, Loader2, CheckCircle, AlertCircle, Briefcase, LayoutTemplate, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminSidebar from "@/components/admin/AdminSidebar";

type Props = {
  content: PortfolioContent;
};

type ViewMode = "hero" | "projects";

const cloneContent = (c: PortfolioContent): PortfolioContent => JSON.parse(JSON.stringify(c));

export default function PortfolioAdminShell({ content }: Props) {
  const [draft, setDraft] = useState<PortfolioContent>(() => cloneContent(content));
  const [view, setView] = useState<ViewMode>("projects");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Global Editing Context
  const [lang, setLang] = useState<"en" | "th">("th");
  const [mode, setMode] = useState<"light" | "dark">("dark");

  // Modal State
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setDraft(cloneContent(content));
  }, [content]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/portfolio/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: draft }),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast({ msg: "Changes saved successfully", type: "success" });
    } catch {
      setToast({ msg: "Failed to save changes", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateHero = (h: PortfolioHeroConfig) => setDraft(prev => ({ ...prev, hero: h }));

  const updateProject = (id: string, p: PortfolioProject) => {
    setDraft(prev => ({
      ...prev,
      projects: prev.projects.map(proj => proj.id === id ? p : proj)
    }));
  };

  const addProject = () => {
    const newId = Math.random().toString(36).slice(2) + Date.now().toString(36);
    const newP: PortfolioProject = {
      id: newId,
      title: "New Project",
      description: "",
      image: "",
      link: "",
      breadcrumbs: "",
      details: [],
      tech: [],
      gallery: [],
      styles: {}
    };
    setDraft(prev => ({ ...prev, projects: [newP, ...prev.projects] }));
    setView("projects");
    setEditingId(newId); // Open modal immediately
  };

  const removeProject = (id: string) => {
    setDraft(prev => ({ ...prev, projects: prev.projects.filter(p => p.id !== id) }));
  };

  const editingProject = draft.projects.find(p => p.id === editingId);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-orange-500/30">
      <AdminSidebar
        active="portfolio"
        title="Portfolio CMS"
        subtitle=""
        icon={<LayoutDashboard className="size-5 text-white" />}
        controls={
          <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1 mr-2">
            <button
              onClick={() => setMode('light')}
              className={cn("p-2 rounded-md transition-all", mode === 'light' ? "bg-neutral-800 text-yellow-400 shadow-sm" : "text-neutral-500 hover:text-neutral-300")}
              title="Edit Light Mode"
            >
              <Sun className="size-4" />
            </button>
            <button
              onClick={() => setMode('dark')}
              className={cn("p-2 rounded-md transition-all", mode === 'dark' ? "bg-neutral-800 text-blue-400 shadow-sm" : "text-neutral-500 hover:text-neutral-300")}
              title="Edit Dark Mode"
            >
              <Moon className="size-4" />
            </button>

            <div className="w-px h-auto bg-neutral-800 mx-1.5 my-1" />

            <button
              onClick={() => setLang("en")}
              className={cn("px-2.5 py-1 rounded-md text-xs font-bold transition-all", lang === "en" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300")}
            >
              EN
            </button>
            <button
              onClick={() => setLang("th")}
              className={cn("px-2.5 py-1 rounded-md text-xs font-bold transition-all", lang === "th" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300")}
            >
              TH
            </button>
          </div>
        }
      />

      <main className="w-full">
        <div
          className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10 pb-24 lg:pb-10"
          style={{ paddingTop: "var(--admin-nav-offset, var(--admin-nav-height, 96px))" }}
        >
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-8">
            <div>
              <nav className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-2">
                <span>Dashboard</span>
                <span className="text-neutral-700">/</span>
                <span className="text-neutral-300">Portfolio</span>
              </nav>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Portfolio Management
              </h2>
            </div>

            <div className="flex items-center gap-3" />
          </header>

          {/* View Switcher Tabs (Desktop Only) */}
          <div className="hidden lg:inline-flex mb-8 p-1 bg-neutral-900 border border-neutral-800 rounded-xl gap-1 w-full sm:w-auto">
            <button
              onClick={() => setView('projects')}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                view === 'projects'
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50"
              )}
            >
              <Briefcase className="size-4" />
              <span>Projects</span>
              <span className="ml-1.5 text-xs bg-neutral-950 text-neutral-400 px-2 py-0.5 rounded-full border border-neutral-800">
                {draft.projects.length}
              </span>
            </button>
            <button
              onClick={() => setView('hero')}
              className={cn(
                "flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                view === 'hero'
                  ? "bg-neutral-800 text-white shadow-sm"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50"
              )}
            >
              <LayoutTemplate className="size-4" />
              <span>Hero Configuration</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {view === 'hero' ? (
              <HeroEditor hero={draft.hero} onChange={updateHero} lang={lang} mode={mode} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {draft.projects.map((p, i) => (
                  <ProjectEditor
                    key={p.id}
                    project={p}
                    index={i}
                    onEdit={() => setEditingId(p.id)}
                    onRemove={() => removeProject(p.id)}
                  />
                ))}

                {/* Empty State / Add New */}
                <button
                  onClick={addProject}
                  className="group relative flex flex-col items-center justify-center gap-4 min-h-[300px] rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 hover:bg-neutral-900/40 hover:border-orange-500/30 transition-all duration-300"
                >
                  <div className="size-16 rounded-full bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-neutral-800 group-hover:border-orange-500/30">
                    <Plus className="size-6 text-neutral-500 group-hover:text-orange-500 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">Create New Project</p>
                    <p className="text-xs text-neutral-500 mt-1">Add another case study to your portfolio</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* === Project Modal === */}
      {editingProject && (
        <ProjectModal
          project={editingProject}
          onClose={() => setEditingId(null)}
          onSave={(updated) => updateProject(updated.id, updated)}
          lang={lang}
          mode={mode}
        />
      )}

      {/* === Mobile Nav (Floating) === */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1 p-1.5 rounded-full bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 shadow-2xl shadow-black/50">
          <button
            onClick={() => setView('projects')}
            className={cn(
              "p-3 rounded-full transition-all",
              view === 'projects' ? "bg-neutral-800 text-orange-500" : "text-neutral-400 hover:text-white"
            )}
          >
            <Briefcase className="size-5" />
          </button>

          <button
            onClick={addProject}
            className="p-3 rounded-full bg-orange-600 text-white shadow-lg shadow-orange-900/20 mx-1 active:scale-95 transition-transform"
          >
            <Plus className="size-6" />
          </button>

          <button
            onClick={() => setView('hero')}
            className={cn(
              "p-3 rounded-full transition-all",
              view === 'hero' ? "bg-neutral-800 text-orange-500" : "text-neutral-400 hover:text-white"
            )}
          >
            <LayoutTemplate className="size-5" />
          </button>
        </div>
      </div>

      {/* === Toast Notification === */}
      {toast && (
        <div className={cn(
          "fixed top-6 right-6 z-[110] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 border",
          toast.type === 'success'
            ? "bg-neutral-900/95 border-emerald-500/20 text-emerald-500"
            : "bg-neutral-900/95 border-red-500/20 text-red-500"
        )}>
          {toast.type === 'success' ? <CheckCircle className="size-5" /> : <AlertCircle className="size-5" />}
          <span className="font-medium text-sm text-neutral-200">{toast.msg}</span>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className={cn(
          "fixed bottom-6 right-6 z-[130] size-12 rounded-full bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/30 transition-all active:scale-95 flex items-center justify-center",
          isSaving && "opacity-70 cursor-not-allowed"
        )}
        aria-label="Save Changes"
        title="Save Changes"
      >
        {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
      </button>
    </div>
  );
}
