import React, { useState } from 'react';
import { Clock, Check, X, Download, AlertCircle } from 'lucide-react';
import { TopAppBar } from '../../components/layout/TopAppBar';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { SuccessCheck } from '../../components/ui/Toast';

type Status = 'pending' | 'approved' | 'rejected';

export function AppPaymentStatus({ onBack, onPayAgain }: { onBack: () => void; onPayAgain?: () => void }) {
  const [status, setStatus] = useState<Status>('pending');

  const statusConfig = {
    pending: {
      icon: (
        <div className="w-20 h-20 rounded-full bg-pending/20 border-4 border-pending/50 flex items-center justify-center">
          <Clock className="w-10 h-10 text-pending-fg animate-pulse" strokeWidth={1.5} />
        </div>
      ),
      title: 'Payment Under Review',
      msg: "Your payment has been submitted and is pending verification by the school admin. You'll be notified once approved.",
      badge: <Badge status="pending" label="Pending Approval" />,
    },
    approved: {
      icon: <SuccessCheck />,
      title: 'Payment Approved',
      msg: 'Your fee payment has been verified and approved by the school. Your receipt is ready to download.',
      badge: <Badge status="approved" label="Approved" />,
    },
    rejected: {
      icon: (
        <div className="w-20 h-20 rounded-full bg-error/20 border-4 border-error/50 flex items-center justify-center">
          <X className="w-10 h-10 text-error-fg" strokeWidth={2} />
        </div>
      ),
      title: 'Payment Rejected',
      msg: 'Your payment could not be verified. Reason: UTR number mismatch. Please re-submit with the correct payment details.',
      badge: <Badge status="rejected" label="Rejected" />,
    },
  };

  const cfg = statusConfig[status];

  return (
    <div className="h-full flex flex-col bg-base">
      <TopAppBar title="Payment Status" onBack={onBack} />

      <div className="flex-1 flex flex-col overflow-y-auto px-5 pb-4">
        {/* Status card */}
        <div className="flex flex-col items-center text-center pt-8 pb-6">
          {cfg.icon}
          <h2 className="text-xl font-semibold text-fg mt-5 mb-2 font-display">{cfg.title}</h2>
          {cfg.badge}
          <p className="text-sm text-fg-muted mt-4 leading-relaxed max-w-xs">{cfg.msg}</p>
        </div>

        {/* Details */}
        <div className="bg-surface border border-border-default rounded-[8px] p-4 mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted mb-3">Payment Details</p>
          {[
            { label: 'Amount', value: '₹ 12,400', numeric: true },
            { label: 'UTR Number', value: '412893045621', numeric: true },
            { label: 'Submitted', value: '19 Dec 2024, 3:42 PM', numeric: false },
            { label: 'Fee Head', value: 'Term 2 — All Heads', numeric: false },
            { label: 'Student', value: 'Aarav Sharma · VII-B', numeric: false },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-border-default/50 last:border-0">
              <span className="text-xs text-fg-muted">{item.label}</span>
              <span className={`text-xs font-semibold text-fg ${item.numeric ? 'tabular-nums' : ''}`}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Rejection reason */}
        {status === 'rejected' && (
          <div className="bg-error/10 border border-error/50 rounded-[6px] p-4 mb-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-error-fg shrink-0 mt-0.5" strokeWidth={2} />
            <div>
              <p className="text-xs font-semibold text-error-fg mb-1">Rejection Reason</p>
              <p className="text-xs text-fg-muted">UTR number does not match our transaction records. Please verify the UTR from your bank/UPI app and resubmit.</p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-surface border border-border-default rounded-[8px] p-4 mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-fg-muted mb-3">Status Timeline</p>
          {[
            { label: 'Submitted', time: '19 Dec, 3:42 PM', done: true, active: false },
            { label: 'Under Review', time: status !== 'pending' ? '19 Dec, 4:10 PM' : 'In progress…', done: status !== 'pending', active: status === 'pending' },
            { label: status === 'rejected' ? 'Rejected' : 'Approved', time: status === 'approved' ? '19 Dec, 5:30 PM' : status === 'rejected' ? '19 Dec, 5:30 PM' : 'Pending', done: status !== 'pending', active: false },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-1.5">
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${item.done ? 'bg-success border-success' : item.active ? 'border-brand bg-brand/20 animate-pulse' : 'border-border-default'}`}>
                {item.done && <Check className="w-3 h-3 text-white" strokeWidth={2.5} />}
              </div>
              <div>
                <p className={`text-xs font-semibold ${item.done ? 'text-fg' : item.active ? 'text-brand' : 'text-fg-muted'}`}>{item.label}</p>
                <p className="text-[10px] text-fg-muted">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-4 pt-2 border-t border-border-default bg-base flex flex-col gap-2">
        {status === 'approved' && (
          <Button fullWidth>
            <Download className="w-4 h-4" strokeWidth={2} />
            Download Receipt
          </Button>
        )}
        {status === 'rejected' && (
          <Button fullWidth onClick={onPayAgain}>Resubmit Payment</Button>
        )}
        {/* Simulator buttons */}
        <div className="flex gap-2 pt-1">
          <span className="text-[10px] text-fg-muted self-center">Simulate:</span>
          {(['pending', 'approved', 'rejected'] as Status[]).map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`flex-1 h-7 rounded-[4px] text-[9px] font-semibold border transition-colors capitalize ${status === s ? 'bg-brand text-on-brand border-brand' : 'border-border-default text-fg-muted'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
