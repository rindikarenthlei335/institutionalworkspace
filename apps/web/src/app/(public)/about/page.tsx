import React from 'react';
import { Card } from '@/components/ui/Card';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">About Us</span>
        <h1 className="font-display font-bold text-3xl text-[var(--text-primary)] mt-1">Our Mission & Vision</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-display font-bold text-lg text-[var(--brand-primary)] mb-2">Mission Statement</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            To provide comprehensive education that integrates academic rigor, moral values, physical well-being, and social responsibility to prepare students for leadership in a dynamic world.
          </p>
        </Card>

        <Card>
          <h3 className="font-display font-bold text-lg text-[var(--brand-primary)] mb-2">Vision for Excellence</h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            To be a premier institution recognized for empowering students with knowledge, critical thinking, creativity, and empathy.
          </p>
        </Card>
      </div>
    </div>
  );
}
