'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Calendar, ShieldAlert, CheckCircle2, BellRing, RefreshCw } from 'lucide-react';

interface DomainRenewalCardProps {
  domainName?: string;
  expiryDate?: string;
  daysRemaining?: number;
  registrar?: string;
}

export function DomainRenewalCard({
  domainName = 'mountcarmel.edu.in',
  expiryDate = '2025-12-01',
  daysRemaining = 28,
  registrar = 'ERNET India (.edu.in Registry)'
}: DomainRenewalCardProps) {
  const [autoRenew, setAutoRenew] = useState(true);
  const [renewalLoading, setRenewalLoading] = useState(false);
  const [renewalSuccess, setRenewalSuccess] = useState(false);

  const getAlertStatus = (days: number) => {
    if (days <= 7) return { label: 'CRITICAL (7-day Expiry Alert)', color: 'text-[var(--status-danger)] bg-[var(--status-danger)]/15 border-[var(--status-danger)]/30' };
    if (days <= 15) return { label: 'URGENT (15-day Expiry Alert)', color: 'text-amber-500 bg-amber-500/15 border-amber-500/30' };
    if (days <= 30) return { label: 'UPCOMING (30-day Notice)', color: 'text-amber-500 bg-amber-500/15 border-amber-500/30' };
    if (days <= 60) return { label: 'EARLY NOTICE (60-day Notice)', color: 'text-blue-500 bg-blue-500/15 border-blue-500/30' };
    return { label: 'HEALTHY', color: 'text-[var(--status-success)] bg-[var(--status-success)]/15 border-[var(--status-success)]/30' };
  };

  const alert = getAlertStatus(daysRemaining);

  const handleManualRenew = () => {
    setRenewalLoading(true);
    setTimeout(() => {
      setRenewalLoading(false);
      setRenewalSuccess(true);
      setTimeout(() => setRenewalSuccess(false), 4000);
    }, 1000);
  };

  return (
    <Card className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--brand-primary)]" />
            <h4 className="font-display font-semibold text-sm text-[var(--text-primary)]">Domain Expiry & Renewal Monitor</h4>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Automated lifecycle tracking and renewal notice dispatch schedule.
          </p>
        </div>
        <span className={`px-2.5 py-1 rounded text-[10px] font-bold border flex items-center gap-1 ${alert.color}`}>
          <BellRing className="w-3 h-3" /> {alert.label}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
          <span className="text-[10px] font-bold uppercase text-[var(--text-tertiary)]">Managed Domain</span>
          <div className="font-mono text-sm font-bold text-[var(--brand-primary)] mt-0.5">{domainName}</div>
          <div className="text-[11px] text-[var(--text-secondary)] mt-1">{registrar}</div>
        </div>

        <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
          <span className="text-[10px] font-bold uppercase text-[var(--text-tertiary)]">Expiration Date</span>
          <div className="font-mono text-sm font-bold text-[var(--text-primary)] mt-0.5">{expiryDate}</div>
          <div className={`text-[11px] font-semibold mt-1 ${daysRemaining <= 30 ? 'text-amber-500' : 'text-[var(--status-success)]'}`}>
            {daysRemaining} Days Remaining
          </div>
        </div>

        <div className="p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase text-[var(--text-tertiary)]">Renewal Mode</span>
          <div className="flex items-center justify-between mt-1">
            <span className="font-semibold text-xs text-[var(--text-primary)]">
              {autoRenew ? 'Auto-Renew Enabled' : 'Manual Invoice'}
            </span>
            <input
              type="checkbox"
              checked={autoRenew}
              onChange={(e) => setAutoRenew(e.target.checked)}
              className="accent-[var(--brand-primary)] w-4 h-4 cursor-pointer"
            />
          </div>
          <div className="text-[10px] text-[var(--text-tertiary)] mt-1">
            {autoRenew ? 'Billed to school subscription' : 'Requires annual invoice approval'}
          </div>
        </div>
      </div>

      {/* Automated Cron Reminders Visual Timeline */}
      <div className="p-3 rounded-lg bg-[var(--bg-elevated)] space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-[var(--text-primary)] text-xs">Automated Renewal Notification Triggers:</span>
          <span className="text-[11px] text-[var(--text-tertiary)]">Triggered daily at 00:00 UTC via Cloudflare Cron</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
          {[
            { days: 60, status: 'Sent Nov 1', active: true },
            { days: 30, status: 'Active Notice', active: true },
            { days: 15, status: 'Pending Trigger', active: false },
            { days: 7, status: 'Final Warning', active: false }
          ].map((item, idx) => (
            <div
              key={idx}
              className={`p-2 rounded border ${
                item.active
                  ? 'bg-[var(--brand-primary)]/10 border-[var(--brand-primary)] text-[var(--brand-primary)] font-semibold'
                  : 'bg-[var(--bg-subtle)] border-[var(--border-subtle)] text-[var(--text-tertiary)]'
              }`}
            >
              <div className="font-bold text-xs">{item.days} Days</div>
              <div className="text-[10px] mt-0.5">{item.status}</div>
            </div>
          ))}
        </div>
      </div>

      {renewalSuccess && (
        <div className="p-2.5 rounded bg-[var(--status-success)]/15 border border-[var(--status-success)]/30 text-[var(--status-success)] text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Domain renewal order processed! Validity extended by 1 year.
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <p className="text-[11px] text-[var(--text-secondary)]">
          Grace period: 30 days post-expiry before domain drops into registry redemption.
        </p>
        <Button variant="primary" size="sm" loading={renewalLoading} onClick={handleManualRenew}>
          Renew Domain Now (₹1,200/yr)
        </Button>
      </div>
    </Card>
  );
}
