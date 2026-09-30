'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Globe, CheckCircle2, RefreshCw } from 'lucide-react';

export function DomainSettingsForm() {
  const [customDomain, setCustomDomain] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [connectedDomain, setConnectedDomain] = useState<string | null>(null);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    setTimeout(() => {
      setConnectedDomain(customDomain);
      setConnecting(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Free Subdomain Status */}
      <Card className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--brand-primary)]" />
            <h4 className="font-display font-semibold text-xs text-[var(--text-primary)]">Free Automatic Subdomain</h4>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--status-success)]/15 text-[var(--status-success)] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Active
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">Your school website is published on your automatic subdomain:</p>
        <div className="p-2.5 rounded bg-[var(--bg-elevated)] text-xs font-mono font-semibold text-[var(--brand-primary)]">
          https://mountcarmel.eduportal.com
        </div>
      </Card>

      {/* Own Domain Connect */}
      {/* TODO(design): Custom Domain Setup & CNAME/TXT DNS Verifier Page */}
      <Card className="space-y-4">
        <div className="border-b border-[var(--border-subtle)] pb-2">
          <h4 className="font-display font-semibold text-sm text-[var(--text-primary)]">Connect Own Custom Domain</h4>
          <p className="text-xs text-[var(--text-secondary)]">Link your school domain (e.g. www.mountcarmelschool.com) via Cloudflare for SaaS.</p>
        </div>

        {connectedDomain ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded border border-[var(--status-success)] bg-[var(--status-success)]/10 text-xs">
              <div>
                <span className="font-semibold text-[var(--text-primary)]">Custom Domain Configured:</span>
                <p className="font-mono text-[var(--brand-primary)] mt-0.5">{connectedDomain}</p>
              </div>
              <Button size="sm" variant="secondary" icon={<RefreshCw className="w-3.5 h-3.5" />}>
                Verify DNS
              </Button>
            </div>

            <div className="p-3 bg-[var(--bg-elevated)] rounded space-y-2 text-xs">
              <span className="font-semibold text-[var(--text-primary)]">Required DNS Records:</span>
              <div className="font-mono text-[11px] space-y-1 text-[var(--text-secondary)]">
                <p>CNAME {connectedDomain} → custom.eduportal.com</p>
                <p>TXT _cf-custom-hostname.{connectedDomain} → cf-validation-token-12345</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConnect} className="space-y-3">
            <Input
              label="Custom Domain Name"
              placeholder="www.mountcarmelschool.com"
              required
              value={customDomain}
              onChange={e => setCustomDomain(e.target.value)}
            />
            <Button variant="primary" size="sm" loading={connecting} type="submit">
              Connect Domain & Generate DNS Records
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
