import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';

export default function PrincipalDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider">Executive Overview (Pro Plan)</span>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Principal Dashboard</h1>
          <p className="text-xs text-[var(--text-secondary)]">Mount Carmel Higher Secondary School · Academic Session 2024–25</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={1840} change="+32 this month" trend="up" />
        <StatCard label="Fee Collected (Dec)" value={2840000} prefix="₹ " change="+18%" trend="up" />
        <StatCard label="Total Outstanding Due" value={1160000} prefix="₹ " change="29%" trend="warn" />
        <StatCard label="New Admissions" value={74} change="+8 vs last year" trend="up" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-4">Admission Conversion Funnel</h3>
          <div className="space-y-3">
            {[
              { label: 'Applications Received', count: 248, pct: '100%' },
              { label: 'Documents Verified', count: 186, pct: '75%' },
              { label: 'Interview Scheduled', count: 124, pct: '50%' },
              { label: 'Admission Approved', count: 87, pct: '35%' },
              { label: 'Fee Paid & Enrolled', count: 74, pct: '30%' }
            ].map((step, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{step.label}</span>
                  <span className="font-mono text-[var(--brand-primary)]">{step.count} ({step.pct})</span>
                </div>
                <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--brand-primary)] rounded-full" style={{ width: step.pct }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-4">Fee Collection Breakdown by Mode</h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span>Online UPI / Net Banking</span>
              <span className="font-mono font-semibold text-[var(--status-success)]">₹ 18,40,000 (65%)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span>Cash Collection (Accountant Counter)</span>
              <span className="font-mono font-semibold">₹ 7,20,000 (25%)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-subtle)]">
              <span>Cheque / DD</span>
              <span className="font-mono font-semibold">₹ 2,80,000 (10%)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
