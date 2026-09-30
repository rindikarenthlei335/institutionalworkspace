-- ============================================================================
-- seed.sql: Demo Seed Data for 2 Tenants (Mount Carmel & St Mary's)
-- ============================================================================

-- Seed Plans
insert into public.plans (id, name, price_monthly, storage_limit_bytes, ui_level) values
('basic', 'Basic Plan', 1499, 2147483648, 1),
('essential', 'Essential Plan', 3999, 5368709120, 1),
('pro', 'Pro Plan', 8000, 21474836480, 2)
on conflict (id) do update set price_monthly = excluded.price_monthly;

-- Seed Plan Features
insert into public.plan_features (plan_id, feature_key) values
('basic', 'public_website'), ('basic', 'theme_customization'), ('basic', 'cms_admin'), ('basic', 'custom_domain'), ('basic', 'domain_registration'),
('essential', 'public_website'), ('essential', 'theme_customization'), ('essential', 'cms_admin'), ('essential', 'user_management'), ('essential', 'student_management'), ('essential', 'fee_management'), ('essential', 'online_payment'), ('essential', 'online_admission'), ('essential', 'parent_portal'), ('essential', 'custom_domain'), ('essential', 'domain_registration'), ('essential', 'audit_logs'),
('pro', 'public_website'), ('pro', 'theme_customization'), ('pro', 'cms_admin'), ('pro', 'user_management'), ('pro', 'student_management'), ('pro', 'fee_management'), ('pro', 'online_payment'), ('pro', 'online_admission'), ('pro', 'parent_portal'), ('pro', 'website_analytics'), ('pro', 'principal_dashboard'), ('pro', 'custom_domain'), ('pro', 'domain_registration'), ('pro', 'audit_logs')
on conflict do nothing;

-- 1. TENANT 1: Mount Carmel School (Pro Plan)
insert into public.tenants (id, name, subdomain, status, plan_id, paid_till) values
('a1111111-1111-1111-1111-111111111111', 'Mount Carmel School', 'mountcarmel', 'active', 'pro', now() + interval '1 year')
on conflict (id) do nothing;

insert into public.tenant_domains (tenant_id, hostname, type, status) values
('a1111111-1111-1111-1111-111111111111', 'mountcarmel.eduportal.com', 'subdomain', 'active')
on conflict do nothing;

insert into public.site_settings (tenant_id, school_name, tagline, theme_preset, primary_color, contact_email, contact_phone, contact_address) values
('a1111111-1111-1111-1111-111111111111', 'Mount Carmel Higher Secondary School', 'Excellence in Education & Character', 'forest', '#1F4D3A', 'info@mountcarmel.edu.in', '+91 98765 43210', 'Aizawl, Mizoram - 796001')
on conflict (tenant_id) do nothing;

insert into public.notices (tenant_id, title, body, category, is_pinned) values
('a1111111-1111-1111-1111-111111111111', 'Annual Sports Meet 2025', 'The Annual Sports Meet will be held on December 15th at the main ground. All students must assemble by 8:30 AM.', 'Event', true),
('a1111111-1111-1111-1111-111111111111', 'Winter Vacation Schedule', 'School will remain closed for winter break from Dec 22 to Jan 10.', 'Holiday', false)
on conflict do nothing;

insert into public.faculty (tenant_id, name, designation, qualification, subjects, experience, display_order) values
('a1111111-1111-1111-1111-111111111111', 'Dr. Lalthantluanga', 'Principal', 'Ph.D. in Physics', 'Physics', '18 Years', 1),
('a1111111-1111-1111-1111-111111111111', 'Ms. Sunita Kapoor', 'Headmistress', 'M.A., M.Ed.', 'English', '12 Years', 2)
on conflict do nothing;

-- 2. TENANT 2: St Mary's School (Basic Plan)
insert into public.tenants (id, name, subdomain, status, plan_id, paid_till) values
('b2222222-2222-2222-2222-222222222222', 'St Marys School', 'stmarys', 'active', 'basic', now() + interval '6 months')
on conflict (id) do nothing;

insert into public.tenant_domains (tenant_id, hostname, type, status) values
('b2222222-2222-2222-2222-222222222222', 'stmarys.eduportal.com', 'subdomain', 'active')
on conflict do nothing;

insert into public.site_settings (tenant_id, school_name, tagline, theme_preset, primary_color, contact_email, contact_phone, contact_address) values
('b2222222-2222-2222-2222-222222222222', 'St. Marys Academy', 'Nurturing Future Leaders', 'ocean', '#235A78', 'admin@stmarys.edu.in', '+91 98123 45678', 'Kolkata, West Bengal - 700001')
on conflict (tenant_id) do nothing;

insert into public.notices (tenant_id, title, body, category, is_pinned) values
('b2222222-2222-2222-2222-222222222222', 'Parent-Teacher Meeting Notice', 'PTM scheduled for Saturday morning 9:00 AM.', 'General', true)
on conflict do nothing;
