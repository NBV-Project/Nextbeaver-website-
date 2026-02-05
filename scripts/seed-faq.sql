create extension if not exists "pgcrypto";

create table if not exists faq_content (
  id uuid primary key default gen_random_uuid(),
  faq_key text unique not null,
  eyebrow text not null,
  eyebrow_th text,
  title text not null,
  title_th text,
  updated_at timestamptz default now()
);

create table if not exists faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  question_th text,
  answer text not null,
  answer_th text,
  order_index int not null default 0,
  updated_at timestamptz default now()
);

create index if not exists faq_items_order_idx on faq_items(order_index);

insert into faq_content (faq_key, eyebrow, eyebrow_th, title, title_th)
values ('default', 'FAQS', 'FAQS', 'Have Questions?', 'มีคำถามไหม?')
on conflict (faq_key) do update set
  eyebrow = excluded.eyebrow,
  eyebrow_th = excluded.eyebrow_th,
  title = excluded.title,
  title_th = excluded.title_th,
  updated_at = now();

insert into faq_items (id, question, question_th, answer, answer_th, order_index)
values (
  '1f2b8f3e-9a9a-4c3a-9b62-7f2f3a2f0a01',
  'Do you build custom websites and web apps?',
  'รับทำเว็บไซต์และเว็บแอปแบบสั่งทำไหม?',
  'Yes. We design and build custom websites, landing pages, and full web apps tailored to your goals, brand, and customer journey.',
  'รับครับ เราทำเว็บไซต์, แลนดิ้งเพจ และเว็บแอปแบบสั่งทำ ให้ตรงเป้าหมายธุรกิจ แบรนด์ และเส้นทางลูกค้า.',
  0
)
on conflict (id) do update set
  question = excluded.question,
  question_th = excluded.question_th,
  answer = excluded.answer,
  answer_th = excluded.answer_th,
  order_index = excluded.order_index,
  updated_at = now();

insert into faq_items (id, question, question_th, answer, answer_th, order_index)
values (
  '1f2b8f3e-9a9a-4c3a-9b62-7f2f3a2f0a02',
  'How much does a website cost in Thailand?',
  'ทำเว็บไซต์ราคาเท่าไหร่ในไทย?',
  'Pricing depends on scope and features. We start with a short discovery call and then send a clear, fixed proposal before work begins.',
  'ราคาขึ้นกับขอบเขตและฟีเจอร์ เราเริ่มจากคุยเพื่อเก็บรายละเอียด แล้วสรุปราคาแบบชัดเจนก่อนเริ่มงาน.',
  1
)
on conflict (id) do update set
  question = excluded.question,
  question_th = excluded.question_th,
  answer = excluded.answer,
  answer_th = excluded.answer_th,
  order_index = excluded.order_index,
  updated_at = now();

insert into faq_items (id, question, question_th, answer, answer_th, order_index)
values (
  '1f2b8f3e-9a9a-4c3a-9b62-7f2f3a2f0a03',
  'How long does it take to build a website?',
  'ทำเว็บไซต์ใช้เวลากี่วัน?',
  'Typical timelines are 2–6 weeks depending on complexity. We share a milestone plan so you know each step and delivery date.',
  'โดยทั่วไป 2–6 สัปดาห์ ขึ้นกับความซับซ้อน เราวางไทม์ไลน์เป็นขั้นตอนให้ชัดเจน พร้อมวันส่งมอบ.',
  2
)
on conflict (id) do update set
  question = excluded.question,
  question_th = excluded.question_th,
  answer = excluded.answer,
  answer_th = excluded.answer_th,
  order_index = excluded.order_index,
  updated_at = now();

insert into faq_items (id, question, question_th, answer, answer_th, order_index)
values (
  '1f2b8f3e-9a9a-4c3a-9b62-7f2f3a2f0a04',
  'Can you redesign or improve an existing website?',
  'รับปรับเว็บเดิมหรือย้ายเว็บจากที่อื่นไหม?',
  'Yes. We can redesign, optimize speed, and migrate your current site with minimal downtime.',
  'ได้ครับ เราปรับดีไซน์ เพิ่มความเร็ว และย้ายระบบให้ โดยลด downtime ให้น้อยที่สุด.',
  3
)
on conflict (id) do update set
  question = excluded.question,
  question_th = excluded.question_th,
  answer = excluded.answer,
  answer_th = excluded.answer_th,
  order_index = excluded.order_index,
  updated_at = now();

insert into faq_items (id, question, question_th, answer, answer_th, order_index)
values (
  '1f2b8f3e-9a9a-4c3a-9b62-7f2f3a2f0a05',
  'Do you provide SEO and performance optimization?',
  'มีทำ SEO และปรับความเร็วเว็บไหม?',
  'Yes. We build with SEO fundamentals and Core Web Vitals in mind, and can deliver performance audits on request.',
  'มีครับ เราทำตามหลัก SEO และ Core Web Vitals และสามารถทำรายงาน Performance เพิ่มได้.',
  4
)
on conflict (id) do update set
  question = excluded.question,
  question_th = excluded.question_th,
  answer = excluded.answer,
  answer_th = excluded.answer_th,
  order_index = excluded.order_index,
  updated_at = now();

insert into faq_items (id, question, question_th, answer, answer_th, order_index)
values (
  '1f2b8f3e-9a9a-4c3a-9b62-7f2f3a2f0a06',
  'Do you offer maintenance after launch?',
  'ส่งมอบแล้วมีดูแลต่อไหม?',
  'Yes. We offer maintenance, content updates, and improvement sprints based on your needs.',
  'มีครับ เรามีบริการดูแลระบบ อัปเดตคอนเทนต์ และปรับปรุงต่อเนื่องตามแพ็กเกจที่เหมาะกับคุณ.',
  5
)
on conflict (id) do update set
  question = excluded.question,
  question_th = excluded.question_th,
  answer = excluded.answer,
  answer_th = excluded.answer_th,
  order_index = excluded.order_index,
  updated_at = now();
