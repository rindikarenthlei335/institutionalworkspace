import React from 'react';
import Link from 'next/link';

export default function PlatformOwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 p-4 space-y-6 border-r border-slate-800 shrink-0">
        <div>
          <span className="font-display font-bold text-base text-emerald-400 block">EduPortal Control</span>
          <span className="text-[10px] text-slate-400 block">Platform Owner Panel</span>
        </div>

        <nav className="space-y-1 text-xs font-medium">
          <Link href="/platform/tenants" className="flex items-center gap-3 px-3 py-2 rounded bg-slate-800 text-white">
            <span>Tenants Directory</span>
          </Link>
          <Link href="/platform/plans" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
            <span>Plans & Feature Flags</span>
          </Link>
          <Link href="/platform/domains" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
            <span>Managed Domains Queue</span>
          </Link>
          <Link href="/platform/services" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-slate-800 text-slate-300">
            <span>Service Requests</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">{children}</div>
    </div>
  );
}
