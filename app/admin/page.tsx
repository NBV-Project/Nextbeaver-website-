import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminUnlock from "@/components/admin/AdminUnlock";
import { isAdminSessionValid } from "@/lib/auth/adminSession";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminAccessPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;

  if (await isAdminSessionValid(session)) {
    redirect("/admin/home");
  }

  return <AdminUnlock />;
}
