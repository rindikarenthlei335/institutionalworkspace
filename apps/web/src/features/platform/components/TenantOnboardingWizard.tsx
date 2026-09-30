'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PlanTier } from '@eduportal/shared';

export interface TenantOnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tenant: any) => void;
}

export function TenantOnboardingWizard({ isOpen, onClose, onSuccess }: TenantOnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    schoolName: '',
    subdomain: '',
    planId: 'essential' as PlanTier,
    adminFullName: '',
    adminEmail: ''
  });
  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'checking' | 'available' | 'reserved'>('idle');

  if (!isOpen) return null;

  const checkSubdomain = (val: string) => {
    const slug = val.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setFormData(prev => ({ ...prev, subdomain: slug }));

    if (['www', 'admin', 'api', 'platform', 'app'].includes(slug)) {
      setSubdomainStatus('reserved');
    } else if (slug.length >= 3) {
      setSubdomainStatus('available');
    } else {
      setSubdomainStatus('idle');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTenant = {
      id: crypto.randomUUID(),
      name: formData.schoolName,
      subdomain: formData.subdomain,
      status: 'active',
      planId: formData.planId,
      billingCycle: 'monthly',
      subscriptionStatus: 'active',
      adminEmail: formData.adminEmail,
      adminName: formData.adminFullName,
      storageUsedBytes: 0,
      createdAt: new Date().toISOString()
    };
    onSuccess(newTenant);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg space-y-6 bg-slate-900 border-slate-800 text-white">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Step {step} of 3</span>
            <h3 className="font-display font-bold text-lg text-white">Onboard New School Tenant</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">✕ Close</button>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="School Name"
              placeholder="e.g. St. Xaviers Higher Secondary School"
              required
              value={formData.schoolName}
              onChange={e => setFormData({ ...formData, schoolName: e.target.value })}
            />
            <div className="space-y-1.5">
              <Input
                label="Desired Subdomain"
                placeholder="stxaviers"
                required
                value={formData.subdomain}
                onChange={e => checkSubdomain(e.target.value)}
              />
              <p className="text-[11px] font-mono text-slate-400">
                Full Address: https://{formData.subdomain || 'subdomain'}.eduportal.com
              </p>
              {subdomainStatus === 'available' && (
                <p className="text-[11px] text-emerald-400 font-semibold">✓ Subdomain is available for registration</p>
              )}
              {subdomainStatus === 'reserved' && (
                <p className="text-[11px] text-rose-400 font-semibold">✕ This subdomain is reserved by the platform</p>
              )}
            </div>
            <Button
              variant="primary"
              className="w-full"
              disabled={!formData.schoolName || subdomainStatus !== 'available'}
              onClick={() => setStep(2)}
            >
              Next: Select Plan & Features →
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-slate-300">Choose Subscription Plan</label>
            <div className="grid grid-cols-3 gap-2">
              {(['basic', 'essential', 'pro'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({ ...formData, planId: p })}
                  className={`p-3 rounded border text-left transition-all cursor-pointer ${
                    formData.planId === p
                      ? 'border-emerald-500 bg-emerald-500/10 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="block font-bold capitalize text-xs">{p}</span>
                  <span className="block font-mono text-[10px] text-emerald-400 mt-1">
                    {p === 'basic' ? '₹1,499/mo' : p === 'essential' ? '₹3,999/mo' : '₹8,000/mo'}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep(1)}>← Back</Button>
              <Button variant="primary" onClick={() => setStep(3)}>Next: Super Admin Details →</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Super Admin Full Name"
              placeholder="e.g. Fr. Joseph Thomas"
              required
              value={formData.adminFullName}
              onChange={e => setFormData({ ...formData, adminFullName: e.target.value })}
            />
            <Input
              label="Super Admin Email"
              type="email"
              placeholder="principal@stxaviers.edu.in"
              required
              value={formData.adminEmail}
              onChange={e => setFormData({ ...formData, adminEmail: e.target.value })}
            />
            <p className="text-[11px] text-slate-400">
              An invitation email with login link and initial password will be sent automatically.
            </p>

            <div className="flex justify-between pt-4 border-t border-slate-800">
              <Button variant="secondary" type="button" onClick={() => setStep(2)}>← Back</Button>
              <Button variant="primary" type="submit">Complete School Onboarding</Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
