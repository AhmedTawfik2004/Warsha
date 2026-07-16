-- ════════════════════════════════════════════════════════════════
-- WARSHA — Initial database schema
-- Run this ONCE in Supabase: SQL Editor → New query → paste → Run
-- ════════════════════════════════════════════════════════════════

-- ─── Categories (mirrors CATEGORIES in lib/translations.ts) ──────
create table categories (
  id              text primary key,
  name_ar         text not null,
  name_en         text not null,
  icon            text not null,
  accent          text not null,
  description_ar  text not null,
  description_en  text not null
);

-- ─── Subcategories (the pills shown on each category page) ──────
create table subcategories (
  category_id text references categories(id) on delete cascade,
  id          text not null,
  name_ar     text not null,
  name_en     text not null,
  icon        text not null,
  primary key (category_id, id)
);

-- ─── Shops ────────────────────────────────────────────────────────
create table shops (
  id            bigint generated always as identity primary key,
  name          text not null,
  area_ar       text not null,
  area_en       text not null,
  category_id   text references categories(id) not null,
  subcategory_id text,
  rating        numeric(2,1) default 0,
  reviews       integer default 0,
  lat           double precision not null,
  lng           double precision not null,
  tags_ar       text[] default '{}',
  tags_en       text[] default '{}',
  whatsapp      text,
  created_at    timestamptz default now()
);

-- ─── Row Level Security: everything is publicly readable ─────────
-- (this is a public marketplace — anyone can browse without logging in)
alter table categories enable row level security;
create policy "Categories are publicly viewable" on categories for select using (true);

alter table subcategories enable row level security;
create policy "Subcategories are publicly viewable" on subcategories for select using (true);

alter table shops enable row level security;
create policy "Shops are publicly viewable" on shops for select using (true);


-- ════════════════════════════════════════════════════════════════
-- SEED DATA — the 9 categories
-- ════════════════════════════════════════════════════════════════

insert into categories (id, name_ar, name_en, icon, accent, description_ar, description_en) values
('mechanical',     'ميكانيكا',        'Mechanical',     '⚙️', '#E8730A', 'إصلاح المحرك، الفرامل، والتعليق',     'Engine, brakes, suspension & more'),
('interior',       'تشطيب داخلي',     'Interior',       '🪑', '#3B82F6', 'صوتيات، إضاءة، شاشات، ودركسيون',      'Audio, lighting, screens & more'),
('exterior',       'تشطيب خارجي',     'Exterior',       '✨', '#10B981', 'سبويلر، سبليتر، وبودي كيت',           'Spoilers, splitters & body kits'),
('performance',    'أداء وتيونينج',   'Performance',    '🏁', '#EF4444', 'تيونينج، شكمان، وبرمجة ECU',          'Tuning, exhaust & ECU programming'),
('diagnostics',    'دياجنوستيك',      'Diagnostics',    '💻', '#06B6D4', 'فحص كمبيوتر وأعطال السيارة',          'Computer diagnostics & fault codes'),
('tires',          'إطارات وجنوط',    'Tyres & Rims',   '🔄', '#F59E0B', 'تركيب، ضبط زوايا، وصبغ جنوط',         'Fitting, alignment & rim painting'),
('wrapping',       'تغليف',           'Wrapping',       '🎨', '#EC4899', 'رش، دوكو، وتغيير قطع الهيكل',         'Paint jobs & body panel replacement'),
('car_protection', 'حماية السيارة',   'Car protection', '🛡️', '#8B5CF6', 'سيراميك، تغليف حماية، وتظليل',        'Ceramic coating, PPF & tinting'),
('car_detailing',  'تنظيف وتلميع',    'Car detailing',  '🧽', '#14B8A6', 'غسيل، تلميع، وتنظيف داخلي',           'Wash, polish & interior cleaning');


-- ════════════════════════════════════════════════════════════════
-- SEED DATA — subcategories (the filter pills per category)
-- ════════════════════════════════════════════════════════════════

-- Mechanical
insert into subcategories (category_id, id, name_ar, name_en, icon) values
('mechanical', 'engine',       'المحرك',      'Engine',       '🔩'),
('mechanical', 'suspension',   'التعليق',     'Suspension',   '🌀'),
('mechanical', 'brakes',       'الفرامل',     'Brakes',       '🛑'),
('mechanical', 'transmission', 'ناقل الحركة', 'Transmission', '⚙️');

-- Interior
insert into subcategories (category_id, id, name_ar, name_en, icon) values
('interior', 'sound_system',   'نظام الصوت',  'Sound system',   '🔊'),
('interior', 'led_lighting',   'إضاءة LED',   'LED lighting',   '💡'),
('interior', 'steering_wheel', 'الدركسيون',   'Steering wheel', '🛞'),
('interior', 'screens',        'الشاشات',     'Screens',        '📱');

-- Exterior
insert into subcategories (category_id, id, name_ar, name_en, icon) values
('exterior', 'spoiler',    'سبويلر',      'Spoiler',     '🔺'),
('exterior', 'splitter',   'سبليتر',      'Splitter',    '➖'),
('exterior', 'side_skirt', 'سايد سكيرت', 'Side skirts', '▬'),
('exterior', 'body_kit',   'بودي كيت',   'Body kit',    '🧩');

-- Performance
insert into subcategories (category_id, id, name_ar, name_en, icon) values
('performance', 'tuning',      'تيونينج عام',     'General tuning',     '🎛️'),
('performance', 'air_intake',  'فلتر هواء رياضي', 'Air intake',         '💨'),
('performance', 'exhaust',     'الشكمان',         'Exhaust',            '🔥'),
('performance', 'ecu',         'برمجة ECU',       'ECU tuning',         '💻'),
('performance', 'spark_plugs', 'بوجيهات رياضية', 'Sport spark plugs', '⚡');

-- Tyres & Rims
insert into subcategories (category_id, id, name_ar, name_en, icon) values
('tires', 'tyre_fitting', 'تركيب إطارات', 'Tyre fitting',    '🛞'),
('tires', 'alignment',    'ضبط الزوايا',  'Wheel alignment', '📐'),
('tires', 'rim_painting',  'صبغ الجنوط',  'Rim painting',    '🎨'),
('tires', 'balancing',    'موازنة العجل', 'Wheel balancing', '⚖️');

-- Wrapping
insert into subcategories (category_id, id, name_ar, name_en, icon) values
('wrapping', 'paint_job', 'رش ودوكو', 'Paint job', '🎨'),
('wrapping', 'bumpers',   'الشنابر',  'Bumpers',   '🛡️'),
('wrapping', 'hood',      'الكبوت',   'Hood',      '🔼'),
('wrapping', 'doors',     'الأبواب',  'Doors',     '🚪');

-- Car protection
insert into subcategories (category_id, id, name_ar, name_en, icon) values
('car_protection', 'ceramic_coating', 'سيراميك',           'Ceramic coating',       '✨'),
('car_protection', 'ppf',             'تغليف حماية PPF',   'Paint protection film', '🎞️'),
('car_protection', 'window_tint',     'تظليل الزجاج',      'Window tinting',        '🕶️'),
('car_protection', 'undercoating',    'حماية تحت الشاسيه', 'Undercoating',          '🔧');

-- Car detailing
insert into subcategories (category_id, id, name_ar, name_en, icon) values
('car_detailing', 'exterior_wash',         'غسيل وتلميع خارجي', 'Exterior wash & polish', '🚿'),
('car_detailing', 'interior_cleaning',     'تنظيف داخلي عميق',  'Interior deep cleaning', '🧹'),
('car_detailing', 'engine_bay',            'تنظيف غرفة المحرك', 'Engine bay cleaning',    '🔧'),
('car_detailing', 'headlight_restoration', 'تجديد الكشافات',    'Headlight restoration',  '💡');


-- ════════════════════════════════════════════════════════════════
-- SEED DATA — first real shop: AutoLube Express, Sherouk City
-- (coordinates from Google Maps — update rating/reviews/whatsapp
--  once you have the shop's real numbers)
-- ════════════════════════════════════════════════════════════════

insert into shops (name, area_ar, area_en, category_id, subcategory_id, rating, reviews, lat, lng, tags_ar, tags_en, whatsapp)
values (
  'AutoLube Express',
  'مدينة الشروق', 'Sherouk City',
  'mechanical', 'engine',
  4.5, 12,
  30.1602077, 31.658392,
  array['تغيير زيت','زيوت وفلاتر'],
  array['Oil change','Oils & filters'],
  '+201000000000'
);
