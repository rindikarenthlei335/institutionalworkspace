'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Globe, Calendar, FileText, CheckCircle2, Clock, AlertTriangle, Send } from 'lucide-react';
import { DomainRegistrationRequest } from '@/features/domains/types';

export default function PlatformDomainsPage() {
  const [requests, setRequests] = useState<DomainRegistrationRequest[]>([
    {
      id: 'dr-101',
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
        { name: 'cbse_affiliation_order.pdf', url: '#' }
      ],
      requestedAt: '2024-11-20T10:00:00Z',
      renewalStatus: 'auto_renew'
    },
    {
      id: 'dr-102',
      tenantId: 't-st-marys',
      tenantName: "St. Mary's Convent High School",
      desiredDomain: 'stmarysaizawl',
      tld: '.in',
      fullDomain: 'stmarysaizawl.in',
      status: 'Requested',
      schoolName: "St. Mary's Convent High School",
      contactPerson: 'Sr. Maria Goretti',
      contactEmail: 'admin@stmarys.eduportal.com',
      contactPhone: '+91 94361 44556',
      documents: [
        { name: 'recognition_certificate.pdf', url: '#' },
        { name: 'authorisation_letter.pdf', url: '#' }
      ],
      requestedAt: '2024-11-25T14:20:00Z',
      renewalStatus: 'manual_invoice'
    }
  ]);

  const [activeDomains, setActiveDomains] = useState([
    {
      domain: 'mountcarmel.edu.in',
      school: 'Mount Carmel School',
      registrar: 'ERNET India (.edu.in)',
      expiryDate: '2025-12-01',
      daysRemaining: 28,
      renewalStatus: 'auto_renew',
      lastNoticeSent: '30-day notice sent on Nov 1'
    },
    {
      domain: 'stmarysschool.in',
      school: "St. Mary's School",
      registrar: 'INRegistry via Dynadot',
      expiryDate: '2026-03-15',
      daysRemaining: 135,
      renewalStatus: 'manual_invoice',
      lastNoticeSent: 'No notices due'
    }
  ]);

  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);

  const advanceStatus = (id: string, nextStatus: any) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: nextStatus } : r));
  };

  const handleSendNotice = (domain: string, days: number) => {
    setNoticeMessage(`Automated ${days}-day expiration reminder sent to ${domain} administrative contact.`);
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
          Platform Operations · SaaS Domains
        </span>
        <h1 className="font-display font-bold text-2xl text-white">Domain Requests & Expiry Tracker</h1>
        <p className="text-xs text-slate-400">
          Manage ERNET/.IN registration pipelines, review compliance credentials, and monitor auto-renewals.
        </p>
      </div>

      {noticeMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {noticeMessage}
        </div>
      )}

      {/* Domain Registration Requests Queue */}
      <Card className="p-0 overflow-hidden bg-slate-950 border-slate-800 text-white space-y-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-bold text-sm text-white">School Registration Requests Queue</h3>
          </div>
          <span className="text-xs text-slate-400">{requests.length} Active Requests</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                <th className="p-3.5">School Tenant</th>
                <th className="p-3.5">Desired Domain</th>
                <th className="p-3.5">Documents Attached</th>
                <th className="p-3.5">Status Timeline</th>
                <th className="p-3.5 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-900/40">
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{r.schoolName}</div>
                    <div className="text-[11px] text-slate-400">{r.contactEmail} · {r.contactPhone}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono font-bold text-emerald-400">{r.fullDomain}</div>
                    <div className="text-[10px] text-slate-400">TLD: {r.tld}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="space-y-1">
                      {r.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                          <FileText className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="underline hover:text-white cursor-pointer">{doc.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        r.status === 'Live'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : r.status === 'Registered'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    {r.status === 'Requested' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs h-7"
                        onClick={() => advanceStatus(r.id, 'Documents received')}
                      >
                        Accept Docs
                      </Button>
                    )}
                    {r.status === 'Documents received' && (
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-xs h-7"
                        onClick={() => advanceStatus(r.id, 'Registered')}
                      >
                        Register at Registry
                      </Button>
                    )}
                    {r.status === 'Registered' && (
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-xs h-7"
                        onClick={() => advanceStatus(r.id, 'Live')}
                      >
                        Mark DNS Live
                      </Button>
                    )}
                    {r.status === 'Live' && (
                      <span className="text-[11px] text-emerald-400 font-semibold">Active & Live</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Active Domains Expiration & Renewal Monitor */}
      <Card className="p-0 overflow-hidden bg-slate-950 border-slate-800 text-white space-y-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-bold text-sm text-white">Registered Domains & Expiration Schedule</h3>
          </div>
          <span className="text-xs text-slate-400">Daily Cron: 60/30/15/7-Day Expiration Alerts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                <th className="p-3.5">Domain</th>
                <th className="p-3.5">School</th>
                <th className="p-3.5">Registrar</th>
                <th className="p-3.5">Expiry Date</th>
                <th className="p-3.5">Renewal Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {activeDomains.map((ad, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40">
                  <td className="p-3.5 font-mono font-bold text-emerald-400">{ad.domain}</td>
                  <td className="p-3.5 text-slate-200">{ad.school}</td>
                  <td className="p-3.5 text-slate-400">{ad.registrar}</td>
                  <td className="p-3.5">
                    <div className="font-mono text-white">{ad.expiryDate}</div>
                    <div className={`text-[10px] font-bold ${ad.daysRemaining <= 30 ? 'text-amber-400' : 'text-slate-400'}`}>
                      {ad.daysRemaining} days left ({ad.lastNoticeSent})
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {ad.renewalStatus === 'auto_renew' ? 'Auto-Renew' : 'Manual Invoice'}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs h-7"
                      icon={<Send className="w-3 h-3" />}
                      onClick={() => handleSendNotice(ad.domain, ad.daysRemaining)}
                    >
                      Dispatch Notice
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
