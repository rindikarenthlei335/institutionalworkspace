import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, BookOpen, CalendarDays, Award, GraduationCap, Sparkles } from 'lucide-react';

export default function PublicHomePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner with School Campus Photo & Gradient Overlay */}
      <section 
        className="relative bg-[#163A2B] text-white py-24 px-4 text-center overflow-hidden"
        style={{
          // Demo high-res prestigious school campus architecture photo with brand green overlay
          backgroundImage: `linear-gradient(to bottom, rgba(15, 42, 31, 0.86), rgba(22, 58, 43, 0.93)), url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1920&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Subtle glass overlay */}
        <div className="absolute inset-0 bg-radial from-emerald-400/10 via-transparent to-black/25 pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-xs font-semibold text-white/95 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Admissions Open for Academic Year 2025–26
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-md">
            Nurturing Excellence, Character & Innovation
          </h1>
          <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Welcome to Mount Carmel School. We empower zirlai (students) with world-class facilities, dedicated faculty, and values for life.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/admission">
              <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                Apply For Admission
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-white/40 shadow-xs">
                Explore Campus
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Highlights */}
      <section className="max-w-7xl mx-auto px-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Academic Excellence', desc: '100% board pass percentage with top state ranks.', icon: GraduationCap },
          { title: 'Modern Facilities', desc: 'State of the art science labs, computer rooms & digital library.', icon: BookOpen },
          { title: 'Co-Curricular Sports', desc: 'Annual sports meets, basketball court & indoor games arena.', icon: Award },
          { title: 'Active Notice Board', desc: 'Stay updated with upcoming events, exams & holidays.', icon: CalendarDays }
        ].map((item, i) => (
          <Card key={i} className="hover:border-[var(--brand-primary)] transition-all">
            <item.icon className="w-8 h-8 text-[var(--brand-primary)] mb-3" />
            <h3 className="font-display font-bold text-base text-[var(--text-primary)] mb-1">{item.title}</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
          </Card>
        ))}
      </section>

      {/* Latest Notices */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[11px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider">Announcement Ticker</span>
            <h2 className="font-display font-bold text-2xl text-[var(--text-primary)]">Latest School Notices</h2>
          </div>
          <Link href="/notices" className="text-xs font-semibold text-[var(--brand-primary)] hover:underline">
            View All Notices →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: 'Annual Sports Meet 2025', date: 'Dec 15, 2024', cat: 'Event', desc: 'All students must assemble at the main ground by 8:30 AM in full sports uniform.' },
            { title: 'Winter Break Announcement', date: 'Dec 12, 2024', cat: 'Holiday', desc: 'School will remain closed for winter vacation from Dec 22nd to Jan 10th.' }
          ].map((notice, i) => (
            <Card key={i} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--brand-primary-soft)] text-[var(--brand-primary)]">
                    {notice.cat}
                  </span>
                  <span className="text-[11px] text-[var(--text-secondary)] tabular-nums">{notice.date}</span>
                </div>
                <h4 className="font-display font-semibold text-base text-[var(--text-primary)] mb-1">{notice.title}</h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{notice.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* SaaS Portals & Feature Hub Section */}
      <section className="max-w-7xl mx-auto px-4 pt-4 border-t border-[var(--border-default)]">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider">
            ⚡ Platform Portals & Features
          </span>
          <h2 className="font-display font-bold text-3xl text-[var(--text-primary)]">
            Explore All Management Portals & Modules
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Click into any institutional portal below to test the full live SaaS platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'School Admin Panel',
              badge: 'ADMIN',
              color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
              href: '/admin/dashboard',
              desc: 'Full administrative control for students, staff, classes, website content, and fees.'
            },
            {
              title: 'Principal Cockpit (10 KPIs)',
              badge: 'LEADERSHIP',
              color: 'bg-amber-50 border-amber-200 text-amber-800',
              href: '/admin/principal',
              desc: 'Executive dashboard with 10 real-time KPIs, revenue velocity, fee health, and staff attendance.'
            },
            {
              title: 'AI Copilot Studio',
              badge: 'AI ULTIMATE',
              color: 'bg-purple-50 border-purple-200 text-purple-800',
              href: '/admin/copilot',
              desc: 'Bilingual AI assistant with 4 specialized modes, safe draft confirmation, and 3,000 quota.'
            },
            {
              title: 'SaaS Tier Plans & Pricing',
              badge: 'SAAS TIERS',
              color: 'bg-blue-50 border-blue-200 text-blue-800',
              href: '/platform/plans',
              desc: 'Starter, Growth, Ultimate, and Enterprise tiers with live feature gating & module comparison.'
            },
            {
              title: 'Super Admin & Multi-Tenancy',
              badge: 'PLATFORM',
              color: 'bg-indigo-50 border-indigo-200 text-indigo-800',
              href: '/platform/tenants',
              desc: 'Super administrator platform to manage schools, domains, subscriptions, and billing.'
            },
            {
              title: 'Data Hub & Bulk Import',
              badge: 'DATA HUB',
              color: 'bg-teal-50 border-teal-200 text-teal-800',
              href: '/admin/data-hub',
              desc: 'High-speed CSV/Excel importer for students, staff, grades, and attendance with live validation.'
            },
            {
              title: 'Exams & Marksheets Generator',
              badge: 'ACADEMICS',
              color: 'bg-rose-50 border-rose-200 text-rose-800',
              href: '/admin/exams',
              desc: 'Exam scheduling, subject-wise marks entry, and official verifiable digital marksheet generator.'
            },
            {
              title: 'PVC ID Card Generator',
              badge: 'STUDIO',
              color: 'bg-cyan-50 border-cyan-200 text-cyan-800',
              href: '/admin/id-cards',
              desc: 'High-resolution PVC ID card studio with photo uploads, QR codes, and batch printing.'
            },
            {
              title: 'Student & Parent Portal',
              badge: 'PORTAL',
              color: 'bg-slate-50 border-slate-200 text-slate-800',
              href: '/portal/dashboard',
              desc: 'Dedicated student portal for live report cards, digital ID card, fee receipts, and school notices.'
            }
          ].map((portal, i) => (
            <Link key={i} href={portal.href} className="group block">
              <Card className="h-full hover:shadow-lg hover:border-emerald-500 transition-all border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${portal.color}`}>
                    {portal.badge}
                  </span>
                  <span className="text-xs text-slate-400 group-hover:text-emerald-600 transition-colors">
                    Open Portal →
                  </span>
                </div>
                <h3 className="font-display font-bold text-base text-[var(--text-primary)] group-hover:text-emerald-700 transition-colors mb-1.5">
                  {portal.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {portal.desc}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
