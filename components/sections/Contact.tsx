"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n";
import type { ContactContent, ContactFormContent, ContactStyles } from "@/lib/supabase/contact";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

type ContactProps = {
  dict: Dictionary;
  locale?: "en" | "th";
  mode?: "light" | "dark";
  previewDevice?: "desktop" | "tablet" | "mobile";
  content?: ContactContent;
  formContent?: ContactFormContent;
  styles?: ContactStyles;
};

const THEME_EVENT = "nbv-theme-change";

export default function Contact({ 
  dict, 
  locale = "en", 
  mode, 
  previewDevice,
  content, 
  formContent, 
  styles 
}: ContactProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [resolvedMode, setResolvedMode] = useState<"light" | "dark" | null>(() => {
    if (typeof document === "undefined") return null;
    const root = document.getElementById("app-root");
    return root?.classList.contains("theme-light") ? "light" : "dark";
  });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    details: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const root = document.getElementById("app-root");
    if (!root) return;
    const getMode = () => (root.classList.contains("theme-light") ? "light" : "dark") as "light" | "dark";
    const update = () => setResolvedMode(getMode());
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    const handleThemeEvent = (event: Event) => {
      const next = (event as CustomEvent).detail;
      if (next === "light" || next === "dark") {
        setResolvedMode(next);
      }
    };
    window.addEventListener(THEME_EVENT, handleThemeEvent);
    return () => {
      observer.disconnect();
      window.removeEventListener(THEME_EVENT, handleThemeEvent);
    };
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const effectiveMode = previewDevice ? mode : resolvedMode ?? mode;
  const isLight = effectiveMode === "light";

  // --- Helpers ---
  const pickLocalized = (obj: ContactContent | ContactFormContent | undefined, base: string, fallback: string) => {
    if (!obj) return fallback;
    const thKey = `${base}_th` as keyof typeof obj;
    const enKey = base as keyof typeof obj;
    const value = locale === "th" ? obj[thKey] : obj[enKey];
    return (value as string) || (obj[enKey] as string) || fallback;
  };

  const pickFont = (base: string) => {
    const enKey = `${base}En` as keyof ContactStyles;
    const thKey = `${base}Th` as keyof ContactStyles;
    const en = styles?.[enKey] as string | undefined;
    const th = styles?.[thKey] as string | undefined;
    return locale === "th" ? th || en : en || th;
  };

  const pickMode = (base: string, fallback?: string) => {
    const key = `${base}${isLight ? "Light" : "Dark"}` as keyof ContactStyles;
    return (styles?.[key] as string | undefined) || fallback;
  };

  // --- Content ---
  const eyebrow = pickLocalized(content, "eyebrow", dict?.contact?.eyebrow || "BEGIN THE DIALOGUE");
  const titleTop = pickLocalized(content, "titleTop", dict?.contact?.titleTop || "READY TO ELEVATE");
  const titleBottom = pickLocalized(content, "titleBottom", dict?.contact?.titleBottom || "YOUR PRESENCE?");
  const body = pickLocalized(content, "body", dict?.contact?.body || "We take on a limited number of clients...");
  const emailLabel = pickLocalized(content, "emailLabel", dict?.contact?.emailLabel || "Email Us");
  const displayEmail = content?.email || dict?.contact?.email || "hello@example.com";
  const locationLabel = pickLocalized(content, "locationLabel", dict?.contact?.locationLabel || "Visit Us");
  const location = pickLocalized(content, "location", dict?.contact?.location || "Zurich, Switzerland");

  const formName = pickLocalized(formContent, "nameLabel", dict?.contact?.form?.name || "Name");
  const formNamePlaceholder = pickLocalized(formContent, "namePlaceholder", dict?.contact?.form?.namePlaceholder || "John Doe");
  const formCompany = pickLocalized(formContent, "companyLabel", dict?.contact?.form?.company || "Company");
  const formCompanyPlaceholder = pickLocalized(formContent, "companyPlaceholder", dict?.contact?.form?.companyPlaceholder || "Acme Inc.");
  const formEmail = pickLocalized(formContent, "emailLabel", dict?.contact?.form?.email || "Email");
  const formEmailPlaceholder = pickLocalized(formContent, "emailPlaceholder", dict?.contact?.form?.emailPlaceholder || "john@example.com");
  const formDetails = pickLocalized(formContent, "detailsLabel", dict?.contact?.form?.details || "Project Details");
  const formDetailsPlaceholder = pickLocalized(formContent, "detailsPlaceholder", dict?.contact?.form?.detailsPlaceholder || "Tell us about your goals...");
  const formSubmit = pickLocalized(formContent, "submitLabel", dict?.contact?.form?.submit || "Send Inquiry");

  // --- Styles ---
  const eyebrowFont = pickFont("eyebrowFontFamily");
  const titleFont = pickFont("titleFontFamily");
  const bodyFont = pickFont("bodyFontFamily");
  const labelFont = pickFont("labelFontFamily");
  const infoFont = pickFont("infoFontFamily");
  const formLabelFont = pickFont("formLabelFontFamily");
  const inputFont = pickFont("inputFontFamily");
  const buttonFont = pickFont("buttonFontFamily");

  const eyebrowSize = styles?.eyebrowFontSize;
  const titleSize = styles?.titleFontSize;
  const bodySize = styles?.bodyFontSize;
  const labelSize = styles?.labelFontSize;
  const infoSize = styles?.infoFontSize;
  const formLabelSize = styles?.formLabelFontSize;
  const inputSize = styles?.inputFontSize;
  const buttonSize = styles?.buttonFontSize;

  const eyebrowColor = pickMode("eyebrowColor");
  const titleColor = pickMode("titleColor");
  const bodyColor = pickMode("bodyColor");
  const labelColor = pickMode("labelColor");
  const infoColor = pickMode("infoColor");
  const iconBg = pickMode("iconBg");
  const iconColor = pickMode("iconColor");

  const formBg = pickMode("formBg");
  const formBorder = pickMode("formBorder");
  const formLabelColor = pickMode("formLabelColor");
  const inputBg = pickMode("inputBg");
  const inputBorder = pickMode("inputBorder");
  const inputText = pickMode("inputText");
  const inputPlaceholder = pickMode("inputPlaceholder");

  const buttonBg = pickMode("buttonBg");
  const buttonText = pickMode("buttonText");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", company: "", email: "", details: "" });
      
      // Reset status after 5 seconds
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error: unknown) {
      console.error("Submit error:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={cn(
        "border-t border-border bg-[image:var(--contact-gradient)] py-16 sm:py-20 md:py-24 lg:py-32 content-auto",
        isInView && "contact-fall-active"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="grid gap-10 sm:gap-12 md:gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Contact info */}
          <div>
            <h2 
              className={cn("contact-fall-item mb-3 text-xs font-bold tracking-[0.15em] sm:mb-4 sm:text-sm sm:tracking-[0.2em]", !eyebrowColor && "text-primary")}
              style={{
                fontFamily: eyebrowFont,
                fontSize: eyebrowSize ? `${eyebrowSize}px` : undefined,
              }}
            >
              <span
                className="eyebrow-shimmer block"
                style={{ ["--eyebrow-color" as string]: eyebrowColor || "var(--color-accent)" }}
              >
                {eyebrow}
              </span>
            </h2>
            <h3 
              className="contact-fall-item mb-6 text-2xl font-bold leading-tight sm:mb-8 sm:text-3xl md:text-4xl lg:text-5xl"
              style={{ color: titleColor, fontFamily: titleFont, fontSize: titleSize ? `${titleSize}px` : undefined }}
            >
              {titleTop}<br />{titleBottom}
            </h3>
            <p 
              className={cn("contact-fall-item mb-8 max-w-md text-sm leading-relaxed sm:mb-12 sm:text-base", !bodyColor && "text-accent-text")}
              style={{ color: bodyColor, fontFamily: bodyFont, fontSize: bodySize ? `${bodySize}px` : undefined }}
            >
              {body}
            </p>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div 
                  className={cn("flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10", !iconBg && "bg-white/5", !iconColor && "text-primary")}
                  style={{ backgroundColor: iconBg, color: iconColor }}
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">mail</span>
                </div>
                <div>
                  <p 
                    className={cn("contact-fall-item text-[10px] uppercase sm:text-xs", !labelColor && "text-accent-text")}
                    style={{ color: labelColor, fontFamily: labelFont, fontSize: labelSize ? `${labelSize}px` : undefined }}
                  >
                    {emailLabel}
                  </p>
                  <p 
                    className={cn("contact-fall-item text-sm sm:text-base", !infoColor && "text-text")}
                    style={{ color: infoColor, fontFamily: infoFont, fontSize: infoSize ? `${infoSize}px` : undefined }}
                  >
                    {displayEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div 
                  className={cn("flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10", !iconBg && "bg-white/5", !iconColor && "text-primary")}
                  style={{ backgroundColor: iconBg, color: iconColor }}
                >
                  <span className="material-symbols-outlined text-lg sm:text-xl">location_on</span>
                </div>
                <div>
                  <p 
                    className={cn("contact-fall-item text-[10px] uppercase sm:text-xs", !labelColor && "text-accent-text")}
                    style={{ color: labelColor, fontFamily: labelFont, fontSize: labelSize ? `${labelSize}px` : undefined }}
                  >
                    {locationLabel}
                  </p>
                  <p 
                    className={cn("contact-fall-item text-sm sm:text-base", !infoColor && "text-text")}
                    style={{ color: infoColor, fontFamily: infoFont, fontSize: infoSize ? `${infoSize}px` : undefined }}
                  >
                    {location}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div 
            className={cn("rounded-xl border p-5 sm:rounded-2xl sm:p-6 md:p-8 lg:p-10 transition-all", !formBorder && "border-border", !formBg && "bg-white/5")}
            style={{ backgroundColor: formBg, borderColor: formBorder }}
          >
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center animate-in fade-in zoom-in">
                <div className="bg-green-500/10 text-green-500 rounded-full p-4 mb-4">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <h4 className="text-xl font-bold mb-2 text-white">Message Sent!</h4>
                <p className="text-sm text-neutral-400">
                  Thank you for contacting us. We will get back to you shortly.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm text-primary hover:text-white underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 md:gap-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6">
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <label 
                      className={cn("text-[10px] font-bold uppercase tracking-wider sm:text-xs", !formLabelColor && "text-accent-text")}
                      style={{ color: formLabelColor, fontFamily: formLabelFont, fontSize: formLabelSize ? `${formLabelSize}px` : undefined }}
                    >
                      {formName}
                    </label>
                    <input
                      required
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={formNamePlaceholder}
                      disabled={status === "loading"}
                      className={cn(
                        "border-b py-2 text-sm focus:outline-none transition-colors sm:text-base disabled:opacity-50",
                         !inputBg && "bg-transparent",
                         !inputBorder && "border-border dark:border-white/20",
                         !inputText && "text-text",
                         !inputPlaceholder && "placeholder:text-black/30 dark:placeholder:text-white/20",
                         "focus:border-primary"
                      )}
                      style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText, fontFamily: inputFont, fontSize: inputSize ? `${inputSize}px` : undefined }}
                      suppressHydrationWarning
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:gap-2">
                    <label 
                      className={cn("text-[10px] font-bold uppercase tracking-wider sm:text-xs", !formLabelColor && "text-accent-text")}
                      style={{ color: formLabelColor, fontFamily: formLabelFont, fontSize: formLabelSize ? `${formLabelSize}px` : undefined }}
                    >
                      {formCompany}
                    </label>
                    <input
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder={formCompanyPlaceholder}
                      disabled={status === "loading"}
                      className={cn(
                        "border-b py-2 text-sm focus:outline-none transition-colors sm:text-base disabled:opacity-50",
                         !inputBg && "bg-transparent",
                         !inputBorder && "border-border dark:border-white/20",
                         !inputText && "text-text",
                         !inputPlaceholder && "placeholder:text-black/30 dark:placeholder:text-white/20",
                         "focus:border-primary"
                      )}
                      style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText, fontFamily: inputFont, fontSize: inputSize ? `${inputSize}px` : undefined }}
                      suppressHydrationWarning
                    />
                  </div>
                </div>
                <div className="mt-1 flex flex-col gap-1.5 sm:mt-2 sm:gap-2">
                  <label 
                    className={cn("text-[10px] font-bold uppercase tracking-wider sm:text-xs", !formLabelColor && "text-accent-text")}
                    style={{ color: formLabelColor, fontFamily: formLabelFont, fontSize: formLabelSize ? `${formLabelSize}px` : undefined }}
                  >
                    {formEmail}
                  </label>
                  <input
                    required
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={formEmailPlaceholder}
                    disabled={status === "loading"}
                    className={cn(
                      "border-b py-2 text-sm focus:outline-none transition-colors sm:text-base disabled:opacity-50",
                      !inputBg && "bg-transparent",
                      !inputBorder && "border-border dark:border-white/20",
                      !inputText && "text-text",
                      !inputPlaceholder && "placeholder:text-black/30 dark:placeholder:text-white/20",
                      "focus:border-primary"
                    )}
                    style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText, fontFamily: inputFont, fontSize: inputSize ? `${inputSize}px` : undefined }}
                    suppressHydrationWarning
                  />
                </div>
                <div className="mt-1 flex flex-col gap-1.5 sm:mt-2 sm:gap-2">
                  <label 
                    className={cn("text-[10px] font-bold uppercase tracking-wider sm:text-xs", !formLabelColor && "text-accent-text")}
                    style={{ color: formLabelColor, fontFamily: formLabelFont, fontSize: formLabelSize ? `${formLabelSize}px` : undefined }}
                  >
                    {formDetails}
                  </label>
                  <textarea
                    required
                    name="details"
                    rows={3}
                    value={formData.details}
                    onChange={handleChange}
                    placeholder={formDetailsPlaceholder}
                    disabled={status === "loading"}
                    className={cn(
                      "resize-none border-b py-2 text-sm focus:outline-none transition-colors sm:text-base md:rows-4 disabled:opacity-50",
                       !inputBg && "bg-transparent",
                       !inputBorder && "border-border dark:border-white/20",
                       !inputText && "text-text",
                       !inputPlaceholder && "placeholder:text-black/30 dark:placeholder:text-white/20",
                       "focus:border-primary"
                    )}
                    style={{ backgroundColor: inputBg, borderColor: inputBorder, color: inputText, fontFamily: inputFont, fontSize: inputSize ? `${inputSize}px` : undefined }}
                    suppressHydrationWarning
                  />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-400 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMessage || "Something went wrong. Please try again."}</span>
                  </div>
                )}

                <button
                  type="button"
                  disabled={status === "loading"}
                  onClick={handleSubmit} // Change type="button" to call handler or change to type="submit" and remove onClick
                  className={cn(
                    "cta-uiverse contact-rise-item mt-3 w-full rounded-lg py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:bg-white hover:text-primary sm:mt-4 sm:py-4 sm:text-base flex items-center justify-center gap-2",
                    !buttonBg && "bg-primary",
                    !buttonText && "text-espresso",
                    status === "loading" && "opacity-70 cursor-not-allowed"
                  )}
                  style={{
                    backgroundColor: buttonBg,
                    color: buttonText,
                    fontFamily: buttonFont,
                    fontSize: buttonSize ? `${buttonSize}px` : undefined,
                    ["--cta-base" as string]: buttonBg,
                    ["--cta-text" as string]: buttonText,
                    ["--cta-hover-start" as string]: "#f27f0d",
                    ["--cta-hover-end" as string]: "#ffd9b0",
                  }}
                  suppressHydrationWarning
                >
                  {status === "loading" && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span className="cta-label">{formSubmit}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
