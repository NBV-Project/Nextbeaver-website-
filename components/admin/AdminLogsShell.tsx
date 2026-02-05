"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { ClipboardList } from "lucide-react";

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

const actionLabels: Record<string, string> = {
  login_success: "เข้าสู่ระบบสำเร็จ",
  login_failed: "เข้าสู่ระบบไม่สำเร็จ",
  lockout: "ล็อกชั่วคราว",
  rate_limit: "จำกัดความถี่",
  update_home: "แก้ไขหน้า Home",
  update_about: "แก้ไขหน้า About",
  update_services: "แก้ไขหน้า Services",
  update_portfolio: "แก้ไขหน้า Portfolio",
  update_process: "แก้ไขหน้า Process",
  update_contact: "แก้ไขหน้า Contact",
  update_faq: "แก้ไขหน้า FAQ",
  upload_portfolio_asset: "อัปโหลดไฟล์ Portfolio",
};

const resultStyles: Record<string, string> = {
  success: "bg-emerald-500/15 text-emerald-200 border-emerald-500/30",
  failed: "bg-rose-500/15 text-rose-200 border-rose-500/30",
  blocked: "bg-amber-500/15 text-amber-200 border-amber-500/30",
};

function formatDate(value: string) {
  const date = new Date(value);
  return date.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
}

function formatDiff(diff: unknown) {
  if (!Array.isArray(diff)) return [];
  return diff as Array<{ path: string; before: unknown; after: unknown }>;
}

export default function AdminLogsShell({ logs }: { logs: LogRow[] }) {
  return (
    <div className="min-h-screen bg-[#1a1612] text-neutral-100 font-sans selection:bg-orange-500/30 relative">
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(244, 175, 37, 0.08), transparent 55%), radial-gradient(circle at 80% 10%, rgba(203, 183, 144, 0.08), transparent 45%), radial-gradient(circle at 60% 90%, rgba(73, 60, 34, 0.3), transparent 55%)",
        }}
      />
      <div className="relative z-10">
        <AdminSidebar
          active="logs"
          title="Admin Logs"
          subtitle="Security Matrix"
          icon={<ClipboardList className="size-5 text-white" />}
        />

        <main className="w-full">
          <div
            className="w-full pb-20 lg:pb-10"
            style={{ paddingTop: "var(--admin-nav-offset, var(--admin-nav-height, 96px))" }}
          >
            <div className="px-4 sm:px-6 lg:px-10">
              <div className="flex flex-col gap-2 rounded-2xl border border-[#3a2f1d] bg-[#120f0b]/80 px-6 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-[#f4af25]">
                  ศูนย์บันทึกการทำงาน
                </h2>
                <p className="text-sm text-[#cbb790]">
                  แสดงทุกการกระทำในหลังบ้าน พร้อมรายละเอียดที่ตรวจสอบย้อนหลังได้ทันที
                </p>
              </div>

              <div className="mt-8 grid gap-4">
                {logs.length === 0 ? (
                  <div className="rounded-2xl border border-[#3a2f1d] bg-[#120f0b]/80 px-6 py-10 text-center text-sm text-[#cbb790]">
                    ยังไม่มีข้อมูลบันทึก
                  </div>
                ) : (
                  logs.map((log) => {
                    const diffItems = formatDiff(log.diff_data);
                    return (
                      <details
                        key={log.id}
                        className="rounded-2xl border border-[#2a2116] bg-[#120f0b]/80 px-6 py-5 shadow-[0_14px_35px_rgba(0,0,0,0.3)]"
                      >
                        <summary className="flex cursor-pointer flex-col gap-4 list-none sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs uppercase tracking-[0.3em] text-[#8b7a57]">
                              {formatDate(log.created_at)}
                            </div>
                            <div className="text-base font-semibold text-white">
                              {actionLabels[log.action] ?? log.action}
                            </div>
                            <div className="text-xs text-[#cbb790]">
                              โดย {log.actor_label ?? "ไม่ทราบผู้ใช้"} • เป้าหมาย{" "}
                              {log.target ?? "-"}
                            </div>
                          </div>
                          <div
                            className={`self-start rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] ${
                              resultStyles[log.result ?? ""] ?? "border-[#2a2116] text-[#cbb790]"
                            }`}
                          >
                            {log.result ?? "unknown"}
                          </div>
                        </summary>

                        <div className="mt-5 grid gap-4 text-xs text-[#cbb790] sm:grid-cols-2 lg:grid-cols-3">
                          <div className="rounded-xl border border-[#2a2116] bg-[#1a1612] px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b7a57]">IP / Device</p>
                            <p className="mt-2 text-sm text-white">{log.ip_address ?? "-"}</p>
                            <p className="mt-1 text-xs text-[#cbb790]/80">{log.user_agent ?? "-"}</p>
                          </div>
                          <div className="rounded-xl border border-[#2a2116] bg-[#1a1612] px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b7a57]">Session</p>
                            <p className="mt-2 text-sm text-white">{log.session_id ?? "-"}</p>
                            <p className="mt-1 text-xs text-[#cbb790]/80">Request: {log.request_id ?? "-"}</p>
                          </div>
                          <div className="rounded-xl border border-[#2a2116] bg-[#1a1612] px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b7a57]">Geo</p>
                            <p className="mt-2 text-sm text-white">
                              {log.geo?.city ?? "-"} {log.geo?.region ?? ""} {log.geo?.country ?? ""}
                            </p>
                            {log.attempts ? (
                              <p className="mt-1 text-xs text-[#cbb790]/80">Attempts: {log.attempts}</p>
                            ) : null}
                          </div>
                        </div>

                        <div className="mt-6 grid gap-4 lg:grid-cols-2">
                          <div className="rounded-xl border border-[#2a2116] bg-[#1a1612] px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b7a57]">Diff</p>
                            {diffItems.length === 0 ? (
                              <p className="mt-2 text-sm text-[#cbb790]">ไม่มีข้อมูลเปลี่ยนแปลง</p>
                            ) : (
                              <ul className="mt-3 space-y-2 text-sm text-white">
                                {diffItems.slice(0, 12).map((item) => (
                                  <li key={item.path} className="rounded-lg border border-[#2a2116] bg-[#120f0b] px-3 py-2">
                                    <p className="text-xs text-[#8b7a57]">{item.path}</p>
                                    <p className="text-[11px] text-[#cbb790]">
                                      {String(item.before)} → {String(item.after)}
                                    </p>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="rounded-xl border border-[#2a2116] bg-[#1a1612] px-4 py-3">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b7a57]">Metadata</p>
                            <pre className="mt-3 max-h-52 overflow-auto whitespace-pre-wrap rounded-lg bg-[#120f0b] p-3 text-[11px] text-[#cbb790]">
                              {JSON.stringify(
                                {
                                  before: log.before_data,
                                  after: log.after_data,
                                  metadata: log.metadata,
                                },
                                null,
                                2
                              )}
                            </pre>
                          </div>
                        </div>
                      </details>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
