-- Migration V2: Add Thai language support

-- 1. Add Thai columns to portfolio_hero
ALTER TABLE portfolio_hero 
ADD COLUMN IF NOT EXISTS title_th TEXT,
ADD COLUMN IF NOT EXISTS accent_th TEXT,
ADD COLUMN IF NOT EXISTS description_th TEXT;

-- 2. Add Thai columns to portfolio_projects
ALTER TABLE portfolio_projects 
ADD COLUMN IF NOT EXISTS title_th TEXT,
ADD COLUMN IF NOT EXISTS description_th TEXT,
ADD COLUMN IF NOT EXISTS breadcrumbs_th TEXT,
ADD COLUMN IF NOT EXISTS details_th TEXT[];

-- 3. (Optional) Backfill Thai columns with English data if empty (to prevent nulls initially)
UPDATE portfolio_hero SET title_th = title WHERE title_th IS NULL;
UPDATE portfolio_hero SET accent_th = accent WHERE accent_th IS NULL;
UPDATE portfolio_hero SET description_th = description WHERE description_th IS NULL;

UPDATE portfolio_projects SET title_th = title WHERE title_th IS NULL;
UPDATE portfolio_projects SET description_th = description WHERE description_th IS NULL;
UPDATE portfolio_projects SET breadcrumbs_th = breadcrumbs WHERE breadcrumbs_th IS NULL;
UPDATE portfolio_projects SET details_th = details WHERE details_th IS NULL;
