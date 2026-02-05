-- 1. Create portfolio_hero table
CREATE TABLE IF NOT EXISTS portfolio_hero (
  -- We use a fixed UUID or enforce single row application-side, 
  -- but standard practice is a table. We'll assume one row for the main hero.
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY, 
  title TEXT,
  accent TEXT,
  description TEXT,
  styles JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create portfolio_projects table
CREATE TABLE IF NOT EXISTS portfolio_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image TEXT,
  link TEXT,
  breadcrumbs TEXT,
  details TEXT[],
  tech TEXT[],
  gallery TEXT[],
  styles JSONB DEFAULT '{}'::jsonb,
  order_index INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE portfolio_hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- 4. Policies (Public Read)
CREATE POLICY "Public Read Hero" ON portfolio_hero FOR SELECT USING (true);
CREATE POLICY "Public Read Projects" ON portfolio_projects FOR SELECT USING (true);

-- 5. Insert default Hero row if empty (to prevent fetch errors)
INSERT INTO portfolio_hero (title, accent, description, styles)
SELECT 'Crafting Digital', 'Grandeur.', 'Specializing in high-end web experiences...', 
       '{"titleColor": "#181411", "accentColor": "#f27f0d", "titleFontSize": "clamp(2.75rem, 6vw, 4.5rem)", "titleFontFamily": "Space Grotesk, sans-serif", "descriptionColor": "#6b5d52", "descriptionFontSize": "1.25rem", "descriptionFontFamily": "Space Grotesk, sans-serif"}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM portfolio_hero);
