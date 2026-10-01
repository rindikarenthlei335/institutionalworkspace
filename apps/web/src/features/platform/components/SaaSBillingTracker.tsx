'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PlatformInvoice } from '../types';
import { CreditCard, CheckCircle2 } from 'lucide-react';

const INITIAL_INVOICES: PlatformInvoice[] = [
  { id: 'inv1', tenantId: 'a1111111-1111-1111-1111-111111111111', tenantName: 'Mount Carmel School', amount: 8000, dueDate: '2024-12-01', status: 'paid', paidAt: '2024-11-28', paymentReference: 'UPI-RAZORPAY-99231' },
  { id: 'inv2', tenantId: 'b2222222-2222-2222-2222-222222222222', tenantName: 'St Marys School', amount: 1499, dueDate: '2024-12-05', status: 'unpaid' }
];

export function SaaSBillingTracker() {
  const [invoices, setInvoices] = useState<PlatformInvoice[]>(INITIAL_INVOICES);

  const handleMarkPaid = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'paid', paidAt: new Date().toISOString().split('T')[0], paymentReference: 'MANUAL-BANK-TRANSFER' } : inv));
  };

  return (
    <div className="space-y-4">
      <Card className="p-0 overflow-hidden bg-slate-950 border-slate-800 text-white">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                <th className="p-4">Tenant / School</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Due Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Payment Ref</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-900/50">
                  <td className="p-4 font-semibold text-white">{inv.tenantName}</td>
                  <td className="p-4 font-mono font-bold text-emerald-400">₹ {inv.amount.toLocaleString()}</td>
                  <td className="p-4 text-slate-400 tabular-nums">{inv.dueDate}</td>
                  <td className="p-4">
                    {inv.status === 'paid' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">Paid</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300">Unpaid</span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-[11px] text-slate-400">{inv.paymentReference || '—'}</td>
                  <td className="p-4 text-right">
                    {inv.status !== 'paid' && (
                      <button onClick={() => handleMarkPaid(inv.id)} className="text-xs font-semibold text-emerald-400 hover:underline">
                        Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
