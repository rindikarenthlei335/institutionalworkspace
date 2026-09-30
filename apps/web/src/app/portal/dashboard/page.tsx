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
    </div>
  );
}
