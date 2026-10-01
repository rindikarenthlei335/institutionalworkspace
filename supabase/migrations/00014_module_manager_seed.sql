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
