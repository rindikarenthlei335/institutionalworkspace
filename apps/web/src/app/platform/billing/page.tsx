import React from 'react';
import { SaaSBillingTracker } from '@/features/platform/components/SaaSBillingTracker';

export default function PlatformBillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Financial Subscriptions</span>
        <h1 className="font-display font-bold text-2xl text-white">SaaS Billing Tracker & Invoices</h1>
      </div>

      <SaaSBillingTracker />
    </div>
  );
}
