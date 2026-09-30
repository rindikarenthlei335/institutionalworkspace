import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminFeesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Financial Management</span>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Fee Approvals & Receipts</h1>
        </div>
        <Button variant="primary">Collect Offline Fee</Button>
      </div>

      <Card>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-default)] text-[var(--text-secondary)]">
              <th className="py-2">Receipt No</th>
              <th className="py-2">Student Name</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Mode</th>
              <th className="py-2">Date</th>
              <th className="py-2">Receipt PDF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            <tr>
              <td className="py-3 font-mono font-semibold">REC-2024-00102</td>
              <td className="py-3 font-semibold text-[var(--text-primary)]">Aarav Sharma</td>
              <td className="py-3 font-mono font-semibold">₹ 12,400.00</td>
              <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] font-semibold">Online (UPI)</span></td>
              <td className="py-3 tabular-nums">14 Dec 2024</td>
              <td className="py-3"><span className="text-[var(--brand-primary)] font-semibold hover:underline cursor-pointer">Download PDF</span></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
