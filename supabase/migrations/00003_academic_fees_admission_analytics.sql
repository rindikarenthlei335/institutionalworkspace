-- ============================================================================
-- 00003_academic_fees_admission_analytics.sql: Academic, Fees, Admissions, Analytics
-- ============================================================================

-- ACADEMICS
create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  year_label text not null, -- e.g. "2024-2025"
  start_date date not null,
  end_date date not null,
  is_current boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null, -- e.g. "Class I", "Class VIII"
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  name text not null, -- e.g. "A", "B"
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  admission_no text not null,
  roll_no integer,
  class_id uuid not null references public.classes(id),
  section_id uuid references public.sections(id),
  full_name text not null,
  dob date not null,
  gender text not null check (gender in ('male', 'female', 'other')),
  residence_type text not null default 'day' check (residence_type in ('day', 'hosteller')),
  status text not null default 'active' check (status in ('active', 'inactive', 'graduated', 'transferred')),
  admission_date date not null default current_date,
  address text,
  blood_group text,
  photo_url text,
  extra jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, admission_no)
);
create index idx_students_tenant on public.students(tenant_id);

create table if not exists public.guardians (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  relation text not null default 'parent',
  full_name text not null,
  phone text not null,
  email text,
  occupation text,
  address text,
  created_at timestamptz not null default now()
);

-- FEES
create table if not exists public.fee_heads (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null, -- e.g. "Tuition Fee", "Hostel Fee", "Admission Fee"
  code text not null,
  type text not null default 'recurring' check (type in ('recurring', 'one_time', 'optional')),
  created_at timestamptz not null default now()
);

create table if not exists public.fee_structures (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  academic_year_id uuid not null references public.academic_years(id),
  class_id uuid not null references public.classes(id),
  residence_type text not null default 'day' check (residence_type in ('day', 'hosteller')),
  fee_head_id uuid not null references public.fee_heads(id),
  amount numeric(12,2) not null default 0,
  due_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  invoice_no text not null,
  student_id uuid not null references public.students(id),
  academic_year_id uuid not null references public.academic_years(id),
  total_amount numeric(12,2) not null default 0,
  paid_amount numeric(12,2) not null default 0,
  due_date date not null,
  status text not null default 'pending' check (status in ('pending', 'partial', 'paid', 'overdue', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(tenant_id, invoice_no)
);
create index idx_invoices_tenant on public.invoices(tenant_id);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  invoice_id uuid not null references public.invoices(id),
  amount_paid numeric(12,2) not null,
  payment_mode text not null check (payment_mode in ('online', 'cash', 'upi', 'cheque', 'dd')),
  gateway_order_id text,
  gateway_payment_id text,
  status text not null default 'completed' check (status in ('pending', 'completed', 'failed', 'refunded')),
  idempotency_key text not null unique,
  paid_at timestamptz not null default now(),
  collected_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.receipts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  receipt_no text not null,
  payment_id uuid not null unique references public.payments(id),
  pdf_key text,
  created_at timestamptz not null default now(),
  unique(tenant_id, receipt_no)
);

-- ADMISSIONS
create table if not exists public.admission_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants(id) on delete cascade,
  is_open boolean not null default true,
  academic_year_id uuid references public.academic_years(id),
  admission_fee numeric(12,2) not null default 500,
  open_date date,
  close_date date,
  instructions text,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  application_no text not null,
  class_id uuid not null references public.classes(id),
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'payment_pending', 'under_review', 'approved', 'rejected', 'waitlisted', 'enrolled')),
  student_name text not null,
  dob date not null,
  gender text not null,
  residence_type text not null default 'day',
  guardian_name text not null,
  guardian_phone text not null,
  guardian_email text not null,
  address text,
  parent_consent boolean not null default false,
  payment_id uuid references public.payments(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(tenant_id, application_no)
);

-- ANALYTICS
create table if not exists public.site_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  path text not null,
  referrer text,
  device text,
  country text,
  created_at timestamptz not null default now()
);
create index idx_site_events_tenant on public.site_events(tenant_id);

-- Sequence generation functions (Race safe)
create or replace function public.generate_admission_no(p_tenant_id uuid)
returns text
language plpgsql
as $$
declare
  v_seq integer;
begin
  select count(*) + 1 into v_seq
  from public.students
  where tenant_id = p_tenant_id;
  return 'ADM-' || to_char(now(), 'YYYY') || '-' || lpad(v_seq::text, 4, '0');
end;
$$;

create or replace function public.generate_receipt_no(p_tenant_id uuid)
returns text
language plpgsql
as $$
declare
  v_seq integer;
begin
  select count(*) + 1 into v_seq
  from public.receipts
  where tenant_id = p_tenant_id;
  return 'REC-' || to_char(now(), 'YYYY') || '-' || lpad(v_seq::text, 5, '0');
end;
$$;

-- Enable RLS
alter table public.academic_years enable row level security;
alter table public.classes enable row level security;
alter table public.sections enable row level security;
alter table public.students enable row level security;
alter table public.guardians enable row level security;
alter table public.fee_heads enable row level security;
alter table public.fee_structures enable row level security;
alter table public.invoices enable row level security;
alter table public.payments enable row level security;
alter table public.receipts enable row level security;
alter table public.admission_settings enable row level security;
alter table public.applications enable row level security;
alter table public.site_events enable row level security;

-- Academic Policies
create policy "Academic read policy" on public.academic_years for select using (tenant_id = private.current_tenant_id());
create policy "Classes read policy" on public.classes for select using (tenant_id = private.current_tenant_id());
create policy "Sections read policy" on public.sections for select using (tenant_id = private.current_tenant_id());

-- Student Policies (Strict, No Anon)
create policy "Students staff policy" on public.students for all using (
  tenant_id = private.current_tenant_id() and private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'accountant', 'teacher') or private.is_platform_owner()
);

-- Fee Policies
create policy "Fee heads staff policy" on public.fee_heads for all using (
  tenant_id = private.current_tenant_id() and private.current_role() in ('school_super_admin', 'school_admin', 'accountant') or private.is_platform_owner()
);
create policy "Invoices tenant policy" on public.invoices for all using (
  tenant_id = private.current_tenant_id() and private.current_role() in ('school_super_admin', 'school_admin', 'accountant', 'parent') or private.is_platform_owner()
);
create policy "Payments tenant policy" on public.payments for all using (
  tenant_id = private.current_tenant_id() and private.current_role() in ('school_super_admin', 'school_admin', 'accountant', 'parent') or private.is_platform_owner()
);

-- Application Policies
create policy "Applications anon insert" on public.applications for insert with check (
  tenant_id = private.current_tenant_id()
);
create policy "Applications staff select" on public.applications for select using (
  tenant_id = private.current_tenant_id() and private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator') or private.is_platform_owner()
);

-- Analytics Policy
create policy "Analytics insert anon" on public.site_events for insert with check (tenant_id = private.current_tenant_id());
create policy "Analytics select admin" on public.site_events for select using (
  tenant_id = private.current_tenant_id() and private.current_role() in ('school_super_admin', 'school_admin') or private.is_platform_owner()
);
