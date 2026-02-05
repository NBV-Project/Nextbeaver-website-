-- Seed data for home_quote
INSERT INTO public.home_quote (body, body_th, author_name, author_name_th, author_role, author_role_th, icon)
VALUES (
    '"Atelier didn''t just build a website; they constructed a digital legacy for our firm. The attention to detail is simply unparalleled in the industry."',
    '"Atelier didn''t just build a website; they constructed a digital legacy for our firm. The attention to detail is simply unparalleled in the industry."',
    'Alexander Thorne',
    'Alexander Thorne',
    'CEO, Thorne Capital',
    'CEO, Thorne Capital',
    'format_quote'
);

-- Seed data for home_quote_styles
INSERT INTO public.home_quote_styles (
    body_font_family_en, body_font_family_th, body_font_size, 
    body_color_light, body_color_dark,
    author_font_family_en, author_font_family_th, author_font_size,
    author_color_light, author_color_dark,
    role_font_family_en, role_font_family_th, role_font_size,
    role_color_light, role_color_dark,
    icon_color_light, icon_color_dark,
    section_bg_light, section_bg_dark
)
VALUES (
    'Space Grotesk, sans-serif', 'Space Grotesk, sans-serif', 24,
    '#ffffff', '#ffffff',
    'Space Grotesk, sans-serif', 'Space Grotesk, sans-serif', 14,
    '#ffffff', '#ffffff',
    'Space Grotesk, sans-serif', 'Space Grotesk, sans-serif', 12,
    '#a3a3a3', '#a3a3a3',
    'rgba(234, 88, 12, 0.3)', 'rgba(234, 88, 12, 0.3)',
    '#181411', '#181411'
);
