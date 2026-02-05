import AboutAdminShell from "@/components/about/admin/AboutAdminShell";
import { getAboutContent } from "@/lib/supabase/about";
import { getProcessContent } from "@/lib/supabase/process";

export default async function AboutAdminPage() {
  const aboutData = await getAboutContent();
  const processData = await getProcessContent();
  return <AboutAdminShell aboutData={aboutData} processData={processData} />;
}
