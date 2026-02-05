"use client";

import FloatingSocial from "@/components/layout/FloatingSocial";
import type { FloatingSocialItem } from "@/lib/supabase/contact";

type Props = {
  items: FloatingSocialItem[];
  lang: "en" | "th";
};

export default function FloatingSocialPreview({ items, lang }: Props) {
  return (
    <div className="relative w-full h-full min-h-[400px]">
      <FloatingSocial 
        items={items} 
        lang={lang} 
        isPreview={true}
        style={{ 
          position: "absolute", 
          right: "2rem", 
          bottom: "2rem", 
          zIndex: 10 
        }} 
      />
    </div>
  );
}