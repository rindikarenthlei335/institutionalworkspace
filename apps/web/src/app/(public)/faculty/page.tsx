import React from 'react';
import { Card } from '@/components/ui/Card';

export default function FacultyPage() {
  const members = [
    { name: 'Dr. Lalthantluanga', designation: 'Principal', qualification: 'Ph.D. in Physics', experience: '18 Years' },
    { name: 'Ms. Sunita Kapoor', designation: 'Headmistress', qualification: 'M.A., M.Ed.', experience: '12 Years' },
    { name: 'Mr. Robert Singh', designation: 'Senior Math Teacher', qualification: 'M.Sc. Mathematics', experience: '10 Years' },
    { name: 'Mrs. Emily Vanlalruati', designation: 'Science Teacher', qualification: 'M.Sc. Chemistry', experience: '8 Years' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Academic Staff</span>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mt-1">Faculty & Leadership</h1>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        {members.map((f, i) => (
          <Card key={i} className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-primary-soft)] text-[var(--brand-primary)] font-display font-bold text-xl flex items-center justify-center mx-auto">
              {f.name.split(' ').map(n => n[0]).join('')}
            </div>
            <h3 className="font-display font-semibold text-sm text-[var(--text-primary)]">{f.name}</h3>
            <p className="text-xs font-semibold text-[var(--brand-primary)]">{f.designation}</p>
            <p className="text-[11px] text-[var(--text-secondary)]">{f.qualification}</p>
            <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-[var(--bg-elevated)] text-[var(--text-secondary)] font-medium">
              Exp: {f.experience}
            </span>
          </Card>
        ))}
      </div>
    </div>
  );
}
