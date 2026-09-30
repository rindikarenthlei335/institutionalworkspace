import React, { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { Input } from '../../components/ui/Input';
import { LockedFeature } from '../../components/ui/LockedFeature';
import { usePlan } from '../../contexts/PlanContext';
import {
  LayoutDashboard, Plus, Pencil, Trash2, Search, Filter,
  CheckCircle, XCircle, Eye, Upload, Download, Shield, Globe, Copy
} from 'lucide-react';

// ── Shared section header ─────────────────────────────────────────────────────
function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="font-display font-semibold text-base text-fg">{title}</h2>
      {action}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
const recentActivity = [
  { action: 'Fee payment approved',     detail: 'Aarav Sharma · ₹ 12,400', time: '2 min ago',  type: 'success' as const },
  { action: 'New admission submitted',  detail: 'Riya Patel · Class VIII',   time: '14 min ago', type: 'info' as const },
  { action: 'Fee payment rejected',     detail: 'Karan Mehta · UTR mismatch',time: '1 hr ago',  type: 'error' as const },
  { action: 'Notice published',         detail: 'Annual Day — 25 Jan 2025',  time: '2 hr ago',  type: 'neutral' as const },
  { action: 'Faculty profile updated',  detail: 'Ms. Sunita Kapoor',         time: '3 hr ago',  type: 'neutral' as const },
];

const typeColor = { success: 'bg-success', error: 'bg-error', info: 'bg-brand', neutral: 'bg-fg-muted' } as const;

export function AdminDashboard({ onNavigate }: { onNavigate: (p: 'fees' | 'content' | 'students' | 'settings') => void }) {
  const sparkline = [40, 55, 48, 70, 62, 80, 71];
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Students Enrolled" value={1840} change="+32 this term" trend="up" sparkline={sparkline}
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>}
        />
        <StatCard label="Fees Collected" value={2840000} prefix="₹ " change="71% of target" trend="up"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>}
        />
        <StatCard label="Pending Approvals" value={14} change="3 urgent" trend="warn"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard label="Active Notices" value={6} change="1 expires today" trend="neutral"
          icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Activity */}
        <div className="lg:col-span-2 bg-surface border border-border-default rounded-[8px] p-5">
          <SectionHeader title="Recent Activity" action={
            <button onClick={() => onNavigate('fees')} className="text-[12px] text-brand font-semibold hover:opacity-80">View all</button>
          } />
          <div className="space-y-3.5">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${typeColor[a.type]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-fg">{a.action}</p>
                  <p className="text-[12px] text-fg-muted">{a.detail}</p>
                </div>
                <span className="text-[11px] text-fg-muted shrink-0 tabular-nums">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fee progress */}
        <div className="bg-surface border border-border-default rounded-[8px] p-5">
          <SectionHeader title="Term 2 Collection" />
          <div className="text-center mb-4">
            <p className="font-display font-bold text-[36px] text-brand tabular-nums">71%</p>
            <p className="text-[12px] text-fg-muted">of ₹ 40L target</p>
          </div>
          <div className="h-1.5 bg-elevated rounded-full mb-4 overflow-hidden">
            <div className="h-full bg-brand rounded-full animate-progress" style={{ '--target-width': '71%' } as React.CSSProperties} />
          </div>
          {[
            { label: 'Collected', value: '₹ 28.4L', color: 'text-success-fg' },
            { label: 'Pending',   value: '₹ 11.6L', color: 'text-warning-fg' },
            { label: 'Overdue',   value: '₹ 2.1L',  color: 'text-error-fg' },
          ].map(item => (
            <div key={item.label} className="flex justify-between py-2 border-b border-border last:border-0">
              <span className="text-[12px] text-fg-muted">{item.label}</span>
              <span className={`text-[12px] font-semibold tabular-nums ${item.color}`}>{item.value}</span>
            </div>
          ))}
          <button onClick={() => onNavigate('fees')} className="w-full mt-4 h-9 rounded-[6px] bg-brand/10 text-brand text-[12px] font-semibold border border-brand/50 hover:bg-brand/20 transition-colors">
            Manage Fee Approvals
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Content Manager ───────────────────────────────────────────────────────────
const noticeRows = [
  { title: 'Annual Day Celebration', category: 'Event',   date: '18 Dec', status: 'published' as const },
  { title: 'Winter Vacation Notice',  category: 'Holiday', date: '12 Dec', status: 'published' as const },
  { title: 'Sports Day Trials',       category: 'Event',   date: '8 Dec',  status: 'draft'     as const },
];

export function AdminContent() {
  const [tab, setTab]         = useState('Notices');
  const [showAdd, setShowAdd] = useState(false);
  const tabs = ['Notices', 'Gallery', 'Faculty', 'Facilities'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex bg-surface border border-border-default rounded-[6px] p-1 gap-0.5">
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 h-8 rounded-[8px] text-[12px] font-semibold transition-all ${tab === t ? 'bg-brand text-on-brand' : 'text-fg-muted hover:text-fg'}`}>
              {t}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={() => setShowAdd(true)} icon={<Plus className="w-4 h-4" strokeWidth={1.5} />}>
          Add {tab.slice(0, -1)}
        </Button>
      </div>

      {tab === 'Notices' && (
        <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-strong">
                {['Title', 'Category', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-fg-muted uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {noticeRows.map((n, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-elevated/30 transition-colors">
                  <td className="px-5 py-3.5"><p className="text-[13px] font-semibold text-fg">{n.title}</p></td>
                  <td className="px-5 py-3.5"><span className="text-[11px] px-2.5 py-1 rounded-full bg-brand/12 text-brand font-semibold">{n.category}</span></td>
                  <td className="px-5 py-3.5"><span className="text-[12px] text-fg-muted tabular-nums">{n.date}</span></td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${n.status === 'published' ? 'bg-success/12 text-success-fg' : 'bg-elevated text-fg-muted'}`}>
                      {n.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="text-[12px] text-brand font-semibold hover:opacity-80 flex items-center gap-1"><Pencil className="w-3.5 h-3.5" strokeWidth={1.5}/>Edit</button>
                      <button className="text-[12px] text-error-fg font-semibold hover:opacity-80 flex items-center gap-1"><Trash2 className="w-3.5 h-3.5" strokeWidth={1.5}/>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'Gallery' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400&h=300&fit=crop&auto=format',
            'https://images.unsplash.com/photo-1532094349884-543559242c27?w=400&h=300&fit=crop&auto=format',
          ].map((url, i) => (
            <div key={i} className="relative group rounded-[6px] overflow-hidden bg-elevated">
              <img src={url} alt="" className="w-full h-36 object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-base/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="h-7 px-3 rounded-full bg-error/80 text-white text-[11px] font-semibold flex items-center gap-1">
                  <Trash2 className="w-3 h-3" strokeWidth={1.5}/>Delete
                </button>
              </div>
            </div>
          ))}
          <button onClick={() => setShowAdd(true)} className="h-36 rounded-[6px] border-2 border-dashed border-border-default flex items-center justify-center hover:border-brand transition-colors group">
            <div className="text-center">
              <Upload className="w-6 h-6 text-fg-muted group-hover:text-brand mx-auto mb-1.5 transition-colors" strokeWidth={1.5}/>
              <p className="text-[12px] text-fg-muted font-semibold">Upload Photo</p>
            </div>
          </button>
        </div>
      )}

      {(tab === 'Faculty' || tab === 'Facilities') && (
        <div className="grid gap-3">
          {[
            { name: 'Dr. Meera Pillai',  sub: 'Principal', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format' },
            { name: 'Mr. Rajesh Nair',   sub: 'Mathematics', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format' },
            { name: 'Ms. Sunita Kapoor', sub: 'Science', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format' },
          ].map(f => (
            <div key={f.name} className="bg-surface border border-border-default rounded-[8px] p-4 flex items-center gap-4">
              <img src={f.img} alt={f.name} className="w-12 h-12 rounded-full object-cover bg-elevated" />
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-fg">{f.name}</p>
                <p className="text-[12px] text-brand font-semibold">{f.sub}</p>
              </div>
              <div className="flex gap-2">
                <button className="h-8 px-3 rounded-[8px] text-[12px] font-semibold border border-brand/50 text-brand hover:bg-brand/10 transition-colors">Edit</button>
                <button className="h-8 px-3 rounded-[8px] text-[12px] font-semibold border border-error/50 text-error-fg hover:bg-error/10 transition-colors">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,31,24,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="bg-surface border border-border-default rounded-[20px] p-6 w-full max-w-md animate-scale-up">
            <h3 className="font-display font-semibold text-[16px] text-fg mb-4">Add {tab.slice(0,-1)}</h3>
            {tab === 'Notices' ? (
              <div className="space-y-3">
                <Input placeholder="Notice title" />
                <textarea rows={3} placeholder="Notice body" className="w-full bg-elevated border border-border-default rounded-[6px] px-3 py-2 text-sm text-fg placeholder:text-fg-muted/50 focus:outline-none focus:border-brand/50 resize-none" />
                <select className="w-full h-11 bg-elevated border border-border-default rounded-[6px] px-3 text-sm text-fg focus:outline-none focus:border-brand/50">
                  <option>Academic</option><option>Finance</option><option>Event</option><option>Holiday</option>
                </select>
              </div>
            ) : (
              <div className="border-2 border-dashed border-border-default rounded-[8px] p-10 text-center hover:border-brand transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-fg-muted mx-auto mb-2" strokeWidth={1.5}/>
                <p className="text-sm text-fg-muted font-semibold">Click to upload or drag & drop</p>
                <p className="text-[11px] text-fg-muted/60 mt-1">JPG, PNG · Max 5MB</p>
              </div>
            )}
            <div className="flex gap-3 mt-5">
              <Button variant="secondary" className="flex-1" onClick={() => setShowAdd(false)}>Cancel</Button>
              <Button className="flex-1" onClick={() => setShowAdd(false)}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Fee Approvals ─────────────────────────────────────────────────────────────
const payments = [
  { id: 'PAY-001', student: 'Aarav Sharma',  cls: 'VII-B', amount: 12400, utr: '412893045621', submitted: '19 Dec, 3:42 PM', status: 'pending'  as const, screenshot: true },
  { id: 'PAY-002', student: 'Riya Patel',    cls: 'IX-A',  amount: 8400,  utr: '389204710234', submitted: '19 Dec, 11:20 AM',status: 'pending'  as const, screenshot: true },
  { id: 'PAY-003', student: 'Karan Mehta',   cls: 'XI-C',  amount: 15200, utr: '123456789',    submitted: '18 Dec, 4:05 PM', status: 'rejected' as const, screenshot: false },
  { id: 'PAY-004', student: 'Ananya Singh',  cls: 'VI-A',  amount: 6500,  utr: '901234567890', submitted: '18 Dec, 2:15 PM', status: 'approved' as const, screenshot: true },
  { id: 'PAY-005', student: 'Dev Gupta',     cls: 'X-B',   amount: 11800, utr: '567890123456', submitted: '17 Dec, 9:30 AM', status: 'approved' as const, screenshot: true },
];

export function AdminFeeApprovals() {
  const { plan, hasFeature } = usePlan();
  const isLocked = !hasFeature('fee_payment');

  const [statuses, setStatuses] = useState(Object.fromEntries(payments.map(p => [p.id, p.status])));
  const [filter, setFilter]     = useState('all');
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [previewModal, setPreviewModal] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = payments.filter(p => filter === 'all' || statuses[p.id] === filter);
  const pendingCount = payments.filter(p => statuses[p.id] === 'pending').length;

  const approve = (id: string) => setStatuses(s => ({ ...s, [id]: 'approved' }));
  const reject  = (id: string) => { setStatuses(s => ({ ...s, [id]: 'rejected' })); setRejectModal(null); setRejectReason(''); };

  const table = (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {[['all', 'All'], ['pending', `Pending (${pendingCount})`], ['approved', 'Approved'], ['rejected', 'Rejected']].map(([val, label]) => (
            <button key={val} onClick={() => setFilter(val)}
              className={`px-3.5 h-8 rounded-full text-[12px] font-semibold border transition-all ${filter === val ? 'bg-brand text-on-brand border-brand' : 'border-border-default text-fg-muted hover:text-fg'}`}>
              {label}
            </button>
          ))}
        </div>
        {selected.size > 0 && (
          <Button size="sm" className="ml-auto" onClick={() => {
            const upd = { ...statuses };
            selected.forEach(id => { if (upd[id] === 'pending') upd[id] = 'approved'; });
            setStatuses(upd); setSelected(new Set());
          }}>
            <CheckCircle className="w-4 h-4" strokeWidth={1.5}/>Bulk Approve ({selected.size})
          </Button>
        )}
      </div>

      <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead>
              <tr className="border-b border-border-strong">
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" className="accent-brand w-3.5 h-3.5" onChange={e => {
                    if (e.target.checked) setSelected(new Set(filtered.filter(p => statuses[p.id] === 'pending').map(p => p.id)));
                    else setSelected(new Set());
                  }} />
                </th>
                {['ID', 'Student', 'Amount', 'UTR', 'Screenshot', 'Submitted', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-fg-muted uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const st = statuses[p.id] as 'pending' | 'approved' | 'rejected';
                const utrValid = p.utr.length === 12;
                return (
                  <tr key={p.id} className="border-b border-border last:border-0 hover:bg-elevated/20 transition-colors">
                    <td className="px-4 py-3">
                      {st === 'pending' && (
                        <input type="checkbox" className="accent-brand w-3.5 h-3.5" checked={selected.has(p.id)}
                          onChange={e => {
                            const n = new Set(selected);
                            e.target.checked ? n.add(p.id) : n.delete(p.id);
                            setSelected(n);
                          }} />
                      )}
                    </td>
                    <td className="px-4 py-3"><span className="text-[11px] font-mono text-fg-muted">{p.id}</span></td>
                    <td className="px-4 py-3">
                      <p className="text-[13px] font-semibold text-fg">{p.student}</p>
                      <p className="text-[11px] text-fg-muted">Class {p.cls}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-display font-semibold text-[13px] text-fg tabular-nums">₹ {p.amount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[12px] font-mono ${utrValid ? 'text-fg' : 'text-error-fg'}`}>{p.utr}</span>
                      {!utrValid && <p className="text-[10px] text-error-fg font-semibold">Invalid</p>}
                    </td>
                    <td className="px-4 py-3">
                      {p.screenshot
                        ? <button onClick={() => setPreviewModal(p.id)} className="flex items-center gap-1 text-[12px] text-brand font-semibold hover:opacity-80"><Eye className="w-3.5 h-3.5" strokeWidth={1.5}/>View</button>
                        : <span className="text-[12px] text-error-fg font-semibold">Missing</span>
                      }
                    </td>
                    <td className="px-4 py-3"><span className="text-[11px] text-fg-muted tabular-nums">{p.submitted}</span></td>
                    <td className="px-4 py-3"><Badge status={st} /></td>
                    <td className="px-4 py-3">
                      {st === 'pending' ? (
                        <div className="flex gap-1.5">
                          <button onClick={() => approve(p.id)} className="h-7 px-2.5 rounded-[7px] text-[11px] font-semibold bg-success/12 text-success-fg border border-success/50 hover:bg-success/20 flex items-center gap-1">
                            <CheckCircle className="w-3.5 h-3.5" strokeWidth={1.5}/>OK
                          </button>
                          <button onClick={() => setRejectModal(p.id)} className="h-7 px-2.5 rounded-[7px] text-[11px] font-semibold bg-error/12 text-error-fg border border-error/50 hover:bg-error/20 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" strokeWidth={1.5}/>Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-fg-muted capitalize">{st}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,31,24,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="bg-surface border border-border-default rounded-[20px] p-6 w-full max-w-md animate-scale-up">
            <h3 className="font-display font-semibold text-[16px] text-fg mb-1">Reject Payment</h3>
            <p className="text-[12px] text-fg-muted mb-4">{rejectModal} · {payments.find(p => p.id === rejectModal)?.student}</p>
            <label className="text-[13px] font-semibold text-fg block mb-2">Reason for rejection</label>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. UTR number does not match our records. Please verify and resubmit."
              rows={3} className="w-full bg-elevated border border-border-default rounded-[6px] px-4 py-3 text-sm text-fg placeholder:text-fg-muted/50 focus:outline-none focus:border-error/50 resize-none mb-4" />
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setRejectModal(null)}>Cancel</Button>
              <Button variant="danger" className="flex-1" disabled={!rejectReason.trim()} onClick={() => reject(rejectModal)}>Confirm Reject</Button>
            </div>
          </div>
        </div>
      )}

      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,31,24,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="bg-surface border border-border-default rounded-[20px] p-6 w-full max-w-sm animate-scale-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-[15px] text-fg">Payment Screenshot</h3>
              <button onClick={() => setPreviewModal(null)} className="w-8 h-8 rounded-full hover:bg-elevated flex items-center justify-center text-fg-muted hover:text-fg transition-colors">
                <XCircle className="w-4 h-4" strokeWidth={1.5}/>
              </button>
            </div>
            <div className="bg-elevated rounded-[8px] p-8 flex flex-col items-center justify-center text-center h-48">
              <div className="w-12 h-12 rounded-full bg-success/15 border border-success/50 flex items-center justify-center mb-3">
                <CheckCircle className="w-6 h-6 text-success-fg" strokeWidth={1.5}/>
              </div>
              <p className="text-sm font-semibold text-fg">Payment Confirmed</p>
              <p className="text-[12px] text-fg-muted mt-1">₹ 12,400 · BHIM UPI</p>
              <p className="text-[11px] text-success-fg font-semibold mt-1">Transaction Successful</p>
            </div>
            <p className="text-[11px] text-fg-muted text-center mt-3 font-mono">screenshot_{previewModal}.jpg</p>
          </div>
        </div>
      )}
    </div>
  );

  return isLocked ? (
    <LockedFeature requiredPlan="essential" currentPlan={plan} featureName="Fee Approval Queue">
      {table}
    </LockedFeature>
  ) : table;
}

// ── Student Management ────────────────────────────────────────────────────────
const students = [
  { id: 'STU-001', name: 'Aarav Sharma',  cls: 'VII', sec: 'B', roll: 14, parent: 'Priya Sharma',  fee: 'due',     joined: 'Apr 2024' },
  { id: 'STU-002', name: 'Riya Patel',    cls: 'IX',  sec: 'A', roll: 3,  parent: 'Rahul Patel',   fee: 'paid',    joined: 'Apr 2023' },
  { id: 'STU-003', name: 'Karan Mehta',   cls: 'XI',  sec: 'C', roll: 22, parent: 'Sanjay Mehta',  fee: 'pending', joined: 'Apr 2022' },
  { id: 'STU-004', name: 'Ananya Singh',  cls: 'VI',  sec: 'A', roll: 7,  parent: 'Meera Singh',   fee: 'paid',    joined: 'Apr 2024' },
  { id: 'STU-005', name: 'Dev Gupta',     cls: 'X',   sec: 'B', roll: 18, parent: 'Anil Gupta',    fee: 'due',     joined: 'Apr 2023' },
];

export function AdminStudents() {
  const { plan, hasFeature } = usePlan();
  const isLocked = !hasFeature('student_management');
  const [search, setSearch] = useState('');
  const filtered = students.filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()));

  const content = (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-fg-muted absolute left-3.5 top-1/2 -translate-y-1/2" strokeWidth={1.5}/>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search students…"
            className="w-full h-10 bg-surface border border-border-default rounded-[6px] pl-10 pr-4 text-[13px] text-fg placeholder:text-fg-muted/50 focus:outline-none focus:border-brand/50 transition-colors"
          />
        </div>
        <button className="h-10 px-4 rounded-[6px] border border-border-default text-[13px] font-semibold text-fg-muted hover:text-fg hover:border-brand flex items-center gap-2 transition-colors">
          <Filter className="w-4 h-4" strokeWidth={1.5}/>Filter
        </button>
        <Button size="sm" icon={<Plus className="w-4 h-4" strokeWidth={1.5}/>}>Add Student</Button>
        <Button size="sm" variant="secondary" icon={<Download className="w-4 h-4" strokeWidth={1.5}/>}>Import CSV</Button>
      </div>

      <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border-strong">
              {['Student ID', 'Name', 'Class / Sec', 'Roll', 'Parent', 'Fee Status', 'Joined', 'Actions'].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-fg-muted uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-border last:border-0 hover:bg-elevated/20 transition-colors">
                <td className="px-4 py-3"><span className="font-mono text-[11px] text-fg-muted">{s.id}</span></td>
                <td className="px-4 py-3"><p className="text-[13px] font-semibold text-fg">{s.name}</p></td>
                <td className="px-4 py-3"><span className="text-[13px] text-fg-muted">Class {s.cls}-{s.sec}</span></td>
                <td className="px-4 py-3"><span className="font-mono text-[13px] text-fg tabular-nums">{s.roll}</span></td>
                <td className="px-4 py-3"><p className="text-[12px] text-fg-muted">{s.parent}</p></td>
                <td className="px-4 py-3"><Badge status={s.fee as 'paid' | 'due' | 'pending'} /></td>
                <td className="px-4 py-3"><span className="text-[11px] text-fg-muted tabular-nums">{s.joined}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    <button className="h-7 px-2.5 rounded-[7px] text-[11px] font-semibold border border-brand/50 text-brand hover:bg-brand/10 transition-colors flex items-center gap-1"><Eye className="w-3 h-3" strokeWidth={1.5}/>View</button>
                    <button className="h-7 px-2.5 rounded-[7px] text-[11px] font-semibold border border-border-default text-fg-muted hover:text-fg transition-colors flex items-center gap-1"><Pencil className="w-3 h-3" strokeWidth={1.5}/>Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return isLocked ? (
    <LockedFeature requiredPlan="essential" currentPlan={plan} featureName="Student Management">
      {content}
    </LockedFeature>
  ) : content;
}

// ── Settings ──────────────────────────────────────────────────────────────────
export function AdminSettings() {
  const [tab, setTab] = useState('General');
  const [domain, setDomain] = useState('');
  const [domainStep, setDomainStep] = useState(0);
  const tabs = ['General', 'Theme & Branding', 'Domain', 'Roles & Users', 'Plan & Billing'];

  return (
    <div className="p-6 max-w-3xl">
      <div className="flex gap-1 bg-surface border border-border-default rounded-[6px] p-1 mb-6 flex-wrap">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 h-8 rounded-[8px] text-[12px] font-semibold transition-all ${tab === t ? 'bg-brand text-on-brand' : 'text-fg-muted hover:text-fg'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'General' && (
        <div className="space-y-5">
          <div className="bg-surface border border-border-default rounded-[8px] p-5 space-y-4">
            <h3 className="font-display font-semibold text-[14px] text-fg">School Information</h3>
            <Input label="School Name" defaultValue="Delhi Public School" />
            <Input label="Board" defaultValue="CBSE" />
            <Input label="Principal Name" defaultValue="Dr. Meera Pillai" />
            <Input label="School Email" type="email" defaultValue="info@dps-delhi.edu.in" />
            <Input label="Contact Number" type="tel" defaultValue="+91 11 2345 6789" />
            <div>
              <label className="text-[13px] font-semibold text-fg block mb-1.5">Address</label>
              <textarea rows={2} defaultValue="12 School Road, Connaught Place, New Delhi – 110001" className="w-full bg-elevated border border-border-default rounded-[6px] px-4 py-3 text-sm text-fg focus:outline-none focus:border-brand/50 resize-none" />
            </div>
            <Button size="sm">Save Changes</Button>
          </div>
        </div>
      )}

      {tab === 'Theme & Branding' && (
        <div className="space-y-5">
          <div className="bg-surface border border-border-default rounded-[8px] p-5 space-y-4">
            <h3 className="font-display font-semibold text-[14px] text-fg">School Theme</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Forest', color: '#1F4D3A' },
                { name: 'Ocean Blue', color: '#235A78' },
                { name: 'Maroon', color: '#74353C' },
              ].map(preset => (
                <button key={preset.name} title={preset.name}
                  className={`h-12 rounded-[6px] border-2 text-[11px] font-medium transition-colors ${preset.name === 'Forest' ? 'border-fg' : 'border-transparent hover:border-border-default'}`}
                  style={{ background: preset.color, color: '#FFFFFF' }}
                >{preset.name}</button>
              ))}
            </div>
            <p className="text-[11px] text-fg-muted">Select a primary accent colour for your school's website and app.</p>
            <div>
              <p className="text-[13px] font-semibold text-fg mb-2">School Logo</p>
              <div className="border-2 border-dashed border-border-default rounded-[6px] p-6 text-center hover:border-brand transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-fg-muted mx-auto mb-2" strokeWidth={1.5}/>
                <p className="text-[12px] text-fg-muted font-semibold">Upload logo</p>
                <p className="text-[10px] text-fg-muted/60 mt-0.5">PNG, SVG · 512×512 recommended</p>
              </div>
            </div>
            <Button size="sm">Apply Theme</Button>
          </div>
        </div>
      )}

      {tab === 'Domain' && (
        <div className="space-y-4">
          <div className="bg-surface border border-border-default rounded-[8px] p-5">
            <h3 className="font-display font-semibold text-[14px] text-fg mb-1">Custom Domain</h3>
            <p className="text-[12px] text-fg-muted mb-5">Connect your school's own domain (e.g. dps-delhi.edu.in) to your EduPortal website.</p>

            {domainStep === 0 && (
              <div className="space-y-4">
                <Input
                  label="Your domain"
                  placeholder="e.g. dps-delhi.edu.in"
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  icon={<Globe className="w-4 h-4" strokeWidth={1.5}/>}
                />
                <Button size="sm" disabled={!domain} onClick={() => setDomainStep(1)}>Continue</Button>
              </div>
            )}

            {domainStep === 1 && (
              <div className="space-y-4">
                <div className="bg-base rounded-[6px] border border-border-default p-4">
                  <p className="text-[12px] font-semibold text-fg-muted uppercase tracking-wider mb-3">DNS Records to add</p>
                  {[
                    { type: 'CNAME', name: 'www', value: 'cname.eduportal.app' },
                    { type: 'TXT',   name: '@',   value: 'eduportal-verify=dps2024' },
                  ].map(r => (
                    <div key={r.type} className="mb-3 last:mb-0 p-3 bg-surface rounded-[8px] border border-border-default">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex gap-2">
                          <span className="text-[10px] font-semibold bg-brand/12 text-brand px-1.5 py-0.5 rounded">{r.type}</span>
                          <span className="font-mono text-[12px] text-fg-muted">{r.name}</span>
                        </div>
                        <button className="text-[11px] text-fg-muted hover:text-fg flex items-center gap-1"><Copy className="w-3 h-3" strokeWidth={1.5}/>Copy</button>
                      </div>
                      <p className="font-mono text-[12px] text-fg">{r.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button size="sm" variant="secondary" onClick={() => setDomainStep(0)}>Back</Button>
                  <Button size="sm" onClick={() => setDomainStep(2)}>Verify Domain</Button>
                </div>
              </div>
            )}

            {domainStep === 2 && (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-success/15 border border-success/50 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-success-fg" strokeWidth={1.5}/>
                </div>
                <p className="font-semibold text-fg text-sm">Domain verified!</p>
                <p className="text-[12px] text-fg-muted mt-1 font-mono">{domain}</p>
                <p className="text-[12px] text-success-fg mt-2 font-semibold">Active · SSL secured</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'Roles & Users' && (
        <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
          <div className="p-5 border-b border-border-default flex items-center justify-between">
            <h3 className="font-display font-semibold text-[14px] text-fg">Admin Users</h3>
            <Button size="sm" icon={<Plus className="w-4 h-4" strokeWidth={1.5}/>}>Add User</Button>
          </div>
          {[
            { name: 'Admin User',      email: 'admin@dps-delhi.edu.in', role: 'Super Admin',  status: 'active' as const },
            { name: 'Data Entry Exec', email: 'data@dps-delhi.edu.in',  role: 'Data Entry',   status: 'active' as const },
            { name: 'Fee Manager',     email: 'fees@dps-delhi.edu.in',  role: 'Fee Manager',  status: 'active' as const },
          ].map((u, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0">
              <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/50 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-brand">{u.name[0]}</span>
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-fg">{u.name}</p>
                <p className="text-[11px] text-fg-muted">{u.email}</p>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full bg-elevated text-fg-muted font-semibold">{u.role}</span>
              <Badge status={u.status}/>
              <button className="h-7 px-2.5 rounded-[7px] text-[11px] font-semibold border border-border-default text-fg-muted hover:text-fg transition-colors flex items-center gap-1">
                <Pencil className="w-3 h-3" strokeWidth={1.5}/>Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'Plan & Billing' && (
        <div className="space-y-4">
          <div className="bg-surface border border-brand/50 rounded-[8px] p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] text-fg-muted uppercase tracking-widest font-semibold mb-1">Current Plan</p>
                <p className="font-display font-semibold text-xl text-fg">Essential</p>
              </div>
              <div className="text-right">
                <p className="font-display font-semibold text-2xl text-brand tabular-nums">₹ 3,999<span className="text-sm font-normal text-fg-muted">/mo</span></p>
                <p className="text-[11px] text-fg-muted">Next billing: 1 Jan 2025</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button size="sm" variant="secondary">Manage billing</Button>
              <Button size="sm">View Pro plan details</Button>
            </div>
          </div>
          <div className="bg-surface border border-border-default rounded-[8px] p-5">
            <h3 className="font-display font-semibold text-[14px] text-fg mb-4">Invoice History</h3>
            {[
              { date: 'Nov 2024', amount: '₹ 3,999', status: 'paid' as const },
              { date: 'Oct 2024', amount: '₹ 3,999', status: 'paid' as const },
              { date: 'Sep 2024', amount: '₹ 3,999', status: 'paid' as const },
            ].map((inv, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <span className="text-[13px] text-fg">{inv.date}</span>
                <span className="font-mono tabular-nums text-[13px] text-fg">{inv.amount}</span>
                <Badge status={inv.status}/>
                <button className="text-[12px] text-brand font-semibold flex items-center gap-1 hover:opacity-80"><Download className="w-3.5 h-3.5" strokeWidth={1.5}/>PDF</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
