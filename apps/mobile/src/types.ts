export type UserRole = 'parent' | 'student' | 'staff';

export interface TenantBranding {
  primaryColor: string;
  secondaryColor: string;
  crestInitials: string;
  logoUrl?: string;
}

export interface TenantEntitlements {
  planId: 'basic' | 'essential' | 'pro' | 'ultimate';
  modulesEnabled: {
    fees: boolean;
    exams: boolean;
    digitalId: boolean;
    notices: boolean;
    attendance?: boolean;
  };
}

export interface AppVersioning {
  clientVersion: string;
  latestVersion: string;
  minSupportedVersion: string;
  forceUpdate: boolean;
  updateUrl?: string;
}

export interface TenantConfig {
  tenant: {
    id: string;
    slug: string;
    name: string;
    schoolCode: string;
    plan: string;
    status: string;
  };
  branding: TenantBranding;
  entitlements: TenantEntitlements;
  appVersioning: AppVersioning;
  compliance: {
    privacyPolicyUrl: string;
    termsOfServiceUrl: string;
    accountDeletionUrl: string;
  };
  reviewerDemoAccount?: {
    isAvailable: boolean;
    username: string;
    passwordHint: string;
    role: UserRole;
  };
}

export interface MobileUserSession {
  userId: string;
  role: UserRole;
  name: string;
  identifier: string; // admission_no or employee_id
  className?: string;
  token: string;
}
