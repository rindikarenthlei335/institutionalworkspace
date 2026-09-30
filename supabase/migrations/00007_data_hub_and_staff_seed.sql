-- ============================================================================
-- 00007_data_hub_and_staff_seed.sql: Seed Staff Profiles & Sample Import Batches
-- ============================================================================

-- 1. Seed Staff Profiles for Mount Carmel
insert into public.staff_profiles (
  tenant_id, employee_id, full_name, gender, dob, designation, department,
  employment_type, qualification, experience_years, joining_date, phone, email,
  subjects_taught, classes_assigned, class_teacher_of, show_on_website, website_bio, status
) values
(
  '00000000-0000-0000-0000-000000000001',
  'EMP-MC-001',
  'Rev. Dr. Lalthansanga',
  'male',
  '1972-04-15',
  'Principal',
  'Administration',
  'full_time',
  'Ph.D. Education, M.Sc. Physics, B.Ed.',
  24.5,
  '2010-06-01',
  '+91 98621 55667',
  'principal@mountcarmel.edu.in',
  '["Physics", "Moral Science"]'::jsonb,
  '["Class XII-A", "Class XII-B"]'::jsonb,
  null,
  true,
  'Over 24 years of educational leadership serving the youth of Mizoram.',
  'active'
),
(
  '00000000-0000-0000-0000-000000000001',
  'EMP-MC-002',
  'Mrs. Lalnunmawii Sailo',
  'female',
  '1985-09-22',
  'Senior Mathematics Teacher',
  'Mathematics',
  'full_time',
  'M.Sc. Mathematics, B.Ed.',
  14.0,
  '2014-07-15',
  '+91 94361 77889',
  'lalnunmawii.s@mountcarmel.edu.in',
  '["Mathematics", "Higher Mathematics"]'::jsonb,
  '["Class X-A", "Class XI-A"]'::jsonb,
  'Class X-A',
  true,
  'Passionate mathematics educator focused on Olympiad preparation.',
  'active'
),
(
  '00000000-0000-0000-0000-000000000001',
  'EMP-MC-003',
  'Mr. C. Lalremruata',
  'male',
  '1988-11-05',
  'PGT Chemistry & Science HOD',
  'Science',
  'full_time',
  'M.Sc. Chemistry, B.Ed., CSIR-NET',
  11.5,
  '2017-03-01',
  '+91 98623 11223',
  'remruata.c@mountcarmel.edu.in',
  '["Chemistry", "General Science"]'::jsonb,
  '["Class IX-B", "Class X-B", "Class XII-A"]'::jsonb,
  'Class XII-A',
  true,
  'Head of Science Department directing hands-on laboratory discovery.',
  'active'
),
(
  '00000000-0000-0000-0000-000000000001',
  'EMP-MC-004',
  'Ms. Zothanpuii',
  'female',
  '1992-02-18',
  'TGT English & Literature',
  'Humanities',
  'full_time',
  'M.A. English Literature, B.Ed.',
  7.0,
  '2019-06-10',
  '+91 98625 99887',
  'zothanpuii@mountcarmel.edu.in',
  '["English", "English Grammar"]'::jsonb,
  '["Class VIII-A", "Class IX-A"]'::jsonb,
  'Class IX-A',
  true,
  'Editor of the annual Mount Carmel literary school magazine.',
  'active'
),
(
  '00000000-0000-0000-0000-000000000001',
  'EMP-MC-005',
  'Mr. Vanlalhruaia',
  'male',
  '1990-08-30',
  'Physical Education Director',
  'Sports & Fitness',
  'full_time',
  'M.P.Ed., NIS Coach',
  9.0,
  '2018-05-02',
  '+91 94363 44556',
  'hruaia.sports@mountcarmel.edu.in',
  '["Physical Education", "Athletics"]'::jsonb,
  '["All Classes"]'::jsonb,
  null,
  false,
  'State athletics coach training interstate football and badminton teams.',
  'active'
)
on conflict (tenant_id, employee_id) do nothing;

-- 2. Seed Initial Completed Import Batch
insert into public.import_batches (
  tenant_id, batch_number, entity_type, mode, file_name,
  total_rows, created_count, updated_count, skipped_count, error_count,
  status, created_by, created_at, completed_at
) values
(
  '00000000-0000-0000-0000-000000000001',
  'IMP-2026-0041',
  'students',
  'upsert',
  'academic_session_2026_class_x_admissions.xlsx',
  42, 40, 2, 0, 0,
  'completed',
  'school_admin',
  '2026-09-15T09:30:00Z',
  '2026-09-15T09:32:15Z'
)
on conflict (batch_number) do nothing;
