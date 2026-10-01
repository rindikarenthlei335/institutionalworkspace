-- Migration 00013: Module Manager & Tenant Modules Architecture
-- Phase 2 Milestone 6

CREATE TABLE IF NOT EXISTS tenant_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  module_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'installed_enabled', 'installed_disabled', 'archived')),
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  version VARCHAR(50) NOT NULL DEFAULT '1.0.0',
  installed_by UUID REFERENCES profiles(id),
  installed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, module_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tenant_modules_tenant_status ON tenant_modules(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_tenant_modules_module_id ON tenant_modules(module_id);

-- Row Level Security (RLS)
ALTER TABLE tenant_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenant_modules_select" ON tenant_modules
  FOR SELECT USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "tenant_modules_admin_update" ON tenant_modules
  FOR UPDATE USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "tenant_modules_admin_insert" ON tenant_modules
  FOR INSERT WITH CHECK (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "tenant_modules_platform_all" ON tenant_modules
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');
