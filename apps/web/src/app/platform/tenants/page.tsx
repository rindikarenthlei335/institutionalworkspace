'use client';

import React, { useState } from 'react';
import { PlatformTenant } from '@/features/platform/types';
import { PlatformMetricsOverview } from '@/features/platform/components/PlatformMetricsOverview';
import { TenantOnboardingWizard } from '@/features/platform/components/TenantOnboardingWizard';
import { AuditedImpersonationModal } from '@/features/platform/components/AuditedImpersonationModal';
import { UserCheck, PauseCircle, PlayCircle } from 'lucide-react';

const INITIAL_TENANTS: PlatformTenant[] = [
  {
    id: 'a1111111-1111-1111-1111-111111111111',
    name: 'Mount Carmel School',
    subdomain: 'mountcarmel',
    status: 'active',
    planId: 'pro',
    billingCycle: 'monthly',
    subscriptionStatus: 'active',
    adminEmail: 'principal@mountcarmel.edu.in',
    adminName: 'Dr. Lalthantluanga',
    storageUsedBytes: 380 * 1024 * 1024,
    createdAt: '2024-01-15'
  },
  {
    id: 'b2222222-2222-2222-2222-222222222222',
    name: 'St Marys School',
    subdomain: 'stmarys',
    status: 'active',
    planId: 'basic',
    billingCycle: 'monthly',
    subscriptionStatus: 'active',
    adminEmail: 'admin@stmarys.edu.in',
    adminName: 'Fr. Thomas',
    storageUsedBytes: 40 * 1024 * 1024,
    createdAt: '2024-03-10'
  }
];

export default function PlatformTenantsPage() {
  const [tenants, setTenants] = useState<PlatformTenant[]>(INITIAL_TENANTS);
  const [showOnboard, setShowOnboard] = useState(false);
  const [impersonatingTenant, setImpersonatingTenant] = useState<PlatformTenant | null>(null);

  const toggleStatus = (id: string) => {
    setTenants(tenants.map(t => t.id === id ? { ...t, status: t.status === 'active' ? 'suspended' : 'active' } : t));
  };

  const handleImpersonateConfirm = () => {
    if (impersonatingTenant) {
      window.location.href = `/admin/dashboard?tenant=${impersonatingTenant.subdomain}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Multi-Tenant Platform</span>
          <h1 className="font-display font-bold text-2xl text-white">Tenants Directory</h1>
        </div>
        <button
          onClick={() => setShowOnboard(true)}
          className="px-4 h-9 rounded bg-emerald-600 hover:bg-emerald-500 font-semibold text-xs text-white cursor-pointer"
        >
          + Onboard New School
        </button>
      </div>

      <PlatformMetricsOverview />

      <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="p-4">School Name</th>
              <th className="p-4">Subdomain</th>
              <th className="p-4">Plan</th>
              <th className="p-4">Status</th>
              <th className="p-4">Storage Used</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {tenants.map((t) => (
              <tr key={t.id} className="hover:bg-slate-900/50">
                <td className="p-4 font-semibold text-white">
                  <span>{t.name}</span>
                  <span className="block text-[11px] font-normal text-slate-400">{t.adminEmail}</span>
                </td>
                <td className="p-4 font-mono text-emerald-400">{t.subdomain}.eduportal.com</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${t.planId === 'pro' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-300'}`}>
                    {t.planId.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  {t.status === 'active' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">Active</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/20 text-rose-400">Suspended</span>
                  )}
                </td>
                <td className="p-4 font-mono text-[11px] text-slate-300">
                  {Math.round(t.storageUsedBytes / (1024 * 1024))} MB
                </td>
                <td className="p-4 text-right space-x-3">
                  <button
                    onClick={() => setImpersonatingTenant(t)}
                    className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 inline mr-1" /> Impersonate Admin
                  </button>
                  <button
                    onClick={() => toggleStatus(t.id)}
                    className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    {t.status === 'active' ? <PauseCircle className="w-3.5 h-3.5 inline text-rose-400" /> : <PlayCircle className="w-3.5 h-3.5 inline text-emerald-400" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <TenantOnboardingWizard
        isOpen={showOnboard}
        onClose={() => setShowOnboard(false)}
        onSuccess={(newTenant) => setTenants([...tenants, newTenant])}
      />

      <AuditedImpersonationModal
        isOpen={!!impersonatingTenant}
        tenantName={impersonatingTenant?.name || ''}
        subdomain={impersonatingTenant?.subdomain || ''}
        onClose={() => setImpersonatingTenant(null)}
        onConfirm={handleImpersonateConfirm}
      />
    </div>
  );
}
