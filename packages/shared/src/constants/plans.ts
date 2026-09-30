import { PlanConfig, PlanTier } from '../types/index';

export const PLAN_DEFAULTS: Record<PlanTier, PlanConfig> = {
  basic: {
    id: 'basic',
    name: 'Basic',
    priceMonthly: 1499,
    storageLimitBytes: 2 * 1024 * 1024 * 1024, // 2 GB
    uiLevel: 1,
    features: [
      'public_website',
      'theme_customization',
      'cms_admin',
      'custom_domain',
      'domain_registration'
    ]
  },
  essential: {
    id: 'essential',
    name: 'Essential',
    priceMonthly: 3999,
    storageLimitBytes: 5 * 1024 * 1024 * 1024, // 5 GB
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
      'audit_logs'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 8000,
    storageLimitBytes: 20 * 1024 * 1024 * 1024, // 20 GB
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
      'audit_logs'
    ]
  }
};
