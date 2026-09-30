import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { CreditCard, Bell, FileText, Globe, AlertCircle } from 'lucide-react';

const quickActions = [
  { label: 'Fee payment', icon: <CreditCard className="w-5 h-5" strokeWidth={1.5}/>, color: 'text-brand', tab: 'fees' },
  { label: 'Notice Board', icon: <Bell className="w-5 h-5" strokeWidth={1.5}/>, color: 'text-fg-muted', tab: 'notices' },
  { label: 'Admission', icon: <FileText className="w-5 h-5" strokeWidth={1.5}/>, color: 'text-fg-muted', tab: 'admission' },
  { label: 'Website', icon: <Globe className="w-5 h-5" strokeWidth={1.5}/>, color: 'text-fg-muted', tab: '' },
];

const recentNotices = [
  { title: 'Annual Sports Day — 15 Jan 2025', category: 'Event',   urgent: false },
  { title: 'Fee Due: Term 2 — Pay before 31 Dec', category: 'Finance', urgent: true  },
  { title: 'Winter Vacation: Dec 22 – Jan 5',     category: 'Holiday', urgent: false },
];

export function AppHome({ onNavigate }: { onNavigate: (tab: string) => void }) {
  return (
    <div className="flex flex-col bg-base h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="px-5 pt-4 pb-7" style={{ background: 'linear-gradient(160deg, #FFFFFF 0%, #EAEFEC 100%)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[11px] text-fg-muted font-semibold uppercase tracking-widest">Welcome back</p>
            <h2 className="font-display font-semibold text-[20px] text-fg mt-0.5">Priya Sharma</h2>
            <p className="text-[12px] text-fg-muted">Aarav Sharma · Class VII-B · Roll 14</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-brand/20 border border-brand/50 flex items-center justify-center">
            <span className="font-display font-bold text-[15px] text-brand">PS</span>
          </div>
        </div>

        {/* Fee due card */}
        <div className="rounded-[8px] p-4 border border-warning/50" style={{ background: 'linear-gradient(135deg, rgba(217,162,58,0.12) 0%, rgba(255,255,255,0.7) 100%)' }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[11px] text-fg-muted font-semibold">Outstanding Fee</p>
              <p className="font-display font-bold text-[28px] text-fg tabular-nums mt-0.5" style={{ letterSpacing: '-0.02em' }}>₹ 12,400</p>
              <p className="text-[12px] text-warning-fg mt-0.5 font-semibold">Due by 31 Dec 2024</p>
            </div>
            <Badge status="due" />
          </div>
          <button onClick={() => onNavigate('fees')}
            className="w-full h-10 rounded-[6px] bg-brand text-on-brand text-[13px] font-semibold hover:opacity-90 transition-opacity">
            Proceed to payment
          </button>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-5 -mt-3">
        <div className="bg-surface rounded-[8px] p-4 border border-border-default">
          <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-3">Services</p>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <button key={action.label} className="flex flex-col items-center gap-1.5" onClick={() => action.tab && onNavigate(action.tab)}>
                <div className={`w-12 h-12 ${action.color} flex items-center justify-center`}>
                  {action.icon}
                </div>
                <span className="text-[10px] text-fg-muted font-semibold text-center leading-tight">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notices */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[13px] font-semibold text-fg">Notice Board</p>
          <button onClick={() => onNavigate('notices')} className="text-[12px] text-brand font-semibold hover:underline underline-offset-4">View all</button>
        </div>
        <div className="flex flex-col gap-2">
          {recentNotices.map((n, i) => (
            <div key={i} className={`bg-surface border rounded-[8px] p-3 flex items-start gap-3 ${n.urgent ? 'border-warning/50' : 'border-border-default'}`}>
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.urgent ? 'bg-warning' : 'bg-brand'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-fg leading-snug">{n.title}</p>
                <p className="text-[10px] text-fg-muted mt-0.5">{n.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance */}
      <div className="px-5 mt-5">
        <div className="bg-surface border border-border-default rounded-[8px] p-4">
          <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-3">Attendance · December</p>
          <div className="flex gap-1.5 flex-wrap">
            {Array.from({ length: 22 }, (_, i) => (
              <div key={i}
                className={`w-7 h-7 rounded-[6px] flex items-center justify-center text-[10px] font-semibold tabular-nums ${
                  i < 18 ? 'bg-success/15 text-success-fg' : i === 18 ? 'bg-error/15 text-error-fg' : 'bg-elevated text-fg-muted'
                }`}>
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-[12px] text-fg-muted mt-3">18 / 22 days present &nbsp;·&nbsp; <span className="text-success-fg font-semibold">81.8%</span></p>
        </div>
      </div>

      {/* Offline banner demo */}
      <div className="px-5 mt-5">
        <div className="bg-warning/10 border border-warning/50 rounded-[8px] p-3 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-warning-fg shrink-0" strokeWidth={1.5}/>
          <p className="text-[12px] text-warning-fg font-semibold">Low internet — showing cached content.</p>
        </div>
      </div>
    </div>
  );
}
