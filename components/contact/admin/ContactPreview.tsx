"use client";

import { cn } from "@/lib/utils";
import Contact from "@/components/sections/Contact";
import type { ContactContent, ContactFormContent, ContactStyles } from "@/lib/supabase/contact";
import { en } from "@/content/en";
import { th } from "@/content/th";

type Props = {
  content: ContactContent;
  formContent: ContactFormContent;
  styles: ContactStyles;
  mode: "light" | "dark";
  lang: "en" | "th";
  viewMode?: "full" | "info" | "form"; // Added viewMode prop
};

export default function ContactPreview({ content, formContent, styles, mode, lang, viewMode = "full" }: Props) {
  const dict = lang === "th" ? th : en;

  return (
    <div className={cn("w-full h-full overflow-y-auto", mode === "light" ? "bg-white" : "bg-[#181411]")}>
      <div className={cn(
        // General wrapper styles
        "contact-preview-wrapper",
        // Conditional visibility styles
        viewMode === "info" && "[&_#contact_.grid>div:last-child]:hidden [&_#contact_.grid]:grid-cols-1 [&_#contact_.grid]:max-w-xl [&_#contact_.grid]:mx-auto",
        viewMode === "form" && "[&_#contact_.grid>div:first-child]:hidden [&_#contact_.grid]:grid-cols-1 [&_#contact_.grid]:max-w-xl [&_#contact_.grid]:mx-auto"
      )}>
        <Contact
          dict={dict} 
          locale={lang}
          mode={mode}
          previewDevice="desktop"
          content={content}
          formContent={formContent}
          styles={styles}
        />
      </div>
    </div>
  );
}