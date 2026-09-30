'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PLAN_DEFAULTS, FeatureKey } from '@eduportal/shared';

const ALL_FEATURES: { key: FeatureKey; label: string; desc: string }[] = [
  { key: 'public_website', label: 'Public School Website', desc: '6 public modules, theme select' },
  { key: 'theme_customization', label: 'Logo & Custom Theme', desc: '8 preset colors & custom CSS override' },
  { key: 'cms_admin', label: 'CMS Content Admin', desc: 'Notices, slides, faculty, gallery CMS' },
  { key: 'user_management', label: 'Multi-staff & Roles', desc: 'Super Admin, Admin, Data Entry, Accountant' },
  { key: 'student_management', label: 'Student Management', desc: 'Student CRUD, CSV import/export' },
  { key: 'fee_management', label: 'Fee Invoicing & Receipts', desc: 'Day vs Hosteller fee structures & PDF receipts' },
  { key: 'online_payment', label: 'Parent Online Fee Payment', desc: 'Razorpay Route split settlement' },
  { key: 'online_admission', label: 'Online Admission Portal', desc: 'Multi-step form & status tracking' },
  { key: 'parent_portal', label: 'Parent / Student PWA', desc: 'Mobile PWA app' },
  { key: 'website_analytics', label: 'First-Party Privacy Analytics', desc: 'No cookie visitor tracking' },
  { key: 'principal_dashboard', label: 'Principal Dashboard', desc: 'Financial stats, dues & funnel charts' }
];

export function PlanFeatureEditor() {
  const [plans, setPlans] = useState(PLAN_DEFAULTS);

  const toggleFeature = (planId: 'basic' | 'essential' | 'pro', key: FeatureKey) => {
    setPlans(prev => {
      const plan = prev[planId];
      const has = plan.features.includes(key);
      const newFeatures = has ? plan.features.filter(f => f !== key) : [...plan.features, key];
      return {
        ...prev,
        [planId]: { ...plan, features: newFeatures }
      };
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-0 overflow-hidden bg-slate-950 border-slate-800 text-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
              <th className="p-4">Feature Key / Name</th>
              <th className="p-4 text-center">Basic (₹1,499)</th>
              <th className="p-4 text-center">Essential (₹3,999)</th>
              <th className="p-4 text-center">Pro (₹8,000)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {ALL_FEATURES.map((feat) => (
              <tr key={feat.key} className="hover:bg-slate-900/50">
                <td className="p-4">
                  <span className="font-bold text-white block">{feat.label}</span>
                  <span className="text-[11px] text-slate-400 block">{feat.desc}</span>
                </td>
                {(['basic', 'essential', 'pro'] as const).map((pId) => {
                  const active = plans[pId].features.includes(feat.key);
                  return (
                    <td key={pId} className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={active}
                        onChange={() => toggleFeature(pId, feat.key)}
                        className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <div className="flex justify-end">
        <Button variant="primary">Save Feature Matrix Configuration</Button>
      </div>
    </div>
  );
}
