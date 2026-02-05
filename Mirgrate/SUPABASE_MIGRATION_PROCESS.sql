create table if not exists process_content (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_th text,
  subtitle text not null,
  subtitle_th text,
  updated_at timestamptz default now()
);

create table if not exists process_styles (
  id uuid primary key default gen_random_uuid(),
  title_color_light text,
  title_color_dark text,
  title_font_family_en text,
  title_font_family_th text,
  title_font_size integer,
  subtitle_color_light text,
  subtitle_color_dark text,
  subtitle_font_family_en text,
  subtitle_font_family_th text,
  subtitle_font_size integer,
  accent_color_light text,
  accent_color_dark text,
  step_icon_color_light text,
  step_icon_color_dark text,
  step_number_color_light text,
  step_number_color_dark text,
  step_title_color_light text,
  step_title_color_dark text,
  step_title_font_family_en text,
  step_title_font_family_th text,
  step_title_font_size integer,
  step_body_color_light text,
  step_body_color_dark text,
  step_body_font_family_en text,
  step_body_font_family_th text,
  step_body_font_size integer,
  line_base_color_light text,
  line_base_color_dark text,
  line_accent_color_light text,
  line_accent_color_dark text,
  line_dash_color_light text,
  line_dash_color_dark text,
  line_pulse_duration_desktop numeric,
  line_pulse_duration_mobile numeric,
  line_dash_duration_desktop numeric,
  line_dash_duration_mobile numeric,
  updated_at timestamptz default now()
);

create table if not exists process_steps (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  title text not null,
  title_th text,
  body text not null,
  body_th text,
  icon text not null,
  icon_color_light text,
  icon_color_dark text,
  highlight boolean default false,
  offset_class text,
  title_color_light text,
  title_color_dark text,
  title_font_family_en text,
  title_font_family_th text,
  title_font_size integer,
  body_color_light text,
  body_color_dark text,
  body_font_family_en text,
  body_font_family_th text,
  body_font_size integer,
  order_index integer default 0,
  updated_at timestamptz default now()
);

alter table process_content enable row level security;
alter table process_styles enable row level security;
alter table process_steps enable row level security;

create policy "Public read access" on process_content for select using (true);
create policy "Public read access" on process_styles for select using (true);
create policy "Public read access" on process_steps for select using (true);
