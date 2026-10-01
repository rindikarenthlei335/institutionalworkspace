-- ============================================================================
-- 00002_cms.sql: Website CMS Tables & RLS Policies
-- ============================================================================

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants(id) on delete cascade,
  school_name text not null,
  tagline text,
  logo_url text,
  favicon_url text,
  affiliation text,
  established_year integer,
  theme_preset text not null default 'forest',
  primary_color text not null default '#1F4D3A',
  contact_phone text,
  contact_email text,
  contact_address text,
  map_coordinates text,
  working_hours text,
  seo_title text,
  seo_description text,
  seo_og_image text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.about_content (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null unique references public.tenants(id) on delete cascade,
  mission text,
  vision text,
  objectives jsonb default '[]'::jsonb,
  history text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.home_slides (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  subtitle text,
  image_url text not null,
  cta_text text,
  cta_link text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_home_slides_tenant on public.home_slides(tenant_id);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  category text,
  description text,
  image_url text,
  achievement_date date,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  category text,
  description text,
  image_url text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_albums (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  cover_image text,
  event_date date,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  album_id uuid not null references public.gallery_albums(id) on delete cascade,
  image_url text not null,
  caption text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.faculty (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  designation text not null,
  qualification text,
  subjects text,
  experience text,
  bio text,
  photo_url text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  contact_visible boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.facilities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  description text,
  image_url text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  title text not null,
  body text not null,
  category text default 'General',
  attachment_url text,
  is_pinned boolean not null default false,
  publish_at timestamptz not null default now(),
  expire_at timestamptz,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index idx_notices_tenant on public.notices(tenant_id);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Enable RLS on CMS tables
alter table public.site_settings enable row level security;
alter table public.about_content enable row level security;
alter table public.home_slides enable row level security;
alter table public.achievements enable row level security;
alter table public.activities enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery_images enable row level security;
alter table public.faculty enable row level security;
alter table public.facilities enable row level security;
alter table public.notices enable row level security;
alter table public.contact_messages enable row level security;

-- CMS RLS Policies: Public select if published, full staff control within tenant
do $$
declare
  t text;
begin
  for t in select unnest(array['site_settings', 'about_content', 'home_slides', 'achievements', 'activities', 'gallery_albums', 'gallery_images', 'faculty', 'facilities', 'notices'])
  loop
    execute format('
      create policy "%s anon read" on public.%s for select using (
        tenant_id = private.current_tenant_id() and (is_published = true or private.current_role() in (''school_super_admin'', ''school_admin'', ''data_entry_operator''))
      );
      create policy "%s staff write" on public.%s for all using (
        tenant_id = private.current_tenant_id() and private.current_role() in (''school_super_admin'', ''school_admin'', ''data_entry_operator'') or private.is_platform_owner()
      );
    ', t, t, t, t);
  end loop;
end $$;

-- Contact Messages Policy
create policy "Contact insert anon" on public.contact_messages for insert with check (
  tenant_id = private.current_tenant_id()
);
create policy "Contact select staff" on public.contact_messages for select using (
  tenant_id = private.current_tenant_id() and private.current_role() in ('school_super_admin', 'school_admin') or private.is_platform_owner()
);
