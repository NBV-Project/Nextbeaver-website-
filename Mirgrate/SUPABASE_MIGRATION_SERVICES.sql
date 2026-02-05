-- Services Section Migration

-- 1. Services Content (Section Header)
CREATE TABLE IF NOT EXISTS services_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  eyebrow TEXT NOT NULL,
  eyebrow_th TEXT,
  title TEXT NOT NULL,
  title_th TEXT,
  view_all TEXT NOT NULL,
  view_all_th TEXT,
  explore TEXT NOT NULL,
  explore_th TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Services Styles (Granular Control)
CREATE TABLE IF NOT EXISTS services_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Eyebrow Styles
  eyebrow_font_family_en TEXT,
  eyebrow_font_family_th TEXT,
  eyebrow_font_size INTEGER,
  eyebrow_color_light TEXT,
  eyebrow_color_dark TEXT,
  
  -- Title Styles
  title_font_family_en TEXT,
  title_font_family_th TEXT,
  title_font_size INTEGER,
  title_color_light TEXT,
  title_color_dark TEXT,
  
  -- Card General Styles
  card_bg_light TEXT,
  card_bg_dark TEXT,
  card_border_light TEXT,
  card_border_dark TEXT,
  
  -- Card Icon Styles
  card_icon_color_light TEXT,
  card_icon_color_dark TEXT,
  card_icon_bg_light TEXT,
  card_icon_bg_dark TEXT,
  
  -- Card Title Styles
  card_title_font_family_en TEXT,
  card_title_font_family_th TEXT,
  card_title_font_size INTEGER,
  card_title_color_light TEXT,
  card_title_color_dark TEXT,
  
  -- Card Body Styles
  card_body_font_family_en TEXT,
  card_body_font_family_th TEXT,
  card_body_font_size INTEGER,
  card_body_color_light TEXT,
  card_body_color_dark TEXT,
  
  -- Explore Link Styles (In Card)
  explore_font_family_en TEXT,
  explore_font_family_th TEXT,
  explore_font_size INTEGER,
  explore_color_light TEXT,
  explore_color_dark TEXT,

  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Services Items (Cards)
CREATE TABLE IF NOT EXISTS services_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon_type TEXT NOT NULL DEFAULT 'material', -- 'material' or 'svg'
  icon_value TEXT NOT NULL, -- symbol name or url
  title TEXT NOT NULL,
  title_th TEXT,
  body TEXT NOT NULL,
  body_th TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of strings
  order_index INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE services_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access on services_content" ON services_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access on services_styles" ON services_styles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on services_items" ON services_items FOR SELECT USING (true);

-- Seed Content
INSERT INTO services_content (id, eyebrow, eyebrow_th, title, title_th, view_all, view_all_th, explore, explore_th)
VALUES (
  '00000000-0000-0000-0000-000000004001',
  'CURATED CAPABILITIES',
  'ความสามารถที่คัดสรรมาอย่างดี',
  'BESPOKE SERVICES FOR DEMANDING BRANDS',
  'บริการออกแบบพิเศษสำหรับแบรนด์ชั้นนำ',
  'VIEW ALL SERVICES',
  'ดูบริการทั้งหมด',
  'EXPLORE →',
  'ดูรายละเอียด →'
) ON CONFLICT (id) DO NOTHING;

-- Seed Styles
INSERT INTO services_styles (
  id,
  eyebrow_font_family_en, eyebrow_font_family_th, eyebrow_font_size, eyebrow_color_light, eyebrow_color_dark,
  title_font_family_en, title_font_family_th, title_font_size, title_color_light, title_color_dark,
  card_bg_light, card_bg_dark,
  card_border_light, card_border_dark,
  card_icon_color_light, card_icon_color_dark,
  card_icon_bg_light, card_icon_bg_dark,
  card_title_font_family_en, card_title_font_family_th, card_title_font_size, card_title_color_light, card_title_color_dark,
  card_body_font_family_en, card_body_font_family_th, card_body_font_size, card_body_color_light, card_body_color_dark,
  explore_font_family_en, explore_font_family_th, explore_font_size, explore_color_light, explore_color_dark
) VALUES (
  '00000000-0000-0000-0000-000000004002',
  'Space Grotesk, sans-serif', 'Space Grotesk, sans-serif', 12, '#ea580c', '#ea580c',
  'Space Grotesk, sans-serif', 'Space Grotesk, sans-serif', 36, '#0f172a', '#f5f5f4',
  '#f5f5f4', '#1c1917',
  '#e7e5e4', 'rgba(255, 255, 255, 0.1)',
  '#181411', '#ffffff',
  '#ffffff', 'rgba(255, 255, 255, 0.05)',
  'Space Grotesk, sans-serif', 'Space Grotesk, sans-serif', 24, '#0f172a', '#f5f5f4',
  'Inter, sans-serif', 'Inter, sans-serif', 14, '#4b5563', '#a8a29e',
  'Space Grotesk, sans-serif', 'Space Grotesk, sans-serif', 14, '#ea580c', '#ea580c'
) ON CONFLICT (id) DO NOTHING;

-- Seed Items
INSERT INTO services_items (id, order_index, icon_type, icon_value, title, title_th, body, body_th, features)
VALUES 
(
  '00000000-0000-0000-0000-000000004101', 0, 'material', 'architecture', 
  'Digital Architecture', 'สถาปัตยกรรมดิจิทัล',
  'Robust, scalable back-end solutions architected for high-traffic enterprise environments.',
  'โซลูชัน Backend ที่แข็งแกร่งและปรับขนาดได้ ออกแบบมาสำหรับองค์กรที่มีปริมาณการใช้งานสูง',
  '["Cloud Infrastructure", "API Development", "Security Compliance"]'::jsonb
),
(
  '00000000-0000-0000-0000-000000004102', 1, 'material', 'palette',
  'Immersive UI/UX', 'ประสบการณ์ผู้ใช้ UI/UX',
  'Interface design that transcends utility to become an extension of your brand narrative.',
  'การออกแบบอินเทอร์เฟซที่เหนือกว่าประโยชน์ใช้สอย เพื่อเป็นส่วนขยายของการเล่าเรื่องแบรนด์ของคุณ',
  '["Interactive Prototyping", "Motion Design", "User Research"]'::jsonb
),
(
  '00000000-0000-0000-0000-000000004103', 2, 'material', 'diamond',
  'Brand Evolution', 'วิวัฒนาการแบรนด์',
  'Strategic consulting to align your digital footprint with your market positioning.',
  'การให้คำปรึกษาเชิงกลยุทธ์เพื่อปรับรอยเท้าดิจิทัลของคุณให้สอดคล้องกับตำแหน่งทางการตลาด',
  '["Digital Strategy", "Content Direction", "Analytics & Growth"]'::jsonb
),
(
  '00000000-0000-0000-0000-000000004104', 3, 'material', 'auto_awesome',
  'Automation & AI', 'ระบบอัตโนมัติ & AI',
  'Automation layers and AI copilots that streamline operations without sacrificing quality.',
  'เลเยอร์ระบบอัตโนมัติและ AI Copilot ที่ช่วยเพิ่มประสิทธิภาพการดำเนินงานโดยไม่ลดคุณภาพ',
  '["Workflow Automation", "AI Integrations", "Process Optimization"]'::jsonb
);
