-- Migration 00011: App Publishing Pipeline & Store Asset Specifications
-- Phase 2 Milestone 5

-- 1. Tenant Apps Table (Store listing & configuration)
CREATE TABLE IF NOT EXISTS tenant_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('android', 'ios')),
  app_name VARCHAR(150) NOT NULL,
  package_id VARCHAR(150) NOT NULL,
  publisher_owner VARCHAR(50) NOT NULL DEFAULT 'school' CHECK (publisher_owner IN ('school', 'platform')),
  store_account_email VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'configuring', 'ready_for_build', 'building', 'published', 'archived')),
  listing JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, platform)
);

-- 2. Store Asset Specifications Table (Google Play & Apple App Store rules)
CREATE TABLE IF NOT EXISTS store_asset_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(20) NOT NULL CHECK (platform IN ('android', 'ios', 'both')),
  asset_type VARCHAR(50) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  min_width INT NOT NULL,
  min_height INT NOT NULL,
  max_width INT NOT NULL,
  max_height INT NOT NULL,
  aspect_ratio VARCHAR(20),
  format VARCHAR(20) NOT NULL DEFAULT 'png' CHECK (format IN ('png', 'jpeg', 'webp')),
  max_size_kb INT NOT NULL DEFAULT 1024,
  requires_no_alpha BOOLEAN NOT NULL DEFAULT false,
  is_required BOOLEAN NOT NULL DEFAULT true,
  description TEXT
);

-- 3. Tenant App Assets Table (Uploaded and validated assets)
CREATE TABLE IF NOT EXISTS tenant_app_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES tenant_apps(id) ON DELETE CASCADE,
  spec_id UUID REFERENCES store_asset_specs(id),
  asset_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL,
  mime_type VARCHAR(50) NOT NULL,
  file_size_bytes INT NOT NULL,
  storage_key VARCHAR(500) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'invalid', 'pending_validation')),
  validation_errors JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. App Builds Table (EAS & CI compilation artifacts)
CREATE TABLE IF NOT EXISTS app_builds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES tenant_apps(id) ON DELETE CASCADE,
  version VARCHAR(50) NOT NULL,
  build_number INT NOT NULL,
  build_type VARCHAR(20) NOT NULL CHECK (build_type IN ('aab', 'apk', 'ipa')),
  status VARCHAR(50) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'building', 'completed', 'failed')),
  artifact_key VARCHAR(500),
  artifact_size_bytes BIGINT,
  ci_run_id VARCHAR(100),
  logs_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 5. App Releases Table (Tracks, reviews, and store live statuses)
CREATE TABLE IF NOT EXISTS app_releases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id UUID NOT NULL REFERENCES tenant_apps(id) ON DELETE CASCADE,
  build_id UUID REFERENCES app_builds(id) ON DELETE SET NULL,
  track VARCHAR(50) NOT NULL CHECK (track IN ('internal', 'closed', 'production')),
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'in_review', 'rejected', 'approved', 'live', 'halted')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  live_at TIMESTAMPTZ,
  rejection_reason TEXT,
  fix_notes TEXT,
  store_url VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE tenant_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_asset_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_app_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_builds ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_releases ENABLE ROW LEVEL SECURITY;

-- Policies for tenant_apps
CREATE POLICY "tenant_apps_tenant_select" ON tenant_apps
  FOR SELECT USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "tenant_apps_tenant_update" ON tenant_apps
  FOR UPDATE USING (tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner');

CREATE POLICY "tenant_apps_platform_all" ON tenant_apps
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');

-- Store Asset Specs (Public read, platform manage)
CREATE POLICY "specs_public_select" ON store_asset_specs
  FOR SELECT TO PUBLIC USING (true);

CREATE POLICY "specs_platform_all" ON store_asset_specs
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');

-- Policies for tenant_app_assets
CREATE POLICY "assets_tenant_select" ON tenant_app_assets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tenant_apps WHERE tenant_apps.id = tenant_app_assets.app_id AND (tenant_apps.tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner'))
  );

CREATE POLICY "assets_platform_all" ON tenant_app_assets
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');

-- Policies for app_builds
CREATE POLICY "builds_tenant_select" ON app_builds
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tenant_apps WHERE tenant_apps.id = app_builds.app_id AND (tenant_apps.tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner'))
  );

CREATE POLICY "builds_platform_all" ON app_builds
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');

-- Policies for app_releases
CREATE POLICY "releases_tenant_select" ON app_releases
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM tenant_apps WHERE tenant_apps.id = app_releases.app_id AND (tenant_apps.tenant_id = auth.uid() OR auth.jwt() ->> 'role' = 'platform_owner'))
  );

CREATE POLICY "releases_platform_all" ON app_releases
  FOR ALL USING (auth.jwt() ->> 'role' = 'platform_owner');
