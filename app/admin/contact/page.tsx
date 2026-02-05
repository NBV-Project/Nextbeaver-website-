import ContactAdminShell from "@/components/contact/admin/ContactAdminShell";
import { getContactContent } from "@/lib/supabase/contact";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactAdminPage() {
  const content = await getContactContent();

  return <ContactAdminShell content={content} />;
}
