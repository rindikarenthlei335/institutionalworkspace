import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">CMS Manager</span>
          <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Website Content</h1>
        </div>
        <Button variant="primary">Add New Item</Button>
      </div>

      <Card>
        <div className="border-b border-[var(--border-subtle)] pb-3 mb-4 flex gap-4 text-xs font-semibold text-[var(--text-secondary)]">
          <span className="text-[var(--brand-primary)] border-b-2 border-[var(--brand-primary)] pb-3">Notices</span>
          <span>Faculty & Staff</span>
          <span>Facilities</span>
          <span>Gallery Albums</span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border-default)] text-[var(--text-secondary)]">
              <th className="py-2">Title</th>
              <th className="py-2">Category</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            <tr>
              <td className="py-3 font-semibold text-[var(--text-primary)]">Annual Sports Meet 2025</td>
              <td className="py-3">Event</td>
              <td className="py-3 tabular-nums">15 Dec 2024</td>
              <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--status-success)]/15 text-[var(--status-success)]">Published</span></td>
              <td className="py-3 text-right">Edit · Delete</td>
            </tr>
            <tr>
              <td className="py-3 font-semibold text-[var(--text-primary)]">Winter Vacation Schedule</td>
              <td className="py-3">Holiday</td>
              <td className="py-3 tabular-nums">12 Dec 2024</td>
              <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--status-success)]/15 text-[var(--status-success)]">Published</span></td>
              <td className="py-3 text-right">Edit · Delete</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </div>
  );
}
