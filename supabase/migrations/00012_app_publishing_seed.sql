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
