'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  Sparkles,
  ShieldCheck,
  ChevronRight,
  LogIn
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
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Top Demo / Role Switcher Ribbon */}
      <div className="bg-[#0b1f17] text-white/90 px-3 sm:px-4 py-1.5 text-xs border-b border-white/10 flex items-center justify-between gap-2 z-50 overflow-x-auto scrollbar-none whitespace-nowrap">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-emerald-300">EduPortal Multi-Tenant SaaS:</span>
          <span className="text-white/70 hidden sm:inline">Role Switcher:</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] shrink-0">
          <Link
            href="/admin/dashboard"
            className="px-2 py-0.5 rounded bg-emerald-700/60 hover:bg-emerald-600 active:scale-95 text-white font-medium border border-emerald-500/30 transition-all"
          >
            🏫 Admin Panel
          </Link>
          <Link
            href="/admin/principal"
            className="px-2 py-0.5 rounded bg-amber-700/60 hover:bg-amber-600 active:scale-95 text-white font-medium border border-amber-500/30 transition-all"
          >
            👔 Principal Cockpit
          </Link>
          <Link
            href="/admin/copilot"
            className="px-2 py-0.5 rounded bg-purple-700/60 hover:bg-purple-600 active:scale-95 text-white font-medium border border-purple-500/30 transition-all"
          >
            ✨ AI Copilot
          </Link>
          <Link
            href="/plans"
            className="px-2 py-0.5 rounded bg-blue-700/60 hover:bg-blue-600 active:scale-95 text-white font-medium border border-blue-500/30 transition-all"
          >
            ⚡ Tier Plans & Add-ons
          </Link>
          <Link
            href="/platform/tenants"
            className="px-2 py-0.5 rounded bg-indigo-700/60 hover:bg-indigo-600 active:scale-95 text-white font-medium border border-indigo-500/30 transition-all"
          >
            🌐 Super Admin
          </Link>
          <Link
            href="/portal/dashboard"
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 transition-all"
          >
            🎓 Student Portal
          </Link>
          <Link
            href="/login"
            className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 active:scale-95 text-white border border-white/20 transition-all"
          >
            🔑 Login
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#163A2B] text-white border-b border-[#0F2A1F] shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Mobile Left: Dashboard Drawer Button (vei lam) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-800/90 hover:bg-emerald-700 active:scale-95 text-emerald-100 border border-emerald-500/40 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Open Mobile Dashboard & Menu"
            >
              <Menu className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-semibold tracking-wide">Dashboard</span>
            </button>
          </div>

          {/* School Brand / Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-[8px] border border-white/40 flex items-center justify-center bg-white/10 shrink-0">
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
          </Link>

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
                      : 'text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 border border-transparent active:bg-emerald-600/30 active:border-emerald-400/50'
                  }`}
                >
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse shrink-0"></span>
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Quick Action CTA Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link href="/admin/dashboard" className="hidden lg:inline-flex">
              <Button variant="secondary" size="sm" className="active:scale-95 transition-all text-xs">
                Admin Panel
              </Button>
            </Link>
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

      {/* Mobile Drawer (Left / Vei Lam Side Navigation & Dashboard) */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setMobileDrawerOpen(false)}
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
                    Dashboard & Mobile Menu
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
              
              {/* Section 1: Institutional Roles & Dashboards */}
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300/80 px-2 block mb-2">
                  Institutional Dashboards
                </span>
                <div className="space-y-1">
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-800/50 hover:bg-emerald-700/60 border border-emerald-600/40 text-emerald-100 font-semibold active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <LayoutDashboard className="w-4 h-4 text-emerald-300" />
                      <span>Admin Dashboard</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                  </Link>

                  <Link
                    href="/admin/principal"
                    onClick={() => setMobileDrawerOpen(false)}
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
                    href="/admin/copilot"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-600/40 text-purple-200 font-semibold active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-purple-300" />
                      <span>AI Copilot</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300 font-bold">
                      Mizo + EN
                    </span>
                  </Link>

                  <Link
                    href="/plans"
                    onClick={() => setMobileDrawerOpen(false)}
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

                  <Link
                    href="/portal/dashboard"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/90 active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-white/70" />
                      <span>Student & Parent Portal</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/50" />
                  </Link>

                  <Link
                    href="/platform/tenants"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-indigo-950/30 hover:bg-indigo-900/40 border border-indigo-600/30 text-indigo-300 active:scale-95 transition-all"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Super Admin Engine</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                  </Link>
                </div>
              </div>

              {/* Section 2: School Public Pages (with Active Pill & Stylish Outline) */}
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
                        onClick={() => setMobileDrawerOpen(false)}
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
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-emerald-900/60 border border-emerald-600/40 text-emerald-200 hover:bg-emerald-800 text-center active:scale-95 transition-all"
                  >
                    <CreditCard className="w-5 h-5 mb-1 text-emerald-300" />
                    <span className="font-semibold text-xs">Pay Fees</span>
                    <span className="text-[9px] text-emerald-400/80">Instant UPI</span>
                  </Link>

                  <Link
                    href="/admission"
                    onClick={() => setMobileDrawerOpen(false)}
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
                    onClick={() => setMobileDrawerOpen(false)}
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
