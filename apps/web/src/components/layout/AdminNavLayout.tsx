'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Database,
  Users,
  GraduationCap,
  CreditCard,
  CalendarCheck,
  Award,
  IdCard,
  Settings,
  ShieldAlert,
  BarChart3,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Package
} from 'lucide-react';

interface AdminNavLayoutProps {
  children: React.ReactNode;
}

export function AdminNavLayout({ children }: AdminNavLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    return pathname === href;
  };

  const navLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/content', label: 'Website CMS', icon: FileText },
    { href: '/admin/data-hub', label: 'Data Hub & Import', icon: Database, badge: 'PRO' },
    { href: '/admin/staff', label: 'Staff & Teachers', icon: Users, badge: 'PRO' },
    { href: '/admin/exams', label: 'Exams & Marksheets', icon: GraduationCap, badge: 'PRO' },
    { href: '/admin/id-cards', label: 'ID Card Generator', icon: IdCard, badge: 'PRO' },
    { href: '/admin/students', label: 'Students & Guardians', icon: Users },
    { href: '/admin/attendance', label: 'Daily Attendance', icon: CalendarCheck, badge: 'ULTIMATE' },
    { href: '/admin/certificates', label: 'Certificates & TC', icon: Award, badge: 'ULTIMATE' },
    { href: '/admin/fees', label: 'Fees & Receipts', icon: CreditCard },
    { href: '/admin/services', label: 'Add-on Services', icon: Package },
    { href: '/admin/settings', label: 'School Settings & Domain', icon: Settings },
    { href: '/admin/audit-logs', label: 'Audit Logs', icon: ShieldAlert },
  ];

  const executiveLinks = [
    { href: '/admin/analytics', label: 'Website Analytics', icon: BarChart3, badge: 'PRO' },
    { href: '/admin/principal', label: 'Principal Dashboard', icon: Briefcase, badge: 'PRO', highlight: true },
    { href: '/admin/builder', label: 'Custom Builder', icon: Layers, badge: 'ULTIMATE' },
    { href: '/admin/modules', label: 'Module Manager', icon: Layers, badge: 'ULTIMATE' },
  ];

  const renderNavContent = () => (
    <>
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center font-display font-bold text-xs text-white">
            EP
          </div>
          <div>
            <span className="font-display font-bold text-sm text-white block leading-tight">Mount Carmel Admin</span>
            <span className="text-[10px] text-emerald-300 block">School Management Suite</span>
          </div>
        </Link>
        {mobileOpen && (
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 text-xs font-medium overflow-y-auto">
        {navLinks.map((item) => {
          const active = isLinkActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150 active:scale-95 ${
                active
                  ? 'bg-emerald-500/25 text-emerald-200 font-bold border border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.25)] ring-1 ring-emerald-400/20'
                  : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent active:bg-emerald-700/30'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-300' : 'text-white/60'}`} />
                <span>{item.label}</span>
              </span>
              {item.badge ? (
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                  item.badge === 'ULTIMATE' ? 'bg-indigo-500/30 text-indigo-300' : 'bg-emerald-500/30 text-emerald-300'
                }`}>
                  {item.badge}
                </span>
              ) : active ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-300 shrink-0"></span>
              ) : null}
            </Link>
          );
        })}

        <div className="pt-3 border-t border-white/10 space-y-1">
          <span className="text-[10px] uppercase font-bold text-emerald-300/80 px-2 block mb-1">
            Executive & AI
          </span>
          {executiveLinks.map((item) => {
            const active = isLinkActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-150 active:scale-95 ${
                  active
                    ? 'bg-emerald-500/25 text-emerald-200 font-bold border border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.25)] ring-1 ring-emerald-400/20'
                    : item.highlight
                    ? 'bg-amber-950/40 border border-amber-600/30 text-amber-300 hover:bg-amber-900/50'
                    : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-amber-400' : 'text-white/60'}`} />
                  <span>{item.label}</span>
                </span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                    item.badge === 'PRO' && item.highlight
                      ? 'bg-amber-500/30 text-amber-300'
                      : 'bg-emerald-500/30 text-emerald-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-3 bg-[#0b1f17] border-t border-white/10 flex items-center justify-between text-[11px] text-white/60">
        <span>Role: School Admin</span>
        <Link href="/" target="_blank" className="text-emerald-400 hover:underline flex items-center gap-1">
          <span>Website</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-[var(--bg-base)] w-full max-w-full overflow-x-hidden">
      {/* Desktop Sidebar (Pinned on left, hidden on mobile) */}
      <aside className="hidden md:flex w-64 bg-[#163A2B] text-white flex-col shrink-0 border-r border-[#0F2A1F]">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer (Left / Vei Lam Side Navigation) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Body */}
          <div className="relative w-72 max-w-[85vw] bg-[#163A2B] text-white h-full flex flex-col shadow-2xl border-r border-emerald-800/60 z-10 animate-in slide-in-from-left duration-300">
            {renderNavContent()}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-x-hidden">
        {/* Admin Header */}
        <header className="h-14 bg-[var(--bg-surface)] border-b border-[var(--border-default)] px-3 sm:px-6 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Mobile Left: Dashboard Drawer Button (vei lam) */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 active:scale-95 text-emerald-100 border border-emerald-600/50 shadow-xs transition-all"
              aria-label="Open Admin Dashboard Menu"
            >
              <Menu className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-semibold">Dashboard</span>
            </button>

            <h2 className="font-display font-semibold text-xs sm:text-sm text-[var(--text-primary)] truncate">
              Admin Control Panel
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs shrink-0">
            <Link
              href="/"
              target="_blank"
              className="text-[var(--brand-primary)] font-semibold hover:underline text-xs flex items-center gap-1"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Admin Main Body */}
        <main className="flex-1 p-3 sm:p-6 overflow-y-auto overflow-x-hidden w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
