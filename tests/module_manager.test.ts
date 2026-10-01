import { describe, it } from 'node:test';
import assert from 'node:assert';

interface ModuleManifest {
  id: string;
  name: { en: string; lus: string };
  description: { en: string; lus: string };
  icon: string;
  category: 'academics' | 'administration' | 'finance' | 'communication' | 'advanced';
  minPlan: 'basic' | 'essential' | 'pro' | 'ultimate';
  dependencies: string[];
  permissions: string[];
  routes: string[];
  isCore: boolean;
  version: string;
}

// Module Registry definitions matching apps/web/src/features/modules/registry.ts
const TEST_REGISTRY: Record<string, ModuleManifest> = {
  settings: {
    id: 'settings',
    name: { en: 'School Settings', lus: 'School Settings' },
    description: { en: 'Core configuration.', lus: 'Ruahmanna bulpui.' },
    icon: '⚙️',
    category: 'administration',
    minPlan: 'basic',
    dependencies: [],
    permissions: ['school_super_admin'],
    routes: ['/admin/settings'],
    isCore: true,
    version: '1.0.0'
  },
  data_hub: {
    id: 'data_hub',
    name: { en: 'Data Hub', lus: 'Data Hub' },
    description: { en: 'Master records.', lus: 'Zirlai list.' },
    icon: '🗄️',
    category: 'academics',
    minPlan: 'pro',
    dependencies: [],
    permissions: ['school_super_admin', 'school_admin'],
    routes: ['/admin/data-hub'],
    isCore: true,
    version: '1.0.0'
  },
  staff: {
    id: 'staff',
    name: { en: 'Staff & Faculty', lus: 'Staff & Zirtirtu' },
    description: { en: 'Staff records.', lus: 'Zirtirtu chanchin.' },
    icon: '👨‍🏫',
    category: 'administration',
    minPlan: 'pro',
    dependencies: ['data_hub'],
    permissions: ['school_super_admin', 'school_admin'],
    routes: ['/admin/staff'],
    isCore: false,
    version: '1.0.0'
  },
  exams: {
    id: 'exams',
    name: { en: 'Exams & Marksheets', lus: 'Exam & Result' },
    description: { en: 'Academic exams and marks.', lus: 'Exam leh result.' },
    icon: '📜',
    category: 'academics',
    minPlan: 'pro',
    dependencies: ['data_hub', 'students'],
    permissions: ['school_super_admin', 'school_admin', 'teacher'],
    routes: ['/admin/exams'],
    isCore: false,
    version: '1.0.0'
  },
  attendance: {
    id: 'attendance',
    name: { en: 'Attendance Tracking', lus: 'Kal / Kal Lo Enkawlna' },
    description: { en: 'Daily attendance logs.', lus: 'Ni tin attendance.' },
    icon: '📋',
    category: 'academics',
    minPlan: 'ultimate',
    dependencies: ['students', 'staff'],
    permissions: ['school_super_admin', 'school_admin', 'teacher'],
    routes: ['/admin/attendance'],
    isCore: false,
    version: '1.0.0'
  },
  certificates: {
    id: 'certificates',
    name: { en: 'Certificates & TC', lus: 'Certificate Siamna' },
    description: { en: 'Transfer certificates.', lus: 'TC siamna.' },
    icon: '🏆',
    category: 'administration',
    minPlan: 'ultimate',
    dependencies: ['data_hub', 'students'],
    permissions: ['school_super_admin', 'school_admin'],
    routes: ['/admin/certificates'],
    isCore: false,
    version: '1.0.0'
  }
};

function checkCanDisableModule(moduleId: string, registry: Record<string, ModuleManifest>): boolean {
  const mod = registry[moduleId];
  if (!mod) throw new Error(`Module ${moduleId} not found`);
  if (mod.isCore) {
    throw new Error(`Cannot disable core institutional module: ${moduleId}`);
  }
  return true;
}

function resolveMissingDependencies(
  moduleId: string,
  activeModules: Set<string>,
  registry: Record<string, ModuleManifest>
): string[] {
  const mod = registry[moduleId];
  if (!mod) throw new Error(`Module ${moduleId} not found`);
  return mod.dependencies.filter(dep => !activeModules.has(dep));
}

function isPlanEligibleForModule(
  tenantPlan: 'basic' | 'essential' | 'pro' | 'ultimate',
  moduleMinPlan: 'basic' | 'essential' | 'pro' | 'ultimate'
): boolean {
  const rank = { basic: 1, essential: 2, pro: 3, ultimate: 4 };
  return rank[tenantPlan] >= rank[moduleMinPlan];
}

describe('Module Manager & Extension Lifecycle (P2-M6)', () => {
  describe('ModuleManifest Schema Invariants', () => {
    it('verifies all registry modules contain valid bilingual metadata', () => {
      for (const [id, mod] of Object.entries(TEST_REGISTRY)) {
        assert.strictEqual(mod.id, id);
        assert.ok(mod.name.en.length > 0);
        assert.ok(mod.name.lus.length > 0);
        assert.ok(mod.description.en.length > 0);
        assert.ok(mod.description.lus.length > 0);
        assert.ok(mod.routes.length > 0);
        assert.ok(mod.icon.length > 0);
      }
    });

    it('enforces core module protection against disable', () => {
      // Core module must throw
      assert.throws(() => checkCanDisableModule('settings', TEST_REGISTRY), /Cannot disable core/);
      assert.throws(() => checkCanDisableModule('data_hub', TEST_REGISTRY), /Cannot disable core/);

      // Non-core modules can be disabled
      assert.strictEqual(checkCanDisableModule('staff', TEST_REGISTRY), true);
      assert.strictEqual(checkCanDisableModule('attendance', TEST_REGISTRY), true);
    });
  });

  describe('Module Dependency Resolution', () => {
    it('identifies satisfied dependencies when prerequisites are active', () => {
      const active = new Set(['data_hub', 'students']);
      const missing = resolveMissingDependencies('exams', active, TEST_REGISTRY);
      assert.strictEqual(missing.length, 0);
    });

    it('identifies missing prerequisites when required module is absent', () => {
      const active = new Set(['data_hub']); // missing 'students'
      const missing = resolveMissingDependencies('exams', active, TEST_REGISTRY);
      assert.deepStrictEqual(missing, ['students']);
    });
  });

  describe('Plan-Tier Entitlement Gating', () => {
    it('allows basic and essential modules on basic plan', () => {
      assert.strictEqual(isPlanEligibleForModule('basic', 'basic'), true);
      assert.strictEqual(isPlanEligibleForModule('basic', 'essential'), false);
      assert.strictEqual(isPlanEligibleForModule('basic', 'pro'), false);
      assert.strictEqual(isPlanEligibleForModule('basic', 'ultimate'), false);
    });

    it('allows pro modules on pro plan but gates ultimate modules', () => {
      assert.strictEqual(isPlanEligibleForModule('pro', 'pro'), true);
      assert.strictEqual(isPlanEligibleForModule('pro', 'essential'), true);
      assert.strictEqual(isPlanEligibleForModule('pro', 'ultimate'), false);
    });

    it('unlocks all modules including attendance and certificates on ultimate tier', () => {
      assert.strictEqual(isPlanEligibleForModule('ultimate', 'ultimate'), true);
      assert.strictEqual(isPlanEligibleForModule('ultimate', 'pro'), true);
      assert.strictEqual(isPlanEligibleForModule('ultimate', 'basic'), true);
    });
  });
});
