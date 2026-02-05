-- Create table for quote content
CREATE TABLE IF NOT EXISTS public.home_quote (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    body TEXT NOT NULL,
    body_th TEXT,
    author_name TEXT NOT NULL,
    author_name_th TEXT,
    author_role TEXT NOT NULL,
    author_role_th TEXT,
    icon TEXT NOT NULL DEFAULT 'format_quote',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT home_quote_pkey PRIMARY KEY (id)
);

-- Create table for quote styles
CREATE TABLE IF NOT EXISTS public.home_quote_styles (
    id UUID NOT NULL DEFAULT extensions.uuid_generate_v4(),
    body_font_family_en TEXT DEFAULT 'Space Grotesk, sans-serif',
    body_font_family_th TEXT DEFAULT 'Space Grotesk, sans-serif',
    body_font_size INTEGER DEFAULT 24,
    body_color_light TEXT DEFAULT '#ffffff',
    body_color_dark TEXT DEFAULT '#ffffff',
    author_font_family_en TEXT DEFAULT 'Space Grotesk, sans-serif',
    author_font_family_th TEXT DEFAULT 'Space Grotesk, sans-serif',
    author_font_size INTEGER DEFAULT 14,
    author_color_light TEXT DEFAULT '#ffffff',
    author_color_dark TEXT DEFAULT '#ffffff',
    role_font_family_en TEXT DEFAULT 'Space Grotesk, sans-serif',
    role_font_family_th TEXT DEFAULT 'Space Grotesk, sans-serif',
    role_font_size INTEGER DEFAULT 12,
    role_color_light TEXT DEFAULT '#a3a3a3',
    role_color_dark TEXT DEFAULT '#a3a3a3',
    icon_color_light TEXT DEFAULT 'rgba(234, 88, 12, 0.3)',
    icon_color_dark TEXT DEFAULT 'rgba(234, 88, 12, 0.3)',
    section_bg_light TEXT DEFAULT '#181411',
    section_bg_dark TEXT DEFAULT '#181411',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT home_quote_styles_pkey PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.home_quote ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_quote_styles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON public.home_quote FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.home_quote_styles FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON public.home_quote FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON public.home_quote FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated insert" ON public.home_quote_styles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON public.home_quote_styles FOR UPDATE USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT SELECT ON public.home_quote TO anon;
GRANT SELECT ON public.home_quote TO authenticated;
GRANT ALL ON public.home_quote TO service_role;

GRANT SELECT ON public.home_quote_styles TO anon;
GRANT SELECT ON public.home_quote_styles TO authenticated;
GRANT ALL ON public.home_quote_styles TO service_role;
