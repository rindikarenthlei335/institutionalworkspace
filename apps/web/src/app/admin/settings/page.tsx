import React from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Configuration</span>
        <h1 className="font-display font-bold text-2xl text-[var(--text-primary)]">School Settings & Domain</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="space-y-4">
          <h3 className="font-display font-semibold text-sm text-[var(--brand-primary)] border-b border-[var(--border-subtle)] pb-2">
            School Profile & Branding
          </h3>
          <Input label="School Name" defaultValue="Mount Carmel Higher Secondary School" />
          <Input label="Tagline" defaultValue="Excellence in Education & Character" />
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">Theme Preset</label>
            <select className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)]" defaultValue="forest">
              <option value="forest">Forest Green (Default)</option>
              <option value="ocean">Ocean Blue</option>
              <option value="maroon">Royal Maroon</option>
            </select>
          </div>
          <Button variant="primary">Save Branding Settings</Button>
        </Card>

        {/* TODO(design): Custom Domain Setup & CNAME/TXT DNS Verifier Page */}
        <Card className="space-y-4">
          <h3 className="font-display font-semibold text-sm text-[var(--brand-primary)] border-b border-[var(--border-subtle)] pb-2">
            Domain Settings
          </h3>
          <div className="space-y-1.5 text-xs">
            <span className="text-[var(--text-secondary)] block">Free Subdomain:</span>
            <span className="font-mono font-semibold text-[var(--brand-primary)]">mountcarmel.eduportal.com</span>
          </div>

          <div className="border-t border-[var(--border-subtle)] pt-3 space-y-3">
            <h4 className="font-semibold text-xs text-[var(--text-primary)]">Connect Custom Domain</h4>
            <Input placeholder="e.g. www.mountcarmelschool.com" />
            <Button variant="secondary" size="sm">Connect Custom Hostname</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
