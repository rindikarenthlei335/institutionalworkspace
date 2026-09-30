import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const navLinks = ['Home', 'Activities', 'Faculty', 'Facilities', 'About', 'Notices'];

export function WebsiteLayout({ children, active, onNavigate }: {
  children: React.ReactNode;
  active: string;
  onNavigate: (page: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-base flex flex-col">
      {/* Offline banner */}
      {/* <div className="bg-warning/10 border-b border-warning/50 text-center py-2 text-[12px] text-warning-fg font-semibold">Low internet detected — some content may not load.</div> */}

      <div className="bg-brand text-on-brand">
        <div className="max-w-7xl mx-auto px-6 h-8 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-5">
            <span>+91 11 2345 6789</span><span className="hidden sm:inline">info@dps-delhi.edu.in</span>
          </div>
          <div className="flex items-center gap-5">
            <button className="hover:underline underline-offset-4">Admission enquiry</button>
            <button className="flex items-center gap-1">English <ChevronDown className="w-3 h-3" strokeWidth={1.5}/></button>
          </div>
        </div>
      </div>
      <nav className="sticky top-0 z-50 bg-surface border-b border-border-default shadow-[0_2px_6px_rgba(15,26,20,0.10)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => onNavigate('Home')} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-brand-soft border border-border-default flex items-center justify-center">
              <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
              </svg>
            </div>
            <span className="font-display font-semibold text-[15px] text-fg">Delhi Public School</span>
          </button>

          <div className="hidden md:flex items-center gap-1 h-full">
            {navLinks.map(link => (
              <button key={link} onClick={() => onNavigate(link)}
                className={`relative px-3 h-full text-[13px] font-medium transition-colors after:absolute after:left-3 after:right-3 after:bottom-0 after:h-0.5 after:bg-brand ${active === link ? 'text-brand after:scale-x-100' : 'text-fg-muted hover:text-fg after:scale-x-0'}`}>
                {link === 'About' ? 'About the school' : link === 'Notices' ? 'Notice Board' : link}
              </button>
            ))}
          </div>

          <button onClick={() => {}}
            className="hidden md:block h-9 px-5 rounded-[6px] bg-brand text-on-brand text-[13px] font-semibold hover:opacity-90 transition-opacity">
            Parent and Student Portal
          </button>

          <button className="md:hidden w-10 h-10 rounded-[6px] flex items-center justify-center hover:bg-elevated transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5 text-fg" strokeWidth={1.5}/> : <Menu className="w-5 h-5 text-fg" strokeWidth={1.5}/>}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden border-t border-border-default bg-surface px-4 py-3 flex flex-col gap-1 animate-slide-up">
            {navLinks.map(link => (
              <button key={link} onClick={() => { onNavigate(link); setMobileOpen(false); }}
                className={`h-10 rounded-[4px] border-l-[3px] text-[13px] font-medium text-left px-4 ${active === link ? 'bg-brand-soft text-brand border-brand' : 'text-fg-muted border-transparent hover:bg-elevated'}`}>
                {link === 'About' ? 'About the school' : link === 'Notices' ? 'Notice Board' : link}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="bg-surface border-t border-border-default">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-[8px] bg-brand/15 border border-brand/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
              </div>
              <span className="font-display font-semibold text-[15px] text-fg">Delhi Public School</span>
            </div>
            <p className="text-sm text-fg-muted leading-relaxed">Excellence in education since 1982.</p>
            <p className="text-[11px] text-fg-muted mt-3">CBSE Affiliation No. 2730123</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-3">About</p>
            {['About', 'Faculty'].map(link => (
              <button key={link} onClick={() => onNavigate(link)} className="block text-sm text-fg-muted hover:text-fg transition-colors mb-2">{link}</button>
            ))}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-3">Academics</p>
            {['Activities', 'Facilities', 'Notice Board'].map(link => <p key={link} className="text-sm text-fg-muted mb-2">{link}</p>)}
          </div>
          <div>
            <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-3">Admissions</p>
            <p className="text-sm text-fg-muted mb-2">Admission enquiry</p>
            <p className="text-sm text-fg-muted mb-2">Academic Session 2024–25</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-3">Contact</p>
            <p className="text-sm text-fg-muted mb-2">12 School Road, New Delhi – 110001</p>
            <p className="text-sm text-fg-muted mb-2">+91 11 2345 6789</p>
            <p className="text-sm text-fg-muted">info@dps-delhi.edu.in</p>
          </div>
        </div>
        <div className="border-t border-border-default text-center py-4">
          <p className="text-[12px] text-fg-muted">© 2024 Delhi Public School. All rights reserved. · Powered by <span className="text-brand">EduPortal</span></p>
        </div>
      </footer>
    </div>
  );
}
