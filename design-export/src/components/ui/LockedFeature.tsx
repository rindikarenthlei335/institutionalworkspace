import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Plan } from '../../lib/plan';

interface LockedFeatureProps {
  children: React.ReactNode;
  requiredPlan: Plan;
  currentPlan: Plan;
  featureName: string;
}

const planOrder: Plan[] = ['basic', 'essential', 'pro'];

export function LockedFeature({ children, requiredPlan, currentPlan, featureName }: LockedFeatureProps) {
  const [showModal, setShowModal] = useState(false);
  const isLocked = planOrder.indexOf(currentPlan) < planOrder.indexOf(requiredPlan);

  if (!isLocked) return <>{children}</>;

  const planLabel = requiredPlan === 'essential' ? 'Essential' : 'Pro';

  return (
    <>
      <div className="relative rounded-[8px] overflow-hidden" style={{ filter: 'blur(0.5px)' }}>
        <div className="opacity-30 pointer-events-none select-none">{children}</div>
        <div className="locked-overlay flex-col gap-2 cursor-pointer" onClick={() => setShowModal(true)}>
          <div className="w-10 h-10 rounded-full bg-surface border border-border-default flex items-center justify-center shadow-lg">
            <Lock className="w-4 h-4 text-fg-muted" strokeWidth={1.5} />
          </div>
          <div className="text-center px-4">
            <p className="text-xs font-semibold text-fg">{featureName}</p>
            <p className="text-[10px] text-fg-muted mt-0.5">View plan details for <span className="text-brand">{planLabel}</span></p>
          </div>
        </div>
      </div>

      {showModal && (
        <UpgradePromptModal
          requiredPlan={requiredPlan}
          featureName={featureName}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function UpgradePromptModal({ requiredPlan, featureName, onClose }: {
  requiredPlan: Plan; featureName: string; onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(15,31,24,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border-default rounded-[20px] p-7 max-w-sm w-full animate-scale-up shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-[16px] bg-brand/15 border border-brand/50 flex items-center justify-center mb-5">
          <Lock className="w-6 h-6 text-brand" strokeWidth={1.5} />
        </div>
        <h3 className="font-display font-semibold text-[18px] text-fg mb-1">{featureName}</h3>
        <p className="text-sm text-fg-muted mb-5 leading-relaxed">
          This feature is available on the <span className="text-brand font-semibold capitalize">{requiredPlan}</span> plan. View the plan details to make it available for your school.
        </p>

        <div className="bg-base rounded-[8px] p-4 mb-5 border border-border-default">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-fg-muted uppercase tracking-wider">Plan comparison</span>
          </div>
          {[
            { plan: 'Essential', price: '₹ 3,999/mo', has: requiredPlan !== 'pro' },
            { plan: 'Pro', price: '₹ 8,000/mo', has: true },
          ].map(row => (
            <div key={row.plan} className="flex items-center justify-between py-2 border-t border-border-default/50">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${row.has ? 'bg-success/20 border-success/40' : 'border-border-default'}`}>
                  {row.has && <div className="w-2 h-2 rounded-full bg-success" />}
                </div>
                <span className="text-sm text-fg">{row.plan}</span>
              </div>
              <span className="text-xs font-mono tabular-nums text-fg-muted">{row.price}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-[6px] border border-border-default text-sm font-semibold text-fg-muted hover:text-fg hover:border-brand transition-colors"
          >
            Maybe later
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-10 rounded-[6px] bg-brand text-on-brand text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            View plan details
          </button>
        </div>
      </div>
    </div>
  );
}
