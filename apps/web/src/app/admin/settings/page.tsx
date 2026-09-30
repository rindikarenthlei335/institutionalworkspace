'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StorageMeter } from '@/features/settings/components/StorageMeter';
import { ThemeSelector } from '@/features/settings/components/ThemeSelector';
import { DomainSettingsForm } from '@/features/settings/components/DomainSettingsForm';

export default function AdminSettingsPage() {
  const [selectedPreset, setSelectedPreset] = useState('forest');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Configuration</span>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">School Settings & Domain</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Branding & Profile Form */}
        <Card className="space-y-4">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="font-display font-semibold text-sm text-[var(--brand-primary)] border-b border-[var(--border-subtle)] pb-2">
              Branding & SEO Settings
            </h3>
            <Input label="School Name" defaultValue="Mount Carmel Higher Secondary School" required />
            <Input label="Tagline" defaultValue="Excellence in Education & Character" />
            
            <ThemeSelector selectedPreset={selectedPreset} onSelect={setSelectedPreset} />

            <Input label="Contact Email" type="email" defaultValue="info@mountcarmel.edu.in" required />
            <Input label="Contact Phone" defaultValue="+91 98765 43210" />

            {saved && (
              <p className="text-xs font-semibold text-[var(--status-success)]">
                ✓ Branding settings saved successfully!
              </p>
            )}

            <Button variant="primary" type="submit" className="w-full">
              Save Branding & Theme
            </Button>
          </form>
        </Card>

        {/* Domain & Storage Meter */}
        <div className="space-y-6">
          <StorageMeter usedBytes={420 * 1024 * 1024} limitBytes={5 * 1024 * 1024 * 1024} />
          <DomainSettingsForm />
        </div>
      </div>
    </div>
  );
}
