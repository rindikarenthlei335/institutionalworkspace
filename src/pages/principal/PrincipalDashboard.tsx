import React, { useState } from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { LockedFeature } from '../../components/ui/LockedFeature';
import { usePlan } from '../../contexts/PlanContext';
import { TrendingUp, Users, CreditCard, BookOpen, BarChart2 } from 'lucide-react';

// Minimal bar chart using SVG
function BarChart({ data, labels }: { data: number[]; labels: string[] }) {
  const max = Math.max(...data);
  const h = 120;
  const barW = 28;
  const gap = 12;
  const total = data.length;
  const svgW = total * (barW + gap) - gap;

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${h + 24}`} className="overflow-visible">
      {data.map((v, i) => {
        const barH = Math.round((v / max) * h);
        const x = i * (barW + gap);
        const y = h - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill="rgba(31,77,58,0.25)" className="animate-fade-in" style={{ animationDelay: `${i * 60}ms` }} />
            <rect x={x} y={y} width={barW} height={4} rx="2" fill="#1F4D3A" />
            <text x={x + barW / 2} y={h + 16} textAnchor="middle" fontSize="10" fill="#46574E" fontFamily="Inter">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// Minimal donut chart
function DonutChart({ value, total, color = '#1F4D3A' }: { value: number; total: number; color?: string }) {
  const r = 36, cx = 44, cy = 44, stroke = 10;
  const circumference = 2 * Math.PI * r;
  const pct = value / total;
  const dash = circumference * pct;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#C5D2CB" strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circumference}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        className="animate-fade-in"
      />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill="#0F1A14" fontFamily="Source Serif 4">
        {Math.round(pct * 100)}%
      </text>
    </svg>
  );
}

const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const feeData = [18, 22, 26, 30, 24, 28];
const admData = [8,  12, 6,  14, 10, 4];

const funnelSteps = [
  { label: 'Applications received', value: 248, pct: 100 },
  { label: 'Documents verified',    value: 186, pct: 75 },
  { label: 'Interview scheduled',   value: 124, pct: 50 },
  { label: 'Admission approved',    value: 87,  pct: 35 },
  { label: 'Fee paid & enrolled',   value: 74,  pct: 30 },
];

export function PrincipalDashboard() {
  const { plan, hasFeature } = usePlan();
  const isLocked = !hasFeature('principal_dashboard');
  const [period, setPeriod] = useState<'month' | 'year'>('month');

  const content = (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-1">Principal Dashboard</p>
          <h1 className="font-display font-bold text-[28px] text-fg" style={{ letterSpacing: '-0.02em' }}>Delhi Public School</h1>
          <p className="text-sm text-fg-muted">Academic Session 2024–25 · December overview</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface border border-border-default rounded-[6px] p-0.5">
            {(['month', 'year'] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 h-7 rounded-[4px] text-[12px] font-semibold capitalize transition-all ${period === p ? 'bg-brand text-on-brand' : 'text-fg-muted hover:text-fg'}`}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Students Enrolled"    value={1840} change="+32"    trend="up"      sparkline={[50,55,52,58,62,70,71]} icon={<Users      className="w-4 h-4" strokeWidth={1.5}/>} />
        <StatCard label="Fee Collected (Dec)"  value={2840000} prefix="₹ " change="+18%"   trend="up"      sparkline={feeData} icon={<CreditCard className="w-4 h-4" strokeWidth={1.5}/>} />
        <StatCard label="Pending Fee"          value={1160000} prefix="₹ " change="29%"    trend="warn"                        icon={<TrendingUp className="w-4 h-4" strokeWidth={1.5}/>} />
        <StatCard label="New Admissions"       value={74}    change="+8"    trend="up"      sparkline={admData} icon={<BookOpen  className="w-4 h-4" strokeWidth={1.5}/>} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Fee collection chart */}
        <div className="lg:col-span-2 bg-surface border border-border-default rounded-[8px] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-0.5">Fee Collection</p>
              <h3 className="font-display font-semibold text-[15px] text-fg">Monthly trends · ₹ Lakhs</h3>
            </div>
            <BarChart2 className="w-5 h-5 text-fg-muted" strokeWidth={1.5}/>
          </div>
          <BarChart data={feeData} labels={months} />
        </div>

        {/* Donut breakdown */}
        <div className="bg-surface border border-border-default rounded-[8px] p-5">
          <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-1">Collection Split</p>
          <h3 className="font-display font-semibold text-[15px] text-fg mb-5">Term 2 status</h3>
          <div className="flex flex-col items-center gap-4">
            <DonutChart value={71} total={100} color="#1F4D3A" />
            <div className="w-full space-y-2">
              {[
                { label: 'Collected', value: '₹ 28.4L', color: 'bg-brand', pct: 71 },
                { label: 'Pending',   value: '₹ 11.6L', color: 'bg-warning', pct: 29 },
                { label: 'Overdue',   value: '₹ 2.1L',  color: 'bg-error',   pct: 5 },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`}/>
                  <span className="text-[12px] text-fg-muted flex-1">{item.label}</span>
                  <span className="font-mono tabular-nums text-[12px] font-semibold text-fg">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admissions funnel */}
      <div className="bg-surface border border-border-default rounded-[8px] p-5">
        <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-1">Admissions</p>
        <h3 className="font-display font-semibold text-[15px] text-fg mb-5">2024–25 Application Funnel</h3>
        <div className="space-y-3">
          {funnelSteps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <p className="text-[12px] text-fg-muted w-40 shrink-0">{step.label}</p>
              <div className="flex-1 h-2 bg-elevated rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full animate-progress"
                  style={{ '--target-width': `${step.pct}%`, width: `${step.pct}%` } as React.CSSProperties}
                />
              </div>
              <span className="font-mono tabular-nums text-[13px] font-semibold text-fg w-10 text-right">{step.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Website analytics (Pro only) */}
      {isLocked ? (
        <LockedFeature requiredPlan="pro" currentPlan={plan} featureName="Website Analytics">
          <div className="bg-surface border border-border-default rounded-[8px] p-5">
            <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-1">Analytics</p>
            <h3 className="font-display font-semibold text-[15px] text-fg mb-5">Website Traffic</h3>
            <div className="grid grid-cols-3 gap-4">
              {[{ label: 'Page views', value: '12,480' }, { label: 'Unique visitors', value: '3,240' }, { label: 'Avg. session', value: '2m 14s' }].map(m => (
                <div key={m.label} className="bg-base rounded-[6px] p-4 border border-border-default text-center">
                  <p className="font-display font-semibold text-xl text-brand tabular-nums">{m.value}</p>
                  <p className="text-[11px] text-fg-muted mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </LockedFeature>
      ) : (
        <div className="bg-surface border border-border-default rounded-[8px] p-5">
          <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-1">Analytics</p>
          <h3 className="font-display font-semibold text-[15px] text-fg mb-5">Website Traffic · December 2024</h3>
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[{ label: 'Page views', value: '12,480' }, { label: 'Unique visitors', value: '3,240' }, { label: 'Avg. session', value: '2m 14s' }].map(m => (
              <div key={m.label} className="bg-base rounded-[6px] p-4 border border-border-default text-center">
                <p className="font-display font-semibold text-xl text-brand tabular-nums">{m.value}</p>
                <p className="text-[11px] text-fg-muted mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
          <BarChart data={[420,580,510,730,640,820,710,850,780,900,840,930]} labels={['J','F','M','A','M','J','J','A','S','O','N','D']} />
        </div>
      )}
    </div>
  );

  return isLocked ? (
    <LockedFeature requiredPlan="pro" currentPlan={plan} featureName="Principal Dashboard">
      {content}
    </LockedFeature>
  ) : content;
}
