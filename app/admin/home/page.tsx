import HomeAdminShell from "@/components/home/admin/HomeAdminShell";
import { DEFAULT_HOME_CONTENT, getHomeContent } from "@/lib/supabase/home";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomeAdminPage() {
  const content = await getHomeContent();
  const safeContent =
    content.logoItems?.length > 0
      ? content
      : { ...content, logoItems: DEFAULT_HOME_CONTENT.logoItems };

  return <HomeAdminShell content={safeContent} />;
}
