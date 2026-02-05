"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Contact, FileText, Loader2, Save, Share2, MessageSquare, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import ContactInfoEditor from "./ContactInfoEditor";
import ContactFormEditor from "./ContactFormEditor";
import FloatingSocialEditor from "./FloatingSocialEditor";
import type { ContactPageContent } from "@/lib/supabase/contact";
import ContactPreview from "./ContactPreview";
import FloatingSocialPreview from "./FloatingSocialPreview";
import AdminSidebar from "@/components/admin/AdminSidebar";

type Props = {
  content: ContactPageContent;
};

export default function ContactAdminShell({ content: initialContent }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "form" | "social">("info");
  const [lang, setLang] = useState<"en" | "th">("th");
  const [mode, setMode] = useState<"light" | "dark">("dark");
  const [content, setContent] = useState<ContactPageContent>(initialContent);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/contact/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: content }),
      });

      if (!res.ok) throw new Error("Failed to save");

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save changes");
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
        active="contact"
        title="Contact CMS"
        subtitle="Manage Contact & Socials"
        icon={<MessageSquare className="size-5 text-white" />}
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
          className="w-full px-0 sm:px-6 lg:px-10 pb-24 lg:pb-10"
          style={{ paddingTop: "var(--admin-nav-offset, var(--admin-nav-height, 96px))" }}
        >
        {/* Desktop Tabs / Header */}
        <div className="hidden lg:flex items-center gap-4 mb-8">
           <div className="flex items-center gap-3 rounded-full border border-[#3a2f1d] bg-[#1a1612] px-4 py-2">
                <div className="size-2 rounded-full bg-[#f4af25]" />
                <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#cbb790]">
                  จัดการหน้าติดต่อ
                </h2>
           </div>

           <div className="flex items-center gap-1 rounded-full border border-[#3a2f1d] bg-[#1a1612] p-1 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <button
              onClick={() => setActiveTab("info")}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all duration-200",
                activeTab === "info"
                  ? "bg-[#2a2419] text-[#f4af25] shadow-[0_10px_25px_rgba(244,175,37,0.15)]"
                  : "text-[#cbb790]/70 hover:text-white hover:bg-[#231d15]"
              )}
            >
              <Contact className="h-3.5 w-3.5" />
              <span>ข้อมูล</span>
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all duration-200",
                activeTab === "form"
                  ? "bg-[#2a2419] text-[#f4af25] shadow-[0_10px_25px_rgba(244,175,37,0.15)]"
                  : "text-[#cbb790]/70 hover:text-white hover:bg-[#231d15]"
              )}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>ฟอร์ม</span>
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={cn(
                "flex items-center gap-2 px-5 py-2 rounded-full text-xs font-medium transition-all duration-200",
                activeTab === "social"
                  ? "bg-[#2a2419] text-[#f4af25] shadow-[0_10px_25px_rgba(244,175,37,0.15)]"
                  : "text-[#cbb790]/70 hover:text-white hover:bg-[#231d15]"
              )}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>โซเชียล</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8 pb-20 lg:pb-0">
          {activeTab === "info" && (
            <div className="grid gap-8 lg:grid-cols-12">
               <div className="lg:col-span-7">
                  <div className="lg:sticky lg:top-24 rounded-none sm:rounded-2xl border-y sm:border border-white/10 overflow-hidden bg-background">
                     <ContactPreview
                        mode={mode}
                        lang={lang}
                        content={content.contact}
                        formContent={content.form}
                        styles={content.styles}
                        viewMode="info"
                     />
                  </div>
               </div>
               <div className="lg:col-span-5 px-4 sm:px-0">
                  <ContactInfoEditor
                     content={content.contact}
                     styles={content.styles}
                     lang={lang}
                     mode={mode}
                     onChange={(newContact, newStyles) =>
                        setContent((prev) => ({
                           ...prev,
                           contact: newContact,
                           styles: newStyles,
                        }))
                     }
                  />
               </div>
            </div>
          )}

          {activeTab === "form" && (
            <div className="grid gap-8 lg:grid-cols-12">
               <div className="lg:col-span-7">
                  <div className="lg:sticky lg:top-24 rounded-none sm:rounded-2xl border-y sm:border border-white/10 overflow-hidden bg-background">
                     <ContactPreview
                        mode={mode}
                        lang={lang}
                        content={content.contact}
                        formContent={content.form}
                        styles={content.styles}
                        viewMode="form"
                     />
                  </div>
               </div>
               <div className="lg:col-span-5 px-4 sm:px-0">
                  <ContactFormEditor
                     content={content.form}
                     styles={content.styles}
                     lang={lang}
                     mode={mode}
                     onChange={(newForm, newStyles) =>
                        setContent((prev) => ({
                           ...prev,
                           form: newForm,
                           styles: newStyles,
                        }))
                     }
                  />
               </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="grid gap-8 lg:grid-cols-12">
               <div className="lg:col-span-7">
                  <div className="lg:sticky lg:top-24 min-h-[500px] flex items-end justify-end p-10 rounded-none sm:rounded-2xl border-y sm:border border-white/10 bg-background overflow-hidden relative">
                    {/* Background mock for context */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://assets.aceternity.com/view.png')] bg-cover bg-center" />
                     <FloatingSocialPreview
                        items={content.socialItems}
                        lang={lang}
                     />
                  </div>
               </div>
               <div className="lg:col-span-5 px-4 sm:px-0">
                  <FloatingSocialEditor
                     items={content.socialItems}
                     lang={lang}
                     onChange={(newItems) =>
                        setContent((prev) => ({
                           ...prev,
                           socialItems: newItems,
                        }))
                     }
                  />
               </div>
            </div>
          )}
        </div>
      </div>
      </main>

      {/* Mobile Floating Bottom Bar */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex gap-2">
        <div className="flex items-center gap-1 p-1.5 rounded-full bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 shadow-2xl shadow-black/50">
          <button
            onClick={() => setActiveTab("info")}
            className={cn(
              "p-3 rounded-full transition-all",
              activeTab === "info" ? "bg-neutral-800 text-orange-500" : "text-neutral-400 hover:text-white"
            )}
          >
            <Contact className="size-5" />
          </button>
          <button
            onClick={() => setActiveTab("form")}
            className={cn(
              "p-3 rounded-full transition-all",
              activeTab === "form" ? "bg-neutral-800 text-orange-500" : "text-neutral-400 hover:text-white"
            )}
          >
            <FileText className="size-5" />
          </button>
          <button
            onClick={() => setActiveTab("social")}
            className={cn(
              "p-3 rounded-full transition-all",
              activeTab === "social" ? "bg-neutral-800 text-orange-500" : "text-neutral-400 hover:text-white"
            )}
          >
            <Share2 className="size-5" />
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving || isPending}
        className={cn(
          "fixed bottom-6 right-6 z-[130] size-14 rounded-full bg-[#f4af25] hover:bg-[#d5961b] text-[#181411] shadow-lg shadow-orange-900/30 transition-all active:scale-95 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
        )}
        aria-label="บันทึกข้อมูล"
        title="บันทึกข้อมูล"
      >
        {isSaving ? (
          <Loader2 className="size-6 animate-spin" />
        ) : (
          <Save className="size-6" />
        )}
      </button>
      </div>
    </div>
  );
}
