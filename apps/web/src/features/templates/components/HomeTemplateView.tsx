'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { THEME_PRESETS } from '@eduportal/shared';
import { MASTER_TEMPLATES } from '../data/templates';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Award,
  GraduationCap,
  Bus,
  FlaskConical,
  Library,
  Users,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Play,
  Star,
  ExternalLink,
  Palette,
  Layout
} from 'lucide-react';

export function HomeTemplateView() {
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template-1-trident');
  const [activeThemeId, setActiveThemeId] = useState<string>('forest');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTmpl = localStorage.getItem('eduportal_active_template');
      if (savedTmpl) setActiveTemplateId(savedTmpl);

      const savedTheme = localStorage.getItem('eduportal_active_theme');
      if (savedTheme) {
        setActiveThemeId(savedTheme);
        const preset = THEME_PRESETS.find(p => p.id === savedTheme);
        if (preset) {
          document.documentElement.style.setProperty('--brand-primary', preset.primaryHex);
          document.documentElement.style.setProperty('--brand-primary-hover', preset.primaryHoverHex);
          document.documentElement.style.setProperty('--brand-primary-soft', preset.primarySoftHex);
        }
      }
    }
  }, []);

  const handleTemplateSwitch = (id: string) => {
    setActiveTemplateId(id);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eduportal_active_template', id);
    }
  };

  const handleThemeSwitch = (themeId: string) => {
    setActiveThemeId(themeId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eduportal_active_theme', themeId);
      const preset = THEME_PRESETS.find(p => p.id === themeId);
      if (preset) {
        document.documentElement.style.setProperty('--brand-primary', preset.primaryHex);
        document.documentElement.style.setProperty('--brand-primary-hover', preset.primaryHoverHex);
        document.documentElement.style.setProperty('--brand-primary-soft', preset.primarySoftHex);
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Interactive Template & Theme Switcher Bar for Demonstration */}
      <section className="bg-slate-900 text-white border-b border-slate-800 py-2.5 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold text-white">Live Website Template Switcher:</span>
            <span className="text-[11px] text-slate-400 hidden sm:inline">
              (Choose any of the 4 Essential Tier designs below)
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: 'template-1-trident', label: '1. Trident Classic', badge: 'Basic' },
              { id: 'template-2-brightfuture', label: '2. Bright Future Navy', badge: 'Essential' },
              { id: 'template-3-unipix', label: '3. Unipix Crimson', badge: 'Essential' },
              { id: 'template-4-nuova', label: '4. Nuova Modern', badge: 'Essential' },
            ].map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleTemplateSwitch(tmpl.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTemplateId === tmpl.id
                    ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span>{tmpl.label}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                  tmpl.badge === 'Basic' ? 'bg-black/30 text-emerald-300' : 'bg-black/30 text-amber-300'
                }`}>
                  {tmpl.badge}
                </span>
              </button>
            ))}
          </div>

          {/* Theme Palette Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-400">Theme:</span>
            {THEME_PRESETS.slice(0, 4).map((p) => (
              <button
                key={p.id}
                title={p.name}
                onClick={() => handleThemeSwitch(p.id)}
                className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                  activeThemeId === p.id ? 'scale-125 border-white ring-1 ring-white/50' : 'border-black/30 opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: p.primaryHex }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =================================================================================== */}
      {/* TEMPLATE 1: TRIDENT PUBLIC CLASSIC (Indian K-12 Campus Facade & Bus Infrastructure) */}
      {/* =================================================================================== */}
      {activeTemplateId === 'template-1-trident' && (
        <div className="space-y-12 animate-in fade-in duration-300">
          
          {/* Hero Banner with Campus Facade Photo */}
          <section
            className="relative bg-[#163A2B] text-white py-20 px-4 text-center overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(15, 42, 31, 0.88), rgba(22, 58, 43, 0.94)), url('https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1920&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="relative max-w-4xl mx-auto space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-xs font-semibold text-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Admissions Open for Academic Year 2025–26
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Inspiring Excellence, Building <span className="text-yellow-400">Futures</span>
              </h1>

              <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                At Mount Carmel / Trident Public School, we nurture young minds with strong values, modern learning, and boundless opportunities.
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-3">
                <Link href="/admission">
                  <Button size="lg" variant="primary" className="bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-bold border-yellow-400">
                    Admission Open →
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-white/40">
                    Explore Campus
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Quick Facility Ticker Bar (Image 3 Style) */}
          <section className="max-w-7xl mx-auto px-4 -mt-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
              {[
                { title: 'Smart Classrooms', sub: 'Technology-enabled learning', icon: '💻' },
                { title: 'Experienced Faculty', sub: 'Qualified mentors who inspire', icon: '👥' },
                { title: 'Safe Transport', sub: 'GPS-enabled buses for secure travel', icon: '🚌' },
                { title: 'Holistic Development', sub: 'Mind · Body · Values balanced growth', icon: '🌱' },
                { title: 'Modern Labs', sub: 'Well-equipped labs for practical science', icon: '🔬' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Welcome & CBSE Stats Section */}
          <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-5 rounded-2xl overflow-hidden shadow-md border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop"
                alt="School assembly & bus"
                className="w-full h-72 object-cover"
              />
            </div>
            <div className="md:col-span-7 space-y-4">
              <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Welcome to Our School</span>
              <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">
                Dedicated to developing confident, compassionate global citizens
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                We blend academic rigor with character building, digital pedagogy, and sportsmanship to prepare students for a successful future.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {[
                  { label: 'Affiliation', val: 'CBSE' },
                  { label: 'Teacher Ratio', val: '1:20' },
                  { label: 'Years of Excellence', val: '20+' },
                  { label: 'Commitment', val: '100%' }
                ].map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                    <span className="text-base font-bold text-emerald-800 dark:text-emerald-300 font-mono block">{s.val}</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* World-Class Infrastructure Gallery Grid */}
          <section className="max-w-7xl mx-auto px-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider">Campus Facilities</span>
                <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">World-Class Infrastructure</h3>
              </div>
              <Link href="/facilities" className="text-xs font-semibold text-emerald-700 hover:underline">
                View All Facilities →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Smart Classrooms', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop', desc: 'Interactive digital smart boards and high-speed audio-visual aids.' },
                { title: 'Science Laboratories', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop', desc: 'Well-equipped labs to encourage hands-on research and discovery.' },
                { title: 'Central Library', img: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop', desc: 'Rich collection of over 15,000 curriculum and reference volumes.' },
                { title: 'Safe Transport Buses', img: 'https://images.unsplash.com/photo-1570126618953-d437176e8c79?q=80&w=600&auto=format&fit=crop', desc: 'Fleet of GPS-monitored buses covering all major town routes.' }
              ].map((fac, i) => (
                <div key={i} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group">
                  <div className="h-40 overflow-hidden">
                    <img src={fac.img} alt={fac.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-3.5 space-y-1">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{fac.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{fac.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {/* =================================================================================== */}
      {/* TEMPLATE 2: BRIGHT FUTURE INTERNATIONAL (Navy Blue & Gold, Blazer Uniforms, 5 Stages) */}
      {/* =================================================================================== */}
      {activeTemplateId === 'template-2-brightfuture' && (
        <div className="space-y-12 animate-in fade-in duration-300">
          
          {/* Navy Hero with Blazer Uniform Students */}
          <section className="relative bg-[#0F2C59] text-white py-20 px-4 text-center overflow-hidden">
            <div className="relative max-w-4xl mx-auto space-y-6 z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-xs font-semibold text-white shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                A Legacy of Excellence Since 1998
              </div>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Inspiring Minds. <span className="text-amber-400">Shaping Futures.</span>
              </h1>

              <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                A nurturing international environment where students learn, grow, and thrive to become tomorrow's visionary leaders.
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-3">
                <Link href="/admission">
                  <Button size="lg" variant="primary" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold border-amber-400">
                    Discover Our School →
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-white/40">
                    Watch School Tour
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Navy Pill Highlights Bar */}
          <section className="max-w-7xl mx-auto px-4 -mt-6">
            <div className="bg-[#0B1F3D] text-white rounded-xl shadow-xl p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              {[
                { title: 'Holistic Education', desc: 'Academic, emotional & social growth' },
                { title: 'Expert Educators', desc: 'Dedicated mentors with global exposure' },
                { title: 'Innovative Learning', desc: 'Creative experiential teaching methods' },
                { title: 'Global Perspective', desc: 'Preparing students for a connected world' },
                { title: 'Safe & Supportive', desc: 'Secure campus where every child thrives' }
              ].map((item, i) => (
                <div key={i} className="p-2 border-l border-white/10 pl-3">
                  <h4 className="font-bold text-white text-xs">{item.title}</h4>
                  <p className="text-[10px] text-white/70 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5-Stage Educational Pathway Section (Image 4 Style) */}
          <section className="max-w-7xl mx-auto px-4 space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs uppercase font-bold text-blue-700 tracking-wider">Academics</span>
              <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Discover Our Programs</h2>
              <p className="text-xs text-slate-500">A comprehensive curriculum designed to inspire and challenge every learner.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { stage: 'Early Years', age: 'Ages 3–5', desc: 'A nurturing start for lifelong learners.' },
                { stage: 'Primary School', age: 'Grades 1–5', desc: 'Building strong foundations for the future.' },
                { stage: 'Middle School', age: 'Grades 6–8', desc: 'Encouraging curiosity and critical thinking.' },
                { stage: 'High School', age: 'Grades 9–12', desc: 'Preparing leaders for college and beyond.' },
                { stage: 'Co-Curricular', age: 'Clubs & Sports', desc: 'Exploring talents beyond the classroom.' }
              ].map((prog, i) => (
                <Card key={i} className="hover:border-blue-700 transition-all p-4 space-y-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 inline-block">{prog.age}</span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{prog.stage}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{prog.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Dark Navy Executive Stats Banner */}
          <section className="bg-[#0B1F3D] text-white py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-5 gap-6 text-center">
              {[
                { num: '25+', label: 'Years of Excellence' },
                { num: '1,500+', label: 'Students Enrolled' },
                { num: '120+', label: 'Qualified Teachers' },
                { num: '100+', label: 'Awards Won' },
                { num: '98%', label: 'University Acceptance' }
              ].map((st, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-3xl sm:text-4xl font-display font-bold text-amber-400 block font-mono">{st.num}</span>
                  <span className="text-xs text-white/80">{st.label}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {/* =================================================================================== */}
      {/* TEMPLATE 3: UNIPIX COLLEGIATE & HIGHER SECONDARY (Crimson Red, Cap Toss, 3-Pillars) */}
      {/* =================================================================================== */}
      {activeTemplateId === 'template-3-unipix' && (
        <div className="space-y-12 animate-in fade-in duration-300">
          
          {/* Crimson Collegiate Hero with Cap Toss Photography */}
          <section
            className="relative bg-[#7A1C29] text-white py-24 px-4 text-center overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(122, 28, 41, 0.88), rgba(90, 18, 28, 0.94)), url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="relative max-w-4xl mx-auto space-y-6 z-10">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
                Knowledge Meets Innovation
              </span>

              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight">
                Unleashing Potential, <span className="text-yellow-300">Fostering Excellence</span>
              </h1>

              <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
                Transforming curious students into world-class scholars, leaders, and innovators ready for global impact.
              </p>

              <div className="flex justify-center gap-4 pt-3">
                <Link href="/admission">
                  <Button size="lg" variant="primary" className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold">
                    View Our Programs →
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Crimson Stats Bar */}
          <section className="max-w-5xl mx-auto px-4 -mt-6">
            <div className="bg-[#8B1E2E] text-white rounded-xl shadow-xl p-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-3xl font-display font-bold text-yellow-300 block font-mono">90%</span>
                <span className="text-xs text-white/80">Post-Graduation Success Rate</span>
              </div>
              <div className="border-x border-white/20">
                <span className="text-3xl font-display font-bold text-yellow-300 block font-mono">Top 10</span>
                <span className="text-xs text-white/80">Colleges That Create Futures</span>
              </div>
              <div>
                <span className="text-3xl font-display font-bold text-yellow-300 block font-mono">No. 1</span>
                <span className="text-xs text-white/80">In State for Academic R&D</span>
              </div>
            </div>
          </section>

          {/* Academics & Program 3-Column Pillar (Image 1 Style) */}
          <section className="max-w-6xl mx-auto px-4 space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">Academics & Program</h2>
              <p className="text-xs text-slate-500">Structured pathways supporting students at every phase of higher education.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 space-y-4">
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Undergraduate</h3>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="p-2 rounded bg-slate-50 dark:bg-slate-800 flex justify-between"><span>Pure Science Stream</span><span>→</span></li>
                  <li className="p-2 rounded bg-slate-50 dark:bg-slate-800 flex justify-between"><span>Commerce & Finance</span><span>→</span></li>
                  <li className="p-2 rounded bg-slate-50 dark:bg-slate-800 flex justify-between"><span>Humanities & Arts</span><span>→</span></li>
                </ul>
              </Card>

              {/* Center Highlighted Crimson Card */}
              <div className="p-6 rounded-2xl bg-[#7A1C29] text-white shadow-xl space-y-4 transform md:-translate-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400 text-slate-950 inline-block">Flagship</span>
                <h3 className="font-display font-bold text-2xl text-white">Graduate & Professional</h3>
                <ul className="space-y-2 text-xs text-white/90">
                  <li className="p-2 rounded bg-white/10 flex justify-between"><span>Advanced Mathematics</span><span>→</span></li>
                  <li className="p-2 rounded bg-white/10 flex justify-between"><span>Computer Applications</span><span>→</span></li>
                  <li className="p-2 rounded bg-white/10 flex justify-between"><span>Applied Bio-Sciences</span><span>→</span></li>
                </ul>
              </div>

              <Card className="p-6 space-y-4">
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Lifelong Learning</h3>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <li className="p-2 rounded bg-slate-50 dark:bg-slate-800 flex justify-between"><span>Diploma in Digital Arts</span><span>→</span></li>
                  <li className="p-2 rounded bg-slate-50 dark:bg-slate-800 flex justify-between"><span>Executive Leadership</span><span>→</span></li>
                  <li className="p-2 rounded bg-slate-50 dark:bg-slate-800 flex justify-between"><span>Language Certifications</span><span>→</span></li>
                </ul>
              </Card>
            </div>
          </section>

        </div>
      )}

      {/* =================================================================================== */}
      {/* TEMPLATE 4: NUOVA MODERN ARCHITECTURAL ACADEMY (Sage Green, Minimalist Curves, FAQ) */}
      {/* =================================================================================== */}
      {activeTemplateId === 'template-4-nuova' && (
        <div className="space-y-12 animate-in fade-in duration-300">
          
          {/* Sage Minimalist Hero */}
          <section className="max-w-7xl mx-auto px-4 grid md:grid-cols-12 gap-8 items-center pt-8">
            <div className="md:col-span-6 space-y-5">
              <span className="text-xs uppercase font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                Educate · Innovate · Lead
              </span>
              <h1 className="font-display font-bold text-4xl sm:text-5xl text-slate-900 dark:text-white leading-tight">
                Turn Your Ambition into <span className="italic text-emerald-700">Achievement</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Empowering students with world-class education, innovation, and global opportunities in an architectural sanctuary.
              </p>
              
              <div className="flex items-center gap-3 pt-2">
                <Link href="/admission">
                  <Button variant="primary" size="md" className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold">
                    Apply Now ↗
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="secondary" size="md">
                    Explore Campus
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white block">99%</span>
                  <span className="text-[11px] text-slate-500">Our Success Rate</span>
                </div>
                <div>
                  <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white block">30K</span>
                  <span className="text-[11px] text-slate-500">Total Enrolled Alumni</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1000&auto=format&fit=crop"
                alt="Clock tower modern campus"
                className="w-full h-96 object-cover"
              />
            </div>
          </section>

          {/* 3 Core Solution Cards (Image 2 Style) */}
          <section className="max-w-7xl mx-auto px-4 space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider">Why Choose Us</span>
              <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white">
                One of the Most Diverse Schools in the Region
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Inspiring Student Life', desc: 'Focusing on generating new knowledge, leadership, and emotional wellbeing.', icon: '💡' },
                { title: 'Education Affordability', desc: 'Merit-based scholarships and accessible fee structures for every family.', icon: '🎓' },
                { title: 'Core-Level Academics', desc: 'Rigorous CBSE syllabus with modern AI and robotics laboratory integration.', icon: '🔬' }
              ].map((card, i) => (
                <Card key={i} className="p-6 text-center space-y-3 hover:border-emerald-700 transition-all">
                  <span className="text-4xl block">{card.icon}</span>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{card.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{card.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Admissions FAQ Accordion */}
          <section className="max-w-4xl mx-auto px-4 space-y-4">
            <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white text-center">
              Frequently Asked Questions
            </h3>
            <div className="space-y-2">
              {[
                { q: 'What curriculum and boards does the school offer?', a: 'We offer the complete CBSE and State Board syllabus from Nursery to Class XII with specialized Science, Commerce, and Arts streams.' },
                { q: 'How can I apply for online admission?', a: 'Click the "Apply Online" button on top, fill in the student details, upload birth certificate/marksheets, and complete registration.' },
                { q: 'Are scholarships and fee concessions available?', a: 'Yes, we provide merit-based academic concessions and sibling discounts through our online fee desk.' }
              ].map((faq, idx) => (
                <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="w-4 h-4 text-emerald-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {/* Common Footer Features across All Templates */}
      <section className="max-w-7xl mx-auto px-4 pt-8 border-t border-[var(--border-default)]">
        <div className="bg-[var(--bg-elevated)] p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-bold text-base text-[var(--text-primary)]">
              Need to customize your school website design further?
            </h4>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Switch plans to unlock more templates, or use our visual builder in the School Admin Panel.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/plans">
              <Button variant="primary" size="sm">
                View All 15 Templates in Plans →
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
