import MarqueeAdminShell from "@/components/home/admin/MarqueeAdminShell";
import { getHomeContent } from "@/lib/supabase/home";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MarqueeAdminPage() {
  const content = await getHomeContent();

  return <MarqueeAdminShell content={content} />;
}
