import React from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { Card } from '@/components/ui/Card';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Overview</span>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Enrolled Students" value={1840} change="+32 this term" trend="up" />
        <StatCard label="Fees Collected" value={2840000} prefix="₹ " change="71% of target" trend="up" />
        <StatCard label="Pending Approvals" value={14} change="3 urgent" trend="warn" />
        <StatCard label="Active Notices" value={6} change="1 expires today" trend="neutral" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-semibold text-sm text-[var(--text-primary)] mb-3">Recent Activity</h3>
          <ul className="space-y-3 text-xs">
            <li className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
              <span>Fee payment approved · Aarav Sharma</span>
              <span className="text-[var(--text-secondary)] tabular-nums">2 min ago</span>
            </li>
            <li className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
              <span>New admission application · Riya Patel</span>
              <span className="text-[var(--text-secondary)] tabular-nums">14 min ago</span>
            </li>
            <li className="flex justify-between py-1.5 border-b border-[var(--border-subtle)]">
              <span>Notice published · Sports Day 2025</span>
              <span className="text-[var(--text-secondary)] tabular-nums">1 hr ago</span>
            </li>
          </ul>
        </Card>

        <Card>
          <h3 className="font-display font-semibold text-sm text-[var(--text-primary)] mb-3">Term 2 Fee Progress</h3>
          <div className="text-center py-4">
            <p className="font-display font-bold text-4xl text-[var(--brand-primary)]">71%</p>
            <p className="text-xs text-[var(--text-secondary)]">of ₹ 40,00,000 target collected</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
