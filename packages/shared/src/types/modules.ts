import type { PlanTier, UserRole } from './index';

export type ModuleCategory = 'academics' | 'administration' | 'finance' | 'communication' | 'advanced';

export type ModuleStatus = 'available' | 'installed_enabled' | 'installed_disabled' | 'archived';

export interface ModuleNavEntry {
  label: { en: string; lus: string };
  path: string;
  icon?: string;
  badge?: string;
  proOnly?: boolean;
}

export interface ModuleSettingField {
  key: string;
  label: { en: string; lus: string };
  type: 'string' | 'number' | 'boolean' | 'select';
  defaultValue?: any;
  options?: Array<{ label: string; value: string }>;
  description?: { en: string; lus: string };
}

export interface GuidedSetupStep {
  step: number;
  title: { en: string; lus: string };
  description: { en: string; lus: string };
}

export interface ModuleManifest {
  id: string;
  name: { en: string; lus: string };
  description: { en: string; lus: string };
  icon: string;
  category: ModuleCategory;
  minPlan: PlanTier;
  dependencies: string[];
  permissions: UserRole[];
  routes: string[];
  navEntries: ModuleNavEntry[];
  settingsSchema: ModuleSettingField[];
  guidedSetupSteps: GuidedSetupStep[];
  helpArticles: string[];
  isCore: boolean;
  version: string;
}

export interface TenantModuleState {
  moduleId: string;
  status: ModuleStatus;
  settings: Record<string, any>;
  version: string;
  installedAt?: string;
}
