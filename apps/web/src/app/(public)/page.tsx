import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ArrowRight, BookOpen, CalendarDays, Award, GraduationCap, Sparkles } from 'lucide-react';

export default function PublicHomePage() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-[#163A2B] to-[var(--brand-primary)] text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Admissions Open for Academic Year 2025–26
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight">
            Nurturing Excellence, Character & Innovation
          </h1>
          <p className="text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Welcome to Mount Carmel School. We empower zirlai (students) with world-class facilities, dedicated faculty, and values for life.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/admission">
              <Button size="lg" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
                Apply For Admission
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="secondary">
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
    </div>
  );
}
