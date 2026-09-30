import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PortalFeesPage() {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">Fee Dues & Payment History</h2>

      <Card className="space-y-3">
        <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
          <span className="text-xs font-semibold text-[var(--text-primary)]">Term 2 Fee Invoice</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--status-warning)]/15 text-[var(--status-warning)]">Unpaid</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span>Tuition Fee</span><span className="font-mono">₹ 8,400.00</span></div>
          <div className="flex justify-between"><span>Lab & Library</span><span className="font-mono">₹ 4,000.00</span></div>
          <div className="flex justify-between font-bold border-t border-[var(--border-subtle)] pt-1">
            <span>Total Payable</span><span className="font-mono text-[var(--brand-primary)]">₹ 12,400.00</span>
          </div>
        </div>
        <Button variant="primary" size="sm" className="w-full">Pay Now</Button>
      </Card>
    </div>
  );
}
