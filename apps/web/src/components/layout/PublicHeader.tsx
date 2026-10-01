'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
  Menu,
  X,
  Home,
  Info,
  Users,
  Building2,
  Trophy,
  Bell,
  Image,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  ChevronRight,
  LogIn,
  KeyRound,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About Us', href: '/about', icon: Info },
  { label: 'Faculty', href: '/faculty', icon: Users },
  { label: 'Facilities', href: '/facilities', icon: Building2 },
  { label: 'Activities', href: '/activities', icon: Trophy },
  { label: 'Notices', href: '/notices', icon: Bell },
  { label: 'Gallery', href: '/gallery', icon: Image }
];

export function PublicHeader() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [secretAdminOpen, setSecretAdminOpen] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [tapToast, setTapToast] = useState<string | null>(null);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const router = useRouter();

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Secret 5 Quick Taps Handler on Logo
  const handleLogoTap = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextCount = tapCount + 1;
    setTapCount(nextCount);

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (nextCount >= 5) {
      setSecretAdminOpen(true);
      setTapToast('🔓 Secret Admin Gateway Unlocked!');
      setTapCount(0);
      setTimeout(() => setTapToast(null), 3000);
    } else {
      if (nextCount >= 2) {
        setTapToast(`🔒 Tap ${5 - nextCount} more times for secret admin access...`);
      }
      tapTimerRef.current = setTimeout(() => {
        setTapCount(0);
        setTapToast(null);
      }, 2000);
    }
  };

  return (
    <>
      {/* Subtle Floating Secret Tap Toast Notification */}
      {tapToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs px-4 py-2 rounded-full shadow-2xl border border-emerald-500/50 flex items-center gap-2 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          <KeyRound className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-medium">{tapToast}</span>
        </div>
      )}

      {/* Main Header (Clean Public View without role ribbons) */}
      <header className="sticky top-0 z-40 bg-[#163A2B] text-white border-b border-[#0F2A1F] shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Dashboard Drawer Button (vei lam) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 active:scale-95 text-emerald-100 border border-emerald-500/40 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer"
              aria-label="Open Institutional Dashboard"
            >
              <Menu className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-semibold tracking-wide">Dashboard</span>
            </button>
          </div>

          {/* School Brand / Logo with Secret 5-Tap Gesture */}
          <div
            onClick={handleLogoTap}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer select-none group"
            title="Mount Carmel School (Quick tap 5x for Secret Admin)"
          >
            <div className="w-8 h-8 rounded-[8px] border border-white/40 flex items-center justify-center bg-white/10 shrink-0 group-active:scale-90 transition-transform">
              <span className="font-display font-bold text-sm">EP</span>
            </div>
            <div className="min-w-0">
              <span className="font-display font-bold text-sm sm:text-base block leading-none truncate">
                Mount Carmel School
              </span>
              <span className="text-[10px] text-white/70 block mt-0.5 truncate">
                Aizawl, Mizoram
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links (with Professional Stylish Click / Active States) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 text-xs font-medium">
            {NAV_ITEMS.map((item) => {
              const active = isLinkActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 py-1.5 rounded-full transition-all duration-200 flex items-center gap-1.5 active:scale-95 ${
                    active
                      ? 'bg-emerald-500/25 text-emerald-200 font-semibold border border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.35)] ring-1 ring-emerald-400/30'
                      : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent active:border-emerald-500/40'
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Public Quick Action CTA Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link href="/pay-fee">
              <Button variant="secondary" size="sm" className="active:scale-95 transition-all text-xs px-2.5 sm:px-3">
                Pay Fee
              </Button>
            </Link>
            <Link href="/admission" className="hidden xs:inline-flex">
              <Button variant="primary" size="sm" className="active:scale-95 transition-all text-xs px-2.5 sm:px-3">
                Apply Online
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* =================================================================================== */}
      {/* SECRET ADMIN GATEWAY MODAL (Unlocked via 5 Quick Taps on Logo) */}
      {/* =================================================================================== */}
      {secretAdminOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-2xl shadow-2xl p-6 text-white space-y-5 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Unlock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-white">
                    Secret Admin Gateway
                  </h3>
                  <span className="text-xs text-emerald-400/90 font-mono">
                    Authorized Personnel Access
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSecretAdminOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              You have unlocked the institutional admin access console via the secret logo gesture. Select your destination:
            </p>

            {/* Direct Admin Launch Cards */}
            <div className="space-y-2 text-xs">
              <Link
                href="/admin/dashboard"
                onClick={() => setSecretAdminOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-emerald-800/50 hover:bg-emerald-700/60 border border-emerald-500/40 text-emerald-100 font-semibold active:scale-95 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-emerald-300" />
                  <div>
                    <span className="block font-bold">School Admin Panel</span>
                    <span className="text-[10px] text-emerald-300/80 font-normal">Full CMS, fees, students & settings</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/admin/principal"
                onClick={() => setSecretAdminOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-200 font-semibold active:scale-95 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">👔</span>
                  <div>
                    <span className="block font-bold">Principal Cockpit</span>
                    <span className="text-[10px] text-amber-300/80 font-normal">10 live academic & fee KPIs</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/platform/tenants"
                onClick={() => setSecretAdminOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-500/40 text-indigo-200 font-semibold active:scale-95 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-300" />
                  <div>
                    <span className="block font-bold">Super Admin Engine</span>
                    <span className="text-[10px] text-indigo-300/80 font-normal">Multi-tenant provisioning & billing</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            {/* Standard Login Fallback */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Need password login?</span>
              <Link
                href="/login"
                onClick={() => setSecretAdminOpen(false)}
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Go to Login Screen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================================== */}
      {/* DASHBOARD DRAWER (Left / Vei Lam Side Navigation & Portals) */}
      {/* =================================================================================== */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Body (Slides in from Left / Vei Lam) */}
          <div className="relative w-80 max-w-[85vw] bg-[#0F2A1F] text-white h-full flex flex-col shadow-2xl border-r border-emerald-800/60 z-10 animate-in slide-in-from-left duration-300">
            {/* Drawer Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#163A2B]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-700/80 border border-emerald-400/40 flex items-center justify-center font-display font-bold text-xs">
                  EP
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm leading-tight text-white">
                    Mount Carmel School
                  </h3>
                  <span className="text-[10px] text-emerald-300 block">
                    Institutional Dashboard
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              
              {/* Section 1: Institutional Roles & Portals */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300/80 px-2 block mb-2">
                  Institutional Roles & Portals
                </span>
                <div className="space-y-1">
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-800/50 hover:bg-emerald-700/60 border border-emerald-600/40 text-emerald-100 font-semibold active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <LayoutDashboard className="w-4 h-4 text-emerald-300" />
                      <span>Admin Panel</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  </Link>

                  <Link
                    href="/admin/principal"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/50 border border-amber-600/40 text-amber-200 font-semibold active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <span>👔</span>
                      <span>Principal Cockpit</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-300 font-bold">
                      10 KPIs
                    </span>
                  </Link>

                  <Link
                    href="/platform/tenants"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-950/30 hover:bg-indigo-900/40 border border-indigo-600/30 text-indigo-300 active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
                      <span>Super Admin Engine</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                  </Link>

                  <Link
                    href="/portal/dashboard"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-white/70" />
                      <span>Student & Parent Portal</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                  </Link>

                  <Link
                    href="/plans"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-600/40 text-blue-200 font-semibold active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <span>⚡</span>
                      <span>Tier Plans & Add-ons</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-300 font-bold">
                      Calculator
                    </span>
                  </Link>
                </div>
              </div>

              {/* Section 2: School Public Pages */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300/80 px-2 block mb-2">
                  School Pages
                </span>
                <div className="space-y-1">
                  {NAV_ITEMS.map((item) => {
                    const active = isLinkActive(item.href);
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 active:scale-95 ${
                          active
                            ? 'bg-emerald-500/25 text-emerald-200 font-bold border border-emerald-400/60 shadow-[0_0_12px_rgba(52,211,153,0.3)] ring-1 ring-emerald-400/30'
                            : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent active:bg-emerald-600/30'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${active ? 'text-emerald-300' : 'text-white/60'}`} />
                          <span>{item.label}</span>
                        </span>
                        {active && (
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-300"></span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Section 3: Quick Action Services */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300/80 px-2 block mb-2">
                  Quick Actions
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/pay-fee"
                    onClick={() => setDrawerOpen(false)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-emerald-900/60 border border-emerald-600/40 text-emerald-200 hover:bg-emerald-800 text-center active:scale-95 transition-all"
                  >
                    <CreditCard className="w-5 h-5 mb-1 text-emerald-300" />
                    <span className="font-semibold text-xs">Pay Fees</span>
                    <span className="text-[9px] text-emerald-400/80">Instant UPI</span>
                  </Link>

                  <Link
                    href="/admission"
                    onClick={() => setDrawerOpen(false)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-emerald-600/40 border border-emerald-400/50 text-white hover:bg-emerald-600/60 text-center active:scale-95 transition-all"
                  >
                    <GraduationCap className="w-5 h-5 mb-1 text-white" />
                    <span className="font-semibold text-xs">Apply Online</span>
                    <span className="text-[9px] text-white/70">Admissions</span>
                  </Link>
                </div>

                <div className="mt-2">
                  <Link
                    href="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium active:scale-95 transition-all"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Staff & Student Login</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-3 bg-[#0b1f17] border-t border-white/10 text-center text-[10px] text-white/50">
              EduPortal Multi-Tenant SaaS · v2.0
            </div>
          </div>
        </div>
      )}
    </>
  );
}
