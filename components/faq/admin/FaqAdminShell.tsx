"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, Loader2, Save, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqContent, FaqItem, FaqContentBundle } from "@/lib/supabase/faq";
import FaqEditor from "@/components/faq/admin/FaqEditor";
import Faq from "@/components/sections/Faq";
import AdminSidebar from "@/components/admin/AdminSidebar";

type Props = {
  content: FaqContentBundle;
};

const cloneContent = (c: FaqContent): FaqContent => JSON.parse(JSON.stringify(c));
const cloneItems = (i: FaqItem[]): FaqItem[] => JSON.parse(JSON.stringify(i));

export default function FaqAdminShell({ content }: Props) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [lang, setLang] = useState<"en" | "th">("th");
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [faqContent, setFaqContent] = useState<FaqContent>(() => cloneContent(content.content));
  const [faqItems, setFaqItems] = useState<FaqItem[]>(() => cloneItems(content.items));

  useEffect(() => {
    setFaqContent(cloneContent(content.content));
    setFaqItems(cloneItems(content.items));
  }, [content]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/faq/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: { content: faqContent, items: faqItems } }),
      });
      if (!res.ok) throw new Error("Save failed");
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("FAQ save failed:", error);
      alert("Failed to save FAQ content");
    } finally {
      setIsSaving(false);
    }
  };

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
          active="faq"
          title="FAQ CMS"
          subtitle="Manage Frequently Asked Questions"
          icon={<HelpCircle className="size-5 text-white" />}
          controls={
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1">
              <button
                onClick={() => setMode("light")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  mode === "light"
                    ? "bg-neutral-800 text-yellow-400 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300"
                )}
                title="Edit Light Mode"
              >
                <Sun className="size-4" />
              </button>
              <button
                onClick={() => setMode("dark")}
                className={cn(
                  "p-2 rounded-md transition-all",
                  mode === "dark"
                    ? "bg-neutral-800 text-blue-400 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300"
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
                  lang === "en"
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                EN
              </button>
              <button
                onClick={() => setLang("th")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold transition-all",
                  lang === "th"
                    ? "bg-neutral-800 text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                TH
              </button>
            </div>
          }
        />

        <main className="w-full">
          <div
            className="w-full px-4 sm:px-6 lg:px-10 pb-24 lg:pb-10"
            style={{ paddingTop: "var(--admin-nav-offset, var(--admin-nav-height, 96px))" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 rounded-full border border-[#3a2f1d] bg-[#1a1612] px-4 py-2">
                <div className="size-2 rounded-full bg-[#f4af25]" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#cbb790]">
                  FAQ Content
                </h2>
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isPending}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-[#4a3b24] bg-[#2a2419] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#f4af25] transition-all hover:bg-[#3a2f1d]",
                  (isSaving || isPending) && "opacity-60 cursor-not-allowed"
                )}
              >
                {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                Save Changes
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
              <div className="rounded-2xl border border-white/10 bg-[#14110d] p-4 lg:sticky lg:top-24">
                <div className={cn("theme-root", mode === "dark" ? "theme-dark" : "theme-light")}>
                  <Faq content={faqContent} items={faqItems} lang={lang} />
                </div>
              </div>
              <FaqEditor
                content={faqContent}
                items={faqItems}
                lang={lang}
                onChangeContent={setFaqContent}
                onChangeItems={setFaqItems}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
