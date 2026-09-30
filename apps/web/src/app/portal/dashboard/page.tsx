import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function PortalDashboardPage() {
  return (
    <div className="space-y-4">
      {/* Student Profile Summary */}
      <Card className="flex items-center gap-3 border-[var(--brand-primary)]">
        <div className="w-12 h-12 rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] font-display font-bold text-lg flex items-center justify-center">
          AS
        </div>
        <div>
          <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">Aarav Sharma</h3>
          <p className="text-xs text-[var(--text-secondary)]">Class VIII-A · Roll No 14 (Day Scholar)</p>
        </div>
      </Card>

      {/* Pending Fee Alert */}
      <Card className="bg-[var(--status-warning)]/10 border-[var(--status-warning)] space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-[var(--status-warning)]">Pending Term 2 Fee</span>
          <span className="font-mono text-sm font-bold text-[var(--text-primary)]">₹ 12,400.00</span>
        </div>
        <p className="text-[11px] text-[var(--text-secondary)]">Due by December 10th to avoid late charges.</p>
        <Link href="/portal/fees">
          <Button variant="primary" size="sm" className="w-full mt-2">
            Pay Fee Online
          </Button>
        </Link>
      </Card>

      {/* Latest Exam Result Card */}
      <Card className="border-emerald-600/30 bg-emerald-50/20 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-emerald-800">Latest Exam: Half-Yearly 2024</span>
          <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
            Rank #1 (94.2%)
          </span>
        </div>
        <p className="text-[11px] text-slate-600">
          Result published: Passed with Distinction · Grade A1
        </p>
        <Link href="/portal/results">
          <Button variant="secondary" size="sm" className="w-full mt-1">
            View Official Marksheet 📄
          </Button>
        </Link>
      </Card>

      {/* Digital ID Card Link */}
      <Link href="/portal/id-card" className="block">
        <Card className="flex items-center justify-between p-3 hover:border-[var(--brand-primary)] transition-colors">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🪪</span>
            <div>
              <span className="font-display font-bold text-xs text-slate-900 block">Digital Identity Card</span>
              <span className="text-[10px] text-slate-500">Tap to show gate pass & QR verification</span>
            </div>
          </div>
          <span className="text-xs font-bold text-[var(--brand-primary)]">Open ↗</span>
        </Card>
      </Link>
    </div>
  );
}
