import React, { useState } from 'react';
import { Check, Zap, ArrowRight } from 'lucide-react';
import { Plan, PLAN_DETAILS, ADDONS } from '../lib/plan';
import { usePlan } from '../contexts/PlanContext';
import { useInView } from '../lib/hooks';
import { Button } from '../components/ui/Button';

function PlanCard({
  planKey, detail, billing, recommended, onSelect,
}: {
  planKey: Plan;
  detail: typeof PLAN_DETAILS.basic;
  billing: 'monthly' | 'yearly';
  recommended?: boolean;
  onSelect: () => void;
}) {
  const price = billing === 'monthly' ? detail.price.monthly : Math.round(detail.price.yearly / 12);
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={`relative flex flex-col rounded-[8px] border p-7 transition-all duration-250 card-hover ${
        recommended
          ? 'border-brand/50 bg-surface shadow-sm'
          : 'border-border-default bg-surface/60'
      } ${inView ? 'animate-fade-up' : 'opacity-0'}`}
    >
      {recommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-[4px] bg-brand text-on-brand text-[11px] font-semibold">
          Most popular
        </div>
      )}

      {/* Plan header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="w-2.5 h-2.5 rounded-[4px]"
            style={{ background: detail.color }}
          />
          <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest">{detail.name}</p>
        </div>
        <p className="font-display font-semibold text-[40px] leading-none text-fg tabular-nums">
          <span className="text-xl font-medium text-fg-muted">₹</span>{price.toLocaleString('en-IN')}
          <span className="text-sm font-normal text-fg-muted ml-1">/mo</span>
        </p>
        {billing === 'yearly' && (
          <p className="text-[11px] text-success-fg font-semibold mt-1">Billed ₹{detail.price.yearly.toLocaleString('en-IN')}/yr · Save 17%</p>
        )}
        <p className="text-sm text-fg-muted mt-2">{detail.tagline}</p>
      </div>

      <Button
        fullWidth
        variant={recommended ? 'primary' : 'secondary'}
        onClick={onSelect}
        className="mb-6"
        iconRight={<ArrowRight className="w-4 h-4" strokeWidth={1.5} />}
      >
        Select this plan
      </Button>

      {/* Features */}
      <div className="flex flex-col gap-2.5">
        {detail.features.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <Check className="w-4 h-4 text-success-fg shrink-0 mt-0.5" strokeWidth={2} />
            <span className="text-sm text-fg">{f}</span>
          </div>
        ))}
        {detail.locked.map((f) => (
          <div key={f} className="flex items-start gap-2.5 opacity-35">
            <div className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center">
              <div className="w-3 h-px bg-fg-muted" />
            </div>
            <span className="text-sm text-fg-muted">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Entry({ onEnter }: { onEnter: (plan: Plan) => void }) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const { setPlan } = usePlan();
  const { ref, inView } = useInView(0.05);

  const handleSelect = (plan: Plan) => {
    setPlan(plan);
    onEnter(plan);
  };

  return (
    <div className="min-h-screen bg-base hero-glow relative">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/30 to-transparent" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,255,255,0.6) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">

        {/* Hero text */}
        <div ref={ref} className={`text-center mb-16 ${inView ? 'stagger' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[4px] border border-brand/50 bg-brand/8 mb-6">
            <Zap className="w-3.5 h-3.5 text-brand" strokeWidth={2} />
            <span className="text-xs text-brand font-semibold">Plan options for schools of every size</span>
          </div>
          <h1 className="font-display font-semibold text-[48px] leading-[56px] text-fg mb-4">
            A complete digital platform<br />for educational institutions.
          </h1>
          <p className="text-lg text-fg-muted max-w-xl mx-auto leading-relaxed">
            Manage the school website, parent portal, fees, admissions and administration through one secure system.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex items-center bg-surface border border-border-default rounded-[4px] p-1 gap-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 h-8 rounded-[4px] text-sm font-semibold transition-all ${billing === 'monthly' ? 'bg-brand text-on-brand' : 'text-fg-muted hover:text-fg'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-5 h-8 rounded-[4px] text-sm font-semibold transition-all flex items-center gap-2 ${billing === 'yearly' ? 'bg-brand text-on-brand' : 'text-fg-muted hover:text-fg'}`}
            >
              Yearly
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] ${billing === 'yearly' ? 'bg-on-brand/20 text-on-brand' : 'bg-success/15 text-success-fg border border-success/50'}`}>
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid md:grid-cols-3 gap-5 mb-20">
          {(Object.entries(PLAN_DETAILS) as [Plan, typeof PLAN_DETAILS.basic][]).map(([key, detail], i) => (
            <PlanCard
              key={key}
              planKey={key}
              detail={detail}
              billing={billing}
              recommended={key === 'essential'}
              onSelect={() => handleSelect(key)}
            />
          ))}
        </div>

        {/* Add-ons */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold text-fg-muted uppercase tracking-widest mb-2">Add-ons</p>
            <h2 className="font-display font-semibold text-2xl text-fg">Extend your plan</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ADDONS.map((addon) => (
              <div key={addon.key} className="bg-surface border border-border-default rounded-[8px] p-4 card-hover">
                <p className="text-sm font-semibold text-fg mb-1">{addon.name}</p>
                <p className="text-xs text-fg-muted mb-3 leading-relaxed">{addon.desc}</p>
                <p className="font-mono tabular-nums text-brand text-sm font-semibold">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-sm text-fg-muted mb-6">Already have an account?</p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" onClick={() => handleSelect('basic')}>View demo without plan</Button>
            <Button onClick={() => handleSelect('pro')} iconRight={<ArrowRight className="w-4 h-4" strokeWidth={1.5} />}>
              Explore Pro
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
