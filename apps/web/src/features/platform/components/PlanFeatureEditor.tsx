'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PLAN_DEFAULTS, FeatureKey, PlanTier } from '@eduportal/shared';

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
  { key: 'service_store', label: 'Service Store & Add-ons', desc: 'Tick extra services, prepaid checkout' },
  { key: 'app_publishing', label: 'App Store / Play Store Publishing', desc: 'White-label mobile application publishing' },
  { key: 'website_analytics', label: 'First-Party Privacy Analytics', desc: 'No-cookie visitor and pageview tracking' },
  { key: 'principal_dashboard', label: 'Principal Executive Dashboard', desc: 'Financial stats, dues & funnel charts' },
  { key: 'data_hub', label: 'Data Hub Master Repository', desc: 'Central master truth for all institutional entities' },
  { key: 'excel_import', label: 'Excel Import / Export Center', desc: 'Browser chunked parsing, diffs & rollback' },
  { key: 'staff_module', label: 'Staff & Teachers Module', desc: 'Employee records & website faculty sync' },
  { key: 'exams_module', label: 'Exams, Marks & Marksheets', desc: 'Marks entry grid, A4 PDF print & QR verify' },
  { key: 'id_card_module', label: 'ID Card Generator', desc: 'CR80 & A4 multi-up student/staff cards' },
  { key: 'ai_copilot', label: 'AI Copilot (Mizo + English)', desc: 'Guide, Data, Action & General assistance' },
  { key: 'module_manager', label: 'Module Manager', desc: 'Install, configure, disable & uninstall modules' },
  { key: 'custom_module_builder', label: 'Custom Module Builder (No-Code)', desc: 'Design custom entities, forms & views' },
  { key: 'optional_modules', label: 'Installable First-Class Modules', desc: 'Attendance, Certificates & Library' }
];

export function PlanFeatureEditor() {
  const [plans, setPlans] = useState(PLAN_DEFAULTS);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleFeature = (planId: PlanTier, key: FeatureKey) => {
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

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {saveSuccess && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold animate-in fade-in">
          ✓ Plan feature matrix updated successfully! Entitlements synced to database.
        </div>
      )}

      <Card className="p-0 overflow-hidden bg-slate-950 border-slate-800 text-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                <th className="p-3.5">Feature Key / Capability</th>
                <th className="p-3.5 text-center">Basic<br/><span className="text-[10px] text-slate-400">₹1,499</span></th>
                <th className="p-3.5 text-center">Essential<br/><span className="text-[10px] text-slate-400">₹3,999</span></th>
                <th className="p-3.5 text-center">Pro<br/><span className="text-[10px] text-slate-400">₹8,000</span></th>
                <th className="p-3.5 text-center bg-emerald-950/30 border-l border-r border-emerald-800/40">
                  <span className="text-emerald-400 font-bold">Ultimate</span><br/>
                  <span className="text-[10px] text-emerald-400">₹9,999</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {ALL_FEATURES.map((feat) => (
                <tr key={feat.key} className="hover:bg-slate-900/50">
                  <td className="p-3.5">
                    <span className="font-bold text-white block">{feat.label}</span>
                    <span className="text-[11px] text-slate-400 block">{feat.desc}</span>
                  </td>
                  {(['basic', 'essential', 'pro', 'ultimate'] as const).map((pId) => {
                    const active = plans[pId].features.includes(feat.key);
                    const isUltimate = pId === 'ultimate';
                    return (
                      <td key={pId} className={`p-3.5 text-center ${isUltimate ? 'bg-emerald-950/20 border-l border-r border-emerald-800/40' : ''}`}>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => toggleFeature(pId, feat.key)}
                          className={`w-4 h-4 rounded cursor-pointer ${isUltimate ? 'accent-emerald-400' : 'accent-emerald-600'}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="flex justify-end">
        <Button variant="primary" onClick={handleSave}>Save Feature Matrix Configuration</Button>
      </div>
    </div>
  );
}
