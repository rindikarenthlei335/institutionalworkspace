import React from 'react';

type Status = 'pending' | 'approved' | 'rejected' | 'paid' | 'due' | 'success' | 'warning' | 'info' | 'active' | 'suspended' | 'expired';

const config: Record<Status, { label: string; cls: string }> = {
  pending:   { label: 'Pending',   cls: 'bg-pending/12 text-pending-fg   border-pending/50' },
  approved:  { label: 'Approved',  cls: 'bg-success/12 text-success-fg   border-success/50' },
  rejected:  { label: 'Rejected',  cls: 'bg-error/12   text-error-fg     border-error/50' },
  paid:      { label: 'Paid',      cls: 'bg-success/12 text-success-fg   border-success/50' },
  due:       { label: 'Due',       cls: 'bg-warning/12 text-warning-fg   border-warning/50' },
  success:   { label: 'Success',   cls: 'bg-success/12 text-success-fg   border-success/50' },
  warning:   { label: 'Warning',   cls: 'bg-warning/12 text-warning-fg   border-warning/50' },
  info:      { label: 'Info',      cls: 'bg-brand/12   text-brand     border-brand/50' },
  active:    { label: 'Active',    cls: 'bg-success/12 text-success-fg   border-success/50' },
  suspended: { label: 'Suspended', cls: 'bg-error/12   text-error-fg     border-error/50' },
  expired:   { label: 'Expired',   cls: 'bg-warning/12 text-warning-fg   border-warning/50' },
};

interface BadgeProps {
  status: Status;
  label?: string;
  dot?: boolean;
  className?: string;
}

export function Badge({ status, label, dot = true, className = '' }: BadgeProps) {
  const { label: defaultLabel, cls } = config[status] ?? config.info;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-[4px] text-[10px] uppercase font-semibold border tracking-wider ${cls} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75 shrink-0" />}
      {label ?? defaultLabel}
    </span>
  );
}

export function PlanBadge({ plan }: { plan: 'basic' | 'essential' | 'pro' }) {
  const styles = {
    basic:     'bg-fg-muted/12 text-fg-muted border-fg-muted/50',
    essential: 'bg-brand/12    text-brand     border-brand/50',
    pro:       'bg-brand text-on-brand border-brand',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[10px] font-semibold border uppercase tracking-wider ${styles[plan]}`}>
      {plan}
    </span>
  );
}
