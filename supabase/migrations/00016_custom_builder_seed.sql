-- Migration 00016: Custom Module Builder, Attendance & Certificates Seed Data
-- Phase 2 Milestone 7

-- 1. Seed Custom Entities (Templates)
INSERT INTO custom_entities (
  id, tenant_id, name, name_lus, slug, icon, description, description_lus, permissions, is_system
) VALUES
  (
    '00000000-0000-0000-0000-000000000701',
    '00000000-0000-0000-0000-000000000001',
    'Library Catalog',
    'Lehkhabu Enkawlna',
    'library',
    '📚',
    'School library books catalog, ISBN tracking, shelf locations, and copies inventory.',
    'School library lehkhabu awmzat, ISBN, leh shelf awmna vawn thatna.',
    '["school_super_admin", "school_admin", "teacher"]'::jsonb,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000702',
    '00000000-0000-0000-0000-000000000001',
    'Transport & Bus Routes',
    'Bus Kawng & Kal Dan',
    'transport',
    '🚌',
    'Institutional bus fleet, route stops, driver contacts, vehicle registrations, and monthly transport fares.',
    'School bus kal dan, driver biakpawhna, leh bus fee chhinchhiahna.',
    '["school_super_admin", "school_admin"]'::jsonb,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000703',
    '00000000-0000-0000-0000-000000000001',
    'School Events & Calendar',
    'Thil Thleng & Calendar',
    'events',
    '📅',
    'Annual sports meet, science exhibitions, parent-teacher conferences, and official gazetted holidays.',
    'Sports, science exhibition, nu leh pa inhmukhawm, leh chawlhkar chhinchhiahna.',
    '["school_super_admin", "school_admin", "teacher"]'::jsonb,
    false
  )
ON CONFLICT (tenant_id, slug) DO UPDATE SET
  name = EXCLUDED.name,
  name_lus = EXCLUDED.name_lus,
  icon = EXCLUDED.icon;

-- 2. Seed Fields for Library Entity
INSERT INTO custom_fields (
  id, entity_id, field_name, field_label, field_label_lus, field_type, is_required, options, order_index
) VALUES
  ('00000000-0000-0000-0000-000000000711', '00000000-0000-0000-0000-000000000701', 'title', 'Book Title', 'Lehkhabu Hming', 'text', true, '[]'::jsonb, 1),
  ('00000000-0000-0000-0000-000000000712', '00000000-0000-0000-0000-000000000701', 'author', 'Author / Writer', 'Ziaktu', 'text', true, '[]'::jsonb, 2),
  ('00000000-0000-0000-0000-000000000713', '00000000-0000-0000-0000-000000000701', 'isbn', 'ISBN Code', 'ISBN Number', 'text', false, '[]'::jsonb, 3),
  ('00000000-0000-0000-0000-000000000714', '00000000-0000-0000-0000-000000000701', 'category', 'Genre / Subject', 'Chi Hrang', 'select', true, '["Science", "Literature", "Mathematics", "History", "Mizo Studies"]'::jsonb, 4),
  ('00000000-0000-0000-0000-000000000715', '00000000-0000-0000-0000-000000000701', 'copies', 'Total Copies', 'Copy Awmzat', 'number', true, '[]'::jsonb, 5)
ON CONFLICT (entity_id, field_name) DO NOTHING;

-- 3. Seed Sample Custom Records for Library
INSERT INTO custom_records (
  id, tenant_id, entity_id, data
) VALUES
  (
    '00000000-0000-0000-0000-000000000721',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000701',
    '{"title": "Mizo Thawnthu Ropui", "author": "B. Lalthangliana", "isbn": "978-81-90123-01", "category": "Mizo Studies", "copies": 15}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000722',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000701',
    '{"title": "Concepts of Physics (Vol 1)", "author": "H.C. Verma", "isbn": "978-81-7709-187-7", "category": "Science", "copies": 25}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Certificate Templates
INSERT INTO certificate_templates (
  id, tenant_id, template_type, title, title_lus, body_template, body_template_lus
) VALUES
  (
    '00000000-0000-0000-0000-000000000801',
    '00000000-0000-0000-0000-000000000001',
    'transfer',
    'Transfer Certificate (School Leaving Deed)',
    'Transfer Certificate (School Chhuahna)',
    'This is to certify that {{student_name}}, son/daughter of {{father_name}}, Admission No: {{admission_no}}, was a student of this institution in {{class}}. He/She has paid all school dues and fees up to the current month. Reason for leaving: {{leaving_reason}}. Conduct and character during the academic session was {{conduct}}.',
    'He lehkha hian a hriattir chu, {{student_name}}, {{father_name}} fa, Admission No: {{admission_no}} hi he school-ah hian {{class}} a zir a ni a. School fee zawng zawng a pe tling tawh e. School chhuah chhan: {{leaving_reason}}. A mizia leh nungchang chu {{conduct}} a ni e.'
  ),
  (
    '00000000-0000-0000-0000-000000000802',
    '00000000-0000-0000-0000-000000000001',
    'bonafide',
    'Bonafide Student Certificate',
    'Zirlai A Ni Ngei Tih Hriattirna',
    'This is to certify that {{student_name}}, bearing Admission Number {{admission_no}}, is a bonafide student of Class {{class}} of Mount Carmel Higher Secondary School, Aizawl for the Academic Session {{academic_year}}.',
    'He lehkha hian a nemnghet chu, {{student_name}}, Admission Number {{admission_no}} hi Mount Carmel Higher Secondary School, Aizawl-ah Class {{class}} zirlai tak tak a ni e.'
  )
ON CONFLICT (id) DO NOTHING;
