'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { UILevel2Card } from './UILevel2Card';
import { FeeDefaulterItem, ClassDuesSummary } from '../types';

export function PrincipalDashboardView() {
  const [sessionYear, setSessionYear] = useState('2024-2025');
  const [reminderSentMap, setReminderSentMap] = useState<Record<string, boolean>>({});
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const [defaulters, setDefaulters] = useState<FeeDefaulterItem[]>([
    { studentId: 'S-101', admissionNo: 'ADM-2024-0012', studentName: 'Lalthantluanga Sailo', className: 'Class 10-A', parentPhone: '+91 98621 11223', dueAmount: 14500, monthsOverdue: 2 },
    { studentId: 'S-104', admissionNo: 'ADM-2024-0045', studentName: 'Zomingthanga Pachuau', className: 'Class 12-B', parentPhone: '+91 94361 88772', dueAmount: 22000, monthsOverdue: 3 },
    { studentId: 'S-109', admissionNo: 'ADM-2024-0089', studentName: 'Rodingliana Fanai', className: 'Class 9-C', parentPhone: '+91 98623 44556', dueAmount: 9800, monthsOverdue: 1 },
    { studentId: 'S-112', admissionNo: 'ADM-2024-0112', studentName: 'Vanlalruati Ralte', className: 'Class 11-A', parentPhone: '+91 98625 66778', dueAmount: 18200, monthsOverdue: 2 }
  ]);

  const classDues: ClassDuesSummary[] = [
    { className: 'Class 10th', totalStudents: 140, paidCount: 112, unpaidCount: 28, totalDueAmount: 406000, collectionRatePct: 80 },
    { className: 'Class 12th', totalStudents: 120, paidCount: 84, unpaidCount: 36, totalDueAmount: 540000, collectionRatePct: 70 },
    { className: 'Class 9th', totalStudents: 150, paidCount: 135, unpaidCount: 15, totalDueAmount: 147000, collectionRatePct: 90 },
    { className: 'Class 11th', totalStudents: 130, paidCount: 98, unpaidCount: 32, totalDueAmount: 384000, collectionRatePct: 75 }
  ];

  const monthlyTrends = [
    { month: 'Jul', collected: 24, target: 25 },
    { month: 'Aug', collected: 26, target: 25 },
    { month: 'Sep', collected: 22, target: 25 },
    { month: 'Oct', collected: 28, target: 25 },
    { month: 'Nov', collected: 27, target: 25 },
    { month: 'Dec', collected: 28.4, target: 25 }
  ];

  const handleSendReminder = (studentId: string, studentName: string) => {
    setReminderSentMap(prev => ({ ...prev, [studentId]: true }));
    setTimeout(() => {
      alert(`Fee payment reminder sent successfully to ${studentName}'s parent via WhatsApp/SMS!`);
    }, 100);
  };

  const handleExportReport = () => {
    setExportMessage('Generating executive PDF & CSV summary report...');
    setTimeout(() => {
      setExportMessage('✓ Executive report downloaded successfully!');
      setTimeout(() => setExportMessage(null), 4000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <span className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider">Executive Overview · Pro Plan</span>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Principal Dashboard</h1>
          <p className="text-xs text-[var(--text-secondary)]">Mount Carmel Higher Secondary School · Academic Session {sessionYear}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-36">
            <Select
              label=""
              value={sessionYear}
              onChange={(e) => setSessionYear(e.target.value)}
              options={[
                { value: '2024-2025', label: '2024–2025' },
                { value: '2023-2024', label: '2023–2024' }
              ]}
            />
          </div>
          <Button variant="primary" size="sm" onClick={handleExportReport}>
            📄 Export Report
          </Button>
        </div>
      </div>

      {exportMessage && (
        <div className="p-3 bg-[var(--status-success)]/10 text-[var(--status-success)] border border-[var(--status-success)]/30 rounded-lg text-xs font-semibold animate-in fade-in">
          {exportMessage}
        </div>
      )}

      {/* Level 2 Interactive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <UILevel2Card
          label="Total Enrolled Students"
          value={1840}
          change="+32 this month"
          trend="up"
          drilldown={{
            title: 'Student Population Breakdown',
            items: [
              { label: 'Day Scholars', value: '1,420 (77%)', subtext: 'Regular day school attendance' },
              { label: 'Hostellers', value: '420 (23%)', subtext: 'Resident hostel accommodation' },
              { label: 'Boys Ratio', value: '940 (51%)', subtext: 'Male students' },
              { label: 'Girls Ratio', value: '900 (49%)', subtext: 'Female students' }
            ]
          }}
        />

        <UILevel2Card
          label="Fee Collected (Dec)"
          value={2840000}
          prefix="₹ "
          change="+18% vs target"
          trend="up"
          drilldown={{
            title: 'Collection Channel Breakdown',
            items: [
              { label: 'Online Gateway (UPI/NetBanking)', value: '₹ 18,40,000 (65%)', subtext: 'Razorpay Instant Settlement' },
              { label: 'Counter Cash Collection', value: '₹ 7,20,000 (25%)', subtext: 'Accountant Receipt Desk' },
              { label: 'Cheque / Demand Draft', value: '₹ 2,80,000 (10%)', subtext: 'Cleared in Bank' }
            ]
          }}
        />

        <UILevel2Card
          label="Total Outstanding Dues"
          value={1477000}
          prefix="₹ "
          change="111 Defaulters"
          trend="warn"
          drilldown={{
            title: 'Outstanding Dues by Class',
            items: [
              { label: 'Class 12th Higher Sec', value: '₹ 5,40,000', subtext: '36 unpaid students' },
              { label: 'Class 10th Board Sec', value: '₹ 4,06,000', subtext: '28 unpaid students' },
              { label: 'Class 11th Stream Sec', value: '₹ 3,84,000', subtext: '32 unpaid students' },
              { label: 'Class 9th Junior Sec', value: '₹ 1,47,000', subtext: '15 unpaid students' }
            ]
          }}
        />

        <UILevel2Card
          label="New Admissions"
          value={74}
          change="30% conversion rate"
          trend="up"
          drilldown={{
            title: 'New Admissions by Stream',
            items: [
              { label: 'Class 11 Science', value: '28 Students', subtext: 'Physics/Chem/Maths/Bio' },
              { label: 'Class 11 Arts / Comm', value: '22 Students', subtext: 'Humanities & Commerce' },
              { label: 'Junior School (KG - Class 5)', value: '24 Students', subtext: 'Primary Admissions' }
            ]
          }}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Fee Collection SVG/CSS Chart */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Monthly Collection vs Target</h3>
              <p className="text-xs text-[var(--text-secondary)]">Figures in Lakhs (₹)</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[var(--brand-primary)] rounded-sm"></span> Collected</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[var(--border-subtle)] rounded-sm"></span> Target</span>
            </div>
          </div>
          <div className="h-52 flex items-end justify-between gap-3 pt-6 border-b border-[var(--border-subtle)] pb-2">
            {monthlyTrends.map((t, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono text-[var(--text-secondary)] opacity-0 group-hover:opacity-100 transition-opacity">
                  ₹{t.collected}L
                </div>
                <div className="w-full max-w-[28px] bg-[var(--bg-subtle)] rounded-t flex items-end h-40 relative">
                  <div
                    className="w-full bg-[var(--brand-primary)] rounded-t transition-all group-hover:brightness-110"
                    style={{ height: `${(t.collected / 30) * 100}%` }}
                  />
                  {/* Target line indicator */}
                  <div
                    className="absolute w-full border-b-2 border-dashed border-[var(--text-tertiary)]"
                    style={{ bottom: `${(t.target / 30) * 100}%` }}
                    title={`Target: ₹${t.target}L`}
                  />
                </div>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">{t.month}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Admission Funnel */}
        <Card>
          <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-4">Admission Conversion Funnel</h3>
          <div className="space-y-3">
            {[
              { label: '1. Applications Received', count: 248, pct: '100%' },
              { label: '2. Documents Verified', count: 186, pct: '75%' },
              { label: '3. Interview Scheduled', count: 124, pct: '50%' },
              { label: '4. Admission Approved', count: 87, pct: '35%' },
              { label: '5. Fee Paid & Enrolled', count: 74, pct: '30%' }
            ].map((step, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-[var(--text-primary)]">{step.label}</span>
                  <span className="font-mono text-[var(--brand-primary)]">{step.count} ({step.pct})</span>
                </div>
                <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--brand-primary)] rounded-full" style={{ width: step.pct }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Class Dues Breakdown & Actionable Defaulter Table */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Class Dues Summary */}
        <Card>
          <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-4">Class Dues Collection Rates</h3>
          <div className="space-y-4">
            {classDues.map((c, i) => (
              <div key={i} className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-subtle)] space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[var(--text-primary)]">{c.className}</span>
                  <span className="font-mono text-xs font-semibold text-[var(--status-danger)]">
                    Due: ₹ {c.totalDueAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-[var(--text-secondary)]">
                  <span>{c.paidCount} / {c.totalStudents} Paid ({c.collectionRatePct}%)</span>
                  <span>{c.unpaidCount} Pending</span>
                </div>
                <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${c.collectionRatePct >= 80 ? 'bg-[var(--status-success)]' : 'bg-[var(--status-warning)]'}`}
                    style={{ width: `${c.collectionRatePct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Actionable Fee Defaulters List */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Critical Fee Defaulters</h3>
            <span className="text-xs font-semibold text-[var(--status-danger)] bg-[var(--status-danger)]/10 px-2.5 py-1 rounded-full">
              4 Critical Overdue
            </span>
          </div>
          <div className="space-y-3">
            {defaulters.map((item) => (
              <div key={item.studentId} className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[var(--text-primary)]">{item.studentName}</span>
                    <span className="text-[10px] font-mono text-[var(--text-tertiary)]">{item.className}</span>
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Parent: {item.parentPhone} · <span className="text-[var(--status-danger)] font-semibold">{item.monthsOverdue} mo overdue</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[var(--border-subtle)]">
                  <span className="font-mono font-bold text-xs text-[var(--status-danger)]">
                    ₹ {item.dueAmount.toLocaleString('en-IN')}
                  </span>
                  <Button
                    variant={reminderSentMap[item.studentId] ? 'secondary' : 'primary'}
                    size="sm"
                    disabled={reminderSentMap[item.studentId]}
                    onClick={() => handleSendReminder(item.studentId, item.studentName)}
                  >
                    {reminderSentMap[item.studentId] ? '✓ Reminder Sent' : '📲 Send Reminder'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
