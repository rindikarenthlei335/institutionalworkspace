import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function PublicWebsiteLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
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

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-white/80">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/faculty" className="hover:text-white transition-colors">Faculty</Link>
            <Link href="/facilities" className="hover:text-white transition-colors">Facilities</Link>
            <Link href="/activities" className="hover:text-white transition-colors">Activities</Link>
            <Link href="/notices" className="hover:text-white transition-colors">Notices</Link>
            <Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link>
          </nav>

          <div className="flex items-center gap-2">
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
