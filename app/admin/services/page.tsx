import ServicesAdminShell from "@/components/services/admin/ServicesAdminShell";
import { getServicesContent } from "@/lib/supabase/services";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicesAdminPage() {
  const data = await getServicesContent();

  return <ServicesAdminShell initialData={data} />;
}
