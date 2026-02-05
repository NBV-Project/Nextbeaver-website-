-- Admin audit log table
create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor_id text,
  actor_label text,
  action text not null,
  target text,
  result text,
  ip_address text,
  user_agent text,
  request_id text,
  session_id text,
  geo jsonb,
  attempts integer,
  before_data jsonb,
  after_data jsonb,
  diff_data jsonb,
  metadata jsonb
);

create index if not exists admin_audit_log_created_at_idx on public.admin_audit_log (created_at desc);
create index if not exists admin_audit_log_actor_id_idx on public.admin_audit_log (actor_id);
create index if not exists admin_audit_log_action_idx on public.admin_audit_log (action);
create index if not exists admin_audit_log_ip_idx on public.admin_audit_log (ip_address);
