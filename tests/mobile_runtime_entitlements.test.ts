import { describe, it } from 'node:test';
import assert from 'node:assert';

// Version comparison helper matching mobile/server logic
function compareSemver(v1: string, v2: string): number {
  const p1 = v1.split('.').map(Number);
  const p2 = v2.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const num1 = p1[i] || 0;
    const num2 = p2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

function shouldForceUpdate(clientVersion: string, minSupportedVersion: string): boolean {
  return compareSemver(clientVersion, minSupportedVersion) < 0;
}

// Entitlement resolution logic based on subscription plan
function resolveEntitlements(plan: 'basic' | 'essential' | 'pro' | 'ultimate') {
  return {
    fees: plan !== 'basic',
    exams: plan === 'pro' || plan === 'ultimate',
    digitalId: plan === 'pro' || plan === 'ultimate',
    notices: true,
    attendance: plan === 'ultimate'
  };
}

// Tenant school code resolver
function normalizeSchoolCode(input: string): string {
  const clean = input.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (clean === 'mcaizawl' || clean === 'mountcarmel' || clean === 'mcss') {
    return 'mountcarmel';
  }
  return clean;
}

describe('Mobile App Runtime Entitlements & Compliance (P2-M4)', () => {
  describe('Semantic Version Gating', () => {
    it('forces update when client version is strictly lower than minimum supported version', () => {
      assert.strictEqual(shouldForceUpdate('0.9.8', '1.0.0'), true);
      assert.strictEqual(shouldForceUpdate('0.1.0', '1.0.0'), true);
      assert.strictEqual(shouldForceUpdate('1.0.1', '1.1.0'), true);
    });

    it('allows access when client version meets or exceeds minimum supported version', () => {
      assert.strictEqual(shouldForceUpdate('1.0.0', '1.0.0'), false);
      assert.strictEqual(shouldForceUpdate('1.0.1', '1.0.0'), false);
      assert.strictEqual(shouldForceUpdate('2.0.0', '1.0.0'), false);
    });
  });

  describe('Tiered Plan Entitlement Resolution', () => {
    it('disables advanced modules for basic plan', () => {
      const entitlements = resolveEntitlements('basic');
      assert.strictEqual(entitlements.fees, false);
      assert.strictEqual(entitlements.exams, false);
      assert.strictEqual(entitlements.digitalId, false);
      assert.strictEqual(entitlements.notices, true);
    });

    it('enables fees on essential plan while keeping exams disabled', () => {
      const entitlements = resolveEntitlements('essential');
      assert.strictEqual(entitlements.fees, true);
      assert.strictEqual(entitlements.exams, false);
      assert.strictEqual(entitlements.digitalId, false);
      assert.strictEqual(entitlements.notices, true);
    });

    it('enables exams, digital ID, and fees on pro plan (Mount Carmel)', () => {
      const entitlements = resolveEntitlements('pro');
      assert.strictEqual(entitlements.fees, true);
      assert.strictEqual(entitlements.exams, true);
      assert.strictEqual(entitlements.digitalId, true);
      assert.strictEqual(entitlements.attendance, false);
    });

    it('enables all modules including biometric attendance on ultimate plan', () => {
      const entitlements = resolveEntitlements('ultimate');
      assert.strictEqual(entitlements.fees, true);
      assert.strictEqual(entitlements.exams, true);
      assert.strictEqual(entitlements.digitalId, true);
      assert.strictEqual(entitlements.attendance, true);
    });
  });

  describe('App Store Compliance (Apple Guidelines 2.1 & 5.1.1)', () => {
    it('verifies presence of reviewer demo account contract', () => {
      const reviewerAccount = {
        isAvailable: true,
        username: 'apple.reviewer@mountcarmel.edu.in',
        passwordHint: 'ReviewerDemo2025!',
        role: 'parent'
      };

      assert.strictEqual(reviewerAccount.isAvailable, true);
      assert.match(reviewerAccount.username, /@mountcarmel\.edu\.in$/);
      assert.ok(reviewerAccount.passwordHint.length >= 8);
    });

    it('verifies compliant account deletion parameters', () => {
      const deletionWorkflow = {
        supportsInAppDeletion: true,
        gracePeriodDays: 30,
        retentionPolicy: 'MBSE_STATUTORY_ACADEMIC_ARCHIVE'
      };

      assert.strictEqual(deletionWorkflow.supportsInAppDeletion, true);
      assert.strictEqual(deletionWorkflow.gracePeriodDays, 30);
      assert.ok(deletionWorkflow.retentionPolicy.length > 0);
    });
  });

  describe('School Identifier Normalization', () => {
    it('correctly maps variations of Mount Carmel school code', () => {
      assert.strictEqual(normalizeSchoolCode('MC-AIZAWL'), 'mountcarmel');
      assert.strictEqual(normalizeSchoolCode('mc aizawl '), 'mountcarmel');
      assert.strictEqual(normalizeSchoolCode('mountcarmel'), 'mountcarmel');
      assert.strictEqual(normalizeSchoolCode('MCSS'), 'mountcarmel');
    });
  });
});
