-- Contact Content
CREATE TABLE IF NOT EXISTS contact_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow TEXT NOT NULL,
  eyebrow_th TEXT,
  title_top TEXT NOT NULL,
  title_top_th TEXT,
  title_bottom TEXT NOT NULL,
  title_bottom_th TEXT,
  body TEXT NOT NULL,
  body_th TEXT,
  email_label TEXT NOT NULL,
  email_label_th TEXT,
  email TEXT NOT NULL,
  location_label TEXT NOT NULL,
  location_label_th TEXT,
  location TEXT NOT NULL,
  location_th TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Form Content
CREATE TABLE IF NOT EXISTS contact_form_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_label TEXT NOT NULL,
  name_label_th TEXT,
  name_placeholder TEXT NOT NULL,
  name_placeholder_th TEXT,
  company_label TEXT NOT NULL,
  company_label_th TEXT,
  company_placeholder TEXT NOT NULL,
  company_placeholder_th TEXT,
  email_label TEXT NOT NULL,
  email_label_th TEXT,
  email_placeholder TEXT NOT NULL,
  email_placeholder_th TEXT,
  details_label TEXT NOT NULL,
  details_label_th TEXT,
  details_placeholder TEXT NOT NULL,
  details_placeholder_th TEXT,
  submit_label TEXT NOT NULL,
  submit_label_th TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contact Styles
CREATE TABLE IF NOT EXISTS contact_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Fonts
  eyebrow_font_family_en TEXT,
  eyebrow_font_family_th TEXT,
  eyebrow_font_size INTEGER,
  title_font_family_en TEXT,
  title_font_family_th TEXT,
  title_font_size INTEGER,
  body_font_family_en TEXT,
  body_font_family_th TEXT,
  body_font_size INTEGER,
  label_font_family_en TEXT,
  label_font_family_th TEXT,
  label_font_size INTEGER,
  info_font_family_en TEXT,
  info_font_family_th TEXT,
  info_font_size INTEGER,
  form_label_font_family_en TEXT,
  form_label_font_family_th TEXT,
  form_label_font_size INTEGER,
  input_font_family_en TEXT,
  input_font_family_th TEXT,
  input_font_size INTEGER,
  button_font_family_en TEXT,
  button_font_family_th TEXT,
  button_font_size INTEGER,
  
  -- Colors
  eyebrow_color_light TEXT,
  eyebrow_color_dark TEXT,
  title_color_light TEXT,
  title_color_dark TEXT,
  body_color_light TEXT,
  body_color_dark TEXT,
  label_color_light TEXT,
  label_color_dark TEXT,
  info_color_light TEXT,
  info_color_dark TEXT,
  icon_bg_light TEXT,
  icon_bg_dark TEXT,
  icon_color_light TEXT,
  icon_color_dark TEXT,
  
  form_bg_light TEXT,
  form_bg_dark TEXT,
  form_border_light TEXT,
  form_border_dark TEXT,
  form_label_color_light TEXT,
  form_label_color_dark TEXT,
  input_bg_light TEXT,
  input_bg_dark TEXT,
  input_border_light TEXT,
  input_border_dark TEXT,
  input_text_light TEXT,
  input_text_dark TEXT,
  input_placeholder_light TEXT,
  input_placeholder_dark TEXT,
  
  button_bg_light TEXT,
  button_bg_dark TEXT,
  button_text_light TEXT,
  button_text_dark TEXT,
  
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Floating Social Items
CREATE TABLE IF NOT EXISTS floating_social_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  label_th TEXT,
  href TEXT NOT NULL,
  icon_svg TEXT NOT NULL, -- Storing SVG string directly for flexibility
  type TEXT NOT NULL, -- 'facebook', 'line', 'instagram', 'phone', 'mail', 'other'
  order_index INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policies
ALTER TABLE contact_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_form_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE floating_social_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on contact_content" ON contact_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access on contact_form_content" ON contact_form_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access on contact_styles" ON contact_styles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on floating_social_items" ON floating_social_items FOR SELECT USING (true);

-- Insert Permissions (assuming authenticated admin triggers these via service role or similar, but for now open for dev/admin)
CREATE POLICY "Allow authenticated update on contact_content" ON contact_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on contact_form_content" ON contact_form_content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update on contact_styles" ON contact_styles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated all on floating_social_items" ON floating_social_items USING (auth.role() = 'authenticated');
