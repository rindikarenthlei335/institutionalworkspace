import React from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { TrackerScript } from '@/features/analytics/components/TrackerScript';

export default function PublicWebsiteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      <TrackerScript />
      {/* Responsive Header with Mobile Left Dashboard Drawer and Active Links */}
      <PublicHeader />

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
