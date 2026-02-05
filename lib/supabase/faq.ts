import { supabaseClient } from "@/lib/supabase/client";
import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/supabase/cacheTags";

export type FaqContent = {
  eyebrow: string;
  eyebrow_th?: string;
  title: string;
  title_th?: string;
};

export type FaqItem = {
  id: string;
  question: string;
  question_th?: string;
  answer: string;
  answer_th?: string;
  orderIndex: number;
};

export type FaqContentBundle = {
  content: FaqContent;
  items: FaqItem[];
};

export const FAQ_CONTENT_TABLE = "faq_content";
export const FAQ_ITEMS_TABLE = "faq_items";

const defaultContent: FaqContent = {
  eyebrow: "FAQS",
  eyebrow_th: "FAQS",
  title: "Have Questions?",
  title_th: "มีคำถามไหม?",
};

const defaultItems: FaqItem[] = [
  {
    id: "faq-01",
    question: "Do you build custom websites and web apps?",
    question_th: "รับทำเว็บไซต์และเว็บแอปแบบสั่งทำไหม?",
    answer:
      "Yes. We design and build custom websites, landing pages, and full web apps tailored to your goals, brand, and customer journey.",
    answer_th:
      "รับครับ เราทำเว็บไซต์, แลนดิ้งเพจ และเว็บแอปแบบสั่งทำ ให้ตรงเป้าหมายธุรกิจ แบรนด์ และเส้นทางลูกค้า.",
    orderIndex: 0,
  },
  {
    id: "faq-02",
    question: "How much does a website cost?",
    question_th: "ทำเว็บไซต์ราคาเท่าไหร่?",
    answer:
      "Pricing depends on scope and features. Most projects start with a discovery call, then we provide a clear, fixed proposal before work begins.",
    answer_th:
      "ราคาขึ้นกับขอบเขตและฟีเจอร์ เราเริ่มจากคุยเพื่อเก็บรายละเอียด แล้วสรุปราคาแบบชัดเจนก่อนเริ่มงาน.",
    orderIndex: 1,
  },
  {
    id: "faq-03",
    question: "How long does it take to launch?",
    question_th: "ใช้เวลากี่วันกว่าจะเสร็จ?",
    answer:
      "Typical timelines range from 2–6 weeks depending on complexity. We always share a milestone plan so you know each step.",
    answer_th:
      "โดยทั่วไป 2–6 สัปดาห์ ขึ้นกับความซับซ้อน เราจะวางไทม์ไลน์เป็นขั้นตอนให้ชัดเจนครับ.",
    orderIndex: 2,
  },
  {
    id: "faq-04",
    question: "Can you redesign or improve an existing site?",
    question_th: "รับปรับเว็บเดิมหรือย้ายเว็บจากที่อื่นไหม?",
    answer:
      "Absolutely. We can redesign, optimize performance, or migrate your current site with minimal downtime.",
    answer_th:
      "ได้ครับ เราปรับดีไซน์ เพิ่มความเร็ว หรือย้ายระบบให้ โดยลด downtime ให้น้อยที่สุด.",
    orderIndex: 3,
  },
  {
    id: "faq-05",
    question: "Do you support SEO and performance optimization?",
    question_th: "มีทำ SEO และปรับความเร็วไหม?",
    answer:
      "Yes. We build with SEO fundamentals and Core Web Vitals in mind, and can deliver a performance audit on request.",
    answer_th:
      "มีครับ เราทำตามหลัก SEO และ Core Web Vitals และสามารถทำรายงาน Performance เพิ่มได้.",
    orderIndex: 4,
  },
  {
    id: "faq-06",
    question: "Do you provide ongoing support after launch?",
    question_th: "ส่งมอบแล้วมีดูแลต่อไหม?",
    answer:
      "Yes. We offer maintenance, content updates, and improvement sprints depending on your needs.",
    answer_th:
      "มีครับ เรามีบริการดูแลระบบ อัปเดตคอนเทนต์ และปรับปรุงต่อเนื่องตามแพ็กเกจที่เหมาะกับคุณ.",
    orderIndex: 5,
  },
];

const CACHE_ENABLED =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) && Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const FAQ_REVALIDATE_SECONDS = 600;

const getFaqReader = () => {
  if (typeof window !== "undefined") {
    return supabaseClient;
  }
  const adminClient = getSupabaseAdminClient();
  return adminClient ?? supabaseClient;
};

const getFaqContentInternal = async (): Promise<FaqContentBundle> => {
  const reader = getFaqReader();
  const contentQuery = reader.from(FAQ_CONTENT_TABLE).select("*").limit(1).maybeSingle();
  const itemsQuery = reader.from(FAQ_ITEMS_TABLE).select("*").order("order_index", { ascending: true });

  const [contentRes, itemsRes] = await Promise.all([contentQuery, itemsQuery]);

  if (contentRes.error) console.error("Error fetching FAQ content:", contentRes.error);
  if (itemsRes.error) console.error("Error fetching FAQ items:", itemsRes.error);

  const content = contentRes.data
    ? {
      eyebrow: contentRes.data.eyebrow,
      eyebrow_th: contentRes.data.eyebrow_th,
      title: contentRes.data.title,
      title_th: contentRes.data.title_th,
    }
    : defaultContent;

  const items = itemsRes.data?.length
    ? itemsRes.data.map((row: { id: string; question: string; question_th?: string; answer: string; answer_th?: string; order_index: number }) => ({
      id: row.id,
      question: row.question,
      question_th: row.question_th,
      answer: row.answer,
      answer_th: row.answer_th,
      orderIndex: row.order_index,
    }))
    : defaultItems;

  return { content, items };
};

const getFaqContentCached = unstable_cache(getFaqContentInternal, [CACHE_TAGS.faq], {
  revalidate: FAQ_REVALIDATE_SECONDS,
  tags: [CACHE_TAGS.faq],
});

export async function getFaqContent(): Promise<FaqContentBundle> {
  if (!CACHE_ENABLED) {
    return { content: defaultContent, items: defaultItems };
  }
  return getFaqContentCached();
}

export async function getFaqContentUncached(): Promise<FaqContentBundle> {
  return getFaqContentInternal();
}

export const DEFAULT_FAQ_CONTENT: FaqContentBundle = {
  content: defaultContent,
  items: defaultItems,
};
