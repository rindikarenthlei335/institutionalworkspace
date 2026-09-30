import React from 'react';
import { useCountUp, useInView } from '../../lib/hooks';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  change?: string;
  trend?: 'up' | 'down' | 'warn' | 'neutral';
  icon?: React.ReactNode;
  sparkline?: number[];
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 72, h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke="rgba(31,77,58,0.6)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
        className="animate-fade-in"
      />
      <circle
        cx={(data.length - 1) / (data.length - 1) * w}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r="2.5"
        fill="#1F4D3A"
      />
    </svg>
  );
}

export function StatCard({ label, value, suffix = '', prefix = '', change, trend = 'neutral', icon, sparkline }: StatCardProps) {
  const { ref, inView } = useInView();
  const count = useCountUp(value, 1000, inView);

  const trendCls = {
    up:      'bg-success/12 text-success-fg border-success/50',
    down:    'bg-error/12   text-error-fg   border-error/50',
    warn:    'bg-warning/12 text-warning-fg border-warning/50',
    neutral: 'bg-elevated   text-fg-muted border-border-default',
  }[trend];

  return (
    <div ref={ref} className="bg-surface border border-border-default rounded-[8px] p-5 card-hover relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top right, rgba(31,77,58,0.04) 0%, transparent 60%)' }} />
      <div className="flex items-start justify-between mb-3">
        {icon && <div className="w-9 h-9 rounded-[6px] bg-elevated border border-border-default flex items-center justify-center text-fg-muted shrink-0">{icon}</div>}
        {change && (
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${trendCls} ml-auto`}>
            {change}
          </span>
        )}
      </div>
      <p className="font-display font-semibold text-[28px] leading-none text-fg tabular-nums tracking-tight">
        {prefix}{count.toLocaleString('en-IN')}{suffix}
      </p>
      <p className="text-xs text-fg-muted mt-1.5 font-medium">{label}</p>
      {sparkline && (
        <div className="mt-3">
          <Sparkline data={sparkline} />
        </div>
      )}
    </div>
  );
}
