import test from 'node:test';
import assert from 'node:assert/strict';

export type PlanTier = 'basic' | 'essential' | 'pro' | 'ultimate';

export type FeatureKey =
  | 'public_website'
  | 'theme_customization'
  | 'cms_admin'
  | 'user_management'
  | 'student_management'
  | 'fee_management'
  | 'online_payment'
  | 'online_admission'
  | 'parent_portal'
  | 'website_analytics'
  | 'principal_dashboard'
  | 'custom_domain'
  | 'domain_registration'
  | 'audit_logs'
  | 'service_store'
  | 'data_hub'
  | 'excel_import'
  | 'staff_module'
  | 'exams_module'
  | 'id_card_module'
  | 'app_publishing'
  | 'ai_copilot'
  | 'ai_monthly_message_quota'
  | 'module_manager'
  | 'custom_module_builder'
  | 'optional_modules'
  | 'sms_reminders'
  | 'attendance'
  | 'report_cards'
  | 'transport_hostel';

export interface PlanConfig {
  id: PlanTier;
  name: string;
  priceMonthly: number;
  storageLimitBytes: number;
  uiLevel: 1 | 2;
  features: FeatureKey[];
}

export const PLAN_DEFAULTS: Record<PlanTier, PlanConfig> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    priceMonthly: 1499,
    storageLimitBytes: 2 * 1024 * 1024 * 1024,
    uiLevel: 1,
    features: [
      'public_website',
      'theme_customization',
      'cms_admin',
      'custom_domain',
      'domain_registration',
      'service_store',
      'app_publishing'
    ]
  },
  essential: {
    id: 'essential',
    name: 'Essential',
    priceMonthly: 3999,
    storageLimitBytes: 5 * 1024 * 1024 * 1024,
    uiLevel: 1,
    features: [
      'public_website',
      'theme_customization',
      'cms_admin',
      'user_management',
      'student_management',
      'fee_management',
      'online_payment',
      'online_admission',
      'parent_portal',
      'custom_domain',
      'domain_registration',
      'service_store',
      'app_publishing',
      'audit_logs'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 8000,
    storageLimitBytes: 20 * 1024 * 1024 * 1024,
    uiLevel: 2,
    features: [
      'public_website',
      'theme_customization',
      'cms_admin',
      'user_management',
      'student_management',
      'fee_management',
      'online_payment',
      'online_admission',
      'parent_portal',
      'website_analytics',
      'principal_dashboard',
      'custom_domain',
      'domain_registration',
      'service_store',
      'app_publishing',
      'data_hub',
      'excel_import',
      'staff_module',
      'exams_module',
      'id_card_module',
      'audit_logs'
    ]
  },
  ultimate: {
    id: 'ultimate',
    name: 'Ultimate',
    priceMonthly: 9999,
    storageLimitBytes: 50 * 1024 * 1024 * 1024,
    uiLevel: 2,
    features: [
      'public_website',
      'theme_customization',
      'cms_admin',
      'user_management',
      'student_management',
      'fee_management',
      'online_payment',
      'online_admission',
      'parent_portal',
      'website_analytics',
      'principal_dashboard',
      'custom_domain',
      'domain_registration',
      'service_store',
      'app_publishing',
      'data_hub',
      'excel_import',
      'staff_module',
      'exams_module',
      'id_card_module',
      'ai_copilot',
      'ai_monthly_message_quota',
      'module_manager',
      'custom_module_builder',
      'optional_modules',
      'attendance',
      'report_cards',
      'transport_hostel',
      'audit_logs'
    ]
  }
};

export function hasFeatureAccess(
  planKey: PlanTier,
  featureKey: FeatureKey,
  overrides?: Partial<Record<FeatureKey, boolean>>
): boolean {
  if (overrides && typeof overrides[featureKey] === 'boolean') {
    return overrides[featureKey]!;
  }
  return PLAN_DEFAULTS[planKey].features.includes(featureKey);
}

export function evaluatePlanEntitlementStatus(
  currentPlan: PlanTier,
  subscriptionStatus: 'active' | 'downgraded' | 'cancelled' | 'suspended',
  statusUpdatedAt: string,
  gracePeriodDays = 30,
  retentionPeriodDays = 90
): { accessLevel: 'full' | 'read_only' | 'hidden'; dataArchived: boolean } {
  if (subscriptionStatus === 'active') {
    return { accessLevel: 'full', dataArchived: false };
  }

  const elapsedDays = Math.floor(
    (Date.now() - new Date(statusUpdatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (subscriptionStatus === 'downgraded') {
    if (elapsedDays <= gracePeriodDays) {
      return { accessLevel: 'read_only', dataArchived: false };
    }
    return { accessLevel: 'hidden', dataArchived: false };
  }

  if (subscriptionStatus === 'cancelled') {
    if (elapsedDays <= retentionPeriodDays) {
      return { accessLevel: 'hidden', dataArchived: false };
    }
    return { accessLevel: 'hidden', dataArchived: true };
  }

  return { accessLevel: 'hidden', dataArchived: false };
}

test('Feature Gating: 4-Tier Plan hierarchy verification', () => {
  // Basic plan checks
  assert.equal(hasFeatureAccess('basic', 'public_website'), true);
  assert.equal(hasFeatureAccess('basic', 'service_store'), true);
  assert.equal(hasFeatureAccess('basic', 'app_publishing'), true);
  assert.equal(hasFeatureAccess('basic', 'student_management'), false);
  assert.equal(hasFeatureAccess('basic', 'data_hub'), false);
  assert.equal(hasFeatureAccess('basic', 'ai_copilot'), false);

  // Essential plan checks
  assert.equal(hasFeatureAccess('essential', 'student_management'), true);
  assert.equal(hasFeatureAccess('essential', 'fee_management'), true);
  assert.equal(hasFeatureAccess('essential', 'data_hub'), false);
  assert.equal(hasFeatureAccess('essential', 'ai_copilot'), false);

  // Pro plan checks
  assert.equal(hasFeatureAccess('pro', 'data_hub'), true);
  assert.equal(hasFeatureAccess('pro', 'excel_import'), true);
  assert.equal(hasFeatureAccess('pro', 'staff_module'), true);
  assert.equal(hasFeatureAccess('pro', 'exams_module'), true);
  assert.equal(hasFeatureAccess('pro', 'id_card_module'), true);
  assert.equal(hasFeatureAccess('pro', 'ai_copilot'), false);
  assert.equal(hasFeatureAccess('pro', 'module_manager'), false);

  // Ultimate plan checks
  assert.equal(hasFeatureAccess('ultimate', 'ai_copilot'), true);
  assert.equal(hasFeatureAccess('ultimate', 'module_manager'), true);
  assert.equal(hasFeatureAccess('ultimate', 'custom_module_builder'), true);
  assert.equal(hasFeatureAccess('ultimate', 'optional_modules'), true);
  assert.equal(hasFeatureAccess('ultimate', 'attendance'), true);
  assert.equal(hasFeatureAccess('ultimate', 'report_cards'), true);
});

test('Feature Gating: Tenant feature override grants & revokes', () => {
  // Grant AI Copilot to a Pro tenant
  const grantOverride: Partial<Record<FeatureKey, boolean>> = { ai_copilot: true };
  assert.equal(hasFeatureAccess('pro', 'ai_copilot', grantOverride), true);

  // Revoke online admission from an Essential tenant
  const revokeOverride: Partial<Record<FeatureKey, boolean>> = { online_admission: false };
  assert.equal(hasFeatureAccess('essential', 'online_admission', revokeOverride), false);
});

test('Plan Change Behaviour: Downgrade grace period and cancellation retention', () => {
  const now = new Date();

  // Active subscription
  const activeStatus = evaluatePlanEntitlementStatus('pro', 'active', now.toISOString());
  assert.equal(activeStatus.accessLevel, 'full');
  assert.equal(activeStatus.dataArchived, false);

  // Downgraded 10 days ago (within 30-day grace period): remains read_only with upgrade banner
  const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
  const graceStatus = evaluatePlanEntitlementStatus('pro', 'downgraded', tenDaysAgo);
  assert.equal(graceStatus.accessLevel, 'read_only');
  assert.equal(graceStatus.dataArchived, false);

  // Downgraded 45 days ago (past 30-day grace period): hidden but data never deleted
  const fortyFiveDaysAgo = new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString();
  const pastGraceStatus = evaluatePlanEntitlementStatus('pro', 'downgraded', fortyFiveDaysAgo);
  assert.equal(pastGraceStatus.accessLevel, 'hidden');
  assert.equal(pastGraceStatus.dataArchived, false);

  // Cancelled 100 days ago (past 90-day retention period): eligible for archiving
  const hundredDaysAgo = new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString();
  const archivedStatus = evaluatePlanEntitlementStatus('pro', 'cancelled', hundredDaysAgo);
  assert.equal(archivedStatus.dataArchived, true);
});
