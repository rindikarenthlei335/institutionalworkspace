'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Receipt } from 'lucide-react';

export interface OfflineCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receipt: any) => void;
}

export function OfflineCollectionModal({ isOpen, onClose, onSuccess }: OfflineCollectionModalProps) {
  const [studentSearch, setStudentSearch] = useState('ADM-2024-0014');
  const [amount, setAmount] = useState(12400);
  const [mode, setMode] = useState<'cash' | 'upi' | 'cheque' | 'dd'>('cash');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptGenerated, setReceiptGenerated] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleCollect = (e: React.FormEvent) => {
    e.preventDefault();
    const receiptNo = `REC-2024-${Math.floor(10000 + Math.random() * 90000)}`;
    const newReceipt = {
      receiptNo,
      studentName: 'Aarav Sharma',
      admissionNo: studentSearch,
      amount,
      mode: mode.toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      pdfUrl: `/api/pdf/receipt/${receiptNo}`
    };
    setReceiptGenerated(newReceipt);
    onSuccess(newReceipt);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg space-y-4 bg-[var(--bg-surface)]">
        <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-2">
          <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
            Accountant Offline Fee Collection
          </h3>
          <button onClick={onClose} className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]">✕</button>
        </div>

        {!receiptGenerated ? (
          <form onSubmit={handleCollect} className="space-y-4">
            <Input
              label="Student Admission No / Search"
              required
              value={studentSearch}
              onChange={e => setStudentSearch(e.target.value)}
            />

            <div className="p-3 bg-[var(--bg-elevated)] rounded text-xs space-y-1">
              <p className="font-semibold text-[var(--text-primary)]">Student Found: Aarav Sharma (Class VIII-A)</p>
              <p className="text-[var(--text-secondary)]">Outstanding Invoice Dues: ₹ 12,400.00</p>
            </div>

            <Input
              label="Amount Collected (INR)"
              type="number"
              required
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">Collection Mode</label>
                <select
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] font-semibold"
                  value={mode}
                  onChange={e => setMode(e.target.value as any)}
                >
                  <option value="cash">Cash (Counter)</option>
                  <option value="upi">UPI / POS Machine</option>
                  <option value="cheque">Bank Cheque</option>
                  <option value="dd">Demand Draft (DD)</option>
                </select>
              </div>

              <Input
                label="Transaction / Cheque Ref #"
                placeholder="Optional ref no."
                value={transactionRef}
                onChange={e => setTransactionRef(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
              <Button variant="secondary" type="button" onClick={onClose}>Cancel</Button>
              <Button variant="primary" type="submit">Record Payment & Issue Receipt</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-[var(--status-success)]/15 text-[var(--status-success)] flex items-center justify-center mx-auto font-bold text-2xl">
              ✓
            </div>
            <h4 className="font-display font-bold text-lg text-[var(--text-primary)]">
              Payment Collected Successfully!
            </h4>
            <div className="p-3 bg-[var(--bg-elevated)] rounded text-xs font-mono space-y-1 text-left">
              <p>Receipt Number: <strong>{receiptGenerated.receiptNo}</strong></p>
              <p>Student: {receiptGenerated.studentName} ({receiptGenerated.admissionNo})</p>
              <p>Amount: ₹ {receiptGenerated.amount.toLocaleString()}.00 ({receiptGenerated.mode})</p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <Button variant="secondary" onClick={() => setReceiptGenerated(null)}>Collect Another</Button>
              <Button variant="primary" icon={<Receipt className="w-4 h-4" />}>Download PDF Receipt</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
