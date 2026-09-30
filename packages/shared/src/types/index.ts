export type PlanTier = 'basic' | 'essential' | 'pro' | 'ultimate';

export type UserRole =
  | 'platform_owner'
  | 'school_super_admin'
  | 'school_admin'
  | 'data_entry_operator'
  | 'accountant'
  | 'teacher'
  | 'parent'
  | 'student';

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

export interface TenantInfo {
  id: string;
  name: string;
  subdomain: string;
  status: 'active' | 'suspended' | 'pending';
  planId: PlanTier;
  paidTill?: string;
  defaultLocale: string;
  timezone: string;
  logoUrl?: string;
  primaryColor?: string;
  themePreset?: string;
}

export interface UserProfile {
  id: string;
  tenantId?: string | null;
  role: UserRole;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  isActive: boolean;
}
