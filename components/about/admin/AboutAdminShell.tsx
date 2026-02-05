"use client";

import { useEffect, useState } from "react";
import {
  Info,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Workflow,
  LayoutTemplate,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AboutBody,
  AboutContent,
  AboutPillar,
  AboutStyles,
  AboutContentBundle,
} from "@/lib/supabase/about";
import type {
  ProcessContent,
  ProcessStep,
  ProcessStyles,
  ProcessContentBundle,
} from "@/lib/supabase/process";
import AboutEditor from "@/components/about/admin/AboutEditor";
import ProcessEditor from "@/components/process/admin/ProcessEditor";
import AdminSidebar from "@/components/admin/AdminSidebar";

type Props = {
  aboutData: AboutContentBundle;
  processData: ProcessContentBundle;
};

const cloneAboutContent = (c: AboutContent): AboutContent => JSON.parse(JSON.stringify(c));
const cloneAboutStyles = (s: AboutStyles): AboutStyles => JSON.parse(JSON.stringify(s));
const cloneAboutBody = (b: AboutBody[]): AboutBody[] => JSON.parse(JSON.stringify(b));
const cloneAboutPillars = (p: AboutPillar[]): AboutPillar[] => JSON.parse(JSON.stringify(p));

const cloneProcessContent = (c: ProcessContent): ProcessContent => JSON.parse(JSON.stringify(c));
const cloneProcessStyles = (s: ProcessStyles): ProcessStyles => JSON.parse(JSON.stringify(s));
const cloneProcessSteps = (s: ProcessStep[]): ProcessStep[] => JSON.parse(JSON.stringify(s));

export default function AboutAdminShell({
  aboutData,
  processData,
}: Props) {
  // About State
  const [aboutContent, setAboutContent] = useState<AboutContent>(() => cloneAboutContent(aboutData.content));
  const [aboutStyles, setAboutStyles] = useState<AboutStyles>(() => cloneAboutStyles(aboutData.styles));
  const [aboutBody, setAboutBody] = useState<AboutBody[]>(() => cloneAboutBody(aboutData.body));
  const [aboutPillars, setAboutPillars] = useState<AboutPillar[]>(() => cloneAboutPillars(aboutData.pillars));

  // Process State
  const [processContent, setProcessContent] = useState<ProcessContent>(() => cloneProcessContent(processData.content));
  const [processStyles, setProcessStyles] = useState<ProcessStyles>(() => cloneProcessStyles(processData.styles));
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>(() => cloneProcessSteps(processData.steps));

  const [activeTab, setActiveTab] = useState<"about" | "process">("about");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [lang, setLang] = useState<"en" | "th">("th");
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    setAboutContent(cloneAboutContent(aboutData.content));
    setAboutStyles(cloneAboutStyles(aboutData.styles));
    setAboutBody(cloneAboutBody(aboutData.body));
    setAboutPillars(cloneAboutPillars(aboutData.pillars));
  }, [aboutData]);

  useEffect(() => {
    setProcessContent(cloneProcessContent(processData.content));
    setProcessStyles(cloneProcessStyles(processData.styles));
    setProcessSteps(cloneProcessSteps(processData.steps));
  }, [processData]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === "about") {
        const payload = {
          content: aboutContent,
          styles: aboutStyles,
          body: aboutBody,
          pillars: aboutPillars,
        };
        const res = await fetch("/api/about/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload }),
        });
        if (!res.ok) throw new Error("Save failed");
      } else {
        const payload = {
          content: processContent,
          styles: processStyles,
          steps: processSteps,
        };
        const res = await fetch("/api/process/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload }),
        });
        if (!res.ok) throw new Error("Save failed");
      }
      setToast({ msg: "บันทึกข้อมูลเรียบร้อยแล้ว", type: "success" });
    } catch {
      setToast({ msg: "เกิดข้อผิดพลาดในการบันทึก", type: "error" });
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
          active="about"
          title="About & Process CMS"
          subtitle=""
          icon={<Info className="size-5 text-white" />}
          controls={
            <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-1">
              <button
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
            className="w-full pb-24 lg:pb-10"
            style={{ paddingTop: "var(--admin-nav-offset, var(--admin-nav-height, 96px))" }}
          >
            <div className="hidden lg:flex items-center gap-4 mb-8 pl-10">
              <div className="flex items-center gap-3 rounded-full border border-[#3a2f1d] bg-[#1a1612] px-4 py-2">
                <div className="size-2 rounded-full bg-[#f4af25]" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#cbb790]">
                  {activeTab === "about" ? "จัดการหน้าเกี่ยวกับเรา" : "จัดการกระบวนการทำงาน"}
                </h2>
              </div>

              <div className="inline-flex p-1 rounded-full border border-[#3a2f1d] bg-[#1a1612] shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
                <button
                  onClick={() => setActiveTab("about")}
                  className={cn(
                    "flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                    activeTab === "about"
                      ? "bg-[#2a2419] text-[#f4af25] shadow-[0_10px_25px_rgba(244,175,37,0.15)]"
                      : "text-[#cbb790]/70 hover:text-white hover:bg-[#231d15]"
                  )}
                >
                  <LayoutTemplate className="size-4" />
                  <span>About Content</span>
                </button>
                <button
                  onClick={() => setActiveTab("process")}
                  className={cn(
                    "flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200",
                    activeTab === "process"
                      ? "bg-[#2a2419] text-[#f4af25] shadow-[0_10px_25px_rgba(244,175,37,0.15)]"
                      : "text-[#cbb790]/70 hover:text-white hover:bg-[#231d15]"
                  )}
                >
                  <Workflow className="size-4" />
                  <span>Our Process</span>
                </button>
              </div>
            </div>

            <div className="animate-in fade-in duration-500 px-0 sm:px-6 lg:px-10">
              {activeTab === "about" ? (
                <AboutEditor
                  content={aboutContent}
                  styles={aboutStyles}
                  body={aboutBody}
                  pillars={aboutPillars}
                  lang={lang}
                  mode={mode}
                  onContentChange={setAboutContent}
                  onStylesChange={setAboutStyles}
                  onBodyChange={setAboutBody}
                  onPillarsChange={setAboutPillars}
                />
              ) : (
                <ProcessEditor
                  content={processContent}
                  styles={processStyles}
                  steps={processSteps}
                  lang={lang}
                  mode={mode}
                  onContentChange={setProcessContent}
                  onStylesChange={setProcessStyles}
                  onStepsChange={setProcessSteps}
                />
              )}
            </div>
          </div>
        </main>

        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex items-center gap-1 p-1.5 rounded-full bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 shadow-2xl shadow-black/50">
            <button
              onClick={() => setActiveTab("about")}
              className={cn(
                "p-3 rounded-full transition-all",
                activeTab === "about" ? "bg-neutral-800 text-orange-500" : "text-neutral-400 hover:text-white"
              )}
            >
              <LayoutTemplate className="size-5" />
            </button>
            <button
              onClick={() => setActiveTab("process")}
              className={cn(
                "p-3 rounded-full transition-all",
                activeTab === "process" ? "bg-neutral-800 text-orange-500" : "text-neutral-400 hover:text-white"
              )}
            >
              <Workflow className="size-5" />
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
