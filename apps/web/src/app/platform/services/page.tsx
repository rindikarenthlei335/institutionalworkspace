import React from 'react';

export default function PlatformServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Add-on Services</span>
        <h1 className="font-display font-bold text-2xl text-white">Service Requests Queue</h1>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 space-y-4">
        <p className="text-xs text-slate-400">Queue for Google Submit, Google Maps registration, SEO packages, and white-label apps.</p>
        <div className="text-center py-8 text-slate-500 text-xs">
          No pending service requests in queue.
        </div>
      </div>
    </div>
  );
}
