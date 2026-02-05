"use client";

import { useMemo } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FaqContent, FaqItem } from "@/lib/supabase/faq";

type Props = {
  content: FaqContent;
  items: FaqItem[];
  lang: "en" | "th";
  onChangeContent: (next: FaqContent) => void;
  onChangeItems: (next: FaqItem[]) => void;
};

const emptyItem = (): FaqItem => ({
  id: `faq-${Math.random().toString(36).slice(2, 10)}`,
  question: "",
  question_th: "",
  answer: "",
  answer_th: "",
  orderIndex: 0,
});

export default function FaqEditor({ content, items, lang, onChangeContent, onChangeItems }: Props) {
  const labelText = useMemo(
    () => ({
      eyebrow: lang === "th" ? "หัวข้อเล็ก" : "Eyebrow",
      title: lang === "th" ? "หัวข้อหลัก" : "Title",
      question: lang === "th" ? "คำถาม" : "Question",
      answer: lang === "th" ? "คำตอบ" : "Answer",
      add: lang === "th" ? "เพิ่มคำถาม" : "Add Question",
    }),
    [lang]
  );

  const updateItem = (index: number, patch: Partial<FaqItem>) => {
    const next = items.map((item, idx) => (idx === index ? { ...item, ...patch } : item));
    onChangeItems(next);
  };

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChangeItems(next);
  };

  const removeItem = (index: number) => {
    const next = items.filter((_, idx) => idx !== index);
    onChangeItems(next);
  };

  const addItem = () => {
    onChangeItems([...items, emptyItem()]);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-[#14110d] p-6 shadow-[0_18px_45px_rgba(0,0,0,0.35)]">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#cbb790]">
              {labelText.eyebrow} (EN)
            </label>
            <input
              value={content.eyebrow}
              onChange={(event) => onChangeContent({ ...content, eyebrow: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#1b1712] px-4 py-3 text-sm text-white focus:border-[#f4af25] focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#cbb790]">
              {labelText.eyebrow} (TH)
            </label>
            <input
              value={content.eyebrow_th ?? ""}
              onChange={(event) => onChangeContent({ ...content, eyebrow_th: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#1b1712] px-4 py-3 text-sm text-white focus:border-[#f4af25] focus:outline-none"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#cbb790]">
              {labelText.title} (EN)
            </label>
            <input
              value={content.title}
              onChange={(event) => onChangeContent({ ...content, title: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#1b1712] px-4 py-3 text-sm text-white focus:border-[#f4af25] focus:outline-none"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#cbb790]">
              {labelText.title} (TH)
            </label>
            <input
              value={content.title_th ?? ""}
              onChange={(event) => onChangeContent({ ...content, title_th: event.target.value })}
              className="w-full rounded-lg border border-white/10 bg-[#1b1712] px-4 py-3 text-sm text-white focus:border-[#f4af25] focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-[#cbb790]">FAQ Items</h3>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-full border border-[#4a3b24] bg-[#2a2419] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#f4af25] transition-all hover:bg-[#3a2f1d]"
        >
          <Plus className="size-4" />
          {labelText.add}
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => {
          const question = lang === "th" ? item.question_th ?? "" : item.question;
          const answer = lang === "th" ? item.answer_th ?? "" : item.answer;
          return (
            <div key={item.id} className="rounded-2xl border border-white/10 bg-[#14110d] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.3)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#cbb790]">
                  {lang === "th" ? `คำถาม ${index + 1}` : `Question ${index + 1}`}
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveItem(index, index - 1)}
                    className={cn(
                      "size-9 rounded-full border border-[#2a2116] bg-[#1a1612] text-neutral-300 transition-all hover:text-white",
                      index === 0 && "opacity-40 cursor-not-allowed"
                    )}
                    disabled={index === 0}
                  >
                    <ArrowUp className="size-4 mx-auto" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem(index, index + 1)}
                    className={cn(
                      "size-9 rounded-full border border-[#2a2116] bg-[#1a1612] text-neutral-300 transition-all hover:text-white",
                      index === items.length - 1 && "opacity-40 cursor-not-allowed"
                    )}
                    disabled={index === items.length - 1}
                  >
                    <ArrowDown className="size-4 mx-auto" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="size-9 rounded-full border border-[#2a2116] bg-[#1a1612] text-red-300 transition-all hover:text-red-200"
                  >
                    <Trash2 className="size-4 mx-auto" />
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#cbb790]">
                    {labelText.question} ({lang.toUpperCase()})
                  </label>
                  <input
                    value={question}
                    onChange={(event) =>
                      updateItem(index, lang === "th"
                        ? { question_th: event.target.value }
                        : { question: event.target.value }
                      )
                    }
                    className="w-full rounded-lg border border-white/10 bg-[#1b1712] px-4 py-3 text-sm text-white focus:border-[#f4af25] focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[#cbb790]">
                    {labelText.answer} ({lang.toUpperCase()})
                  </label>
                  <textarea
                    value={answer}
                    onChange={(event) =>
                      updateItem(index, lang === "th"
                        ? { answer_th: event.target.value }
                        : { answer: event.target.value }
                      )
                    }
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-[#1b1712] px-4 py-3 text-sm text-white focus:border-[#f4af25] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
