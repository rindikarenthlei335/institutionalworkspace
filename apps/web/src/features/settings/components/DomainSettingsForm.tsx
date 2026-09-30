'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Globe, CheckCircle2, Plus, Clock, ExternalLink } from 'lucide-react';
import { ConnectDomainCard } from '@/features/domains/components/ConnectDomainCard';
import { DomainRenewalCard } from '@/features/domains/components/DomainRenewalCard';
import { RequestDomainModal } from '@/features/domains/components/RequestDomainModal';
import { DomainRegistrationRequest } from '@/features/domains/types';

export function DomainSettingsForm() {
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Active domain request state
  const [activeRequest, setActiveRequest] = useState<DomainRegistrationRequest | null>({
    id: 'dr-sample-1',
    tenantId: 't-mount-carmel',
    tenantName: 'Mount Carmel Higher Secondary School',
    desiredDomain: 'mountcarmel',
    tld: '.edu.in',
    fullDomain: 'mountcarmel.edu.in',
    status: 'Documents received',
    schoolName: 'Mount Carmel Higher Secondary School',
    contactPerson: 'Rev. Dr. L. Sailo',
    contactEmail: 'principal@mountcarmel.edu.in',
    contactPhone: '+91 98621 55667',
    documents: [
      { name: 'recognition_certificate.pdf', url: '#' },
      { name: 'authorisation_letter.pdf', url: '#' },
      { name: 'address_proof.pdf', url: '#' }
    ],
    requestedAt: '2024-11-20T10:00:00Z',
    renewalStatus: 'auto_renew'
  });

  const getTimelineSteps = (currentStatus: string) => {
    const steps = ['Requested', 'Documents received', 'Registered', 'DNS setup', 'Live'];
    const currentIndex = steps.indexOf(currentStatus);
    return steps.map((s, i) => ({
      name: s,
      completed: i < currentIndex,
      current: i === currentIndex
    }));
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
            <CheckCircle2 className="w-3 h-3" /> Active & Always Available
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          Your school is always accessible on your permanent platform subdomain:
        </p>
        <div className="flex items-center justify-between p-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs">
          <span className="font-mono font-bold text-[var(--brand-primary)]">https://mountcarmel.eduportal.com</span>
          <a
            href="https://mountcarmel.eduportal.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-[var(--text-secondary)] hover:text-[var(--brand-primary)]"
          >
            Visit Website <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </Card>

      {/* Connect Own Custom Domain */}
      <ConnectDomainCard />

      {/* Assisted Domain Registration Service */}
      <Card className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[var(--border-subtle)] pb-3">
          <div>
            <h4 className="font-display font-semibold text-sm text-[var(--text-primary)]">
              Managed Domain Registration Service
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Need an official school domain (e.g. .edu.in or .in)? We handle registration, ERNET compliance, and DNS setup for you.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowRequestModal(true)} icon={<Plus className="w-3.5 h-3.5" />}>
            Request New Domain
          </Button>
        </div>

        {activeRequest ? (
          <div className="space-y-4 p-4 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-[var(--text-tertiary)]">Current Domain Application</span>
                <div className="font-mono text-base font-bold text-[var(--brand-primary)]">{activeRequest.fullDomain}</div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                  Requested on {new Date(activeRequest.requestedAt).toLocaleDateString('en-IN')} · Managed by EduPortal Registrars
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/30 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> {activeRequest.status}
              </span>
            </div>

            {/* Interactive Timeline Progress */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-[var(--text-primary)]">Registration Stage Timeline:</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                {getTimelineSteps(activeRequest.status).map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded-lg border ${
                      step.current
                        ? 'bg-[var(--brand-primary)] text-white border-[var(--brand-primary)] font-bold'
                        : step.completed
                        ? 'bg-[var(--status-success)]/10 text-[var(--status-success)] border-[var(--status-success)]/30 font-semibold'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-tertiary)] border-[var(--border-subtle)]'
                    }`}
                  >
                    <div className="text-[10px] opacity-80">Step {idx + 1}</div>
                    <div className="text-xs truncate">{step.name}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-[var(--text-secondary)] flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
              <span>{activeRequest.documents.length} Verification Documents on File</span>
              <span className="font-mono text-[var(--brand-primary)]">Reference: {activeRequest.id}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-[var(--text-secondary)]">
            No active domain registration requests. Click &ldquo;Request New Domain&rdquo; above to begin.
          </div>
        )}
      </Card>

      {/* Domain Expiry & Renewal Monitor */}
      <DomainRenewalCard />

      {/* Modal for new domain request */}
      {showRequestModal && (
        <RequestDomainModal
          onClose={() => setShowRequestModal(false)}
          onRequestSubmitted={(req) => setActiveRequest(req)}
        />
      )}
    </div>
  );
}
