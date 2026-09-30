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
