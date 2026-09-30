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
      'domain_registration',
      'service_store',
      'app_publishing'
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
      'service_store',
      'app_publishing',
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
    storageLimitBytes: 50 * 1024 * 1024 * 1024, // 50 GB
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
