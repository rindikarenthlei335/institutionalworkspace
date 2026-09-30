import React from 'react';

export interface StatCardProps {
  label: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  change?: string;
  trend?: 'up' | 'down' | 'warn' | 'neutral';
  icon?: React.ReactNode;
  sparkline?: number[];
}

export function StatCard({
  label,
  value,
  prefix = '',
  suffix = '',
  change,
  trend = 'neutral',
  icon,
  sparkline
}: StatCardProps) {
  const trendColors = {
    up: 'text-[var(--status-success)] bg-[var(--status-success)]/10',
    down: 'text-[var(--status-error)] bg-[var(--status-error)]/10',
    warn: 'text-[var(--status-warning)] bg-[var(--status-warning)]/10',
    neutral: 'text-[var(--text-secondary)] bg-[var(--bg-elevated)]'
  };

  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[8px] p-4 flex flex-col justify-between">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-xs font-semibold text-[var(--text-secondary)]">{label}</span>
        {icon && <div className="p-1.5 rounded-[6px] bg-[var(--bg-elevated)] text-[var(--brand-primary)]">{icon}</div>}
      </div>
      <div>
        <p className="font-display font-bold text-2xl text-[var(--text-primary)] tabular-nums">
          {prefix}
          {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          {suffix}
        </p>
        {change && (
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-[4px] ${trendColors[trend]}`}>
              {change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
