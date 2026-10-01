-- ============================================================================
-- 00006_data_hub_and_staff.sql: Master Data Hub, Staff Module & Import Tracking
-- ============================================================================

-- 1. Staff Master Records Table
create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id text not null,
  full_name text not null,
  gender text check (gender in ('male', 'female', 'other')),
  dob date,
  photo_url text,
  designation text not null,
  department text default 'Teaching',
  employment_type text check (employment_type in ('full_time', 'part_time', 'contractual', 'guest')) default 'full_time',
  qualification text,
  experience_years numeric(4,1) default 0,
  joining_date date default current_date,
  phone text,
  email text,
  address text,
  emergency_contact_name text,
  emergency_contact_phone text,
  id_document_type text, -- e.g. 'Aadhaar', 'PAN', 'Voter ID'
  id_document_number text,
  subjects_taught jsonb default '[]'::jsonb, -- e.g. ["Mathematics", "Physics"]
  classes_assigned jsonb default '[]'::jsonb, -- e.g. ["Class IX-A", "Class X-B"]
  class_teacher_of text, -- e.g. "Class X-A"
  show_on_website boolean default false,
  website_bio text,
  status text check (status in ('active', 'on_leave', 'resigned', 'terminated')) default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (tenant_id, employee_id)
);

create index if not exists idx_staff_profiles_tenant on public.staff_profiles(tenant_id);
create index if not exists idx_staff_profiles_emp_id on public.staff_profiles(tenant_id, employee_id);

-- 2. Import Batches Table
create table if not exists public.import_batches (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  batch_number text not null unique,
  entity_type text not null check (entity_type in ('students', 'guardians', 'staff', 'subjects', 'opening_balances')),
  mode text not null check (mode in ('create_only', 'update_only', 'upsert')),
  file_name text not null,
  total_rows integer not null default 0,
  created_count integer not null default 0,
  updated_count integer not null default 0,
  skipped_count integer not null default 0,
  error_count integer not null default 0,
  status text not null check (status in ('pending', 'validating', 'dry_run_success', 'completed', 'rolled_back', 'failed')) default 'pending',
  snapshot_data jsonb default '{}'::jsonb, -- records previous states for undo/rollback
  created_by text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create index if not exists idx_import_batches_tenant on public.import_batches(tenant_id);

-- 3. Import Errors Diagnostics Table
create table if not exists public.import_errors (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.import_batches(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  row_number integer not null,
  field_name text,
  value_provided text,
  error_type text not null, -- e.g. 'duplicate_key', 'invalid_date', 'required_missing'
  error_message text not null,
  created_at timestamptz default now()
);

create index if not exists idx_import_errors_batch on public.import_errors(batch_id);

-- 4. Enable Row Level Security
alter table public.staff_profiles enable row level security;
alter table public.import_batches enable row level security;
alter table public.import_errors enable row level security;

-- 5. Tenant RLS Policies
drop policy if exists "Tenant staff profiles isolation" on public.staff_profiles;
create policy "Tenant staff profiles isolation"
  on public.staff_profiles for all using (
    tenant_id = (select private.current_tenant_id()) or (select private.is_platform_owner())
  );

drop policy if exists "Tenant import batches isolation" on public.import_batches;
create policy "Tenant import batches isolation"
  on public.import_batches for all using (
    tenant_id = (select private.current_tenant_id()) or (select private.is_platform_owner())
  );

drop policy if exists "Tenant import errors isolation" on public.import_errors;
create policy "Tenant import errors isolation"
  on public.import_errors for all using (
    tenant_id = (select private.current_tenant_id()) or (select private.is_platform_owner())
  );

-- 6. Trigger: Sync staff_profiles with public.faculty when show_on_website = true
create or replace function public.sync_staff_to_faculty()
returns trigger as $$
begin
  if new.show_on_website = true and new.status = 'active' then
    insert into public.faculty (
      tenant_id,
      name,
      designation,
      qualification,
      photo_url,
      bio,
      is_published
    ) values (
      new.tenant_id,
      new.full_name,
      new.designation,
      new.qualification,
      new.photo_url,
      coalesce(new.website_bio, new.designation || ' at ' || (select name from public.tenants where id = new.tenant_id)),
      true
    )
    on conflict do nothing;
  else
    -- If toggled off or inactive, unpublish faculty record
    update public.faculty
    set is_published = false
    where tenant_id = new.tenant_id and name = new.full_name;
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists trg_sync_staff_faculty on public.staff_profiles;
create trigger trg_sync_staff_faculty
after insert or update on public.staff_profiles
for each row execute function public.sync_staff_to_faculty();
