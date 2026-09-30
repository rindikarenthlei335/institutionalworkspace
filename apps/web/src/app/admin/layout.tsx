import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-[var(--bg-base)]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#163A2B] text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white/10 border border-white/30 flex items-center justify-center font-display font-bold text-xs">
              EP
            </div>
            <div>
              <span className="font-display font-bold text-sm block">Mount Carmel Admin</span>
              <span className="text-[10px] text-white/60 block">School Management</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 text-xs font-medium">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-white/10 transition-colors">
            <span>Dashboard</span>
          </Link>
          <Link href="/admin/content" className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-white/10 transition-colors">
            <span>Website CMS</span>
          </Link>
          <Link href="/admin/data-hub" className="flex items-center justify-between px-3 py-2 rounded-[6px] hover:bg-white/10 text-white font-medium transition-colors">
            <span>Data Hub & Import</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold">PRO</span>
          </Link>
          <Link href="/admin/staff" className="flex items-center justify-between px-3 py-2 rounded-[6px] hover:bg-white/10 text-white font-medium transition-colors">
            <span>Staff & Teachers</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold">PRO</span>
          </Link>
          <Link href="/admin/exams" className="flex items-center justify-between px-3 py-2 rounded-[6px] hover:bg-white/10 text-white font-medium transition-colors">
            <span>Exams & Marksheets</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold">PRO</span>
          </Link>
          <Link href="/admin/id-cards" className="flex items-center justify-between px-3 py-2 rounded-[6px] hover:bg-white/10 text-white font-medium transition-colors">
            <span>ID Card Generator</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 text-emerald-300 font-bold">PRO</span>
          </Link>
          <Link href="/admin/students" className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-white/10 transition-colors">
            <span>Students & Guardians</span>
          </Link>
          <Link href="/admin/fees" className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-white/10 transition-colors">
            <span>Fees & Receipts</span>
          </Link>
          <Link href="/admin/services" className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-white/10 transition-colors">
            <span>Add-on Services</span>
          </Link>
          <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-white/10 transition-colors">
            <span>School Settings & Domain</span>
          </Link>
          <Link href="/admin/audit-logs" className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-white/10 transition-colors">
            <span>Audit Logs</span>
          </Link>
          <div className="pt-4 border-t border-white/10 space-y-1">
            <Link href="/admin/analytics" className="flex items-center justify-between px-3 py-2 rounded-[6px] hover:bg-white/10 text-white font-medium transition-colors">
              <span>Website Analytics</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/20">PRO</span>
            </Link>
            <Link href="/admin/principal" className="flex items-center justify-between px-3 py-2 rounded-[6px] bg-white/10 text-yellow-300 font-semibold hover:bg-white/20 transition-colors">
              <span>Principal Dashboard</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-400/20">PRO</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10 text-[11px] text-white/60">
          <span>Role: Super Admin</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-[var(--bg-surface)] border-b border-[var(--border-default)] px-6 flex items-center justify-between">
          <h2 className="font-display font-semibold text-sm text-[var(--text-primary)]">Admin Control Panel</h2>
          <div className="flex items-center gap-3 text-xs">
            <Link href="/" target="_blank" className="text-[var(--brand-primary)] font-semibold hover:underline">
              View Public Website ↗
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
