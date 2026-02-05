"use client";

import { useEffect, useState } from "react";
import {
  GalleryHorizontal,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  MessageSquareQuote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  HomeContent,
  HomeMarqueeShowcase,
  HomeMarqueeStyles,
  HomeMarqueeItem,
  HomeQuote,
  HomeQuoteStyles
} from "@/lib/supabase/home";
import MarqueeShowcaseEditor from "@/components/home/admin/MarqueeShowcaseEditor";
import QuoteEditor from "@/components/home/admin/QuoteEditor";
import AdminSidebar from "@/components/admin/AdminSidebar";

type Props = {
  content: HomeContent;
};

type ViewMode = "marquee" | "quote";

const cloneContent = (c: HomeContent): HomeContent => JSON.parse(JSON.stringify(c));

export default function MarqueeAdminShell({ content }: Props) {
  const [draft, setDraft] = useState<HomeContent>(() => cloneContent(content));
  const [view, setView] = useState<ViewMode>("marquee");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [lang, setLang] = useState<"en" | "th">("th");
  const [mode, setMode] = useState<"light" | "dark">("dark");

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
      // Reuse the home save API since the tables are related to home content
      const res = await fetch("/api/home/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: draft }),
      });
      if (!res.ok) throw new Error("Save failed");
      setToast({ msg: "บันทึกข้อมูลเรียบร้อยแล้ว", type: "success" });
    } catch {
      setToast({ msg: "เกิดข้อผิดพลาดในการบันทึก", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const updateMarqueeContent = (next: HomeMarqueeShowcase) => setDraft(prev => ({ ...prev, marqueeShowcase: next }));
  const updateMarqueeStyles = (next: HomeMarqueeStyles) => setDraft(prev => ({ ...prev, marqueeStyles: next }));
  const updateMarqueeItems = (next: HomeMarqueeItem[]) => setDraft(prev => ({ ...prev, marqueeItems: next }));

  const updateQuoteContent = (next: HomeQuote) => setDraft(prev => ({ ...prev, quote: next }));
  const updateQuoteStyles = (next: HomeQuoteStyles) => setDraft(prev => ({ ...prev, quoteStyles: next }));

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
          active="marquee"
          title="Marquee CMS"
          subtitle="Showcase Editor"
          icon={<GalleryHorizontal className="size-5 text-white" />}
          controls={
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1">
                <button
                  suppressHydrationWarning
                  onClick={() => setMode("light")}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    mode === "light" ? "bg-neutral-800 text-yellow-400 shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                )}
                title="โหมดสว่าง"
              >
                <Sun className="size-4" />
              </button>
                <button
                  suppressHydrationWarning
                  onClick={() => setMode("dark")}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    mode === "dark" ? "bg-neutral-800 text-blue-400 shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                )}
                title="โหมดมืด"
              >
                <Moon className="size-4" />
              </button>

              <div className="w-px h-auto bg-neutral-800 mx-1.5 my-1" />

              <button
                suppressHydrationWarning
                onClick={() => setLang("en")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-bold transition-all",
                  lang === "en" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-300"
                )}
              >
                EN
              </button>
              <button
                suppressHydrationWarning
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
            className="w-full pb-24 lg:pb-10"
            style={{ paddingTop: "var(--admin-nav-offset, var(--admin-nav-height, 96px))" }}
          >
            <div className="hidden lg:flex items-center gap-4 mb-8 pl-10">
              <div className="flex items-center gap-3 rounded-full border border-[#3a2f1d] bg-[#1a1612] px-4 py-2">
                <div className="size-2 rounded-full bg-[#f4af25]" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#cbb790]">
                  จัดการส่วนเสริม
                </h2>
              </div>
              <div className="inline-flex p-1 rounded-full border border-[#3a2f1d] bg-[#1a1612] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <button
                  suppressHydrationWarning
                  onClick={() => setView("marquee")}
                  className={cn(
                    "flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                    view === "marquee"
                      ? "bg-[#2a2419] text-[#f4af25] shadow-[0_10px_25px_rgba(244,175,37,0.15)]"
                      : "text-[#cbb790]/70 hover:text-white hover:bg-[#231d15]"
                  )}
                >
                  <GalleryHorizontal className="size-4" />
                  <span>ป้ายวิ่ง (Marquee)</span>
                </button>
                <button
                  suppressHydrationWarning
                  onClick={() => setView("quote")}
                  className={cn(
                    "flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                    view === "quote"
                      ? "bg-[#2a2419] text-[#f4af25] shadow-[0_10px_25px_rgba(244,175,37,0.15)]"
                      : "text-[#cbb790]/70 hover:text-white hover:bg-[#231d15]"
                  )}
                >
                  <MessageSquareQuote className="size-4" />
                  <span>คำคม (Quote)</span>
                </button>
              </div>
            </div>

            <div className="animate-in fade-in duration-500 px-0 sm:px-6 lg:px-10">
              {view === "marquee" ? (
                <MarqueeShowcaseEditor
                  content={draft.marqueeShowcase}
                  styles={draft.marqueeStyles}
                  items={draft.marqueeItems}
                  lang={lang}
                  mode={mode}
                  onContentChange={updateMarqueeContent}
                  onStylesChange={updateMarqueeStyles}
                  onItemsChange={updateMarqueeItems}
                />
              ) : (
                <QuoteEditor
                  content={draft.quote}
                  styles={draft.quoteStyles}
                  lang={lang}
                  mode={mode}
                  onContentChange={updateQuoteContent}
                  onStylesChange={updateQuoteStyles}
                />
              )}
            </div>
          </div>
        </main>

        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-1 p-1.5 rounded-full bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 shadow-2xl shadow-black/50">
            <button
              suppressHydrationWarning
              onClick={() => setView("marquee")}
              className={cn(
                "p-3 rounded-full transition-all",
                view === "marquee" ? "bg-neutral-800 text-orange-500" : "text-neutral-400 hover:text-white"
              )}
            >
              <GalleryHorizontal className="size-5" />
            </button>
            <button
              suppressHydrationWarning
              onClick={() => setView("quote")}
              className={cn(
                "p-3 rounded-full transition-all",
                view === "quote" ? "bg-neutral-800 text-orange-500" : "text-neutral-400 hover:text-white"
              )}
            >
              <MessageSquareQuote className="size-5" />
            </button>
          </div>
        </div>

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

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "fixed bottom-6 right-6 z-[130] size-12 rounded-full bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/30 transition-all active:scale-95 flex items-center justify-center",
            isSaving && "opacity-70 cursor-not-allowed"
          )}
          aria-label="บันทึกข้อมูล"
          title="บันทึกข้อมูล"
        >
          {isSaving ? <Loader2 className="size-5 animate-spin" /> : <Save className="size-5" />}
        </button>
      </div>
    </div>
  );
}
