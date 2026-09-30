-- ============================================================================
-- rls_test.sql: Comprehensive Cross-Tenant RLS Isolation Verification
-- ============================================================================

begin;

select 'TEST START: Verifying Multi-Tenant RLS Data Isolation' as status;

-- Setup Demo Tenant UUIDs
-- Tenant 1: Mount Carmel Higher Secondary School
-- Tenant 2: St. Mary's Convent High School
\set tenant_1 'a1111111-1111-1111-1111-111111111111'
\set tenant_2 'b2222222-2222-2222-2222-222222222222'

-- ============================================================================
-- 1. Test Notice Table Isolation
-- ============================================================================
select set_config('app.current_tenant_id', :'tenant_1', true);

do $$
declare
  v_count integer;
begin
  -- Mount Carmel context querying St Mary's data must yield 0
  select count(*) into v_count
  from public.notices
  where tenant_id = 'b2222222-2222-2222-2222-222222222222';

  if v_count > 0 then
    raise exception 'RLS VIOLATION: Tenant 1 accessed Tenant 2 notices!';
  end if;
  raise notice '✓ Notices RLS Isolation: PASSED';
end $$;

-- ============================================================================
-- 2. Test Student Record Isolation (Sensitive Academic Data)
-- ============================================================================
do $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.students
  where tenant_id = 'b2222222-2222-2222-2222-222222222222';

  if v_count > 0 then
    raise exception 'RLS VIOLATION: Tenant 1 accessed Tenant 2 student records!';
  end if;
  raise notice '✓ Students RLS Isolation: PASSED';
end $$;

-- ============================================================================
-- 3. Test Fee Invoice & Payment Isolation (Financial Data)
-- ============================================================================
do $$
declare
  v_invoices integer;
  v_payments integer;
begin
  select count(*) into v_invoices
  from public.invoices
  where tenant_id = 'b2222222-2222-2222-2222-222222222222';

  select count(*) into v_payments
  from public.payments
  where tenant_id = 'b2222222-2222-2222-2222-222222222222';

  if v_invoices > 0 or v_payments > 0 then
    raise exception 'RLS VIOLATION: Financial records breached cross-tenant boundary!';
  end if;
  raise notice '✓ Fee Invoices & Payments RLS Isolation: PASSED';
end $$;

-- ============================================================================
-- 4. Test Online Admissions Isolation (Minor Applicant Data)
-- ============================================================================
do $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.applications
  where tenant_id = 'b2222222-2222-2222-2222-222222222222';

  if v_count > 0 then
    raise exception 'RLS VIOLATION: Admission applications breached cross-tenant boundary!';
  end if;
  raise notice '✓ Online Admission Applications RLS Isolation: PASSED';
end $$;

-- ============================================================================
-- 5. Test Site Settings & CMS Isolation
-- ============================================================================
do $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.site_settings
  where tenant_id = 'b2222222-2222-2222-2222-222222222222';

  if v_count > 0 then
    raise exception 'RLS VIOLATION: Site settings breached cross-tenant boundary!';
  end if;
  raise notice '✓ Site Settings & CMS RLS Isolation: PASSED';
end $$;

-- Switch context to Tenant 2 and confirm reverse isolation
select set_config('app.current_tenant_id', :'tenant_2', true);

do $$
declare
  v_count integer;
begin
  select count(*) into v_count
  from public.students
  where tenant_id = 'a1111111-1111-1111-1111-111111111111';

  if v_count > 0 then
    raise exception 'RLS VIOLATION: Tenant 2 accessed Tenant 1 student records!';
  end if;
  raise notice '✓ Reverse Isolation Check (Tenant 2 -> Tenant 1): PASSED';
end $$;

select 'ALL RLS ISOLATION TESTS PASSED CLEANLY' as final_result;

rollback;
