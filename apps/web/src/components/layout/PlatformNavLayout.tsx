'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Users,
  Layers,
  CreditCard,
  Globe,
  Briefcase,
  Smartphone,
  ExternalLink
} from 'lucide-react';

export function PlatformNavLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: '/platform/tenants', label: 'Tenants Directory', icon: Users },
    { href: '/platform/plans', label: 'Plans & Feature Flags', icon: Layers },
    { href: '/platform/billing', label: 'SaaS Billing Tracker', icon: CreditCard },
    { href: '/platform/domains', label: 'Managed Domains Queue', icon: Globe },
    { href: '/platform/services', label: 'Service Requests', icon: Briefcase },
    { href: '/platform/apps', label: 'App Publishing & Stores', icon: Smartphone },
  ];

  const renderNav = () => (
    <>
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        <div>
          <span className="font-display font-bold text-base text-emerald-400 block">EduPortal Control</span>
          <span className="text-[10px] text-slate-400 block">Platform Owner Engine</span>
        </div>
        {mobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="p-3 space-y-1 text-xs font-medium flex-1 overflow-y-auto">
        {links.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all active:scale-95 ${
                active
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <span>Platform Super Admin</span>
        <Link href="/" target="_blank" className="text-emerald-400 hover:underline flex items-center gap-1">
          <span>Public</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 text-white w-full max-w-full overflow-x-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-950 border-r border-slate-800 flex-col shrink-0">
        {renderNav()}
      </aside>

      {/* Mobile Header with Left Dashboard Button */}
      <header className="md:hidden h-14 bg-slate-950 border-b border-slate-800 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold border border-emerald-600/50"
          >
            <Menu className="w-4 h-4 text-emerald-300" />
            <span>Dashboard</span>
          </button>
          <span className="font-display font-bold text-xs text-emerald-400">EduPortal Engine</span>
        </div>
        <Link href="/" target="_blank" className="text-xs text-slate-400 hover:text-white">
          Public Site ↗
        </Link>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] bg-slate-950 text-white h-full flex flex-col shadow-2xl border-r border-slate-800 z-10 animate-in slide-in-from-left duration-200">
            {renderNav()}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-3 sm:p-8 overflow-y-auto overflow-x-hidden min-w-0 w-full max-w-full">
        {children}
      </div>
    </div>
  );
}
