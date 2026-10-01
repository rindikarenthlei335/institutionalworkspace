import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { TrackerScript } from '@/features/analytics/components/TrackerScript';

export default function PublicWebsiteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      <TrackerScript />
      {/* Demo / Management Quick Switcher Ribbon */}
      <div className="bg-[#0b1f17] text-white/90 px-4 py-1.5 text-xs border-b border-white/10 flex flex-wrap items-center justify-between gap-2 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-emerald-300">EduPortal Multi-Tenant SaaS:</span>
          <span className="text-white/70 hidden sm:inline">Role & Feature Switcher:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <Link href="/admin/dashboard" className="px-2 py-0.5 rounded bg-emerald-700/60 hover:bg-emerald-600 text-white font-medium border border-emerald-500/30">
            🏫 Admin Panel
          </Link>
          <Link href="/admin/principal" className="px-2 py-0.5 rounded bg-amber-700/60 hover:bg-amber-600 text-white font-medium border border-amber-500/30">
            👔 Principal Cockpit
          </Link>
          <Link href="/admin/copilot" className="px-2 py-0.5 rounded bg-purple-700/60 hover:bg-purple-600 text-white font-medium border border-purple-500/30">
            ✨ AI Copilot
          </Link>
          <Link href="/platform/plans" className="px-2 py-0.5 rounded bg-blue-700/60 hover:bg-blue-600 text-white font-medium border border-blue-500/30">
            ⚡ Tier Plans
          </Link>
          <Link href="/platform/tenants" className="px-2 py-0.5 rounded bg-indigo-700/60 hover:bg-indigo-600 text-white font-medium border border-indigo-500/30">
            🌐 Super Admin
          </Link>
          <Link href="/portal/dashboard" className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white border border-white/20">
            🎓 Student Portal
          </Link>
          <Link href="/login" className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white border border-white/20">
            🔑 Login
          </Link>
        </div>
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#163A2B] text-white border-b border-[#0F2A1F]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-[8px] border border-white/40 flex items-center justify-center bg-white/10">
              <span className="font-display font-bold text-sm">EP</span>
            </div>
            <div>
              <span className="font-display font-bold text-base block leading-none">Mount Carmel School</span>
              <span className="text-[10px] text-white/70 block mt-0.5">Aizawl, Mizoram</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-white/80">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/faculty" className="hover:text-white transition-colors">Faculty</Link>
            <Link href="/facilities" className="hover:text-white transition-colors">Facilities</Link>
            <Link href="/activities" className="hover:text-white transition-colors">Activities</Link>
            <Link href="/notices" className="hover:text-white transition-colors">Notices</Link>
            <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/admin/dashboard" className="hidden lg:inline-flex">
              <Button variant="secondary" size="sm">Admin Panel</Button>
            </Link>
            <Link href="/pay-fee">
              <Button variant="secondary" size="sm">Pay Fee</Button>
            </Link>
            <Link href="/admission">
              <Button variant="primary" size="sm">Apply Online</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#0F2A1F] text-white/80 border-t border-white/10 py-12 px-4 text-xs">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-display font-bold text-sm text-white mb-3">Mount Carmel School</h4>
            <p className="text-white/60 leading-relaxed mb-4">
              Providing holistic education and character development since 1985.
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-3">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link href="/admission" className="hover:text-white">Online Admission</Link></li>
              <li><Link href="/pay-fee" className="hover:text-white">Pay Fees</Link></li>
              <li><Link href="/notices" className="hover:text-white">Notice Board</Link></li>
              <li><Link href="/login" className="hover:text-white">Portal Login</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-3">Contact Us</h5>
            <p className="leading-relaxed text-white/70">
              Aizawl, Mizoram - 796001<br />
              Phone: +91 98765 43210<br />
              Email: info@mountcarmel.edu.in
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-white mb-3">Powered By</h5>
            <p className="text-white/60 leading-relaxed">
              EduPortal Multi-Tenant Platform.<br />
              © {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
