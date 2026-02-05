-- Home Hero content
CREATE TABLE IF NOT EXISTS home_hero (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge TEXT NOT NULL,
  badge_th TEXT,
  title TEXT NOT NULL,
  title_th TEXT,
  accent TEXT NOT NULL,
  accent_th TEXT,
  description TEXT NOT NULL,
  description_th TEXT,
  primary_cta TEXT NOT NULL,
  primary_cta_th TEXT,
  primary_cta_href TEXT NOT NULL,
  secondary_cta TEXT NOT NULL,
  secondary_cta_th TEXT,
  secondary_cta_href TEXT NOT NULL,
  code_filename TEXT NOT NULL,
  status_label TEXT NOT NULL,
  status_label_th TEXT,
  status_value TEXT NOT NULL,
  status_value_th TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS home_hero_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  badge_font_family_en TEXT,
  badge_font_family_th TEXT,
  badge_font_size INTEGER,
  title_font_family_en TEXT,
  title_font_family_th TEXT,
  title_font_size INTEGER,
  accent_font_family_en TEXT,
  accent_font_family_th TEXT,
  accent_font_size INTEGER,
  description_font_family_en TEXT,
  description_font_family_th TEXT,
  description_font_size INTEGER,
  cta_font_family_en TEXT,
  cta_font_family_th TEXT,
  cta_font_size INTEGER,
  status_label_font_family_en TEXT,
  status_label_font_family_th TEXT,
  status_label_font_size INTEGER,
  status_value_font_family_en TEXT,
  status_value_font_family_th TEXT,
  status_value_font_size INTEGER,
  code_font_family TEXT,
  code_font_size INTEGER,
  badge_text_color_light TEXT,
  badge_text_color_dark TEXT,
  badge_border_color_light TEXT,
  badge_border_color_dark TEXT,
  badge_bg_color_light TEXT,
  badge_bg_color_dark TEXT,
  badge_dot_color_light TEXT,
  badge_dot_color_dark TEXT,
  title_color_light TEXT,
  title_color_dark TEXT,
  accent_color_light TEXT,
  accent_color_dark TEXT,
  accent_gradient_enabled_light BOOLEAN,
  accent_gradient_enabled_dark BOOLEAN,
  accent_gradient_light_start TEXT,
  accent_gradient_light_end TEXT,
  accent_gradient_dark_start TEXT,
  accent_gradient_dark_end TEXT,
  description_color_light TEXT,
  description_color_dark TEXT,
  primary_cta_bg_light TEXT,
  primary_cta_bg_dark TEXT,
  primary_cta_text_light TEXT,
  primary_cta_text_dark TEXT,
  secondary_cta_bg_light TEXT,
  secondary_cta_bg_dark TEXT,
  secondary_cta_text_light TEXT,
  secondary_cta_text_dark TEXT,
  secondary_cta_border_light TEXT,
  secondary_cta_border_dark TEXT,
  status_label_color_light TEXT,
  status_label_color_dark TEXT,
  status_value_color_light TEXT,
  status_value_color_dark TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS home_hero_code_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS home_hero_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  label_th TEXT,
  icon TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS home_logo_loop_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  speed INTEGER NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('left', 'right')),
  gap INTEGER NOT NULL,
  logo_height INTEGER NOT NULL,
  fade_out BOOLEAN NOT NULL DEFAULT true,
  fade_out_color_light TEXT NOT NULL,
  fade_out_color_dark TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS home_logo_loop_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  alt_th TEXT,
  order_index INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE home_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_hero_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_hero_code_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_hero_capabilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_logo_loop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_logo_loop_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on home_hero" ON home_hero FOR SELECT USING (true);
CREATE POLICY "Allow public read access on home_hero_styles" ON home_hero_styles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on home_hero_code_lines" ON home_hero_code_lines FOR SELECT USING (true);
CREATE POLICY "Allow public read access on home_hero_capabilities" ON home_hero_capabilities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on home_logo_loop_settings" ON home_logo_loop_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on home_logo_loop_items" ON home_logo_loop_items FOR SELECT USING (true);

INSERT INTO home_hero (
  id,
  badge,
  badge_th,
  title,
  title_th,
  accent,
  accent_th,
  description,
  description_th,
  primary_cta,
  primary_cta_th,
  primary_cta_href,
  secondary_cta,
  secondary_cta_th,
  secondary_cta_href,
  code_filename,
  status_label,
  status_label_th,
  status_value,
  status_value_th
)
VALUES (
  '00000000-0000-0000-0000-000000000101',
  'Accepting New Ventures',
  'Accepting New Ventures',
  'BESPOKE',
  'BESPOKE',
  'WEB SOLUTIONS',
  'WEB SOLUTIONS',
  'We operate at the precise point where aesthetics meet engineering, crafting digital experiences that function as flawlessly as they feel.',
  'We operate at the precise point where aesthetics meet engineering, crafting digital experiences that function as flawlessly as they feel.',
  'DISCOVER THE CRAFT',
  'DISCOVER THE CRAFT',
  '#contact',
  'VIEW SHOWREEL',
  'VIEW SHOWREEL',
  '/portfolio',
  'nextbeaver.tsx',
  'Status',
  'Status',
  'System Optimized',
  'System Optimized'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO home_hero_styles (
  id,
  badge_font_family_en,
  badge_font_family_th,
  badge_font_size,
  title_font_family_en,
  title_font_family_th,
  title_font_size,
  accent_font_family_en,
  accent_font_family_th,
  accent_font_size,
  description_font_family_en,
  description_font_family_th,
  description_font_size,
  cta_font_family_en,
  cta_font_family_th,
  cta_font_size,
  status_label_font_family_en,
  status_label_font_family_th,
  status_label_font_size,
  status_value_font_family_en,
  status_value_font_family_th,
  status_value_font_size,
  code_font_family,
  code_font_size,
  badge_text_color_light,
  badge_text_color_dark,
  badge_border_color_light,
  badge_border_color_dark,
  badge_bg_color_light,
  badge_bg_color_dark,
  badge_dot_color_light,
  badge_dot_color_dark,
  title_color_light,
  title_color_dark,
  accent_color_light,
  accent_color_dark,
  accent_gradient_enabled_light,
  accent_gradient_enabled_dark,
  accent_gradient_light_start,
  accent_gradient_light_end,
  accent_gradient_dark_start,
  accent_gradient_dark_end,
  description_color_light,
  description_color_dark,
  primary_cta_bg_light,
  primary_cta_bg_dark,
  primary_cta_text_light,
  primary_cta_text_dark,
  secondary_cta_bg_light,
  secondary_cta_bg_dark,
  secondary_cta_text_light,
  secondary_cta_text_dark,
  secondary_cta_border_light,
  secondary_cta_border_dark,
  status_label_color_light,
  status_label_color_dark,
  status_value_color_light,
  status_value_color_dark
)
VALUES (
  '00000000-0000-0000-0000-000000000102',
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  12,
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  64,
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  64,
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  20,
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  16,
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  12,
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  14,
  'Fira Code, monospace',
  14,
  '#f98c1f',
  '#f98c1f',
  'rgba(249, 140, 31, 0.2)',
  'rgba(249, 140, 31, 0.2)',
  'rgba(249, 140, 31, 0.05)',
  'rgba(249, 140, 31, 0.05)',
  '#f98c1f',
  '#f98c1f',
  '#181411',
  '#ffffff',
  '#f98c1f',
  '#f98c1f',
  false,
  true,
  '#f98c1f',
  '#fcd9b4',
  '#f98c1f',
  '#ffd9b0',
  '#525252',
  '#a3a3a3',
  '#ea580c',
  '#f98c1f',
  '#ffffff',
  '#181411',
  '#f5f5f4',
  'rgba(255, 255, 255, 0.05)',
  '#0f172a',
  '#ffffff',
  '#e7e5e4',
  'rgba(255, 255, 255, 0.1)',
  '#9ca3af',
  '#9ca3af',
  '#ffffff',
  '#ffffff'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO home_hero_code_lines (id, line, order_index)
VALUES
  ('00000000-0000-0000-0000-000000001001', 'import { Excellence } from ''@grandeur/core'';', 0),
  ('00000000-0000-0000-0000-000000001002', 'const Initialize = async () => {', 1),
  ('00000000-0000-0000-0000-000000001003', '  // Configuring premium parameters', 2),
  ('00000000-0000-0000-0000-000000001004', '  const config = {', 3),
  ('00000000-0000-0000-0000-000000001005', '    target: ''Market_Leader'',', 4),
  ('00000000-0000-0000-0000-000000001006', '    quality: Infinity,', 5),
  ('00000000-0000-0000-0000-000000001007', '    style: ''Bespoke''', 6),
  ('00000000-0000-0000-0000-000000001008', '  };', 7),
  ('00000000-0000-0000-0000-000000001009', '  await Excellence.deploy(config);', 8),
  ('00000000-0000-0000-0000-000000001010', '};', 9),
  ('00000000-0000-0000-0000-000000001011', 'export default Initialize;', 10)
ON CONFLICT (id) DO NOTHING;

INSERT INTO home_hero_capabilities (id, label, label_th, icon, order_index)
VALUES
  ('00000000-0000-0000-0000-000000002001', 'Strategy', 'Strategy', 'diamond', 0),
  ('00000000-0000-0000-0000-000000002002', 'UI/UX', 'UI/UX', 'layers', 1),
  ('00000000-0000-0000-0000-000000002003', 'Engineering', 'Engineering', 'code-2', 2),
  ('00000000-0000-0000-0000-000000002004', 'DevOps', 'DevOps', 'terminal', 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO home_logo_loop_settings (
  id,
  speed,
  direction,
  gap,
  logo_height,
  fade_out,
  fade_out_color_light,
  fade_out_color_dark
)
VALUES (
  '00000000-0000-0000-0000-000000000103',
  40,
  'left',
  48,
  32,
  true,
  '#ffffff',
  '#181411'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO home_logo_loop_items (id, src, alt, alt_th, order_index)
VALUES
  ('00000000-0000-0000-0000-000000003001', '/tech/bun.svg', 'Bun.js', 'Bun.js', 0),
  ('00000000-0000-0000-0000-000000003002', '/tech/nextjs.svg', 'Next.js', 'Next.js', 1),
  ('00000000-0000-0000-0000-000000003003', '/tech/tailwind.svg', 'Tailwind CSS', 'Tailwind CSS', 2),
  ('00000000-0000-0000-0000-000000003004', '/tech/supabase.svg', 'Supabase', 'Supabase', 3),
  ('00000000-0000-0000-0000-000000003005', '/tech/typescript.svg', 'TypeScript', 'TypeScript', 4),
  ('00000000-0000-0000-0000-000000003006', '/tech/react.svg', 'React', 'React', 5),
  ('00000000-0000-0000-0000-000000003007', '/tech/nodejs.svg', 'Node.js', 'Node.js', 6),
  ('00000000-0000-0000-0000-000000003008', '/tech/docker.svg', 'Docker', 'Docker', 7),
  ('00000000-0000-0000-0000-000000003009', '/tech/python.svg', 'Python', 'Python', 8),
  ('00000000-0000-0000-0000-000000003010', '/tech/firebase.svg', 'Firebase', 'Firebase', 9),
  ('00000000-0000-0000-0000-000000003011', '/tech/figma.svg', 'Figma', 'Figma', 10),
  ('00000000-0000-0000-0000-000000003012', '/tech/github.svg', 'GitHub', 'GitHub', 11)
ON CONFLICT (id) DO NOTHING;
