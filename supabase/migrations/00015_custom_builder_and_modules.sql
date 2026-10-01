-- Migration 00015: Custom Module Builder, Attendance & Certificates Modules
-- Phase 2 Milestone 7

-- 1. Custom Module Builder: Entities
CREATE TABLE IF NOT EXISTS custom_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  name_lus VARCHAR(100),
  slug VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT '📦',
  description TEXT,
  description_lus TEXT,
  permissions JSONB NOT NULL DEFAULT '["school_super_admin", "school_admin"]'::jsonb,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, slug)
);

-- 2. Custom Module Builder: Fields
CREATE TABLE IF NOT EXISTS custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES custom_entities(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  field_label VARCHAR(100) NOT NULL,
  field_label_lus VARCHAR(100),
  field_type VARCHAR(50) NOT NULL CHECK (
    field_type IN (
      'text', 'long_text', 'number', 'currency', 'date', 'datetime',
      'boolean', 'select', 'multiselect', 'phone', 'email', 'url',
      'file', 'image', 'relation', 'calculated'
    )
  ),
  is_required BOOLEAN NOT NULL DEFAULT false,
  options JSONB DEFAULT '[]'::jsonb,
  relation_target VARCHAR(100),
  default_value JSONB,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(entity_id, field_name)
);

-- 3. Custom Module Builder: Records (Schemaless JSONB with GIN indexing)
CREATE TABLE IF NOT EXISTS custom_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES custom_entities(id) ON DELETE CASCADE,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_custom_records_gin ON custom_records USING GIN(data);
CREATE INDEX IF NOT EXISTS idx_custom_records_tenant_entity ON custom_records(tenant_id, entity_id);

-- 4. Attendance Module: Sessions
CREATE TABLE IF NOT EXISTS attendance_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  class_id UUID,
  section_id UUID,
  session_type VARCHAR(20) NOT NULL DEFAULT 'full_day' CHECK (session_type IN ('morning', 'afternoon', 'full_day')),
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, date, class_id, section_id, session_type)
);

-- 5. Attendance Module: Student Entries
CREATE TABLE IF NOT EXISTS student_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES attendance_sessions(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- 6. Attendance Module: Staff Daily Logs
CREATE TABLE IF NOT EXISTS staff_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  staff_id UUID NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'absent', 'half_day', 'on_leave')),
  check_in_time TIME,
  check_out_time TIME,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, date, staff_id)
);

-- 7. Certificates Module: Templates
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('transfer', 'bonafide', 'character', 'custom')),
  title VARCHAR(150) NOT NULL,
  title_lus VARCHAR(150),
  body_template TEXT NOT NULL,
  body_template_lus TEXT,
  layout_config JSONB NOT NULL DEFAULT '{"header": true, "crest": true, "qr_seal": true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Certificates Module: Issued Certificates
CREATE TABLE IF NOT EXISTS issued_certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES certificate_templates(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  certificate_number VARCHAR(100) NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'issued', 'revoked')),
  snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  verification_token VARCHAR(100) NOT NULL UNIQUE,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE custom_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE issued_certificates ENABLE ROW LEVEL SECURITY;

-- Standard Tenant RLS Policies
CREATE POLICY "custom_entities_tenant_all" ON custom_entities
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "custom_fields_tenant_all" ON custom_fields
  FOR ALL USING (
    EXISTS (SELECT 1 FROM custom_entities WHERE custom_entities.id = custom_fields.entity_id AND (custom_entities.tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner'))
  );

CREATE POLICY "custom_records_tenant_all" ON custom_records
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "attendance_sessions_tenant_all" ON attendance_sessions
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "student_attendance_tenant_all" ON student_attendance
  FOR ALL USING (
    EXISTS (SELECT 1 FROM attendance_sessions WHERE attendance_sessions.id = student_attendance.session_id AND (attendance_sessions.tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner'))
  );

CREATE POLICY "staff_attendance_tenant_all" ON staff_attendance
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "certificate_templates_tenant_all" ON certificate_templates
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "issued_certificates_tenant_all" ON issued_certificates
  FOR ALL USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

-- Public verification for issued certificates (minimal confirmation)
CREATE POLICY "issued_certificates_public_verify" ON issued_certificates
  FOR SELECT TO PUBLIC USING (status IN ('approved', 'issued'));
