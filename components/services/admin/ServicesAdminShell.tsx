"use client";

import { useEffect, useState } from "react";
import {
  LayoutGrid,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ServicesData, ServicesContent, ServicesStyles, ServiceItem } from "@/lib/supabase/services";
import ServicesEditor from "@/components/services/admin/ServicesEditor";
import AdminSidebar from "@/components/admin/AdminSidebar";

type Props = {
  initialData: ServicesData;
};

const cloneData = (d: ServicesData): ServicesData => JSON.parse(JSON.stringify(d));

export default function ServicesAdminShell({ initialData }: Props) {
  const [draft, setDraft] = useState<ServicesData>(() => cloneData(initialData));
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [lang, setLang] = useState<"en" | "th">("th");
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [isHydrated, setIsHydrated] = useState(false);

  // Reset draft when initialData changes (revalidation)
  useEffect(() => {
    setDraft(cloneData(initialData));
  }, [initialData]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);


  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/services/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: draft }),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast({ msg: "Changes saved successfully", type: "success" });
    } catch (error) {
      console.error(error);
      setToast({ msg: "Failed to save changes", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = (next: ServicesContent) => setDraft(prev => ({ ...prev, content: next }));
  const updateStyles = (next: ServicesStyles) => setDraft(prev => ({ ...prev, styles: next }));
  const updateItems = (next: ServiceItem[]) => setDraft(prev => ({ ...prev, items: next }));

  return (
    <div className="min-h-screen bg-[#1a1612] text-neutral-100 font-sans selection:bg-orange-500/30 relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(244, 175, 37, 0.08), transparent 55%), radial-gradient(circle at 80% 10%, rgba(203, 183, 144, 0.08), transparent 45%), radial-gradient(circle at 60% 90%, rgba(73, 60, 34, 0.3), transparent 55%)",
        }}
      />
      <div className="relative z-10">
        <AdminSidebar
          active="services"
          title="Services CMS"
          subtitle=""
          icon={<LayoutGrid className="size-5 text-white" />}
          controls={
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setMode("light")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  mode === "light" ? "bg-neutral-800 text-yellow-400 shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                )}
                title="Edit Light Mode"
              >
                <Sun className="size-4" />
              </button>
              <button
                onClick={() => setMode("dark")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  mode === "dark" ? "bg-neutral-800 text-blue-400 shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                )}
                title="Edit Dark Mode"
              >
                <Moon className="size-4" />
              </button>

              <div className="w-px h-auto bg-neutral-800 mx-1.5 my-1" />

              <button
                onClick={() => setLang("en")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold transition-all",
                  lang === "en" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLang("th")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold transition-all",
                  lang === "th" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                TH
              </button>
            </div>
          }
        />

        <main className="w-full">
          <div
            className="w-full px-0 sm:px-6 lg:px-10 pb-24 lg:pb-10"
            style={{ paddingTop: "var(--admin-nav-offset, var(--admin-nav-height, 96px))" }}
          >
            <div className="hidden lg:flex items-center gap-4 mb-8">
              <div className="flex items-center gap-3 rounded-full border border-[#3a2f1d] bg-[#1a1612] px-4 py-2">
                <div className="size-2 rounded-full bg-[#f4af25]" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#cbb790]">
                  Services Management
                </h2>
              </div>
            </div>

            <div className="animate-in fade-in duration-500">
              {isHydrated ? (
                <ServicesEditor
                  content={draft.content}
                  styles={draft.styles}
                  items={draft.items}
                  lang={lang}
                  mode={mode}
                  onContentChange={updateContent}
                  onStylesChange={updateStyles}
                  onItemsChange={updateItems}
                />
              ) : (
                <div className="rounded-2xl border border-white/5 bg-[#2a2419] p-6 text-sm text-white/50">
                  Loading editor...
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Floating Save Button */}
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

        {/* Toast */}
        {toast && (
          <div
            className={cn(
              "fixed top-6 right-6 z-[110] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl animate-in slide-in-from-top-4 fade-in duration-300 border",
              toast.type === "success"
                ? "bg-neutral-900/95 border-emerald-500/20 text-emerald-500"
                : "bg-neutral-900/95 border-red-500/20 text-red-500"
            )}
          >
            {toast.type === "success" ? <CheckCircle className="size-5" /> : <AlertCircle className="size-5" />}
            <span className="font-medium text-sm text-neutral-200">{toast.msg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
