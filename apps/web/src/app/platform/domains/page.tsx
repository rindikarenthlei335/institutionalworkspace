'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function PlatformDomainsPage() {
  const [requests, setRequests] = useState([
    {
      id: 'dr1',
      tenantName: 'Mount Carmel School',
      subdomain: 'mountcarmel',
      desiredDomain: 'mountcarmel.edu.in',
      tld: '.edu.in',
      status: 'Documents received',
      expiryDate: '2025-12-01',
      documents: ['recognition_certificate.pdf', 'authorisation_letter.pdf']
    }
  ]);

  const advanceStatus = (id: string, nextStatus: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: nextStatus } : r));
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Managed Domain Registration</span>
        <h1 className="font-display font-bold text-2xl text-white">Domain Requests & Renewal Tracker</h1>
      </div>

      <Card className="p-0 overflow-hidden bg-slate-950 border-slate-800 text-white">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
              <th className="p-4">School Tenant</th>
              <th className="p-4">Desired Domain</th>
              <th className="p-4">Uploaded Verification Documents</th>
              <th className="p-4">Status Timeline</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {requests.map((r) => (
              <tr key={r.id} className="hover:bg-slate-900/50">
                <td className="p-4 font-semibold text-white">{r.tenantName}</td>
                <td className="p-4 font-mono text-emerald-400">{r.desiredDomain}</td>
                <td className="p-4 text-slate-300">
                  {r.documents.map(doc => (
                    <span key={doc} className="block text-[11px] text-slate-400 underline cursor-pointer">{doc}</span>
                  ))}
                </td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300">
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  {r.status === 'Documents received' && (
                    <button onClick={() => advanceStatus(r.id, 'Registered')} className="text-xs font-semibold text-emerald-400 hover:underline">
                      Mark Registered
                    </button>
                  )}
                  {r.status === 'Registered' && (
                    <button onClick={() => advanceStatus(r.id, 'Live')} className="text-xs font-semibold text-emerald-400 hover:underline">
                      Mark DNS Live
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
