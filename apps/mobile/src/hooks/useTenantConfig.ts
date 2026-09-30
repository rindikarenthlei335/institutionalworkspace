import { useState, useEffect } from 'react';
import type { TenantConfig } from '../types';

export const DEFAULT_MOUNT_CARMEL_CONFIG: TenantConfig = {
  tenant: {
    id: '00000000-0000-0000-0000-000000000001',
    slug: 'mountcarmel',
    name: 'Mount Carmel Higher Secondary School',
    schoolCode: 'MC-AIZAWL',
    plan: 'pro',
    status: 'active'
  },
  branding: {
    primaryColor: '#163A2B',
    secondaryColor: '#C9A84C',
    crestInitials: 'MC'
  },
  entitlements: {
    planId: 'pro',
    modulesEnabled: {
      fees: true,
      exams: true,
      digitalId: true,
      notices: true,
      attendance: false
    }
  },
  appVersioning: {
    clientVersion: '1.0.0',
    latestVersion: '1.0.0',
    minSupportedVersion: '1.0.0',
    forceUpdate: false
  },
  compliance: {
    privacyPolicyUrl: 'https://mountcarmel.eduportal.com/about#privacy',
    termsOfServiceUrl: 'https://mountcarmel.eduportal.com/about#terms',
    accountDeletionUrl: 'https://mountcarmel.eduportal.com/portal/profile#delete-account'
  },
  reviewerDemoAccount: {
    isAvailable: true,
    username: 'apple.reviewer@mountcarmel.edu.in',
    passwordHint: 'ReviewerDemo2025!',
    role: 'parent'
  }
};

export function useTenantConfig(tenantSlug: string = 'mountcarmel') {
  const [config, setConfig] = useState<TenantConfig>(DEFAULT_MOUNT_CARMEL_CONFIG);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchConfig() {
      setLoading(true);
      try {
        const res = await fetch(`https://mountcarmel.eduportal.com/api/v1/tenant/config?tenant=${tenantSlug}&version=1.0.0`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setConfig(data);
          }
        }
      } catch (err: any) {
        // Fallback to offline defaults
        if (isMounted) {
          setError(err.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchConfig();

    return () => {
      isMounted = false;
    };
  }, [tenantSlug]);

  const isModuleEnabled = (module: 'fees' | 'exams' | 'digitalId' | 'notices'): boolean => {
    return !!config.entitlements.modulesEnabled[module];
  };

  return {
    config,
    loading,
    error,
    isModuleEnabled,
    forceUpdateRequired: config.appVersioning.forceUpdate
  };
}
