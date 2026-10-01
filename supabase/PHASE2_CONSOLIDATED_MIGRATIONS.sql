

-- ====================================================================
-- FILE: 00004_service_store.sql
-- ====================================================================

-- ============================================================================
-- 00004_service_store.sql: Unified Service Store, Orders, Subscriptions & Documents
-- ============================================================================

-- 1. Service Catalog & Variants
create table if not exists public.service_catalog (
  id text primary key,
  slug text not null unique,
  title_en text not null,
  title_lus text not null,
  category text not null check (category in ('domains', 'google_seo', 'mobile_apps', 'data_storage', 'ai')),
  description_en text not null,
  description_lus text not null,
  one_line_benefit_en text not null,
  one_line_benefit_lus text not null,
  details_markdown_en text,
  details_markdown_lus text,
  deliverables jsonb default '[]'::jsonb,
  required_documents jsonb default '[]'::jsonb,
  eta_min_days integer not null default 1,
  eta_max_days integer not null default 5,
  eta_note text,
  is_recurring boolean default false,
  recurring_interval text check (recurring_interval in ('yearly', 'monthly', null)),
  cancel_refund_rule text default 'Full refund minus gateway fee before work starts; non-refundable once started.',
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table if not exists public.service_variants (
  id text primary key,
  service_id text not null references public.service_catalog(id) on delete cascade,
  name text not null,
  code text not null,
  pass_through_cost_inr numeric(12,2) default 0,
  is_default boolean default false
);

create table if not exists public.service_prices (
  id uuid primary key default gen_random_uuid(),
  service_id text not null references public.service_catalog(id) on delete cascade,
  variant_id text references public.service_variants(id) on delete cascade,
  plan_id text not null check (plan_id in ('basic', 'essential', 'pro', 'ultimate')),
  price_type text not null check (price_type in ('free', 'fixed', 'work_fee_plus_actual')),
  amount_inr numeric(12,2) default 0,
  discount_pct numeric(5,2) default 0,
  unique (service_id, variant_id, plan_id)
);

create table if not exists public.service_bundles (
  id text primary key,
  name text not null,
  description text not null,
  bundle_service_ids jsonb not null, -- e.g. ["google_submit", "maps_register"]
  bundle_price_inr numeric(12,2) not null,
  is_active boolean default true
);

-- 2. Platform Holidays & Settings
create table if not exists public.holidays (
  id uuid primary key default gen_random_uuid(),
  holiday_date date not null unique,
  name text not null,
  is_national boolean default true
);

create table if not exists public.platform_settings (
  id text primary key default 'default',
  require_prepayment boolean default true,
  working_days_per_week integer default 5,
  gst_enabled boolean default false,
  gst_rate_pct numeric(5,2) default 18.00,
  gstin text,
  terms_version text default 'v2.1',
  updated_at timestamptz default now()
);

insert into public.platform_settings (id, require_prepayment, working_days_per_week, gst_enabled, terms_version)
values ('default', true, 5, false, 'v2.1')
on conflict (id) do nothing;

-- 3. Service Orders & Items
create table if not exists public.service_orders (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  order_number text not null unique,
  status text not null check (status in ('awaiting_payment', 'paid', 'cancelled', 'refunded')) default 'awaiting_payment',
  subtotal_inr numeric(12,2) not null,
  discount_inr numeric(12,2) default 0,
  tax_inr numeric(12,2) default 0,
  total_amount_inr numeric(12,2) not null,
  payment_status text not null default 'pending',
  payment_id text,
  payment_gateway text default 'razorpay_platform',
  terms_accepted_at timestamptz,
  terms_ip_hash text,
  terms_version text,
  created_at timestamptz default now()
);

create index if not exists idx_service_orders_tenant on public.service_orders(tenant_id);

create table if not exists public.service_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.service_orders(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  service_id text not null references public.service_catalog(id),
  variant_id text references public.service_variants(id),
  service_title text not null,
  price_inr numeric(12,2) not null,
  recurring_inr numeric(12,2) default 0,
  status text not null check (status in (
    'awaiting_payment',
    'awaiting_documents',
    'documents_under_review',
    'in_progress',
    'awaiting_school_action',
    'completed',
    'rejected',
    'cancelled',
    'refunded'
  )) default 'awaiting_payment',
  clock_started_at timestamptz,
  eta_working_days integer not null default 3,
  expected_completion_date date,
  is_delayed boolean default false,
  assigned_to text,
  notes text,
  fulfillment_data jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create index if not exists idx_service_order_items_tenant on public.service_order_items(tenant_id);

create table if not exists public.service_item_documents (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.service_order_items(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  document_key text not null,
  label text not null,
  file_name text not null,
  file_size_bytes bigint,
  mime_type text,
  storage_path text not null,
  status text not null check (status in ('pending', 'under_review', 'approved', 'rejected')) default 'under_review',
  rejection_reason text,
  uploaded_at timestamptz default now(),
  reviewed_at timestamptz,
  reviewed_by text
);

create index if not exists idx_service_item_docs_item on public.service_item_documents(item_id);

create table if not exists public.service_item_events (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.service_order_items(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  event_type text not null,
  title text not null,
  description text,
  created_at timestamptz default now(),
  created_by text
);

create index if not exists idx_service_item_events_item on public.service_item_events(item_id);

create table if not exists public.service_subscriptions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  service_id text not null references public.service_catalog(id),
  item_id uuid references public.service_order_items(id),
  billing_cycle text not null check (billing_cycle in ('yearly', 'monthly')),
  amount_inr numeric(12,2) not null,
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz not null,
  renewal_status text not null check (renewal_status in ('auto_renew', 'manual_invoice', 'grace_period', 'cancelled')) default 'auto_renew',
  next_reminder_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_service_subscriptions_tenant on public.service_subscriptions(tenant_id);

-- 4. Enable RLS on all Service Store tables
alter table public.service_catalog enable row level security;
alter table public.service_variants enable row level security;
alter table public.service_prices enable row level security;
alter table public.service_bundles enable row level security;
alter table public.holidays enable row level security;
alter table public.platform_settings enable row level security;
alter table public.service_orders enable row level security;
alter table public.service_order_items enable row level security;
alter table public.service_item_documents enable row level security;
alter table public.service_item_events enable row level security;
alter table public.service_subscriptions enable row level security;

-- Public read for catalog, variants, prices, bundles
create policy "Catalog read for all authenticated users"
  on public.service_catalog for select using (true);

create policy "Variants read for all"
  on public.service_variants for select using (true);

create policy "Prices read for all"
  on public.service_prices for select using (true);

create policy "Bundles read for all"
  on public.service_bundles for select using (true);

create policy "Holidays read for all"
  on public.holidays for select using (true);

create policy "Platform settings read for all"
  on public.platform_settings for select using (true);

-- Tenant RLS Policies
create policy "Tenant orders isolation"
  on public.service_orders for all using (
    tenant_id = (select private.current_tenant_id()) or (select private.is_platform_owner())
  );

create policy "Tenant order items isolation"
  on public.service_order_items for all using (
    tenant_id = (select private.current_tenant_id()) or (select private.is_platform_owner())
  );

create policy "Tenant documents isolation"
  on public.service_item_documents for all using (
    tenant_id = (select private.current_tenant_id()) or (select private.is_platform_owner())
  );

create policy "Tenant events isolation"
  on public.service_item_events for all using (
    tenant_id = (select private.current_tenant_id()) or (select private.is_platform_owner())
  );

create policy "Tenant subscriptions isolation"
  on public.service_subscriptions for all using (
    tenant_id = (select private.current_tenant_id()) or (select private.is_platform_owner())
  );


-- ====================================================================
-- FILE: 00005_service_store_seed.sql
-- ====================================================================

-- ============================================================================
-- 00005_service_store_seed.sql: Seed Service Catalog, Prices & Initial Orders
-- ============================================================================

-- 1. Insert Service Catalog
insert into public.service_catalog (
  id, slug, title_en, title_lus, category,
  description_en, description_lus,
  one_line_benefit_en, one_line_benefit_lus,
  eta_min_days, eta_max_days, eta_note,
  is_recurring, recurring_interval, display_order
) values
(
  'domain_connect', 'domain-connect',
  'Own Domain Connect', 'Mahni Domain Thlunzawmna',
  'domains',
  'Point your existing school domain (e.g. www.yourschool.com) through Cloudflare for SaaS with automated SSL.',
  'I sikul domain neihsa (www.yourschool.com) chu Cloudflare for SaaS hmangin awlsam takin thlunzawm rawh.',
  'Connect your existing domain for free with instant SSL certificates',
  'I domain neihsa awlsam takin a thlawna thlunzawm theih e',
  0, 1, 'Instant upon correct DNS record addition',
  false, null, 1
),
(
  'domain_register_standard', 'domain-register-standard',
  'Domain Registration (.in / .com / .org)', 'Domain Tharlam Zawnna (.in / .com / .org)',
  'domains',
  'Professional registrar search, purchase, DNS configuration, and ownership verification for .in, .com, or .org domains.',
  'I sikul pualin .in, .com, a nih loh pawhin .org domain kan zawn sak ang che a, kan buaipui vek ang.',
  'Official high-credibility web address registered and managed for your school',
  'I sikul hming dik tak pu domain tharlam rang takin kan siamsak ang che',
  3, 5, 'Subject to registry availability and instant registrar confirmation',
  false, null, 2
),
(
  'domain_register_school', 'domain-register-school',
  'Specialist .school Domain Registration', 'Specialist .school Domain Buaipuina',
  'domains',
  'Premium official education TLD (.school) directly identifying your institution as an educational entity.',
  'Sikul pual bik .school domain hming tha tak kan zawn sak ang che.',
  'Memorable institutional identity with a dedicated .school domain extension',
  'Sikul pual bik liau liau .school domain changtlung tak',
  3, 5, 'Immediate registration upon payment clearance',
  false, null, 3
),
(
  'domain_register_edu_in', 'domain-register-edu-in',
  'Official .edu.in / .ac.in Government Registration', 'Sawrkar Hriatpui .edu.in / .ac.in Domain Buaipuina',
  'domains',
  'Accredited educational domain registration governed by ERNET India / Ministry of IT. We prepare, submit, and verify all institutional credentials.',
  'ERNET India hnuaia sikul domain official (.edu.in/.ac.in) lakna lehkha pawimawh zawng zawng kan buaipui sak ang che.',
  'Official recognized government institutional domain giving maximum trust',
  'Sawrkar hriatpui institution domain rintlak ber',
  7, 15, 'Depends on ERNET India verification processing turnaround',
  false, null, 4
),
(
  'domain_renewal', 'domain-renewal',
  'Domain Annual Renewal Service', 'Domain Kumtin Tharthawhna',
  'domains',
  'Continuous domain protection preventing expiration, registry redemption, or hijacking with automated renewal reminders.',
  'I domain a thih loh nan kum tin tharthawhna le venhimna.',
  'Never lose your school web address with automated renewal protection',
  'I sikul website domain a boral loh nan tharthawh ziah a ni',
  1, 2, 'Automated reminder-driven dispatch at 60/30/15/7 days',
  true, 'yearly', 5
),
(
  'google_submit', 'google-submit',
  'Google Search Console & Sitemap Indexation', 'Google Search Console & Sitemap Buaipuina',
  'google_seo',
  'Manual verification with Google Search Console, sitemap.xml submission, and priority crawl requests for all pages.',
  'Google-ah i sikul website awlsam taka an hmuh theih nan Search Console kan buaipui sak ang che.',
  'Get your school website indexed and discoverable on Google searches',
  'Google zawnnaah i sikul a lan hmasak theih nan buaipui a ni',
  3, 14, 'Google indexation timelines vary by search algorithm update cycle',
  false, null, 6
),
(
  'maps_register', 'maps-register',
  'Google Maps Location Register & Claim', 'Google Maps Hmunhma Zawnchhuahna & Dah luh',
  'google_seo',
  'Establish your official Google Business Profile on Google Maps with campus photos, verified coordinates, and phone contacts.',
  'Google Maps-ah i sikul campus hmun dik tak dah a, hriat awlsam tura buaipui.',
  'Pinpoint campus location on Google Maps for parents and visitors',
  'Nu leh pa ten awlsam taka sikul hmun an hmuh theih nan Google Maps-ah dah a ni',
  5, 14, 'Subject to Google postcard or video verification turnaround',
  false, null, 7
),
(
  'seo_bundle', 'seo-bundle',
  'Google Presence & Local SEO Bundle', 'Google Presence & Local SEO Bundle',
  'google_seo',
  'Combined Search Console indexation, Google Maps verified pin, OpenGraph social cards, and Schema.org metadata.',
  'Search Console leh Google Maps buaipui kawpna package tha ber.',
  'All-in-one search engine presence and local school map verification',
  'Google-ah kimchang takin i sikul hriat theihin a awm nghal vek',
  5, 14, 'Complete delivery of Search Console + Maps deliverables',
  false, null, 8
),
(
  'android_app', 'android-app',
  'Android App Publish to Google Play Store', 'Android App Google Play Store-a Dahna',
  'mobile_apps',
  'Dedicated white-label Android APK & AAB app compiled with your school logo, name, and published to Google Play.',
  'I sikul hming leh logo pu Android App siam a, Google Play Store-a dah chhuahna.',
  'Parents download your school app directly from the Google Play Store',
  'Nu leh pa ten Play Store atangin i sikul app an download thei nghal ang',
  7, 21, 'Includes Google Play Console review and policy verification',
  false, null, 9
),
(
  'ios_app', 'ios-app',
  'iOS App Publish to Apple App Store', 'iOS App Apple App Store-a Dahna',
  'mobile_apps',
  'Native iOS build with school branding, App Store screenshots, privacy nutrition labels, and submission to Apple.',
  'Apple iPhone hman thei tur App Store-a i sikul app dahna.',
  'Official native Apple App Store presence for iPhone and iPad users',
  'iPhone hmangtute tana Apple App Store-a sikul app awm theihna',
  7, 21, 'Includes Apple App Review Team inspection and resolution',
  false, null, 10
),
(
  'app_maintenance', 'app-maintenance',
  'Mobile App Annual Store Maintenance', 'Mobile App Kumtin Enkawlna',
  'mobile_apps',
  'Continuous Google Play / Apple App Store compliance, target SDK updates, bug fixes, and OTA releases.',
  'App thar apiang update ziahna leh buaipui rengna.',
  'Keep your store listings active and compliant with changing store policies',
  'Kum tin store policy thar zela app enkawl zui zelna',
  1, 2, 'Annual store SDK upgrades and push notification certificate renewals',
  true, 'yearly', 11
),
(
  'data_migration', 'data-migration',
  'Data Migration & Excel Cleanup Service', 'Data Lakluh & Excel Buaipuina',
  'data_storage',
  'Our engineering team audits, reformats, and imports your historical student, guardian, staff, and fee records.',
  'I zirlai leh zirtirtu data hmasate fel taka kan lakluh sak ang che.',
  'Hassle-free migration of existing spreadsheets with zero data loss',
  'Excel hlui atanga fel fai taka data lakluh sak vekna',
  2, 5, 'Depends on volume and formatting readiness of source spreadsheets',
  false, null, 12
),
(
  'extra_storage_10gb', 'extra-storage-10gb',
  'Extra Cloud Storage (10 GB Tier)', 'Cloud Storage Belhna (10 GB)',
  'data_storage',
  'Additional high-speed Cloudflare R2 private document and gallery storage for high-resolution photo archives.',
  'Lehkha pawimawh leh thlalak tam zawk dahna tur 10 GB belhna.',
  'Expand your document and high-resolution photo upload capacity',
  'Thlalak leh document tam zawk dah theihna tur storage belhna',
  0, 0, 'Instant activation upon payment',
  true, 'monthly', 13
),
(
  'ai_credit_pack', 'ai-credit-pack',
  'AI Copilot Message Credit Pack (5,000 Messages)', 'AI Copilot Message Credit Belhna',
  'ai',
  'Top up your school monthly AI message quota with 5,000 extra Claude-powered queries and drafting operations.',
  'AI Copilot hman belhna tur message credit 5,000 belhna.',
  'Boost your staff administrative automation and drafting speed',
  'Hna awlsam taka thawh zung zung theih nan AI credit belhna',
  0, 0, 'Instant credit allocation to tenant account',
  false, null, 14
)
on conflict (id) do update set
  title_en = excluded.title_en,
  title_lus = excluded.title_lus,
  description_en = excluded.description_en,
  description_lus = excluded.description_lus,
  one_line_benefit_en = excluded.one_line_benefit_en,
  one_line_benefit_lus = excluded.one_line_benefit_lus,
  eta_min_days = excluded.eta_min_days,
  eta_max_days = excluded.eta_max_days,
  eta_note = excluded.eta_note;

-- 2. Insert Required Documents metadata for services
update public.service_catalog set required_documents = '[
  {"key": "recognition_certificate", "label_en": "School Recognition / Affiliation Certificate", "label_lus": "Sikul Hriatpuina Certificate", "types": ["pdf", "jpg", "png"], "max_mb": 10, "required": true},
  {"key": "authorisation_letter", "label_en": "Authorisation Letter on Official School Letterhead", "label_lus": "Sikul Letterhead-a Nemnghehna Lehkha", "types": ["pdf", "docx"], "max_mb": 5, "required": true, "has_template": true},
  {"key": "address_proof", "label_en": "Institution Campus Address Proof (Electricity Bill / Lease)", "label_lus": "Campus Hmunhmang Nemnghehna", "types": ["pdf", "jpg"], "max_mb": 5, "required": true},
  {"key": "govt_order", "label_en": "Government Gazette Order / Board Affiliation Order", "label_lus": "Sawrkar Gazette Order / Affiliation Copy", "types": ["pdf"], "max_mb": 10, "required": true}
]'::jsonb where id = 'domain_register_edu_in';

update public.service_catalog set required_documents = '[
  {"key": "publisher_authorisation_letter", "label_en": "Play Store Publisher Authorisation Letter", "label_lus": "Play Store Publisher Authorisation Lehkha", "types": ["pdf", "docx"], "max_mb": 5, "required": true, "has_template": true},
  {"key": "school_id_proof", "label_en": "Principal / Administrator Photo ID Proof", "label_lus": "Principal ID Card / Aadhaar", "types": ["pdf", "jpg", "png"], "max_mb": 5, "required": true},
  {"key": "app_icon_graphic", "label_en": "High-Res School Crest / Logo (512x512 PNG)", "label_lus": "Sikul Logo Fiah Tha (512x512 PNG)", "types": ["png"], "max_mb": 5, "required": true}
]'::jsonb where id in ('android_app', 'ios_app');

-- 3. Seed Pricing Across 4 Plans (Basic, Essential, Pro, Ultimate)
-- Note: format is (service_id, plan_id, price_type, amount_inr)
insert into public.service_prices (service_id, plan_id, price_type, amount_inr) values
-- domain_connect (Free for all)
('domain_connect', 'basic', 'free', 0),
('domain_connect', 'essential', 'free', 0),
('domain_connect', 'pro', 'free', 0),
('domain_connect', 'ultimate', 'free', 0),

-- domain_register_standard (5000 / 5000 / 3000 / 2000)
('domain_register_standard', 'basic', 'work_fee_plus_actual', 5000),
('domain_register_standard', 'essential', 'work_fee_plus_actual', 5000),
('domain_register_standard', 'pro', 'work_fee_plus_actual', 3000),
('domain_register_standard', 'ultimate', 'work_fee_plus_actual', 2000),

-- domain_register_school
('domain_register_school', 'basic', 'work_fee_plus_actual', 5000),
('domain_register_school', 'essential', 'work_fee_plus_actual', 5000),
('domain_register_school', 'pro', 'work_fee_plus_actual', 3000),
('domain_register_school', 'ultimate', 'work_fee_plus_actual', 2000),

-- domain_register_edu_in
('domain_register_edu_in', 'basic', 'work_fee_plus_actual', 5000),
('domain_register_edu_in', 'essential', 'work_fee_plus_actual', 5000),
('domain_register_edu_in', 'pro', 'work_fee_plus_actual', 3000),
('domain_register_edu_in', 'ultimate', 'work_fee_plus_actual', 2000),

-- domain_renewal
('domain_renewal', 'basic', 'fixed', 400),
('domain_renewal', 'essential', 'fixed', 400),
('domain_renewal', 'pro', 'fixed', 400),
('domain_renewal', 'ultimate', 'fixed', 400),

-- google_submit (1000 / 1000 / Free / Free)
('google_submit', 'basic', 'fixed', 1000),
('google_submit', 'essential', 'fixed', 1000),
('google_submit', 'pro', 'free', 0),
('google_submit', 'ultimate', 'free', 0),

-- maps_register (500 / 500 / Free / Free)
('maps_register', 'basic', 'fixed', 500),
('maps_register', 'essential', 'fixed', 500),
('maps_register', 'pro', 'free', 0),
('maps_register', 'ultimate', 'free', 0),

-- seo_bundle (1200 / 1200 / Free / Free)
('seo_bundle', 'basic', 'fixed', 1200),
('seo_bundle', 'essential', 'fixed', 1200),
('seo_bundle', 'pro', 'free', 0),
('seo_bundle', 'ultimate', 'free', 0),

-- android_app (10000 / 10000 / 7000 / 5000)
('android_app', 'basic', 'fixed', 10000),
('android_app', 'essential', 'fixed', 10000),
('android_app', 'pro', 'fixed', 7000),
('android_app', 'ultimate', 'fixed', 5000),

-- ios_app (18000 / 18000 / 13000 / 9000)
('ios_app', 'basic', 'fixed', 18000),
('ios_app', 'essential', 'fixed', 18000),
('ios_app', 'pro', 'fixed', 13000),
('ios_app', 'ultimate', 'fixed', 9000),

-- app_maintenance (4000 / 4000 / 3000 / 2000)
('app_maintenance', 'basic', 'fixed', 4000),
('app_maintenance', 'essential', 'fixed', 4000),
('app_maintenance', 'pro', 'fixed', 3000),
('app_maintenance', 'ultimate', 'fixed', 2000),

-- data_migration (3000 / 3000 / 2000 / Free)
('data_migration', 'basic', 'fixed', 3000),
('data_migration', 'essential', 'fixed', 3000),
('data_migration', 'pro', 'fixed', 2000),
('data_migration', 'ultimate', 'free', 0),

-- extra_storage_10gb (200 for all)
('extra_storage_10gb', 'basic', 'fixed', 200),
('extra_storage_10gb', 'essential', 'fixed', 200),
('extra_storage_10gb', 'pro', 'fixed', 200),
('extra_storage_10gb', 'ultimate', 'fixed', 200),

-- ai_credit_pack
('ai_credit_pack', 'basic', 'fixed', 1500),
('ai_credit_pack', 'essential', 'fixed', 1500),
('ai_credit_pack', 'pro', 'fixed', 1500),
('ai_credit_pack', 'ultimate', 'fixed', 1500)
on conflict (service_id, variant_id, plan_id) do update set
  price_type = excluded.price_type,
  amount_inr = excluded.amount_inr;


-- ====================================================================
-- FILE: 00006_data_hub_and_staff.sql
-- ====================================================================

-- ============================================================================
-- 00006_data_hub_and_staff.sql: Master Data Hub, Staff Module & Import Tracking
-- ============================================================================

-- 1. Staff Master Records Table
create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id text not null,
  full_name text not null,
  gender text check (gender in ('male', 'female', 'other')),
  dob date,
  photo_url text,
  designation text not null,
  department text default 'Teaching',
  employment_type text check (employment_type in ('full_time', 'part_time', 'contractual', 'guest')) default 'full_time',
  qualification text,
  experience_years numeric(4,1) default 0,
  joining_date date default current_date,
  phone text,
  email text,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  id_document_type text, -- e.g. 'Aadhaar', 'PAN', 'Voter ID'
  id_document_number text,
  subjects_taught jsonb default '[]'::jsonb, -- e.g. ["Mathematics", "Physics"]
  classes_assigned jsonb default '[]'::jsonb, -- e.g. ["Class IX-A", "Class X-B"]
  class_teacher_of text, -- e.g. "Class X-A"
  show_on_website boolean default false,
  website_bio text,
  status text check (status in ('active', 'on_leave', 'resigned', 'terminated')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (tenant_id, employee_id)
);

create index if not exists idx_staff_profiles_tenant on public.staff_profiles(tenant_id);
create index if not exists idx_staff_profiles_emp_id on public.staff_profiles(tenant_id, employee_id);

-- 2. Import Batches Table
create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  batch_number text not null unique,
  entity_type text not null check (entity_type in ('students', 'guardians', 'staff', 'subjects', 'opening_balances')),
  mode text not null check (mode in ('create_only', 'update_only', 'upsert')),
  file_name text not null,
  total_rows integer not null default 0,
  created_count integer not null default 0,
  updated_count integer not null default 0,
  skipped_count integer not null default 0,
  error_count integer not null default 0,
  status text not null check (status in ('pending', 'validating', 'dry_run_success', 'completed', 'rolled_back', 'failed')) default 'pending',
  snapshot_data jsonb default '{}'::jsonb, -- records previous states for undo/rollback
  created_by text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create index if not exists idx_import_batches_tenant on public.import_batches(tenant_id);

-- 3. Import Errors Diagnostics Table
create table if not exists public.import_errors (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.import_batches(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  row_number integer not null,
  field_name text,
  value_provided text,
  error_type text not null, -- e.g. 'duplicate_key', 'invalid_date', 'required_missing'
  error_message text not null,
  created_at timestamptz default now()
);

create index if not exists idx_import_errors_batch on public.import_errors(batch_id);

-- 4. Enable Row Level Security
alter table public.staff_profiles enable row level security;
alter table public.import_batches enable row level security;
alter table public.import_errors enable row level security;

-- 5. Tenant RLS Policies
create policy "Tenant staff profiles isolation"
  on public.staff_profiles for all using (
    tenant_id = (select private.current_tenant_id()) or (select private.is_platform_owner())
  );

create policy "Tenant import batches isolation"
  on public.import_batches for all using (
    tenant_id = (select private.current_tenant_id()) or (select private.is_platform_owner())
  );

create policy "Tenant import errors isolation"
  on public.import_errors for all using (
    tenant_id = (select private.current_tenant_id()) or (select private.is_platform_owner())
  );

-- 6. Trigger: Sync staff_profiles with public.faculty when show_on_website = true
create or replace function public.sync_staff_to_faculty()
returns trigger as $$
begin
  if new.show_on_website = true and new.status = 'active' then
    insert into public.faculty (
      tenant_id,
      name,
      designation,
      qualification,
      photo_url,
      bio,
      is_active
    ) values (
      new.tenant_id,
      new.full_name,
      new.designation,
      new.qualification,
      new.photo_url,
      coalesce(new.website_bio, new.designation || ' at ' || (select name from public.tenants where id = new.tenant_id)),
      true
    )
    on conflict do nothing;
  else
    -- If toggled off or inactive, deactivate faculty record
    update public.faculty
    set is_active = false
    where tenant_id = new.tenant_id and name = new.full_name;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_sync_staff_faculty on public.staff_profiles;
create trigger trg_sync_staff_faculty
after insert or update on public.staff_profiles
for each row execute function public.sync_staff_to_faculty();


-- ====================================================================
-- FILE: 00007_data_hub_and_staff_seed.sql
-- ====================================================================

-- ============================================================================
-- 00007_data_hub_and_staff_seed.sql: Seed Staff Profiles & Sample Import Batches
-- ============================================================================

-- 1. Seed Staff Profiles for Mount Carmel
insert into public.staff_profiles (
  tenant_id, employee_id, full_name, gender, dob, designation, department,
  employment_type, qualification, experience_years, joining_date, phone, email,
  subjects_taught, classes_assigned, class_teacher_of, show_on_website, website_bio, status
) values
(
  '00000000-0000-0000-0000-000000000001',
  'EMP-MC-001',
  'Rev. Dr. Lalthansanga',
  'male',
  '1972-04-15',
  'Principal',
  'Administration',
  'full_time',
  'Ph.D. Education, M.Sc. Physics, B.Ed.',
  24.5,
  '2010-06-01',
  '+91 98621 55667',
  'principal@mountcarmel.edu.in',
  '["Physics", "Moral Science"]'::jsonb,
  '["Class XII-A", "Class XII-B"]'::jsonb,
  null,
  true,
  'Over 24 years of educational leadership serving the youth of Mizoram.',
  'active'
),
(
  '00000000-0000-0000-0000-000000000001',
  'EMP-MC-002',
  'Mrs. Lalnunmawii Sailo',
  'female',
  '1985-09-22',
  'Senior Mathematics Teacher',
  'Mathematics',
  'full_time',
  'M.Sc. Mathematics, B.Ed.',
  14.0,
  '2014-07-15',
  '+91 94361 77889',
  'lalnunmawii.s@mountcarmel.edu.in',
  '["Mathematics", "Higher Mathematics"]'::jsonb,
  '["Class X-A", "Class XI-A"]'::jsonb,
  'Class X-A',
  true,
  'Passionate mathematics educator focused on Olympiad preparation.',
  'active'
),
(
  '00000000-0000-0000-0000-000000000001',
  'EMP-MC-003',
  'Mr. C. Lalremruata',
  'male',
  '1988-11-05',
  'PGT Chemistry & Science HOD',
  'Science',
  'full_time',
  'M.Sc. Chemistry, B.Ed., CSIR-NET',
  11.5,
  '2017-03-01',
  '+91 98623 11223',
  'remruata.c@mountcarmel.edu.in',
  '["Chemistry", "General Science"]'::jsonb,
  '["Class IX-B", "Class X-B", "Class XII-A"]'::jsonb,
  'Class XII-A',
  true,
  'Head of Science Department directing hands-on laboratory discovery.',
  'active'
),
(
  '00000000-0000-0000-0000-000000000001',
  'EMP-MC-004',
  'Ms. Zothanpuii',
  'female',
  '1992-02-18',
  'TGT English & Literature',
  'Humanities',
  'full_time',
  'M.A. English Literature, B.Ed.',
  7.0,
  '2019-06-10',
  '+91 98625 99887',
  'zothanpuii@mountcarmel.edu.in',
  '["English", "English Grammar"]'::jsonb,
  '["Class VIII-A", "Class IX-A"]'::jsonb,
  'Class IX-A',
  true,
  'Editor of the annual Mount Carmel literary school magazine.',
  'active'
),
(
  '00000000-0000-0000-0000-000000000001',
  'EMP-MC-005',
  'Mr. Vanlalhruaia',
  'male',
  '1990-08-30',
  'Physical Education Director',
  'Sports & Fitness',
  'full_time',
  'M.P.Ed., NIS Coach',
  9.0,
  '2018-05-02',
  '+91 94363 44556',
  'hruaia.sports@mountcarmel.edu.in',
  '["Physical Education", "Athletics"]'::jsonb,
  '["All Classes"]'::jsonb,
  null,
  false,
  'State athletics coach training interstate football and badminton teams.',
  'active'
)
on conflict (tenant_id, employee_id) do nothing;

-- 2. Seed Initial Completed Import Batch
insert into public.import_batches (
  tenant_id, batch_number, entity_type, mode, file_name,
  total_rows, created_count, updated_count, skipped_count, error_count,
  status, created_by, created_at, completed_at
) values
(
  '00000000-0000-0000-0000-000000000001',
  'IMP-2026-0041',
  'students',
  'upsert',
  'academic_session_2026_class_x_admissions.xlsx',
  42, 40, 2, 0, 0,
  'completed',
  'school_admin',
  '2026-09-15T09:30:00Z',
  '2026-09-15T09:32:15Z'
)
on conflict (batch_number) do nothing;


-- ====================================================================
-- FILE: 00008_exams_and_id_cards.sql
-- ====================================================================

-- ============================================================================
-- 00008_exams_and_id_cards.sql: Exams, Grading, Marks, Marksheets & ID Cards
-- ============================================================================

-- 1. SUBJECTS MASTER
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  class_id uuid references public.classes(id) on delete cascade,
  class_name text,
  subject_type text not null default 'scholastic' check (subject_type in ('scholastic', 'co_scholastic')),
  is_optional boolean not null default false,
  max_marks numeric(5,2) not null default 100,
  pass_marks numeric(5,2) not null default 33,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create index if not exists idx_subjects_tenant on public.subjects(tenant_id);

-- 2. EXAM TYPES & CYCLES
create table if not exists public.exam_types (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  academic_year_id uuid references public.academic_years(id) on delete cascade,
  name text not null, -- e.g. "Unit Test 1", "Mid-Term Exam", "Annual Examination"
  code text not null, -- e.g. "UT-1", "HALF-YEARLY", "ANNUAL-2025"
  term text not null default 'Term 1',
  weightage_percent numeric(5,2) not null default 100,
  start_date date,
  end_date date,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'ongoing', 'evaluating', 'published', 'locked')),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, code, academic_year_id)
);
create index if not exists idx_exam_types_tenant on public.exam_types(tenant_id);

-- 3. GRADING SCHEMES
create table if not exists public.grading_schemes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null, -- e.g. "CBSE 9-Point Scale", "Percentage Scale"
  description text,
  is_default boolean not null default false,
  rules jsonb not null default '[]'::jsonb, -- Array of { grade, min_score, max_score, grade_point, remarks }
  created_at timestamptz not null default now()
);
create index if not exists idx_grading_schemes_tenant on public.grading_schemes(tenant_id);

-- 4. CLASS SUBJECT ASSIGNMENT
create table if not exists public.class_subjects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  teacher_id uuid references public.staff_profiles(id) on delete set null,
  max_marks numeric(5,2) not null default 100,
  pass_marks numeric(5,2) not null default 33,
  created_at timestamptz not null default now(),
  unique (tenant_id, class_id, subject_id)
);
create index if not exists idx_class_subjects_tenant on public.class_subjects(tenant_id);

-- 5. STUDENT MARKS ENTRY
create table if not exists public.student_marks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  exam_id uuid not null references public.exam_types(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  marks_obtained numeric(5,2),
  is_absent boolean not null default false,
  is_exempt boolean not null default false,
  moderated_marks numeric(5,2),
  moderation_reason text,
  remarks text,
  entered_by uuid references public.profiles(id),
  verified_by uuid references public.profiles(id),
  status text not null default 'draft' check (status in ('draft', 'submitted', 'verified', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, exam_id, student_id, subject_id)
);
create index if not exists idx_student_marks_tenant on public.student_marks(tenant_id);
create index if not exists idx_student_marks_exam on public.student_marks(exam_id);
create index if not exists idx_student_marks_student on public.student_marks(student_id);

-- 6. MARKSHEETS & REPORT CARDS (WITH IMMUTABLE SNAPSHOTS & VERIFICATION TOKEN)
create table if not exists public.marksheets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  exam_id uuid not null references public.exam_types(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  academic_year_id uuid references public.academic_years(id) on delete cascade,
  class_id uuid references public.classes(id),
  section_id uuid references public.sections(id),
  total_max_marks numeric(7,2) not null default 0,
  total_obtained_marks numeric(7,2) not null default 0,
  percentage numeric(5,2) not null default 0,
  overall_grade text,
  gpa numeric(4,2),
  rank integer,
  pass_status text not null default 'passed' check (pass_status in ('passed', 'failed', 'compartment', 'withheld')),
  is_withheld boolean not null default false,
  withheld_reason text,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'verified', 'published')),
  verification_token text not null unique,
  snapshot_data jsonb, -- Frozen immutable data at publication
  published_at timestamptz,
  published_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, exam_id, student_id)
);
create index if not exists idx_marksheets_tenant on public.marksheets(tenant_id);
create index if not exists idx_marksheets_token on public.marksheets(verification_token);
create index if not exists idx_marksheets_student on public.marksheets(student_id);

-- 7. ID CARD TEMPLATES
create table if not exists public.id_card_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  card_type text not null check (card_type in ('student', 'staff')),
  layout text not null default 'vertical' check (layout in ('vertical', 'horizontal')),
  primary_color text not null default '#163A2B',
  secondary_color text not null default '#C9A84C',
  background_color text not null default '#FFFFFF',
  show_blood_group boolean not null default true,
  show_guardian_phone boolean not null default true,
  show_address boolean not null default false,
  show_emergency_contact boolean not null default true,
  show_barcode boolean not null default false,
  show_qr boolean not null default true,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_id_card_templates_tenant on public.id_card_templates(tenant_id);

-- 8. ISSUED ID CARDS
create table if not exists public.id_cards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  card_type text not null check (card_type in ('student', 'staff')),
  student_id uuid references public.students(id) on delete cascade,
  staff_id uuid references public.staff_profiles(id) on delete cascade,
  template_id uuid references public.id_card_templates(id) on delete set null,
  card_number text not null,
  issue_date date not null default current_date,
  expiry_date date not null,
  qr_verification_token text not null unique,
  status text not null default 'active' check (status in ('active', 'expired', 'lost', 'revoked')),
  reprint_count integer not null default 0,
  last_printed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, card_number)
);
create index if not exists idx_id_cards_tenant on public.id_cards(tenant_id);
create index if not exists idx_id_cards_token on public.id_cards(qr_verification_token);
create index if not exists idx_id_cards_student on public.id_cards(student_id);
create index if not exists idx_id_cards_staff on public.id_cards(staff_id);

-- 9. REPRINT AUDIT LOG
create table if not exists public.id_card_reprint_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  card_id uuid not null references public.id_cards(id) on delete cascade,
  reprinted_by uuid references public.profiles(id),
  reason text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.subjects enable row level security;
alter table public.exam_types enable row level security;
alter table public.grading_schemes enable row level security;
alter table public.class_subjects enable row level security;
alter table public.student_marks enable row level security;
alter table public.marksheets enable row level security;
alter table public.id_card_templates enable row level security;
alter table public.id_cards enable row level security;
alter table public.id_card_reprint_logs enable row level security;

-- Subjects RLS
create policy "Subjects staff all" on public.subjects for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);
create policy "Subjects public read" on public.subjects for select using (
  tenant_id = private.current_tenant_id()
);

-- Exam Types RLS
create policy "Exam types staff all" on public.exam_types for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);
create policy "Exam types portal select" on public.exam_types for select using (
  tenant_id = private.current_tenant_id() and is_published = true
);

-- Grading Schemes RLS
create policy "Grading schemes staff all" on public.grading_schemes for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);
create policy "Grading schemes tenant select" on public.grading_schemes for select using (
  tenant_id = private.current_tenant_id()
);

-- Class Subjects RLS
create policy "Class subjects staff all" on public.class_subjects for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);

-- Student Marks RLS
create policy "Student marks staff all" on public.student_marks for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);

-- Marksheets RLS
create policy "Marksheets staff all" on public.marksheets for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);
create policy "Marksheets parent select" on public.marksheets for select using (
  tenant_id = private.current_tenant_id() and status = 'published' and (
    private.current_role() = 'parent' and exists (
      select 1 from public.guardians g
      where g.tenant_id = public.marksheets.tenant_id
      and g.student_id = public.marksheets.student_id
      and g.user_id = auth.uid()
    )
    or private.current_role() = 'student' and exists (
      select 1 from public.students s
      where s.id = public.marksheets.student_id
      and s.tenant_id = public.marksheets.tenant_id
      and s.admission_no = (select extra->>'admission_no' from public.profiles where id = auth.uid())
    )
  )
);

-- ID Cards RLS
create policy "ID card templates staff all" on public.id_card_templates for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin')
    or private.is_platform_owner()
  )
);

create policy "ID cards staff all" on public.id_cards for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator')
    or private.is_platform_owner()
  )
);

create policy "ID cards parent and student select" on public.id_cards for select using (
  tenant_id = private.current_tenant_id() and status = 'active' and (
    private.current_role() = 'parent' and exists (
      select 1 from public.guardians g
      where g.tenant_id = public.id_cards.tenant_id
      and g.student_id = public.id_cards.student_id
      and g.user_id = auth.uid()
    )
    or private.current_role() = 'student' and exists (
      select 1 from public.students s
      where s.id = public.id_cards.student_id
      and s.tenant_id = public.id_cards.tenant_id
    )
    or private.current_role() = 'teacher' and exists (
      select 1 from public.staff_profiles sp
      where sp.id = public.id_cards.staff_id
      and sp.tenant_id = public.id_cards.tenant_id
    )
  )
);

create policy "ID reprint logs staff all" on public.id_card_reprint_logs for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin')
    or private.is_platform_owner()
  )
);


-- ====================================================================
-- FILE: 00009_exams_and_id_cards_seed.sql
-- ====================================================================

-- ============================================================================
-- 00009_exams_and_id_cards_seed.sql: Seed Subjects, Grading, Exams, Marksheets & ID Cards
-- ============================================================================

do $$
declare
  v_tenant_id uuid;
  v_academic_year_id uuid;
  v_class_id uuid;
  v_exam_id uuid;
  v_grading_id uuid;
  v_template_student_id uuid;
  v_template_staff_id uuid;
  v_student_1 uuid;
  v_student_2 uuid;
  v_student_3 uuid;
  v_sub_eng uuid;
  v_sub_miz uuid;
  v_sub_mth uuid;
  v_sub_sci uuid;
  v_sub_soc uuid;
  v_sub_csc uuid;
  v_sub_ped uuid;
begin
  -- 1. Identify Tenant
  select id into v_tenant_id from public.tenants where subdomain = 'mountcarmel' limit 1;
  if v_tenant_id is null then
    select id into v_tenant_id from public.tenants limit 1;
  end if;
  if v_tenant_id is null then
    v_tenant_id := '00000000-0000-0000-0000-000000000001'::uuid;
  end if;

  -- 2. Ensure Academic Year
  select id into v_academic_year_id from public.academic_years where tenant_id = v_tenant_id and is_current = true limit 1;
  if v_academic_year_id is null then
    insert into public.academic_years (tenant_id, year_label, start_date, end_date, is_current)
    values (v_tenant_id, '2024-2025', '2024-04-01', '2025-03-31', true)
    returning id into v_academic_year_id;
  end if;

  -- 3. Ensure Class X
  select id into v_class_id from public.classes where tenant_id = v_tenant_id and name like '%Class X%' limit 1;
  if v_class_id is null then
    insert into public.classes (tenant_id, name, display_order)
    values (v_tenant_id, 'Class X', 10)
    returning id into v_class_id;
  end if;

  -- 4. Seed Standard Subjects
  insert into public.subjects (tenant_id, code, name, class_id, class_name, subject_type, is_optional, max_marks, pass_marks, display_order)
  values
    (v_tenant_id, 'ENG-10', 'English Language & Literature', v_class_id, 'Class X', 'scholastic', false, 100, 33, 1),
    (v_tenant_id, 'MIZ-10', 'Mizo Vernacular Literature', v_class_id, 'Class X', 'scholastic', false, 100, 33, 2),
    (v_tenant_id, 'MTH-10', 'Mathematics (Standard)', v_class_id, 'Class X', 'scholastic', false, 100, 33, 3),
    (v_tenant_id, 'SCI-10', 'Integrated Science & Lab', v_class_id, 'Class X', 'scholastic', false, 100, 33, 4),
    (v_tenant_id, 'SOC-10', 'Social Sciences & Civics', v_class_id, 'Class X', 'scholastic', false, 100, 33, 5),
    (v_tenant_id, 'CSC-10', 'Computer Applications', v_class_id, 'Class X', 'scholastic', false, 100, 33, 6),
    (v_tenant_id, 'PED-10', 'Physical & Health Education', v_class_id, 'Class X', 'co_scholastic', false, 50, 17, 7)
  on conflict (tenant_id, code) do update set name = excluded.name;

  select id into v_sub_eng from public.subjects where tenant_id = v_tenant_id and code = 'ENG-10';
  select id into v_sub_miz from public.subjects where tenant_id = v_tenant_id and code = 'MIZ-10';
  select id into v_sub_mth from public.subjects where tenant_id = v_tenant_id and code = 'MTH-10';
  select id into v_sub_sci from public.subjects where tenant_id = v_tenant_id and code = 'SCI-10';
  select id into v_sub_soc from public.subjects where tenant_id = v_tenant_id and code = 'SOC-10';
  select id into v_sub_csc from public.subjects where tenant_id = v_tenant_id and code = 'CSC-10';
  select id into v_sub_ped from public.subjects where tenant_id = v_tenant_id and code = 'PED-10';

  -- 5. Seed Grading Schemes
  insert into public.grading_schemes (tenant_id, name, description, is_default, rules)
  values
  (
    v_tenant_id,
    'CBSE Secondary 9-Point Scale',
    'Official 9-point percentage band scale with letter grades and grade points (GP 4.0 to 10.0)',
    true,
    '[
      {"grade": "A1", "min_score": 91, "max_score": 100, "grade_point": 10.0, "remarks": "Outstanding"},
      {"grade": "A2", "min_score": 81, "max_score": 90, "grade_point": 9.0, "remarks": "Excellent"},
      {"grade": "B1", "min_score": 71, "max_score": 80, "grade_point": 8.0, "remarks": "Very Good"},
      {"grade": "B2", "min_score": 61, "max_score": 70, "grade_point": 7.0, "remarks": "Good"},
      {"grade": "C1", "min_score": 51, "max_score": 60, "grade_point": 6.0, "remarks": "Above Average"},
      {"grade": "C2", "min_score": 41, "max_score": 50, "grade_point": 5.0, "remarks": "Average"},
      {"grade": "D",  "min_score": 33, "max_score": 40, "grade_point": 4.0, "remarks": "Marginal Pass"},
      {"grade": "E",  "min_score": 0,  "max_score": 32, "grade_point": 0.0, "remarks": "Needs Improvement / Failed"}
    ]'::jsonb
  ),
  (
    v_tenant_id,
    'Standard Higher Secondary Percentage Scale',
    'State Board standard division percentages (Distinction, First Division, Second Division)',
    false,
    '[
      {"grade": "Distinction", "min_score": 75, "max_score": 100, "grade_point": 10.0, "remarks": "Passed with Distinction"},
      {"grade": "1st Div",    "min_score": 60, "max_score": 74.99, "grade_point": 8.0, "remarks": "First Division"},
      {"grade": "2nd Div",    "min_score": 45, "max_score": 59.99, "grade_point": 6.0, "remarks": "Second Division"},
      {"grade": "3rd Div",    "min_score": 33, "max_score": 44.99, "grade_point": 4.0, "remarks": "Third Division Pass"},
      {"grade": "Failed",     "min_score": 0,  "max_score": 32.99, "grade_point": 0.0, "remarks": "Failed / Compartment"}
    ]'::jsonb
  );

  select id into v_grading_id from public.grading_schemes where tenant_id = v_tenant_id and is_default = true limit 1;

  -- 6. Seed Exam Types
  insert into public.exam_types (tenant_id, academic_year_id, name, code, term, weightage_percent, start_date, end_date, status, is_published, published_at)
  values
    (v_tenant_id, v_academic_year_id, 'Half-Yearly Examination 2024–2025', 'HALF-YEARLY-2024', 'Term 1', 50.00, '2024-09-10', '2024-09-22', 'published', true, now() - interval '5 days'),
    (v_tenant_id, v_academic_year_id, 'Unit Test 1 (July 2024)', 'UT1-2024', 'Term 1', 15.00, '2024-07-15', '2024-07-20', 'published', true, now() - interval '60 days'),
    (v_tenant_id, v_academic_year_id, 'Annual Examination 2024–2025', 'ANNUAL-2025', 'Term 2', 100.00, '2025-02-18', '2025-03-02', 'draft', false, null)
  on conflict (tenant_id, code, academic_year_id) do update set name = excluded.name;

  select id into v_exam_id from public.exam_types where tenant_id = v_tenant_id and code = 'HALF-YEARLY-2024' limit 1;

  -- 7. Ensure Demo Students Exist
  select id into v_student_1 from public.students where tenant_id = v_tenant_id and admission_no = 'ADM-2024-0012' limit 1;
  if v_student_1 is null then
    insert into public.students (tenant_id, admission_no, roll_no, class_id, full_name, dob, gender, residence_type, status, blood_group)
    values (v_tenant_id, 'ADM-2024-0012', 1, v_class_id, 'Lalrintluanga Sailo', '2009-05-14', 'male', 'day', 'active', 'B+')
    returning id into v_student_1;
  end if;

  select id into v_student_2 from public.students where tenant_id = v_tenant_id and admission_no = 'ADM-2024-0018' limit 1;
  if v_student_2 is null then
    insert into public.students (tenant_id, admission_no, roll_no, class_id, full_name, dob, gender, residence_type, status, blood_group)
    values (v_tenant_id, 'ADM-2024-0018', 2, v_class_id, 'Vanlalhruaii Pachuau', '2009-08-20', 'female', 'hosteller', 'active', 'O+')
    returning id into v_student_2;
  end if;

  select id into v_student_3 from public.students where tenant_id = v_tenant_id and admission_no = 'ADM-2024-0025' limit 1;
  if v_student_3 is null then
    insert into public.students (tenant_id, admission_no, roll_no, class_id, full_name, dob, gender, residence_type, status, blood_group)
    values (v_tenant_id, 'ADM-2024-0025', 3, v_class_id, 'Zonunmawia Ralte', '2009-02-11', 'male', 'day', 'active', 'A+')
    returning id into v_student_3;
  end if;

  -- 8. Seed Marks for Student 1 (High Achiever, Rank 1)
  if v_exam_id is not null and v_student_1 is not null and v_sub_eng is not null then
    insert into public.student_marks (tenant_id, exam_id, student_id, subject_id, marks_obtained, is_absent, status)
    values
      (v_tenant_id, v_exam_id, v_student_1, v_sub_eng, 94.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_miz, 96.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_mth, 98.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_sci, 92.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_soc, 90.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_csc, 95.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_ped, 48.00, false, 'published')
    on conflict (tenant_id, exam_id, student_id, subject_id) do update set marks_obtained = excluded.marks_obtained;

    -- Seed Marksheet 1
    insert into public.marksheets (
      tenant_id, exam_id, student_id, academic_year_id, class_id,
      total_max_marks, total_obtained_marks, percentage, overall_grade, gpa, rank, pass_status,
      verification_token, status, published_at, snapshot_data
    ) values (
      v_tenant_id, v_exam_id, v_student_1, v_academic_year_id, v_class_id,
      600.00, 565.00, 94.17, 'A1', 9.80, 1, 'passed',
      'MS-MC-2024-X-001-A1B9C8D7',
      'published', now() - interval '5 days',
      '{
        "schoolName": "Mount Carmel Higher Secondary School",
        "studentName": "Lalrintluanga Sailo",
        "admissionNo": "ADM-2024-0012",
        "rollNo": 1,
        "className": "Class X",
        "section": "A",
        "examName": "Half-Yearly Examination 2024–2025",
        "academicYear": "2024-2025",
        "totalMax": 600,
        "totalObtained": 565,
        "percentage": 94.17,
        "grade": "A1",
        "rank": 1,
        "passStatus": "Passed with Distinction",
        "attendancePercentage": 96.5,
        "publishedDate": "2024-09-25",
        "subjects": [
          {"code": "ENG-10", "name": "English Language & Literature", "max": 100, "obtained": 94, "grade": "A1", "gradePoint": 10.0},
          {"code": "MIZ-10", "name": "Mizo Vernacular Literature", "max": 100, "obtained": 96, "grade": "A1", "gradePoint": 10.0},
          {"code": "MTH-10", "name": "Mathematics (Standard)", "max": 100, "obtained": 98, "grade": "A1", "gradePoint": 10.0},
          {"code": "SCI-10", "name": "Integrated Science & Lab", "max": 100, "obtained": 92, "grade": "A1", "gradePoint": 10.0},
          {"code": "SOC-10", "name": "Social Sciences & Civics", "max": 100, "obtained": 90, "grade": "A2", "gradePoint": 9.0},
          {"code": "CSC-10", "name": "Computer Applications", "max": 100, "obtained": 95, "grade": "A1", "gradePoint": 10.0}
        ],
        "coScholastic": [
          {"code": "PED-10", "name": "Physical & Health Education", "max": 50, "obtained": 48, "grade": "A"}
        ]
      }'::jsonb
    ) on conflict (tenant_id, exam_id, student_id) do update set percentage = excluded.percentage;
  end if;

  -- 9. Seed Marksheet 2 (Vanlalhruaii Pachuau, Rank 2)
  if v_exam_id is not null and v_student_2 is not null then
    insert into public.marksheets (
      tenant_id, exam_id, student_id, academic_year_id, class_id,
      total_max_marks, total_obtained_marks, percentage, overall_grade, gpa, rank, pass_status,
      verification_token, status, published_at, snapshot_data
    ) values (
      v_tenant_id, v_exam_id, v_student_2, v_academic_year_id, v_class_id,
      600.00, 528.00, 88.00, 'A2', 9.00, 2, 'passed',
      'MS-MC-2024-X-002-E2F3G4H5',
      'published', now() - interval '5 days',
      '{
        "schoolName": "Mount Carmel Higher Secondary School",
        "studentName": "Vanlalhruaii Pachuau",
        "admissionNo": "ADM-2024-0018",
        "rollNo": 2,
        "className": "Class X",
        "section": "A",
        "examName": "Half-Yearly Examination 2024–2025",
        "academicYear": "2024-2025",
        "totalMax": 600,
        "totalObtained": 528,
        "percentage": 88.00,
        "grade": "A2",
        "rank": 2,
        "passStatus": "Passed",
        "attendancePercentage": 98.0,
        "publishedDate": "2024-09-25",
        "subjects": [
          {"code": "ENG-10", "name": "English Language & Literature", "max": 100, "obtained": 86, "grade": "A2", "gradePoint": 9.0},
          {"code": "MIZ-10", "name": "Mizo Vernacular Literature", "max": 100, "obtained": 91, "grade": "A1", "gradePoint": 10.0},
          {"code": "MTH-10", "name": "Mathematics (Standard)", "max": 100, "obtained": 84, "grade": "A2", "gradePoint": 9.0},
          {"code": "SCI-10", "name": "Integrated Science & Lab", "max": 100, "obtained": 89, "grade": "A2", "gradePoint": 9.0},
          {"code": "SOC-10", "name": "Social Sciences & Civics", "max": 100, "obtained": 88, "grade": "A2", "gradePoint": 9.0},
          {"code": "CSC-10", "name": "Computer Applications", "max": 100, "obtained": 90, "grade": "A2", "gradePoint": 9.0}
        ],
        "coScholastic": [
          {"code": "PED-10", "name": "Physical & Health Education", "max": 50, "obtained": 45, "grade": "A"}
        ]
      }'::jsonb
    ) on conflict (tenant_id, exam_id, student_id) do update set percentage = excluded.percentage;
  end if;

  -- 10. Seed ID Card Templates
  insert into public.id_card_templates (
    tenant_id, name, card_type, layout, primary_color, secondary_color,
    background_color, show_blood_group, show_guardian_phone, show_address, show_qr, is_default
  ) values
  (
    v_tenant_id,
    'Official Student Identity Card (CR80 Vertical)',
    'student',
    'vertical',
    '#163A2B',
    '#C9A84C',
    '#FFFFFF',
    true, true, true, true, true
  ),
  (
    v_tenant_id,
    'Staff & Faculty Credential Card (CR80 Horizontal)',
    'staff',
    'horizontal',
    '#163A2B',
    '#2563EB',
    '#F8FAFC',
    true, false, false, true, true
  );

  select id into v_template_student_id from public.id_card_templates where tenant_id = v_tenant_id and card_type = 'student' limit 1;
  select id into v_template_staff_id from public.id_card_templates where tenant_id = v_tenant_id and card_type = 'staff' limit 1;

  -- 11. Seed Sample Student ID Card
  if v_student_1 is not null and v_template_student_id is not null then
    insert into public.id_cards (
      tenant_id, card_type, student_id, template_id, card_number,
      issue_date, expiry_date, qr_verification_token, status
    ) values (
      v_tenant_id, 'student', v_student_1, v_template_student_id, 'IDC-2024-0012',
      '2024-04-01', '2025-03-31', 'ID-VER-MC-STU-0012-9988', 'active'
    ) on conflict (tenant_id, card_number) do nothing;
  end if;

  -- 12. Seed Sample Staff ID Card
  if v_template_staff_id is not null then
    insert into public.id_cards (
      tenant_id, card_type, staff_id, template_id, card_number,
      issue_date, expiry_date, qr_verification_token, status
    ) values (
      v_tenant_id, 'staff',
      (select id from public.staff_profiles where tenant_id = v_tenant_id and employee_id = 'EMP-MC-001' limit 1),
      v_template_staff_id, 'IDC-STAFF-MC-001',
      '2024-04-01', '2026-03-31', 'ID-VER-MC-STF-0001-4433', 'active'
    ) on conflict (tenant_id, card_number) do nothing;
  end if;

end $$;


-- ====================================================================
-- FILE: 00010_mobile_app_and_versions.sql
-- ====================================================================

-- ============================================================================
-- 00010_mobile_app_and_versions.sql: Mobile App Versions, Reviewers & Compliance
-- ============================================================================

-- 1. APP VERSIONS & FORCE UPDATE GATING
create table if not exists public.app_versions (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('android', 'ios')),
  version text not null, -- e.g. "1.0.0"
  build_number integer not null,
  min_supported_version text not null default '1.0.0',
  force_update boolean not null default false,
  release_notes text,
  store_url text,
  created_at timestamptz not null default now(),
  unique (platform, version, build_number)
);

-- 2. APP STORE REVIEWER DEMO ACCOUNTS (Apple / Google review guideline compliance)
create table if not exists public.app_review_demo_accounts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  account_role text not null check (account_role in ('parent', 'student', 'staff')),
  username text not null,
  password_hint text not null default 'Reviewer@2025!',
  is_active boolean not null default true,
  demo_data jsonb not null default '{}'::jsonb,
  notes text,
  created_at timestamptz not null default now(),
  unique (tenant_id, username)
);

-- 3. IN-APP ACCOUNT DELETION REQUESTS (Mandated by Apple App Store 5.1.1 & Play Store)
create table if not exists public.account_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  user_email text not null,
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'processed', 'cancelled')),
  scheduled_deletion_date date not null default (current_date + interval '30 days'),
  created_at timestamptz not null default now()
);
create index if not exists idx_deletion_requests_tenant on public.account_deletion_requests(tenant_id);

-- 4. PUSH NOTIFICATION TOKENS
create table if not exists public.push_notification_tokens (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  expo_push_token text not null,
  platform text not null check (platform in ('android', 'ios', 'web')),
  created_at timestamptz not null default now(),
  unique (tenant_id, expo_push_token)
);
create index if not exists idx_push_tokens_tenant on public.push_notification_tokens(tenant_id);

-- Enable RLS
alter table public.app_versions enable row level security;
alter table public.app_review_demo_accounts enable row level security;
alter table public.account_deletion_requests enable row level security;
alter table public.push_notification_tokens enable row level security;

-- Policies
create policy "App versions public select" on public.app_versions for select using (true);
create policy "Reviewer accounts public select" on public.app_review_demo_accounts for select using (is_active = true);
create policy "Account deletion user insert" on public.account_deletion_requests for insert with check (true);
create policy "Account deletion admin all" on public.account_deletion_requests for all using (
  tenant_id = private.current_tenant_id() and private.current_role() in ('school_super_admin', 'school_admin')
  or private.is_platform_owner()
);
create policy "Push tokens insert" on public.push_notification_tokens for insert with check (
  tenant_id = private.current_tenant_id()
);

-- Seed Initial App Versions & Reviewer Account for Mount Carmel
insert into public.app_versions (platform, version, build_number, min_supported_version, force_update, release_notes)
values
  ('android', '1.0.0', 1, '1.0.0', false, 'Initial release of EduPortal Android mobile client.'),
  ('ios', '1.0.0', 1, '1.0.0', false, 'Initial release of EduPortal iOS mobile client.')
on conflict do nothing;

do $$
declare
  v_tenant_id uuid;
begin
  select id into v_tenant_id from public.tenants where subdomain = 'mountcarmel' limit 1;
  if v_tenant_id is not null then
    insert into public.app_review_demo_accounts (tenant_id, account_role, username, password_hint, demo_data, notes)
    values
      (
        v_tenant_id,
        'parent',
        'apple.reviewer@mountcarmel.edu.in',
        'ReviewerDemo2025!',
        '{"studentName": "Demo Student (Lalrintluanga)", "className": "Class X-A", "rollNo": 1}'::jsonb,
        'Official Apple / Google Play app review testing account with sample non-real data.'
      )
    on conflict (tenant_id, username) do nothing;
  end if;
end $$;


-- ====================================================================
-- FILE: 00011_app_publishing.sql
-- ====================================================================

-- Migration 00011: App Publishing Pipeline & Store Asset Specifications
-- Phase 2 Milestone 5

-- 1. Tenant Apps Table (Store listing & configuration)
CREATE TABLE IF NOT EXISTS tenant_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('android', 'ios')),
  app_name VARCHAR(150) NOT NULL,
  package_id VARCHAR(150) NOT NULL,
  publisher_owner VARCHAR(50) NOT NULL DEFAULT 'school' CHECK (publisher_owner IN ('school', 'platform')),
  store_account_email VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'configuring', 'ready_for_build', 'building', 'published', 'archived')),
  listing JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, platform)
);

-- 2. Store Asset Specifications Table (Google Play & Apple App Store rules)
CREATE TABLE IF NOT EXISTS store_asset_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('android', 'ios', 'both')),
  asset_type VARCHAR(50) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  min_width INT NOT NULL,
  min_height INT NOT NULL,
  max_width INT NOT NULL,
  max_height INT NOT NULL,
  aspect_ratio VARCHAR(20),
  format VARCHAR(20) NOT NULL DEFAULT 'png' CHECK (format IN ('png', 'jpeg', 'webp')),
  max_size_kb INT NOT NULL DEFAULT 1024,
  requires_no_alpha BOOLEAN NOT NULL DEFAULT false,
  is_required BOOLEAN NOT NULL DEFAULT true,
  description TEXT
);

-- 3. Tenant App Assets Table (Uploaded and validated assets)
CREATE TABLE IF NOT EXISTS tenant_app_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES tenant_apps(id) ON DELETE CASCADE,
  spec_id UUID REFERENCES store_asset_specs(id),
  asset_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  file_size_bytes INT NOT NULL,
  storage_key VARCHAR(500) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'invalid', 'pending_validation')),
  validation_errors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. App Builds Table (EAS & CI compilation artifacts)
CREATE TABLE IF NOT EXISTS app_builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES tenant_apps(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL,
  build_number INT NOT NULL,
  build_type VARCHAR(20) NOT NULL CHECK (build_type IN ('aab', 'apk', 'ipa')),
  status VARCHAR(50) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'building', 'completed', 'failed')),
  artifact_key VARCHAR(500),
  artifact_size_bytes BIGINT,
  ci_run_id VARCHAR(100),
  logs_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 5. App Releases Table (Tracks, reviews, and store live statuses)
CREATE TABLE IF NOT EXISTS app_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES tenant_apps(id) ON DELETE CASCADE,
  build_id UUID REFERENCES app_builds(id) ON DELETE SET NULL,
  track VARCHAR(50) NOT NULL CHECK (track IN ('internal', 'closed', 'production')),
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'in_review', 'rejected', 'approved', 'live', 'halted')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  live_at TIMESTAMPTZ,
  rejection_reason TEXT,
  fix_notes TEXT,
  store_url VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE tenant_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_asset_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_app_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_releases ENABLE ROW LEVEL SECURITY;

-- Policies for tenant_apps
CREATE POLICY "tenant_apps_tenant_select" ON tenant_apps
  FOR SELECT USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "tenant_apps_tenant_update" ON tenant_apps
  FOR UPDATE USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "tenant_apps_platform_all" ON tenant_apps
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');

-- Store Asset Specs (Public read, platform manage)
CREATE POLICY "specs_public_select" ON store_asset_specs
  FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "specs_platform_all" ON store_asset_specs
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');

-- Policies for tenant_app_assets
CREATE POLICY "assets_tenant_select" ON tenant_app_assets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tenant_apps WHERE tenant_apps.id = tenant_app_assets.app_id AND (tenant_apps.tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner'))
  );

CREATE POLICY "assets_platform_all" ON tenant_app_assets
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');

-- Policies for app_builds
CREATE POLICY "builds_tenant_select" ON app_builds
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tenant_apps WHERE tenant_apps.id = app_builds.app_id AND (tenant_apps.tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner'))
  );

CREATE POLICY "builds_platform_all" ON app_builds
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');

-- Policies for app_releases
CREATE POLICY "releases_tenant_select" ON app_releases
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tenant_apps WHERE tenant_apps.id = app_releases.app_id AND (tenant_apps.tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner'))
  );

CREATE POLICY "releases_platform_all" ON app_releases
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');


-- ====================================================================
-- FILE: 00012_app_publishing_seed.sql
-- ====================================================================

-- Migration 00012: App Publishing Specifications & Mount Carmel Seed Data
-- Phase 2 Milestone 5

-- 1. Store Asset Specifications
INSERT INTO store_asset_specs (
  id, platform, asset_type, display_name, min_width, min_height, max_width, max_height, aspect_ratio, format, max_size_kb, requires_no_alpha, is_required, description
) VALUES
  (
    '00000000-0000-0000-0000-000000000101',
    'android',
    'app_icon',
    'Google Play App Icon',
    512, 512, 512, 512,
    '1:1',
    'png',
    1024,
    false,
    true,
    'High-resolution 32-bit PNG with alpha channel at exactly 512x512 pixels.'
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'android',
    'feature_graphic',
    'Google Play Feature Graphic',
    1024, 500, 1024, 500,
    '1024:500',
    'png',
    1024,
    false,
    true,
    'Banner graphic shown at the top of the Google Play store listing (1024x500).'
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'android',
    'screenshot_phone',
    'Google Play Phone Screenshot',
    1080, 1920, 1080, 2400,
    '9:16',
    'png',
    8192,
    false,
    true,
    'Portrait screenshot highlighting portal features (min 2 required, max 8).'
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    'ios',
    'app_icon',
    'Apple App Store Icon',
    1024, 1024, 1024, 1024,
    '1:1',
    'png',
    2048,
    true,
    'Square 1024x1024 PNG without transparency or alpha channel.'
  ),
  (
    '00000000-0000-0000-0000-000000000105',
    'ios',
    'screenshot_phone',
    'Apple iPhone 6.5" Display Screenshot',
    1242, 2688, 1284, 2778,
    '9:19.5',
    'png',
    8192,
    false,
    true,
    'Full-bleed portrait screenshot for 6.5-inch Super Retina displays.'
  ),
  (
    '00000000-0000-0000-0000-000000000106',
    'both',
    'splash_screen',
    'Universal Mobile Splash Screen',
    1242, 2436, 1284, 2778,
    '9:19.5',
    'png',
    4096,
    false,
    true,
    'Centered institutional crest and brand color background for boot sequence.'
  )
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Mount Carmel HSS White-Label Apps
INSERT INTO tenant_apps (
  id, tenant_id, platform, app_name, package_id, publisher_owner, store_account_email, status, listing
) VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000001',
    'android',
    'Mount Carmel HSS Aizawl',
    'in.edu.mountcarmel.portal',
    'school',
    'principal@mountcarmel.edu.in',
    'published',
    '{
      "short_description_en": "Official student, parent & faculty portal for Mount Carmel HSS Aizawl.",
      "short_description_lus": "Mount Carmel HSS zirlai, nu leh pa, leh zirtirtute tan official portal.",
      "full_description_en": "Mount Carmel Higher Secondary School official mobile portal provides real-time access to student examination marksheets, term report cards, digital student identity cards with instant offline verification QR codes, fee settlement receipts, and institutional announcements.",
      "full_description_lus": "Mount Carmel Higher Secondary School mobile app hian zirlai exam result, marksheet, digital ID card gate pass QR code, school fee chawina leh receipt, leh school hriattirna zawng zawng awlsam takin a pe chhuak a ni.",
      "category": "Education",
      "keywords": ["Mount Carmel", "Aizawl", "Mizoram", "School Portal", "Marksheet", "ID Card"],
      "support_email": "support@mountcarmel.edu.in",
      "support_url": "https://mountcarmel.eduportal.com/about",
      "privacy_policy_url": "https://mountcarmel.eduportal.com/about#privacy",
      "terms_of_service_url": "https://mountcarmel.eduportal.com/about#terms",
      "account_deletion_url": "https://mountcarmel.eduportal.com/portal/profile#delete-account"
    }'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000001',
    'ios',
    'Mount Carmel HSS Aizawl',
    'in.edu.mountcarmel.portal',
    'school',
    'principal@mountcarmel.edu.in',
    'published',
    '{
      "short_description_en": "Official student, parent & faculty portal for Mount Carmel HSS Aizawl.",
      "short_description_lus": "Mount Carmel HSS zirlai, nu leh pa, leh zirtirtute tan official portal.",
      "full_description_en": "Mount Carmel Higher Secondary School official mobile portal provides real-time access to student examination marksheets, term report cards, digital student identity cards with instant offline verification QR codes, fee settlement receipts, and institutional announcements.",
      "full_description_lus": "Mount Carmel Higher Secondary School mobile app hian zirlai exam result, marksheet, digital ID card gate pass QR code, school fee chawina leh receipt, leh school hriattirna zawng zawng awlsam takin a pe chhuak a ni.",
      "category": "Education",
      "keywords": ["Mount Carmel", "Aizawl", "Mizoram", "School Portal", "Marksheet", "ID Card"],
      "support_email": "support@mountcarmel.edu.in",
      "support_url": "https://mountcarmel.eduportal.com/about",
      "privacy_policy_url": "https://mountcarmel.eduportal.com/about#privacy",
      "terms_of_service_url": "https://mountcarmel.eduportal.com/about#terms",
      "account_deletion_url": "https://mountcarmel.eduportal.com/portal/profile#delete-account"
    }'::jsonb
  )
ON CONFLICT (tenant_id, platform) DO UPDATE SET
  app_name = EXCLUDED.app_name,
  package_id = EXCLUDED.package_id,
  status = EXCLUDED.status,
  listing = EXCLUDED.listing;

-- 3. Seed Production Builds
INSERT INTO app_builds (
  id, app_id, version, build_number, build_type, status, artifact_key, artifact_size_bytes, ci_run_id, logs_summary, completed_at
) VALUES
  (
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000201',
    '1.0.0',
    101,
    'aab',
    'completed',
    'mountcarmel/builds/release-v1.0.0-101.aab',
    28419200,
    'gh-run-884129',
    'EAS Build Android AAB successful. Hermes bytecode compiled. 0 warnings.',
    NOW() - INTERVAL '30 days'
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    '00000000-0000-0000-0000-000000000202',
    '1.0.0',
    101,
    'ipa',
    'completed',
    'mountcarmel/builds/release-v1.0.0-101.ipa',
    34102912,
    'gh-run-884130',
    'EAS Build iOS IPA successful. Distribution profile signed. 0 warnings.',
    NOW() - INTERVAL '30 days'
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Live Store Releases
INSERT INTO app_releases (
  id, app_id, build_id, track, status, submitted_at, approved_at, live_at, store_url
) VALUES
  (
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000301',
    'production',
    'live',
    NOW() - INTERVAL '28 days',
    NOW() - INTERVAL '24 days',
    NOW() - INTERVAL '23 days',
    'https://play.google.com/store/apps/details?id=in.edu.mountcarmel.portal'
  ),
  (
    '00000000-0000-0000-0000-000000000402',
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000302',
    'production',
    'live',
    NOW() - INTERVAL '28 days',
    NOW() - INTERVAL '25 days',
    NOW() - INTERVAL '24 days',
    'https://apps.apple.com/in/app/mount-carmel-hss-aizawl/id6471829012'
  )
ON CONFLICT (id) DO NOTHING;


-- ====================================================================
-- FILE: 00013_module_manager.sql
-- ====================================================================

-- Migration 00013: Module Manager & Tenant Modules Architecture
-- Phase 2 Milestone 6

CREATE TABLE IF NOT EXISTS tenant_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  module_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'installed_enabled', 'installed_disabled', 'archived')),
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
  installed_by UUID REFERENCES profiles(id),
  installed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, module_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenant_modules_tenant_status ON tenant_modules(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_tenant_modules_module_id ON tenant_modules(module_id);

-- Row Level Security (RLS)
ALTER TABLE tenant_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_modules_select" ON tenant_modules
  FOR SELECT USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "tenant_modules_admin_update" ON tenant_modules
  FOR UPDATE USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "tenant_modules_admin_insert" ON tenant_modules
  FOR INSERT WITH CHECK (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "tenant_modules_platform_all" ON tenant_modules
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');


-- ====================================================================
-- FILE: 00014_module_manager_seed.sql
-- ====================================================================

-- Migration 00014: Module Manager Initial Seed Data
-- Phase 2 Milestone 6

INSERT INTO tenant_modules (
  id, tenant_id, module_id, status, settings, version, installed_at
) VALUES
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'settings',
    'installed_enabled',
    '{"theme": "forest_emerald", "allow_self_registration": false}'::jsonb,
    '1.0.0',
    NOW() - INTERVAL '60 days'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'data_hub',
    'installed_enabled',
    '{"sync_with_website": true, "auto_clean_whitespace": true}'::jsonb,
    '1.0.0',
    NOW() - INTERVAL '30 days'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'staff',
    'installed_enabled',
    '{"auto_generate_emp_id": true, "emp_id_prefix": "EMP-MC-"}'::jsonb,
    '1.0.0',
    NOW() - INTERVAL '30 days'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'cms',
    'installed_enabled',
    '{"enable_gallery": true, "enable_notices": true}'::jsonb,
    '1.0.0',
    NOW() - INTERVAL '60 days'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'students',
    'installed_enabled',
    '{"require_guardian_phone": true}'::jsonb,
    '1.0.0',
    NOW() - INTERVAL '60 days'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'fees',
    'installed_enabled',
    '{"grace_period_days": 5, "late_fine_daily": 20}'::jsonb,
    '1.0.0',
    NOW() - INTERVAL '60 days'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'exams',
    'installed_enabled',
    '{"grading_scheme": "cbse_9point", "withhold_results_defaulters": false}'::jsonb,
    '1.0.0',
    NOW() - INTERVAL '15 days'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'id_cards',
    'installed_enabled',
    '{"orientation": "vertical", "include_qr": true}'::jsonb,
    '1.0.0',
    NOW() - INTERVAL '15 days'
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'attendance',
    'available',
    '{}'::jsonb,
    '1.0.0',
    NULL
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000001',
    'certificates',
    'available',
    '{}'::jsonb,
    '1.0.0',
    NULL
  )
ON CONFLICT (tenant_id, module_id) DO UPDATE SET
  status = EXCLUDED.status,
  settings = EXCLUDED.settings;


-- ====================================================================
-- FILE: 00015_custom_builder_and_modules.sql
-- ====================================================================

-- Migration 00015: Custom Module Builder, Attendance & Certificates Modules
-- Phase 2 Milestone 7

-- 1. Custom Module Builder: Entities
CREATE TABLE IF NOT EXISTS custom_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  name_lus VARCHAR(100),
  slug VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT '📦',
  description TEXT,
  description_lus TEXT,
  permissions JSONB NOT NULL DEFAULT '["school_super_admin", "school_admin"]'::jsonb,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

-- 2. Custom Module Builder: Fields
CREATE TABLE IF NOT EXISTS custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES custom_entities(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  field_label VARCHAR(100) NOT NULL,
  field_label_lus VARCHAR(100),
  field_type VARCHAR(50) NOT NULL CHECK (
    field_type IN (
      'text', 'long_text', 'number', 'currency', 'date', 'datetime',
      'boolean', 'select', 'multiselect', 'phone', 'email', 'url',
      'file', 'image', 'relation', 'calculated'
    )
  ),
  is_required BOOLEAN NOT NULL DEFAULT false,
  options JSONB DEFAULT '[]'::jsonb,
  relation_target VARCHAR(100),
  default_value JSONB,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entity_id, field_name)
);

-- 3. Custom Module Builder: Records (Schemaless JSONB with GIN indexing)
CREATE TABLE IF NOT EXISTS custom_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES custom_entities(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_records_gin ON custom_records USING GIN(data);
CREATE INDEX IF NOT EXISTS idx_custom_records_tenant_entity ON custom_records(tenant_id, entity_id);

-- 4. Attendance Module: Sessions
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  class_id UUID,
  section_id UUID,
  session_type VARCHAR(20) NOT NULL DEFAULT 'full_day' CHECK (session_type IN ('morning', 'afternoon', 'full_day')),
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, date, class_id, section_id, session_type)
);

-- 5. Attendance Module: Student Entries
CREATE TABLE IF NOT EXISTS student_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- 6. Attendance Module: Staff Daily Logs
CREATE TABLE IF NOT EXISTS staff_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  staff_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'half_day', 'on_leave')),
  check_in_time TIME,
  check_out_time TIME,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, date, staff_id)
);

-- 7. Certificates Module: Templates
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('transfer', 'bonafide', 'character', 'custom')),
  title VARCHAR(150) NOT NULL,
  title_lus VARCHAR(150),
  body_template TEXT NOT NULL,
  body_template_lus TEXT,
  layout_config JSONB NOT NULL DEFAULT '{"header": true, "crest": true, "qr_seal": true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Certificates Module: Issued Certificates
CREATE TABLE IF NOT EXISTS issued_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES certificate_templates(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  certificate_number VARCHAR(100) NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'issued', 'revoked')),
  snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  verification_token VARCHAR(100) NOT NULL UNIQUE,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE custom_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE issued_certificates ENABLE ROW LEVEL SECURITY;

-- Standard Tenant RLS Policies
CREATE POLICY "custom_entities_tenant_all" ON custom_entities
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "custom_fields_tenant_all" ON custom_fields
  FOR ALL USING (
    EXISTS (SELECT 1 FROM custom_entities WHERE custom_entities.id = custom_fields.entity_id AND (custom_entities.tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner'))
  );

CREATE POLICY "custom_records_tenant_all" ON custom_records
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "attendance_sessions_tenant_all" ON attendance_sessions
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "student_attendance_tenant_all" ON student_attendance
  FOR ALL USING (
    EXISTS (SELECT 1 FROM attendance_sessions WHERE attendance_sessions.id = student_attendance.session_id AND (attendance_sessions.tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner'))
  );

CREATE POLICY "staff_attendance_tenant_all" ON staff_attendance
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "certificate_templates_tenant_all" ON certificate_templates
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "issued_certificates_tenant_all" ON issued_certificates
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

-- Public verification for issued certificates (minimal confirmation)
CREATE POLICY "issued_certificates_public_verify" ON issued_certificates
  FOR SELECT TO PUBLIC USING (status IN ('approved', 'issued'));


-- ====================================================================
-- FILE: 00016_custom_builder_seed.sql
-- ====================================================================

-- Migration 00016: Custom Module Builder, Attendance & Certificates Seed Data
-- Phase 2 Milestone 7

-- 1. Seed Custom Entities (Templates)
INSERT INTO custom_entities (
  id, tenant_id, name, name_lus, slug, icon, description, description_lus, permissions, is_system
) VALUES
  (
    '00000000-0000-0000-0000-000000000701',
    '00000000-0000-0000-0000-000000000001',
    'Library Catalog',
    'Lehkhabu Enkawlna',
    'library',
    '📚',
    'School library books catalog, ISBN tracking, shelf locations, and copies inventory.',
    'School library lehkhabu awmzat, ISBN, leh shelf awmna vawn thatna.',
    '["school_super_admin", "school_admin", "teacher"]'::jsonb,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000702',
    '00000000-0000-0000-0000-000000000001',
    'Transport & Bus Routes',
    'Bus Kawng & Kal Dan',
    'transport',
    '🚌',
    'Institutional bus fleet, route stops, driver contacts, vehicle registrations, and monthly transport fares.',
    'School bus kal dan, driver biakpawhna, leh bus fee chhinchhiahna.',
    '["school_super_admin", "school_admin"]'::jsonb,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000703',
    '00000000-0000-0000-0000-000000000001',
    'School Events & Calendar',
    'Thil Thleng & Calendar',
    'events',
    '📅',
    'Annual sports meet, science exhibitions, parent-teacher conferences, and official gazetted holidays.',
    'Sports, science exhibition, nu leh pa inhmukhawm, leh chawlhkar chhinchhiahna.',
    '["school_super_admin", "school_admin", "teacher"]'::jsonb,
    false
  )
ON CONFLICT (tenant_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_lus = EXCLUDED.name_lus,
  icon = EXCLUDED.icon;

-- 2. Seed Fields for Library Entity
INSERT INTO custom_fields (
  id, entity_id, field_name, field_label, field_label_lus, field_type, is_required, options, order_index
) VALUES
  ('00000000-0000-0000-0000-000000000711', '00000000-0000-0000-0000-000000000701', 'title', 'Book Title', 'Lehkhabu Hming', 'text', true, '[]'::jsonb, 1),
  ('00000000-0000-0000-0000-000000000712', '00000000-0000-0000-0000-000000000701', 'author', 'Author / Writer', 'Ziaktu', 'text', true, '[]'::jsonb, 2),
  ('00000000-0000-0000-0000-000000000713', '00000000-0000-0000-0000-000000000701', 'isbn', 'ISBN Code', 'ISBN Number', 'text', false, '[]'::jsonb, 3),
  ('00000000-0000-0000-0000-000000000714', '00000000-0000-0000-0000-000000000701', 'category', 'Genre / Subject', 'Chi Hrang', 'select', true, '["Science", "Literature", "Mathematics", "History", "Mizo Studies"]'::jsonb, 4),
  ('00000000-0000-0000-0000-000000000715', '00000000-0000-0000-0000-000000000701', 'copies', 'Total Copies', 'Copy Awmzat', 'number', true, '[]'::jsonb, 5)
ON CONFLICT (entity_id, field_name) DO NOTHING;

-- 3. Seed Sample Custom Records for Library
INSERT INTO custom_records (
  id, tenant_id, entity_id, data
) VALUES
  (
    '00000000-0000-0000-0000-000000000721',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000701',
    '{"title": "Mizo Thawnthu Ropui", "author": "B. Lalthangliana", "isbn": "978-81-90123-01", "category": "Mizo Studies", "copies": 15}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000722',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000701',
    '{"title": "Concepts of Physics (Vol 1)", "author": "H.C. Verma", "isbn": "978-81-7709-187-7", "category": "Science", "copies": 25}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Certificate Templates
INSERT INTO certificate_templates (
  id, tenant_id, template_type, title, title_lus, body_template, body_template_lus
) VALUES
  (
    '00000000-0000-0000-0000-000000000801',
    '00000000-0000-0000-0000-000000000001',
    'transfer',
    'Transfer Certificate (School Leaving Deed)',
    'Transfer Certificate (School Chhuahna)',
    'This is to certify that {{student_name}}, son/daughter of {{father_name}}, Admission No: {{admission_no}}, was a student of this institution in {{class}}. He/She has paid all school dues and fees up to the current month. Reason for leaving: {{leaving_reason}}. Conduct and character during the academic session was {{conduct}}.',
    'He lehkha hian a hriattir chu, {{student_name}}, {{father_name}} fa, Admission No: {{admission_no}} hi he school-ah hian {{class}} a zir a ni a. School fee zawng zawng a pe tling tawh e. School chhuah chhan: {{leaving_reason}}. A mizia leh nungchang chu {{conduct}} a ni e.'
  ),
  (
    '00000000-0000-0000-0000-000000000802',
    '00000000-0000-0000-0000-000000000001',
    'bonafide',
    'Bonafide Student Certificate',
    'Zirlai A Ni Ngei Tih Hriattirna',
    'This is to certify that {{student_name}}, bearing Admission Number {{admission_no}}, is a bonafide student of Class {{class}} of Mount Carmel Higher Secondary School, Aizawl for the Academic Session {{academic_year}}.',
    'He lehkha hian a nemnghet chu, {{student_name}}, Admission Number {{admission_no}} hi Mount Carmel Higher Secondary School, Aizawl-ah Class {{class}} zirlai tak tak a ni e.'
  )
ON CONFLICT (id) DO NOTHING;


-- ====================================================================
-- FILE: 00017_ai_copilot.sql
-- ====================================================================

-- Migration 00017: AI Copilot, Conversations, Usage Quotas, and Help Search
-- Phase 2 Milestone 8

-- 1. AI Usage & Token Tracking
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  mode VARCHAR(50) NOT NULL CHECK (mode IN ('guide', 'data', 'action', 'general')),
  tokens_used INT NOT NULL DEFAULT 0,
  model VARCHAR(100) NOT NULL,
  cost_cents NUMERIC(10, 4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_tenant_month ON ai_usage(tenant_id, created_at);

-- 2. AI Conversations
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
  mode VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (mode IN ('guide', 'data', 'action', 'general')),
  language VARCHAR(10) NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'lus')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_tenant_user ON ai_conversations(tenant_id, user_id, updated_at DESC);

-- 3. AI Messages
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id, created_at ASC);

-- 4. Help Articles & Knowledge Base
CREATE TABLE IF NOT EXISTS help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module VARCHAR(50) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title_en VARCHAR(255) NOT NULL,
  title_lus VARCHAR(255) NOT NULL,
  content_en TEXT NOT NULL,
  content_lus TEXT NOT NULL,
  deep_link VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'guide',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_help_articles_module ON help_articles(module);

-- 5. Search Help Function
CREATE OR REPLACE FUNCTION search_help(
  query_text TEXT,
  lang TEXT DEFAULT 'en',
  target_module TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  module VARCHAR(50),
  slug VARCHAR(100),
  title VARCHAR(255),
  content TEXT,
  deep_link VARCHAR(255),
  rank FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    h.id,
    h.module,
    h.slug,
    CASE WHEN lang = 'lus' THEN h.title_lus ELSE h.title_en END AS title,
    CASE WHEN lang = 'lus' THEN h.content_lus ELSE h.content_en END AS content,
    h.deep_link,
    CASE
      WHEN lang = 'lus' AND (h.title_lus ILIKE '%' || query_text || '%' OR h.content_lus ILIKE '%' || query_text || '%') THEN 1.0
      WHEN lang != 'lus' AND (h.title_en ILIKE '%' || query_text || '%' OR h.content_en ILIKE '%' || query_text || '%') THEN 1.0
      ELSE 0.5
    END::FLOAT AS rank
  FROM help_articles h
  WHERE
    (target_module IS NULL OR h.module = target_module)
    AND (
      (lang = 'lus' AND (h.title_lus ILIKE '%' || query_text || '%' OR h.content_lus ILIKE '%' || query_text || '%'))
      OR
      (lang != 'lus' AND (h.title_en ILIKE '%' || query_text || '%' OR h.content_en ILIKE '%' || query_text || '%'))
    )
  ORDER BY rank DESC, h.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Quota Check Function
CREATE OR REPLACE FUNCTION check_ai_quota(t_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_plan_id TEXT;
  v_used INT;
  v_quota INT := 0;
  v_start_of_month TIMESTAMPTZ;
BEGIN
  SELECT plan_id INTO v_plan_id FROM tenants WHERE id = t_id;
  v_start_of_month := date_trunc('month', NOW());

  IF v_plan_id = 'ultimate' THEN
    v_quota := 3000;
  ELSE
    v_quota := 0;
  END IF;

  SELECT COUNT(*) INTO v_used
  FROM ai_usage
  WHERE tenant_id = t_id AND created_at >= v_start_of_month;

  RETURN jsonb_build_object(
    'plan_id', v_plan_id,
    'used', v_used,
    'quota', v_quota,
    'allowed', (v_plan_id = 'ultimate' AND v_used < v_quota)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RLS Configuration
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

-- Help articles: readable by all authenticated users
CREATE POLICY help_articles_select_policy ON help_articles
  FOR SELECT TO authenticated USING (true);

-- AI Usage: Tenant members can view their tenant's aggregate usage
CREATE POLICY ai_usage_select_policy ON ai_usage
  FOR SELECT TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'platform_owner'
    )
  );

CREATE POLICY ai_usage_insert_policy ON ai_usage
  FOR INSERT TO authenticated
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- AI Conversations: Tenant users manage their own conversations
CREATE POLICY ai_conversations_all_policy ON ai_conversations
  FOR ALL TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- AI Messages: Users manage messages in conversations of their tenant
CREATE POLICY ai_messages_all_policy ON ai_messages
  FOR ALL TO authenticated
  USING (
    conversation_id IN (
      SELECT c.id FROM ai_conversations c
      JOIN profiles p ON p.tenant_id = c.tenant_id
      WHERE p.id = auth.uid()
    )
  )
  WITH CHECK (
    conversation_id IN (
      SELECT c.id FROM ai_conversations c
      JOIN profiles p ON p.tenant_id = c.tenant_id
      WHERE p.id = auth.uid()
    )
  );


-- ====================================================================
-- FILE: 00018_ai_copilot_seed.sql
-- ====================================================================

-- Migration 00018: AI Copilot Knowledge Base & Help Articles Seed Data
-- Phase 2 Milestone 8

INSERT INTO help_articles (
  id, module, slug, title_en, title_lus, content_en, content_lus, deep_link, category
) VALUES
  (
    '00000000-0000-0000-0000-000000000801',
    'students',
    'how-to-enroll-students',
    'How to Enroll and Manage Students',
    'Zirlai Lakluh leh Enkawl Dan',
    'Navigate to Admin -> Students & Guardians or Data Hub -> Import. You can either register students individually using the New Admission form or import an entire batch using the Excel Import Center template (.xlsx). Required fields include Admission No, Full Name, Class, Section, and Guardian Contact.',
    'Admin -> Students & Guardians emaw Data Hub -> Import ah kal rawh. Zirlai mal te tein Luh Dilna Form hmangin a lakluh theih a, Excel Import Center hmangin zirlai tam tak (.xlsx) a rualin a lakluh theih bawk. Thil pawimawh zualte chu Admission No, Hming, Pawl, Section, leh Enkawltu Biakpawhna an ni.',
    '/admin/students',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000802',
    'fees',
    'how-to-collect-fees-and-track-defaulters',
    'Fee Collection and Defaulter Tracking',
    'Fee Khawn leh Ba En Dan',
    'Go to Admin -> Fees & Receipts. Here you can generate student invoices, record offline cash payments with instant receipts, and monitor outstanding dues. In the Defaulters tab, filter by class to see overdue balances and trigger automated SMS or WhatsApp payment reminders.',
    'Admin -> Fees & Receipts ah kal rawh. Hetah hian zirlai fee bill siam, pawisa fai lut chhinchhiah leh receipt pek chhuah, leh fee ba la awmte a en theih. Defaulters tab-ah pawl hrang hranga fee ba la awmte thliar hrangin SMS emaw WhatsApp hriattirna a thawn theih.',
    '/admin/fees',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000803',
    'exams',
    'how-to-enter-marks-and-generate-marksheets',
    'Marks Entry and Report Cards Generation',
    'Marks Chhutluh leh Marksheet Siam Dan',
    'Access Admin -> Exams & Marksheets. Select the Exam term, Class, and Subject to enter marks directly in the keyboard-optimized spreadsheet grid or upload via Excel. Once verified, click Publish to compute ranks and generate official printable A4/CR80 marksheets with verification QR codes.',
    'Admin -> Exams & Marksheets ah kal rawh. Exam term, Pawl, leh Subject thlang la, marks spreadsheet grid ah chhut lut rawh emaw Excel hmangin thun lut rawh. Verification zawhah Publish hmet la, rank leh result chhut chhuah niin A4/CR80 marksheet QR code nena print theih a inpeih ang.',
    '/admin/exams',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000804',
    'staff',
    'how-to-manage-staff-and-faculty-roster',
    'Managing Staff and Faculty Public Sync',
    'Zirtirtu leh Staff Enkawl Dan',
    'Go to Admin -> Staff & Teachers. Create employee profiles with designation, qualifications, and assigned classes. Enabling the "Show on Website" toggle automatically updates the public website Faculty page without double data entry.',
    'Admin -> Staff & Teachers ah kal rawh. Staff profile siamin hna chelh, zirna, leh pawl enkawlte dah la. "Show on Website" tih hmeh khian school website public mipuite hmuh theih turin a thun nghal vek ang.',
    '/admin/staff',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000805',
    'id_cards',
    'how-to-generate-id-cards',
    'Generating CR80 Student and Staff ID Cards',
    'CR80 ID Card Siama Print Dan',
    'Open Admin -> ID Card Generator. Choose between Students or Staff, select the class or department, and inspect the missing-photo preflight check. Print single cards or bulk 8-up A4 printable sheets with high-resolution QR verification.',
    'Admin -> ID Card Generator hawng rawh. Zirlai emaw Staff thlang la, class thlannaah thlalak kimlo endik hmasa rawh. Card pakhat emaw A4 sheet pakhatah card 8 zel zetin print chhuah theih a ni a, QR code hriatpuina felfai a keng tel bawk.',
    '/admin/id-cards',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000806',
    'attendance',
    'how-to-mark-attendance-and-send-alerts',
    'Daily Attendance Marking and Low-Attendance Alerts',
    'Ni Tin Kallam Chhinchhiah leh Hriattirna Thawn Dan',
    'Open Admin -> Attendance. Select class and date to mark Present, Absent, Late, or Excused with 1-click batch actions. The system automatically computes monthly percentages and flags students with attendance below 75% for parent notifications.',
    'Admin -> Attendance hawng rawh. Pawl leh ni thlang la, Kal, Kallo, Tlai, emaw Chawl phalna hmet zung zung rawh. System-in thla bi kallam chhutin za zela 75% tlinglo te chu nu leh pa hriattir turin a tarlang nghal thin.',
    '/admin/attendance',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000807',
    'certificates',
    'how-to-issue-transfer-certificates',
    'Issuing Transfer & Bonafide Certificates',
    'Transfer Certificate (TC) leh Bonafide Pekchhuah Dan',
    'Visit Admin -> Certificates. Select the student to automatically merge admission details, conduct record, and leaving date into official institutional formats. Issued certificates receive a tamper-proof sequential number (e.g. TC-MC-2024-001) and public QR verification.',
    'Admin -> Certificates ah kal rawh. Zirlai thlan rualin admission data leh nungchang record a la lut nghal ang. TC pek chhuahah serial number danglam (e.g. TC-MC-2024-001) leh QR code rintlak a inziak nghal a ni.',
    '/admin/certificates',
    'guide'
  ),
  (
    '00000000-0000-0000-0000-000000000808',
    'builder',
    'how-to-build-custom-modules',
    'Building Custom No-Code Modules',
    'No-Code Module Siam Dan',
    'Visit Admin -> Custom Module Builder. Create entities (such as Library, Transport, Inventory) with custom fields (text, number, date, relation). Data records are stored in schemaless JSONB with index support and instantly appear in navigation.',
    'Admin -> Custom Module Builder ah kal rawh. Module thar (Lehkhabu, Bus, Hmanraw Enkawlna) siamin field duhzawng dah la. System-in navigation sidebar-ah a dah nghal zung zung ang.',
    '/admin/builder',
    'guide'
  )
ON CONFLICT (slug) DO UPDATE SET
  title_en = EXCLUDED.title_en,
  title_lus = EXCLUDED.title_lus,
  content_en = EXCLUDED.content_en,
  content_lus = EXCLUDED.content_lus,
  deep_link = EXCLUDED.deep_link;

-- 2. Seed Initial AI Usage Record for Mount Carmel School
INSERT INTO ai_usage (
  id, tenant_id, mode, tokens_used, model, cost_cents
) VALUES
  (
    '00000000-0000-0000-0000-000000000810',
    '00000000-0000-0000-0000-000000000001',
    'guide',
    420,
    'claude-haiku-4-5-20251001',
    0.042
  ),
  (
    '00000000-0000-0000-0000-000000000811',
    '00000000-0000-0000-0000-000000000001',
    'data',
    850,
    'claude-sonnet-5-5',
    0.125
  );
