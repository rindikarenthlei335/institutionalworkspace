'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FeeStructureBuilder } from '@/features/fees/components/FeeStructureBuilder';
import { OfflineCollectionModal } from '@/features/fees/components/OfflineCollectionModal';
import { Plus, Receipt } from 'lucide-react';

export default function AdminFeesPage() {
  const [tab, setTab] = useState<'receipts' | 'structures'>('receipts');
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [receipts, setReceipts] = useState([
    { receiptNo: 'REC-2024-00102', studentName: 'Aarav Sharma', amount: 12400, mode: 'UPI', date: '2024-12-14' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Financial Management</span>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Fees & Payments</h1>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowCollectModal(true)}>
          Collect Offline Fee (Accountant)
        </Button>
      </div>

      <div className="flex bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-[6px] p-1 gap-1 w-fit">
        <button
          onClick={() => setTab('receipts')}
          className={`px-4 h-8 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
            tab === 'receipts'
              ? 'bg-[var(--brand-primary)] text-white'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Payments & Receipts
        </button>
        <button
          onClick={() => setTab('structures')}
          className={`px-4 h-8 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
            tab === 'structures'
              ? 'bg-[var(--brand-primary)] text-white'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          Fee Structures (Day vs Hosteller)
        </button>
      </div>

      {tab === 'receipts' && (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">PDF Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {receipts.map((r, i) => (
                  <tr key={i} className="hover:bg-[var(--bg-elevated)]/50">
                    <td className="p-3 font-mono font-semibold text-[var(--brand-primary)]">{r.receiptNo}</td>
                    <td className="p-3 font-semibold text-[var(--text-primary)]">{r.studentName}</td>
                    <td className="p-3 font-mono font-bold text-[var(--text-primary)]">₹ {r.amount.toLocaleString('en-IN')}.00</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] font-semibold">
                        {r.mode}
                      </span>
                    </td>
                    <td className="p-3 tabular-nums">{r.date}</td>
                    <td className="p-3 text-right">
                      <button className="text-xs font-semibold text-[var(--brand-primary)] hover:underline cursor-pointer flex items-center gap-1 justify-end ml-auto">
                        <Receipt className="w-3.5 h-3.5" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === 'structures' && <FeeStructureBuilder />}

      <OfflineCollectionModal
        isOpen={showCollectModal}
        onClose={() => setShowCollectModal(false)}
        onSuccess={(newReceipt) => setReceipts([newReceipt, ...receipts])}
      />
    </div>
  );
}
