-- ============================================================================
-- 00008_exams_and_id_cards.sql: Exams, Grading, Marks, Marksheets & ID Cards
-- ============================================================================

-- 1. SUBJECTS MASTER
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  code text not null,
  name text not null,
  class_id uuid references public.classes(id) on delete cascade,
  class_name text,
  subject_type text not null default 'scholastic' check (subject_type in ('scholastic', 'co_scholastic')),
  is_optional boolean not null default false,
  max_marks numeric(5,2) not null default 100,
  pass_marks numeric(5,2) not null default 33,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (tenant_id, code)
);
create index if not exists idx_subjects_tenant on public.subjects(tenant_id);

-- 2. EXAM TYPES & CYCLES
create table if not exists public.exam_types (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  academic_year_id uuid references public.academic_years(id) on delete cascade,
  name text not null, -- e.g. "Unit Test 1", "Mid-Term Exam", "Annual Examination"
  code text not null, -- e.g. "UT-1", "HALF-YEARLY", "ANNUAL-2025"
  term text not null default 'Term 1',
  weightage_percent numeric(5,2) not null default 100,
  start_date date,
  end_date date,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'ongoing', 'evaluating', 'published', 'locked')),
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, code, academic_year_id)
);
create index if not exists idx_exam_types_tenant on public.exam_types(tenant_id);

-- 3. GRADING SCHEMES
create table if not exists public.grading_schemes (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null, -- e.g. "CBSE 9-Point Scale", "Percentage Scale"
  description text,
  is_default boolean not null default false,
  rules jsonb not null default '[]'::jsonb, -- Array of { grade, min_score, max_score, grade_point, remarks }
  created_at timestamptz not null default now()
);
create index if not exists idx_grading_schemes_tenant on public.grading_schemes(tenant_id);

-- 4. CLASS SUBJECT ASSIGNMENT
create table if not exists public.class_subjects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  class_id uuid not null references public.classes(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  teacher_id uuid references public.staff_profiles(id) on delete set null,
  max_marks numeric(5,2) not null default 100,
  pass_marks numeric(5,2) not null default 33,
  created_at timestamptz not null default now(),
  unique (tenant_id, class_id, subject_id)
);
create index if not exists idx_class_subjects_tenant on public.class_subjects(tenant_id);

-- 5. STUDENT MARKS ENTRY
create table if not exists public.student_marks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  exam_id uuid not null references public.exam_types(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  marks_obtained numeric(5,2),
  is_absent boolean not null default false,
  is_exempt boolean not null default false,
  moderated_marks numeric(5,2),
  moderation_reason text,
  remarks text,
  entered_by uuid references public.profiles(id),
  verified_by uuid references public.profiles(id),
  status text not null default 'draft' check (status in ('draft', 'submitted', 'verified', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, exam_id, student_id, subject_id)
);
create index if not exists idx_student_marks_tenant on public.student_marks(tenant_id);
create index if not exists idx_student_marks_exam on public.student_marks(exam_id);
create index if not exists idx_student_marks_student on public.student_marks(student_id);

-- 6. MARKSHEETS & REPORT CARDS (WITH IMMUTABLE SNAPSHOTS & VERIFICATION TOKEN)
create table if not exists public.marksheets (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  exam_id uuid not null references public.exam_types(id) on delete cascade,
  student_id uuid not null references public.students(id) on delete cascade,
  academic_year_id uuid references public.academic_years(id) on delete cascade,
  class_id uuid references public.classes(id),
  section_id uuid references public.sections(id),
  total_max_marks numeric(7,2) not null default 0,
  total_obtained_marks numeric(7,2) not null default 0,
  percentage numeric(5,2) not null default 0,
  overall_grade text,
  gpa numeric(4,2),
  rank integer,
  pass_status text not null default 'passed' check (pass_status in ('passed', 'failed', 'compartment', 'withheld')),
  is_withheld boolean not null default false,
  withheld_reason text,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'verified', 'published')),
  verification_token text not null unique,
  snapshot_data jsonb, -- Frozen immutable data at publication
  published_at timestamptz,
  published_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, exam_id, student_id)
);
create index if not exists idx_marksheets_tenant on public.marksheets(tenant_id);
create index if not exists idx_marksheets_token on public.marksheets(verification_token);
create index if not exists idx_marksheets_student on public.marksheets(student_id);

-- 7. ID CARD TEMPLATES
create table if not exists public.id_card_templates (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  name text not null,
  card_type text not null check (card_type in ('student', 'staff')),
  layout text not null default 'vertical' check (layout in ('vertical', 'horizontal')),
  primary_color text not null default '#163A2B',
  secondary_color text not null default '#C9A84C',
  background_color text not null default '#FFFFFF',
  show_blood_group boolean not null default true,
  show_guardian_phone boolean not null default true,
  show_address boolean not null default false,
  show_emergency_contact boolean not null default true,
  show_barcode boolean not null default false,
  show_qr boolean not null default true,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_id_card_templates_tenant on public.id_card_templates(tenant_id);

-- 8. ISSUED ID CARDS
create table if not exists public.id_cards (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  card_type text not null check (card_type in ('student', 'staff')),
  student_id uuid references public.students(id) on delete cascade,
  staff_id uuid references public.staff_profiles(id) on delete cascade,
  template_id uuid references public.id_card_templates(id) on delete set null,
  card_number text not null,
  issue_date date not null default current_date,
  expiry_date date not null,
  qr_verification_token text not null unique,
  status text not null default 'active' check (status in ('active', 'expired', 'lost', 'revoked')),
  reprint_count integer not null default 0,
  last_printed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (tenant_id, card_number)
);
create index if not exists idx_id_cards_tenant on public.id_cards(tenant_id);
create index if not exists idx_id_cards_token on public.id_cards(qr_verification_token);
create index if not exists idx_id_cards_student on public.id_cards(student_id);
create index if not exists idx_id_cards_staff on public.id_cards(staff_id);

-- 9. REPRINT AUDIT LOG
create table if not exists public.id_card_reprint_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  card_id uuid not null references public.id_cards(id) on delete cascade,
  reprinted_by uuid references public.profiles(id),
  reason text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.subjects enable row level security;
alter table public.exam_types enable row level security;
alter table public.grading_schemes enable row level security;
alter table public.class_subjects enable row level security;
alter table public.student_marks enable row level security;
alter table public.marksheets enable row level security;
alter table public.id_card_templates enable row level security;
alter table public.id_cards enable row level security;
alter table public.id_card_reprint_logs enable row level security;

-- Subjects RLS
create policy "Subjects staff all" on public.subjects for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);
create policy "Subjects public read" on public.subjects for select using (
  tenant_id = private.current_tenant_id()
);

-- Exam Types RLS
create policy "Exam types staff all" on public.exam_types for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);
create policy "Exam types portal select" on public.exam_types for select using (
  tenant_id = private.current_tenant_id() and is_published = true
);

-- Grading Schemes RLS
create policy "Grading schemes staff all" on public.grading_schemes for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);
create policy "Grading schemes tenant select" on public.grading_schemes for select using (
  tenant_id = private.current_tenant_id()
);

-- Class Subjects RLS
create policy "Class subjects staff all" on public.class_subjects for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);

-- Student Marks RLS
create policy "Student marks staff all" on public.student_marks for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);

-- Marksheets RLS
create policy "Marksheets staff all" on public.marksheets for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator', 'teacher')
    or private.is_platform_owner()
  )
);
create policy "Marksheets parent select" on public.marksheets for select using (
  tenant_id = private.current_tenant_id() and status = 'published' and (
    private.current_role() = 'parent' and exists (
      select 1 from public.guardians g
      where g.tenant_id = public.marksheets.tenant_id
      and g.student_id = public.marksheets.student_id
      and g.user_id = auth.uid()
    )
    or private.current_role() = 'student' and exists (
      select 1 from public.students s
      where s.id = public.marksheets.student_id
      and s.tenant_id = public.marksheets.tenant_id
      and s.admission_no = (select extra->>'admission_no' from public.profiles where id = auth.uid())
    )
  )
);

-- ID Cards RLS
create policy "ID card templates staff all" on public.id_card_templates for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin')
    or private.is_platform_owner()
  )
);

create policy "ID cards staff all" on public.id_cards for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin', 'data_entry_operator')
    or private.is_platform_owner()
  )
);

create policy "ID cards parent and student select" on public.id_cards for select using (
  tenant_id = private.current_tenant_id() and status = 'active' and (
    private.current_role() = 'parent' and exists (
      select 1 from public.guardians g
      where g.tenant_id = public.id_cards.tenant_id
      and g.student_id = public.id_cards.student_id
      and g.user_id = auth.uid()
    )
    or private.current_role() = 'student' and exists (
      select 1 from public.students s
      where s.id = public.id_cards.student_id
      and s.tenant_id = public.id_cards.tenant_id
    )
    or private.current_role() = 'teacher' and exists (
      select 1 from public.staff_profiles sp
      where sp.id = public.id_cards.staff_id
      and sp.tenant_id = public.id_cards.tenant_id
    )
  )
);

create policy "ID reprint logs staff all" on public.id_card_reprint_logs for all using (
  tenant_id = private.current_tenant_id() and (
    private.current_role() in ('school_super_admin', 'school_admin')
    or private.is_platform_owner()
  )
);
