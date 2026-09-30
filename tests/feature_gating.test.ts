import test from 'node:test';
import assert from 'node:assert/strict';

export type PlanKey = 'basic' | 'essential' | 'pro';

export interface PlanConfig {
  name: string;
  priceMonthly: number;
  features: string[];
}

export const PLAN_DEFAULTS: Record<PlanKey, PlanConfig> = {
  basic: {
    name: 'Basic',
    priceMonthly: 1499,
    features: ['public_website', 'theme_customization', 'cms_admin', 'custom_domain']
  },
  essential: {
    name: 'Essential',
    priceMonthly: 3999,
    features: [
      'public_website',
      'theme_customization',
      'cms_admin',
      'custom_domain',
      'user_management',
      'student_management',
      'fee_management',
      'online_payment',
      'online_admission',
      'parent_portal'
    ]
  },
  pro: {
    name: 'Pro',
    priceMonthly: 8000,
    features: [
      'public_website',
      'theme_customization',
      'cms_admin',
      'custom_domain',
      'user_management',
      'student_management',
      'fee_management',
      'online_payment',
      'online_admission',
      'parent_portal',
      'website_analytics',
      'principal_dashboard'
    ]
  }
};

export function hasFeatureAccess(
  planKey: PlanKey,
  featureKey: string,
  overrides?: Record<string, boolean>
): boolean {
  if (overrides && typeof overrides[featureKey] === 'boolean') {
    return overrides[featureKey];
  }
  return PLAN_DEFAULTS[planKey].features.includes(featureKey);
}

test('Feature Gating: Plan hierarchy verification', () => {
  // Basic plan checks
  assert.equal(hasFeatureAccess('basic', 'public_website'), true);
  assert.equal(hasFeatureAccess('basic', 'student_management'), false);
  assert.equal(hasFeatureAccess('basic', 'principal_dashboard'), false);

  // Essential plan checks
  assert.equal(hasFeatureAccess('essential', 'student_management'), true);
  assert.equal(hasFeatureAccess('essential', 'fee_management'), true);
  assert.equal(hasFeatureAccess('essential', 'principal_dashboard'), false);

  // Pro plan checks
  assert.equal(hasFeatureAccess('pro', 'principal_dashboard'), true);
  assert.equal(hasFeatureAccess('pro', 'website_analytics'), true);
});

test('Feature Gating: Tenant feature override grants & revokes', () => {
  // Grant Pro analytics to an Essential tenant
  const grantOverride = { website_analytics: true };
  assert.equal(hasFeatureAccess('essential', 'website_analytics', grantOverride), true);

  // Revoke online admission from an Essential tenant
  const revokeOverride = { online_admission: false };
  assert.equal(hasFeatureAccess('essential', 'online_admission', revokeOverride), false);
});
