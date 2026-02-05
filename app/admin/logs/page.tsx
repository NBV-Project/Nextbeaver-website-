import { getSupabaseAdminClient } from "@/lib/supabase/adminClient";
import AdminLogsShell from "@/components/admin/AdminLogsShell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LogRow = {
  id: string;
  created_at: string;
  actor_id: string | null;
  actor_label: string | null;
  action: string;
  target: string | null;
  result: string | null;
  ip_address: string | null;
  user_agent: string | null;
  request_id: string | null;
  session_id: string | null;
  geo: Record<string, string | null> | null;
  attempts: number | null;
  before_data: unknown;
  after_data: unknown;
  diff_data: unknown;
  metadata: Record<string, unknown> | null;
};

export default async function AdminLogsPage() {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return (
      <div className="min-h-screen bg-[#1a1612] text-white px-6 py-24">
        <h1 className="text-2xl font-semibold">Admin Logs</h1>
        <p className="mt-2 text-sm text-[#cbb790]">
          Supabase service role key is not configured.
        </p>
      </div>
    );
  }

  const { data } = await supabase
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return <AdminLogsShell logs={(data ?? []) as LogRow[]} />;
}
