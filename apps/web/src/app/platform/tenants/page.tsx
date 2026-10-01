'use client';

import React, { useState, useEffect } from 'react';
import { PlatformTenant } from '@/features/platform/types';
import { PlatformMetricsOverview } from '@/features/platform/components/PlatformMetricsOverview';
import { TenantOnboardingWizard } from '@/features/platform/components/TenantOnboardingWizard';
import { AuditedImpersonationModal } from '@/features/platform/components/AuditedImpersonationModal';
import { UserCheck, PauseCircle, PlayCircle, ShieldCheck, Check, Clock, Eye, AlertCircle } from 'lucide-react';

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
  const [pendingOrder, setPendingOrder] = useState<any | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eduportal_active_order');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.status === 'pending_approval') {
            setPendingOrder(parsed);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const handleApprovePending = () => {
    if (!pendingOrder) return;
    const approvedTenant: PlatformTenant = {
      id: crypto.randomUUID(),
      name: pendingOrder.schoolName,
      subdomain: pendingOrder.subdomain,
      status: 'active',
      planId: pendingOrder.planTier === 'pro_plus' ? 'pro' : pendingOrder.planTier,
      billingCycle: pendingOrder.billingCycle,
      subscriptionStatus: 'active',
      adminEmail: 'admin@' + (pendingOrder.domainType === 'subdomain' ? `${pendingOrder.subdomain}.eduportal.in` : pendingOrder.customDomainName),
      adminName: pendingOrder.payerName,
      storageUsedBytes: 15 * 1024 * 1024,
      createdAt: new Date().toISOString()
    };

    setTenants([approvedTenant, ...tenants]);
    const updated = { ...pendingOrder, status: 'approved' };
    setPendingOrder(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eduportal_active_order', JSON.stringify(updated));
    }
    alert(`✓ ${approvedTenant.name} has been approved and provisioned!`);
  };

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

      {/* Pending School Verification & Approval Queue */}
      {pendingOrder && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-amber-500/30 pb-3">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 font-bold text-lg">⏳</span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-base text-white">Pending Approval: {pendingOrder.schoolName}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Ref: {pendingOrder.orderId}
                  </span>
                </div>
                <p className="text-xs text-amber-200/80">Submitted by {pendingOrder.payerName} ({pendingOrder.payerPhone})</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleApprovePending}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>✓ Approve & Provision School Instantly</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Plan & Investment</span>
              <span className="font-bold text-emerald-400 uppercase text-sm">{pendingOrder.planTier} Tier</span>
              <span className="text-white font-mono block">Paid: ₹{pendingOrder.totalAmount?.toLocaleString('en-IN')}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Domain Configuration</span>
              <span className="font-mono text-white block">
                {pendingOrder.domainType === 'subdomain' ? `${pendingOrder.subdomain}.eduportal.in` : pendingOrder.customDomainName}
              </span>
              <span className="text-[10px] text-slate-400 block">{pendingOrder.domainType === 'subdomain' ? 'Instant Subdomain' : 'Custom Domain'}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment UTR / Ref</span>
              <span className="font-mono font-bold text-amber-300 text-sm block">{pendingOrder.transactionId}</span>
              <span className="text-[10px] text-emerald-400 block">Verified UPI Transaction</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Screenshot</span>
              {pendingOrder.receiptScreenshotUrl && (
                <a href={pendingOrder.receiptScreenshotUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Receipt Proof</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

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
