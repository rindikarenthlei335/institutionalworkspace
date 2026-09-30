import React from 'react';
import Link from 'next/link';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-[var(--bg-base)] flex flex-col shadow-xl border-x border-[var(--border-default)]">
      {/* Portal Top Bar */}
      <header className="h-14 bg-[#163A2B] text-white px-4 flex items-center justify-between shrink-0">
        <span className="font-display font-bold text-sm">Mount Carmel Parent Portal</span>
        <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 font-semibold">PWA</span>
      </header>

      {/* Portal Body */}
      <main className="flex-1 p-4 overflow-y-auto">{children}</main>

      {/* Bottom Tab Bar */}
      <nav className="h-16 bg-[var(--bg-surface)] border-t border-[var(--border-default)] flex items-center justify-around px-2 text-[10px] font-medium text-[var(--text-secondary)]">
        <Link href="/portal/dashboard" className="flex flex-col items-center hover:text-[var(--brand-primary)]">
          <span>🏠</span>
          <span>Home</span>
        </Link>
        <Link href="/portal/results" className="flex flex-col items-center hover:text-[var(--brand-primary)]">
          <span>📜</span>
          <span>Results</span>
        </Link>
        <Link href="/portal/fees" className="flex flex-col items-center hover:text-[var(--brand-primary)]">
          <span>💳</span>
          <span>Fees</span>
        </Link>
        <Link href="/portal/id-card" className="flex flex-col items-center hover:text-[var(--brand-primary)]">
          <span>🪪</span>
          <span>Digital ID</span>
        </Link>
        <Link href="/portal/notices" className="flex flex-col items-center hover:text-[var(--brand-primary)]">
          <span>📢</span>
          <span>Notices</span>
        </Link>
      </nav>
    </div>
  );
}
