'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { DomainRegistrationRequest } from '../types';
import { ShieldCheck, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface RequestDomainModalProps {
  onClose: () => void;
  onRequestSubmitted: (req: DomainRegistrationRequest) => void;
}

export function RequestDomainModal({ onClose, onRequestSubmitted }: RequestDomainModalProps) {
  const [domainPrefix, setDomainPrefix] = useState('');
  const [tld, setTld] = useState<'.edu.in' | '.ac.in' | '.in' | '.com' | '.org.in'>('.edu.in');
  const [schoolName, setSchoolName] = useState('Mount Carmel Higher Secondary School');
  const [affiliation, setAffiliation] = useState('CBSE Affiliation #230041');
  const [contactName, setContactName] = useState('Rev. Dr. L. Sailo (Principal)');
  const [contactEmail, setContactEmail] = useState('principal@mountcarmel.edu.in');
  const [contactPhone, setContactPhone] = useState('+91 98621 55667');
  const [submitting, setSubmitting] = useState(false);

  // Uploaded files simulation
  const [recognitionFile, setRecognitionFile] = useState<string | null>('school_recognition_certificate.pdf');
  const [authorisationFile, setAuthorisationFile] = useState<string | null>('principal_authorisation_letter.pdf');
  const [addressProofFile, setAddressProofFile] = useState<string | null>('school_address_proof.pdf');
  const [govtOrderFile, setGovtOrderFile] = useState<string | null>('cbse_affiliation_order.pdf');

  const isEduOrAc = tld === '.edu.in' || tld === '.ac.in';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainPrefix) return;

    setSubmitting(true);
    setTimeout(() => {
      const fullDomain = `${domainPrefix.toLowerCase()}${tld}`;
      const newRequest: DomainRegistrationRequest = {
        id: `dr-${Date.now()}`,
        tenantId: 't-mount-carmel',
        tenantName: schoolName,
        desiredDomain: domainPrefix.toLowerCase(),
        tld,
        fullDomain,
        status: 'Requested',
        schoolName,
        contactPerson: contactName,
        contactEmail,
        contactPhone,
        documents: [
          { name: recognitionFile || 'recognition.pdf', url: '#' },
          { name: authorisationFile || 'authorisation.pdf', url: '#' },
          { name: addressProofFile || 'address.pdf', url: '#' },
          ...(isEduOrAc ? [{ name: govtOrderFile || 'govt_order.pdf', url: '#' }] : [])
        ],
        requestedAt: new Date().toISOString(),
        renewalStatus: 'auto_renew'
      };

      onRequestSubmitted(newRequest);
      setSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5">
        <div className="flex justify-between items-center border-b border-[var(--border-subtle)] pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--brand-primary)]">Assisted Service</span>
            <h3 className="font-display font-bold text-lg text-[var(--text-primary)]">Request Managed Domain Registration</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Domain Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[var(--text-secondary)]">Desired Domain Name</label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="e.g. mountcarmel"
                  value={domainPrefix}
                  onChange={(e) => setDomainPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
                  required
                />
              </div>
              <div className="w-36">
                <select
                  value={tld}
                  onChange={(e) => setTld(e.target.value as any)}
                  className="w-full h-9 px-3 rounded-[6px] text-xs bg-[var(--bg-surface)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
                >
                  <option value=".edu.in">.edu.in (Schools/Colleges)</option>
                  <option value=".ac.in">.ac.in (Academic/Univ)</option>
                  <option value=".in">.in (India General)</option>
                  <option value=".com">.com (Commercial)</option>
                  <option value=".org.in">.org.in (Non-profit)</option>
                </select>
              </div>
            </div>
            {domainPrefix && (
              <p className="text-[11px] font-mono text-[var(--brand-primary)]">
                Selected: <strong>{domainPrefix}{tld}</strong>
              </p>
            )}
          </div>

          {/* Special Educational TLD Notification */}
          {isEduOrAc && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Official {tld} Registry Requirements (ERNET India)
              </div>
              <p className="text-[11px] leading-relaxed text-blue-700/80 dark:text-blue-300/80">
                Registration of official educational domains ({tld}) is strictly regulated by the Ministry of Electronics & IT (ERNET).
                We prepare, submit, and track the accreditation filing on your school&apos;s behalf.
              </p>
            </div>
          )}

          {/* School Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Official Registered Institution Name"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              required
            />
            <Input
              label="Board / Affiliation Details"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              required
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Authorised Contact"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              required
            />
            <Input
              label="Contact Email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              required
            />
            <Input
              label="Contact Phone"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              required
            />
          </div>

          {/* Verification Documents Checklist */}
          <div className="space-y-2 border-t border-[var(--border-subtle)] pt-3">
            <h4 className="font-semibold text-xs text-[var(--text-primary)]">Required Compliance Documents</h4>
            <p className="text-[11px] text-[var(--text-secondary)]">Please ensure the following verified PDF scans are attached:</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>1. School Recognition / Affiliation Certificate</span>
                </div>
                <span className="font-mono text-[11px] text-[var(--status-success)]">✓ {recognitionFile}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>2. Official Letter of Authorisation on School Letterhead</span>
                </div>
                <span className="font-mono text-[11px] text-[var(--status-success)]">✓ {authorisationFile}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[var(--bg-subtle)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-[var(--brand-primary)]" />
                  <span>3. Institution Address Proof (Electricity Bill / Lease Deed)</span>
                </div>
                <span className="font-mono text-[11px] text-[var(--status-success)]">✓ {addressProofFile}</span>
              </div>

              {isEduOrAc && (
                <div className="flex items-center justify-between p-2.5 rounded bg-blue-500/5 border border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>4. Government Recognition Order / Board Gazette Notification</span>
                  </div>
                  <span className="font-mono text-[11px] text-[var(--status-success)]">✓ {govtOrderFile}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[var(--border-subtle)]">
            <Button variant="secondary" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" loading={submitting}>
              Submit Domain Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
