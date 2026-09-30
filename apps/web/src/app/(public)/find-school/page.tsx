'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function FindSchoolPage() {
  const [code, setCode] = useState('');

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = code.toLowerCase().trim();
    if (slug) {
      window.location.href = `http://${slug}.localhost:3000`;
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">Find Your School</h1>
        <p className="text-xs text-[var(--text-secondary)]">Enter your school code or subdomain to access your portal</p>
      </div>

      <Card>
        <form onSubmit={handleGo} className="space-y-4">
          <Input
            label="School Code / Subdomain"
            placeholder="e.g. mountcarmel or stmarys"
            required
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <Button variant="primary" type="submit" className="w-full">
            Go to School Portal →
          </Button>
        </form>
      </Card>

      <div className="p-4 bg-[var(--bg-elevated)] rounded-[8px] text-center space-y-2 text-xs">
        <span className="font-semibold text-[var(--text-primary)]">Demo Schools:</span>
        <div className="flex justify-center gap-4 text-[var(--brand-primary)] font-semibold">
          <a href="/?tenant=mountcarmel">Mount Carmel School</a>
          <a href="/?tenant=stmarys">St Marys School</a>
        </div>
      </div>
    </div>
  );
}
