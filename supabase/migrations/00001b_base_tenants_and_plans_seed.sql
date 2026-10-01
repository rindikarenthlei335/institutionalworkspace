-- ============================================================================
-- 00001b_base_tenants_and_plans_seed.sql: 4 Platform Plans & Default Tenants
-- ============================================================================

-- 1. Insert 4 Plans
INSERT INTO public.plans (id, name, price_monthly, storage_limit_bytes, ui_level) VALUES
  ('basic', 'Basic Plan', 1499, 2147483648, 1),
  ('essential', 'Essential Plan', 3999, 5368709120, 1),
  ('pro', 'Pro Plan', 8000, 21474836480, 2),
  ('ultimate', 'Ultimate Plan', 9999, 53687091200, 2)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_monthly = EXCLUDED.price_monthly,
  storage_limit_bytes = EXCLUDED.storage_limit_bytes,
  ui_level = EXCLUDED.ui_level;

-- 2. Insert Default Tenants (Mount Carmel & St Mary's)
INSERT INTO public.tenants (id, name, subdomain, status, plan_id, paid_till) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Mount Carmel School',
    'mountcarmel',
    'active',
    'ultimate',
    NOW() + INTERVAL '1 year'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'St. Marys School',
    'stmarys',
    'active',
    'basic',
    NOW() + INTERVAL '6 months'
  ),
  (
    'a1111111-1111-1111-1111-111111111111',
    'Mount Carmel Higher Secondary School',
    'mountcarmelhss',
    'active',
    'ultimate',
    NOW() + INTERVAL '1 year'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subdomain = EXCLUDED.subdomain,
  plan_id = EXCLUDED.plan_id;

-- 3. Insert Tenant Domains
INSERT INTO public.tenant_domains (tenant_id, hostname, type, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'mountcarmel.eduportal.com', 'subdomain', 'active'),
  ('00000000-0000-0000-0000-000000000002', 'stmarys.eduportal.com', 'subdomain', 'active')
ON CONFLICT (hostname) DO NOTHING;
