'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Level2BreakdownDetail } from '../types';

interface UILevel2CardProps {
  label: string;
  value: string | number;
  prefix?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral' | 'warn';
  drilldown: Level2BreakdownDetail;
}

export function UILevel2Card({
  label,
  value,
  prefix,
  change,
  trend = 'neutral',
  drilldown
}: UILevel2CardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getTrendClass = () => {
    switch (trend) {
      case 'up': return 'text-[var(--status-success)] bg-[var(--status-success)]/10';
      case 'down': return 'text-[var(--status-danger)] bg-[var(--status-danger)]/10';
      case 'warn': return 'text-[var(--status-warning)] bg-[var(--status-warning)]/10';
      default: return 'text-[var(--text-secondary)] bg-[var(--bg-subtle)]';
    }
  };

  return (
    <>
      <Card className="relative hover:border-[var(--brand-primary)] transition-all cursor-pointer group" onClick={() => setIsOpen(true)}>
        <div className="flex justify-between items-start">
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">{label}</span>
          <span className="text-[10px] font-bold text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-2 py-0.5 rounded group-hover:bg-[var(--brand-primary)] group-hover:text-white transition-colors">
            Level 2 Drilldown ↗
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1">
          {prefix && <span className="text-lg font-bold text-[var(--text-secondary)]">{prefix}</span>}
          <span className="font-display font-bold text-3xl text-[var(--text-primary)]">
            {typeof value === 'number' ? value.toLocaleString('en-IN') : value}
          </span>
        </div>
        {change && (
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getTrendClass()}`}>
              {change}
            </span>
            <span className="text-[11px] text-[var(--text-tertiary)]">vs last month</span>
          </div>
        )}
      </Card>

      {/* Level 2 Modal Drilldown */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">Level 2 Analysis</span>
                <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">{drilldown.title}</h3>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>✕</Button>
            </div>

            <div className="space-y-3 py-2 max-h-[60vh] overflow-y-auto">
              {drilldown.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                  <div>
                    <div className="font-semibold text-xs text-[var(--text-primary)]">{item.label}</div>
                    {item.subtext && <div className="text-[11px] text-[var(--text-tertiary)] mt-0.5">{item.subtext}</div>}
                  </div>
                  <div className="font-mono font-bold text-sm text-[var(--brand-primary)]">
                    {typeof item.value === 'number' ? item.value.toLocaleString('en-IN') : item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="secondary" size="sm" onClick={() => setIsOpen(false)}>Close Breakdown</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
