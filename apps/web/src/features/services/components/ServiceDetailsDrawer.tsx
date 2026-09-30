'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ServiceCatalogItem } from '../types';
import { PlanTier } from '@eduportal/shared';
import {
  X,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { SERVICE_STORE_ETA_DISCLAIMER } from '../lib/eta';

interface ServiceDetailsDrawerProps {
  service: ServiceCatalogItem | null;
  currentPlan: PlanTier;
  isSelected: boolean;
  onToggleSelect: (service: ServiceCatalogItem) => void;
  onClose: () => void;
}

export function ServiceDetailsDrawer({
  service,
  currentPlan,
  isSelected,
  onToggleSelect,
  onClose
}: ServiceDetailsDrawerProps) {
  if (!service) return null;

  const pricing = service.pricing[currentPlan] || { priceType: 'fixed', amountINR: 0 };
  const isFree = pricing.priceType === 'free' || pricing.amountINR === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {service.category.replace('_', ' ')}
              </span>
              {isFree ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                  Included in your Plan
                </span>
              ) : pricing.discountPct ? (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                  {pricing.discountPct}% Discount with {currentPlan.toUpperCase()}
                </span>
              ) : null}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              {service.titleEn}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">
              {service.titleLus}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* One line benefit banner */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-950 dark:text-blue-200">
                {service.oneLineBenefitEn}
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-400 mt-0.5">
                {service.oneLineBenefitLus}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Layers className="w-4 h-4 text-blue-500" />
              Overview & Scope
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              {service.descriptionEn}
            </p>
          </div>

          {/* Deliverables Checklist */}
          {service.deliverables && service.deliverables.length > 0 && (
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-2">
              <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                What is Delivered
              </h3>
              <ul className="space-y-2 pt-1">
                {service.deliverables.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Documents */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-purple-500" />
              Documents Needed ({service.requiredDocuments.length})
            </h3>
            {service.requiredDocuments.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                No preliminary documents required. Setup begins immediately after checkout.
              </p>
            ) : (
              <div className="space-y-2">
                {service.requiredDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {doc.labelEn}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {doc.labelLus}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                        <span>Formats: {doc.types.join(', ').toUpperCase()}</span>
                        <span>•</span>
                        <span>Max {doc.maxMb} MB</span>
                      </div>
                    </div>
                    {doc.hasTemplate && (
                      <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        Word (.docx) Template Available
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Turnaround & ETA */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 space-y-2">
            <h3 className="font-semibold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Turnaround Time
            </h3>
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
              Usually {service.etaMinDays} to {service.etaMaxDays} working days after payment and complete documents.
            </p>
            {service.etaNote && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Note: {service.etaNote}
              </p>
            )}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-normal">
                {SERVICE_STORE_ETA_DISCLAIMER}
              </p>
            </div>
          </div>

          {/* Cancellation & Refund Rule */}
          <div className="p-4 rounded-xl border border-amber-200/60 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10 space-y-1">
            <h3 className="font-semibold text-amber-900 dark:text-amber-300 text-xs uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Refund & Cancellation Policy
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
              {service.cancelRefundRule}
            </p>
          </div>
        </div>

        {/* Footer with Price & Action */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
              Price for your {currentPlan.toUpperCase()} plan:
            </span>
            <div className="flex items-baseline gap-2">
              {isFree ? (
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  FREE
                </span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">
                    ₹{pricing.amountINR.toLocaleString('en-IN')}
                  </span>
                  {pricing.priceType === 'work_fee_plus_actual' && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      + actual registrar cost
                    </span>
                  )}
                  {service.isRecurring && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      / {service.recurringInterval}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          <Button
            variant={isSelected ? 'secondary' : 'primary'}
            onClick={() => onToggleSelect(service)}
            className="px-6 py-2.5"
          >
            {isSelected ? 'Remove from Cart' : 'Tick to Add to Cart'}
          </Button>
        </div>
      </div>
    </div>
  );
}
