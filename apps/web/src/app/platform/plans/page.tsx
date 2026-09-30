import React from 'react';
import { PlanFeatureEditor } from '@/features/platform/components/PlanFeatureEditor';

export default function PlatformPlansPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Dynamic Feature Flags</span>
        <h1 className="font-display font-bold text-2xl text-white">SaaS Plans & Feature Matrix Editor</h1>
        <p className="text-xs text-slate-400 mt-1">Changes made here update plan gating instantly without requiring code deploys.</p>
      </div>

      <PlanFeatureEditor />
    </div>
  );
}
