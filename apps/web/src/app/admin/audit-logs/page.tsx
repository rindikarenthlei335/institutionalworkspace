import React from 'react';
import { Card } from '@/components/ui/Card';

export default function AuditLogsPage() {
  const logs = [
    { time: '2024-12-14 10:24:00', user: 'Principal Lalthantluanga', action: 'UPDATE_SETTING', table: 'site_settings', detail: 'Updated school tagline' },
    { time: '2024-12-14 09:12:00', user: 'Accountant Sunita', action: 'APPROVE_PAYMENT', table: 'payments', detail: 'Collected ₹12,400 via UPI (REC-2024-00102)' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Security & Compliance</span>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Audit Logs</h1>
      </div>

      <Card>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-default)] text-[var(--text-secondary)]">
              <th className="py-2">Timestamp</th>
              <th className="py-2">User / Actor</th>
              <th className="py-2">Action</th>
              <th className="py-2">Target Table</th>
              <th className="py-2">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {logs.map((log, i) => (
              <tr key={i}>
                <td className="py-3 font-mono text-[11px] tabular-nums">{log.time}</td>
                <td className="py-3 font-semibold text-[var(--text-primary)]">{log.user}</td>
                <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] font-semibold">{log.action}</span></td>
                <td className="py-3 font-mono text-[11px]">{log.table}</td>
                <td className="py-3 text-[var(--text-secondary)]">{log.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
