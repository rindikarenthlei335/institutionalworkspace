import React from 'react';
import { Card } from '@/components/ui/Card';

export default function PortalNoticesPage() {
  return (
    <div className="space-y-4">
      <h2 className="font-display font-bold text-lg text-[var(--text-primary)]">School Circulars</h2>
      <Card className="space-y-1">
        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">Event</span>
        <h3 className="font-display font-bold text-sm text-[var(--text-primary)]">Annual Sports Meet 2025</h3>
        <p className="text-xs text-[var(--text-secondary)]">All students must assemble at the main ground by 8:30 AM on Dec 15th.</p>
      </Card>
    </div>
  );
}
