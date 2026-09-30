import { FeatureKey, PLAN_DEFAULTS, PlanTier } from '@eduportal/shared';

export interface FeatureGateOptions {
  planId: PlanTier;
  tenantOverrides?: Record<string, boolean>;
}

export function isFeatureEnabled(
  featureKey: FeatureKey,
  options: FeatureGateOptions
): boolean {
  // Check override first
  if (options.tenantOverrides && options.tenantOverrides[featureKey] !== undefined) {
    return options.tenantOverrides[featureKey];
  }

  // Check plan defaults
  const plan = PLAN_DEFAULTS[options.planId];
  if (!plan) return false;

  return plan.features.includes(featureKey);
}
