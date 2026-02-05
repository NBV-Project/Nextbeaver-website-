-- Add updated_at column to home_marquee_items table
ALTER TABLE home_marquee_items 
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
