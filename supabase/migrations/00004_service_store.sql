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
