'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  FileText,
  AlertCircle,
  Download,
  Check,
  X,
  UserCheck,
  Globe,
  Smartphone,
  Layers,
  Search,
  MessageSquare
} from 'lucide-react';
import { ServiceItemStatus, ServiceOrderItem } from '@/features/services/types';
import { calculateServiceETA, SERVICE_STORE_ETA_DISCLAIMER } from '@/features/services/lib/eta';

interface FulfillmentQueueRow {
  id: string;
  orderNumber: string;
  tenantId: string;
  tenantName: string;
  planId: 'basic' | 'essential' | 'pro' | 'ultimate';
  serviceId: string;
  serviceTitle: string;
  category: 'domains' | 'google_seo' | 'mobile_apps' | 'data_storage' | 'ai';
  priceINR: number;
  status: ServiceItemStatus;
  clockStartedAt?: string;
  etaWorkingDays: number;
  assignedTo?: string;
  contactEmail: string;
  contactPhone: string;
  documents: Array<{
    id: string;
    documentKey: string;
    label: string;
    fileName: string;
    status: 'under_review' | 'approved' | 'rejected';
    rejectionReason?: string;
  }>;
  fulfillmentData?: {
    domainName?: string;
    domainExpiresAt?: string;
    storeUrl?: string;
  };
  requestedAt: string;
  completedAt?: string;
}

export default function PlatformServicesPage() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Queue state
  const [queue, setQueue] = useState<FulfillmentQueueRow[]>([
    {
      id: 'item-201',
      orderNumber: 'ORD-2026-1049',
      tenantId: 't-mount-carmel',
      tenantName: 'Mount Carmel Higher Secondary School',
      planId: 'pro',
      serviceId: 'seo_bundle',
      serviceTitle: 'Google Presence & Local SEO Bundle',
      category: 'google_seo',
      priceINR: 0,
      status: 'in_progress',
      clockStartedAt: '2026-09-22T09:00:00Z',
      etaWorkingDays: 7,
      assignedTo: 'Alex (Operations Lead)',
      contactEmail: 'principal@mountcarmel.edu.in',
      contactPhone: '+91 98621 55667',
      documents: [
        {
          id: 'doc-201-1',
          documentKey: 'campus_photos',
          label: 'Campus Front Gate & Building Photos',
          fileName: 'mount_carmel_gate.jpg',
          status: 'approved'
        }
      ],
      fulfillmentData: {
        storeUrl: 'https://search.google.com/search-console'
      },
      requestedAt: '2026-09-20T10:00:00Z'
    },
    {
      id: 'item-202',
      orderNumber: 'ORD-2026-1082',
      tenantId: 't-st-marys',
      tenantName: "St. Mary's Convent High School",
      planId: 'essential',
      serviceId: 'domain_register_edu_in',
      serviceTitle: 'Official .edu.in / .ac.in Government Registration',
      category: 'domains',
      priceINR: 5000,
      status: 'documents_under_review',
      clockStartedAt: undefined,
      etaWorkingDays: 12,
      assignedTo: 'Unassigned',
      contactEmail: 'admin@stmarys.eduportal.com',
      contactPhone: '+91 94361 44556',
      documents: [
        {
          id: 'doc-202-1',
          documentKey: 'recognition_certificate',
          label: 'School Recognition / Affiliation Certificate',
          fileName: 'st_marys_affiliation_order.pdf',
          status: 'under_review'
        },
        {
          id: 'doc-202-2',
          documentKey: 'authorisation_letter',
          label: 'Authorisation Letter on Official School Letterhead',
          fileName: 'authorisation_letter_signed.docx',
          status: 'under_review'
        }
      ],
      requestedAt: '2026-09-25T14:30:00Z'
    },
    {
      id: 'item-203',
      orderNumber: 'ORD-2026-1090',
      tenantId: 't-st-marys',
      tenantName: "St. Mary's Convent High School",
      planId: 'essential',
      serviceId: 'android_app',
      serviceTitle: 'Android App Publish to Google Play Store',
      category: 'mobile_apps',
      priceINR: 10000,
      status: 'awaiting_school_action',
      clockStartedAt: '2026-09-24T10:00:00Z',
      etaWorkingDays: 14,
      assignedTo: 'Priya (Mobile Team)',
      contactEmail: 'admin@stmarys.eduportal.com',
      contactPhone: '+91 94361 44556',
      documents: [
        {
          id: 'doc-203-1',
          documentKey: 'publisher_authorisation_letter',
          label: 'Play Store Publisher Authorisation Letter',
          fileName: 'st_marys_playstore_auth.pdf',
          status: 'approved'
        },
        {
          id: 'doc-203-2',
          documentKey: 'app_icon_graphic',
          label: 'High-Res School Crest / Logo (512x512 PNG)',
          fileName: 'crest_icon_blurry.png',
          status: 'rejected',
          rejectionReason: 'Resolution below 512x512. Please upload a crisp vector/high-res PNG without alpha channel.'
        }
      ],
      requestedAt: '2026-09-23T11:15:00Z'
    }
  ]);

  // Selected row for full modal review
  const [activeModalRow, setActiveModalRow] = useState<FulfillmentQueueRow | null>(null);
  const [completeDomainInput, setCompleteDomainInput] = useState('');
  const [completeUrlInput, setCompleteUrlInput] = useState('');

  // Status transitions
  const handleApproveDoc = (rowId: string, docId: string) => {
    setQueue(prev =>
      prev.map(row => {
        if (row.id !== rowId) return row;
        const updatedDocs = row.documents.map(d =>
          d.id === docId ? { ...d, status: 'approved' as const, rejectionReason: undefined } : d
        );
        const allApproved = updatedDocs.every(d => d.status === 'approved');

        return {
          ...row,
          documents: updatedDocs,
          // If all docs are approved, auto-transition to in_progress and start clock!
          status: allApproved ? ('in_progress' as const) : row.status,
          clockStartedAt: allApproved && !row.clockStartedAt ? new Date().toISOString() : row.clockStartedAt
        };
      })
    );
  };

  const handleRejectDoc = (rowId: string, docId: string) => {
    const reason = prompt('Enter rejection reason to notify school administrator:', 'File is illegible or missing official seal');
    if (!reason) return;

    setQueue(prev =>
      prev.map(row => {
        if (row.id !== rowId) return row;
        return {
          ...row,
          status: 'awaiting_school_action' as const,
          documents: row.documents.map(d =>
            d.id === docId ? { ...d, status: 'rejected' as const, rejectionReason: reason } : d
          )
        };
      })
    );
  };

  const handleAssignReviewer = (rowId: string) => {
    const name = prompt('Assign fulfillment engineer:', 'David (DNS & SEO Desk)');
    if (!name) return;
    setQueue(prev =>
      prev.map(r => (r.id === rowId ? { ...r, assignedTo: name } : r))
    );
  };

  const handleCompleteOrder = (row: FulfillmentQueueRow) => {
    let fulfillmentPayload: Record<string, any> = {};

    if (row.category === 'domains') {
      const domain = prompt('Enter registered domain (e.g. stmarysaizawl.edu.in):', 'stmarysaizawl.edu.in');
      if (!domain) return;
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      fulfillmentPayload = {
        domainName: domain,
        domainExpiresAt: expiryDate.toISOString().split('T')[0]
      };
      alert(`[Fulfillment Engine] Success: Automated creation of tenant_domains ('${domain}') and service_subscriptions (Yearly renewal) registered.`);
    } else if (row.category === 'mobile_apps') {
      const url = prompt('Enter Play Store / App Store Live Listing URL:', 'https://play.google.com/store/apps/details?id=in.eduportal.stmarys');
      if (!url) return;
      fulfillmentPayload = { storeUrl: url };
      alert(`[Fulfillment Engine] Success: Stored official mobile app listing URL '${url}'.`);
    } else {
      const url = prompt('Enter delivery proof link or Search Console URL:', 'https://search.google.com/search-console');
      fulfillmentPayload = { storeUrl: url || undefined };
    }

    setQueue(prev =>
      prev.map(r =>
        r.id === row.id
          ? {
              ...r,
              status: 'completed' as const,
              completedAt: new Date().toISOString(),
              fulfillmentData: fulfillmentPayload
            }
          : r
      )
    );
    setActiveModalRow(null);
  };

  const handleExportCSV = () => {
    const headers = ['OrderNumber,School,Plan,Service,Category,PriceINR,Status,AssignedTo,RequestedAt'];
    const rows = queue.map(
      r =>
        `"${r.orderNumber}","${r.tenantName}","${r.planId}","${r.serviceTitle}","${r.category}",${r.priceINR},"${r.status}","${r.assignedTo || 'Unassigned'}","${r.requestedAt}"`
    );
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service_fulfillment_queue_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter items
  const filtered = queue.filter(r => {
    const matchesCat = filterCategory === 'all' || r.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch =
      searchQuery.trim() === '' ||
      r.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  const totalPrepaidRevenue = queue.reduce((acc, r) => acc + r.priceINR, 0);
  const pendingDocsCount = queue.flatMap(r => r.documents).filter(d => d.status === 'under_review').length;
  const activeWorkingCount = queue.filter(r => r.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      {/* Platform Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
            Platform Operations · Fulfillment Engine
          </span>
          <h1 className="font-display font-bold text-2xl text-white mt-0.5">
            Service Store Fulfillment Console
          </h1>
          <p className="text-xs text-slate-400">
            Audit school authorisations, manage working-day turnaround clocks, and provision institutional domains and mobile apps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 text-xs border-slate-700 text-slate-300 hover:text-white"
          >
            <Download className="w-3.5 h-3.5" />
            Export Queue (CSV)
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-950 border-slate-800 text-white">
          <span className="text-xs text-slate-400 font-medium">Prepaid Platform Revenue</span>
          <p className="text-2xl font-bold font-display text-emerald-400 mt-1">
            ₹{totalPrepaidRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Prepaid via separate Platform Razorpay context
          </span>
        </Card>

        <Card className="p-4 bg-slate-950 border-slate-800 text-white">
          <span className="text-xs text-slate-400 font-medium">Documents Awaiting Review</span>
          <p className="text-2xl font-bold font-display text-purple-400 mt-1">
            {pendingDocsCount} dossiers
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Authorisation letters, ID proofs, and affidavits
          </span>
        </Card>

        <Card className="p-4 bg-slate-950 border-slate-800 text-white">
          <span className="text-xs text-slate-400 font-medium">In-Progress Deliveries</span>
          <p className="text-2xl font-bold font-display text-blue-400 mt-1">
            {activeWorkingCount} active
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Working-day countdown clocks running
          </span>
        </Card>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300"
          >
            <option value="all">All Categories</option>
            <option value="domains">Domains & DNS</option>
            <option value="google_seo">Google & SEO</option>
            <option value="mobile_apps">Mobile Apps</option>
            <option value="data_storage">Data Storage</option>
            <option value="ai">AI Copilot</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="documents_under_review">Documents Under Review</option>
            <option value="in_progress">In Progress</option>
            <option value="awaiting_school_action">Action Needed from School</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search school, order number, service..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs text-white placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Fulfillment Table */}
      <Card className="p-0 overflow-hidden bg-slate-950 border-slate-800 text-white space-y-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400">
                <th className="p-3.5">School & Plan</th>
                <th className="p-3.5">Service & Order</th>
                <th className="p-3.5">Documents Dossier</th>
                <th className="p-3.5">Turnaround & Clock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Assignee</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map(row => {
                const allApproved = row.documents.length === 0 || row.documents.every(d => d.status === 'approved');
                const etaCalc = calculateServiceETA({
                  clockStartedAt: row.clockStartedAt,
                  allDocumentsApproved: allApproved,
                  paymentConfirmed: true,
                  etaWorkingDays: row.etaWorkingDays
                });

                return (
                  <tr key={row.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{row.tenantName}</div>
                      <div className="text-[11px] text-slate-400">
                        Plan: <span className="uppercase text-emerald-400 font-medium">{row.planId}</span> • {row.contactPhone}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-emerald-400">{row.serviceTitle}</div>
                      <div className="text-[10px] text-slate-400">
                        {row.orderNumber} • ₹{row.priceINR.toLocaleString('en-IN')}
                      </div>
                    </td>

                    <td className="p-3.5">
                      {row.documents.length === 0 ? (
                        <span className="text-[11px] text-slate-500">None Required</span>
                      ) : (
                        <div className="space-y-1">
                          {row.documents.map(d => (
                            <div key={d.id} className="flex items-center gap-1.5 text-[11px]">
                              {d.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
                              {d.status === 'under_review' && <Clock className="w-3 h-3 text-purple-400 shrink-0" />}
                              {d.status === 'rejected' && <AlertCircle className="w-3 h-3 text-rose-400 shrink-0" />}
                              <span className="truncate max-w-[140px]" title={d.fileName}>{d.fileName}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold block w-fit ${
                          etaCalc.isDelayed
                            ? 'bg-rose-500/20 text-rose-300'
                            : etaCalc.clockActive
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {etaCalc.humanFormattedStatus}
                      </span>
                      {etaCalc.clockActive && etaCalc.expectedCompletionDate && (
                        <span className="text-[10px] text-slate-500 block mt-0.5">
                          Due: {etaCalc.expectedCompletionDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold block w-fit ${
                          row.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : row.status === 'in_progress'
                            ? 'bg-blue-500/20 text-blue-300'
                            : row.status === 'awaiting_school_action'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-purple-500/20 text-purple-300'
                        }`}
                      >
                        {row.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <button
                        onClick={() => handleAssignReviewer(row.id)}
                        className="text-[11px] text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        <UserCheck className="w-3 h-3 text-slate-400" />
                        {row.assignedTo || 'Assign'}
                      </button>
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-xs h-7 bg-slate-800 hover:bg-slate-700 text-slate-200"
                        onClick={() => setActiveModalRow(row)}
                      >
                        Review Dossier
                      </Button>

                      {row.status !== 'completed' && (
                        <Button
                          size="sm"
                          variant="primary"
                          className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleCompleteOrder(row)}
                        >
                          Complete
                        </Button>
                      )}

                      {row.status === 'completed' && (row.fulfillmentData?.storeUrl || row.fulfillmentData?.domainName) && (
                        <span className="text-xs text-emerald-400 font-medium">
                          Done
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review Dossier Modal */}
      {activeModalRow && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white space-y-6">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Document Review & Action Desk
                </span>
                <h3 className="text-lg font-bold mt-0.5">{activeModalRow.serviceTitle}</h3>
                <p className="text-xs text-slate-400">
                  {activeModalRow.tenantName} • Order #{activeModalRow.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setActiveModalRow(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Documents List */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Submitted Documents Checklist ({activeModalRow.documents.length})
              </span>

              {activeModalRow.documents.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No preliminary documents required for this item.</p>
              ) : (
                <div className="space-y-3">
                  {activeModalRow.documents.map(doc => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{doc.label}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Filename: <span className="text-slate-300">{doc.fileName}</span>
                        </p>
                        {doc.rejectionReason && (
                          <p className="text-xs text-rose-400 mt-1">
                            Rejection note: {doc.rejectionReason}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {doc.status !== 'approved' && (
                          <Button
                            size="sm"
                            onClick={() => handleApproveDoc(activeModalRow.id, doc.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white h-7 text-xs flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </Button>
                        )}
                        {doc.status !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleRejectDoc(activeModalRow.id, doc.id)}
                            className="bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900/60 h-7 text-xs flex items-center gap-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </Button>
                        )}
                        {doc.status === 'approved' && (
                          <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Turnaround policy notice */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-semibold text-slate-300 block">Rule: ETA Clock Trigger</span>
              <p>
                The {activeModalRow.etaWorkingDays}-working-day turnaround clock commences only when all required documents have been approved by the platform reviewer.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveModalRow(null)}
                className="border-slate-700 text-slate-300"
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleCompleteOrder(activeModalRow)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Deliver & Mark Complete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
