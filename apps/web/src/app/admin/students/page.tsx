import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminStudentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Academics</span>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Student Management</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">Import CSV</Button>
          <Button variant="primary">Add Student</Button>
        </div>
      </div>

      <Card>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-default)] text-[var(--text-secondary)]">
              <th className="py-2">Admission No</th>
              <th className="py-2">Student Name</th>
              <th className="py-2">Class & Section</th>
              <th className="py-2">Residence</th>
              <th className="py-2">Guardian Phone</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            <tr>
              <td className="py-3 font-mono font-semibold">ADM-2024-0014</td>
              <td className="py-3 font-semibold text-[var(--text-primary)]">Aarav Sharma</td>
              <td className="py-3">Class VIII - A</td>
              <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] bg-[var(--bg-elevated)] font-semibold">Day</span></td>
              <td className="py-3 font-mono">+91 98765 11111</td>
              <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--status-success)]/15 text-[var(--status-success)]">Active</span></td>
            </tr>
            <tr>
              <td className="py-3 font-mono font-semibold">ADM-2024-0015</td>
              <td className="py-3 font-semibold text-[var(--text-primary)]">Riya Patel</td>
              <td className="py-3">Class VIII - B</td>
              <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] font-semibold">Hosteller</span></td>
              <td className="py-3 font-mono">+91 98765 22222</td>
              <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--status-success)]/15 text-[var(--status-success)]">Active</span></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
