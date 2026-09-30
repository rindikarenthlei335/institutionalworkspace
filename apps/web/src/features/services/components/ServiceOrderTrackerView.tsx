'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ServiceOrder, ServiceOrderItem, ServiceItemStatus } from '../types';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MessageSquare,
  Printer,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Send,
  UploadCloud,
  FileCheck,
  XCircle
} from 'lucide-react';
import { calculateServiceETA, SERVICE_STORE_ETA_DISCLAIMER } from '../lib/eta';

interface ServiceOrderTrackerViewProps {
  orders: ServiceOrder[];
  onReuploadDoc?: (itemId: string, docKey: string, file: File) => void;
  onSendSupportMessage?: (orderId: string, message: string) => void;
}

export function ServiceOrderTrackerView({
  orders,
  onReuploadDoc,
  onSendSupportMessage
}: ServiceOrderTrackerViewProps) {
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(orders[0] || null);
  const [selectedItem, setSelectedItem] = useState<ServiceOrderItem | null>(
    orders[0]?.items[0] || null
  );

  const [supportMessage, setSupportMessage] = useState('');
  const [supportMessagesList, setSupportMessagesList] = useState<
    Array<{ sender: 'school' | 'platform'; message: string; timestamp: string }>
  >([
    {
      sender: 'platform',
      message: 'Hello! Your order has been received. Our operations team is currently reviewing your uploaded authorization documents.',
      timestamp: 'Today at 10:15 AM'
    }
  ]);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  if (!orders || orders.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30">
        <Clock className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-semibold text-slate-800 dark:text-white text-base">
          No Orders Placed Yet
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Tick any institutional services from the catalog above to initiate domain registration, Play Store publishing, or SEO verification.
        </p>
      </div>
    );
  }

  const activeOrder = selectedOrder || orders[0];
  const activeItem = selectedItem || activeOrder.items[0];

  // Run ETA Engine
  const allDocsApproved = activeItem.documents.length === 0 || activeItem.documents.every(d => d.status === 'approved');
  const etaCalculation = calculateServiceETA({
    clockStartedAt: activeItem.clockStartedAt,
    allDocumentsApproved: allDocsApproved,
    paymentConfirmed: activeOrder.paymentStatus === 'paid',
    etaWorkingDays: activeItem.etaWorkingDays || 5
  });

  const handleSendMessage = () => {
    if (!supportMessage.trim()) return;
    setSupportMessagesList(prev => [
      ...prev,
      {
        sender: 'school',
        message: supportMessage.trim(),
        timestamp: 'Just now'
      }
    ]);
    setSupportMessage('');
  };

  const getStatusBadge = (status: ServiceItemStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            In Progress
          </span>
        );
      case 'awaiting_school_action':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            Action Needed from You
          </span>
        );
      case 'documents_under_review':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            Documents Under Review
          </span>
        );
      case 'rejected':
      case 'cancelled':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {status.replace('_', ' ')}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Order Selector Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Current Order
          </span>
          <div className="flex items-center gap-3 mt-1">
            <select
              value={activeOrder.id}
              onChange={e => {
                const ord = orders.find(o => o.id === e.target.value);
                if (ord) {
                  setSelectedOrder(ord);
                  setSelectedItem(ord.items[0]);
                }
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-sm text-slate-900 dark:text-white"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  Order #{o.orderNumber} (₹{o.totalAmountINR.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
            <span className="text-xs text-slate-500">
              Placed on {new Date(activeOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowInvoiceModal(true)}
            className="flex items-center gap-1.5 text-xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            View Platform Invoice (PDF)
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Items List, Right Item Details & Live ETA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Items inside this order */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider block">
            Items in Order ({activeOrder.items.length})
          </span>

          <div className="space-y-2">
            {activeOrder.items.map(item => {
              const isSelected = item.id === activeItem.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {item.serviceTitle}
                    </p>
                    <span className="shrink-0 font-bold text-slate-700 dark:text-slate-300">
                      ₹{item.priceINR.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>{getStatusBadge(item.status)}</span>
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                      {item.etaWorkingDays}d turnaround
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Item Tracker & Milestones */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Item Overview Card */}
          <Card className="p-6 space-y-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Service Fulfillment Details
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeItem.serviceTitle}
                </h3>
              </div>
              <div>{getStatusBadge(activeItem.status)}</div>
            </div>

            {/* Real-time ETA Status Box */}
            <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  Estimated Completion Status
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    etaCalculation.isDelayed
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                      : etaCalculation.clockActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {etaCalculation.humanFormattedStatus}
                </span>
              </div>

              {etaCalculation.clockActive && etaCalculation.expectedCompletionDate ? (
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  Target Delivery Date:{' '}
                  <strong>
                    {etaCalculation.expectedCompletionDate.toLocaleDateString('en-IN', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </strong>{' '}
                  (skipping weekends and official holidays).
                </p>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {etaCalculation.clockBlockedReason}
                </p>
              )}

              <p className="text-[10px] text-slate-400 pt-1 border-t border-blue-100 dark:border-blue-900/30">
                {SERVICE_STORE_ETA_DISCLAIMER}
              </p>
            </div>

            {/* Document Checklist for this Item */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-500" />
                Document Dossier & Verification Status
              </h4>

              {activeItem.documents.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No preliminary documents required.</p>
              ) : (
                <div className="space-y-2">
                  {activeItem.documents.map(doc => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {doc.label}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              doc.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                : doc.status === 'rejected'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                            }`}
                          >
                            {doc.status === 'approved' && 'Verified & Approved'}
                            {doc.status === 'under_review' && 'Staff Review in Progress'}
                            {doc.status === 'rejected' && 'Rejected - Resubmission Needed'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          File: {doc.fileName} ({(doc.fileSizeBytes / 1024).toFixed(0)} KB)
                        </p>
                        {doc.rejectionReason && (
                          <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium bg-rose-50 dark:bg-rose-950/30 p-2 rounded border border-rose-200 dark:border-rose-900/50">
                            Reason for rejection: {doc.rejectionReason}
                          </p>
                        )}
                      </div>

                      {doc.status === 'rejected' && (
                        <label className="cursor-pointer shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors text-xs">
                          <UploadCloud className="w-3.5 h-3.5" />
                          Re-upload
                          <input
                            type="file"
                            className="hidden"
                            onChange={e => {
                              const f = e.target.files?.[0];
                              if (f && onReuploadDoc) {
                                onReuploadDoc(activeItem.id, doc.documentKey, f);
                              }
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Support Messaging Thread */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                Fulfillment Support Thread
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs">
                {supportMessagesList.map((m, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg max-w-[85%] ${
                      m.sender === 'school'
                        ? 'ml-auto bg-blue-600 text-white'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <p className="leading-relaxed">{m.message}</p>
                    <span className={`text-[10px] block mt-1 ${m.sender === 'school' ? 'text-blue-100' : 'text-slate-400'}`}>
                      {m.timestamp}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask a question about this service order..."
                  value={supportMessage}
                  onChange={e => setSupportMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                />
                <Button size="sm" onClick={handleSendMessage} className="flex items-center gap-1 text-xs">
                  <Send className="w-3.5 h-3.5" />
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Invoice Modal Preview */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                  Official Platform Receipt & Tax Invoice
                </span>
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-1">
                  Tax Invoice #{activeOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  SAC Code: <strong>998313</strong> (Information Technology Software Services)
                </p>
              </div>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Invoice Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden text-xs">
              <div className="bg-slate-100 dark:bg-slate-800/80 p-3 font-semibold text-slate-700 dark:text-slate-300 grid grid-cols-4">
                <span className="col-span-2">Description</span>
                <span className="text-center">SAC Code</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {activeOrder.items.map(item => (
                  <div key={item.id} className="p-3 grid grid-cols-4 text-slate-700 dark:text-slate-300">
                    <span className="col-span-2 font-medium">{item.serviceTitle}</span>
                    <span className="text-center text-slate-400">998313</span>
                    <span className="text-right font-medium">₹{item.priceINR.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-right border-t border-slate-200 dark:border-slate-800 pt-3">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>₹{activeOrder.subtotalINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>GST (18%):</span>
                <span>₹{activeOrder.taxINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Paid:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  ₹{activeOrder.totalAmountINR.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-slate-400">
                Payment Gateway: Platform Razorpay (Ref: {activeOrder.paymentId || 'TXN-99120'})
              </span>
              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
                className="flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
