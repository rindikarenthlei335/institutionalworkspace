'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ServiceCatalogItem, ServiceRequestRecord } from '../types';
import { CheckCircle2, Clock, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

const CATALOG: ServiceCatalogItem[] = [
  {
    id: 'google_submit',
    title: 'Google Search Console & Sitemap Indexation',
    description: 'Manual verification of your domain ownership with Google Search Console, submitting XML sitemaps, and requesting expedited indexing for all school pages.',
    basePriceINR: 1000,
    isFreeOnPro: true,
    estimatedDays: 2,
    deliverables: ['Google Search Console ownership verification', 'sitemap.xml submission', 'Robots.txt audit', 'Indexing report']
  },
  {
    id: 'maps_register',
    title: 'Google Maps Business Profile & Pin Verification',
    description: 'Creation or claiming of your official Google Maps business listing, updating phone numbers, address, photos, and requesting postcard/video verification.',
    basePriceINR: 500,
    isFreeOnPro: true,
    estimatedDays: 5,
    deliverables: ['Google Business Profile setup', 'Accurate geolocation pin', 'Campus photos & hours upload', 'Ownership handover']
  },
  {
    id: 'seo_bundle',
    title: 'Complete SEO & Local Presence Bundle',
    description: 'Comprehensive digital onboarding including Search Console indexing, Google Maps claim, OpenGraph social card validation, and structured data testing.',
    basePriceINR: 1200,
    isFreeOnPro: true,
    estimatedDays: 3,
    deliverables: ['All Search Console deliverables', 'All Google Maps deliverables', 'Schema.org School metadata validation', 'Full SEO audit summary']
  },
  {
    id: 'white_label_app',
    title: 'Custom Branded Android APK & Play Store Publishing',
    description: 'Dedicated standalone Android application with your school icon, splash screen, and institution name published under your Google Play Console.',
    basePriceINR: 15000,
    isFreeOnPro: false,
    estimatedDays: 14,
    deliverables: ['Custom Android APK & AAB binary', 'Google Play Store listing assets', 'Push notification configuration', 'Annual maintenance']
  }
];

export function ServiceCatalogView() {
  const isProPlan = true; // Mount Carmel is on Pro plan
  const [orderedServices, setOrderedServices] = useState<ServiceRequestRecord[]>([
    {
      id: 'sr-101',
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
    }
  ]);

  const [activeModalItem, setActiveModalItem] = useState<ServiceCatalogItem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleOrder = (item: ServiceCatalogItem) => {
    setActiveModalItem(item);
  };

  const confirmOrder = () => {
    if (!activeModalItem) return;
    setSubmitting(true);
    setTimeout(() => {
      const price = isProPlan && activeModalItem.isFreeOnPro ? 0 : activeModalItem.basePriceINR;
      const newRecord: ServiceRequestRecord = {
        id: `sr-${Date.now()}`,
        tenantId: 't-mount-carmel',
        tenantName: 'Mount Carmel Higher Secondary School',
        serviceType: activeModalItem.id,
        serviceTitle: activeModalItem.title,
        priceChargedINR: price,
        status: 'pending',
        contactEmail: 'principal@mountcarmel.edu.in',
        contactPhone: '+91 98621 55667',
        requestedAt: new Date().toISOString()
      };
      setOrderedServices([newRecord, ...orderedServices]);
      setSubmitting(false);
      setActiveModalItem(null);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[var(--border-subtle)] pb-4">
        <div>
          <span className="text-[11px] font-semibold text-[var(--brand-primary)] uppercase tracking-wider">
            Assisted Platform Services
          </span>
          <h1 className="font-display font-bold text-3xl text-[var(--text-primary)]">Add-on Services Catalog</h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Professional digital presence, search engine indexation, and custom app publishing
          </p>
        </div>
        {isProPlan && (
          <div className="px-3 py-1.5 rounded-lg bg-[var(--status-success)]/10 border border-[var(--status-success)]/30 text-[var(--status-success)] text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Pro Plan Active: Google & SEO Services 100% Free</span>
          </div>
        )}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CATALOG.map((item) => {
          const isFree = isProPlan && item.isFreeOnPro;
          const isAlreadyRequested = orderedServices.some(s => s.serviceType === item.id);

          return (
            <Card key={item.id} className="flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-display font-bold text-base text-[var(--text-primary)]">{item.title}</h3>
                  <div className="text-right">
                    {isFree ? (
                      <div className="flex flex-col items-end">
                        <span className="line-through text-xs text-[var(--text-tertiary)]">₹{item.basePriceINR.toLocaleString('en-IN')}</span>
                        <span className="text-xs font-bold font-mono text-[var(--status-success)]">FREE (Pro)</span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold font-mono text-[var(--text-primary)]">
                        ₹{item.basePriceINR.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.description}</p>

                {/* Deliverables List */}
                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-semibold text-[var(--text-primary)]">Included Deliverables:</span>
                  <div className="grid grid-cols-1 gap-1">
                    {item.deliverables.map((del, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                        <CheckCircle2 className="w-3 h-3 text-[var(--brand-primary)] shrink-0" />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-[var(--border-subtle)] text-xs">
                <span className="text-[11px] text-[var(--text-tertiary)]">Est. Completion: {item.estimatedDays} days</span>
                <Button
                  variant={isAlreadyRequested ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={isAlreadyRequested}
                  onClick={() => handleOrder(item)}
                >
                  {isAlreadyRequested ? 'Requested ✓' : isFree ? 'Request Free Service' : 'Order Service'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active Service Requests History */}
      <Card className="space-y-4">
        <h3 className="font-display font-bold text-base text-[var(--text-primary)]">Active & Completed Service Orders</h3>
        {orderedServices.length > 0 ? (
          <div className="space-y-3">
            {orderedServices.map((req) => (
              <div
                key={req.id}
                className="p-3 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-[var(--text-primary)]">{req.serviceTitle}</div>
                  <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    Ordered on {new Date(req.requestedAt).toLocaleDateString('en-IN')} · Amount:{' '}
                    {req.priceChargedINR === 0 ? '₹0 (Pro Plan Benefit)' : `₹${req.priceChargedINR}`}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 ${
                      req.status === 'completed'
                        ? 'bg-[var(--status-success)]/15 text-[var(--status-success)]'
                        : req.status === 'in_progress'
                        ? 'bg-blue-500/15 text-blue-500'
                        : 'bg-amber-500/15 text-amber-500'
                    }`}
                  >
                    {req.status === 'completed' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </>
                    ) : req.status === 'in_progress' ? (
                      <>
                        <Clock className="w-3 h-3" /> In Progress
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" /> Queued
                      </>
                    )}
                  </span>

                  {req.completionUrl && (
                    <a
                      href={req.completionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--brand-primary)] hover:underline flex items-center gap-1 font-semibold"
                    >
                      View Report <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--text-secondary)]">No service requests placed yet.</p>
        )}
      </Card>

      {/* Confirmation Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h3 className="font-display font-bold text-base text-[var(--text-primary)]">
              Confirm Service Request
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              You are requesting <strong>{activeModalItem.title}</strong> for Mount Carmel Higher Secondary School.
            </p>

            <div className="p-3 bg-[var(--bg-subtle)] rounded-lg space-y-2 border border-[var(--border-subtle)]">
              <div className="flex justify-between">
                <span>Standard Fee:</span>
                <span className="font-mono">₹{activeModalItem.basePriceINR.toLocaleString('en-IN')}</span>
              </div>
              {isProPlan && activeModalItem.isFreeOnPro && (
                <div className="flex justify-between text-[var(--status-success)] font-semibold">
                  <span>Pro Plan Discount:</span>
                  <span className="font-mono">-₹{activeModalItem.basePriceINR.toLocaleString('en-IN')} (100% OFF)</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t border-[var(--border-subtle)] pt-1 text-sm text-[var(--text-primary)]">
                <span>Total Amount Payable:</span>
                <span className="font-mono text-[var(--brand-primary)]">
                  ₹{isProPlan && activeModalItem.isFreeOnPro ? 0 : activeModalItem.basePriceINR.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setActiveModalItem(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" loading={submitting} onClick={confirmOrder}>
                Confirm & Dispatch to Platform Team
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
