import React from 'react';
import { Card } from '@/components/ui/Card';

export default function ActivitiesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Student Life</span>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mt-1">Activities & Achievements</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">Achievement</span>
          <h3 className="font-display font-bold text-base text-[var(--text-primary)] mt-2 mb-1">State Science Fair 1st Prize</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Our Class X team bagged the top award for their solar-powered water filtration prototype.</p>
        </Card>

        <Card>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">Co-Curricular</span>
          <h3 className="font-display font-bold text-base text-[var(--text-primary)] mt-2 mb-1">Annual Cultural Fest</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">Inter-house music, dance, and traditional Mizo cultural performances.</p>
        </Card>
      </div>
    </div>
  );
}
