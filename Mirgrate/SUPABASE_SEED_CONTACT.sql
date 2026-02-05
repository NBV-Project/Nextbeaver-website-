INSERT INTO contact_content (
  id,
  eyebrow, eyebrow_th,
  title_top, title_top_th,
  title_bottom, title_bottom_th,
  body, body_th,
  email_label, email_label_th,
  email,
  location_label, location_label_th,
  location, location_th
) VALUES (
  '00000000-0000-0000-0000-000000004001',
  'BEGIN THE DIALOGUE', 'BEGIN THE DIALOGUE',
  'READY TO ELEVATE', 'READY TO ELEVATE',
  'YOUR PRESENCE?', 'YOUR PRESENCE?',
  'We take on a limited number of clients each year to ensure undivided attention. Tell us about your vision.',
  'We take on a limited number of clients each year to ensure undivided attention. Tell us about your vision.',
  'Email Us', 'Email Us',
  'hello@atelier-studio.com',
  'Visit Us', 'Visit Us',
  'Zurich, Switzerland', 'Zurich, Switzerland'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO contact_form_content (
  id,
  name_label, name_label_th,
  name_placeholder, name_placeholder_th,
  company_label, company_label_th,
  company_placeholder, company_placeholder_th,
  email_label, email_label_th,
  email_placeholder, email_placeholder_th,
  details_label, details_label_th,
  details_placeholder, details_placeholder_th,
  submit_label, submit_label_th
) VALUES (
  '00000000-0000-0000-0000-000000004002',
  'Name', 'Name',
  'John Doe', 'John Doe',
  'Company', 'Company',
  'Acme Inc.', 'Acme Inc.',
  'Email', 'Email',
  'john@example.com', 'john@example.com',
  'Project Details', 'Project Details',
  'Tell us about your goals...', 'Tell us about your goals...',
  'Send Inquiry', 'Send Inquiry'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO contact_styles (
  id,
  -- Fonts (Defaulting to Manrope as main font, Montserrat as secondary based on Layout)
  eyebrow_font_family_en, eyebrow_font_family_th, eyebrow_font_size,
  title_font_family_en, title_font_family_th, title_font_size,
  body_font_family_en, body_font_family_th, body_font_size,
  label_font_family_en, label_font_family_th, label_font_size,
  info_font_family_en, info_font_family_th, info_font_size,
  form_label_font_family_en, form_label_font_family_th, form_label_font_size,
  input_font_family_en, input_font_family_th, input_font_size,
  button_font_family_en, button_font_family_th, button_font_size,
  
  -- Colors
  eyebrow_color_light, eyebrow_color_dark,
  title_color_light, title_color_dark,
  body_color_light, body_color_dark,
  label_color_light, label_color_dark,
  info_color_light, info_color_dark,
  icon_bg_light, icon_bg_dark,
  icon_color_light, icon_color_dark,
  
  form_bg_light, form_bg_dark,
  form_border_light, form_border_dark,
  form_label_color_light, form_label_color_dark,
  input_bg_light, input_bg_dark,
  input_border_light, input_border_dark,
  input_text_light, input_text_dark,
  input_placeholder_light, input_placeholder_dark,
  
  button_bg_light, button_bg_dark,
  button_text_light, button_text_dark
) VALUES (
  '00000000-0000-0000-0000-000000004003',
  -- Fonts
  'Manrope, sans-serif', 'Manrope, sans-serif', 14,
  'Manrope, sans-serif', 'Manrope, sans-serif', 48,
  'Manrope, sans-serif', 'Manrope, sans-serif', 16,
  'Manrope, sans-serif', 'Manrope, sans-serif', 12,
  'Manrope, sans-serif', 'Manrope, sans-serif', 16,
  'Manrope, sans-serif', 'Manrope, sans-serif', 12,
  'Manrope, sans-serif', 'Manrope, sans-serif', 16,
  'Manrope, sans-serif', 'Manrope, sans-serif', 16,
  
  -- Colors
  '#f98c1f', '#f98c1f', -- Eyebrow (Primary)
  '#181411', '#ffffff', -- Title
  '#525252', '#a3a3a3', -- Body (Accent Text)
  '#525252', '#a3a3a3', -- Label (Accent Text)
  '#181411', '#ffffff', -- Info Text
  'rgba(0,0,0,0.05)', 'rgba(255,255,255,0.05)', -- Icon BG
  '#f98c1f', '#f98c1f', -- Icon Color
  
  '#ffffff', 'rgba(255,255,255,0.05)', -- Form BG (White / White 5%)
  '#e5e5e5', 'rgba(255,255,255,0.1)', -- Form Border
  '#525252', '#a3a3a3', -- Form Label
  'transparent', 'transparent', -- Input BG
  '#e5e5e5', 'rgba(255,255,255,0.2)', -- Input Border
  '#181411', '#ffffff', -- Input Text
  'rgba(0,0,0,0.3)', 'rgba(255,255,255,0.2)', -- Input Placeholder
  
  '#f98c1f', '#f98c1f', -- Button BG
  '#181411', '#181411'  -- Button Text (Espresso)
) ON CONFLICT (id) DO NOTHING;

INSERT INTO floating_social_items (id, label, label_th, href, type, order_index, icon_svg)
VALUES
  (
    '00000000-0000-0000-0000-000000005001',
    'Facebook', 'Facebook', 'https://facebook.com/', 'facebook', 0,
    '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103.435.057.807.123 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z"/></svg>'
  ),
  (
    '00000000-0000-0000-0000-000000005002',
    'Line OA', 'Line OA', 'https://line.me/ti/p/', 'line', 1,
    '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>'
  ),
  (
    '00000000-0000-0000-0000-000000005003',
    'Instagram', 'Instagram', 'https://instagram.com/', 'instagram', 2,
    '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/></svg>'
  ),
  (
    '00000000-0000-0000-0000-000000005004',
    'Phone', 'Phone', 'tel:+66000000000', 'phone', 3,
    '<span class="material-icons">phone</span>'
  ),
  (
    '00000000-0000-0000-0000-000000005005',
    'Email', 'Email', 'mailto:hello@atelier-studio.com', 'mail', 4,
    '<span class="material-icons">mail</span>'
  )
ON CONFLICT (id) DO NOTHING;
