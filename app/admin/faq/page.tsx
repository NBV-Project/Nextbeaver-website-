import FaqAdminShell from "@/components/faq/admin/FaqAdminShell";
import { getFaqContent } from "@/lib/supabase/faq";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FaqAdminPage() {
  const content = await getFaqContent();
  return <FaqAdminShell content={content} />;
}
