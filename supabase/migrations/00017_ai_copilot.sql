-- Migration 00017: AI Copilot, Conversations, Usage Quotas, and Help Search
-- Phase 2 Milestone 8

-- 1. AI Usage & Token Tracking
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  mode VARCHAR(50) NOT NULL CHECK (mode IN ('guide', 'data', 'action', 'general')),
  tokens_used INT NOT NULL DEFAULT 0,
  model VARCHAR(100) NOT NULL,
  cost_cents NUMERIC(10, 4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_tenant_month ON ai_usage(tenant_id, created_at);

-- 2. AI Conversations
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
  mode VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (mode IN ('guide', 'data', 'action', 'general')),
  language VARCHAR(10) NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'lus')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_tenant_user ON ai_conversations(tenant_id, user_id, updated_at DESC);

-- 3. AI Messages
CREATE TABLE IF NOT EXISTS ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation ON ai_messages(conversation_id, created_at ASC);

-- 4. Help Articles & Knowledge Base
CREATE TABLE IF NOT EXISTS help_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module VARCHAR(50) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  title_en VARCHAR(255) NOT NULL,
  title_lus VARCHAR(255) NOT NULL,
  content_en TEXT NOT NULL,
  content_lus TEXT NOT NULL,
  deep_link VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'guide',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_help_articles_module ON help_articles(module);

-- 5. Search Help Function
CREATE OR REPLACE FUNCTION search_help(
  query_text TEXT,
  lang TEXT DEFAULT 'en',
  target_module TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  module VARCHAR(50),
  slug VARCHAR(100),
  title VARCHAR(255),
  content TEXT,
  deep_link VARCHAR(255),
  rank FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    h.id,
    h.module,
    h.slug,
    CASE WHEN lang = 'lus' THEN h.title_lus ELSE h.title_en END AS title,
    CASE WHEN lang = 'lus' THEN h.content_lus ELSE h.content_en END AS content,
    h.deep_link,
    CASE
      WHEN lang = 'lus' AND (h.title_lus ILIKE '%' || query_text || '%' OR h.content_lus ILIKE '%' || query_text || '%') THEN 1.0
      WHEN lang != 'lus' AND (h.title_en ILIKE '%' || query_text || '%' OR h.content_en ILIKE '%' || query_text || '%') THEN 1.0
      ELSE 0.5
    END::FLOAT AS rank
  FROM help_articles h
  WHERE
    (target_module IS NULL OR h.module = target_module)
    AND (
      (lang = 'lus' AND (h.title_lus ILIKE '%' || query_text || '%' OR h.content_lus ILIKE '%' || query_text || '%'))
      OR
      (lang != 'lus' AND (h.title_en ILIKE '%' || query_text || '%' OR h.content_en ILIKE '%' || query_text || '%'))
    )
  ORDER BY rank DESC, h.created_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Quota Check Function
CREATE OR REPLACE FUNCTION check_ai_quota(t_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_plan_id TEXT;
  v_used INT;
  v_quota INT := 0;
  v_start_of_month TIMESTAMPTZ;
BEGIN
  SELECT plan_id INTO v_plan_id FROM tenants WHERE id = t_id;
  v_start_of_month := date_trunc('month', NOW());

  IF v_plan_id = 'ultimate' THEN
    v_quota := 3000;
  ELSE
    v_quota := 0;
  END IF;

  SELECT COUNT(*) INTO v_used
  FROM ai_usage
  WHERE tenant_id = t_id AND created_at >= v_start_of_month;

  RETURN jsonb_build_object(
    'plan_id', v_plan_id,
    'used', v_used,
    'quota', v_quota,
    'allowed', (v_plan_id = 'ultimate' AND v_used < v_quota)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RLS Configuration
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_articles ENABLE ROW LEVEL SECURITY;

-- Help articles: readable by all authenticated users
CREATE POLICY help_articles_select_policy ON help_articles
  FOR SELECT TO authenticated USING (true);

-- AI Usage: Tenant members can view their tenant's aggregate usage
CREATE POLICY ai_usage_select_policy ON ai_usage
  FOR SELECT TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'platform_owner'
    )
  );

CREATE POLICY ai_usage_insert_policy ON ai_usage
  FOR INSERT TO authenticated
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- AI Conversations: Tenant users manage their own conversations
CREATE POLICY ai_conversations_all_policy ON ai_conversations
  FOR ALL TO authenticated
  USING (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  )
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM profiles WHERE id = auth.uid()
    )
  );

-- AI Messages: Users manage messages in conversations of their tenant
CREATE POLICY ai_messages_all_policy ON ai_messages
  FOR ALL TO authenticated
  USING (
    conversation_id IN (
      SELECT c.id FROM ai_conversations c
      JOIN profiles p ON p.tenant_id = c.tenant_id
      WHERE p.id = auth.uid()
    )
  )
  WITH CHECK (
    conversation_id IN (
      SELECT c.id FROM ai_conversations c
      JOIN profiles p ON p.tenant_id = c.tenant_id
      WHERE p.id = auth.uid()
    )
  );
