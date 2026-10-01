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

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
                <th className="p-3">Timestamp</th>
                <th className="p-3">User / Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target Table</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-[var(--bg-elevated)]/50">
                  <td className="p-3 font-mono text-[11px] tabular-nums">{log.time}</td>
                  <td className="p-3 font-semibold text-[var(--text-primary)]">{log.user}</td>
                  <td className="p-3"><span className="px-2 py-0.5 rounded text-[10px] bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] font-semibold">{log.action}</span></td>
                  <td className="p-3 font-mono text-[11px]">{log.table}</td>
                  <td className="p-3 text-[var(--text-secondary)]">{log.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
