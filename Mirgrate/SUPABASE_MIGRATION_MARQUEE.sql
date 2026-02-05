-- Migration for Marquee Showcase Section

-- 1. Main Content Table
CREATE TABLE IF NOT EXISTS home_marquee_showcase (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge text NOT NULL DEFAULT 'CURATED PORTFOLIO',
  badge_th text,
  title text NOT NULL DEFAULT 'SIGNATURE WORK BUILT FOR AMBITIOUS BRANDS',
  title_th text,
  highlighted_text text NOT NULL DEFAULT 'what we build',
  highlighted_text_th text,
  heading_prefix text NOT NULL DEFAULT 'Work that proves ',
  heading_prefix_th text,
  heading_suffix text NOT NULL DEFAULT ' together.',
  heading_suffix_th text,
  description text NOT NULL DEFAULT 'Explore the systems, products, and visual experiences we''ve shipped for teams that care about clarity, speed, and results.',
  description_th text,
  cta1_text text NOT NULL DEFAULT 'View portfolio',
  cta1_text_th text,
  cta1_link text NOT NULL DEFAULT '/portfolio',
  cta2_text text NOT NULL DEFAULT 'Start a project',
  cta2_text_th text,
  cta2_link text NOT NULL DEFAULT '/contact',
  marquee_speed numeric NOT NULL DEFAULT 40,
  marquee_direction text NOT NULL DEFAULT 'left',
  marquee_reverse boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Styles Table (One-to-One with Content)
CREATE TABLE IF NOT EXISTS home_marquee_styles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Badge Styles
  badge_font_family_en text DEFAULT 'Space Grotesk, sans-serif',
  badge_font_family_th text DEFAULT 'Space Grotesk, sans-serif',
  badge_font_size numeric DEFAULT 12,
  badge_color_light text DEFAULT '#ea580c',
  badge_color_dark text DEFAULT '#ea580c',
  
  -- Title Styles
  title_font_family_en text DEFAULT 'Space Grotesk, sans-serif',
  title_font_family_th text DEFAULT 'Space Grotesk, sans-serif',
  title_font_size numeric DEFAULT 30,
  title_color_light text DEFAULT '#181411',
  title_color_dark text DEFAULT '#ffffff',

  -- Large Heading Styles
  heading_font_family_en text DEFAULT 'Space Grotesk, sans-serif',
  heading_font_family_th text DEFAULT 'Space Grotesk, sans-serif',
  heading_font_size numeric DEFAULT 48,
  heading_color_light text DEFAULT '#181411',
  heading_color_dark text DEFAULT '#ffffff',
  
  -- Highlighted Text Styles
  highlight_bg_color_light text DEFAULT 'rgba(234, 88, 12, 0.25)',
  highlight_bg_color_dark text DEFAULT 'rgba(234, 88, 12, 0.25)',
  highlight_text_color_light text DEFAULT '#181411',
  highlight_text_color_dark text DEFAULT '#ffffff',

  -- Description Styles
  desc_font_family_en text DEFAULT 'Space Grotesk, sans-serif',
  desc_font_family_th text DEFAULT 'Space Grotesk, sans-serif',
  desc_font_size numeric DEFAULT 16,
  desc_color_light text DEFAULT '#525252',
  desc_color_dark text DEFAULT '#a3a3a3',

  -- CTA 1 Styles (Primary)
  cta1_bg_light text DEFAULT '#ea580c',
  cta1_bg_dark text DEFAULT '#ea580c',
  cta1_text_color_light text DEFAULT '#ffffff',
  cta1_text_color_dark text DEFAULT '#181411',

  -- CTA 2 Styles (Secondary)
  cta2_bg_light text DEFAULT 'rgba(255, 255, 255, 0.7)',
  cta2_bg_dark text DEFAULT 'rgba(255, 255, 255, 0.05)',
  cta2_text_color_light text DEFAULT '#181411',
  cta2_text_color_dark text DEFAULT '#ffffff',
  cta2_border_light text DEFAULT '#e7e5e4',
  cta2_border_dark text DEFAULT '#ffffff',

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Marquee Items Table (List of images)
CREATE TABLE IF NOT EXISTS home_marquee_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  src text NOT NULL,
  alt text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE home_marquee_showcase ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_marquee_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_marquee_items ENABLE ROW LEVEL SECURITY;

-- Policies (Public Read, Admin Write)
CREATE POLICY "Public Read Showcase" ON home_marquee_showcase FOR SELECT USING (true);
CREATE POLICY "Admin Update Showcase" ON home_marquee_showcase FOR UPDATE USING (auth.role() = 'service_role'); -- Simplified for demo, usually checks user role
CREATE POLICY "Admin Insert Showcase" ON home_marquee_showcase FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public Read Styles" ON home_marquee_styles FOR SELECT USING (true);
CREATE POLICY "Admin Update Styles" ON home_marquee_styles FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Admin Insert Styles" ON home_marquee_styles FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public Read Items" ON home_marquee_items FOR SELECT USING (true);
CREATE POLICY "Admin Manage Items" ON home_marquee_items FOR ALL USING (auth.role() = 'service_role');

-- SEED DATA
INSERT INTO home_marquee_showcase (badge, title, highlighted_text, heading_prefix, heading_suffix, description, cta1_text, cta1_link, cta2_text, cta2_link)
VALUES (
  'CURATED PORTFOLIO',
  E'SIGNATURE WORK BUILT\nFOR AMBITIOUS BRANDS',
  'what we build',
  'Work that proves ',
  ' together.',
  'Explore the systems, products, and visual experiences we''ve shipped for teams that care about clarity, speed, and results.',
  'View portfolio',
  '/portfolio',
  'Start a project',
  '/contact'
);

INSERT INTO home_marquee_styles (badge_font_size) VALUES (12);

INSERT INTO home_marquee_items (src, order_index) VALUES 
('https://assets.aceternity.com/cloudinary_bkp/3d-card.png', 0),
('https://assets.aceternity.com/animated-modal.png', 1),
('https://assets.aceternity.com/animated-testimonials.webp', 2),
('https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png', 3),
('https://assets.aceternity.com/github-globe.png', 4),
('https://assets.aceternity.com/glare-card.png', 5),
('https://assets.aceternity.com/layout-grid.png', 6),
('https://assets.aceternity.com/flip-text.png', 7),
('https://assets.aceternity.com/hero-highlight.png', 8),
('https://assets.aceternity.com/carousel.webp', 9),
('https://assets.aceternity.com/placeholders-and-vanish-input.png', 10),
('https://assets.aceternity.com/shooting-stars-and-stars-background.png', 11),
('https://assets.aceternity.com/signup-form.png', 12),
('https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png', 13),
('https://assets.aceternity.com/spotlight-new.webp', 14),
('https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png', 15),
('https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png', 16),
('https://assets.aceternity.com/tabs.png', 17),
('https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png', 18),
('https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png', 19),
('https://assets.aceternity.com/glowing-effect.webp', 20),
('https://assets.aceternity.com/hover-border-gradient.png', 21),
('https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png', 22),
('https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png', 23),
('https://assets.aceternity.com/macbook-scroll.png', 24),
('https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png', 25),
('https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png', 26),
('https://assets.aceternity.com/multi-step-loader.png', 27),
('https://assets.aceternity.com/vortex.png', 28),
('https://assets.aceternity.com/wobble-card.png', 29),
('https://assets.aceternity.com/world-map.webp', 30);
