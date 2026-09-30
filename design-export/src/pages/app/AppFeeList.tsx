import React, { useState } from 'react';
import { CreditCard, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { TopAppBar } from '../../components/layout/TopAppBar';
import { Badge } from '../../components/ui/Badge';

const fees = {
  due: [
    { id: 1, label: 'Term 2 Tuition Fee', amount: '₹ 8,400', due: '31 Dec 2024', status: 'due' as const },
    { id: 2, label: 'Activity Fee', amount: '₹ 2,000', due: '31 Dec 2024', status: 'due' as const },
    { id: 3, label: 'Library Fee', amount: '₹ 500', due: '31 Dec 2024', status: 'pending' as const },
    { id: 4, label: 'Computer Lab Fee', amount: '₹ 1,500', due: '31 Dec 2024', status: 'due' as const },
  ],
  paid: [
    { id: 5, label: 'Term 1 Tuition Fee', amount: '₹ 8,400', due: '30 Sep 2024', status: 'paid' as const },
    { id: 6, label: 'Admission Fee', amount: '₹ 5,000', due: '1 Apr 2024', status: 'paid' as const },
    { id: 7, label: 'Development Fee', amount: '₹ 3,000', due: '1 Apr 2024', status: 'paid' as const },
  ],
};

export function AppFeeList({ onPay }: { onPay: (fee: { label: string; amount: string }) => void }) {
  const [tab, setTab] = useState<'due' | 'paid'>('due');

  const list = fees[tab];
  const totalDue = fees.due.reduce((sum, f) => sum + parseInt(f.amount.replace(/[^0-9]/g, '')), 0);

  return (
    <div className="h-full flex flex-col bg-base">
      <TopAppBar title="Fee Management" subtitle={tab === 'due' ? `₹ ${totalDue.toLocaleString('en-IN')} outstanding` : '3 payments'} />

      {/* Tab */}
      <div className="px-4 py-3">
        <div className="flex bg-surface rounded-[8px] p-1">
          {(['due', 'paid'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 h-9 rounded-[6px] text-sm font-semibold transition-all flex items-center justify-center gap-1.5 capitalize ${tab === t ? 'bg-brand text-on-brand' : 'text-fg-muted'}`}
            >
              {t === 'due'
                ? <AlertCircle className="w-3.5 h-3.5" strokeWidth={2} />
                : <CheckCircle className="w-3.5 h-3.5" strokeWidth={2} />
              }
              {t === 'due' ? 'Due' : 'Paid'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary banner */}
      {tab === 'due' && (
        <div className="mx-4 mb-3 p-4 rounded-[8px] border border-warning/50 bg-warning/10">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-warning-fg mb-1">Total Outstanding</p>
          <p className="text-2xl font-semibold text-fg tabular-nums mt-0.5">₹ {totalDue.toLocaleString('en-IN')}</p>
          <p className="text-xs text-fg-muted mt-0.5">4 fee heads · Due by 31 Dec 2024</p>
        </div>
      )}

      {/* Fee list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex flex-col gap-2">
          {list.map((fee) => (
            <div
              key={fee.id}
              className={`bg-surface border rounded-[8px] p-4 flex items-center gap-3 ${
                fee.status === 'due' ? 'border-warning/50' : fee.status === 'pending' ? 'border-pending/50' : 'border-border-default'
              }`}
            >
              <div className={`w-9 h-9 rounded-[6px] flex items-center justify-center shrink-0 ${
                fee.status === 'paid' ? 'bg-success/15' : 'bg-brand/15'
              }`}>
                {fee.status === 'paid'
                  ? <CheckCircle className="w-4.5 h-4.5 text-success-fg" strokeWidth={1.5} />
                  : <CreditCard className="w-4.5 h-4.5 text-brand" strokeWidth={1.5} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-fg">{fee.label}</p>
                <p className="text-xs text-fg-muted mt-0.5">{fee.status === 'paid' ? 'Paid on' : 'Due by'}: {fee.due}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-base font-semibold text-fg tabular-nums">{fee.amount}</p>
                <Badge status={fee.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay all button */}
      {tab === 'due' && (
        <div className="px-4 pb-4 pt-2 border-t border-border-default bg-base">
          <button
            onClick={() => onPay({ label: 'All Pending Fees', amount: `₹ ${totalDue.toLocaleString('en-IN')}` })}
            className="w-full h-12 rounded-[6px] bg-brand text-on-brand text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" strokeWidth={2} />
            Pay All — <span className="tabular-nums">₹ {totalDue.toLocaleString('en-IN')}</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}
