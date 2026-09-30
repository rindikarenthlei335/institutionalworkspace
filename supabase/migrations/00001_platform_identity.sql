-- ============================================================================
-- 00001_platform_identity.sql: Private schema, helpers, platform tables, profiles
-- ============================================================================

-- Create private schema for security definer helpers
create schema if not exists private;

-- Helper: Get current tenant ID from request context setting or fallback
create or replace function private.current_tenant_id()
returns uuid
language plpgsql
stable security definer
set search_path = ''
as $$
declare
  v_tenant_id text;
begin
  v_tenant_id := current_setting('request.jwt.claims', true)::json->>'tenant_id';
  if v_tenant_id is null or v_tenant_id = '' then
    v_tenant_id := current_setting('app.current_tenant_id', true);
  end if;
  if v_tenant_id is null or v_tenant_id = '' then
    return null;
  end if;
  return v_tenant_id::uuid;
exception
  when others then
    return null;
end;
$$;

-- Helper: Get current user role from profiles
create or replace function private.current_role()
returns text
language plpgsql
stable security definer
set search_path = ''
as $$
declare
  v_role text;
begin
  select role into v_role
  from public.profiles
  where id = auth.uid();
  return coalesce(v_role, 'anon');
end;
$$;

-- Helper: Check if current user is platform owner
create or replace function private.is_platform_owner()
returns boolean
language plpgsql
stable security definer
set search_path = ''
as $$
begin
  return (private.current_role() = 'platform_owner');
end;
$$;

-- Helper: Check if feature key is enabled for tenant
create or replace function private.has_feature(p_feature_key text)
returns boolean
language plpgsql
stable security definer
set search_path = ''
as $$
declare
  v_tenant_id uuid;
  v_plan_id text;
  v_override boolean;
  v_enabled boolean;
begin
  v_tenant_id := private.current_tenant_id();
  if v_tenant_id is null then
    return false;
  end if;

  -- Check tenant feature overrides first
  select is_enabled into v_override
  from public.tenant_feature_overrides
  where tenant_id = v_tenant_id and feature_key = p_feature_key;

  if v_override is not null then
    return v_override;
  end if;

  -- Check plan features
  select t.plan_id into v_plan_id
  from public.tenants t
  where t.id = v_tenant_id;

  select count(*) > 0 into v_enabled
  from public.plan_features pf
  where pf.plan_id = v_plan_id and pf.feature_key = p_feature_key;

  return coalesce(v_enabled, false);
end;
$$;

-- ============================================================================
-- PLATFORM TABLES
-- ============================================================================

create table if not exists public.plans (
  id text primary key,
  name text not null,
  price_monthly numeric(12,2) not null default 0,
  storage_limit_bytes bigint not null default 2147483648, -- 2GB
  ui_level integer not null default 1 check (ui_level in (1, 2)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plan_features (
  plan_id text not null references public.plans(id) on delete cascade,
  feature_key text not null,
  created_at timestamptz not null default now(),
  primary key (plan_id, feature_key)
);

create table if not exists public.addons (
  id text primary key,
  name text not null,
  description text,
  price_monthly numeric(12,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subdomain text not null unique,
  status text not null default 'active' check (status in ('active', 'suspended', 'pending')),
  plan_id text not null references public.plans(id),
  billing_cycle text not null default 'monthly',
  trial_ends_at timestamptz,
  paid_till timestamptz,
  subscription_status text not null default 'active',
  default_locale text not null default 'en',
  timezone text not null default 'Asia/Kolkata',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tenant_feature_overrides (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  feature_key text not null,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  primary key (tenant_id, feature_key)
);

create table if not exists public.tenant_domains (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  hostname text not null unique,
  type text not null check (type in ('subdomain', 'custom')),
  status text not null default 'active' check (status in ('pending', 'verifying', 'active', 'failed')),
  cf_hostname_id text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_tenant_domains_hostname on public.tenant_domains(hostname);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid references public.tenants(id) on delete cascade,
  role text not null check (role in ('platform_owner', 'school_super_admin', 'school_admin', 'data_entry_operator', 'accountant', 'teacher', 'parent', 'student')),
  full_name text not null,
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_profiles_tenant_id on public.profiles(tenant_id);

create table if not exists public.domain_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  desired_domain text not null,
  tld text not null,
  status text not null default 'Requested' check (status in ('Requested', 'Documents received', 'Registered', 'DNS setup', 'Live', 'Rejected')),
  registrar text,
  registrant_name text,
  expiry_date timestamptz,
  renewal_status text default 'ok',
  paid_till timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.service_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  type text not null check (type in ('google_submit', 'maps_register', 'seo_other', 'white_label_app', 'other')),
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')),
  price numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  table_name text not null,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_logs_tenant_id on public.audit_logs(tenant_id);

-- Enable RLS on platform tables
alter table public.plans enable row level security;
alter table public.plan_features enable row level security;
alter table public.addons enable row level security;
alter table public.tenants enable row level security;
alter table public.tenant_feature_overrides enable row level security;
alter table public.tenant_domains enable row level security;
alter table public.profiles enable row level security;
alter table public.domain_requests enable row level security;
alter table public.service_requests enable row level security;
alter table public.audit_logs enable row level security;

-- Global Read Policies for reference data
create policy "Plans read all" on public.plans for select using (true);
create policy "Plan features read all" on public.plan_features for select using (true);
create policy "Addons read all" on public.addons for select using (true);

-- Tenants RLS
create policy "Tenants select policy" on public.tenants for select using (
  id = private.current_tenant_id() or private.is_platform_owner() or status = 'active'
);
create policy "Tenants update policy" on public.tenants for update using (
  (id = private.current_tenant_id() and private.current_role() in ('school_super_admin')) or private.is_platform_owner()
);

-- Tenant Domains RLS
create policy "Tenant domains select policy" on public.tenant_domains for select using (
  status = 'active' or tenant_id = private.current_tenant_id() or private.is_platform_owner()
);

-- Profiles RLS
create policy "Profiles select policy" on public.profiles for select using (
  id = auth.uid() or tenant_id = private.current_tenant_id() or private.is_platform_owner()
);
create policy "Profiles insert policy" on public.profiles for insert with check (
  private.is_platform_owner() or (tenant_id = private.current_tenant_id() and private.current_role() in ('school_super_admin'))
);
create policy "Profiles update policy" on public.profiles for update using (
  id = auth.uid() or (tenant_id = private.current_tenant_id() and private.current_role() in ('school_super_admin')) or private.is_platform_owner()
);

-- Domain & Service Requests RLS
create policy "Domain requests tenant policy" on public.domain_requests for all using (
  tenant_id = private.current_tenant_id() or private.is_platform_owner()
);
create policy "Service requests tenant policy" on public.service_requests for all using (
  tenant_id = private.current_tenant_id() or private.is_platform_owner()
);
create policy "Audit logs tenant policy" on public.audit_logs for select using (
  tenant_id = private.current_tenant_id() or private.is_platform_owner()
);
