import React from 'react';
import { Lock } from 'lucide-react';
import { Button } from './Button';

export interface LockedFeatureProps {
  featureName: string;
  requiredPlan: 'Essential' | 'Pro';
  description?: string;
  onUpgrade?: () => void;
}

export function LockedFeature({
  featureName,
  requiredPlan,
  description = 'Upgrade your school plan to unlock this feature in your dashboard.',
  onUpgrade
}: LockedFeatureProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-dashed border-[var(--border-strong)] rounded-[12px] p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto my-6">
      <div className="w-12 h-12 rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] flex items-center justify-center mb-4">
        <Lock className="w-6 h-6" />
      </div>
      <span className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider mb-1">
        Requires {requiredPlan} Plan
      </span>
      <h3 className="font-display font-bold text-lg text-[var(--text-primary)] mb-2">
        {featureName} is Locked
      </h3>
      <p className="text-xs text-[var(--text-secondary)] mb-6 max-w-xs leading-relaxed">
        {description}
      </p>
      <Button variant="primary" onClick={onUpgrade}>
        Upgrade to {requiredPlan}
      </Button>
    </div>
  );
}
