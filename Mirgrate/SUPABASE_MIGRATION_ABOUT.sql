-- About content
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  image_alt TEXT NOT NULL,
  image_alt_th TEXT,
  highlight_value TEXT NOT NULL,
  highlight_label TEXT NOT NULL,
  highlight_label_th TEXT,
  eyebrow TEXT NOT NULL,
  eyebrow_th TEXT,
  title TEXT NOT NULL,
  title_th TEXT,
  title_accent TEXT NOT NULL,
  title_accent_th TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS about_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_overlay_color_light TEXT,
  image_overlay_color_dark TEXT,
  highlight_bg_color_light TEXT,
  highlight_bg_color_dark TEXT,
  highlight_value_color_light TEXT,
  highlight_value_color_dark TEXT,
  highlight_label_color_light TEXT,
  highlight_label_color_dark TEXT,
  highlight_value_font_family_en TEXT,
  highlight_value_font_family_th TEXT,
  highlight_value_font_size INTEGER,
  highlight_label_font_family_en TEXT,
  highlight_label_font_family_th TEXT,
  highlight_label_font_size INTEGER,
  eyebrow_color_light TEXT,
  eyebrow_color_dark TEXT,
  eyebrow_font_family_en TEXT,
  eyebrow_font_family_th TEXT,
  eyebrow_font_size INTEGER,
  title_color_light TEXT,
  title_color_dark TEXT,
  title_font_family_en TEXT,
  title_font_family_th TEXT,
  title_font_size INTEGER,
  title_accent_color_light TEXT,
  title_accent_color_dark TEXT,
  title_accent_font_family_en TEXT,
  title_accent_font_family_th TEXT,
  title_accent_font_size INTEGER,
  body_color_light TEXT,
  body_color_dark TEXT,
  body_font_family_en TEXT,
  body_font_family_th TEXT,
  body_font_size INTEGER,
  pillar_title_color_light TEXT,
  pillar_title_color_dark TEXT,
  pillar_title_font_family_en TEXT,
  pillar_title_font_family_th TEXT,
  pillar_title_font_size INTEGER,
  pillar_body_color_light TEXT,
  pillar_body_color_dark TEXT,
  pillar_body_font_family_en TEXT,
  pillar_body_font_family_th TEXT,
  pillar_body_font_size INTEGER,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS about_body (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  text_th TEXT,
  order_index INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS about_pillars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_th TEXT,
  body TEXT NOT NULL,
  body_th TEXT,
  order_index INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_body ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_pillars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on about_content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access on about_styles" ON about_styles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on about_body" ON about_body FOR SELECT USING (true);
CREATE POLICY "Allow public read access on about_pillars" ON about_pillars FOR SELECT USING (true);
