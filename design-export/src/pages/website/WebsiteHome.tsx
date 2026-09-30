import React, { useState, useEffect } from 'react';
import { ArrowRight, Trophy, Newspaper } from 'lucide-react';
import { useInView } from '../../lib/hooks';

const slides = [
  { url: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1400&h=700&fit=crop&auto=format&q=80', alt: 'School campus' },
  { url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1400&h=700&fit=crop&auto=format&q=80', alt: 'Students in classroom' },
  { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1400&h=700&fit=crop&auto=format&q=80', alt: 'Science laboratory' },
];

const achievements = [
  { label: 'State Science Olympiad', detail: '1st Place 2024' },
  { label: 'CBSE Board Results',     detail: '98.2% Pass Rate' },
  { label: 'Zonal Football',         detail: 'Champions 2024' },
  { label: 'National Art Festival',  detail: '3 Gold Medals' },
  { label: 'Robotics Challenge',     detail: 'Runner-up 2024' },
];

const faculty = [
  { name: 'Dr. Meera Pillai',  subject: 'Principal',   img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format' },
  { name: 'Mr. Rajesh Nair',   subject: 'Mathematics', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format' },
  { name: 'Ms. Sunita Kapoor', subject: 'Science',     img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format' },
  { name: 'Mr. Arun Verma',    subject: 'English',     img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format' },
];

const notices = [
  { title: 'Annual Day Celebration — 25 January 2025', date: '18 Dec', category: 'Event'   },
  { title: 'Winter Vacation: Dec 22 – Jan 5',          date: '12 Dec', category: 'Holiday' },
  { title: 'Term 2 Fee Deadline: 31 December',         date: '10 Dec', category: 'Finance' },
];

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`${inView ? 'animate-fade-up' : 'opacity-0'} ${className}`}>
      {children}
    </div>
  );
}

export function WebsiteHome({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [slide, setSlide] = useState(0);
  const { ref: heroRef, inView: heroVisible } = useInView(0.05);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ height: 'min(85vh, 640px)' }}>
        {/* Background slides */}
        {slides.map((img, i) => (
          <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: slide === i ? 1 : 0 }}>
            <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
          </div>
        ))}
        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(15,31,24,0.88) 0%, rgba(22,58,43,0.68) 48%, rgba(31,77,58,0.18) 100%)' }} />
        {/* Grain */}
        <div className="absolute inset-0 grain" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 45% 45% at 25% 55%, rgba(227,238,232,0.12) 0%, transparent 70%)' }} />

        {/* Content */}
        <div ref={heroRef} className="relative z-10 h-full flex flex-col justify-center px-6 max-w-7xl mx-auto">
          <div className={`stagger ${heroVisible ? '' : 'opacity-0'}`}>
            <p className="text-[12px] font-semibold text-white/70 uppercase tracking-[0.2em] mb-5">Established 1982 · CBSE affiliated</p>
            <h1 className="font-display font-semibold text-[40px] md:text-[48px] leading-[56px] text-white mb-5 max-w-2xl">
              Delhi Public School
            </h1>
            <p className="text-base text-white/80 max-w-xl mb-8 leading-[26px]">
              Providing rigorous academic education and principled student development since 1982.
            </p>
            <div className="flex gap-5 items-center">
              <button onClick={() => onNavigate('About')}
                className="h-11 px-6 rounded-[6px] bg-white text-[#1F4D3A] font-medium text-[14px] hover:bg-[#E3EAE6] transition-colors flex items-center gap-2">
                About the school <ArrowRight className="w-4 h-4" strokeWidth={1.5}/>
              </button>
              <button onClick={() => onNavigate('Notices')}
                className="h-11 text-white font-medium text-[14px] underline-offset-4 hover:underline">
                View Notice Board
              </button>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)}
              className={`transition-all rounded-[1px] h-0.5 ${i === slide ? 'w-8 bg-white' : 'w-8 bg-white/30'}`} />
          ))}
        </div>
      </section>

      {/* Achievements ticker */}
      <section className="bg-surface border-y border-border-default">
        <div className="max-w-7xl mx-auto px-6 py-4 overflow-x-auto">
          <div className="grid grid-cols-5 min-w-[900px]">
            {achievements.map((a, index) => (
              <div key={a.label} className={`flex items-center gap-3 px-6 ${index ? 'border-l border-border-default' : ''}`}>
                <Trophy className="w-4 h-4 text-brand shrink-0" strokeWidth={1.5}/>
                <div>
                  <p className="text-[13px] font-semibold text-fg">{a.label}</p>
                  <p className="text-[11px] text-brand font-semibold">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty preview */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <RevealSection>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-2">Academic leadership</p>
              <h2 className="font-display font-semibold text-[24px] leading-[32px] text-fg">Faculty</h2>
            </div>
            <button onClick={() => onNavigate('Faculty')} className="text-[13px] text-brand font-semibold hover:opacity-80 flex items-center gap-1.5">
              View all <ArrowRight className="w-4 h-4" strokeWidth={1.5}/>
            </button>
          </div>
        </RevealSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
          {faculty.map((f) => (
            <div key={f.name} className="bg-surface border border-border-default rounded-[8px] p-5 flex flex-col items-center text-center card-hover cursor-pointer animate-fade-up">
              <img src={f.img} alt={f.name} className="w-16 h-16 rounded-full object-cover mb-3 bg-elevated" />
              <p className="text-[13px] font-semibold text-fg">{f.name}</p>
              <p className="text-[12px] text-brand font-semibold mt-0.5">{f.subject}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Notices */}
      <section className="bg-surface border-t border-border-default">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <RevealSection>
            <div className="flex items-end justify-between mb-7">
              <div>
                <p className="text-[11px] font-semibold text-fg-muted uppercase tracking-widest mb-2">Official communication</p>
                <h2 className="font-display font-semibold text-[24px] leading-[32px] text-fg">Notice Board</h2>
              </div>
              <button onClick={() => onNavigate('Notices')} className="text-[13px] text-brand font-semibold hover:opacity-80 flex items-center gap-1.5">
                All notices <ArrowRight className="w-4 h-4" strokeWidth={1.5}/>
              </button>
            </div>
          </RevealSection>
          <div className="grid md:grid-cols-3 gap-4">
            {notices.map((n) => (
              <div key={n.title} className="bg-base border border-border-default rounded-[8px] p-5 card-hover cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-brand/12 text-brand">{n.category}</span>
                  <span className="text-[11px] text-fg-muted tabular-nums">{n.date}</span>
                </div>
                <p className="text-[13px] font-semibold text-fg leading-snug">{n.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger">
          {[
            { value: '1,840', label: 'Students Enrolled' },
            { value: '98.2%', label: 'Board Pass Rate' },
            { value: '120+',  label: 'Faculty Members' },
            { value: '42 yr', label: 'Years of Excellence' },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-border-default rounded-[8px] p-6 text-center animate-fade-up">
              <p className="font-display font-bold text-[36px] text-brand tabular-nums leading-none mb-2">{s.value}</p>
              <p className="text-[13px] text-fg-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
