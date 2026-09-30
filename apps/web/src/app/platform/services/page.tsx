'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, CheckCircle2, Clock, ExternalLink, Filter } from 'lucide-react';
import { ServiceRequestRecord } from '@/features/services/types';

export default function PlatformServicesPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const [services, setServices] = useState<ServiceRequestRecord[]>([
    {
      id: 'sr-201',
      tenantId: 't-mount-carmel',
      tenantName: 'Mount Carmel Higher Secondary School',
      serviceType: 'seo_bundle',
      serviceTitle: 'Complete SEO & Local Presence Bundle',
      priceChargedINR: 0,
      status: 'completed',
      contactEmail: 'principal@mountcarmel.edu.in',
      contactPhone: '+91 98621 55667',
      requestedAt: '2024-11-10T09:00:00Z',
      completedAt: '2024-11-12T14:30:00Z',
      completionUrl: 'https://search.google.com/search-console?resource_id=https://mountcarmel.eduportal.com'
    },
    {
      id: 'sr-202',
      tenantId: 't-st-marys',
      tenantName: "St. Mary's Convent High School",
      serviceType: 'google_submit',
      serviceTitle: 'Google Search Console & Sitemap Indexation',
      priceChargedINR: 1000,
      status: 'in_progress',
      contactEmail: 'admin@stmarys.eduportal.com',
      contactPhone: '+91 94361 44556',
      requestedAt: '2024-11-24T11:15:00Z'
    },
    {
      id: 'sr-203',
      tenantId: 't-st-marys',
      tenantName: "St. Mary's Convent High School",
      serviceType: 'maps_register',
      serviceTitle: 'Google Maps Business Profile & Pin Verification',
      priceChargedINR: 500,
      status: 'pending',
      contactEmail: 'admin@stmarys.eduportal.com',
      contactPhone: '+91 94361 44556',
      requestedAt: '2024-11-26T15:40:00Z'
    }
  ]);

  const updateStatus = (id: string, newStatus: any, url?: string) => {
    setServices(services.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: newStatus,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : s.completedAt,
          completionUrl: url || s.completionUrl
        };
      }
      return s;
    }));
  };

  const filtered = filter === 'all' ? services : services.filter(s => s.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Platform Operations · Assisted Services
          </span>
          <h1 className="font-display font-bold text-2xl text-white">Service Requests Queue</h1>
          <p className="text-xs text-slate-400">
            Triage, execute and deliver Search Console submissions, Google Maps claims, and SEO packages.
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
          {(['all', 'pending', 'in_progress', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                filter === tab ? 'bg-emerald-500/20 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <Card className="p-0 overflow-hidden bg-slate-950 border-slate-800 text-white space-y-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="font-display font-bold text-sm text-white">Active School Service Orders</h3>
          </div>
          <span className="text-xs text-slate-400">{filtered.length} Requests Displayed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900 text-slate-400">
                <th className="p-3.5">School / Customer</th>
                <th className="p-3.5">Service Requested</th>
                <th className="p-3.5">Amount Billed</th>
                <th className="p-3.5">Requested On</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-900/40">
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{s.tenantName}</div>
                    <div className="text-[11px] text-slate-400">{s.contactEmail}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-emerald-400">{s.serviceTitle}</div>
                    <div className="text-[10px] text-slate-400">Ref: {s.id}</div>
                  </td>
                  <td className="p-3.5 font-mono">
                    {s.priceChargedINR === 0 ? (
                      <span className="text-emerald-400 font-bold">FREE (Pro)</span>
                    ) : (
                      <span className="text-white font-semibold">₹{s.priceChargedINR.toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {new Date(s.requestedAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-fit ${
                        s.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : s.status === 'in_progress'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {s.status === 'completed' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </>
                      ) : s.status === 'in_progress' ? (
                        <>
                          <Clock className="w-3 h-3" /> In Progress
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" /> Pending
                        </>
                      )}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    {s.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs h-7"
                        onClick={() => updateStatus(s.id, 'in_progress')}
                      >
                        Start Task
                      </Button>
                    )}
                    {s.status === 'in_progress' && (
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-xs h-7"
                        onClick={() => {
                          const url = prompt('Enter Google Search Console or Maps completion URL:', 'https://search.google.com/search-console');
                          if (url) updateStatus(s.id, 'completed', url);
                        }}
                      >
                        Mark Completed
                      </Button>
                    )}
                    {s.status === 'completed' && s.completionUrl && (
                      <a
                        href={s.completionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1"
                      >
                        Proof Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
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
