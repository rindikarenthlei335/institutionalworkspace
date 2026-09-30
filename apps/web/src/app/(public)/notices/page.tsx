import React from 'react';
import { Card } from '@/components/ui/Card';

export default function NoticesPage() {
  const notices = [
    { title: 'Annual Sports Meet 2025', date: 'Dec 15, 2024', cat: 'Event', pinned: true, body: 'The Annual Sports Meet will be held on December 15th at the main ground. All students must assemble by 8:30 AM.' },
    { title: 'Winter Vacation Schedule', date: 'Dec 12, 2024', cat: 'Holiday', pinned: false, body: 'School will remain closed for winter break from Dec 22 to Jan 10.' },
    { title: 'Term 2 Fee Due Reminder', date: 'Nov 30, 2024', cat: 'Finance', pinned: false, body: 'Parents are requested to clear all outstanding Term 2 fees before Dec 10th to avoid late fee penalties.' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Notice Board</span>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mt-1">Official Circulars</h1>
      </div>

      <div className="space-y-4">
        {notices.map((n, i) => (
          <Card key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                  {n.cat}
                </span>
                {n.pinned && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--status-warning)]/15 text-[var(--status-warning)]">
                    Pinned
                  </span>
                )}
                <span className="text-[11px] text-[var(--text-secondary)] tabular-nums">{n.date}</span>
              </div>
              <h3 className="font-display font-semibold text-base text-[var(--text-primary)]">{n.title}</h3>
              <p className="text-xs text-[var(--text-secondary)]">{n.body}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
