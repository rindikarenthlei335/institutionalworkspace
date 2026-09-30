import React from 'react';
import { Card } from '@/components/ui/Card';

export default function FacilitiesPage() {
  const items = [
    { title: 'Computer & AI Lab', desc: '40 high-speed desktop systems with high-speed internet & coding software.' },
    { title: 'Science Laboratories', desc: 'Fully equipped Physics, Chemistry & Biology practical labs.' },
    { title: 'Library & E-Resources', desc: 'Over 10,000 books, digital archives, and quiet study spaces.' },
    { title: 'Sports Arena', desc: 'Basketball court, football ground, and indoor badminton court.' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Campus Infrastructure</span>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mt-1">Our Facilities</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item, i) => (
          <Card key={i}>
            <h3 className="font-display font-bold text-base text-[var(--brand-primary)] mb-2">{item.title}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
