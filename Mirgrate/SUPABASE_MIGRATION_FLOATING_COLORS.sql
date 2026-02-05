-- Add color columns to floating_social_items
ALTER TABLE floating_social_items 
ADD COLUMN IF NOT EXISTS bg_color TEXT,
ADD COLUMN IF NOT EXISTS icon_color TEXT;
