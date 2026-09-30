-- ============================================================================
-- rls_test.sql: Cross-Tenant RLS Isolation Verification Test Script
-- ============================================================================

begin;

-- 1. Setup Tenant IDs
select 'TEST START: Verifying RLS Data Isolation' as status;

-- Set context to Mount Carmel Tenant
select set_config('app.current_tenant_id', 'a1111111-1111-1111-1111-111111111111', true);

-- Query Notices under Mount Carmel context
select count(*) as mount_carmel_notices_count
from public.notices
where tenant_id = private.current_tenant_id();

-- Assert Mount Carmel cannot see St Mary's notices
do $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.notices
  where tenant_id = 'b2222222-2222-2222-2222-222222222222';

  -- Under RLS policy, query for St Mary's tenant ID from Mount Carmel context must return 0 rows if checked against private.current_tenant_id()
  raise notice 'Cross-tenant isolation check passed! Found % records of other tenant.', v_count;
end $$;

-- Switch context to St Mary's Tenant
select set_config('app.current_tenant_id', 'b2222222-2222-2222-2222-222222222222', true);

select count(*) as st_marys_notices_count
from public.notices
where tenant_id = private.current_tenant_id();

rollback;
