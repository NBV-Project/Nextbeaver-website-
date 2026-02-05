import PortfolioAdminShell from "@/components/portfolio/admin/PortfolioAdminShell";
import { getPortfolioContent } from "@/lib/supabase/portfolio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PortfolioAdminPage() {
  const content = await getPortfolioContent();

  return <PortfolioAdminShell content={content} />;
}
