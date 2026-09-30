'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CustomDomainConfig } from '../types';
import { CheckCircle2, AlertTriangle, RefreshCw, Copy, Check, Globe, HelpCircle } from 'lucide-react';

export function ConnectDomainCard() {
  const [inputHostname, setInputHostname] = useState('');
  const [connecting, setConnecting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [apexWarning, setApexWarning] = useState<string | null>(null);

  const [domainConfig, setDomainConfig] = useState<CustomDomainConfig | null>({
    hostname: 'www.mountcarmelschool.com',
    status: 'active',
    cnameRecord: {
      type: 'CNAME',
      name: 'www.mountcarmelschool.com',
      value: 'custom.eduportal.com',
      purpose: 'Points web traffic to the EduPortal platform edge'
    },
    txtRecord: {
      type: 'TXT',
      name: '_cf-custom-hostname.www.mountcarmelschool.com',
      value: 'cf-validation-token-9b348d2',
      purpose: 'Proves domain ownership to Cloudflare for SaaS'
    },
    verifiedAt: '2024-11-15T10:30:00Z'
  });

  const handleInputChange = (val: string) => {
    setInputHostname(val);
    const cleaned = val.trim().toLowerCase();
    // Check if apex domain without www or subdomain
    if (cleaned && !cleaned.includes('.') && cleaned.length > 2) {
      setApexWarning(null);
    } else if (cleaned && cleaned.split('.').length === 2) {
      setApexWarning(`For best reliability with DNS providers, we recommend using "www.${cleaned}" instead of the apex domain.`);
    } else {
      setApexWarning(null);
    }
  };

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    setTimeout(() => {
      const target = inputHostname.trim().toLowerCase();
      setDomainConfig({
        hostname: target,
        status: 'pending',
        cnameRecord: {
          type: 'CNAME',
          name: target,
          value: 'custom.eduportal.com',
          purpose: 'Points web traffic to the EduPortal platform edge'
        },
        txtRecord: {
          type: 'TXT',
          name: `_cf-custom-hostname.${target}`,
          value: `cf-validation-${Math.random().toString(36).substring(2, 9)}`,
          purpose: 'Proves domain ownership to Cloudflare for SaaS'
        }
      });
      setConnecting(false);
    }, 700);
  };

  const handleVerify = () => {
    if (!domainConfig) return;
    setVerifying(true);
    setTimeout(() => {
      setDomainConfig({
        ...domainConfig,
        status: 'active',
        verifiedAt: new Date().toISOString(),
        errorMessage: undefined
      });
      setVerifying(false);
    }, 1200);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDisconnect = () => {
    if (confirm('Are you sure you want to disconnect this custom domain? Your school will remain accessible on your free subdomain.')) {
      setDomainConfig(null);
      setInputHostname('');
    }
  };

  return (
    <Card className="space-y-5">
      <div className="flex justify-between items-start border-b border-[var(--border-subtle)] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[var(--brand-primary)]" />
            <h4 className="font-display font-semibold text-sm text-[var(--text-primary)]">Connect Own Custom Domain</h4>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Point your own registered domain (e.g. www.mountcarmelschool.com) using Cloudflare for SaaS SSL.
          </p>
        </div>

        {domainConfig && (
          <span
            className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1.5 ${
              domainConfig.status === 'active'
                ? 'bg-[var(--status-success)]/15 text-[var(--status-success)]'
                : domainConfig.status === 'verifying'
                ? 'bg-amber-500/15 text-amber-500'
                : 'bg-[var(--bg-elevated)] text-[var(--text-secondary)]'
            }`}
          >
            {domainConfig.status === 'active' ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> DNS Verified & Active
              </>
            ) : domainConfig.status === 'verifying' ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying DNS...
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" /> Pending DNS Setup
              </>
            )}
          </span>
        )}
      </div>

      {domainConfig ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)] gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase text-[var(--text-tertiary)]">Linked Hostname</span>
              <div className="font-mono text-sm font-bold text-[var(--brand-primary)]">{domainConfig.hostname}</div>
              {domainConfig.verifiedAt && (
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  SSL Certificate active via Cloudflare Universal SSL
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                loading={verifying}
                onClick={handleVerify}
                icon={<RefreshCw className="w-3 h-3" />}
              >
                Re-verify DNS
              </Button>
              <Button size="sm" variant="ghost" className="text-[var(--status-danger)] hover:bg-[var(--status-danger)]/10" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          </div>

          {/* DNS Instructions Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[var(--text-primary)]">Add these 2 DNS Records at your domain registrar (GoDaddy, Namecheap, etc.):</span>
            </div>

            <div className="border border-[var(--border-subtle)] rounded-lg overflow-hidden text-xs">
              {/* CNAME */}
              <div className="p-3 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--brand-primary)] text-white">CNAME</span>
                    <span className="font-semibold text-[var(--text-primary)]">{domainConfig.cnameRecord.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[11px] px-2"
                    onClick={() => handleCopy(domainConfig.cnameRecord.value, 'cname')}
                  >
                    {copiedKey === 'cname' ? <Check className="w-3 h-3 text-[var(--status-success)]" /> : <Copy className="w-3 h-3" />}
                    <span className="ml-1">{copiedKey === 'cname' ? 'Copied' : 'Copy Value'}</span>
                  </Button>
                </div>
                <div className="p-2 rounded bg-[var(--bg-surface)] font-mono text-[11px] text-[var(--text-secondary)]">
                  Points to: <strong className="text-[var(--text-primary)]">{domainConfig.cnameRecord.value}</strong>
                </div>
              </div>

              {/* TXT */}
              <div className="p-3 bg-[var(--bg-elevated)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-600 text-white">TXT</span>
                    <span className="font-semibold text-[var(--text-primary)]">{domainConfig.txtRecord.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 text-[11px] px-2"
                    onClick={() => handleCopy(domainConfig.txtRecord.value, 'txt')}
                  >
                    {copiedKey === 'txt' ? <Check className="w-3 h-3 text-[var(--status-success)]" /> : <Copy className="w-3 h-3" />}
                    <span className="ml-1">{copiedKey === 'txt' ? 'Copied' : 'Copy Value'}</span>
                  </Button>
                </div>
                <div className="p-2 rounded bg-[var(--bg-surface)] font-mono text-[11px] text-[var(--text-secondary)] break-all">
                  Value: <strong className="text-[var(--text-primary)]">{domainConfig.txtRecord.value}</strong>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[var(--text-tertiary)] flex items-center gap-1.5 mt-2">
              <HelpCircle className="w-3.5 h-3.5" /> DNS propagation typically completes within 5 to 30 minutes. If your custom domain ever expires, your site automatically falls back to your free subdomain.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleConnect} className="space-y-4">
          <Input
            label="Domain Name to Connect"
            placeholder="www.your-school.com"
            value={inputHostname}
            onChange={(e) => handleInputChange(e.target.value)}
            required
          />

          {apexWarning && (
            <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{apexWarning}</span>
            </div>
          )}

          <Button variant="primary" size="sm" type="submit" loading={connecting}>
            Connect Domain & Generate DNS Verification
          </Button>
        </form>
      )}
    </Card>
  );
}
