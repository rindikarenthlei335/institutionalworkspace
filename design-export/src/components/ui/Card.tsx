import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  elevated?: boolean;
  noPadding?: boolean;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, elevated, noPadding, hover = !!onClick }: CardProps) {
  const base = [
    'bg-surface border border-border-default rounded-[8px] shadow-[0_1px_3px_rgba(15,26,20,0.12),0_6px_16px_rgba(15,26,20,0.06)]',
    noPadding ? '' : 'p-5',
    elevated ? 'shadow-[0_1px_3px_rgba(15,26,20,0.14),0_6px_16px_rgba(15,26,20,0.08)]' : '',
    hover ? 'card-hover cursor-pointer' : '',
    className,
  ].join(' ');
  return onClick ? <div className={base} onClick={onClick}>{children}</div> : <div className={base}>{children}</div>;
}

export function NoticeCard({ title, body, category, date, urgent = false }: {
  title: string; body: string; category: string; date: string; urgent?: boolean;
}) {
  return (
    <Card className={urgent ? 'border-warning/50' : ''} hover>
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <span className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-[4px] ${urgent ? 'bg-warning/12 text-warning-fg' : 'bg-brand-soft text-brand'}`}>
          {category}
        </span>
        <span className="text-[11px] text-fg-muted font-mono tabular-nums shrink-0">{date}</span>
      </div>
      <h4 className="text-sm font-semibold text-fg mb-1 leading-snug">{title}</h4>
      <p className="text-xs text-fg-muted leading-relaxed line-clamp-2">{body}</p>
    </Card>
  );
}

export function FeeCard({ label, amount, due, status, onClick }: {
  label: string; amount: string; due?: string; status: 'paid' | 'due' | 'pending'; onClick?: () => void;
}) {
  const statusCls = { paid: 'text-success-fg', due: 'text-warning-fg', pending: 'text-fg-muted' }[status];
  return (
    <Card onClick={onClick} className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-fg">{label}</p>
        {due && <p className="text-xs text-fg-muted mt-0.5">{status === 'paid' ? 'Paid' : 'Due'}: {due}</p>}
      </div>
      <div className="text-right shrink-0">
        <p className={`font-display font-semibold text-base tabular-nums ${statusCls}`}>{amount}</p>
        <p className={`text-[11px] font-semibold capitalize mt-0.5 ${statusCls}`}>{status}</p>
      </div>
    </Card>
  );
}
