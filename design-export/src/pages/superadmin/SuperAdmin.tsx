import React, { useState } from 'react';
import { Badge, PlanBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { StatCard } from '../../components/ui/StatCard';
import { Input } from '../../components/ui/Input';
import {
  School, Users, CreditCard, HardDrive, Globe, Bell,
  CheckCircle, XCircle, AlertTriangle, Eye, Settings, ChevronRight, Download
} from 'lucide-react';

type SATab = 'schools' | 'billing' | 'flags' | 'domains' | 'usage' | 'alerts';

const tabs: { id: SATab; label: string; icon: React.ReactNode }[] = [
  { id: 'schools',  label: 'Schools',      icon: <School     className="w-4 h-4" strokeWidth={1.5}/> },
  { id: 'billing',  label: 'Billing',      icon: <CreditCard className="w-4 h-4" strokeWidth={1.5}/> },
  { id: 'flags',    label: 'Feature Flags', icon: <Settings  className="w-4 h-4" strokeWidth={1.5}/> },
  { id: 'domains',  label: 'Domains',      icon: <Globe      className="w-4 h-4" strokeWidth={1.5}/> },
  { id: 'usage',    label: 'Usage',        icon: <HardDrive  className="w-4 h-4" strokeWidth={1.5}/> },
  { id: 'alerts',   label: 'Alerts',       icon: <Bell       className="w-4 h-4" strokeWidth={1.5}/> },
];

const schools = [
  { id: 'SCH-001', name: 'Delhi Public School',    plan: 'essential' as const, students: 1840, status: 'active'    as const, sub: '1 Jan 2025', city: 'New Delhi' },
  { id: 'SCH-002', name: 'St. Xavier\'s School',   plan: 'pro'       as const, students: 2400, status: 'active'    as const, sub: '15 Feb 2025', city: 'Mumbai' },
  { id: 'SCH-003', name: 'Springdale Academy',     plan: 'basic'     as const, students: 620,  status: 'active'    as const, sub: '5 Mar 2025', city: 'Bengaluru' },
  { id: 'SCH-004', name: 'Holy Cross Convent',     plan: 'essential' as const, students: 980,  status: 'suspended' as const, sub: '1 Nov 2024', city: 'Chennai' },
  { id: 'SCH-005', name: 'Bright Future School',   plan: 'basic'     as const, students: 310,  status: 'expired'   as const, sub: '20 Oct 2024', city: 'Kolkata' },
];

const billingRows = [
  { school: 'Delhi Public School', plan: 'essential' as const, amount: '₹ 3,999', due: '1 Jan 2025', status: 'paid'    as const, utr: '412893045621' },
  { school: 'St. Xavier\'s',       plan: 'pro'       as const, amount: '₹ 8,000', due: '15 Feb 2025',status: 'paid'    as const, utr: '389204710234' },
  { school: 'Springdale Academy',  plan: 'basic'     as const, amount: '₹ 1,499', due: '5 Mar 2025', status: 'pending' as const, utr: '' },
  { school: 'Holy Cross Convent',  plan: 'essential' as const, amount: '₹ 3,999', due: '1 Nov 2024', status: 'due'     as const, utr: '' },
];

const featureFlags = [
  { feature: 'Fee Payment Module',          plans: ['essential', 'pro'], active: true },
  { feature: 'Student Management',          plans: ['essential', 'pro'], active: true },
  { feature: 'Online Admission',            plans: ['essential', 'pro'], active: true },
  { feature: 'Principal Dashboard',         plans: ['pro'],              active: true },
  { feature: 'Website Analytics',           plans: ['pro'],              active: false },
  { feature: 'Bank CSV Auto-Match',         plans: ['pro'],              active: false },
  { feature: 'White-Label App',             plans: ['pro'],              active: true },
  { feature: 'SMS/WhatsApp Reminders',      plans: ['add-on'],           active: true },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-all duration-200 ${checked ? 'bg-brand' : 'bg-elevated border border-border-default'}`}
      style={{ height: 22 }}
    >
      <span className={`absolute top-0.5 w-[18px] h-[18px] rounded-full bg-white shadow transition-all duration-200 ${checked ? 'left-[calc(100%-20px)]' : 'left-0.5'}`}/>
    </button>
  );
}

export function SuperAdmin() {
  const [activeTab, setActiveTab] = useState<SATab>('schools');
  const [flags, setFlags] = useState(Object.fromEntries(featureFlags.map(f => [f.feature, f.active])));
  const [approveModal, setApproveModal] = useState<string | null>(null);

  return (
    <div className="bg-base min-h-full flex flex-col">
      {/* Header */}
      <div className="glass border-b border-border-default px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-0.5">EduPortal Platform</p>
            <h1 className="font-display font-bold text-xl text-fg" style={{ letterSpacing: '-0.02em' }}>Super Admin Console</h1>
          </div>
          <div className="flex gap-4">
            <StatCard label="Active Schools" value={3} icon={<School className="w-4 h-4" strokeWidth={1.5}/>} />
            <StatCard label="Total Students" value={5840} icon={<Users className="w-4 h-4" strokeWidth={1.5}/>} />
            <StatCard label="MRR" value={17497} prefix="₹ " icon={<CreditCard className="w-4 h-4" strokeWidth={1.5}/>} />
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-6 w-full flex-1">
        {/* Tab nav */}
        <div className="flex gap-1 mb-6 bg-surface border border-border-default rounded-[6px] p-1 w-fit flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 h-8 px-4 rounded-[8px] text-[12px] font-semibold transition-all ${activeTab === t.id ? 'bg-brand text-on-brand' : 'text-fg-muted hover:text-fg'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ── Schools ── */}
        {activeTab === 'schools' && (
          <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
            <div className="px-5 py-4 border-b border-border-default flex items-center justify-between">
              <h2 className="font-display font-semibold text-[14px] text-fg">School Registry</h2>
              <Button size="sm" icon={<School className="w-4 h-4" strokeWidth={1.5}/>}>Add School</Button>
            </div>
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="border-b border-border-strong">
                  {['ID', 'School', 'City', 'Plan', 'Students', 'Sub Renewal', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-fg-muted uppercase tracking-wider px-5 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schools.map(s => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-elevated/20 transition-colors">
                    <td className="px-5 py-3.5"><span className="font-mono text-[11px] text-fg-muted">{s.id}</span></td>
                    <td className="px-5 py-3.5"><p className="text-[13px] font-semibold text-fg">{s.name}</p></td>
                    <td className="px-5 py-3.5"><p className="text-[12px] text-fg-muted">{s.city}</p></td>
                    <td className="px-5 py-3.5"><PlanBadge plan={s.plan}/></td>
                    <td className="px-5 py-3.5"><span className="font-mono tabular-nums text-[13px] text-fg">{s.students.toLocaleString()}</span></td>
                    <td className="px-5 py-3.5"><span className="text-[11px] text-fg-muted tabular-nums">{s.sub}</span></td>
                    <td className="px-5 py-3.5"><Badge status={s.status}/></td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5">
                        <button className="h-7 px-2.5 rounded-[7px] text-[11px] font-semibold border border-brand/50 text-brand hover:bg-brand/10 flex items-center gap-1"><Eye className="w-3 h-3" strokeWidth={1.5}/>View</button>
                        {s.status === 'active' && (
                          <button className="h-7 px-2.5 rounded-[7px] text-[11px] font-semibold border border-error/50 text-error-fg hover:bg-error/10 flex items-center gap-1"><XCircle className="w-3 h-3" strokeWidth={1.5}/>Suspend</button>
                        )}
                        {s.status !== 'active' && (
                          <button className="h-7 px-2.5 rounded-[7px] text-[11px] font-semibold border border-success/50 text-success-fg hover:bg-success/10 flex items-center gap-1"><CheckCircle className="w-3 h-3" strokeWidth={1.5}/>Activate</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Billing ── */}
        {activeTab === 'billing' && (
          <div className="space-y-5">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'MRR', value: '₹ 17,497', trend: 'up' as const },
                { label: 'Outstanding', value: '₹ 5,498', trend: 'warn' as const },
                { label: 'Paid this month', value: '₹ 11,999', trend: 'up' as const },
                { label: 'Overdue', value: '₹ 3,999', trend: 'down' as const },
              ].map(item => (
                <div key={item.label} className="bg-surface border border-border-default rounded-[8px] p-4 text-center">
                  <p className="font-display font-semibold text-xl text-brand tabular-nums">{item.value}</p>
                  <p className="text-[11px] text-fg-muted mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
              <div className="px-5 py-4 border-b border-border-default flex items-center justify-between">
                <h2 className="font-display font-semibold text-[14px] text-fg">Subscription Billing</h2>
                <Button size="sm" variant="secondary" icon={<Download className="w-4 h-4" strokeWidth={1.5}/>}>Export CSV</Button>
              </div>
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border-strong">
                    {['School', 'Plan', 'Amount', 'Due Date', 'UTR / Ref', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left text-[11px] font-semibold text-fg-muted uppercase tracking-wider px-5 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {billingRows.map((b, i) => (
                    <tr key={i} className="border-b border-border last:border-0 hover:bg-elevated/20 transition-colors">
                      <td className="px-5 py-3.5"><p className="text-[13px] font-semibold text-fg">{b.school}</p></td>
                      <td className="px-5 py-3.5"><PlanBadge plan={b.plan}/></td>
                      <td className="px-5 py-3.5"><span className="font-mono tabular-nums text-[13px] font-semibold text-fg">{b.amount}</span></td>
                      <td className="px-5 py-3.5"><span className="text-[12px] text-fg-muted tabular-nums">{b.due}</span></td>
                      <td className="px-5 py-3.5">
                        {b.utr ? <span className="font-mono text-[11px] text-fg-muted">{b.utr}</span> : <span className="text-[11px] text-fg-muted/40">—</span>}
                      </td>
                      <td className="px-5 py-3.5"><Badge status={b.status as 'paid' | 'pending' | 'due'}/></td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5">
                          {(b.status === 'pending' || b.status === 'due') && (
                            <button onClick={() => setApproveModal(b.school)} className="h-7 px-2.5 rounded-[7px] text-[11px] font-semibold bg-success/12 text-success-fg border border-success/50 hover:bg-success/20 flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" strokeWidth={1.5}/>Approve
                            </button>
                          )}
                          <button className="h-7 px-2.5 rounded-[7px] text-[11px] font-semibold border border-border-default text-fg-muted hover:text-fg flex items-center gap-1">
                            <Download className="w-3 h-3" strokeWidth={1.5}/>Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Feature Flags ── */}
        {activeTab === 'flags' && (
          <div className="space-y-4 max-w-2xl">
            <p className="text-sm text-fg-muted">Global feature toggles by plan. Changes apply to all schools on the respective plan.</p>
            <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
              {featureFlags.map((f, i) => (
                <div key={f.feature} className={`flex items-center gap-4 px-5 py-4 ${i < featureFlags.length - 1 ? 'border-b border-border' : ''}`}>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-fg">{f.feature}</p>
                    <div className="flex gap-1 mt-1">
                      {f.plans.map(p => (
                        <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-elevated text-fg-muted font-semibold">{p}</span>
                      ))}
                    </div>
                  </div>
                  <Toggle checked={flags[f.feature]} onChange={v => setFlags(prev => ({ ...prev, [f.feature]: v }))}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Domains ── */}
        {activeTab === 'domains' && (
          <div className="bg-surface border border-border-default rounded-[8px] overflow-hidden">
            <div className="px-5 py-4 border-b border-border-strong">
              <h2 className="font-display font-semibold text-[14px] text-fg">Domain Registry</h2>
            </div>
            {[
              { school: 'Delhi Public School', domain: 'dps-delhi.edu.in',  status: 'verified'   as const, ssl: true,  exp: '12 Dec 2025' },
              { school: 'St. Xavier\'s',       domain: 'stxaviers.edu.in',  status: 'verified'   as const, ssl: true,  exp: '5 Feb 2026' },
              { school: 'Springdale Academy',  domain: '—',                 status: 'pending'    as const, ssl: false, exp: '—' },
              { school: 'Holy Cross',          domain: 'holycross.edu.in',  status: 'expired'    as const, ssl: false, exp: '1 Nov 2024' },
            ].map((d, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-border last:border-0 hover:bg-elevated/20 transition-colors">
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-fg">{d.school}</p>
                  <p className="font-mono text-[11px] text-fg-muted mt-0.5">{d.domain}</p>
                </div>
                <div className="flex items-center gap-2">
                  {d.ssl && <span className="text-[10px] px-2 py-0.5 rounded-full bg-success/12 text-success-fg font-semibold">SSL</span>}
                  <span className="text-[11px] text-fg-muted tabular-nums">Exp: {d.exp}</span>
                </div>
                <Badge status={d.status === 'verified' ? 'active' : d.status as 'pending' | 'expired'}/>
                <button className="h-7 px-2.5 rounded-[7px] text-[11px] font-semibold border border-border-default text-fg-muted hover:text-fg flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" strokeWidth={1.5}/>Manage
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Usage ── */}
        {activeTab === 'usage' && (
          <div className="grid grid-cols-2 gap-5 max-w-3xl">
            {[
              { label: 'Total Students', value: 5840, max: 10000, unit: 'students', color: '#1F4D3A' },
              { label: 'Storage Used', value: 42, max: 100, unit: 'GB', color: '#2E9E6B' },
              { label: 'SMS Credits Used', value: 1240, max: 5000, unit: 'SMS', color: '#D9A23A' },
              { label: 'API Calls (Dec)', value: 84200, max: 100000, unit: 'calls', color: '#46574E' },
            ].map(item => (
              <div key={item.label} className="bg-surface border border-border-default rounded-[8px] p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[12px] font-semibold text-fg-muted">{item.label}</p>
                  <span className="font-mono tabular-nums text-[12px] text-fg-muted">{item.value.toLocaleString()} / {item.max.toLocaleString()}</span>
                </div>
                <p className="font-display font-semibold text-2xl text-fg tabular-nums mb-3">{item.value.toLocaleString()} <span className="text-sm font-normal text-fg-muted">{item.unit}</span></p>
                <div className="h-1.5 bg-elevated rounded-full overflow-hidden">
                  <div className="h-full rounded-full animate-progress" style={{ '--target-width': `${(item.value / item.max) * 100}%`, width: `${(item.value / item.max) * 100}%`, background: item.color } as React.CSSProperties}/>
                </div>
                <p className="text-[11px] text-fg-muted mt-1.5">{Math.round((item.value / item.max) * 100)}% used</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Alerts ── */}
        {activeTab === 'alerts' && (
          <div className="space-y-3 max-w-2xl">
            {[
              { type: 'error',   msg: 'Holy Cross Convent subscription overdue by 47 days. Access will be suspended.',      time: 'Now' },
              { type: 'warning', msg: 'Bright Future School subscription expired. 5 days before auto-suspension.',          time: '2 hr ago' },
              { type: 'warning', msg: 'Storage usage at 84% for St. Xavier\'s. Consider upgrading storage add-on.',        time: 'Yesterday' },
              { type: 'info',    msg: 'Springdale Academy has not connected a custom domain. Remind them.',                  time: '3 days ago' },
              { type: 'success', msg: 'SSL certificate auto-renewed for dps-delhi.edu.in.',                                 time: '5 days ago' },
            ].map((a, i) => {
              const iconMap = { error: <AlertTriangle className="w-4 h-4 text-error-fg" strokeWidth={1.5}/>, warning: <AlertTriangle className="w-4 h-4 text-warning-fg" strokeWidth={1.5}/>, info: <Bell className="w-4 h-4 text-brand" strokeWidth={1.5}/>, success: <CheckCircle className="w-4 h-4 text-success-fg" strokeWidth={1.5}/> };
              const bgMap   = { error: 'border-error/50', warning: 'border-warning/50', info: 'border-brand/50', success: 'border-success/50' };
              return (
                <div key={i} className={`bg-surface border ${bgMap[a.type as keyof typeof bgMap]} rounded-[8px] p-4 flex items-start gap-3`}>
                  <div className="shrink-0 mt-0.5">{iconMap[a.type as keyof typeof iconMap]}</div>
                  <p className="text-[13px] text-fg flex-1 leading-relaxed">{a.msg}</p>
                  <span className="text-[11px] text-fg-muted shrink-0 tabular-nums">{a.time}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Approve payment modal */}
      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(15,31,24,0.85)', backdropFilter: 'blur(12px)' }}>
          <div className="bg-surface border border-border-default rounded-[20px] p-6 w-full max-w-sm animate-scale-up">
            <h3 className="font-display font-semibold text-[16px] text-fg mb-1">Approve Payment</h3>
            <p className="text-[12px] text-fg-muted mb-4">{approveModal}</p>
            <Input label="UTR Number" placeholder="12-digit transaction reference" />
            <div className="flex gap-3 mt-5">
              <Button variant="secondary" className="flex-1" onClick={() => setApproveModal(null)}>Cancel</Button>
              <Button className="flex-1" onClick={() => setApproveModal(null)}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
