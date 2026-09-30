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
