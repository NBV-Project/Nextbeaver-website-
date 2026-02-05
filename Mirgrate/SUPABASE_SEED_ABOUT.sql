INSERT INTO about_content (
  id,
  image_url,
  image_alt,
  image_alt_th,
  highlight_value,
  highlight_label,
  highlight_label_th,
  eyebrow,
  eyebrow_th,
  title,
  title_th,
  title_accent,
  title_accent_th
)
VALUES (
  '00000000-0000-0000-0000-000000010001',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBcQdri552OE-CBYjrNJ1U797SdJSSAdo2Tk-JxDEcOxsunXqtWiLLvInfzkjsGcwwgoOQNP4ykfLchAFwV39rDkhIl6P7KFCClxhNjcUxsM7XMIxc9OZEzNTIkmSI-lje4wy6hmaZ4NzM2eZ8xNVOdj3tF5Q1_KCGHuOjXPKMT6nMzIAzVKMIsDhsNDnjdht2wX8uDOYgtXRHRrPWv-ux6BgZuMQSFSKBaJOEv2YjrkUFElhE6uhis6rQaCwmylVw9FnoHlZPZFA7x',
  'Abstract architectural details in warm lighting',
  'รายละเอียดเชิงสถาปัตยกรรมในแสงโทนอุ่น',
  '10+',
  'ประสบการณ์\nคุณภาพ',
  'Years of\nExcellence',
  'ปรัชญาแห่งอเตอลิเยร์',
  'THE ATELIER PHILOSOPHY',
  'จุดตัดของ',
  'THE INTERSECTION OF',
  'ศิลป์และโค้ด',
  'ART AND CODE'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO about_styles (
  id,
  image_overlay_color_light,
  image_overlay_color_dark,
  highlight_bg_color_light,
  highlight_bg_color_dark,
  highlight_value_color_light,
  highlight_value_color_dark,
  highlight_label_color_light,
  highlight_label_color_dark,
  highlight_value_font_family_en,
  highlight_value_font_family_th,
  highlight_value_font_size,
  highlight_label_font_family_en,
  highlight_label_font_family_th,
  highlight_label_font_size,
  eyebrow_color_light,
  eyebrow_color_dark,
  eyebrow_font_family_en,
  eyebrow_font_family_th,
  eyebrow_font_size,
  title_color_light,
  title_color_dark,
  title_font_family_en,
  title_font_family_th,
  title_font_size,
  title_accent_color_light,
  title_accent_color_dark,
  title_accent_font_family_en,
  title_accent_font_family_th,
  title_accent_font_size,
  body_color_light,
  body_color_dark,
  body_font_family_en,
  body_font_family_th,
  body_font_size,
  pillar_title_color_light,
  pillar_title_color_dark,
  pillar_title_font_family_en,
  pillar_title_font_family_th,
  pillar_title_font_size,
  pillar_body_color_light,
  pillar_body_color_dark,
  pillar_body_font_family_en,
  pillar_body_font_family_th,
  pillar_body_font_size
)
VALUES (
  '00000000-0000-0000-0000-000000010002',
  'rgba(242, 127, 13, 0.2)',
  'rgba(242, 127, 13, 0.2)',
  '#181411',
  '#181411',
  '#f27f0d',
  '#f27f0d',
  '#ffffff',
  '#ffffff',
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  32,
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  12,
  '#f27f0d',
  '#f27f0d',
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  12,
  '#1b140f',
  '#ffffff',
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  48,
  '#6b5d52',
  '#baab9c',
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  48,
  '#6b5d52',
  '#baab9c',
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  18,
  '#1b140f',
  '#ffffff',
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  18,
  '#6b5d52',
  '#baab9c',
  'Space Grotesk, sans-serif',
  'Space Grotesk, sans-serif',
  14
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO about_body (id, text, text_th, order_index)
VALUES
  (
    '00000000-0000-0000-0000-000000010101',
    'ในโลกดิจิทัลที่เต็มไปด้วยเทมเพลตสำเร็จรูป เราเลือกตัดเย็บให้พอดีตัว ทุกบรรทัดของโค้ดคือรอยเย็บ ทุกพิกเซลคือการตัดสินใจอย่างตั้งใจในผืนผ้าของอัตลักษณ์แบรนด์ของคุณ',
    'In a digital landscape cluttered with templates, we choose to tailor. Every line of code is a stitch, every pixel a deliberate choice in the fabric of your brand''s digital identity.',
    0
  ),
  (
    '00000000-0000-0000-0000-000000010102',
    'แนวทางของเราไม่ได้เน้นแค่การใช้งาน แต่ต้องสื่ออารมณ์ เราสร้างแพลตฟอร์มที่ไม่ได้เพียงรองรับคอนเทนต์ แต่ยกระดับมัน ให้ธุรกิจของคุณยืนอยู่ในตำแหน่งที่คู่ควร',
    'Our approach is not merely functional; it is emotional. We build platforms that don''t just host content but elevate it, creating environments where your enterprise commands the authority it deserves.',
    1
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO about_pillars (id, title, title_th, body, body_th, order_index)
VALUES
  (
    '00000000-0000-0000-0000-000000010201',
    'เริ่มจากกลยุทธ์',
    'Strategy First',
    'เราวิเคราะห์ก่อนออกแบบ เพื่อให้ทุกพิกเซลมีเป้าหมายทางธุรกิจที่ชัดเจน',
    'We diagnose before we design, ensuring every pixel serves a business purpose.',
    0
  ),
  (
    '00000000-0000-0000-0000-000000010202',
    'พิถีพิถันระดับพิกเซล',
    'Pixel Precision',
    'ใส่ใจรายละเอียดในโมชั่น ตัวอักษร และปฏิสัมพันธ์ทุกจุด',
    'Obsessive attention to detail in motion, typography, and interaction.',
    1
  )
ON CONFLICT (id) DO NOTHING;
