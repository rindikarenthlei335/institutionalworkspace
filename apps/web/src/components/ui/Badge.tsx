import React from 'react';
import { clsx } from 'clsx';
import { PlanTier } from '@eduportal/shared';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variants = {
    brand: 'bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] border-[var(--brand-primary)]/30',
    success: 'bg-[var(--status-success)]/15 text-[var(--status-success)] border-[var(--status-success)]/30',
    warning: 'bg-[var(--status-warning)]/15 text-[var(--status-warning)] border-[var(--status-warning)]/30',
    error: 'bg-[var(--status-error)]/15 text-[var(--status-error)] border-[var(--status-error)]/30',
    neutral: 'bg-[var(--bg-elevated)] text-[var(--text-secondary)] border-[var(--border-default)]'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function PlanBadge({ plan }: { plan: PlanTier }) {
  const badges: Record<PlanTier, { label: string; variant: BadgeProps['variant'] }> = {
    basic: { label: 'Basic Plan', variant: 'neutral' },
    essential: { label: 'Essential Plan', variant: 'brand' },
    pro: { label: 'Pro Plan', variant: 'warning' },
    ultimate: { label: 'Ultimate Plan', variant: 'success' }
  };

  const badge = badges[plan] || badges.basic;
  return <Badge variant={badge.variant}>{badge.label}</Badge>;
}
