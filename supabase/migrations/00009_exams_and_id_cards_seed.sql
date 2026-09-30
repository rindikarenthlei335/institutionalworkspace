-- ============================================================================
-- 00009_exams_and_id_cards_seed.sql: Seed Subjects, Grading, Exams, Marksheets & ID Cards
-- ============================================================================

do $$
declare
  v_tenant_id uuid;
  v_academic_year_id uuid;
  v_class_id uuid;
  v_exam_id uuid;
  v_grading_id uuid;
  v_template_student_id uuid;
  v_template_staff_id uuid;
  v_student_1 uuid;
  v_student_2 uuid;
  v_student_3 uuid;
  v_sub_eng uuid;
  v_sub_miz uuid;
  v_sub_mth uuid;
  v_sub_sci uuid;
  v_sub_soc uuid;
  v_sub_csc uuid;
  v_sub_ped uuid;
begin
  -- 1. Identify Tenant
  select id into v_tenant_id from public.tenants where subdomain = 'mountcarmel' limit 1;
  if v_tenant_id is null then
    select id into v_tenant_id from public.tenants limit 1;
  end if;
  if v_tenant_id is null then
    v_tenant_id := '00000000-0000-0000-0000-000000000001'::uuid;
  end if;

  -- 2. Ensure Academic Year
  select id into v_academic_year_id from public.academic_years where tenant_id = v_tenant_id and is_current = true limit 1;
  if v_academic_year_id is null then
    insert into public.academic_years (tenant_id, year_label, start_date, end_date, is_current)
    values (v_tenant_id, '2024-2025', '2024-04-01', '2025-03-31', true)
    returning id into v_academic_year_id;
  end if;

  -- 3. Ensure Class X
  select id into v_class_id from public.classes where tenant_id = v_tenant_id and name like '%Class X%' limit 1;
  if v_class_id is null then
    insert into public.classes (tenant_id, name, display_order)
    values (v_tenant_id, 'Class X', 10)
    returning id into v_class_id;
  end if;

  -- 4. Seed Standard Subjects
  insert into public.subjects (tenant_id, code, name, class_id, class_name, subject_type, is_optional, max_marks, pass_marks, display_order)
  values
    (v_tenant_id, 'ENG-10', 'English Language & Literature', v_class_id, 'Class X', 'scholastic', false, 100, 33, 1),
    (v_tenant_id, 'MIZ-10', 'Mizo Vernacular Literature', v_class_id, 'Class X', 'scholastic', false, 100, 33, 2),
    (v_tenant_id, 'MTH-10', 'Mathematics (Standard)', v_class_id, 'Class X', 'scholastic', false, 100, 33, 3),
    (v_tenant_id, 'SCI-10', 'Integrated Science & Lab', v_class_id, 'Class X', 'scholastic', false, 100, 33, 4),
    (v_tenant_id, 'SOC-10', 'Social Sciences & Civics', v_class_id, 'Class X', 'scholastic', false, 100, 33, 5),
    (v_tenant_id, 'CSC-10', 'Computer Applications', v_class_id, 'Class X', 'scholastic', false, 100, 33, 6),
    (v_tenant_id, 'PED-10', 'Physical & Health Education', v_class_id, 'Class X', 'co_scholastic', false, 50, 17, 7)
  on conflict (tenant_id, code) do update set name = excluded.name;

  select id into v_sub_eng from public.subjects where tenant_id = v_tenant_id and code = 'ENG-10';
  select id into v_sub_miz from public.subjects where tenant_id = v_tenant_id and code = 'MIZ-10';
  select id into v_sub_mth from public.subjects where tenant_id = v_tenant_id and code = 'MTH-10';
  select id into v_sub_sci from public.subjects where tenant_id = v_tenant_id and code = 'SCI-10';
  select id into v_sub_soc from public.subjects where tenant_id = v_tenant_id and code = 'SOC-10';
  select id into v_sub_csc from public.subjects where tenant_id = v_tenant_id and code = 'CSC-10';
  select id into v_sub_ped from public.subjects where tenant_id = v_tenant_id and code = 'PED-10';

  -- 5. Seed Grading Schemes
  insert into public.grading_schemes (tenant_id, name, description, is_default, rules)
  values
  (
    v_tenant_id,
    'CBSE Secondary 9-Point Scale',
    'Official 9-point percentage band scale with letter grades and grade points (GP 4.0 to 10.0)',
    true,
    '[
      {"grade": "A1", "min_score": 91, "max_score": 100, "grade_point": 10.0, "remarks": "Outstanding"},
      {"grade": "A2", "min_score": 81, "max_score": 90, "grade_point": 9.0, "remarks": "Excellent"},
      {"grade": "B1", "min_score": 71, "max_score": 80, "grade_point": 8.0, "remarks": "Very Good"},
      {"grade": "B2", "min_score": 61, "max_score": 70, "grade_point": 7.0, "remarks": "Good"},
      {"grade": "C1", "min_score": 51, "max_score": 60, "grade_point": 6.0, "remarks": "Above Average"},
      {"grade": "C2", "min_score": 41, "max_score": 50, "grade_point": 5.0, "remarks": "Average"},
      {"grade": "D",  "min_score": 33, "max_score": 40, "grade_point": 4.0, "remarks": "Marginal Pass"},
      {"grade": "E",  "min_score": 0,  "max_score": 32, "grade_point": 0.0, "remarks": "Needs Improvement / Failed"}
    ]'::jsonb
  ),
  (
    v_tenant_id,
    'Standard Higher Secondary Percentage Scale',
    'State Board standard division percentages (Distinction, First Division, Second Division)',
    false,
    '[
      {"grade": "Distinction", "min_score": 75, "max_score": 100, "grade_point": 10.0, "remarks": "Passed with Distinction"},
      {"grade": "1st Div",    "min_score": 60, "max_score": 74.99, "grade_point": 8.0, "remarks": "First Division"},
      {"grade": "2nd Div",    "min_score": 45, "max_score": 59.99, "grade_point": 6.0, "remarks": "Second Division"},
      {"grade": "3rd Div",    "min_score": 33, "max_score": 44.99, "grade_point": 4.0, "remarks": "Third Division Pass"},
      {"grade": "Failed",     "min_score": 0,  "max_score": 32.99, "grade_point": 0.0, "remarks": "Failed / Compartment"}
    ]'::jsonb
  );

  select id into v_grading_id from public.grading_schemes where tenant_id = v_tenant_id and is_default = true limit 1;

  -- 6. Seed Exam Types
  insert into public.exam_types (tenant_id, academic_year_id, name, code, term, weightage_percent, start_date, end_date, status, is_published, published_at)
  values
    (v_tenant_id, v_academic_year_id, 'Half-Yearly Examination 2024–2025', 'HALF-YEARLY-2024', 'Term 1', 50.00, '2024-09-10', '2024-09-22', 'published', true, now() - interval '5 days'),
    (v_tenant_id, v_academic_year_id, 'Unit Test 1 (July 2024)', 'UT1-2024', 'Term 1', 15.00, '2024-07-15', '2024-07-20', 'published', true, now() - interval '60 days'),
    (v_tenant_id, v_academic_year_id, 'Annual Examination 2024–2025', 'ANNUAL-2025', 'Term 2', 100.00, '2025-02-18', '2025-03-02', 'draft', false, null)
  on conflict (tenant_id, code, academic_year_id) do update set name = excluded.name;

  select id into v_exam_id from public.exam_types where tenant_id = v_tenant_id and code = 'HALF-YEARLY-2024' limit 1;

  -- 7. Ensure Demo Students Exist
  select id into v_student_1 from public.students where tenant_id = v_tenant_id and admission_no = 'ADM-2024-0012' limit 1;
  if v_student_1 is null then
    insert into public.students (tenant_id, admission_no, roll_no, class_id, full_name, dob, gender, residence_type, status, blood_group)
    values (v_tenant_id, 'ADM-2024-0012', 1, v_class_id, 'Lalrintluanga Sailo', '2009-05-14', 'male', 'day', 'active', 'B+')
    returning id into v_student_1;
  end if;

  select id into v_student_2 from public.students where tenant_id = v_tenant_id and admission_no = 'ADM-2024-0018' limit 1;
  if v_student_2 is null then
    insert into public.students (tenant_id, admission_no, roll_no, class_id, full_name, dob, gender, residence_type, status, blood_group)
    values (v_tenant_id, 'ADM-2024-0018', 2, v_class_id, 'Vanlalhruaii Pachuau', '2009-08-20', 'female', 'hosteller', 'active', 'O+')
    returning id into v_student_2;
  end if;

  select id into v_student_3 from public.students where tenant_id = v_tenant_id and admission_no = 'ADM-2024-0025' limit 1;
  if v_student_3 is null then
    insert into public.students (tenant_id, admission_no, roll_no, class_id, full_name, dob, gender, residence_type, status, blood_group)
    values (v_tenant_id, 'ADM-2024-0025', 3, v_class_id, 'Zonunmawia Ralte', '2009-02-11', 'male', 'day', 'active', 'A+')
    returning id into v_student_3;
  end if;

  -- 8. Seed Marks for Student 1 (High Achiever, Rank 1)
  if v_exam_id is not null and v_student_1 is not null and v_sub_eng is not null then
    insert into public.student_marks (tenant_id, exam_id, student_id, subject_id, marks_obtained, is_absent, status)
    values
      (v_tenant_id, v_exam_id, v_student_1, v_sub_eng, 94.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_miz, 96.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_mth, 98.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_sci, 92.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_soc, 90.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_csc, 95.00, false, 'published'),
      (v_tenant_id, v_exam_id, v_student_1, v_sub_ped, 48.00, false, 'published')
    on conflict (tenant_id, exam_id, student_id, subject_id) do update set marks_obtained = excluded.marks_obtained;

    -- Seed Marksheet 1
    insert into public.marksheets (
      tenant_id, exam_id, student_id, academic_year_id, class_id,
      total_max_marks, total_obtained_marks, percentage, overall_grade, gpa, rank, pass_status,
      verification_token, status, published_at, snapshot_data
    ) values (
      v_tenant_id, v_exam_id, v_student_1, v_academic_year_id, v_class_id,
      600.00, 565.00, 94.17, 'A1', 9.80, 1, 'passed',
      'MS-MC-2024-X-001-A1B9C8D7',
      'published', now() - interval '5 days',
      '{
        "schoolName": "Mount Carmel Higher Secondary School",
        "studentName": "Lalrintluanga Sailo",
        "admissionNo": "ADM-2024-0012",
        "rollNo": 1,
        "className": "Class X",
        "section": "A",
        "examName": "Half-Yearly Examination 2024–2025",
        "academicYear": "2024-2025",
        "totalMax": 600,
        "totalObtained": 565,
        "percentage": 94.17,
        "grade": "A1",
        "rank": 1,
        "passStatus": "Passed with Distinction",
        "attendancePercentage": 96.5,
        "publishedDate": "2024-09-25",
        "subjects": [
          {"code": "ENG-10", "name": "English Language & Literature", "max": 100, "obtained": 94, "grade": "A1", "gradePoint": 10.0},
          {"code": "MIZ-10", "name": "Mizo Vernacular Literature", "max": 100, "obtained": 96, "grade": "A1", "gradePoint": 10.0},
          {"code": "MTH-10", "name": "Mathematics (Standard)", "max": 100, "obtained": 98, "grade": "A1", "gradePoint": 10.0},
          {"code": "SCI-10", "name": "Integrated Science & Lab", "max": 100, "obtained": 92, "grade": "A1", "gradePoint": 10.0},
          {"code": "SOC-10", "name": "Social Sciences & Civics", "max": 100, "obtained": 90, "grade": "A2", "gradePoint": 9.0},
          {"code": "CSC-10", "name": "Computer Applications", "max": 100, "obtained": 95, "grade": "A1", "gradePoint": 10.0}
        ],
        "coScholastic": [
          {"code": "PED-10", "name": "Physical & Health Education", "max": 50, "obtained": 48, "grade": "A"}
        ]
      }'::jsonb
    ) on conflict (tenant_id, exam_id, student_id) do update set percentage = excluded.percentage;
  end if;

  -- 9. Seed Marksheet 2 (Vanlalhruaii Pachuau, Rank 2)
  if v_exam_id is not null and v_student_2 is not null then
    insert into public.marksheets (
      tenant_id, exam_id, student_id, academic_year_id, class_id,
      total_max_marks, total_obtained_marks, percentage, overall_grade, gpa, rank, pass_status,
      verification_token, status, published_at, snapshot_data
    ) values (
      v_tenant_id, v_exam_id, v_student_2, v_academic_year_id, v_class_id,
      600.00, 528.00, 88.00, 'A2', 9.00, 2, 'passed',
      'MS-MC-2024-X-002-E2F3G4H5',
      'published', now() - interval '5 days',
      '{
        "schoolName": "Mount Carmel Higher Secondary School",
        "studentName": "Vanlalhruaii Pachuau",
        "admissionNo": "ADM-2024-0018",
        "rollNo": 2,
        "className": "Class X",
        "section": "A",
        "examName": "Half-Yearly Examination 2024–2025",
        "academicYear": "2024-2025",
        "totalMax": 600,
        "totalObtained": 528,
        "percentage": 88.00,
        "grade": "A2",
        "rank": 2,
        "passStatus": "Passed",
        "attendancePercentage": 98.0,
        "publishedDate": "2024-09-25",
        "subjects": [
          {"code": "ENG-10", "name": "English Language & Literature", "max": 100, "obtained": 86, "grade": "A2", "gradePoint": 9.0},
          {"code": "MIZ-10", "name": "Mizo Vernacular Literature", "max": 100, "obtained": 91, "grade": "A1", "gradePoint": 10.0},
          {"code": "MTH-10", "name": "Mathematics (Standard)", "max": 100, "obtained": 84, "grade": "A2", "gradePoint": 9.0},
          {"code": "SCI-10", "name": "Integrated Science & Lab", "max": 100, "obtained": 89, "grade": "A2", "gradePoint": 9.0},
          {"code": "SOC-10", "name": "Social Sciences & Civics", "max": 100, "obtained": 88, "grade": "A2", "gradePoint": 9.0},
          {"code": "CSC-10", "name": "Computer Applications", "max": 100, "obtained": 90, "grade": "A2", "gradePoint": 9.0}
        ],
        "coScholastic": [
          {"code": "PED-10", "name": "Physical & Health Education", "max": 50, "obtained": 45, "grade": "A"}
        ]
      }'::jsonb
    ) on conflict (tenant_id, exam_id, student_id) do update set percentage = excluded.percentage;
  end if;

  -- 10. Seed ID Card Templates
  insert into public.id_card_templates (
    tenant_id, name, card_type, layout, primary_color, secondary_color,
    background_color, show_blood_group, show_guardian_phone, show_address, show_qr, is_default
  ) values
  (
    v_tenant_id,
    'Official Student Identity Card (CR80 Vertical)',
    'student',
    'vertical',
    '#163A2B',
    '#C9A84C',
    '#FFFFFF',
    true, true, true, true, true
  ),
  (
    v_tenant_id,
    'Staff & Faculty Credential Card (CR80 Horizontal)',
    'staff',
    'horizontal',
    '#163A2B',
    '#2563EB',
    '#F8FAFC',
    true, false, false, true, true
  );

  select id into v_template_student_id from public.id_card_templates where tenant_id = v_tenant_id and card_type = 'student' limit 1;
  select id into v_template_staff_id from public.id_card_templates where tenant_id = v_tenant_id and card_type = 'staff' limit 1;

  -- 11. Seed Sample Student ID Card
  if v_student_1 is not null and v_template_student_id is not null then
    insert into public.id_cards (
      tenant_id, card_type, student_id, template_id, card_number,
      issue_date, expiry_date, qr_verification_token, status
    ) values (
      v_tenant_id, 'student', v_student_1, v_template_student_id, 'IDC-2024-0012',
      '2024-04-01', '2025-03-31', 'ID-VER-MC-STU-0012-9988', 'active'
    ) on conflict (tenant_id, card_number) do nothing;
  end if;

  -- 12. Seed Sample Staff ID Card
  if v_template_staff_id is not null then
    insert into public.id_cards (
      tenant_id, card_type, staff_id, template_id, card_number,
      issue_date, expiry_date, qr_verification_token, status
    ) values (
      v_tenant_id, 'staff',
      (select id from public.staff_profiles where tenant_id = v_tenant_id and employee_id = 'EMP-MC-001' limit 1),
      v_template_staff_id, 'IDC-STAFF-MC-001',
      '2024-04-01', '2026-03-31', 'ID-VER-MC-STF-0001-4433', 'active'
    ) on conflict (tenant_id, card_number) do nothing;
  end if;

end $$;
